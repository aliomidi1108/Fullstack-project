/**
 * Zarinpal payment gateway service.
 * Used only when USE_DB=true.
 */

const getBaseUrl = () => {
  const sandbox = process.env.ZARINPAL_SANDBOX === 'true'
  return sandbox
    ? 'https://sandbox.zarinpal.com/pg/v4/payment'
    : 'https://api.zarinpal.com/pg/v4/payment'
}

/**
 * Create payment request with Zarinpal.
 * @param {{ amount: number, callbackUrl: string, description: string, metadata?: object }} params
 * @returns {{ authority: string, redirectUrl: string }}
 */
const requestPayment = async ({ amount, callbackUrl, description, metadata = {} }) => {
  const merchantId = process.env.ZARINPAL_MERCHANT_ID
  if (!merchantId) {
    throw new Error('ZARINPAL_MERCHANT_ID is not configured')
  }

  const baseUrl = getBaseUrl()
  const payload = {
    merchant_id: merchantId,
    amount: Math.round(Number(amount) || 0),
    callback_url: String(callbackUrl || '').trim(),
    description: String(description || 'Course purchase').trim(),
    metadata: metadata,
  }

  const response = await fetch(`${baseUrl}/request.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = await response.json().catch(() => ({}))

  if (data?.data?.code !== 100) {
    const err = new Error(data?.errors?.message || 'Zarinpal request failed')
    err.code = data?.data?.code ?? data?.errors?.code
    throw err
  }

  const authority = data?.data?.authority
  if (!authority) {
    throw new Error('Zarinpal did not return authority')
  }

  const useSandbox = process.env.ZARINPAL_SANDBOX === 'true'
  const startUrl = useSandbox ? 'https://sandbox.zarinpal.com/pg/StartPay/' : 'https://www.zarinpal.com/pg/StartPay/'
  const redirectUrl = `${startUrl}${authority}`

  return { authority, redirectUrl }
}

/**
 * Verify payment with Zarinpal.
 * @param {{ authority: string, amount: number }} params
 * @returns {{ refId: number }}
 */
const verifyPayment = async ({ authority, amount }) => {
  const merchantId = process.env.ZARINPAL_MERCHANT_ID
  if (!merchantId) {
    throw new Error('ZARINPAL_MERCHANT_ID is not configured')
  }

  const baseUrl = getBaseUrl()
  const payload = {
    merchant_id: merchantId,
    authority: String(authority || '').trim(),
    amount: Math.round(Number(amount) || 0),
  }

  const response = await fetch(`${baseUrl}/verify.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = await response.json().catch(() => ({}))

  if (data?.data?.code !== 100) {
    const err = new Error(data?.errors?.message || 'Zarinpal verify failed')
    err.code = data?.data?.code ?? data?.errors?.code
    throw err
  }

  return { refId: data?.data?.ref_id }
}

export { requestPayment, verifyPayment }
