import { useState } from 'react'
import type { Lesson } from './hooks'
import { Button, ErrorText, Input, Label, Select, Textarea } from '@/components/ui'

const DURATIONS = [30, 45, 60, 90, 120]

function toLocalInputValue(iso: string) {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export type LessonFormValues = {
  studentName: string
  subject: string
  startsAt: string
  durationMinutes: number
  notes: string
}

export function LessonForm({
  initial,
  onSubmit,
  onDelete,
  submitting,
  error,
}: {
  initial?: Lesson
  onSubmit: (values: LessonFormValues) => void
  onDelete?: () => void
  submitting?: boolean
  error?: string | null
}) {
  const [studentName, setStudentName] = useState(initial?.student_name ?? '')
  const [subject, setSubject] = useState(initial?.subject ?? '')
  const [startsAt, setStartsAt] = useState(initial ? toLocalInputValue(initial.starts_at) : '')
  const [durationMinutes, setDurationMinutes] = useState(initial?.duration_minutes ?? 60)
  const [notes, setNotes] = useState(initial?.notes ?? '')
  const readOnlyStudent = initial?.source === 'booking'

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit({ studentName, subject, startsAt: new Date(startsAt).toISOString(), durationMinutes, notes })
      }}
    >
      <div>
        <Label htmlFor="studentName">Nome studente</Label>
        <Input
          id="studentName"
          required
          disabled={readOnlyStudent}
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
        />
        {readOnlyStudent && <p className="mt-1 text-xs text-ink-soft">Lezione prenotata dallo studente.</p>}
      </div>
      <div>
        <Label htmlFor="subject">Materia (opzionale)</Label>
        <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startsAt">Data e ora</Label>
          <input
            id="startsAt"
            type="datetime-local"
            required
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
            className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
        </div>
        <div>
          <Label htmlFor="duration">Durata</Label>
          <Select id="duration" value={durationMinutes} onChange={(e) => setDurationMinutes(Number(e.target.value))}>
            {DURATIONS.map((d) => (
              <option key={d} value={d}>
                {d} min
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="notes">Note (opzionale)</Label>
        <Textarea id="notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
      <ErrorText>{error}</ErrorText>
      <div className="flex items-center justify-between pt-2">
        {onDelete ? (
          <Button type="button" variant="danger" onClick={onDelete}>
            {initial?.source === 'booking' ? 'Annulla lezione' : 'Elimina'}
          </Button>
        ) : (
          <span />
        )}
        <Button type="submit" disabled={submitting}>
          {initial ? 'Salva modifiche' : 'Crea lezione'}
        </Button>
      </div>
    </form>
  )
}
