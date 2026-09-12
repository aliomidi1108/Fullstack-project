const DEFAULT_PASSWORD = '123456'
const DEFAULT_USER_TOKEN = 'mock-token'

const mockUser = {
  id: 1,
  phone: '09123456789',
  password: DEFAULT_PASSWORD,
  role: 'user',
  name: 'Mock User',
  email: '',
  avatar: '',
  courseIds: [],
}

const tokenToUserId = new Map([[DEFAULT_USER_TOKEN, mockUser.id]])

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

const sanitizeUser = (user) => {
  if (!user) return null
  return {
    id: user.id,
    phone: user.phone,
    name: user.name || '',
    email: user.email || '',
    avatar: user.avatar || '',
    role: user.role || 'user',
    courses: [...(user.courseIds || [])],
  }
}

const listUsers = () => [sanitizeUser(mockUser)]

const getUserRecordById = (id) => {
  const numericId = Number(id)
  if (!Number.isInteger(numericId) || numericId <= 0) return null
  if (numericId !== mockUser.id) return null
  return mockUser
}

const getUserById = (id) => sanitizeUser(getUserRecordById(id))

const getUserRecordByPhone = (phone) => {
  const normalizedPhone = normalizePhone(phone)
  if (!normalizedPhone) return null
  return normalizedPhone === mockUser.phone ? mockUser : null
}

const getUserByPhone = (phone) => sanitizeUser(getUserRecordByPhone(phone))

const ensureUserByPhone = (phone) => {
  const existing = getUserRecordByPhone(phone)
  if (existing) return existing
  return null
}

const issueTokenForUser = (user) => {
  if (!user) return null
  if (user.id !== mockUser.id) return null
  return DEFAULT_USER_TOKEN
}

const getUserByToken = (token) => {
  const userId = tokenToUserId.get(String(token || ''))
  if (!userId) return null
  return getUserById(userId)
}

const loginWithPassword = ({ phone, password }) => {
  const user = getUserRecordByPhone(phone)
  const normalizedPassword = normalizeDigits(password).replace(/\D/g, '')
  if (!user) return null
  if (normalizedPassword !== normalizeDigits(user.password).replace(/\D/g, '')) return null
  const token = issueTokenForUser(user)
  return { user: sanitizeUser(user), token }
}

const loginWithOtp = ({ phone, otp }) => {
  const normalizedOtp = normalizeDigits(otp).replace(/\D/g, '')
  if (!normalizedOtp) return null
  const user = ensureUserByPhone(phone)
  if (!user) return null
  const token = issueTokenForUser(user)
  return { user: sanitizeUser(user), token }
}

const updateUserProfile = (userId, payload = {}) => {
  const user = getUserRecordById(userId)
  if (!user) return null
  if (payload.name !== undefined) {
    user.name = String(payload.name || '').trim()
  }
  if (payload.email !== undefined) {
    user.email = String(payload.email || '').trim()
  }
  if (payload.avatar !== undefined) {
    user.avatar = payload.avatar ? String(payload.avatar).trim() : ''
  }
  return sanitizeUser(user)
}

const setUserCourses = (userId, courseIds) => {
  const user = getUserRecordById(userId)
  if (!user) return null
  const normalized = Array.from(
    new Set(
      (courseIds || [])
        .map((id) => Number(id))
        .filter((id) => Number.isInteger(id) && id > 0)
    )
  )
  user.courseIds = normalized
  return sanitizeUser(user)
}

const addCoursesToUser = (userId, courseIds) => {
  const user = getUserRecordById(userId)
  if (!user) return null
  const current = new Set(user.courseIds || [])
  for (const rawId of courseIds || []) {
    const courseId = Number(rawId)
    if (Number.isInteger(courseId) && courseId > 0) {
      current.add(courseId)
    }
  }
  user.courseIds = Array.from(current)
  return sanitizeUser(user)
}

const clearSessionToken = (token) => {
  const key = String(token || '')
  if (key === DEFAULT_USER_TOKEN) return
  tokenToUserId.delete(key)
}

const getDefaultUser = () => sanitizeUser(getUserRecordById(mockUser.id))

export {
  DEFAULT_PASSWORD,
  DEFAULT_USER_TOKEN,
  addCoursesToUser,
  clearSessionToken,
  ensureUserByPhone,
  getDefaultUser,
  getUserById,
  getUserByPhone,
  getUserByToken,
  getUserRecordById,
  issueTokenForUser,
  listUsers,
  loginWithOtp,
  loginWithPassword,
  normalizeDigits,
  normalizePhone,
  setUserCourses,
  updateUserProfile,
}
