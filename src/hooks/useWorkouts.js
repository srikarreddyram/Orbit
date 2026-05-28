import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import useAuth from './useAuth'

export default function useWorkouts() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // Fetch recent workouts with their sets
  const { data: workouts = [], isLoading: loadingWorkouts } = useQuery({
    queryKey: ['workouts', user?.id],
    queryFn: async () => {
      if (!user) return []
      const { data, error } = await supabase
        .from('workouts')
        .select('*, sets:workout_sets(*)')
        .eq('user_id', user.id)
        .order('logged_at', { ascending: false })
        .limit(30)
      if (error) throw error
      return data
    },
    enabled: !!user,
  })

  // Fetch personal records
  const { data: personalRecords = [], isLoading: loadingPRs } = useQuery({
    queryKey: ['prs', user?.id],
    queryFn: async () => {
      if (!user) return []
      const { data, error } = await supabase
        .from('personal_records')
        .select('*')
        .eq('user_id', user.id)
        .order('achieved_at', { ascending: false })
      if (error) throw error
      return data
    },
    enabled: !!user,
  })

  const logWorkout = useMutation({
    mutationFn: async ({ workout, sets }) => {
      if (!user) throw new Error('Not authenticated')
      
      // 1. Insert workout
      const { data: workoutData, error: workoutError } = await supabase
        .from('workouts')
        .insert([{ ...workout, user_id: user.id }])
        .select()
        .single()
      
      if (workoutError) throw workoutError

      // 2. Insert sets if any
      if (sets && sets.length > 0) {
        const setsToInsert = sets.map(s => ({ ...s, workout_id: workoutData.id }))
        const { error: setsError } = await supabase
          .from('workout_sets')
          .insert(setsToInsert)
          
        if (setsError) throw setsError
      }

      return workoutData
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts', user?.id] })
    },
  })

  const addPR = useMutation({
    mutationFn: async (pr) => {
      if (!user) throw new Error('Not authenticated')
      const { data, error } = await supabase
        .from('personal_records')
        .insert([{ ...pr, user_id: user.id }])
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prs', user?.id] })
    },
  })

  return {
    workouts,
    personalRecords,
    isLoading: loadingWorkouts || loadingPRs,
    logWorkout: logWorkout.mutateAsync,
    addPR: addPR.mutateAsync,
  }
}
