import { useState, useEffect, useCallback } from 'react'
import { api, getToken, setToken } from '../lib/api'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(() => !!getToken())

  useEffect(() => {
    if (!getToken()) return

    api.get('/auth/me')
      .then(({ profile }) => {
        setUser({ id: profile.id, email: profile.email })
        setProfile(profile)
      })
      .catch(() => {
        setToken(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const signIn = async (email, password) => {
    const { token, profile } = await api.post('/auth/login', { email, password })
    setToken(token)
    setUser({ id: profile.id, email: profile.email })
    setProfile(profile)
    return { user }
  }

  const signUp = async (email, password, name) => {
    const { token, profile } = await api.post('/auth/register', { email, password, name })
    setToken(token)
    setUser({ id: profile.id, email: profile.email })
    setProfile(profile)
    return { user }
  }

  const signOut = async () => {
    setToken(null)
    setUser(null)
    setProfile(null)
  }

  const updateProfile = useCallback(async (updates) => {
    const updated = await api.patch('/profile', updates)
    setProfile(updated)
    return updated
  }, [])

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
