import crypto from 'crypto'

const OTP_LENGTH = Number(process.env.OTP_LENGTH || 6)
const OTP_TTL_SECONDS = Number(process.env.OTP_TTL_SECONDS || 300)
const OTP_MAX_ATTEMPTS = Number(process.env.OTP_MAX_ATTEMPTS || 5)
const OTP_RESEND_LIMIT = Number(process.env.OTP_RESEND_LIMIT || 3)
const OTP_RESEND_INTERVAL_SECONDS = Number(process.env.OTP_RESEND_INTERVAL_SECONDS || 30)

const getOtpHashSecret = () => {
  const secret = process.env.OTP_HASH_SECRET
  if (!secret) {
    throw new Error('OTP hash secret is not configured')
  }
  return secret
}

const generateOtp = () => {
  const max = 10 ** OTP_LENGTH
  const value = crypto.randomInt(0, max)
  return String(value).padStart(OTP_LENGTH, '0')
}

const hashOtp = (otp) => {
  const secret = getOtpHashSecret()
  return crypto.createHmac('sha256', secret).update(String(otp)).digest('hex')
}

const compareOtp = (otp, otpHash) => {
  const hashed = hashOtp(otp)
  const a = Buffer.from(hashed, 'hex')
  const b = Buffer.from(String(otpHash), 'hex')
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(a, b)
}

const otpConfig = {
  length: OTP_LENGTH,
  ttlMs: OTP_TTL_SECONDS * 1000,
  maxAttempts: OTP_MAX_ATTEMPTS,
  resendLimit: OTP_RESEND_LIMIT,
  resendIntervalMs: OTP_RESEND_INTERVAL_SECONDS * 1000,
}

export { generateOtp, hashOtp, compareOtp, otpConfig }
