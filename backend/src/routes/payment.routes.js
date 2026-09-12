import express from 'express'
import authMiddleware from '../middlewares/auth.middleware.js'
import {
  createOrderFromBasket,
  initiateOrderPayment,
  handlePaymentCallback,
  verifyPaymentById,
} from '../controllers/payment.controller.js'
import {
  requestZarinpalPayment,
  handleZarinpalCallback,
} from '../controllers/zarinpal.controller.js'
import { validateNumericId } from '../middlewares/validate.middleware.js'
import { userRateLimit } from '../middlewares/rateLimit.middleware.js'

const router = express.Router()

const paymentRateLimit = userRateLimit({
  windowMs: Number(process.env.USER_RATE_LIMIT_WINDOW_MS || 60 * 1000),
  max: Number(process.env.USER_RATE_LIMIT_MAX || 30),
})

// Zarinpal course purchase (DB-backed, USE_DB=true)
router.post('/zarinpal/request', authMiddleware, paymentRateLimit, requestZarinpalPayment)
router.get('/zarinpal/callback', handleZarinpalCallback)

router.post('/orders', authMiddleware, paymentRateLimit, createOrderFromBasket)
router.post(
  '/orders/:orderId/pay',
  authMiddleware,
  paymentRateLimit,
  validateNumericId('orderId'),
  initiateOrderPayment
)
router.get('/callback/:provider', handlePaymentCallback)
router.post(
  '/:paymentId/verify',
  authMiddleware,
  paymentRateLimit,
  validateNumericId('paymentId'),
  verifyPaymentById
)

export default router
