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
