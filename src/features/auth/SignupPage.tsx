import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSignUp, type Role } from './hooks'
import { Button, Card, ErrorText, Input, Label } from '@/components/ui'

export function SignupPage() {
  const [role, setRole] = useState<Role>('student')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [done, setDone] = useState(false)
  const signUp = useSignUp()
  const navigate = useNavigate()

  if (done) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center bg-canvas px-4 text-center">
        <h1 className="mb-2 text-[28px] font-semibold tracking-tight text-ink">Controlla la tua email</h1>
        <p className="text-[15px] text-ink-soft">
          Ti abbiamo inviato un link di conferma. Dopo aver confermato, torna qui per{' '}
          <Link to="/login" className="font-medium text-brand-600 hover:underline">accedere</Link>.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center bg-canvas px-4">
      <h1 className="mb-8 text-center text-[28px] font-semibold tracking-tight text-ink">Crea il tuo account RipetiMy</h1>
      <Card>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            signUp.mutate(
              { email, password, fullName, role },
              {
                onSuccess: () => setDone(true),
              },
            )
          }}
        >
          <div>
            <Label>Sei un tutor o uno studente?</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('tutor')}
                className={`rounded-xl border px-3 py-2.5 text-[14px] font-medium transition-colors ${role === 'tutor' ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-black/10 text-ink-soft hover:bg-black/[0.03]'}`}
              >
                Sono un tutor
              </button>
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`rounded-xl border px-3 py-2.5 text-[14px] font-medium transition-colors ${role === 'student' ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-black/10 text-ink-soft hover:bg-black/[0.03]'}`}
              >
                Sono uno studente
              </button>
            </div>
          </div>
          <div>
            <Label htmlFor="fullName">Nome e cognome</Label>
            <Input id="fullName" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <ErrorText>{signUp.isError ? 'Registrazione non riuscita. Riprova.' : null}</ErrorText>
          <Button type="submit" className="w-full" disabled={signUp.isPending}>
            {signUp.isPending ? 'Creazione account…' : 'Registrati'}
          </Button>
        </form>
      </Card>
      <p className="mt-5 text-center text-[14px] text-ink-soft">
        Hai già un account?{' '}
        <button onClick={() => navigate('/login')} className="font-medium text-brand-600 hover:underline">
          Accedi
        </button>
      </p>
    </div>
  )
}
