import api from './api'

const requestOtp = async (phone) => {
  const { data } = await api.post('/auth/otp', { phone })
  return data
}

const verifyOtp = async ({ phone, otp }) => {
  const { data } = await api.post('/auth/verify', { phone, otp })
  return data
}

const getMe = async () => {
  const { data } = await api.get('/users/me')
  return data
}

const updateMe = async (payload) => {
  const { data } = await api.put('/users/me', payload)
  return data
}

const refreshSession = async () => {
  const { data } = await api.post('/auth/refresh')
  return data
}

const logoutSession = async () => {
  const { data } = await api.post('/auth/logout')
  return data
}

export { requestOtp, verifyOtp, getMe, updateMe, refreshSession, logoutSession }
