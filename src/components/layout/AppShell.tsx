import { NavLink, Outlet } from 'react-router-dom'
import { useProfile } from '@/features/profile/hooks'
import { useSignOut } from '@/features/auth/hooks'
import { NotificationsBell } from '@/features/notifications/NotificationsBell'

const tutorLinks = [
  { to: '/agenda', label: 'Agenda' },
  { to: '/disponibilita', label: 'Disponibilità' },
  { to: '/studenti', label: 'I miei studenti' },
  { to: '/impostazioni', label: 'Impostazioni' },
]

const studentLinks = [
  { to: '/cerca-tutor', label: 'Cerca tutor' },
  { to: '/le-mie-lezioni', label: 'Le mie lezioni' },
  { to: '/impostazioni', label: 'Impostazioni' },
]

export function AppShell() {
  const { data: profile } = useProfile()
  const signOut = useSignOut()
  const links = profile?.role === 'tutor' ? tutorLinks : studentLinks

  return (
    <div className="min-h-screen bg-canvas">
      <header className="sticky top-0 z-30 border-b border-black/[0.06] bg-white/70 backdrop-blur-xl backdrop-saturate-150">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <span className="text-[17px] font-semibold tracking-tight text-ink">RipetiMy</span>
          <nav className="flex items-center gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-full px-3.5 py-1.5 text-[14px] font-medium transition-colors ${
                    isActive ? 'bg-black/[0.06] text-ink' : 'text-ink-soft hover:text-ink'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <NotificationsBell />
            <button
              onClick={() => signOut.mutate()}
              className="ml-1 rounded-full px-3.5 py-1.5 text-[14px] font-medium text-ink-soft transition-colors hover:text-ink"
            >
              Esci
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
