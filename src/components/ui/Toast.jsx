import { Toaster } from 'react-hot-toast'

export default function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#17151A',
          color: '#EDEAF0',
          border: '1px solid #FFFFFF0D',
          borderRadius: '16px',
          padding: '12px 16px',
          fontSize: '14px',
          fontFamily: 'Inter, system-ui, sans-serif',
          boxShadow: '0 4px 12px rgba(0,0,0,0.4), 0 24px 48px -16px rgba(0,0,0,0.6)',
        },
        success: {
          iconTheme: {
            primary: '#38BDF8',
            secondary: '#17151A',
          },
          duration: 3000,
        },
        error: {
          iconTheme: {
            primary: '#B91C1C',
            secondary: '#17151A',
          },
          duration: 5000,
        },
      }}
    />
  )
}
