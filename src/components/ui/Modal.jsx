import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect } from 'react'

export default function Modal({ isOpen, onClose, title, children, size = 'md', className = '' }) {
  // Close on escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[90vw]',
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`fixed inset-0 z-50 flex items-center justify-center p-4`}
          >
            <div
              className={`glass rounded-2xl w-full ${sizes[size]} max-h-[85vh] overflow-y-auto ${className}`}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={title}
            >
              {/* Header */}
              {title && (
                <div className="flex items-center justify-between p-5 border-b border-border">
                  <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-lg hover:bg-surface text-text-muted hover:text-text-primary transition-colors"
                    aria-label="Close modal"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}

              {/* Body */}
              <div className="p-5">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/**
 * Bottom sheet variant for mobile
 */
export function BottomSheet({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 glass rounded-t-2xl max-h-[85vh] overflow-y-auto"
          >
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-text-muted/30 rounded-full" />
            </div>
            {title && (
              <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                <h2 className="text-lg font-semibold">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-surface text-text-muted"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
            )}
            <div className="p-5">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
