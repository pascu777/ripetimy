import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useSession } from '@/features/auth/session-provider'
import type { Tables } from '@/types/database.types'

export type AvailabilitySlot = Tables<'availability_slots'>

export function useAvailabilitySlots() {
  const { userId } = useSession()
  return useQuery({
    queryKey: ['availability_slots', userId],
    queryFn: async (): Promise<AvailabilitySlot[]> => {
      const { data, error } = await supabase
        .from('availability_slots')
        .select('*')
        .eq('tutor_id', userId as string)
        .order('day_of_week')
        .order('start_time')
      if (error) throw error
      return data
    },
    enabled: !!userId,
  })
}

export function useCreateSlot() {
  const { userId } = useSession()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: { dayOfWeek: number; startTime: string; endTime: string }) => {
      if (!userId) throw new Error('Nessuna sessione attiva')
      const { error } = await supabase.from('availability_slots').insert({
        tutor_id: userId,
        day_of_week: input.dayOfWeek,
        start_time: input.startTime,
        end_time: input.endTime,
      })
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['availability_slots', userId] }),
  })
}

export function useDeleteSlot() {
  const { userId } = useSession()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('availability_slots').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['availability_slots', userId] }),
  })
}
