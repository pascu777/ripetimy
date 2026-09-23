import { NavLink, Outlet } from 'react-router-dom'
import { useProfile } from '@/features/profile/hooks'
import { useSignOut } from '@/features/auth/hooks'

const tutorLinks = [
  { to: '/agenda', label: 'Agenda' },
  { to: '/disponibilita', label: 'Disponibilità' },
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
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <span className="text-lg font-semibold text-indigo-700">RipetiMy</span>
          <nav className="flex items-center gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <button
              onClick={() => signOut.mutate()}
              className="ml-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100"
            >
              Esci
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
