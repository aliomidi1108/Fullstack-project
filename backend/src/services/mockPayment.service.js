import { clearBasket, getBasket } from './basket.service.js'
import { enrollUserInCourses } from './course.service.js'

const orders = new Map()
const payments = new Map()

let nextOrderId = 1
let nextPaymentId = 1

const createOrderFromBasket = (userId) => {
  const basket = getBasket(userId)
  const items = basket.items || []
  if (!items.length) {
    return { status: 400, message: 'Basket is empty' }
  }
  const order = {
    id: nextOrderId,
    userId: Number(userId),
    items: items.map((item) => ({
      courseId: Number(item.course?.id),
      price: Number(item.course?.price || 0),
    })),
    totalAmount: Number(basket.totalPrice || 0),
    status: 'pending',
    createdAt: new Date().toISOString(),
    paymentId: null,
  }
  orders.set(order.id, order)
  nextOrderId += 1
  return { status: 201, payload: { ...order } }
}

const initiateOrderPayment = ({ userId, orderId }) => {
  const oid = Number(orderId)
  const order = orders.get(oid)
  if (!order || Number(order.userId) !== Number(userId)) {
    return { status: 404, message: 'Order not found' }
  }
  if (order.status !== 'pending') {
    return { status: 400, message: 'Order is not payable' }
  }

  const payment = {
    id: nextPaymentId,
    userId: Number(userId),
    orderId: order.id,
    status: 'pending',
    authority: `MOCK-${Date.now()}-${nextPaymentId}`,
    createdAt: new Date().toISOString(),
  }
  payments.set(payment.id, payment)
  order.paymentId = payment.id
  nextPaymentId += 1

  return {
    status: 200,
    payload: {
      paymentId: payment.id,
      redirectUrl: `/payment/result?paymentId=${payment.id}&Status=OK`,
    },
  }
}

const verifyPayment = ({ userId, paymentId }) => {
  const pid = Number(paymentId)
  const payment = payments.get(pid)
  if (!payment || Number(payment.userId) !== Number(userId)) {
    return { status: 404, message: 'Payment not found' }
  }
  if (payment.status === 'paid') {
    return {
      status: 200,
      payload: { message: 'Payment already processed', orderId: payment.orderId },
    }
  }
  const order = orders.get(payment.orderId)
  if (!order || Number(order.userId) !== Number(userId)) {
    return { status: 400, message: 'Order is not payable' }
  }
  payment.status = 'paid'
  order.status = 'paid'
  const courseIds = order.items.map((item) => item.courseId)
  enrollUserInCourses({ userId, courseIds })
  clearBasket(userId)

  return {
    status: 200,
    payload: { message: 'Payment successful', orderId: order.id },
  }
}

const handlePaymentCallback = ({ provider, query }) => {
  return {
    status: 200,
    payload: {
      message: 'Mock callback received',
      provider,
      query,
    },
  }
}

export { createOrderFromBasket, handlePaymentCallback, initiateOrderPayment, verifyPayment }
