import axios from 'axios'
import { logError } from './logger.js'

const normalizeMobile = (mobile) => {
  const value = typeof mobile === 'string' ? mobile.trim() : ''
  if (!value) return null
  if (/^09\d{9}$/.test(value)) {
    return `98${value.slice(1)}`
  }
  if (/^\+98\d{10}$/.test(value)) {
    return value.slice(1)
  }
  if (/^0098\d{10}$/.test(value)) {
    return value.slice(2)
  }
  if (/^98\d{10}$/.test(value)) {
    return value
  }
  return null
}

const sendOtpSms = async (mobile, otp) => {
  const apiKey = process.env.SMS_IR_API_KEY || process.env.SMSIR_API_KEY
  const templateId = process.env.SMS_IR_TEMPLATE_ID || process.env.SMSIR_TEMPLATE_ID
  const apiBase = process.env.SMSIR_API_BASE || 'https://api.sms.ir/v1'
  const verifyUrl =
    process.env.SMS_IR_VERIFY_URL || `${apiBase.replace(/\/+$/, '')}/send/verify`

  if (!apiKey || !templateId) {
    throw new Error('SMS.ir credentials are not configured')
  }

  const normalizedMobile = normalizeMobile(mobile)
  if (!normalizedMobile) {
    throw new Error('Invalid mobile number format')
  }

  const ttlSeconds = Number(process.env.OTP_TTL_SECONDS || 300)
  const ttlMinutes = Number.isFinite(ttlSeconds) && ttlSeconds > 0 ? Math.ceil(ttlSeconds / 60) : ''
  const parameters = [{ name: 'CODE', value: String(otp) }]
  if (ttlMinutes) {
    parameters.push({ name: 'MINUTES', value: String(ttlMinutes) })
  }
  const payload = {
    mobile: normalizedMobile,
    templateId: Number(templateId),
    parameters,
  }

  try {
    const response = await axios.post(verifyUrl, payload, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': apiKey,
      },
    })
    if (response?.data?.status === 0) {
      logError('smsir.verify.failed', {
        response: response?.data,
        status: response?.status,
      })
      throw new Error('SMS.ir template send failed')
    }
    return response.data
  } catch (error) {
    logError('smsir.verify.failed', {
      response: error?.response?.data,
      status: error?.response?.status,
    })
    throw error
  }
}

export { sendOtpSms }
