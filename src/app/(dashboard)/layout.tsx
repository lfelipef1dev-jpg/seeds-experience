import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/dashboard/sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, name, is_admin, photo_url')
    .eq('user_id', user.id)
    .single()

  if (!profile) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-full">
      <Sidebar isAdmin={profile.is_admin} />
      <main className="flex-1 p-4 lg:p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
