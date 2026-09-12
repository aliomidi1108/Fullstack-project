import api from './api'

const requestZarinpalPayment = async (courseId) => {
  const { data } = await api.post('/payments/zarinpal/request', { courseId })
  return data
}

const createOrderFromBasket = async () => {
  const { data } = await api.post('/payments/orders')
  return data
}

const initiateOrderPayment = async (orderId) => {
  const { data } = await api.post(`/payments/orders/${orderId}/pay`)
  return data
}

const verifyPayment = async (paymentId) => {
  const { data } = await api.post(`/payments/${paymentId}/verify`)
  return data
}

const handlePaymentCallback = async (provider, params) => {
  const { data } = await api.get(`/payments/callback/${provider}`, { params })
  return data
}

export {
  requestZarinpalPayment,
  createOrderFromBasket,
  initiateOrderPayment,
  verifyPayment,
  handlePaymentCallback,
}
