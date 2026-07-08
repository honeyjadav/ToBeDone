import { cn } from '../../utils/cn'

export const Badge = ({ children, variant = 'default', className, ...props }) => {
  const variants = {
    default: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    danger: 'bg-danger/10 text-danger',
    secondary: 'bg-secondary/10 text-secondary',
  }

  return (
    <span
      className={cn(
        'inline-block px-3 py-1 rounded-full text-xs font-medium',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
