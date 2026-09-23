import { Navigate } from 'react-router-dom'
import { useProfile } from '@/features/profile/hooks'

export function RoleGate() {
  const { data: profile, isLoading } = useProfile()

  if (isLoading) return <div className="flex min-h-screen items-center justify-center text-slate-500">Caricamento…</div>
  if (!profile) return <Navigate to="/login" replace />

  return <Navigate to={profile.role === 'tutor' ? '/agenda' : '/cerca-tutor'} replace />
}
