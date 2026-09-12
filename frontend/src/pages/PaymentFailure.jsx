import { Link, useSearchParams } from 'react-router-dom'

function PaymentFailure() {
  const [searchParams] = useSearchParams()
  const error = searchParams.get('error')

  const errorMessages = {
    cancelled: 'پرداخت لغو شد.',
    unavailable: 'درگاه پرداخت در دسترس نیست.',
    missing_authority: 'اطلاعات پرداخت یافت نشد.',
    payment_not_found: 'پرداخت یافت نشد.',
    verify_failed: 'تایید پرداخت ناموفق بود.',
  }

  const message = error ? errorMessages[error] || 'پرداخت ناموفق بود.' : 'پرداخت ناموفق بود.'

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 text-right space-y-4">
          <h2 className="text-section-title font-semibold text-text-primary">پرداخت ناموفق</h2>
          <p className="text-body-md text-red-500">{message}</p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/courses"
              className="px-6 py-3 rounded-2xl bg-primary text-white text-body-md font-semibold"
            >
              بازگشت به دوره‌ها
            </Link>
            <Link
              to="/dashboard/basket"
              className="px-6 py-3 rounded-2xl border border-gray-200 text-body-md text-text-secondary"
            >
              سبد خرید
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentFailure
