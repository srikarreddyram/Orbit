import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import useAuth from './useAuth'

export default function useMetrics() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: metrics, isLoading } = useQuery({
    queryKey: ['user_metrics', user?.id],
    queryFn: () => api.get('/user-metrics'),
    enabled: !!user,
  })

  const updateMetrics = useMutation({
    mutationFn: (newMetrics) => api.put('/user-metrics', newMetrics),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['user_metrics', user?.id] }),
  })

  return {
    metrics,
    isLoading,
    updateMetrics: updateMetrics.mutateAsync,
  }
}
