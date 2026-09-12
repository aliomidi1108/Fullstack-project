import { Link, useLocation } from 'react-router-dom'
import logo from '../../assets/images/logo.png'
import xIcon from '../../assets/icons/x.png'
import searchIcon from '../../assets/icons/Vector.svg'
import userIcon from '../../assets/icons/user.png'

function MobileMenu({ isOpen, onClose, menuItems }) {
  const location = useLocation()
  const isActive = (path) => location.pathname === path

  if (!isOpen) return null

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full w-80 bg-white z-50 lg:hidden transform transition-transform duration-300 shadow-2xl overflow-y-auto">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <img src={logo} alt="Logo" className="h-10 w-auto" />
            <button
              onClick={onClose}
              className="p-2 text-text-primary"
              aria-label="Close menu"
            >
              <img src={xIcon} alt="" className="w-6 h-6" />
            </button>
          </div>

          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <input
                type="text"
                placeholder="جستجو..."
                className="w-full px-4 py-3 pr-10 rounded-full border-2 border-text-secondary text-body-md font-normal text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary"
              />
              <img
                src={searchIcon}
                alt=""
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
              />
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`block px-4 py-3 rounded-full text-body-md font-normal transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary text-white'
                    : 'text-text-primary hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200 space-y-3">
            <Link
              to="/login"
              onClick={onClose}
              className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-full border-2 border-primary text-primary text-body-md font-normal hover:bg-primary hover:text-white transition-all"
            >
              <img src={userIcon} alt="" className="w-5 h-5" />
              ورود
            </Link>
            <Link
              to="/register"
              onClick={onClose}
              className="flex items-center justify-center w-full px-6 py-3 rounded-full bg-primary text-white text-body-md font-normal hover:opacity-90 transition-all"
            >
              ثبت نام
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default MobileMenu
