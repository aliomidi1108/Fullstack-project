import express from 'express'
import { getSales, getSummary, getTopCourses } from '../controllers/admin.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js'
import adminMiddleware from '../middlewares/admin.middleware.js'
import { userRateLimit } from '../middlewares/rateLimit.middleware.js'

const router = express.Router()

const adminRateLimit = userRateLimit({
  windowMs: Number(process.env.USER_RATE_LIMIT_WINDOW_MS || 60 * 1000),
  max: Number(process.env.USER_RATE_LIMIT_MAX || 30),
})

router.get('/summary', authMiddleware, adminMiddleware, adminRateLimit, getSummary)
router.get('/sales', authMiddleware, adminMiddleware, adminRateLimit, getSales)
router.get('/top-courses', authMiddleware, adminMiddleware, adminRateLimit, getTopCourses)

export default router
