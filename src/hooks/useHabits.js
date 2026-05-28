import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import useAuth from './useAuth'

export default function useHabits() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // Fetch habits
  const { data: habits = [], isLoading: loadingHabits } = useQuery({
    queryKey: ['habits', user?.id],
    queryFn: async () => {
      if (!user) return []
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .eq('archived', false)
        .order('created_at', { ascending: true })
      if (error) throw error
      return data
    },
    enabled: !!user,
  })

  // Fetch completions (last 90 days)
  const { data: completions = [], isLoading: loadingCompletions } = useQuery({
    queryKey: ['habit_completions', user?.id],
    queryFn: async () => {
      if (!user) return []
      const { data, error } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('user_id', user.id)
        .gte('completed_on', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString())
      if (error) throw error
      return data
    },
    enabled: !!user,
  })

  const addHabit = useMutation({
    mutationFn: async (habit) => {
      if (!user) throw new Error('Not authenticated')
      const { data, error } = await supabase
        .from('habits')
        .insert([{ ...habit, user_id: user.id }])
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits', user?.id] })
    },
  })

  const toggleCompletion = useMutation({
    mutationFn: async ({ habitId, date, isCompleted }) => {
      if (!user) throw new Error('Not authenticated')
      
      if (isCompleted) {
        // Un-complete (delete)
        const { error } = await supabase
          .from('habit_completions')
          .delete()
          .eq('habit_id', habitId)
          .eq('completed_on', date)
        if (error) throw error
      } else {
        // Complete (insert)
        const { error } = await supabase
          .from('habit_completions')
          .insert([{ habit_id: habitId, user_id: user.id, completed_on: date }])
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habit_completions', user?.id] })
    },
  })

  return {
    habits,
    completions,
    isLoading: loadingHabits || loadingCompletions,
    addHabit: addHabit.mutateAsync,
    toggleCompletion: toggleCompletion.mutateAsync,
  }
}
