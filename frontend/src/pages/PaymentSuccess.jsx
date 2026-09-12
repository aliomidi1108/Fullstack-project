import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getMe } from '../services/auth.service'
import { useAuth } from '../context/AuthContext'

function PaymentSuccess() {
  const [searchParams] = useSearchParams()
  const { updateUser } = useAuth()
  const refId = searchParams.get('refId')

  useEffect(() => {
    const refreshUser = async () => {
      try {
        const user = await getMe()
        updateUser(user)
      } catch {
        // ignore
      }
    }
    refreshUser()
  }, [updateUser])

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 text-right space-y-4">
          <h2 className="text-section-title font-semibold text-text-primary">پرداخت موفق</h2>
          <p className="text-body-md text-green-600">
            پرداخت با موفقیت انجام شد.
            {refId ? ` کد پیگیری: ${refId}` : ''}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/dashboard/my-courses"
              className="px-6 py-3 rounded-2xl bg-primary text-white text-body-md font-semibold"
            >
              مشاهده دوره‌های من
            </Link>
            <Link
              to="/courses"
              className="px-6 py-3 rounded-2xl border border-gray-200 text-body-md text-text-secondary"
            >
              دوره‌های دیگر
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess
