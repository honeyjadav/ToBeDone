import { format, formatDistanceToNow, parseISO } from 'date-fns'

export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  if (!date) return ''
  return format(parseISO(typeof date === 'string' ? date : date.toISOString()), formatStr)
}

export const formatTime = (date) => {
  if (!date) return ''
  return format(parseISO(typeof date === 'string' ? date : date.toISOString()), 'HH:mm')
}

export const formatRelativeTime = (date) => {
  if (!date) return ''
  return formatDistanceToNow(parseISO(typeof date === 'string' ? date : date.toISOString()), {
    addSuffix: true,
  })
}

export const formatFullDateTime = (date) => {
  if (!date) return ''
  return format(parseISO(typeof date === 'string' ? date : date.toISOString()), 'MMM dd, yyyy HH:mm')
}

export const getInitials = (firstName, lastName) => {
  return `${firstName?.[0]}${lastName?.[0]}`.toUpperCase()
}

export const truncateText = (text, length = 50) => {
  if (!text) return ''
  return text.length > length ? `${text.substring(0, length)}...` : text
}

export const getStatusColor = (status) => {
  const colors = {
    backlog: 'text-gray-500',
    todo: 'text-blue-500',
    in_progress: 'text-purple-500',
    review: 'text-orange-500',
    testing: 'text-yellow-500',
    done: 'text-green-500',
  }
  return colors[status] || 'text-gray-500'
}

export const getStatusBgColor = (status) => {
  const colors = {
    backlog: 'bg-gray-100',
    todo: 'bg-blue-100',
    in_progress: 'bg-purple-100',
    review: 'bg-orange-100',
    testing: 'bg-yellow-100',
    done: 'bg-green-100',
  }
  return colors[status] || 'bg-gray-100'
}
