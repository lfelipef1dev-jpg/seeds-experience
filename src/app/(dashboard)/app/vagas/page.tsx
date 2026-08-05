import { getJobs } from '@/lib/data/queries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { createJob } from '@/lib/actions/jobs'
import { sectors } from '@/lib/db/schema'

export default async function JobsPage() {
  const jobs = await getJobs()

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Oportunidades</h1>
        <p className="text-muted-foreground">Vagas, freelas e oportunidades da comunidade.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Publicar vaga</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createJob} className="space-y-3">
            <Input name="title" placeholder="Título da vaga" required />
            <Textarea name="description" placeholder="Descrição da vaga" required />
            <Textarea name="requirements" placeholder="Requisitos" />
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="sector">Setor</Label>
                <select
                  id="sector"
                  name="sector"
                  defaultValue=""
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                >
                  <option value="" disabled>Selecione</option>
                  {sectors.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Localização</Label>
                <Input id="location" name="location" placeholder="Cidade ou remoto" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <select
                  id="type"
                  name="type"
                  defaultValue=""
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                >
                  <option value="" disabled>Selecione</option>
                  {['clt', 'pj', 'freela', 'estagio', 'outro'].map((t) => (
                    <option key={t} value={t}>{t.toUpperCase()}</option>
                  ))}
                </select>
              </div>
            </div>
            <Button type="submit">Publicar vaga</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {jobs.map((job: any) => (
          <Card key={job.id}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={job.profiles?.photo_url || undefined} />
                    <AvatarFallback style={{ backgroundColor: job.profiles?.color }} className="text-white">
                      {job.profiles?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{job.profiles?.name}</p>
                    <p className="text-sm text-muted-foreground">{job.profiles?.business}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {job.type && <Badge variant="outline">{job.type}</Badge>}
                  {job.sector && <Badge variant="secondary">{job.sector}</Badge>}
                  {job.location && <Badge variant="outline">{job.location}</Badge>}
                </div>
              </div>

              <h3 className="font-semibold">{job.title}</h3>
              <p className="text-sm text-muted-foreground">{job.description}</p>
              {job.requirements && (
                <div>
                  <p className="text-sm font-medium">Requisitos</p>
                  <p className="text-sm text-muted-foreground">{job.requirements}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {jobs.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Nenhuma vaga publicada ainda.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
