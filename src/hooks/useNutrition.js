import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import useAuth from './useAuth'
import { getToday } from '../utils/dateHelpers'

export default function useNutrition() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // Fetch meals for the last 14 days (for chart) and today (for breakdown)
  const { data: meals = [], isLoading: loadingMeals } = useQuery({
    queryKey: ['meals', user?.id],
    queryFn: async () => {
      if (!user) return []
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('user_id', user.id)
        .gte('logged_at', new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
    enabled: !!user,
  })

  // Fetch today's water
  const { data: waterLog, isLoading: loadingWater } = useQuery({
    queryKey: ['water', user?.id, getToday()],
    queryFn: async () => {
      if (!user) return null
      const { data, error } = await supabase
        .from('water_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('logged_at', getToday())
        .maybeSingle()
      if (error) throw error
      return data
    },
    enabled: !!user,
  })

  const logMeal = useMutation({
    mutationFn: async (meal) => {
      if (!user) throw new Error('Not authenticated')
      const { data, error } = await supabase
        .from('meals')
        .insert([{ ...meal, user_id: user.id }])
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals', user?.id] })
    },
  })

  const deleteMeal = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('meals').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals', user?.id] })
    },
  })

  const updateWater = useMutation({
    mutationFn: async (glasses) => {
      if (!user) throw new Error('Not authenticated')
      
      const today = getToday()
      // If we have a log for today, update it, else insert
      if (waterLog?.id) {
        const { data, error } = await supabase
          .from('water_logs')
          .update({ glasses })
          .eq('id', waterLog.id)
          .select()
          .single()
        if (error) throw error
        return data
      } else {
        const { data, error } = await supabase
          .from('water_logs')
          .insert([{ user_id: user.id, glasses, logged_at: today }])
          .select()
          .single()
        if (error) throw error
        return data
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['water', user?.id, getToday()] })
    },
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
