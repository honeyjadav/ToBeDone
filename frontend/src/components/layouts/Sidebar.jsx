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
