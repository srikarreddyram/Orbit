import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import useAuth from './useAuth'

export default function useWorkouts() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: workouts = [], isLoading: loadingWorkouts } = useQuery({
    queryKey: ['workouts', user?.id],
    queryFn: () => api.get('/workouts'),
    enabled: !!user,
  })

  const { data: personalRecords = [], isLoading: loadingPRs } = useQuery({
    queryKey: ['prs', user?.id],
    queryFn: () => api.get('/workouts/personal-records'),
    enabled: !!user,
  })

  const logWorkout = useMutation({
    mutationFn: ({ workout, sets }) => api.post('/workouts', { workout, sets }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['workouts', user?.id] }),
  })

  const addPR = useMutation({
    mutationFn: (pr) => api.post('/workouts/personal-records', pr),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['prs', user?.id] }),
  })

  return {
    workouts,
    personalRecords,
    isLoading: loadingWorkouts || loadingPRs,
    logWorkout: logWorkout.mutateAsync,
    addPR: addPR.mutateAsync,
  }
}
