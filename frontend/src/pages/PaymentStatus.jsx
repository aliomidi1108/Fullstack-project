import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { createOrderFromBasket, initiateOrderPayment, verifyPayment } from '../services/payment.service'
import { clearBasket } from '../services/basket.service'
import { getMe } from '../services/auth.service'
import { useAuth } from '../context/AuthContext'

function PaymentStatus() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { updateUser } = useAuth()
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')
  const [isRetrying, setIsRetrying] = useState(false)

  const paymentId = searchParams.get('paymentId')

  const hasGatewayParams = useMemo(() => paymentId, [paymentId])

  useEffect(() => {
    const finalize = async () => {
      if (!hasGatewayParams) {
        setStatus('idle')
        return
      }

      setStatus('loading')
      try {
        const result = await verifyPayment(paymentId)
        setStatus('success')
        setMessage(result?.message || 'پرداخت با موفقیت انجام شد.')
        try {
          const user = await getMe()
          await clearBasket()
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
  }, [paymentId, hasGatewayParams, updateUser])

  const handleRetry = async () => {
    setIsRetrying(true)
    setMessage('')
    try {
      const order = await createOrderFromBasket()
      const orderId = order?.id ?? order?._id
      if (!orderId) {
        throw new Error('Invalid order id')
      }
      const payment = await initiateOrderPayment(orderId)
      localStorage.setItem(
        'pending_payment',
        JSON.stringify({ orderId, paymentId: payment.paymentId })
      )
      window.location.href = payment.redirectUrl
    } catch (err) {
      setStatus('failed')
      setMessage(err?.response?.data?.message || 'شروع پرداخت ناموفق بود.')
    } finally {
      setIsRetrying(false)
    }
  }

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
          <h2 className="text-section-title font-semibold text-text-primary">
            وضعیت پرداخت
          </h2>
          {status === 'idle' ? (
            <p className="text-body-md text-text-secondary">
              اطلاعاتی برای نمایش وجود ندارد.
            </p>
          ) : status === 'success' ? (
            <p className="text-body-md text-green-600">{message}</p>
          ) : (
            <p className="text-body-md text-red-500">{message}</p>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            {status === 'failed' ? (
              <button
                type="button"
                onClick={handleRetry}
                disabled={isRetrying}
                className="px-6 py-3 rounded-2xl bg-primary text-white text-body-md font-semibold disabled:opacity-70"
              >
                {isRetrying ? 'در حال انتقال به درگاه...' : 'پرداخت مجدد'}
              </button>
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

export default PaymentStatus
