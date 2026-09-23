import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useSession } from '@/features/auth/session-provider'

export function useSearchTutors(subject: string, query: string) {
  return useQuery({
    queryKey: ['search_tutors', subject, query],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('search_tutors', {
        p_subject: subject || undefined,
        p_query: query || undefined,
      })
      if (error) throw error
      return data
    },
  })
}

export function useTutor(tutorId: string) {
  return useQuery({
    queryKey: ['tutor', tutorId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_tutor', { p_tutor_id: tutorId })
      if (error) throw error
      return data[0] ?? null
    },
    enabled: !!tutorId,
  })
}

export function useTutorAvailability(tutorId: string) {
  return useQuery({
    queryKey: ['tutor_availability', tutorId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_tutor_availability', { p_tutor_id: tutorId })
      if (error) throw error
      return data
    },
    enabled: !!tutorId,
  })
}

export function useTutorBusyWindows(tutorId: string, from: Date, to: Date) {
  return useQuery({
    queryKey: ['tutor_busy', tutorId, from.toISOString(), to.toISOString()],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_tutor_busy_windows', {
        p_tutor_id: tutorId,
        p_from: from.toISOString(),
        p_to: to.toISOString(),
      })
      if (error) throw error
      return data
    },
    enabled: !!tutorId,
  })
}

export function useCreateBooking() {
  const { userId } = useSession()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: { tutorId: string; startsAt: Date; durationMinutes: number; subject?: string; notes?: string }) => {
      const { error } = await supabase.rpc('create_booking', {
        p_tutor_id: input.tutorId,
        p_starts_at: input.startsAt.toISOString(),
        p_duration_minutes: input.durationMinutes,
        p_subject: input.subject || undefined,
        p_notes: input.notes || undefined,
      })
      if (error) throw error
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tutor_busy', variables.tutorId] })
      queryClient.invalidateQueries({ queryKey: ['my_lessons', userId] })
    },
  })
}
