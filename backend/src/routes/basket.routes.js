import express from 'express'
import {
  getBasket,
  addToBasket,
  removeFromBasket,
  clearBasket,
  checkoutBasket,
} from '../controllers/basket.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js'
import { validateNumericId } from '../middlewares/validate.middleware.js'
import { userRateLimit } from '../middlewares/rateLimit.middleware.js'

const router = express.Router()

const basketRateLimit = userRateLimit({
  windowMs: Number(process.env.USER_RATE_LIMIT_WINDOW_MS || 60 * 1000),
  max: Number(process.env.USER_RATE_LIMIT_MAX || 30),
})

router.get('/', authMiddleware, basketRateLimit, getBasket)
router.post('/add', authMiddleware, basketRateLimit, addToBasket)
router.post(
  '/add/:courseId',
  authMiddleware,
  basketRateLimit,
  validateNumericId('courseId'),
  addToBasket
)
router.delete(
  '/remove/:courseId',
  authMiddleware,
  basketRateLimit,
  validateNumericId('courseId'),
  removeFromBasket
)
router.delete('/clear', authMiddleware, basketRateLimit, clearBasket)
router.post('/checkout', authMiddleware, basketRateLimit, checkoutBasket)

export default router
