import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { requestOtp } from '../services/auth.service'

const STORAGE_KEY = 'auth_phone'

function Login() {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const storedPhone = localStorage.getItem(STORAGE_KEY)
    if (storedPhone) {
      setPhone(storedPhone)
    }
  }, [])

  const handleSubmit = async () => {
    if (!phone) {
      setError('شماره تماس الزامی است.')
      return
    }
    setError('')
    setIsSubmitting(true)
    try {
      const res = await requestOtp(phone)
      localStorage.setItem(STORAGE_KEY, phone)
      if (res?.otp) {
        localStorage.setItem('auth_otp_debug', res.otp)
      }
      navigate('/verify-otp')
    } catch (err) {
      setError(err?.response?.data?.message || 'ارسال کد تایید ناموفق بود.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout backLabel="صفحه اصلی" backTo="/">
      <div className="text-right">
        <h1 className="text-h1 font-bold text-text-primary mb-2">مانی‌وی</h1>
        <p className="text-body-lg font-normal text-text-secondary mb-8">
          برای ورود شماره تماس خود را وارد کنید.
        </p>

        <form onSubmit={(event) => event.preventDefault()} className="space-y-6">
          <input
            type="tel"
            inputMode="numeric"
            placeholder="0912"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="w-full rounded-2xl border border-gray-300 px-5 py-4 text-body-lg font-semibold text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary"
          />

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-primary py-4 text-button font-semibold text-white hover:opacity-95 transition-opacity disabled:opacity-70"
          >
            {isSubmitting ? <LoadingSpinner size="sm" className="text-white" /> : 'ارسال کد تایید'}
          </button>
        </form>

        {error ? (
          <p className="text-body-md font-normal text-red-500 mt-4 text-right">{error}</p>
        ) : null}

        <p className="text-body-md font-normal text-text-secondary mt-6">
          اگر تا الان ثبت‌نام نکرده‌اید،{' '}
          <Link to="/register" className="text-primary font-semibold hover:underline">
            همین الان عضو شوید!
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}

export default Login
