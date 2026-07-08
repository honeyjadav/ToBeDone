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
