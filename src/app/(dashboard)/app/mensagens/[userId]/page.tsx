'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { sendMessage } from '@/lib/actions/messages'

export default function ChatPage() {
  const { userId } = useParams() as { userId: string }
  const [messages, setMessages] = useState<any[]>([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  const roomId = [currentUser?.id, userId].sort().join('__')

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (cancelled) return
      setCurrentUser(user)
      if (!user) return

      const sorted = [user.id, userId].sort().join('__')
      const { data } = await supabase
        .from('messages')
        .select('*, profiles:user_id (id, name, photo_url, color)')
        .eq('room_id', sorted)
        .order('created_at', { ascending: true })

      if (cancelled) return
      setMessages(data || [])
    }

    load()
    return () => {
      cancelled = true
    }
  }, [userId])

  const fetchMessages = useCallback(async () => {
    if (!currentUser) return

    const sorted = [currentUser.id, userId].sort().join('__')
    const { data } = await createClient()
      .from('messages')
      .select('*, profiles:user_id (id, name, photo_url, color)')
      .eq('room_id', sorted)
      .order('created_at', { ascending: true })

    setMessages(data || [])
  }, [currentUser, userId])

  useEffect(() => {
    if (!currentUser) return

    const supabase = createClient()
    const sorted = [currentUser.id, userId].sort().join('__')

    const channel = supabase
      .channel(`room:${sorted}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_id=eq.${sorted}` },
        (payload: any) => {
          setMessages((prev) => [...prev, payload.new])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentUser, userId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    setLoading(true)

    const formData = new FormData()
    formData.append('receiver_id', userId)
    formData.append('content', content)
    await sendMessage(formData)

    setContent('')
    setLoading(false)
    fetchMessages()
  }

  return (
    <div className="space-y-4 h-[calc(100vh-8rem)] flex flex-col">
      <h1 className="text-2xl font-semibold tracking-tight">Mensagens</h1>

      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg: any) => {
            const isMe = msg.user_id === currentUser?.id
            return (
              <div key={msg.id} className={`flex gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                {!isMe && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={msg.profiles?.photo_url} />
                    <AvatarFallback style={{ backgroundColor: msg.profiles?.color }} className="text-white text-xs">
                      {msg.profiles?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-2xl px-4 py-2 text-sm max-w-[70%] ${
                    isMe ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            )
          })}
        </CardContent>
        <CardContent className="border-t p-3">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="flex-1"
            />
            <Button type="submit" disabled={loading}>
              Enviar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
