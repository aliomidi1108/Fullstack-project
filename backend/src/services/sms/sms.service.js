import TwilioProvider from './providers/twilio.provider.js'
import SmsIrProvider from './providers/smsir.provider.js'

let providerInstance = null

const getProvider = () => {
  if (providerInstance) return providerInstance

  const providerName = (process.env.SMS_PROVIDER || 'twilio').toLowerCase()
  switch (providerName) {
    case 'twilio':
      providerInstance = new TwilioProvider()
      break
    case 'smsir':
    case 'sms.ir':
      providerInstance = new SmsIrProvider()
      break
    default:
      throw new Error('SMS provider is not configured')
  }

  return providerInstance
}

const sendSms = async (to, message) => {
  const provider = getProvider()
  return provider.sendSms(to, message)
}

const sendOtp = async (to, otp, ttlMinutes, message) => {
  const provider = getProvider()
  if (typeof provider.sendOtp === 'function') {
    return provider.sendOtp({ to, otp, ttlMinutes, message })
  }
  return provider.sendSms(to, message)
}

export { sendSms, sendOtp }
