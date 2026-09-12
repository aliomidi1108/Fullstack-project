import {
  DEFAULT_USER_TOKEN as MOCK_TOKEN,
  getDefaultUser,
  loginWithOtp,
  loginWithPassword,
  normalizeDigits,
  normalizePhone,
} from '../user.service.js'

const MOCK_OTP = '123456'

const getMockUser = () => getDefaultUser()

const loginWithMockUser = ({ phone, password }) => {
  return loginWithPassword({ phone, password })
}

const verifyMockOtp = ({ phone, otp }) => {
  const normalizedPhone = normalizePhone(phone)
  const normalizedOtp = normalizeDigits(otp).replace(/\D/g, '')
  if (!normalizedPhone || !normalizedOtp) {
    return null
  }
  return loginWithOtp({ phone: normalizedPhone, otp: normalizedOtp })
}

export { MOCK_TOKEN, MOCK_OTP, getMockUser, loginWithMockUser, verifyMockOtp, normalizePhone }
