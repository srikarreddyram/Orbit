import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import useAuth from './useAuth'

export default function useTasks() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ['tasks', user?.id],
    queryFn: () => api.get('/tasks'),
    enabled: !!user,
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] })

  const addTask = useMutation({
    mutationFn: (newTask) => api.post('/tasks', newTask),
    onSuccess: invalidate,
  })

  const updateTask = useMutation({
    mutationFn: ({ id, updates }) => api.patch(`/tasks/${id}`, updates),
    onSuccess: invalidate,
  })

  const toggleTask = useMutation({
    mutationFn: ({ id, completed }) => api.patch(`/tasks/${id}/toggle`, { completed }),
    onMutate: async ({ id, completed }) => {
      const key = ['tasks', user?.id]
      await queryClient.cancelQueries({ queryKey: key })
      const previous = queryClient.getQueryData(key)
      queryClient.setQueryData(key, (old = []) => old.map((t) => (
        t.id === id ? { ...t, completed, completed_at: completed ? new Date().toISOString() : null } : t
      )))
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(['tasks', user?.id], context.previous)
    },
    onSettled: invalidate,
  })

  const deleteTask = useMutation({
    mutationFn: (id) => api.delete(`/tasks/${id}`),
    onSuccess: invalidate,
  })

  const reorderTasks = useMutation({
    mutationFn: (orderedTasks) => api.post('/tasks/reorder', orderedTasks.map((t, index) => ({
      id: t.id,
      position: index,
      title: t.title,
      priority: t.priority,
      category: t.category,
      completed: t.completed,
    }))),
    onSuccess: invalidate,
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
