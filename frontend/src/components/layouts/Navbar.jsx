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
