import { Link } from 'react-router-dom'
import arrowLeftIcon from '../assets/icons/arrow-left-2.png'
import authImage from '../assets/images/image 13 (1).png'

function AuthLayout({ children, backLabel = 'بازگشت', backTo = '/' }) {
  return (
    <div className="min-h-screen bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="min-h-screen flex flex-col justify-center px-6 sm:px-10 lg:px-16">
          <div className="absolute top-8 right-8">
            <Link
              to={backTo}
              className="inline-flex items-center gap-3 text-body-md font-normal text-primary"
            >
              <span className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center">
                <img src={arrowLeftIcon} alt="" className="w-4 h-4" />
              </span>
              {backLabel}
            </Link>
          </div>

          <div className="w-full max-w-md mx-auto">{children}</div>
        </div>

        <div className="hidden lg:block relative min-h-screen">
          <img
            src={authImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute inset-0 flex items-center justify-center p-10">
            <div className="bg-primary/80 text-white rounded-3xl p-8 max-w-md text-right">
              <h2 className="text-section-title font-semibold mb-4">
                به مانی‌وی خوش آمدی دوست من! 👋
              </h2>
              <p className="text-body-lg font-normal leading-relaxed">
                بهترین آموزش‌های ممکن برای زندگی در عصر هوش مصنوعی به صورت پروژه محور با حضور اساتید بسیار حرفه‌ای و مجرب
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
