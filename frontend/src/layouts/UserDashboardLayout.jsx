import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { useAuth } from '../context/AuthContext'
import bellIcon from '../assets/icons/notification-bell.png'
import cartIcon from '../assets/icons/cart-1.png'
import searchIcon from '../assets/icons/Vector.svg'
import playIcon from '../assets/icons/play.png'
import walletIcon from '../assets/icons/wallet.png'
import pencilIcon from '../assets/icons/pencil.png'
import chatIcon from '../assets/icons/chat-bubble-circle-typing-messeage.png'

const sidebarItems = [
  { path: '/dashboard', label: 'صفحه اصلی', icon: playIcon },
  { path: '/dashboard/my-courses', label: 'دوره‌های آموزشی', icon: playIcon },
  { path: '/dashboard/wallet', label: 'شارژ کیف پول', icon: walletIcon },
  { path: '/dashboard/profile', label: 'ویرایش پروفایل', icon: pencilIcon },
  { path: '/dashboard/support', label: 'پشتیبانی', icon: chatIcon },
]

function UserDashboardLayout() {
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
            <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-body-md text-text-secondary">
                سه شنبه ۹ دی
              </div>
              <div className="flex items-center gap-4">
                <img src={bellIcon} alt="" className="w-5 h-5" />
                <img src={cartIcon} alt="" className="w-5 h-5" />
              </div>
              <div className="relative w-72 hidden md:block">
                <img
                  src={searchIcon}
                  alt=""
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4"
                />
                <input
                  type="text"
                  placeholder="دوره های من، تیکت ها..."
                  className="w-full pr-10 pl-4 py-3 rounded-xl bg-gray-100 text-body-md text-text-primary placeholder:text-text-secondary focus:outline-none"
                />
              </div>
            </div>

            <Outlet />
          </main>

          <Sidebar user={user} items={sidebarItems} onLogout={handleLogout} />
        </div>
      </div>
    </div>
  )
}

export default UserDashboardLayout
