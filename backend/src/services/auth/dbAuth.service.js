import crypto from 'crypto'
import { findUserById, findOrCreateUserByPhone } from '../../repositories/user.repository.js'
import {
  createRefreshToken,
  deleteRefreshTokenByToken,
  extendRefreshTokenExpiryById,
  findValidRefreshTokenByToken,
} from '../../repositories/refreshToken.repository.js'
import {
  createOtpCode,
  deleteOtpCodeById,
  deleteOtpCodeByPhone,
  findOtpCodeByPhone,
  incrementOtpAttemptsById,
} from '../../repositories/otpCode.repository.js'
import { compareOtp, hashOtp } from '../../utils/otp.js'
import { logError } from '../../utils/logger.js'
import { sendOtpSms } from '../sms.service.js'

const DEFAULT_PASSWORD = '123456'
const OTP_TTL_MS = 2 * 60 * 1000
const OTP_MAX_ATTEMPTS = 5

const normalizeDigits = (value) => {
  const str = String(value || '')
  const persianDigits = '۰۱۲۳۴۵۶۷۸۹'
  const arabicDigits = '٠١٢٣٤٥٦٧٨٩'
  return str.replace(/[۰-۹٠-٩]/g, (digit) => {
    const persianIndex = persianDigits.indexOf(digit)
    if (persianIndex >= 0) return String(persianIndex)
    const arabicIndex = arabicDigits.indexOf(digit)
    return arabicIndex >= 0 ? String(arabicIndex) : digit
  })
}

const normalizePhone = (value) => {
  const raw = normalizeDigits(value).replace(/\D/g, '')
  if (raw.startsWith('0098') && raw.length >= 14) {
    return `0${raw.slice(4, 14)}`
  }
  if (raw.startsWith('98') && raw.length >= 12) {
    return `0${raw.slice(2, 12)}`
  }
  if (raw.startsWith('9') && raw.length === 10) {
    return `0${raw}`
  }
  if (raw.startsWith('0') && raw.length >= 11) {
    return raw.slice(0, 11)
  }
  return raw
}

const toPublicUser = (user) => {
  if (!user) return null
  return {
    id: user.id,
    phone: user.phone,
    name: user.name || '',
    email: user.email || '',
    avatar: user.avatar || '',
    role: user.role || 'user',
    courses: Array.isArray(user.courses) ? [...user.courses] : [],
  }
}

const getRefreshTtlDays = () => {
  const parsed = Number(process.env.JWT_REFRESH_TTL_DAYS || 30)
  if (!Number.isFinite(parsed) || parsed <= 0) return 30
  return Math.floor(parsed)
}

const getRefreshExpiry = () => {
  const ttlDays = getRefreshTtlDays()
  return new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000)
}

const issueSessionToken = async (user) => {
  if (!user) return null
  const token = `db-token-${user.id}-${crypto.randomBytes(16).toString('hex')}`
  await createRefreshToken({
    userId: user.id,
    token,
    expiresAt: getRefreshExpiry(),
  })
  return token
}

const generateSixDigitOtp = () => String(crypto.randomInt(0, 1_000_000)).padStart(6, '0')

const loginWithPasswordDb = async ({ phone, password }) => {
  const normalizedPhone = normalizePhone(phone)
  const normalizedPassword = normalizeDigits(password).replace(/\D/g, '')
  if (!normalizedPhone || !normalizedPassword) return null
  if (normalizedPassword !== normalizeDigits(DEFAULT_PASSWORD).replace(/\D/g, '')) return null

  const user = await findOrCreateUserByPhone(normalizedPhone, 'user')
  if (!user) return null

  const token = await issueSessionToken(user)
  if (!token) return null

  return {
    user: toPublicUser(user),
    token,
  }
}

const requestOtpDb = async ({ phone }) => {
  const normalizedPhone = normalizePhone(phone)
  if (!normalizedPhone) {
    return { status: 400, message: 'Phone is required' }
  }

  const otp = generateSixDigitOtp()
  const otpHash = hashOtp(otp)
  const expiresAt = new Date(Date.now() + OTP_TTL_MS)

  await deleteOtpCodeByPhone(normalizedPhone)
  await createOtpCode({
    phone: normalizedPhone,
    code: otpHash,
    expiresAt,
  })

  const shouldExposeOtp = process.env.OTP_DEBUG === 'true'
  try {
    await sendOtpSms(normalizedPhone, otp)
  } catch (err) {
    logError('otp.sms.send.failed', { message: err?.message })
    if (shouldExposeOtp) {
      console.log(`[OTP][DB] SMS failed, exposing OTP for testing: ${normalizedPhone} -> ${otp}`)
      return {
        status: 200,
        payload: {
          message: 'OTP sent (SMS failed, use code for testing)',
          phone: normalizedPhone,
          otp,
        },
      }
    }
    return {
      status: 503,
      message: 'SMS service temporarily unavailable',
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log(`[OTP][DB] ${normalizedPhone}: SMS sent`)
  }

  return {
    status: 200,
    payload: {
      message: 'OTP sent',
      phone: normalizedPhone,
      ...(shouldExposeOtp ? { otp } : {}),
    },
  }
}

const verifyOtpDb = async ({ phone, otp }) => {
  const normalizedPhone = normalizePhone(phone)
  const normalizedOtp = normalizeDigits(otp).replace(/\D/g, '')
  if (!normalizedPhone || normalizedOtp.length !== 6) {
    return { status: 400, message: 'Phone and OTP are required' }
  }

  const otpCode = await findOtpCodeByPhone(normalizedPhone)
  if (!otpCode) {
    return { status: 401, message: 'Invalid OTP' }
  }

  if (otpCode.attempts >= OTP_MAX_ATTEMPTS) {
    return { status: 429, message: 'Too many failed attempts' }
  }

  if (new Date(otpCode.expiresAt).getTime() <= Date.now()) {
    await deleteOtpCodeById(otpCode.id)
    return { status: 401, message: 'OTP expired' }
  }

  const isOtpValid = compareOtp(normalizedOtp, otpCode.code)
  if (!isOtpValid) {
    const updated = await incrementOtpAttemptsById(otpCode.id)
    if ((updated?.attempts || 0) >= OTP_MAX_ATTEMPTS) {
      return { status: 429, message: 'Too many failed attempts' }
    }
    return { status: 401, message: 'Invalid OTP' }
  }

  await deleteOtpCodeById(otpCode.id)

  const user = await findOrCreateUserByPhone(normalizedPhone, 'user')
  if (!user) {
    return { status: 401, message: 'Invalid credentials' }
  }

  const token = await issueSessionToken(user)
  if (!token) {
    return { status: 401, message: 'Invalid credentials' }
  }

  return {
    status: 200,
    payload: {
      user: toPublicUser(user),
      token,
    },
  }
}

const getUserByDbToken = async (token) => {
  const session = await findValidRefreshTokenByToken(token)
  if (!session?.user) return null
  return toPublicUser(session.user)
}

const refreshDbSession = async (token) => {
  const session = await findValidRefreshTokenByToken(token)
  if (!session?.user) return null

  await extendRefreshTokenExpiryById(session.id, getRefreshExpiry())

  return {
    token: session.token,
    user: toPublicUser(session.user),
  }
}

const logoutDbSession = async (token) => {
  await deleteRefreshTokenByToken(token)
}

const getUserByIdDb = async (id) => {
  const user = await findUserById(id)
  return toPublicUser(user)
}

export {
  getUserByDbToken,
  getUserByIdDb,
  loginWithPasswordDb,
  logoutDbSession,
  refreshDbSession,
  requestOtpDb,
  verifyOtpDb,
}
