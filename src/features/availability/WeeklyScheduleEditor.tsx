import { useState } from 'react'
import { useAvailabilitySlots, useCreateSlot, useDeleteSlot } from './hooks'
import { DAY_LABELS } from '@/lib/days'
import { Button, Card, ErrorText, Label, Select } from '@/components/ui'

export function WeeklyScheduleEditor() {
  const slotsQuery = useAvailabilitySlots()
  const createSlot = useCreateSlot()
  const deleteSlot = useDeleteSlot()

  const [dayOfWeek, setDayOfWeek] = useState(1)
  const [startTime, setStartTime] = useState('15:00')
  const [endTime, setEndTime] = useState('18:00')

  const slots = slotsQuery.data ?? []
  const grouped = DAY_LABELS.map((label, day) => ({
    day,
    label,
    slots: slots.filter((s) => s.day_of_week === day),
  }))

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="mb-4 text-[17px] font-semibold tracking-tight text-ink">Aggiungi una fascia disponibile</h2>
        <form
          className="grid grid-cols-1 gap-4 sm:grid-cols-4 sm:items-end"
          onSubmit={(e) => {
            e.preventDefault()
            if (endTime <= startTime) return
            createSlot.mutate({ dayOfWeek, startTime, endTime })
          }}
        >
          <div>
            <Label htmlFor="day">Giorno</Label>
            <Select id="day" value={dayOfWeek} onChange={(e) => setDayOfWeek(Number(e.target.value))}>
              {DAY_LABELS.map((label, i) => (
                <option key={i} value={i}>
                  {label}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="start">Dalle</Label>
            <input
              id="start"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
          </div>
          <div>
            <Label htmlFor="end">Alle</Label>
            <input
              id="end"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
          </div>
          <Button type="submit" disabled={createSlot.isPending}>
            Aggiungi
          </Button>
        </form>
        <ErrorText>{endTime <= startTime ? "L'orario di fine deve essere dopo l'inizio." : null}</ErrorText>
        <ErrorText>{createSlot.isError ? 'Impossibile salvare la fascia. Riprova.' : null}</ErrorText>
      </Card>

      <Card>
        <h2 className="mb-4 text-[17px] font-semibold tracking-tight text-ink">Le tue disponibilità</h2>
        {slotsQuery.isLoading && <p className="text-sm text-ink-soft">Caricamento…</p>}
        {!slotsQuery.isLoading && slots.length === 0 && (
          <p className="text-sm text-ink-soft">Non hai ancora impostato nessuna disponibilità.</p>
        )}
        <div className="space-y-3">
          {grouped
            .filter((g) => g.slots.length > 0)
            .map((g) => (
              <div key={g.day}>
                <h3 className="mb-1 text-sm font-semibold text-ink">{g.label}</h3>
                <ul className="space-y-1">
                  {g.slots.map((slot) => (
                    <li
                      key={slot.id}
                      className="flex items-center justify-between rounded-xl border border-black/[0.06] px-3 py-2 text-sm"
                    >
                      <span>
                        {slot.start_time.slice(0, 5)} – {slot.end_time.slice(0, 5)}
                      </span>
                      <button
                        onClick={() => deleteSlot.mutate(slot.id)}
                        className="text-xs font-medium text-red-600 hover:underline"
                      >
                        Elimina
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      </Card>
    </div>
  )
}
