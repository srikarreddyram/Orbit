import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import useAuth from './useAuth'

export default function useMetrics() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: metrics, isLoading } = useQuery({
    queryKey: ['user_metrics', user?.id],
    queryFn: async () => {
      if (!user) return null
      const { data, error } = await supabase
        .from('user_metrics')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()
      
      if (error) throw error
      return data || { 
        weight_kg: 70, 
        height_cm: 170, 
        age: 30, 
        gender: 'other', 
        activity_level: 'moderately_active' 
      }
    },
    enabled: !!user,
  })

  const updateMetrics = useMutation({
    mutationFn: async (newMetrics) => {
      if (!user) throw new Error('Not authenticated')
      const { data, error } = await supabase
        .from('user_metrics')
        .upsert({ user_id: user.id, ...newMetrics })
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_metrics', user?.id] })
    },
  })

  return {
    metrics,
    isLoading,
    updateMetrics: updateMetrics.mutateAsync
  }
}
