import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import useAuth from './useAuth'

export default function useFinance() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions', user?.id],
    queryFn: () => api.get('/finance/transactions'),
    enabled: !!user,
  })

  const { data: budgetLimits = [] } = useQuery({
    queryKey: ['budget_limits', user?.id],
    queryFn: () => api.get('/finance/budget-limits'),
    enabled: !!user,
  })

  const addTransaction = useMutation({
    mutationFn: (tx) => api.post('/finance/transactions', tx),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['transactions', user?.id] }),
  })

  const deleteTransaction = useMutation({
    mutationFn: (id) => api.delete(`/finance/transactions/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['transactions', user?.id] }),
  })

  const { data: accounts = [], isLoading: isLoadingAccounts } = useQuery({
    queryKey: ['accounts', user?.id],
    queryFn: () => api.get('/finance/accounts'),
    enabled: !!user,
  })

  const { data: recurring = [], isLoading: isLoadingRecurring } = useQuery({
    queryKey: ['recurring', user?.id],
    queryFn: () => api.get('/finance/recurring-transactions'),
    enabled: !!user,
  })

  const addAccount = useMutation({
    mutationFn: (acc) => api.post('/finance/accounts', acc),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['accounts', user?.id] }),
  })

  const addRecurring = useMutation({
    mutationFn: (rec) => api.post('/finance/recurring-transactions', rec),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['recurring', user?.id] }),
  })

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ['transaction_categories', user?.id],
    queryFn: () => api.get('/finance/categories'),
    enabled: !!user,
  })

  const addCategory = useMutation({
    mutationFn: (cat) => api.post('/finance/categories', cat),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['transaction_categories', user?.id] }),
  })

  const deleteCategory = useMutation({
    mutationFn: (id) => api.delete(`/finance/categories/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['transaction_categories', user?.id] }),
  })

  const restoreDefaultCategories = useMutation({
    mutationFn: () => api.post('/finance/categories/restore-defaults'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['transaction_categories', user?.id] }),
  })

  const saveBudgetLimit = useMutation({
    mutationFn: ({ category, limit_amount, period }) => api.put('/finance/budget-limits', { category, limit_amount, period }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['budget_limits', user?.id] }),
  })

  const deleteBudgetLimit = useMutation({
    mutationFn: (id) => api.delete(`/finance/budget-limits/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['budget_limits', user?.id] }),
  })

  return {
    transactions,
    budgetLimits,
    accounts,
    recurring,
    categories,
    isLoading: isLoading || isLoadingAccounts || isLoadingRecurring || isLoadingCategories,
    addTransaction: addTransaction.mutateAsync,
    deleteTransaction: deleteTransaction.mutateAsync,
    addAccount: addAccount.mutateAsync,
    addRecurring: addRecurring.mutateAsync,
    addCategory: addCategory.mutateAsync,
    deleteCategory: deleteCategory.mutateAsync,
    restoreDefaultCategories: restoreDefaultCategories.mutateAsync,
    saveBudgetLimit: saveBudgetLimit.mutateAsync,
    deleteBudgetLimit: deleteBudgetLimit.mutateAsync,
  }
}
