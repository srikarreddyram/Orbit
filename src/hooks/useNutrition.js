import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import useAuth from './useAuth'
import { getToday } from '../utils/dateHelpers'

export default function useNutrition() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: meals = [], isLoading: loadingMeals } = useQuery({
    queryKey: ['meals', user?.id],
    queryFn: () => api.get('/nutrition/meals'),
    enabled: !!user,
  })

  const { data: waterLog, isLoading: loadingWater } = useQuery({
    queryKey: ['water', user?.id, getToday()],
    queryFn: () => api.get('/nutrition/water-logs/today'),
    enabled: !!user,
  })

  const logMeal = useMutation({
    mutationFn: (meal) => api.post('/nutrition/meals', meal),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['meals', user?.id] }),
  })

  const deleteMeal = useMutation({
    mutationFn: (id) => api.delete(`/nutrition/meals/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['meals', user?.id] }),
  })

  const updateWater = useMutation({
    mutationFn: (glasses) => api.put('/nutrition/water-logs/today', { glasses }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['water', user?.id, getToday()] }),
  })

  return {
    meals,
    waterLog,
    isLoading: loadingMeals || loadingWater,
    logMeal: logMeal.mutateAsync,
    deleteMeal: deleteMeal.mutateAsync,
    updateWater: updateWater.mutateAsync,
  }
}
