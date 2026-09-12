import {
  MOCK_OTP,
  MOCK_TOKEN,
  getMockUser,
  loginWithMockUser,
  normalizePhone,
  verifyMockOtp,
} from '../services/auth/mockAuth.service.js'
import { getUserByToken } from '../services/user.service.js'
import {
  getUserByDbToken,
  loginWithPasswordDb,
  logoutDbSession,
  requestOtpDb,
  refreshDbSession,
  verifyOtpDb,
} from '../services/auth/dbAuth.service.js'

const isDbMode = () => process.env.USE_DB === 'true'

const extractToken = (req) => {
  const header = req.headers.authorization || ''
  if (header.startsWith('Bearer ')) {
    return header.slice(7)
  }
  return ''
}

const login = async (req, res) => {
  const { phone, password } = req.body || {}
  if (!phone || !password) {
    return res.status(400).json({ message: 'Phone and password are required' })
  }

  const result = isDbMode()
    ? await loginWithPasswordDb({ phone, password })
    : loginWithMockUser({ phone, password })
  if (!result) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  return res.json(result)
}

const requestMockOtp = (req, res) => {
  if (isDbMode()) {
    const { phone } = req.body || {}
    return requestOtpDb({ phone }).then((result) => {
      if (result.status !== 200) {
        return res.status(result.status).json({ message: result.message })
      }
      return res.json(result.payload)
    })
  }

  const { phone } = req.body || {}
  const normalizedPhone = normalizePhone(phone)
  if (!normalizedPhone) {
    return res.status(400).json({ message: 'Phone is required' })
  }

  const shouldExposeOtp =
    process.env.OTP_DEBUG === 'true' || process.env.NODE_ENV !== 'production'

  return res.json({
    message: 'OTP sent',
    phone: normalizedPhone,
    ...(shouldExposeOtp ? { otp: MOCK_OTP } : {}),
  })
}

const verifyMockOtpHandler = async (req, res) => {
  const { phone, otp } = req.body || {}
  if (!phone || !otp) {
    return res.status(400).json({ message: 'Phone and OTP are required' })
  }

  if (isDbMode()) {
    const result = await verifyOtpDb({ phone, otp })
    if (result.status !== 200) {
      return res.status(result.status).json({ message: result.message })
    }
    return res.json(result.payload)
  }

  const result = verifyMockOtp({ phone, otp })
  if (!result) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  return res.json(result)
}

const refreshMockSession = async (req, res) => {
  const token = extractToken(req)
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  if (isDbMode()) {
    const session = await refreshDbSession(token)
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    return res.json(session)
  }

  const user = getUserByToken(token)
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  return res.json({ token: MOCK_TOKEN, user })
}

const logoutMockSession = async (req, res) => {
  if (isDbMode()) {
    const token = extractToken(req)
    if (token) {
      await logoutDbSession(token)
    }
  }
  return res.json({ message: 'Logged out' })
}

const getMockMe = async (req, res) => {
  if (isDbMode()) {
    const token = extractToken(req)
    const user = await getUserByDbToken(token)
    if (!user) return res.status(401).json({ message: 'Unauthorized' })
    return res.json(user)
  }
  return res.json(getMockUser())
}

const updateMockMe = async (req, res) => {
  if (isDbMode()) {
    const token = extractToken(req)
    const user = await getUserByDbToken(token)
    if (!user) return res.status(401).json({ message: 'Unauthorized' })
    return res.json(user)
  }
  return res.json(getMockUser())
}

const deleteMockAvatar = async (req, res) => {
  if (isDbMode()) {
    const token = extractToken(req)
    const user = await getUserByDbToken(token)
    if (!user) return res.status(401).json({ message: 'Unauthorized' })
  }
  return res.json({ message: 'Avatar removed' })
}

export {
  login,
  requestMockOtp,
  verifyMockOtpHandler,
  refreshMockSession,
  logoutMockSession,
  getMockMe,
  updateMockMe,
  deleteMockAvatar,
}
