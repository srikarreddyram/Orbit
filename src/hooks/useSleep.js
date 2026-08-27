import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import useAuth from './useAuth'
import { calculateSleepRecovery } from '../utils/sleepAI'

export default function useSleep() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: sleepLogs = [], isLoading } = useQuery({
    queryKey: ['sleep', user?.id],
    queryFn: () => api.get('/sleep-logs'),
    enabled: !!user,
  })

  const logSleep = useMutation({
    mutationFn: (newLog) => {
      const aiResults = calculateSleepRecovery(newLog)
      return api.post('/sleep-logs', { ...newLog, ...aiResults })
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sleep', user?.id] }),
  })

  const deleteSleepLog = useMutation({
    mutationFn: (id) => api.delete(`/sleep-logs/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sleep', user?.id] }),
  })

  return {
    sleepLogs,
    isLoading,
    logSleep: logSleep.mutateAsync,
    deleteSleepLog: deleteSleepLog.mutateAsync,
  }
}
