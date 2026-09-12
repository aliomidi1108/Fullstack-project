import express from 'express'
import { getWallet, deposit } from '../controllers/wallet.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js'
import adminMiddleware from '../middlewares/admin.middleware.js'
import { userRateLimit } from '../middlewares/rateLimit.middleware.js'

const router = express.Router()

const walletRateLimit = userRateLimit({
  windowMs: Number(process.env.USER_RATE_LIMIT_WINDOW_MS || 60 * 1000),
  max: Number(process.env.USER_RATE_LIMIT_MAX || 30),
})

router.get('/', authMiddleware, walletRateLimit, getWallet)
router.post('/deposit', authMiddleware, adminMiddleware, walletRateLimit, deposit)

export default router
