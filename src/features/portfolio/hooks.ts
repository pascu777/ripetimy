import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useSession } from '@/features/auth/session-provider'

export type StudentSummary = {
  studentId: string | null
  studentName: string
  lessonsCount: number
  lastLessonAt: string
  nextLessonAt: string | null
}

export function useMyStudents() {
  const { userId } = useSession()
  return useQuery({
    queryKey: ['my_students', userId],
    queryFn: async (): Promise<StudentSummary[]> => {
      const { data, error } = await supabase
        .from('lessons')
        .select('student_id, student_name, starts_at, status')
        .eq('tutor_id', userId as string)
        .neq('status', 'canceled')
        .order('starts_at', { ascending: false })
      if (error) throw error

      const now = Date.now()
      const map = new Map<string, StudentSummary>()
      for (const row of data) {
        const key = row.student_id ?? row.student_name ?? 'sconosciuto'
        const existing = map.get(key)
        const startsAt = new Date(row.starts_at).getTime()
        if (!existing) {
          map.set(key, {
            studentId: row.student_id,
            studentName: row.student_name ?? 'Studente',
            lessonsCount: 1,
            lastLessonAt: row.starts_at,
            nextLessonAt: startsAt > now ? row.starts_at : null,
          })
        } else {
          existing.lessonsCount += 1
          if (startsAt > now && (!existing.nextLessonAt || startsAt < new Date(existing.nextLessonAt).getTime())) {
            existing.nextLessonAt = row.starts_at
          }
        }
      }
      return Array.from(map.values()).sort((a, b) => a.studentName.localeCompare(b.studentName))
    },
    enabled: !!userId,
  })
}
