import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import useAuth from './useAuth'

export default function useTasks() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // Fetch tasks
  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ['tasks', user?.id],
    queryFn: async () => {
      if (!user) return []
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('position', { ascending: true })
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
    enabled: !!user,
  })

  // Add task
  const addTask = useMutation({
    mutationFn: async (newTask) => {
      if (!user) throw new Error('Not authenticated')
      const { data, error } = await supabase
        .from('tasks')
        .insert([{ ...newTask, user_id: user.id }])
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] })
    },
  })

  // Update task
  const updateTask = useMutation({
    mutationFn: async ({ id, updates }) => {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] })
    },
  })

  // Toggle completion (special case of update)
  const toggleTask = useMutation({
    mutationFn: async ({ id, completed }) => {
      const { data, error } = await supabase
        .from('tasks')
        .update({
          completed,
          completed_at: completed ? new Date().toISOString() : null,
        })
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] })
    },
  })

  // Delete task
  const deleteTask = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('tasks').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] })
    },
  })

  // Reorder tasks
  const reorderTasks = useMutation({
    mutationFn: async (orderedTasks) => {
      // In a real app with many tasks, you might want a more efficient way to update positions,
      // but for this scale, updating each is fine. Or use an RPC function.
      const updates = orderedTasks.map((t, index) => ({
        id: t.id,
        user_id: user.id, // Required if doing upsert, though here we just update
        position: index,
        title: t.title,
        priority: t.priority,
        category: t.category,
        completed: t.completed,
      }))
      
      const { error } = await supabase
        .from('tasks')
        .upsert(updates, { onConflict: 'id' })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] })
    },
  })

  return {
    tasks,
    isLoading,
    error,
    addTask: addTask.mutateAsync,
    updateTask: updateTask.mutateAsync,
    toggleTask: toggleTask.mutateAsync,
    deleteTask: deleteTask.mutateAsync,
    reorderTasks: reorderTasks.mutateAsync,
  }
}
