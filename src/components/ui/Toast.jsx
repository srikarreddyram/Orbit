import { Toaster } from 'react-hot-toast'

export default function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#111118',
          color: '#f1f0ff',
          border: '1px solid #1e1e2e',
          borderRadius: '12px',
          padding: '12px 16px',
          fontSize: '14px',
          fontFamily: 'Geist, system-ui, sans-serif',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
        },
        success: {
          iconTheme: {
            primary: '#34d399',
            secondary: '#111118',
          },
          duration: 3000,
        },
        error: {
          iconTheme: {
            primary: '#f87171',
            secondary: '#111118',
          },
          duration: 5000,
        },
      }}
    />
  )
}
