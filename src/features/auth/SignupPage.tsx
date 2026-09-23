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
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 text-center">
        <h1 className="mb-2 text-2xl font-semibold text-slate-900">Controlla la tua email</h1>
        <p className="text-slate-600">
          Ti abbiamo inviato un link di conferma. Dopo aver confermato, torna qui per{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:underline">accedere</Link>.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
      <h1 className="mb-6 text-center text-2xl font-semibold text-slate-900">Crea il tuo account RipetiMy</h1>
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
                className={`rounded-lg border px-3 py-2 text-sm font-medium ${role === 'tutor' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-300 text-slate-600'}`}
              >
                Sono un tutor
              </button>
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`rounded-lg border px-3 py-2 text-sm font-medium ${role === 'student' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-300 text-slate-600'}`}
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
      <p className="mt-4 text-center text-sm text-slate-600">
        Hai già un account?{' '}
        <button onClick={() => navigate('/login')} className="font-medium text-indigo-600 hover:underline">
          Accedi
        </button>
      </p>
    </div>
  )
}
