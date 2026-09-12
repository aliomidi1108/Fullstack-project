import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { verifyPayment } from '../services/payment.service'
import { clearBasket } from '../services/basket.service'
import { getMe } from '../services/auth.service'
import { useAuth } from '../context/AuthContext'

function PaymentResult() {
  const [searchParams] = useSearchParams()
  const { updateUser } = useAuth()
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')
  const authority = searchParams.get('Authority')
  const gatewayStatus = searchParams.get('Status')
  const paymentId = searchParams.get('paymentId')
  const hasVerified = useRef(false)

  useEffect(() => {
    const finalize = async () => {
      if (hasVerified.current) return
      hasVerified.current = true
      if (gatewayStatus && String(gatewayStatus).toLowerCase() !== 'ok') {
        setStatus('canceled')
        setMessage('پرداخت لغو شد یا ناموفق بود.')
        return
      }
      if (!paymentId) {
        setStatus('pending')
        setMessage('اطلاعات کافی برای بررسی پرداخت وجود ندارد. لطفا دوباره تلاش کنید.')
        return
      }

      setStatus('loading')
      try {
        const result = await verifyPayment(paymentId)
        setStatus('success')
        setMessage(result?.message || 'پرداخت با موفقیت انجام شد.')
        try {
          await clearBasket()
          const user = await getMe()
          updateUser(user)
        } catch (error) {
          // ignore refresh errors
        }
      } catch (err) {
        setStatus('failed')
        setMessage(err?.response?.data?.message || 'پرداخت ناموفق بود.')
      }
    }

    finalize()
  }, [paymentId, gatewayStatus, updateUser])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 text-right space-y-4">
          <h2 className="text-section-title font-semibold text-text-primary">نتیجه پرداخت</h2>
          {status === 'success' ? (
            <p className="text-body-md text-green-600">{message}</p>
          ) : status === 'failed' || status === 'canceled' ? (
            <p className="text-body-md text-red-500">{message}</p>
          ) : (
            <p className="text-body-md text-text-secondary">{message}</p>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            {status === 'failed' || status === 'canceled' || status === 'pending' ? (
              <Link
                to="/dashboard/basket"
                className="px-6 py-3 rounded-2xl bg-primary text-white text-body-md font-semibold text-center"
              >
                تلاش مجدد
              </Link>
            ) : null}
            <Link
              to="/dashboard/my-courses"
              className="px-6 py-3 rounded-2xl border border-gray-200 text-body-md text-text-secondary text-center"
            >
              مشاهده دوره‌های من
            </Link>
            <Link
              to="/dashboard/basket"
              className="px-6 py-3 rounded-2xl border border-gray-200 text-body-md text-text-secondary text-center"
            >
              بازگشت به سبد خرید
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentResult
