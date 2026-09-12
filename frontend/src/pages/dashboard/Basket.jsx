import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { getBasket } from '../../services/basket.service'
import { createOrderFromBasket, initiateOrderPayment } from '../../services/payment.service'

function Basket() {
  const navigate = useNavigate()
  const [basket, setBasket] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isPaying, setIsPaying] = useState(false)
  const [paymentError, setPaymentError] = useState('')

  useEffect(() => {
    const loadBasket = async () => {
      setIsLoading(true)
      setError('')
      try {
        const data = await getBasket()
        setBasket(data)
      } catch (err) {
        setError(err?.response?.data?.message || 'دریافت سبد خرید ناموفق بود.')
      } finally {
        setIsLoading(false)
      }
    }

    loadBasket()
  }, [])

  const items = useMemo(() => basket?.items || [], [basket])
  const totalPrice = basket?.totalPrice ?? 0

  const handlePayment = async () => {
    setPaymentError('')
    if (items.length === 0) {
      setPaymentError('سبد خرید شما خالی است.')
      return
    }
    setIsPaying(true)
    try {
      const order = await createOrderFromBasket()
      const orderId = order?.id ?? order?._id
      if (!orderId) {
        throw new Error('Invalid order id')
      }
      const payment = await initiateOrderPayment(orderId)
      window.location.href = payment.redirectUrl
    } catch (err) {
      setPaymentError(err?.response?.data?.message || 'شروع پرداخت ناموفق بود.')
    } finally {
      setIsPaying(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
      <h2 className="text-section-title font-semibold text-text-primary text-right">
        سبد خرید شما
      </h2>

      {isLoading ? (
        <div className="flex items-center justify-center py-6">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <p className="text-body-md text-red-500 text-right">{error}</p>
      ) : (
        <>
      <div className="grid grid-cols-3 gap-4 text-body-md text-text-secondary text-right">
        <span>شناسه</span>
        <span>محصول</span>
        <span>قیمت</span>
      </div>

      <div className="divide-y divide-gray-100">
        {items.length === 0 ? (
          <p className="text-body-md text-text-secondary text-right py-4">
            سبد خرید شما خالی است.
          </p>
        ) : (
          items.map((item, index) => (
            <div
              key={item.course?.id || item.course?._id || item.id || item._id || `${index}`}
              className="grid grid-cols-3 gap-4 py-3 text-right"
            >
              <span className="text-text-secondary">
                {item.course?.id || item.course?._id || '-'}
              </span>
              <span className="text-text-primary">{item.course?.title || 'دوره'}</span>
              <span className="text-text-secondary">
                {typeof item.course?.price === 'number'
                  ? item.course.price.toLocaleString('fa-IR')
                  : item.course?.price || '-'}{' '}
                تومان
              </span>
            </div>
          ))
        )}
      </div>

      <div className="text-right text-body-lg font-semibold text-text-primary">
        جمع کل:{' '}
        {typeof totalPrice === 'number' ? totalPrice.toLocaleString('fa-IR') : totalPrice}{' '}
        تومان
      </div>

      <button
        type="button"
        onClick={handlePayment}
        disabled={isPaying}
        className="w-full rounded-2xl bg-success-light text-success py-4 text-button font-semibold border border-success disabled:opacity-70"
      >
        {isPaying ? 'در حال انتقال به درگاه...' : 'پرداخت'}
      </button>
      {paymentError ? (
        <p className="text-body-md text-red-500 text-right">{paymentError}</p>
      ) : null}
      <button
        type="button"
        onClick={() => navigate('/payment/result')}
        className="w-full rounded-2xl border border-gray-200 text-text-secondary py-3 text-body-md"
      >
        پیگیری وضعیت پرداخت
      </button>
        </>
      )}
    </div>
  )
}

export default Basket
