import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { useAuth } from '../context/AuthContext'
import chartIcon from '../assets/icons/alert-triangle.png'
import reportIcon from '../assets/icons/info-circle.png'

const sidebarItems = [
  { path: '/admin/dashboard', label: 'داشبورد', icon: chartIcon },
  { path: '/admin/reports', label: 'گزارش ها', icon: reportIcon },
]

function AdminDashboardLayout() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          <main className="space-y-6">
            <Outlet />
          </main>
          <Sidebar user={user} items={sidebarItems} onLogout={handleLogout} />
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardLayout
