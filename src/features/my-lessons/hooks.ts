import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useSession } from '@/features/auth/session-provider'
import type { Lesson } from '@/features/lessons/hooks'

export function useMyLessons() {
  const { userId } = useSession()
  return useQuery({
    queryKey: ['my_lessons', userId],
    queryFn: async (): Promise<Lesson[]> => {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('student_id', userId as string)
        .order('starts_at', { ascending: false })
      if (error) throw error
      return data
    },
    enabled: !!userId,
  })
}

export function useCancelMyLesson() {
  const { userId } = useSession()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (lessonId: string) => {
      const { error } = await supabase.rpc('cancel_lesson', { p_lesson_id: lessonId })
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my_lessons', userId] }),
  })
}
