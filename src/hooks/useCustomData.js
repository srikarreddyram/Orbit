import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import useAuth from './useAuth'

export default function useCustomData() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: customExercises = [], isLoading: loadingExercises } = useQuery({
    queryKey: ['custom_exercises', user?.id],
    queryFn: () => api.get('/custom/exercises'),
    enabled: !!user,
  })

  const addCustomExercise = useMutation({
    mutationFn: (exercise) => api.post('/custom/exercises', exercise),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['custom_exercises', user?.id] }),
  })

  const { data: customFoods = [], isLoading: loadingFoods } = useQuery({
    queryKey: ['custom_foods', user?.id],
    queryFn: () => api.get('/custom/foods'),
    enabled: !!user,
  })

  const addCustomFood = useMutation({
    mutationFn: (food) => api.post('/custom/foods', food),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['custom_foods', user?.id] }),
  })

  return {
    customExercises,
    loadingExercises,
    addCustomExercise: addCustomExercise.mutateAsync,

    customFoods,
    loadingFoods,
    addCustomFood: addCustomFood.mutateAsync,
  }
}
