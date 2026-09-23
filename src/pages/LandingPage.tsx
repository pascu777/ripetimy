import { Link } from 'react-router-dom'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5">
        <span className="text-lg font-semibold text-indigo-700">RipetiMy</span>
        <div className="flex gap-2">
          <Link to="/login" className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
            Accedi
          </Link>
          <Link to="/registrati" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            Registrati
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          L'agenda delle ripetizioni, semplificata.
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          RipetiMy aiuta i tutor privati a gestire disponibilità e lezioni senza scambi infiniti di messaggi: gli
          studenti vedono gli orari liberi e prenotano da soli, tu vedi tutto in un'unica agenda.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            to="/registrati"
            className="rounded-lg bg-indigo-600 px-6 py-3 text-base font-medium text-white hover:bg-indigo-700"
          >
            Crea il tuo account
          </Link>
        </div>
        <p className="mt-3 text-sm text-slate-500">Abbonamento in arrivo — accesso gratuito durante la beta.</p>
      </section>

      <section className="mx-auto grid max-w-4xl grid-cols-1 gap-6 px-4 pb-20 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 p-6">
          <h2 className="mb-2 text-lg font-semibold text-slate-900">Per i tutor</h2>
          <p className="text-sm text-slate-600">
            Imposta le tue fasce orarie disponibili una sola volta. Le lezioni prenotate dagli studenti finiscono
            automaticamente in agenda, senza doppie prenotazioni.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 p-6">
          <h2 className="mb-2 text-lg font-semibold text-slate-900">Per gli studenti</h2>
          <p className="text-sm text-slate-600">
            Cerca un tutor per materia, guarda gli orari liberi e prenota la tua lezione in un attimo, senza
            aspettare una risposta.
          </p>
        </div>
      </section>
    </div>
  )
}
