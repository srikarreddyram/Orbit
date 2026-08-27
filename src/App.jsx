import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import useAuth from './hooks/useAuth'
import { AuthProvider } from './contexts/AuthContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import Layout from './components/layout/Layout'
import ToastProvider from './components/ui/Toast'

const Login = lazy(() => import('./pages/Login'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Tasks = lazy(() => import('./pages/Tasks'))
const Workouts = lazy(() => import('./pages/Workouts'))
const Sleep = lazy(() => import('./pages/Sleep'))
const Nutrition = lazy(() => import('./pages/Nutrition'))
const Finance = lazy(() => import('./pages/Finance'))
const Settings = lazy(() => import('./pages/Settings'))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function AuthGuard({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-base flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-accent-purple border-t-transparent animate-spin" />
          <p className="text-sm text-text-muted">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <ToastProvider />
          <Suspense fallback={
            <div className="min-h-screen bg-base flex items-center justify-center">
              <div className="w-10 h-10 rounded-full border-2 border-accent-purple border-t-transparent animate-spin" />
            </div>
          }>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <AuthGuard>
                    <ErrorBoundary>
                      <Layout />
                    </ErrorBoundary>
                  </AuthGuard>
                }
              >
                <Route index element={<ErrorBoundary><Dashboard /></ErrorBoundary>} />
                <Route path="tasks" element={<ErrorBoundary><Tasks /></ErrorBoundary>} />
                <Route path="workouts" element={<ErrorBoundary><Workouts /></ErrorBoundary>} />
                <Route path="sleep" element={<ErrorBoundary><Sleep /></ErrorBoundary>} />
                <Route path="nutrition" element={<ErrorBoundary><Nutrition /></ErrorBoundary>} />
                <Route path="finance" element={<ErrorBoundary><Finance /></ErrorBoundary>} />
                <Route path="settings" element={<ErrorBoundary><Settings /></ErrorBoundary>} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
