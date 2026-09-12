const ensureFetch = () => {
  if (typeof fetch === 'undefined') {
    throw new Error('Fetch is not available in this Node.js runtime')
  }
}

class ZarinpalProvider {
  constructor() {
    const merchantId = process.env.PAYMENT_MERCHANT_ID || process.env.ZARINPAL_MERCHANT_ID
    const callbackUrl = process.env.PAYMENT_CALLBACK_URL || process.env.ZARINPAL_CALLBACK_URL
    const apiBase = process.env.ZARINPAL_API_BASE || 'https://api.zarinpal.com/pg/v4/payment'
    if (!merchantId || !callbackUrl) {
      throw new Error('Zarinpal credentials are not configured')
    }
    this.merchantId = merchantId
    this.callbackUrl = callbackUrl
    this.apiBase = apiBase.replace(/\/$/, '')
  }

  async initiatePayment({ amount, description, metadata }) {
    ensureFetch()
    const response = await fetch(`${this.apiBase}/request.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        merchant_id: this.merchantId,
        amount,
        callback_url: this.callbackUrl,
        description,
        metadata,
      }),
    })

    const data = await response.json()
    if (!response.ok || !data?.data?.authority) {
      const message = data?.errors?.message || 'Payment initiation failed'
      throw new Error(message)
    }

    return {
      authority: data.data.authority,
      redirectUrl: `https://www.zarinpal.com/pg/StartPay/${data.data.authority}`,
      raw: data,
    }
  }

  async verifyPayment({ amount, authority }) {
    ensureFetch()
    const response = await fetch(`${this.apiBase}/verify.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        merchant_id: this.merchantId,
        amount,
        authority,
      }),
    })

    const data = await response.json()
    if (!response.ok) {
      const message = data?.errors?.message || 'Payment verification failed'
      throw new Error(message)
    }

    return data
  }
}

export default ZarinpalProvider
