export type AvailabilityWindow = { day_of_week: number; start_time: string; end_time: string }
export type BusyWindow = { starts_at: string; ends_at: string }

function combine(date: Date, time: string) {
  const [h, m] = time.split(':').map(Number)
  const d = new Date(date)
  d.setHours(h, m, 0, 0)
  return d
}

function addDays(date: Date, days: number) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

/** Espande la disponibilità ricorrente in slot prenotabili concreti nel range [from, to), sottraendo gli orari già occupati. */
export function expandAvailability(params: {
  availability: AvailabilityWindow[]
  busy: BusyWindow[]
  from: Date
  to: Date
  durationMinutes: number
  stepMinutes?: number
}): Date[] {
  const { availability, busy, from, to, durationMinutes, stepMinutes = 30 } = params
  const now = new Date()
  const results: Date[] = []

  const busyRanges = busy.map((b) => ({ start: new Date(b.starts_at), end: new Date(b.ends_at) }))

  let cursorDay = new Date(from.getFullYear(), from.getMonth(), from.getDate())
  const lastDay = new Date(to.getFullYear(), to.getMonth(), to.getDate())

  while (cursorDay <= lastDay) {
    const dow = cursorDay.getDay()
    const daySlots = availability.filter((a) => a.day_of_week === dow)

    for (const slot of daySlots) {
      const slotStart = combine(cursorDay, slot.start_time)
      const slotEnd = combine(cursorDay, slot.end_time)

      for (let t = new Date(slotStart); t.getTime() + durationMinutes * 60_000 <= slotEnd.getTime(); t = new Date(t.getTime() + stepMinutes * 60_000)) {
        if (t < now || t < from || t >= to) continue
        const candidateEnd = new Date(t.getTime() + durationMinutes * 60_000)
        const overlaps = busyRanges.some((b) => t < b.end && candidateEnd > b.start)
        if (!overlaps) results.push(new Date(t))
      }
    }

    cursorDay = addDays(cursorDay, 1)
  }

  return results
}
