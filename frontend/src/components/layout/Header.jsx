import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import logoImage from '../../assets/images/logo.png'
import menuIcon from '../../assets/icons/menu.png'
import xIcon from '../../assets/icons/x.png'
import searchIcon from '../../assets/icons/Vector.svg'
import userIcon from '../../assets/icons/user.png'
import playIcon from '../../assets/icons/play.png'
import circleQuestionIcon from '../../assets/icons/circle-question.png'
import chatBubbleIcon from '../../assets/icons/chat-bubble-circle-typing-messeage.png'
import GlobalSearch from '../GlobalSearch'
import { useAuth } from '../../context/AuthContext'

/**
 * Header Component
 * Main navigation with global search across entire site.
 */
function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [localSearch, setLocalSearch] = useState('')
  const { pathname } = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const isOnCoursesPage = pathname === '/courses'
  const searchQuery = isOnCoursesPage ? (searchParams.get('q') || '') : localSearch
  const { isAuthenticated, user } = useAuth()

  const handleSearchChange = (value) => {
    setLocalSearch(value)
    if (isOnCoursesPage) {
      if (value.trim()) {
        setSearchParams({ q: value.trim() })
      } else {
        setSearchParams({})
      }
    }
  }
  
  return (
    <>
      <header className="bg-white fixed top-0 left-0 right-0 z-50 border-b border-gray-100">
        <nav className="container mx-auto px-4 lg:px-10 py-4">
          <div className="flex items-center justify-between">
            {/* Logo Section (Right side in RTL) */}
            <Link to="/" className="flex items-center gap-3">
              <img
                src={logoImage}
                alt="آکادمی مانی وی"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <span className="text-body-lg font-semibold text-primary">
                  آکادمی مانی وی
                </span>
                <span className="text-body-md font-normal text-text-secondary">
                  بزرگترین آکادمی عکاسی در ایران
                </span>
              </div>
            </Link>
            
            {/* Navigation Links - Hidden on mobile */}
            <div className="hidden lg:flex items-center gap-8">
              <Link 
                to="/" 
                className="text-body-md font-normal text-text-primary hover:text-primary transition-colors"
              >
                خانه
              </Link>
              <Link 
                to="/courses" 
                className="text-body-md font-normal text-text-primary hover:text-primary transition-colors"
              >
                دوره های آموزشی
              </Link>
              <Link 
                to="/about" 
                className="text-body-md font-normal text-text-primary hover:text-primary transition-colors"
              >
                درباره ما
              </Link>
              <Link 
                to="/blog" 
                className="text-body-md font-normal text-text-primary hover:text-primary transition-colors"
              >
                مقالات
              </Link>
              <Link 
                to="/contact" 
                className="text-body-md font-normal text-text-primary hover:text-primary transition-colors"
              >
                تماس با ما
              </Link>
            </div>
            
            {/* Search Bar and Login Button - Hidden on mobile */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="relative">
                <GlobalSearch
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder=""
                  searchIcon={searchIcon}
                  variant="expandable"
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer transition-all duration-300 ease-out overflow-hidden focus-within:w-56 focus-within:rounded-2xl focus-within:bg-white focus-within:border-2 focus-within:border-primary focus-within:shadow-lg focus-within:ring-2 focus-within:ring-primary/10"
                  inputClassName="pl-4 py-2 text-body-md text-text-primary focus:outline-none placeholder:text-text-secondary/60"
                />
              </div>
              
              {/* Login / Avatar */}
              {isAuthenticated ? (
                <Link to="/dashboard" className="flex items-center gap-3">
                  <img
                    src={user?.avatar || userIcon}
                    alt="آواتار"
                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                  />
                  <span className="text-body-md text-text-primary">
                    {user?.name || 'حساب کاربری'}
                  </span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-1.5 text-body-sm font-normal text-primary border-2 border-primary rounded-full hover:bg-primary hover:text-white transition-colors"
                >
                  وارد شوید
                </Link>
              )}
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2 text-text-primary"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Toggle menu"
            >
              <img src={menuIcon} alt="Menu" className="w-6 h-6" />
            </button>
          </div>
        </nav>
      </header>
      
      {/* Mobile Sidebar Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white shadow-xl">
            <div className="relative h-full p-6 space-y-6">
              {/* Close Button */}
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-4 left-4 p-2 text-primary"
                aria-label="Close menu"
              >
                <img src={xIcon} alt="Close" className="w-6 h-6" />
              </button>
              
              {/* Logo Section */}
              <div className="flex flex-col items-center gap-2 pt-6">
                <img src={logoImage} alt="آکادمی مانی وی" className="w-14 h-14 rounded-full" />
                <span className="text-body-lg font-semibold text-primary">آکادمی مانی وی</span>
                <span className="text-body-md font-normal text-text-secondary">
                  بزرگترین آکادمی عکاسی در ایران
                </span>
                <div className="w-20 h-[2px] bg-primary mt-2" />
              </div>
              
              {/* Global Search - mobile */}
              <div className="relative">
                <GlobalSearch
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder=""
                  searchIcon={searchIcon}
                  onSelect={() => setIsMobileMenuOpen(false)}
                  className="w-full rounded-2xl bg-gray-100 border border-gray-200 py-3 transition-all duration-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
                  inputClassName="w-full pl-4 pr-12 py-2 text-body-md text-text-primary bg-transparent focus:outline-none"
                />
              </div>
              
              {/* Navigation Links */}
              <nav className="space-y-5">
                <Link 
                  to="/" 
                  className="flex items-center gap-3 text-body-md font-normal text-text-primary hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <img src={userIcon} alt="" className="w-5 h-5" />
                  خانه
                </Link>
                <Link 
                  to="/courses" 
                  className="flex items-center gap-3 text-body-md font-normal text-text-primary hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <img src={playIcon} alt="" className="w-5 h-5" />
                  دوره های آموزشی
                </Link>
                <Link 
                  to="/about" 
                  className="flex items-center gap-3 text-body-md font-normal text-text-primary hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <img src={circleQuestionIcon} alt="" className="w-5 h-5" />
                  درباره ما
                </Link>
                <Link 
                  to="/blog" 
                  className="flex items-center gap-3 text-body-md font-normal text-text-primary hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <img src={circleQuestionIcon} alt="" className="w-5 h-5" />
                  مقالات
                </Link>
                <Link 
                  to="/contact" 
                  className="flex items-center gap-3 text-body-md font-normal text-text-primary hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <img src={chatBubbleIcon} alt="" className="w-5 h-5" />
                  تماس با ما
                </Link>
              </nav>
              
              {/* Bottom Section */}
              <div className="absolute bottom-6 left-6 right-6 space-y-4">
                <Link 
                  to="/contact" 
                  className="flex items-center gap-3 text-body-md font-normal text-text-primary hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <img src={chatBubbleIcon} alt="" className="w-5 h-5" />
                  با ما تماس بگیرید
                </Link>
                {isAuthenticated ? (
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-3 text-body-md font-normal text-text-primary hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <img src={user?.avatar || userIcon} alt="" className="w-5 h-5 rounded-full" />
                    حساب کاربری
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center gap-3 text-body-md font-normal text-text-primary hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <img src={userIcon} alt="" className="w-5 h-5" />
                    وارد شوید | ثبت نام کنید
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Header
