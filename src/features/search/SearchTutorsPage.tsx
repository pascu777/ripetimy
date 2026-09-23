import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSearchTutors } from './hooks'
import { Card, Input, Label } from '@/components/ui'

export function SearchTutorsPage() {
  const [subject, setSubject] = useState('')
  const [query, setQuery] = useState('')
  const [submittedSubject, setSubmittedSubject] = useState('')
  const [submittedQuery, setSubmittedQuery] = useState('')
  const tutorsQuery = useSearchTutors(submittedSubject, submittedQuery)

  return (
    <div>
      <h1 className="mb-6 text-[26px] font-semibold tracking-tight text-ink">Cerca un tutor</h1>
      <Card className="mb-6">
        <form
          className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:items-end"
          onSubmit={(e) => {
            e.preventDefault()
            setSubmittedSubject(subject)
            setSubmittedQuery(query)
          }}
        >
          <div>
            <Label htmlFor="subject">Materia</Label>
            <Input id="subject" placeholder="es. Matematica" value={subject} onChange={(e) => setSubject(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="query">Nome tutor</Label>
            <Input id="query" placeholder="opzionale" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            Cerca
          </button>
        </form>
      </Card>

      {tutorsQuery.isLoading && <p className="text-sm text-ink-soft">Ricerca in corso…</p>}
      {tutorsQuery.data && tutorsQuery.data.length === 0 && (
        <p className="text-sm text-ink-soft">Nessun tutor trovato con questi criteri.</p>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {tutorsQuery.data?.map((tutor) => (
          <Link key={tutor.id} to={`/tutor/${tutor.id}`}>
            <Card className="transition hover:border-brand-300 hover:shadow-md">
              <h3 className="font-semibold text-ink">{tutor.full_name}</h3>
              {tutor.subjects.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {tutor.subjects.map((s) => (
                    <span key={s} className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
