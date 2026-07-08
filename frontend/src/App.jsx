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
