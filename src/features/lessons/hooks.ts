import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useSession } from '@/features/auth/session-provider'
import type { Tables } from '@/types/database.types'

export type Lesson = Tables<'lessons'>

export function useLessons(range: { from: Date; to: Date }) {
  const { userId } = useSession()
  return useQuery({
    queryKey: ['lessons', userId, range.from.toISOString(), range.to.toISOString()],
    queryFn: async (): Promise<Lesson[]> => {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('tutor_id', userId as string)
        .neq('status', 'canceled')
        .lt('starts_at', range.to.toISOString())
        .gt('ends_at', range.from.toISOString())
        .order('starts_at')
      if (error) throw error
      return data
    },
    enabled: !!userId,
  })
}

export type LessonInput = {
  studentName: string
  subject?: string
  startsAt: string
  durationMinutes: number
  notes?: string
}

export function useCreateLesson() {
  const { userId } = useSession()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: LessonInput) => {
      if (!userId) throw new Error('Nessuna sessione attiva')
      const endsAt = new Date(new Date(input.startsAt).getTime() + input.durationMinutes * 60_000).toISOString()
      const { error } = await supabase.from('lessons').insert({
        tutor_id: userId,
        student_name: input.studentName,
        source: 'manual',
        subject: input.subject || null,
        notes: input.notes || null,
        starts_at: input.startsAt,
        duration_minutes: input.durationMinutes,
        ends_at: endsAt,
      })
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['lessons', userId] }),
  })
}

export function useUpdateLesson() {
  const { userId } = useSession()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: { id: string } & Partial<LessonInput> & { status?: Lesson['status'] }) => {
      const { id, studentName, subject, startsAt, durationMinutes, notes, status } = input
      const { error } = await supabase
        .from('lessons')
        .update({
          ...(studentName !== undefined ? { student_name: studentName } : {}),
          ...(subject !== undefined ? { subject: subject || null } : {}),
          ...(startsAt !== undefined ? { starts_at: startsAt } : {}),
          ...(durationMinutes !== undefined ? { duration_minutes: durationMinutes } : {}),
          ...(notes !== undefined ? { notes: notes || null } : {}),
          ...(status !== undefined ? { status } : {}),
        })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['lessons', userId] }),
  })
}

export function useDeleteLesson() {
  const { userId } = useSession()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('lessons').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['lessons', userId] }),
  })
}
