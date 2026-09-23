import { useState } from 'react'
import { useProfile, useUpdateProfile } from './hooks'
import { useSession } from '@/features/auth/session-provider'
import { Button, Card, Input, Label } from '@/components/ui'

const SUBSCRIPTION_LABELS: Record<string, string> = {
  active: 'Beta gratuita',
  trialing: 'Periodo di prova',
  past_due: 'Pagamento in ritardo',
  canceled: 'Annullato',
  inactive: 'Non attivo',
}

export function SettingsPage() {
  const { session } = useSession()
  const profileQuery = useProfile()
  const updateProfile = useUpdateProfile()
  const [fullName, setFullName] = useState('')
  const [newSubject, setNewSubject] = useState('')
  const [editingName, setEditingName] = useState(false)

  const profile = profileQuery.data

  if (!profile) return <p className="text-sm text-ink-soft">Caricamento…</p>

  const subjects = profile.subjects ?? []

  function addSubject() {
    const value = newSubject.trim()
    if (!value || subjects.includes(value)) return
    updateProfile.mutate({ subjects: [...subjects, value] })
    setNewSubject('')
  }

  function removeSubject(subject: string) {
    updateProfile.mutate({ subjects: subjects.filter((s) => s !== subject) })
  }

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-[26px] font-semibold tracking-tight text-ink">Impostazioni</h1>

      <Card>
        <h2 className="mb-4 text-[17px] font-semibold tracking-tight text-ink">Profilo</h2>
        <div className="space-y-3">
          <div>
            <Label>Email</Label>
            <p className="text-sm text-ink-soft">{session?.user.email}</p>
          </div>
          <div>
            <Label htmlFor="fullName">Nome e cognome</Label>
            {editingName ? (
              <div className="flex gap-2">
                <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                <Button
                  onClick={() => {
                    updateProfile.mutate({ full_name: fullName }, { onSuccess: () => setEditingName(false) })
                  }}
                >
                  Salva
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <p className="text-sm text-ink-soft">{profile.full_name || '—'}</p>
                <button
                  className="text-sm font-medium text-brand-600 hover:underline"
                  onClick={() => {
                    setFullName(profile.full_name)
                    setEditingName(true)
                  }}
                >
                  Modifica
                </button>
              </div>
            )}
          </div>
          <div>
            <Label>Ruolo</Label>
            <p className="text-sm text-ink-soft">{profile.role === 'tutor' ? 'Tutor' : 'Studente'}</p>
          </div>
          {profile.role === 'tutor' && (
            <div>
              <Label>Abbonamento</Label>
              <p className="text-sm text-ink-soft">{SUBSCRIPTION_LABELS[profile.subscription_status] ?? profile.subscription_status}</p>
            </div>
          )}
        </div>
      </Card>

      {profile.role === 'tutor' && (
        <Card>
          <h2 className="mb-4 text-[17px] font-semibold tracking-tight text-ink">Materie insegnate</h2>
          <div className="mb-4 flex flex-wrap gap-2">
            {subjects.length === 0 && <p className="text-sm text-ink-soft">Nessuna materia impostata.</p>}
            {subjects.map((s) => (
              <span
                key={s}
                className="flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700"
              >
                {s}
                <button onClick={() => removeSubject(s)} className="text-brand-500/60 hover:text-brand-700" aria-label={`Rimuovi ${s}`}>
                  ✕
                </button>
              </span>
            ))}
          </div>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              addSubject()
            }}
          >
            <Input placeholder="es. Matematica" value={newSubject} onChange={(e) => setNewSubject(e.target.value)} />
            <Button type="submit">Aggiungi</Button>
          </form>
        </Card>
      )}
    </div>
  )
}
