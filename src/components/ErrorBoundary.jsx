import React from 'react'
import { AlertTriangle } from 'lucide-react'
import Button from './ui/Button'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center">
          <div className="w-16 h-16 bg-accent-red/10 rounded-full flex items-center justify-center mb-4 text-accent-red">
            <AlertTriangle size={32} />
          </div>
          <h2 className="text-xl font-bold text-text-primary mb-2">Something went wrong</h2>
          <p className="text-text-muted mb-6 max-w-md">
            An error occurred while rendering this section. You can try reloading the page.
          </p>
          <div className="flex gap-4">
            <Button 
              onClick={() => window.location.reload()}
              variant="primary"
            >
              Reload Page
            </Button>
            <Button 
              onClick={() => this.setState({ hasError: false, error: null })}
              variant="secondary"
            >
              Try Again
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
