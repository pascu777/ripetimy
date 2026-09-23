import { useMemo, useState } from 'react'
import { useTutorAvailability, useTutorBusyWindows, useCreateBooking } from './hooks'
import { expandAvailability } from '@/lib/expandAvailability'
import { DAY_LABELS } from '@/lib/days'
import { Button, Card, ErrorText, Input, Label, Select, Textarea } from '@/components/ui'

const DURATIONS = [30, 45, 60, 90, 120]
const RANGE_DAYS = 21

export function BookingSlotPicker({ tutorId }: { tutorId: string }) {
  const [durationMinutes, setDurationMinutes] = useState(60)
  const [selected, setSelected] = useState<Date | null>(null)
  const [subject, setSubject] = useState('')
  const [notes, setNotes] = useState('')
  const [confirmError, setConfirmError] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  const from = useMemo(() => new Date(), [])
  const to = useMemo(() => {
    const d = new Date(from)
    d.setDate(d.getDate() + RANGE_DAYS)
    return d
  }, [from])

  const availabilityQuery = useTutorAvailability(tutorId)
  const busyQuery = useTutorBusyWindows(tutorId, from, to)
  const createBooking = useCreateBooking()

  const slots = useMemo(() => {
    if (!availabilityQuery.data || !busyQuery.data) return []
    return expandAvailability({
      availability: availabilityQuery.data,
      busy: busyQuery.data,
      from,
      to,
      durationMinutes,
    })
  }, [availabilityQuery.data, busyQuery.data, from, to, durationMinutes])

  const grouped = useMemo(() => {
    const map = new Map<string, Date[]>()
    for (const slot of slots) {
      const key = slot.toDateString()
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(slot)
    }
    return Array.from(map.entries())
  }, [slots])

  if (confirmed) {
    return (
      <Card>
        <h2 className="mb-1 text-[17px] font-semibold tracking-tight text-ink">Prenotazione confermata</h2>
        <p className="text-sm text-ink-soft">Trovi la lezione in "Le mie lezioni".</p>
      </Card>
    )
  }

  return (
    <Card>
      <h2 className="mb-4 text-[17px] font-semibold tracking-tight text-ink">Prenota una lezione</h2>

      <div className="mb-4">
        <Label htmlFor="duration">Durata</Label>
        <Select
          id="duration"
          value={durationMinutes}
          onChange={(e) => {
            setDurationMinutes(Number(e.target.value))
            setSelected(null)
          }}
        >
          {DURATIONS.map((d) => (
            <option key={d} value={d}>
              {d} min
            </option>
          ))}
        </Select>
      </div>

      {(availabilityQuery.isLoading || busyQuery.isLoading) && <p className="text-sm text-ink-soft">Caricamento slot…</p>}
      {!availabilityQuery.isLoading && !busyQuery.isLoading && slots.length === 0 && (
        <p className="text-sm text-ink-soft">Nessuno slot libero nei prossimi {RANGE_DAYS} giorni per questa durata.</p>
      )}

      <div className="max-h-72 space-y-3 overflow-y-auto">
        {grouped.map(([dayKey, daySlots]) => {
          const sample = daySlots[0]
          return (
            <div key={dayKey}>
              <h3 className="mb-1 text-sm font-semibold text-ink">
                {DAY_LABELS[sample.getDay()]} {sample.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })}
              </h3>
              <div className="flex flex-wrap gap-2">
                {daySlots.map((slot) => (
                  <button
                    key={slot.toISOString()}
                    onClick={() => {
                      setSelected(slot)
                      setConfirmError(null)
                    }}
                    className={`rounded-xl border px-3 py-1.5 text-sm ${
                      selected?.getTime() === slot.getTime()
                        ? 'border-brand-600 bg-brand-50 text-brand-700'
                        : 'border-black/10 text-ink hover:bg-black/[0.03]'
                    }`}
                  >
                    {slot.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {selected && (
        <div className="mt-5 space-y-3 border-t border-black/[0.06] pt-4">
          <p className="text-sm text-ink">
            Lezione il <strong>{selected.toLocaleString('it-IT', { dateStyle: 'full', timeStyle: 'short' })}</strong> (
            {durationMinutes} min)
          </p>
          <div>
            <Label htmlFor="bookingSubject">Materia (opzionale)</Label>
            <Input id="bookingSubject" value={subject} onChange={(e) => setSubject(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="bookingNotes">Note per il tutor (opzionale)</Label>
            <Textarea id="bookingNotes" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <ErrorText>{confirmError}</ErrorText>
          <Button
            className="w-full"
            disabled={createBooking.isPending}
            onClick={() => {
              setConfirmError(null)
              createBooking.mutate(
                { tutorId, startsAt: selected, durationMinutes, subject, notes },
                {
                  onSuccess: () => setConfirmed(true),
                  onError: (err) => setConfirmError(err instanceof Error ? err.message : 'Slot non più disponibile, riprova.'),
                },
              )
            }}
          >
            {createBooking.isPending ? 'Prenotazione in corso…' : 'Conferma prenotazione'}
          </Button>
        </div>
      )}
    </Card>
  )
}
