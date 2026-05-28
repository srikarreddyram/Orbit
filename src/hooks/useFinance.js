import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import useAuth from './useAuth'

export default function useFinance() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // Fetch transactions for current month
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions', user?.id],
    queryFn: async () => {
      if (!user) return []
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        // Let's just fetch last 90 days for flexibility
        .gte('date', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString())
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
    enabled: !!user,
  })

  // Fetch budget limits
  const { data: budgetLimits = [] } = useQuery({
    queryKey: ['budget_limits', user?.id],
    queryFn: async () => {
      if (!user) return []
      const { data, error } = await supabase
        .from('budget_limits')
        .select('*')
        .eq('user_id', user.id)
      if (error) throw error
      return data
    },
    enabled: !!user,
  })

  const addTransaction = useMutation({
    mutationFn: async (tx) => {
      if (!user) throw new Error('Not authenticated')
      const { data, error } = await supabase
        .from('transactions')
        .insert([{ ...tx, user_id: user.id }])
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', user?.id] })
    },
  })

  const deleteTransaction = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('transactions').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', user?.id] })
    },
  })

  // Fetch accounts
  const { data: accounts = [], isLoading: isLoadingAccounts } = useQuery({
    queryKey: ['accounts', user?.id],
    queryFn: async () => {
      if (!user) return []
      const { data, error } = await supabase.from('accounts').select('*').eq('user_id', user.id)
      if (error) throw error
      return data
    },
    enabled: !!user,
  })

  // Fetch recurring transactions
  const { data: recurring = [], isLoading: isLoadingRecurring } = useQuery({
    queryKey: ['recurring', user?.id],
    queryFn: async () => {
      if (!user) return []
      const { data, error } = await supabase.from('recurring_transactions').select('*').eq('user_id', user.id)
      if (error) throw error
      return data
    },
    enabled: !!user,
  })

  const addAccount = useMutation({
    mutationFn: async (acc) => {
      if (!user) throw new Error('Not authenticated')
      const { data, error } = await supabase.from('accounts').insert([{ ...acc, user_id: user.id }])
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['accounts', user?.id] }),
  })

  const addRecurring = useMutation({
    mutationFn: async (rec) => {
      if (!user) throw new Error('Not authenticated')
      const { data, error } = await supabase.from('recurring_transactions').insert([{ ...rec, user_id: user.id }])
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['recurring', user?.id] }),
  })

  // Fetch custom categories
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ['transaction_categories', user?.id],
    queryFn: async () => {
      if (!user) return []
      
      // Attempt to fetch categories
      let { data, error } = await supabase
        .from('transaction_categories')
        .select('*')
        .eq('user_id', user.id)
        .order('name')
        
      if (error) throw error
      
      // Bootstrap if empty
      if (data.length === 0) {
        await supabase.rpc('rpc_bootstrap_categories')
        // Re-fetch after bootstrapping
        const res = await supabase
          .from('transaction_categories')
          .select('*')
          .eq('user_id', user.id)
          .order('name')
        data = res.data || []
      }
      
      return data
    },
    enabled: !!user,
  })

  // Category mutations
  const addCategory = useMutation({
    mutationFn: async (cat) => {
      if (!user) throw new Error('Not authenticated')
      const { data, error } = await supabase
        .from('transaction_categories')
        .insert([{ ...cat, user_id: user.id }])
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['transaction_categories', user?.id] }),
  })

  const deleteCategory = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('transaction_categories').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['transaction_categories', user?.id] }),
  })

  const restoreDefaultCategories = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Not authenticated')
      const { error } = await supabase.rpc('rpc_bootstrap_categories')
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['transaction_categories', user?.id] }),
  })

  // Budget mutations
  const saveBudgetLimit = useMutation({
    mutationFn: async ({ category, monthly_limit }) => {
      if (!user) throw new Error('Not authenticated')
      
      // Upsert budget limit
      const { data, error } = await supabase
        .from('budget_limits')
        .upsert(
          { user_id: user.id, category, monthly_limit },
          { onConflict: 'user_id, category' }
        )
        .select()
        .single()
        
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['budget_limits', user?.id] }),
  })

  const deleteBudgetLimit = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('budget_limits').delete().eq('id', id)
      if (error) throw error
    },
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
