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
