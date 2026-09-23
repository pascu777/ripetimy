import { useMyLessons, useCancelMyLesson } from './hooks'
import { Button, Card } from '@/components/ui'

const STATUS_LABELS: Record<string, string> = {
  scheduled: 'Prenotata',
  completed: 'Completata',
  canceled: 'Annullata',
}

export function MyLessonsPage() {
  const lessonsQuery = useMyLessons()
  const cancelLesson = useCancelMyLesson()

  const lessons = lessonsQuery.data ?? []

  return (
    <div>
      <h1 className="mb-6 text-[26px] font-semibold tracking-tight text-ink">Le mie lezioni</h1>
      {lessonsQuery.isLoading && <p className="text-sm text-ink-soft">Caricamento…</p>}
      {!lessonsQuery.isLoading && lessons.length === 0 && (
        <p className="text-sm text-ink-soft">Non hai ancora prenotato nessuna lezione.</p>
      )}
      <div className="space-y-3">
        {lessons.map((lesson) => (
          <Card key={lesson.id} className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-ink">
                {lesson.tutor_name ?? 'Tutor'} {lesson.subject ? `· ${lesson.subject}` : ''}
              </p>
              <p className="text-sm text-ink-soft">
                {new Date(lesson.starts_at).toLocaleString('it-IT', { dateStyle: 'full', timeStyle: 'short' })} ·{' '}
                {lesson.duration_minutes} min
              </p>
              <span
                className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                  lesson.status === 'scheduled'
                    ? 'bg-emerald-50 text-emerald-700'
                    : lesson.status === 'canceled'
                      ? 'bg-black/5 text-ink-soft'
                      : 'bg-brand-50 text-brand-700'
                }`}
              >
                {STATUS_LABELS[lesson.status] ?? lesson.status}
              </span>
            </div>
            {lesson.status === 'scheduled' && (
              <Button variant="danger" onClick={() => cancelLesson.mutate(lesson.id)} disabled={cancelLesson.isPending}>
                Annulla
              </Button>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
