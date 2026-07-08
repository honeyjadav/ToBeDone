import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../utils/cn'

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}) => {
  const sizes = {
    sm: 'w-full max-w-md',
    md: 'w-full max-w-lg',
    lg: 'w-full max-w-2xl',
    xl: 'w-full max-w-4xl',
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className={cn('bg-dark-800 rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto', sizes[size])}>
              {title && (
                <div className="flex items-center justify-between p-6 border-b border-dark-700">
                  <h2 className="text-xl font-bold text-light-50">{title}</h2>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-light-50 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              )}
              <div className="p-6">
                {children}
              </div>
              {footer && (
                <div className="flex gap-3 p-6 border-t border-dark-700 justify-end">
                  {footer}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
