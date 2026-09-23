import { Link } from 'react-router-dom'

export function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-canvas">
      <header className="sticky top-0 z-30 border-b border-black/[0.06] bg-white/70 backdrop-blur-xl backdrop-saturate-150">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <span className="text-[17px] font-semibold tracking-tight text-ink">RipetiMy</span>
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="rounded-full px-4 py-2 text-[14px] font-medium text-ink-soft transition-colors hover:text-ink"
            >
              Accedi
            </Link>
            <Link
              to="/registrati"
              className="rounded-full bg-ink px-4 py-2 text-[14px] font-medium text-white shadow-sm transition-all hover:bg-black hover:shadow-md active:scale-[0.97]"
            >
              Registrati
            </Link>
          </div>
        </div>
      </header>

      <section className="relative">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[640px]"
          style={{
            background:
              'radial-gradient(60% 50% at 50% 0%, rgba(10,132,255,0.12) 0%, rgba(10,132,255,0) 70%)',
          }}
        />
        <div className="mx-auto max-w-3xl px-6 pb-24 pt-28 text-center sm:pt-36">
          <h1 className="text-[44px] font-semibold leading-[1.05] tracking-tight text-ink sm:text-[64px]">
            L'agenda delle ripetizioni,
            <br />
            semplificata.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-[19px] leading-relaxed text-ink-soft">
            RipetiMy aiuta i tutor privati a gestire disponibilità e lezioni senza scambi infiniti di messaggi.
            Gli studenti vedono gli orari liberi e prenotano da soli, tu vedi tutto in un'unica agenda.
          </p>
          <div className="mt-10 flex justify-center gap-3">
            <Link
              to="/registrati"
              className="rounded-full bg-ink px-7 py-3.5 text-[16px] font-medium text-white shadow-md transition-all hover:bg-black hover:shadow-lg active:scale-[0.97]"
            >
              Crea il tuo account
            </Link>
          </div>
          <p className="mt-4 text-[13px] text-ink-soft/80">Abbonamento in arrivo — accesso gratuito durante la beta.</p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-28">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="rounded-3xl border border-black/[0.06] bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.08)]">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-[20px]">
              📅
            </div>
            <h2 className="mb-2 text-[19px] font-semibold tracking-tight text-ink">Per i tutor</h2>
            <p className="text-[15px] leading-relaxed text-ink-soft">
              Imposta le tue fasce orarie disponibili una sola volta. Le lezioni prenotate dagli studenti finiscono
              automaticamente in agenda, senza doppie prenotazioni.
            </p>
          </div>
          <div className="rounded-3xl border border-black/[0.06] bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.08)]">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-[20px]">
              🔍
            </div>
            <h2 className="mb-2 text-[19px] font-semibold tracking-tight text-ink">Per gli studenti</h2>
            <p className="text-[15px] leading-relaxed text-ink-soft">
              Cerca un tutor per materia, guarda gli orari liberi e prenota la tua lezione in un attimo, senza
              aspettare una risposta.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
