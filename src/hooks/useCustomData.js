import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import useAuth from './useAuth'

export default function useCustomData() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // --- CUSTOM EXERCISES ---
  const { data: customExercises = [], isLoading: loadingExercises } = useQuery({
    queryKey: ['custom_exercises', user?.id],
    queryFn: async () => {
      if (!user) return []
      const { data, error } = await supabase
        .from('custom_exercises')
        .select('*')
        .eq('user_id', user.id)
      
      if (error && error.code !== '42P01') throw error // Ignore if table doesn't exist yet
      return data || []
    },
    enabled: !!user,
  })

  const addCustomExercise = useMutation({
    mutationFn: async (exercise) => {
      if (!user) throw new Error('Not authenticated')
      const { data, error } = await supabase
        .from('custom_exercises')
        .insert([{ user_id: user.id, ...exercise }])
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom_exercises', user?.id] })
    },
  })

  // --- CUSTOM FOODS ---
  const { data: customFoods = [], isLoading: loadingFoods } = useQuery({
    queryKey: ['custom_foods', user?.id],
    queryFn: async () => {
      if (!user) return []
      const { data, error } = await supabase
        .from('custom_foods')
        .select('*')
        .eq('user_id', user.id)
      
      if (error && error.code !== '42P01') throw error
      return data || []
    },
    enabled: !!user,
  })

  const addCustomFood = useMutation({
    mutationFn: async (food) => {
      if (!user) throw new Error('Not authenticated')
      const { data, error } = await supabase
        .from('custom_foods')
        .insert([{ user_id: user.id, ...food }])
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom_foods', user?.id] })
    },
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
