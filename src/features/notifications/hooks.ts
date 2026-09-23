import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useSession } from '@/features/auth/session-provider'
import type { Tables } from '@/types/database.types'

export type Notification = Tables<'notifications'>

export function useNotifications() {
  const { userId } = useSession()
  return useQuery({
    queryKey: ['notifications', userId],
    queryFn: async (): Promise<Notification[]> => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId as string)
        .order('created_at', { ascending: false })
        .limit(20)
      if (error) throw error
      return data
    },
    enabled: !!userId,
    refetchInterval: 30_000,
  })
}

export function useMarkNotificationsRead() {
  const { userId } = useSession()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (ids: string[]) => {
      if (ids.length === 0) return
      const { error } = await supabase.rpc('mark_notifications_read', { p_ids: ids })
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications', userId] }),
  })
}
