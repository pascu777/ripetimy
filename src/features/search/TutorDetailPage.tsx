import { useParams } from 'react-router-dom'
import { useTutor } from './hooks'
import { BookingSlotPicker } from './BookingSlotPicker'
import { Card } from '@/components/ui'

export function TutorDetailPage() {
  const { tutorId } = useParams<{ tutorId: string }>()
  const tutorQuery = useTutor(tutorId ?? '')

  if (tutorQuery.isLoading) return <p className="text-sm text-ink-soft">Caricamento…</p>
  if (!tutorQuery.data) return <p className="text-sm text-ink-soft">Tutor non trovato.</p>

  const tutor = tutorQuery.data

  return (
    <div className="space-y-6">
      <Card>
        <h1 className="text-[26px] font-semibold tracking-tight text-ink">{tutor.full_name}</h1>
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
      <BookingSlotPicker tutorId={tutor.id} />
    </div>
  )
}
