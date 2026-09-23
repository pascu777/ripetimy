import { Navigate, Outlet } from 'react-router-dom'
import { useSession } from '@/features/auth/session-provider'
import { useProfile } from '@/features/profile/hooks'
import type { Role } from '@/features/auth/hooks'

function FullScreenLoader() {
  return <div className="flex min-h-screen items-center justify-center text-slate-500">Caricamento…</div>
}

export function ProtectedRoute({ requireRole }: { requireRole?: Role }) {
  const { session, initializing } = useSession()
  const profileQuery = useProfile()

  if (initializing || (session && profileQuery.isLoading)) return <FullScreenLoader />
  if (!session) return <Navigate to="/login" replace />

  const profile = profileQuery.data
  if (requireRole && profile && profile.role !== requireRole) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
