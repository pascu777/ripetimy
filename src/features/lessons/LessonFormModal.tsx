import { useState } from 'react'
import { LessonForm, type LessonFormValues } from './LessonForm'
import { useCreateLesson, useDeleteLesson, useUpdateLesson, type Lesson } from './hooks'
import { Modal } from '@/components/ui'

type Props = {
  open: boolean
  onClose: () => void
  lesson?: Lesson | null
  prefillStart?: Date | null
}

export function LessonFormModal({ open, onClose, lesson, prefillStart }: Props) {
  const createLesson = useCreateLesson()
  const updateLesson = useUpdateLesson()
  const deleteLesson = useDeleteLesson()
  const [error, setError] = useState<string | null>(null)

  const initial = lesson ?? (prefillStart ? ({ starts_at: prefillStart.toISOString() } as Lesson) : undefined)

  function handleSubmit(values: LessonFormValues) {
    setError(null)
    if (lesson) {
      updateLesson.mutate(
        {
          id: lesson.id,
          studentName: values.studentName,
          subject: values.subject,
          startsAt: values.startsAt,
          durationMinutes: values.durationMinutes,
          notes: values.notes,
        },
        { onSuccess: onClose, onError: () => setError('Impossibile salvare: orario probabilmente sovrapposto a un\'altra lezione.') },
      )
    } else {
      createLesson.mutate(values, {
        onSuccess: onClose,
        onError: () => setError('Impossibile creare la lezione: orario probabilmente sovrapposto a un\'altra lezione.'),
      })
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={lesson ? 'Modifica lezione' : 'Nuova lezione'}>
      <LessonForm
        initial={initial as Lesson | undefined}
        submitting={createLesson.isPending || updateLesson.isPending}
        error={error}
        onSubmit={handleSubmit}
        onDelete={
          lesson
            ? () => {
                deleteLesson.mutate(lesson.id, { onSuccess: onClose })
              }
            : undefined
        }
      />
    </Modal>
  )
}
