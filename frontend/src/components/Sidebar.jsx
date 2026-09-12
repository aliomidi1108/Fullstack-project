import { NavLink } from 'react-router-dom'
import logoutIcon from '../assets/icons/logout.png'
import userIcon from '../assets/icons/user.png'

function Sidebar({ user, items, onLogout, className = '' }) {
  return (
    <aside className={`bg-white rounded-2xl border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
          <img
            src={user?.avatar || userIcon}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-right">
          <p className="text-body-lg font-semibold text-text-primary">
            {user?.name || 'کاربر'}
          </p>
          <p className="text-body-md font-normal text-text-secondary">{user?.phone}</p>
        </div>
      </div>

      <nav className="pt-4 space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-body-md transition-colors ${
                isActive
                  ? 'bg-gray-50 text-text-primary font-semibold'
                  : 'text-text-secondary hover:text-text-primary'
              }`
            }
          >
            {item.icon && <img src={item.icon} alt="" className="w-5 h-5" />}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {onLogout && (
        <button
          type="button"
          onClick={onLogout}
          className="mt-6 w-full flex items-center justify-center gap-2 text-body-md text-error"
        >
          <img src={logoutIcon} alt="" className="w-5 h-5" />
          خروج از حساب
        </button>
      )}
    </aside>
  )
}

export default Sidebar
