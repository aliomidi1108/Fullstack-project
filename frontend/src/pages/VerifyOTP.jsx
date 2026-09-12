import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import OTPInput from '../components/OTPInput'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { useAuth } from '../context/AuthContext'
import { requestOtp, verifyOtp } from '../services/auth.service'

const STORAGE_KEY = 'auth_phone'

function VerifyOTP() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', ''])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const storedPhone = localStorage.getItem(STORAGE_KEY)
    if (!storedPhone) {
      navigate('/login')
      return
    }
    const debugOtp = localStorage.getItem('auth_otp_debug')
    if (debugOtp && debugOtp.length === 6) {
      const digits = debugOtp.split('')
      setOtpValues(digits)
      localStorage.removeItem('auth_otp_debug')
    }
  }, [navigate])

  const phone = useMemo(() => localStorage.getItem(STORAGE_KEY) || '', [])

  const handleOtpChange = (index, value) => {
    const nextValues = [...otpValues]
    nextValues[index] = value.replace(/\D/g, '')
    setOtpValues(nextValues)
  }

  const handleSubmit = async () => {
    if (!phone) {
      navigate('/login')
      return
    }
    const otp = otpValues.join('')
    if (otp.length !== otpValues.length) {
      setError('کد تایید را کامل وارد کنید.')
      return
    }
    setError('')
    setIsSubmitting(true)
    try {
      const data = await verifyOtp({ phone, otp })
      login({ user: data.user, token: data.token })
      navigate('/dashboard')
    } catch (err) {
      setError(err?.response?.data?.message || 'کد تایید معتبر نیست.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResend = async () => {
    if (!phone) {
      navigate('/login')
      return
    }
    setError('')
    setIsResending(true)
    try {
      await requestOtp(phone)
    } catch (err) {
      setError(err?.response?.data?.message || 'ارسال مجدد کد ناموفق بود.')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <AuthLayout backLabel="بازگشت" backTo="/login">
      <div className="text-right">
        <h1 className="text-h1 font-bold text-text-primary mb-2">مانی‌وی</h1>
        <p className="text-body-lg font-normal text-text-secondary mb-8">
          لطفاً کد تایید پیامک شده را وارد نمایید.
        </p>

        <form onSubmit={(event) => event.preventDefault()} className="space-y-6">
          <OTPInput values={otpValues} onChange={handleOtpChange} />

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-primary py-4 text-button font-semibold text-white hover:opacity-95 transition-opacity disabled:opacity-70"
          >
            {isSubmitting ? <LoadingSpinner size="sm" className="text-white" /> : 'تایید'}
          </button>
        </form>

        {error ? (
          <p className="text-body-md font-normal text-red-500 mt-4 text-right">{error}</p>
        ) : null}

        <p className="text-body-md font-normal text-text-secondary mt-6">
          کد برای من ارسال نشده؟{' '}
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="text-primary font-semibold disabled:opacity-70"
          >
            {isResending ? 'در حال ارسال...' : 'ارسال مجدد'}
          </button>
        </p>
      </div>
    </AuthLayout>
  )
}

export default VerifyOTP
