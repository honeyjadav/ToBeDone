import { cn } from '../../utils/cn'

export const Card = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        'bg-dark-800 border border-dark-700 rounded-xl p-6 shadow-soft hover:shadow-medium transition-shadow',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
