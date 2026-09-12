import { useEffect, useMemo, useState } from 'react'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { getWallet } from '../../services/wallet.service'

function Wallet() {
  const [wallet, setWallet] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadWallet = async () => {
      setIsLoading(true)
      setError('')
      try {
        const data = await getWallet()
        setWallet(data)
      } catch (err) {
        setError(err?.response?.data?.message || 'دریافت کیف پول ناموفق بود.')
      } finally {
        setIsLoading(false)
      }
    }

    loadWallet()
  }, [])

  const transactions = useMemo(() => wallet?.transactions || [], [wallet])
  const balance = wallet?.balance ?? 0

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 flex items-center justify-between">
        <div className="text-right">
          <h2 className="text-section-title font-semibold text-text-primary">کیف پول</h2>
          <p className="text-body-md text-text-secondary mt-1">
            {typeof balance === 'number' ? balance.toLocaleString('fa-IR') : balance} ریال
          </p>
        </div>
        <button
          type="button"
          className="px-6 py-3 rounded-2xl bg-success text-white text-body-md font-semibold"
        >
          افزایش موجودی
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-card-title font-semibold text-text-primary mb-4 text-right">
          لیست تراکنش‌ها
        </h3>
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <p className="text-body-md text-red-500 text-right">{error}</p>
        ) : (
        <div className="grid grid-cols-4 gap-4 text-body-md text-text-secondary border-b border-gray-100 pb-3 text-right">
          <span>شناسه</span>
          <span>تراکنش</span>
          <span>تاریخ</span>
          <span>مبلغ</span>
        </div>
        )}
        {!isLoading && !error ? (
          <div className="divide-y divide-gray-100">
            {transactions.length === 0 ? (
              <p className="text-body-md text-text-secondary text-right py-4">
                تراکنشی ثبت نشده است.
              </p>
            ) : (
              transactions.map((tx, index) => (
                <div
                  key={tx._id || tx.id || `${index}`}
                  className="grid grid-cols-4 gap-4 py-3 text-body-md text-right"
                >
                  <span className="text-text-secondary">{tx._id || tx.id || '-'}</span>
                  <span className="text-text-primary">
                    {tx.description || tx.type || 'تراکنش'}
                  </span>
                  <span className="text-text-secondary">
                    {tx.date ? new Date(tx.date).toLocaleDateString('fa-IR') : '-'}
                  </span>
                  <span className="text-success">
                    {typeof tx.amount === 'number'
                      ? tx.amount.toLocaleString('fa-IR')
                      : tx.amount || '-'}
                  </span>
                </div>
              ))
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Wallet
