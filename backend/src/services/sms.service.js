/**
 * SMS.ir OTP delivery service.
 * Used only when USE_DB=true.
 */

const normalizeMobile = (phone) => {
  const raw = String(phone || '').replace(/\D/g, '')
  if (raw.startsWith('0098') && raw.length >= 14) return raw.slice(2, 14)
  if (raw.startsWith('98') && raw.length >= 12) return raw.slice(0, 12)
  if (raw.startsWith('9') && raw.length === 10) return `98${raw}`
  if (raw.startsWith('0') && raw.length >= 11) return `98${raw.slice(1)}`
  return null
}

/**
 * Send OTP via SMS.ir verify API.
 * @param {string} phone - Phone number (09xxxxxxxxx or 98xxxxxxxxxx)
 * @param {string} code - OTP code (plain, not hashed)
 * @returns {Promise<object>} API response on success
 * @throws {Error} On missing config, invalid phone, or API failure
 */
const sendOtpSms = async (phone, code) => {
  const apiKey = process.env.SMS_IR_API_KEY
  const templateId = process.env.SMS_IR_TEMPLATE_ID
  const verifyUrl = process.env.SMS_IR_VERIFY_URL || 'https://api.sms.ir/v1/send/verify'

  if (!apiKey || !templateId) {
    throw new Error('SMS.ir credentials are not configured (SMS_IR_API_KEY, SMS_IR_TEMPLATE_ID)')
  }

  const mobile = normalizeMobile(phone)
  if (!mobile) {
    throw new Error('Invalid mobile number format')
  }

  const ttlSeconds = Number(process.env.OTP_TTL_SECONDS || 300)
  const ttlMinutes = Number.isFinite(ttlSeconds) && ttlSeconds > 0 ? Math.ceil(ttlSeconds / 60) : 2

  const payload = {
    mobile,
    templateId: Number(templateId),
    parameters: [
      { name: 'CODE', value: String(code) },
      { name: 'MINUTES', value: String(ttlMinutes) },
    ],
  }

  const response = await fetch(verifyUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': apiKey,
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json().catch(() => ({}))

  // SMS.ir returns status 0 on failure
  if (!response.ok || data?.status === 0) {
    const err = new Error('SMS.ir verify send failed')
    err.responseStatus = response.status
    err.responseData = data
    throw err
  }

  return data
}

export { sendOtpSms }
