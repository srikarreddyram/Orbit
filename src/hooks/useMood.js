import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import useAuth from './useAuth'

export default function useMood() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // Fetch mood logs for the past year (useful for Year in Pixels)
  const { data: moodLogs = [], isLoading } = useQuery({
    queryKey: ['moods', user?.id],
    queryFn: async () => {
      if (!user) return []
      const { data, error } = await supabase
        .from('mood_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('logged_at', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString())
        .order('logged_at', { ascending: true })
      if (error) throw error
      return data
    },
    enabled: !!user,
  })

  const logMood = useMutation({
    mutationFn: async (moodEntry) => {
      if (!user) throw new Error('Not authenticated')
      const { data, error } = await supabase
        .from('mood_logs')
        .insert([{ ...moodEntry, user_id: user.id }])
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moods', user?.id] })
    },
  })

  const deleteMoodLog = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('mood_logs').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moods', user?.id] })
    },
  })

  return {
    moodLogs,
    isLoading,
    logMood: logMood.mutateAsync,
    deleteMoodLog: deleteMoodLog.mutateAsync,
  }
}
