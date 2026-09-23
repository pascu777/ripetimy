import type { Lesson } from '@/features/lessons/hooks'

export type CalendarEvent = {
  id: string
  title: string
  start: Date
  end: Date
  resource: Lesson
}

export function lessonsToEvents(lessons: Lesson[]): CalendarEvent[] {
  return lessons.map((lesson) => ({
    id: lesson.id,
    title: `${lesson.student_name ?? 'Lezione'}${lesson.subject ? ` · ${lesson.subject}` : ''}${lesson.source === 'booking' ? ' 📌' : ''}`,
    start: new Date(lesson.starts_at),
    end: new Date(lesson.ends_at),
    resource: lesson,
  }))
}
