import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useSignIn } from './hooks'
import { useSession } from './session-provider'
import { Button, Card, ErrorText, Input, Label } from '@/components/ui'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const signIn = useSignIn()
  const navigate = useNavigate()
  const { session, initializing } = useSession()

  if (!initializing && session) return <Navigate to="/dashboard" replace />

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center bg-canvas px-4">
      <h1 className="mb-8 text-center text-[28px] font-semibold tracking-tight text-ink">Accedi a RipetiMy</h1>
      <Card>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            signIn.mutate({ email, password }, { onSuccess: () => navigate('/dashboard') })
          }}
        >
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <ErrorText>{signIn.isError ? "Email o password non corrette." : null}</ErrorText>
          <Button type="submit" className="w-full" disabled={signIn.isPending}>
            {signIn.isPending ? 'Accesso in corso…' : 'Accedi'}
          </Button>
        </form>
      </Card>
      <p className="mt-5 text-center text-[14px] text-ink-soft">
        Non hai un account? <Link to="/registrati" className="font-medium text-brand-600 hover:underline">Registrati</Link>
      </p>
    </div>
  )
}
