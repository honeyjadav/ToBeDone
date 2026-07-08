#!/bin/bash

# ToBeDone Frontend Setup Script
# This script creates all frontend files and directories

set -e

echo "🚀 Starting ToBeDone Frontend Setup..."

# Navigate to frontend directory
cd frontend

# Create directory structure
echo "📁 Creating directory structure..."
mkdir -p src/utils
mkdir -p src/services
mkdir -p src/hooks
mkdir -p src/context
mkdir -p src/components/common
mkdir -p src/components/layouts
mkdir -p src/components/features
mkdir -p src/pages
mkdir -p src/routes
mkdir -p src/styles
mkdir -p public

# ==================== ROOT FILES ====================

echo "📝 Creating package.json..."
cat > package.json << 'EOF'
{
  "name": "tobedone-frontend",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext .js,.jsx"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.2",
    "socket.io-client": "^4.7.2",
    "react-hook-form": "^7.49.0",
    "tailwindcss": "^3.4.1",
    "recharts": "^2.10.3",
    "framer-motion": "^10.16.16",
    "react-icons": "^4.12.0",
    "@hello-pangea/dnd": "^16.5.0",
    "zustand": "^4.4.2",
    "date-fns": "^2.30.0",
    "clsx": "^2.0.0",
    "react-hot-toast": "^2.4.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.0",
    "postcss": "^8.4.32",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.55.0",
    "eslint-plugin-react": "^7.33.2"
  }
}
EOF

echo "📝 Creating .env.example..."
cat > .env.example << 'EOF'
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
EOF

echo "📝 Creating vite.config.js..."
cat > vite.config.js << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
EOF

echo "📝 Creating tailwind.config.js..."
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5B5FEF',
        secondary: '#7B61FF',
        accent: '#00D4FF',
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        dark: {
          900: '#0F172A',
          800: '#1E293B',
          700: '#334155',
        },
        light: {
          50: '#F8FAFC',
          100: '#F1F5F9',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 12px rgba(0, 0, 0, 0.08)',
        'medium': '0 4px 24px rgba(0, 0, 0, 0.12)',
      },
      borderRadius: {
        'lg': '12px',
        'xl': '16px',
      },
    },
  },
  plugins: [],
}
EOF

echo "📝 Creating postcss.config.js..."
cat > postcss.config.js << 'EOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

echo "📝 Creating index.html..."
cat > index.html << 'EOF'
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/vite.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ToBeDone - Team Collaboration Platform</title>
  <meta name="description" content="A modern cloud-based team collaboration platform with AI-powered features" />
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
EOF

# ==================== SRC UTILS ====================

echo "📝 Creating src/utils/cn.js..."
cat > src/utils/cn.js << 'EOF'
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ')
}
EOF

echo "📝 Creating src/utils/constants.js..."
cat > src/utils/constants.js << 'EOF'
export const TASK_STATUS = {
  BACKLOG: 'backlog',
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  REVIEW: 'review',
  TESTING: 'testing',
  DONE: 'done',
}

export const TASK_STATUS_LABELS = {
  backlog: 'Backlog',
  todo: 'To Do',
  in_progress: 'In Progress',
  review: 'Review',
  testing: 'Testing',
  done: 'Done',
}

export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
}

export const TASK_PRIORITY_LABELS = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
}

export const TASK_PRIORITY_COLORS = {
  low: 'bg-blue-500',
  medium: 'bg-yellow-500',
  high: 'bg-orange-500',
  urgent: 'bg-red-500',
}

export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  MEMBER: 'member',
}

export const NOTIFICATION_TYPES = {
  TASK_ASSIGNED: 'task_assigned',
  TASK_DUE: 'task_due',
  COMMENT_MENTION: 'comment_mention',
  PROJECT_UPDATE: 'project_update',
  SYSTEM_ALERT: 'system_alert',
}

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'
EOF

echo "📝 Creating src/utils/formatters.js..."
cat > src/utils/formatters.js << 'EOF'
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
EOF

# ==================== SRC SERVICES ====================

echo "📝 Creating src/services/api.js..."
cat > src/services/api.js << 'EOF'
import axios from 'axios'
import { API_BASE_URL } from '../utils/constants.js'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
            refreshToken,
          })

          localStorage.setItem('accessToken', response.data.data.accessToken)

          originalRequest.headers.Authorization = `Bearer ${response.data.data.accessToken}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        localStorage.clear()
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export default api
EOF

# ==================== SRC HOOKS ====================

echo "📝 Creating src/hooks/useAuth.js..."
cat > src/hooks/useAuth.js << 'EOF'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
EOF

echo "📝 Creating src/hooks/useSocket.js..."
cat > src/hooks/useSocket.js << 'EOF'
import { useContext, useEffect } from 'react'
import { SocketContext } from '../context/SocketContext'

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider')
  }
  return context
}
EOF

# ==================== SRC CONTEXT ====================

echo "📝 Creating src/context/AuthContext.jsx..."
cat > src/context/AuthContext.jsx << 'EOF'
import { createContext, useState, useEffect } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        if (token) {
          const response = await api.get('/auth/me')
          setUser(response.data.data)
          setIsAuthenticated(true)
        }
      } catch (error) {
        localStorage.clear()
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      localStorage.setItem('accessToken', response.data.data.accessToken)
      localStorage.setItem('refreshToken', response.data.data.refreshToken)
      setUser(response.data.data.user)
      setIsAuthenticated(true)
      toast.success('Login successful')
      return true
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
      return false
    }
  }

  const register = async (firstName, lastName, email, password) => {
    try {
      await api.post('/auth/register', {
        firstName,
        lastName,
        email,
        password,
      })
      toast.success('Registration successful! Please verify your email.')
      return true
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
      return false
    }
  }

  const logout = () => {
    localStorage.clear()
    setUser(null)
    setIsAuthenticated(false)
    toast.success('Logged out successfully')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
EOF

echo "📝 Creating src/context/SocketContext.jsx..."
cat > src/context/SocketContext.jsx << 'EOF'
import { createContext, useEffect, useState } from 'react'
import io from 'socket.io-client'
import { SOCKET_URL } from '../utils/constants'
import { useAuth } from '../hooks/useAuth'

export const SocketContext = createContext()

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState([])
  const { isAuthenticated, user } = useAuth()

  useEffect(() => {
    if (!isAuthenticated || !user) return

    const newSocket = io(SOCKET_URL, {
      auth: {
        token: localStorage.getItem('accessToken'),
      },
    })

    newSocket.on('connect', () => {
      console.log('Socket connected')
    })

    newSocket.on('user:online', (data) => {
      setOnlineUsers((prev) => [...new Set([...prev, data.userId])])
    })

    newSocket.on('user:offline', (data) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== data.userId))
    })

    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [isAuthenticated, user])

  const emit = (event, data) => {
    if (socket) {
      socket.emit(event, data)
    }
  }

  const on = (event, callback) => {
    if (socket) {
      socket.on(event, callback)
    }
  }

  const off = (event, callback) => {
    if (socket) {
      socket.off(event, callback)
    }
  }

  return (
    <SocketContext.Provider
      value={{
        socket,
        onlineUsers,
        emit,
        on,
        off,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}
EOF

# ==================== SRC COMPONENTS COMMON ====================

echo "📝 Creating src/components/common/Button.jsx..."
cat > src/components/common/Button.jsx << 'EOF'
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
EOF

echo "📝 Creating src/components/common/Card.jsx..."
cat > src/components/common/Card.jsx << 'EOF'
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
EOF

echo "📝 Creating src/components/common/Badge.jsx..."
cat > src/components/common/Badge.jsx << 'EOF'
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
EOF

echo "📝 Creating src/components/common/Avatar.jsx..."
cat > src/components/common/Avatar.jsx << 'EOF'
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
EOF

echo "📝 Creating src/components/common/Input.jsx..."
cat > src/components/common/Input.jsx << 'EOF'
import { cn } from '../../utils/cn'

export const Input = ({
  label,
  error,
  className,
  type = 'text',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-light-50 mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        className={cn(
          'w-full px-4 py-2 bg-dark-900 border border-dark-700 rounded-lg text-light-50',
          'placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary',
          'transition-all duration-200',
          error && 'border-danger focus:border-danger focus:ring-danger',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-danger">{error}</p>
      )}
    </div>
  )
}
EOF

echo "📝 Creating src/components/common/Modal.jsx..."
cat > src/components/common/Modal.jsx << 'EOF'
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
EOF

echo "📝 Creating src/components/common/Loader.jsx..."
cat > src/components/common/Loader.jsx << 'EOF'
import { motion } from 'framer-motion'

export const Loader = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  }

  return (
    <motion.div
      className={`${sizes[size]} border-4 border-dark-700 border-t-primary rounded-full`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  )
}
EOF

echo "📝 Creating src/components/common/Table.jsx..."
cat > src/components/common/Table.jsx << 'EOF'
import { motion } from 'framer-motion'

export const Table = ({ columns, data, onRowClick }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-dark-700">
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-4 text-left text-sm font-semibold text-gray-400"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <motion.tr
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border-b border-dark-700 hover:bg-dark-700/50 transition-colors cursor-pointer"
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((column) => (
                <td key={column.key} className="px-6 py-4 text-sm text-light-50">
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
EOF

# ==================== SRC COMPONENTS LAYOUTS ====================

echo "📝 Creating src/components/layouts/Sidebar.jsx..."
cat > src/components/layouts/Sidebar.jsx << 'EOF'
import { useState } from 'react'
import { Link, useLocation, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'
import {
  FiHome,
  FiList,
  FiCheckCircle,
  FiCalendar,
  FiMessageSquare,
  FiSettings,
  FiLogOut,
} from 'react-icons/fi'
import { useAuth } from '../../hooks/useAuth'

const menuItems = [
  { icon: FiHome, label: 'Dashboard', href: '/dashboard' },
  { icon: FiCheckCircle, label: 'Tasks', href: '/tasks' },
  { icon: FiList, label: 'Projects', href: '/projects' },
  { icon: FiCalendar, label: 'Calendar', href: '/calendar' },
  { icon: FiMessageSquare, label: 'Chat', href: '/chat' },
  { icon: FiSettings, label: 'Settings', href: '/settings' },
]

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()

  return (
    <motion.aside
      className={cn(
        'bg-dark-800 border-r border-dark-700 h-screen flex flex-col',
        isCollapsed ? 'w-20' : 'w-64'
      )}
      initial={false}
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ duration: 0.3 }}
    >
      {/* Logo */}
      <div className={cn('p-6 flex items-center justify-between', isCollapsed && 'justify-center')}>
        {!isCollapsed && <h1 className="text-2xl font-bold text-primary">ToBeDone</h1>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        {menuItems.map(({ icon: Icon, label, href }) => {
          const isActive = location.pathname.startsWith(href)
          return (
            <Link
              key={href}
              to={href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-400 hover:text-white hover:bg-dark-700'
              )}
              title={isCollapsed ? label : ''}
            >
              <Icon size={20} />
              {!isCollapsed && <span>{label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="p-3 border-t border-dark-700">
        {!isCollapsed && (
          <div className="px-4 py-3 bg-dark-700 rounded-lg mb-3">
            <p className="text-sm font-medium text-light-50">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
        )}
        <button
          onClick={() => {
            logout()
            Navigate('/login')
          }}
          className="w-full flex items-center gap-3 px-4 py-3 text-danger hover:bg-danger/10 rounded-lg transition-colors"
          title={isCollapsed ? 'Logout' : ''}
        >
          <FiLogOut size={20} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.aside>
  )
}
EOF

echo "📝 Creating src/components/layouts/Navbar.jsx..."
cat > src/components/layouts/Navbar.jsx << 'EOF'
import { useState } from 'react'
import { cn } from '../../utils/cn'
import { Avatar } from '../common/Avatar'
import { FiBell, FiSearch, FiChevronDown } from 'react-icons/fi'
import { useAuth } from '../../hooks/useAuth'

export const Navbar = ({ notificationCount = 0 }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const { user } = useAuth()

  return (
    <nav className="bg-dark-800 border-b border-dark-700 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
      {/* Search */}
      <div className="flex-1 max-w-xs">
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-dark-900 border border-dark-700 rounded-lg text-light-50 placeholder-gray-500 focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-6 ml-6">
        {/* Notifications */}
        <button className="relative p-2 hover:bg-dark-700 rounded-lg transition-colors">
          <FiBell size={20} className="text-gray-400" />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full" />
          )}
        </button>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 p-2 hover:bg-dark-700 rounded-lg transition-colors"
          >
            <Avatar
              firstName={user?.firstName}
              lastName={user?.lastName}
              avatar={user?.avatar}
              size="sm"
            />
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium text-light-50">{user?.firstName}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
            <FiChevronDown size={16} className="text-gray-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-dark-700 rounded-lg shadow-lg border border-dark-600">
              <a href="/profile" className="block px-4 py-2 hover:bg-dark-600 text-light-50 text-sm rounded-t-lg">
                Profile
              </a>
              <a href="/settings" className="block px-4 py-2 hover:bg-dark-600 text-light-50 text-sm">
                Settings
              </a>
              <button className="w-full text-left px-4 py-2 hover:bg-dark-600 text-danger text-sm rounded-b-lg">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
EOF

echo "📝 Creating src/components/layouts/MainLayout.jsx..."
cat > src/components/layouts/MainLayout.jsx << 'EOF'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'

export const MainLayout = ({ children, navbar = true }) => {
  return (
    <div className="flex h-screen bg-dark-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {navbar && <Navbar />}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
EOF

echo "📝 Creating src/components/layouts/AuthLayout.jsx..."
cat > src/components/layouts/AuthLayout.jsx << 'EOF'
export const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
EOF

# ==================== SRC PAGES ====================

echo "📝 Creating src/pages/LoginPage.jsx..."
cat > src/pages/LoginPage.jsx << 'EOF'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthLayout } from '../components/layouts/AuthLayout'
import { Button } from '../components/common/Button'
import { Input } from '../components/common/Input'
import { Card } from '../components/common/Card'
import { useAuth } from '../hooks/useAuth'

export const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '' })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const success = await login(formData.email, formData.password)
    if (success) {
      navigate('/dashboard')
    }

    setLoading(false)
  }

  return (
    <AuthLayout>
      <Card className="border-primary/20">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-light-50 mb-2">Welcome Back</h1>
          <p className="text-gray-400">Login to your ToBeDone account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4 rounded" />
              <span className="text-gray-400">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-primary hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            loading={loading}
            className="w-full"
          >
            Sign In
          </Button>
        </form>

        <p className="mt-6 text-center text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </Card>
    </AuthLayout>
  )
}
EOF

echo "📝 Creating src/pages/RegisterPage.jsx..."
cat > src/pages/RegisterPage.jsx << 'EOF'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthLayout } from '../components/layouts/AuthLayout'
import { Button } from '../components/common/Button'
import { Input } from '../components/common/Input'
import { Card } from '../components/common/Card'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

export const RegisterPage = () => {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)

    const success = await register(
      formData.firstName,
      formData.lastName,
      formData.email,
      formData.password
    )

    if (success) {
      navigate('/login')
    }

    setLoading(false)
  }

  return (
    <AuthLayout>
      <Card className="border-primary/20">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-light-50 mb-2">Join ToBeDone</h1>
          <p className="text-gray-400">Create your account to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              placeholder="John"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <Input
              label="Last Name"
              name="lastName"
              placeholder="Doe"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <label className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4 rounded" required />
            <span className="text-sm text-gray-400">
              I agree to the Terms of Service and Privacy Policy
            </span>
          </label>

          <Button
            type="submit"
            loading={loading}
            className="w-full"
          >
            Create Account
          </Button>
        </form>

        <p className="mt-6 text-center text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </Card>
    </AuthLayout>
  )
}
EOF

echo "📝 Creating src/pages/DashboardPage.jsx..."
cat > src/pages/DashboardPage.jsx << 'EOF'
import { useState, useEffect } from 'react'
import { MainLayout } from '../components/layouts/MainLayout'
import { Card } from '../components/common/Card'
import { Badge } from '../components/common/Badge'
import { Loader } from '../components/common/Loader'
import { motion } from 'framer-motion'
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import api from '../services/api'

export const DashboardPage = () => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/analytics/user')
        setAnalytics(response.data.data)
      } catch (error) {
        console.error('Error fetching analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  const kpiData = [
    {
      title: 'Total Tasks',
      value: analytics?.taskCount || 0,
      change: '+12%',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Completed',
      value: analytics?.completedTasks || 0,
      change: '+8%',
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'In Progress',
      value: analytics?.pendingTasks || 0,
      change: '-2%',
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Overdue',
      value: analytics?.overdueTasks || 0,
      change: '+1%',
      color: 'from-red-500 to-red-600',
    },
  ]

  const chartData = [
    { name: 'Mon', tasks: 4 },
    { name: 'Tue', tasks: 3 },
    { name: 'Wed', tasks: 8 },
    { name: 'Thu', tasks: 5 },
    { name: 'Fri', tasks: 6 },
    { name: 'Sat', tasks: 2 },
    { name: 'Sun', tasks: 1 },
  ]

  const pieData = [
    { name: 'Completed', value: analytics?.completedTasks || 0 },
    { name: 'Pending', value: analytics?.pendingTasks || 0 },
    { name: 'Overdue', value: analytics?.overdueTasks || 0 },
  ]

  const COLORS = ['#22C55E', '#5B5FEF', '#EF4444']

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <Loader />
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-light-50">Dashboard</h1>
          <p className="text-gray-400 mt-2">Welcome back! Here's your productivity overview.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiData.map((kpi, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`bg-gradient-to-br ${kpi.color} p-6 text-white`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-80">{kpi.title}</p>
                    <p className="text-3xl font-bold mt-2">{kpi.value}</p>
                  </div>
                  <Badge variant="secondary">{kpi.change}</Badge>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <h3 className="text-lg font-bold text-light-50 mb-6">Weekly Tasks</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                  cursor={{ fill: 'rgba(91, 95, 239, 0.1)' }}
                />
                <Bar dataKey="tasks" fill="#5B5FEF" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <h3 className="text-lg font-bold text-light-50 mb-6">Task Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <Card>
          <h3 className="text-lg font-bold text-light-50 mb-6">Overall Completion</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Task Completion Rate</span>
                <span className="text-2xl font-bold text-primary">{analytics?.completionPercentage}%</span>
              </div>
              <div className="w-full h-3 bg-dark-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${analytics?.completionPercentage}%` }}
                  transition={{ duration: 1 }}
                  className="h-full bg-gradient-to-r from-primary to-secondary"
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  )
}
EOF

echo "📝 Creating src/pages/ProjectsPage.jsx..."
cat > src/pages/ProjectsPage.jsx << 'EOF'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MainLayout } from '../components/layouts/MainLayout'
import { Card } from '../components/common/Card'
import { Button } from '../components/common/Button'
import { Badge } from '../components/common/Badge'
import { Avatar } from '../components/common/Avatar'
import { Modal } from '../components/common/Modal'
import { Input } from '../components/common/Input'
import { Loader } from '../components/common/Loader'
import { motion } from 'framer-motion'
import { FiPlus, FiEdit, FiTrash2, FiUsers } from 'react-icons/fi'
import api from '../services/api'
import toast from 'react-hot-toast'

export const ProjectsPage = () => {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ name: '', description: '' })

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects')
      setProjects(response.data.data.projects)
    } catch (error) {
      toast.error('Failed to fetch projects')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProject = async (e) => {
    e.preventDefault()
    try {
      await api.post('/projects', formData)
      toast.success('Project created successfully')
      setShowModal(false)
      setFormData({ name: '', description: '' })
      fetchProjects()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create project')
    }
  }

  const handleDeleteProject = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/projects/${id}`)
        toast.success('Project deleted')
        fetchProjects()
      } catch (error) {
        toast.error('Failed to delete project')
      }
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <Loader />
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-light-50">Projects</h1>
            <p className="text-gray-400 mt-2">Manage and organize your projects</p>
          </div>
          <Button onClick={() => setShowModal(true)} className="gap-2">
            <FiPlus size={20} />
            New Project
          </Button>
        </div>

        {projects.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-gray-400 mb-4">No projects yet. Create one to get started!</p>
            <Button onClick={() => setShowModal(true)}>Create First Project</Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate(`/projects/${project._id}`)}
                className="cursor-pointer"
              >
                <Card className="hover:shadow-medium transition-all h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl">
                        {project.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-light-50">{project.name}</h3>
                        <Badge variant="secondary" className="mt-1">
                          {project.members?.length || 0} Members
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-dark-700 rounded-lg transition-colors">
                        <FiEdit size={16} />
                      </button>
                      <button
                        className="p-2 hover:bg-danger/10 text-danger rounded-lg transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteProject(project._id)
                        }}
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>

                  <div className="flex items-center gap-2 pt-4 border-t border-dark-700">
                    <FiUsers size={16} className="text-gray-400" />
                    <div className="flex -space-x-2">
                      {project.members?.slice(0, 3).map((member) => (
                        <Avatar
                          key={member._id}
                          firstName={member.firstName}
                          lastName={member.lastName}
                          size="sm"
                        />
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Create New Project"
          footer={
            <>
              <Button variant="ghost" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateProject}>Create</Button>
            </>
          }
        >
          <form className="space-y-4">
            <Input
              label="Project Name"
              placeholder="e.g., Website Redesign"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <div>
              <label className="block text-sm font-medium text-light-50 mb-2">
                Description
              </label>
              <textarea
                placeholder="Describe your project..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 bg-dark-900 border border-dark-700 rounded-lg text-light-50 placeholder-gray-500 focus:outline-none focus:border-primary"
                rows="4"
              />
            </div>
          </form>
        </Modal>
      </div>
    </MainLayout>
  )
}
EOF

echo "📝 Creating src/pages/TasksPage.jsx..."
cat > src/pages/TasksPage.jsx << 'EOF'
import { useState, useEffect } from 'react'
import { MainLayout } from '../components/layouts/MainLayout'
import { Card } from '../components/common/Card'
import { Button } from '../components/common/Button'
import { Badge } from '../components/common/Badge'
import { Avatar } from '../components/common/Avatar'
import { Modal } from '../components/common/Modal'
import { Input } from '../components/common/Input'
import { Loader } from '../components/common/Loader'
import { motion } from 'framer-motion'
import { FiPlus, FiCheck } from 'react-icons/fi'
import api from '../services/api'
import { TASK_STATUS_LABELS, TASK_PRIORITY_LABELS } from '../utils/constants'
import toast from 'react-hot-toast'

export const TasksPage = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [filter, setFilter] = useState('all')
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState('')

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    if (selectedProject) {
      fetchTasks()
    }
  }, [selectedProject])

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects')
      setProjects(response.data.data.projects)
      if (response.data.data.projects.length > 0) {
        setSelectedProject(response.data.data.projects[0]._id)
      }
    } catch (error) {
      toast.error('Failed to fetch projects')
    }
  }

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/tasks/project/${selectedProject}`)
      setTasks(response.data.data.tasks)
    } catch (error) {
      toast.error('Failed to fetch tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, { status: newStatus })
      toast.success('Task updated')
      fetchTasks()
    } catch (error) {
      toast.error('Failed to update task')
    }
  }

  const filteredTasks = filter === 'all' ? tasks : tasks.filter((t) => t.status === filter)

  if (loading && tasks.length === 0) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <Loader />
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-light-50">Tasks</h1>
            <p className="text-gray-400 mt-2">Manage and track your work</p>
          </div>
          <Button onClick={() => setShowModal(true)} className="gap-2">
            <FiPlus size={20} />
            New Task
          </Button>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="bg-dark-800 border border-dark-700 rounded-lg px-4 py-2 text-light-50 focus:outline-none focus:border-primary"
          >
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-dark-800 border border-dark-700 rounded-lg px-4 py-2 text-light-50 focus:outline-none focus:border-primary"
          >
            <option value="all">All Status</option>
            <option value="backlog">Backlog</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="review">Review</option>
            <option value="testing">Testing</option>
            <option value="done">Done</option>
          </select>
        </div>

        {filteredTasks.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-gray-400">No tasks yet. Create one to get started!</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task, index) => (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="flex items-center justify-between hover:shadow-medium transition-all p-4">
                  <div className="flex items-center gap-4 flex-1">
                    <button
                      onClick={() => handleUpdateTaskStatus(task._id, 'done')}
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                        task.status === 'done'
                          ? 'bg-success border-success text-white'
                          : 'border-gray-600 hover:border-success'
                      }`}
                    >
                      {task.status === 'done' && <FiCheck size={16} />}
                    </button>

                    <div className="flex-1">
                      <h3 className={`font-semibold transition-all ${
                        task.status === 'done'
                          ? 'text-gray-400 line-through'
                          : 'text-light-50'
                      }`}>
                        {task.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-2">
                        <Badge variant={task.priority === 'urgent' ? 'danger' : task.priority === 'high' ? 'warning' : 'default'}>
                          {TASK_PRIORITY_LABELS[task.priority]}
                        </Badge>
                        <span className="text-xs text-gray-500">{TASK_STATUS_LABELS[task.status]}</span>
                        {task.dueDate && (
                          <span className="text-xs text-gray-500">
                            Due {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {task.assignee && (
                    <Avatar
                      firstName={task.assignee.firstName}
                      lastName={task.assignee.lastName}
                      size="sm"
                    />
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  )
}
EOF

echo "📝 Creating src/pages/ChatPage.jsx..."
cat > src/pages/ChatPage.jsx << 'EOF'
import { useState, useEffect, useRef } from 'react'
import { MainLayout } from '../components/layouts/MainLayout'
import { Card } from '../components/common/Card'
import { Avatar } from '../components/common/Avatar'
import { Button } from '../components/common/Button'
import { Loader } from '../components/common/Loader'
import { motion } from 'framer-motion'
import { FiSend, FiPlus, FiSearch } from 'react-icons/fi'
import api from '../services/api'
import { useSocket } from '../hooks/useSocket'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

export const ChatPage = () => {
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { socket, emit, on } = useSocket()
  const messagesEndRef = useRef(null)

  useEffect(() => {
    fetchConversations()
  }, [])

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages()
    }
  }, [selectedConversation])

  useEffect(() => {
    if (on) {
      on('chat:new-message', (message) => {
        if (message.conversationId === selectedConversation?._id) {
          setMessages((prev) => [...prev, message])
        }
      })
    }
  }, [selectedConversation, on])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchConversations = async () => {
    try {
      const response = await api.get('/chat/conversations')
      setConversations(response.data.data)
      setLoading(false)
    } catch (error) {
      toast.error('Failed to fetch conversations')
      setLoading(false)
    }
  }

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/chat/messages/${selectedConversation._id}`)
      setMessages(response.data.data)
    } catch (error) {
      toast.error('Failed to fetch messages')
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    try {
      const response = await api.post('/chat/messages', {
        conversationId: selectedConversation._id,
        content: newMessage,
      })

      emit('chat:message-sent', {
        conversationId: selectedConversation._id,
        message: response.data.data,
      })

      setMessages((prev) => [...prev, response.data.data])
      setNewMessage('')
    } catch (error) {
      toast.error('Failed to send message')
    }
  }

  const getConversationName = (conversation) => {
    if (conversation.isGroup) {
      return conversation.name
    }
    const otherUser = conversation.participants.find((p) => p._id !== user._id)
    return otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : 'Unknown'
  }

  if (loading) {
    return (
      <MainLayout navbar={false}>
        <div className="flex items-center justify-center h-screen">
          <Loader />
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout navbar={false}>
      <div className="flex h-[calc(100vh-60px)] bg-dark-900">
        <div className="w-80 border-r border-dark-700 flex flex-col bg-dark-800">
          <div className="p-4 border-b border-dark-700">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-3 top-3 text-gray-500" size={18} />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2 bg-dark-900 border border-dark-700 rounded-lg text-light-50 placeholder-gray-500 focus:outline-none focus:border-primary"
                />
              </div>
              <Button size="sm">
                <FiPlus />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.map((conversation) => (
              <motion.button
                key={conversation._id}
                onClick={() => setSelectedConversation(conversation)}
                className={`w-full p-4 border-b border-dark-700 text-left transition-colors ${
                  selectedConversation?._id === conversation._id
                    ? 'bg-primary/10 border-primary'
                    : 'hover:bg-dark-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    firstName={conversation.participants[0]?.firstName}
                    lastName={conversation.participants[0]?.lastName}
                    size="md"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-light-50 truncate">
                      {getConversationName(conversation)}
                    </h3>
                    <p className="text-sm text-gray-400 truncate">
                      {conversation.lastMessage?.content || 'No messages'}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              <div className="border-b border-dark-700 p-4 bg-dark-800">
                <h2 className="text-lg font-bold text-light-50">
                  {getConversationName(selectedConversation)}
                </h2>
                <p className="text-sm text-gray-400">
                  {selectedConversation.participants.length} members
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => {
                  const isOwn = message.sender._id === user._id
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <Card className={`max-w-xs ${isOwn ? 'bg-primary text-white' : 'bg-dark-700'}`}>
                        <p>{message.content}</p>
                        <p className={`text-xs mt-2 ${isOwn ? 'text-white/70' : 'text-gray-500'}`}>
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </p>
                      </Card>
                    </motion.div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-dark-700 bg-dark-800">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 bg-dark-900 border border-dark-700 rounded-lg text-light-50 placeholder-gray-500 focus:outline-none focus:border-primary"
                  />
                  <Button type="submit" size="sm">
                    <FiSend />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400">Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
EOF

echo "📝 Creating src/pages/NotFoundPage.jsx..."
cat > src/pages/NotFoundPage.jsx << 'EOF'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/common/Button'

export const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <div className="text-9xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          404
        </div>
        <div>
          <h1 className="text-4xl font-bold text-light-50 mb-2">Page Not Found</h1>
          <p className="text-gray-400">Sorry, the page you're looking for doesn't exist.</p>
        </div>
        <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
      </div>
    </div>
  )
}
EOF

# ==================== SRC ROUTES ====================

echo "📝 Creating src/routes/ProtectedRoute.jsx..."
cat > src/routes/ProtectedRoute.jsx << 'EOF'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Loader } from '../components/common/Loader'

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return children
}
EOF

echo "📝 Creating src/routes/router.jsx..."
cat > src/routes/router.jsx << 'EOF'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'

// Pages
import { LoginPage } from '../pages/LoginPage'
import { RegisterPage } from '../pages/RegisterPage'
import { DashboardPage } from '../pages/DashboardPage'
import { ProjectsPage } from '../pages/ProjectsPage'
import { TasksPage } from '../pages/TasksPage'
import { ChatPage } from '../pages/ChatPage'
import { NotFoundPage } from '../pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/projects',
    element: (
      <ProtectedRoute>
        <ProjectsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/tasks',
    element: (
      <ProtectedRoute>
        <TasksPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/chat',
    element: (
      <ProtectedRoute>
        <ChatPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/',
    element: <Navigate to="/dashboard" />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
EOF

# ==================== SRC STYLES ====================

echo "📝 Creating src/styles/globals.css..."
cat > src/styles/globals.css << 'EOF'
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background-color: #0f172a;
  color: #f8fafc;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #1e293b;
}

::-webkit-scrollbar-thumb {
  background: #475569;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}

.animate-slideUp {
  animation: slideUp 0.3s ease-in-out;
}
EOF

# ==================== SRC APP & MAIN ====================

echo "📝 Creating src/App.jsx..."
cat > src/App.jsx << 'EOF'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'
import { Toaster } from 'react-hot-toast'
import { router } from './routes/router'
import './styles/globals.css'

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" />
      </SocketProvider>
    </AuthProvider>
  )
}

export default App
EOF

echo "📝 Creating src/main.jsx..."
cat > src/main.jsx << 'EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
EOF

echo "✅ Frontend setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Install dependencies: npm install"
echo "2. Create .env file: cp .env.example .env"
echo "3. Update .env with your API and Socket URLs"
echo "4. Start the development server: npm run dev"
echo ""
echo "🎉 Your frontend is ready to use!"
