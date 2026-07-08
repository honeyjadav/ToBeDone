import { getInitials } from '../../utils/formatters'
import { cn } from '../../utils/cn'

export const Avatar = ({ firstName, lastName, avatar, size = 'md', className }) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary font-bold text-white',
        sizes[size],
        className
      )}
    >
      {avatar ? (
        <img src={avatar} alt="avatar" className="w-full h-full rounded-full object-cover" />
      ) : (
        getInitials(firstName, lastName)
      )}
    </div>
  )
}
