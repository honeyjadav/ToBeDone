import { cn } from '../../utils/cn'

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled = false,
  loading = false,
  ...props
}) => {
  const baseStyles = 'font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap'

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 disabled:opacity-50',
    secondary: 'bg-dark-800 text-light-50 hover:bg-dark-700 disabled:opacity-50',
    outline: 'border border-primary text-primary hover:bg-primary/10 disabled:opacity-50',
    danger: 'bg-danger text-white hover:bg-danger/90 disabled:opacity-50',
    ghost: 'text-primary hover:bg-primary/10 disabled:opacity-50',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="animate-spin">⏳</span>}
      {children}
    </button>
  )
}
