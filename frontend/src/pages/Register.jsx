import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { requestOtp } from '../services/auth.service'

const STORAGE_KEY = 'auth_phone'
const REGISTER_DATA_KEY = 'auth_register_data'

function Register() {
  const navigate = useNavigate()
  const [formValues, setFormValues] = useState({
    fullName: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    const { fullName, phone, password, confirmPassword } = formValues
    if (!phone || !phone.trim()) {
      setError('شماره تماس الزامی است.')
      return
    }
    if (!fullName || fullName.trim().length < 2) {
      setError('نام و نام خانوادگی باید حداقل ۲ کاراکتر باشد.')
      return
    }
    if (!password || password.length < 6) {
      setError('رمز عبور باید حداقل ۶ کاراکتر باشد.')
      return
    }
    if (password !== confirmPassword) {
      setError('رمز عبور و تکرار آن یکسان نیستند.')
      return
    }
    setError('')
    setIsSubmitting(true)
    try {
      const res = await requestOtp(phone.trim())
      localStorage.setItem(STORAGE_KEY, phone.trim())
      localStorage.setItem(REGISTER_DATA_KEY, JSON.stringify({ fullName: fullName.trim(), password }))
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
    <AuthLayout backLabel="بازگشت به صفحه ورود" backTo="/login">
      <div className="text-right">
        <h1 className="text-h1 font-bold text-text-primary mb-2">مانی‌وی</h1>
        <p className="text-body-lg font-normal text-text-secondary mb-8">
          جهت عضویت فرم زیر را با دقت تکمیل نمایید
        </p>

        <form onSubmit={(event) => event.preventDefault()} className="space-y-5">
          <input
            type="text"
            placeholder="نام و نام خانوادگی"
            value={formValues.fullName}
            onChange={(event) => handleChange('fullName', event.target.value)}
            className="w-full rounded-2xl border border-gray-300 px-5 py-4 text-body-lg font-semibold text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary"
          />
          <input
            type="tel"
            inputMode="numeric"
            placeholder="شماره تماس مثال: 09123456789"
            value={formValues.phone}
            onChange={(event) => handleChange('phone', event.target.value)}
            className="w-full rounded-2xl border border-gray-300 px-5 py-4 text-body-lg font-semibold text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary"
          />
          <input
            type="password"
            placeholder="رمز عبور"
            value={formValues.password}
            onChange={(event) => handleChange('password', event.target.value)}
            className="w-full rounded-2xl border border-gray-300 px-5 py-4 text-body-lg font-semibold text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary"
          />
          <input
            type="password"
            placeholder="تکرار رمز عبور"
            value={formValues.confirmPassword}
            onChange={(event) =>
              handleChange('confirmPassword', event.target.value)
            }
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
      </div>
    </AuthLayout>
  )
}

export default Register
