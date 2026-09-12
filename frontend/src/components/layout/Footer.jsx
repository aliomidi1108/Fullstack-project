/**
 * Footer Component
 * 
 * Main footer component matching Figma design pixel-perfectly.
 * Includes logo, navigation links, download app section, and social media.
 */
import { Link } from 'react-router-dom'
import logoImage from '../../assets/images/logo.png'
import instagramIcon from '../../assets/icons/instagram.png'
import telegramIcon from '../../assets/icons/telegram-2.svg'
import downloadIcon from '../../assets/icons/download.png'
import googleIcon from '../../assets/icons/google-seg.svg'
import gmailIcon from '../../assets/icons/gmail-simple.svg'

function Footer() {
  return (
    <footer className="bg-gray-50 mt-auto">
      <div className="container mx-auto px-4 pt-10">
        <div className="bg-white rounded-t-[48px] shadow-[0_-12px_30px_rgba(0,0,0,0.06)] px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-10">
            {/* Column 1 - Academy Info (Rightmost in RTL) */}
            <div className="space-y-4 md:col-span-2">
              <div className="flex items-center gap-3">
                <img src={logoImage} alt="آکادمی مانی وی" className="w-12 h-12 rounded-full object-cover" />
                <span className="text-body-lg font-semibold text-text-primary">
                  آکادمی مانی وی
                </span>
              </div>
              {/* Description - 18px Regular per typography guide */}
              <p className="text-body-lg font-normal text-text-secondary">
                بزرگترین آکادمی عکاسی در ایران. ما مهارت‌هایی را آموزش می‌دهیم که در عصر هوش مصنوعی نابود نمی‌شوند.
              </p>
            </div>
            
            {/* Column 2 - Educational Courses */}
            <div>
              {/* Column Title - 20px SemiBold per typography guide */}
              <h3 className="text-card-title font-semibold text-text-primary mb-4">دوره های آموزشی</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/courses" className="text-body-md text-text-secondary hover:text-primary transition-colors">
                    دوره های جامع
                  </Link>
                </li>
                <li>
                  <Link to="/courses" className="text-body-md text-text-secondary hover:text-primary transition-colors">
                    دوره های تخصصی
                  </Link>
                </li>
                <li>
                  <Link to="/articles" className="text-body-md text-text-secondary hover:text-primary transition-colors">
                    مقالات
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Column 3 - Services */}
            <div>
              {/* Column Title - 20px SemiBold per typography guide */}
              <h3 className="text-card-title font-semibold text-text-primary mb-4">خدمات</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/consultation" className="text-body-md text-text-secondary hover:text-primary transition-colors">
                    مشاوره تخصصی
                  </Link>
                </li>
                <li>
                  <Link to="/support" className="text-body-md text-text-secondary hover:text-primary transition-colors">
                    پشتیبانی
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-body-md text-text-secondary hover:text-primary transition-colors">
                    سوالات متداول
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Column 4 - Support */}
            <div>
              {/* Column Title - 20px SemiBold per typography guide */}
              <h3 className="text-card-title font-semibold text-text-primary mb-4">پشتیبانی</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/contact" className="text-body-md text-text-secondary hover:text-primary transition-colors">
                    تماس با ما
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-body-md text-text-secondary hover:text-primary transition-colors">
                    درباره ما
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-body-md text-text-secondary hover:text-primary transition-colors">
                    حریم خصوصی
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Download App */}
         
          
          {/* Social Media Icons */}
          
          
          {/* Copyright */}
          <div className="border-t border-gray-200 pt-6 text-center">
            <p className="text-body-md text-text-secondary">
              © {new Date().getFullYear()} آکادمی مانی وی. تمامی حقوق محفوظ است.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
