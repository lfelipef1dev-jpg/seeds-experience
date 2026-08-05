'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import {
  LayoutDashboard,
  Users,
  Calendar,
  Handshake,
  ClipboardList,
  Sparkles,
  Settings,
  LogOut,
  Shield,
  Leaf,
  Store,
  MessageSquare,
  Bot,
  Trophy,
  Bell,
  UsersRound,
  ShoppingBag,
  Briefcase,
  Building2,
  Mic,
  Gift,
  Menu,
} from 'lucide-react'

const items = [
  { href: '/app', icon: LayoutDashboard, label: 'Início' },
  { href: '/app/diretorio', icon: Users, label: 'Diretório' },
  { href: '/app/eventos', icon: Calendar, label: 'Eventos' },
  { href: '/app/conexoes', icon: Handshake, label: 'Conexões' },
  { href: '/app/colaboracoes', icon: ClipboardList, label: 'Colaborações' },
  { href: '/app/feed', icon: MessageSquare, label: 'Feed' },
  { href: '/app/mural', icon: Trophy, label: 'Mural' },
  { href: '/app/grupos', icon: UsersRound, label: 'Grupos' },
  { href: '/app/notificacoes', icon: Bell, label: 'Notificações' },
  { href: '/app/historico', icon: Building2, label: 'Edições' },
  { href: '/app/palestrantes', icon: Mic, label: 'Palestrantes' },
  { href: '/app/indicacoes', icon: Gift, label: 'Indique' },
  { href: '/app/produtos', icon: ShoppingBag, label: 'Produtos' },
  { href: '/app/vagas', icon: Briefcase, label: 'Vagas' },
  { href: '/app/ia', icon: Bot, label: 'Assistente IA' },
  { href: '/app/match', icon: Sparkles, label: 'Match IA' },
  { href: '/app/parceiros', icon: Store, label: 'Parceiros' },
  { href: '/app/perfil', icon: Settings, label: 'Perfil' },
]

export function Sidebar({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const nav = (
    <nav className="flex-1 p-3 space-y-1 overflow-auto">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setOpen(false)}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
            pathname && (pathname === item.href || pathname.startsWith(`${item.href}/`))
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </Link>
      ))}

      {isAdmin && (
        <>
          <div className="my-2 border-t" />
          <Link
            href="/admin"
            onClick={() => setOpen(false)}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              pathname?.startsWith('/admin')
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <Shield className="h-4 w-4" />
            Admin
          </Link>
        </>
      )}
    </nav>
  )

  const logout = (
    <div className="p-3 border-t">
      <Button
        variant="ghost"
        className="w-full justify-start text-muted-foreground"
        onClick={signOut}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Sair
      </Button>
    </div>
  )

  const brand = (
    <div className="p-4 flex items-center gap-2 border-b">
      <Leaf className="h-6 w-6 text-primary" />
      <span className="font-semibold text-lg tracking-tight">SEEDS</span>
    </div>
  )

  return (
    <>
      <aside className="hidden lg:flex flex-col w-64 border-r bg-card h-[calc(100vh-4rem)] sticky top-16">
        {brand}
        {nav}
        {logout}
      </aside>

      <div className="lg:hidden fixed top-3 left-3 z-50">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="inline-flex items-center justify-center rounded-md border border-input bg-background p-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 flex flex-col">
            <SheetHeader className="p-4 border-b">
              <SheetTitle className="flex items-center gap-2 text-lg font-semibold tracking-tight">
                <Leaf className="h-6 w-6 text-primary" />
                SEEDS
              </SheetTitle>
            </SheetHeader>
            {nav}
            {logout}
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
