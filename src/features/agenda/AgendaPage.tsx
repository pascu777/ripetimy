import { useMemo, useState } from 'react'
import { Calendar, Views } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './calendar.css'
import { localizer } from './calendarLocalizer'
import { lessonsToEvents, type CalendarEvent } from './eventMapper'
import { useLessons } from '@/features/lessons/hooks'
import { LessonFormModal } from '@/features/lessons/LessonFormModal'
import { Button } from '@/components/ui'
import type { Lesson } from '@/features/lessons/hooks'

function startOfMonthPadded(date: Date) {
  const d = new Date(date.getFullYear(), date.getMonth(), 1)
  d.setDate(d.getDate() - 7)
  return d
}
function endOfMonthPadded(date: Date) {
  const d = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  d.setDate(d.getDate() + 7)
  return d
}

export function AgendaPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [modalOpen, setModalOpen] = useState(false)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [prefillStart, setPrefillStart] = useState<Date | null>(null)

  const range = useMemo(
    () => ({ from: startOfMonthPadded(currentDate), to: endOfMonthPadded(currentDate) }),
    [currentDate],
  )
  const lessonsQuery = useLessons(range)
  const events = useMemo(() => lessonsToEvents(lessonsQuery.data ?? []), [lessonsQuery.data])

  function openCreate(start: Date) {
    setEditingLesson(null)
    setPrefillStart(start)
    setModalOpen(true)
  }

  function openEdit(event: CalendarEvent) {
    setEditingLesson(event.resource)
    setPrefillStart(null)
    setModalOpen(true)
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-[26px] font-semibold tracking-tight text-ink">Agenda</h1>
        <Button onClick={() => openCreate(new Date())}>+ Nuova lezione</Button>
      </div>
      <div
        className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.08)]"
        style={{ height: 700 }}
      >
        <Calendar
          localizer={localizer}
          culture="it"
          events={events}
          defaultView={Views.WEEK}
          views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
          date={currentDate}
          onNavigate={setCurrentDate}
          selectable
          onSelectSlot={(slotInfo: { start: Date }) => openCreate(slotInfo.start)}
          onSelectEvent={(event: CalendarEvent) => openEdit(event)}
          onRangeChange={(newRange: Date[] | { start: Date; end: Date }) => {
            if (Array.isArray(newRange)) {
              if (newRange.length > 0) setCurrentDate(newRange[0])
            } else if (newRange.start) {
              setCurrentDate(newRange.start)
            }
          }}
          style={{ height: '100%' }}
        />
      </div>
      <LessonFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        lesson={editingLesson}
        prefillStart={prefillStart}
      />
    </div>
  )
}
