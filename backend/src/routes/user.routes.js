import express from 'express'
import { getMe, updateMe, deleteAvatar } from '../controllers/user.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js'
import { userRateLimit } from '../middlewares/rateLimit.middleware.js'

const router = express.Router()

const profileRateLimit = userRateLimit({
  windowMs: Number(process.env.USER_RATE_LIMIT_WINDOW_MS || 60 * 1000),
  max: Number(process.env.USER_RATE_LIMIT_MAX || 30),
})

router.get('/me', authMiddleware, profileRateLimit, getMe)
router.put('/me', authMiddleware, profileRateLimit, updateMe)
router.delete('/me/avatar', authMiddleware, profileRateLimit, deleteAvatar)

export default router
