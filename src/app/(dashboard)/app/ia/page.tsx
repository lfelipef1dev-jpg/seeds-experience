'use client'

import { useState } from 'react'
import { askChatbot } from '@/lib/actions/ai'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export default function AIPage() {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([])
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!question.trim()) return

    setMessages((prev) => [...prev, { role: 'user', text: question }])
    setLoading(true)

    const formData = new FormData()
    formData.append('question', question)
    const result = await askChatbot(formData)

    setLoading(false)
    setQuestion('')

    if (result.error) {
      toast.error(result.error)
      return
    }

    setMessages((prev) => [...prev, { role: 'assistant', text: result.response || '...' }])
  }

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Assistente SEEDS</h1>
        <p className="text-muted-foreground">Pergunte sobre a comunidade, conexões e eventos.</p>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardHeader>
          <CardTitle>Chat</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto space-y-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                m.role === 'user'
                  ? 'ml-auto bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground'
              }`}
            >
              {m.text}
            </div>
          ))}
        </CardContent>
        <CardContent className="border-t pt-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Digite sua pergunta..."
              className="flex-1"
            />
            <Button type="submit" disabled={loading}>
              {loading ? '...' : 'Enviar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
