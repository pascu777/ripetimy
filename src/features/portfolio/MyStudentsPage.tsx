import { useMyStudents } from './hooks'
import { Card } from '@/components/ui'

export function MyStudentsPage() {
  const studentsQuery = useMyStudents()
  const students = studentsQuery.data ?? []

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">I miei studenti</h1>
      {studentsQuery.isLoading && <p className="text-sm text-slate-500">Caricamento…</p>}
      {!studentsQuery.isLoading && students.length === 0 && (
        <p className="text-sm text-slate-500">Non hai ancora avuto lezioni con nessuno studente.</p>
      )}
      <div className="space-y-3">
        {students.map((s) => (
          <Card key={s.studentId ?? s.studentName} className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-900">{s.studentName}</p>
              <p className="text-sm text-slate-600">
                {s.lessonsCount} {s.lessonsCount === 1 ? 'lezione' : 'lezioni'} · ultima il{' '}
                {new Date(s.lastLessonAt).toLocaleDateString('it-IT')}
              </p>
            </div>
            {s.nextLessonAt && (
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                Prossima: {new Date(s.nextLessonAt).toLocaleDateString('it-IT')}
              </span>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
