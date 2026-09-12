import express from 'express'
import {
  login,
  requestMockOtp,
  verifyMockOtpHandler,
  refreshMockSession,
  logoutMockSession,
} from '../controllers/mockAuth.controller.js'
import { rateLimit } from '../middlewares/rateLimit.middleware.js'

const router = express.Router()

const otpRateLimit = rateLimit({
  windowMs: Number(process.env.OTP_RATE_LIMIT_WINDOW_MS || 5 * 60 * 1000),
  max: Number(process.env.OTP_RATE_LIMIT_MAX || 5),
  keyGenerator: (req) => `otp:${req.ip}:${req.body?.phone || 'unknown'}`,
})

const verifyRateLimit = rateLimit({
  windowMs: Number(process.env.OTP_VERIFY_RATE_LIMIT_WINDOW_MS || 5 * 60 * 1000),
  max: Number(process.env.OTP_VERIFY_RATE_LIMIT_MAX || 10),
  keyGenerator: (req) => `verify:${req.ip}:${req.body?.phone || 'unknown'}`,
})

const refreshRateLimit = rateLimit({
  windowMs: Number(process.env.REFRESH_RATE_LIMIT_WINDOW_MS || 5 * 60 * 1000),
  max: Number(process.env.REFRESH_RATE_LIMIT_MAX || 10),
  keyGenerator: (req) => `refresh:${req.ip}:${req.headers?.['user-agent'] || 'unknown'}`,
})

router.post('/send-otp', otpRateLimit, requestMockOtp)
router.post('/request-otp', otpRateLimit, requestMockOtp)
router.post('/verify-otp', verifyRateLimit, verifyMockOtpHandler)
router.post('/otp', otpRateLimit, requestMockOtp)
router.post('/verify', verifyRateLimit, verifyMockOtpHandler)
router.post('/refresh', refreshRateLimit, refreshMockSession)
router.post('/logout', refreshRateLimit, logoutMockSession)
router.post('/login', login)

export default router
