import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import useAuth from './useAuth'

import { calculateSleepRecovery } from '../utils/sleepAI'

export default function useSleep() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: sleepLogs = [], isLoading } = useQuery({
    queryKey: ['sleep', user?.id],
    queryFn: async () => {
      if (!user) return []
      const { data, error } = await supabase
        .from('sleep_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('logged_at', { ascending: true })
        // Fetch last 14 days for the chart
        .gte('logged_at', new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString())
      if (error) throw error
      return data
    },
    enabled: !!user,
  })

  const logSleep = useMutation({
    mutationFn: async (newLog) => {
      if (!user) throw new Error('Not authenticated')
      
      // Pass the raw data through our local AI heuristic engine
      const aiResults = calculateSleepRecovery(newLog)
      const enhancedLog = {
        ...newLog,
        ...aiResults,
        user_id: user.id
      }
      
      const { data, error } = await supabase
        .from('sleep_logs')
        .insert([enhancedLog])
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sleep', user?.id] })
    },
  })

  const deleteSleepLog = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('sleep_logs').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sleep', user?.id] })
    },
  })

  return {
    sleepLogs,
    isLoading,
    logSleep: logSleep.mutateAsync,
    deleteSleepLog: deleteSleepLog.mutateAsync,
  }
}
