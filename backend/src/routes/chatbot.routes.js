import express from 'express'
import { validateNumericId } from '../middlewares/validate.middleware.js'
import { rateLimit } from '../middlewares/rateLimit.middleware.js'
import { startSession, getMessages, sendMessage } from '../controllers/chatbot.controller.js'

const router = express.Router()

const chatRateLimit = rateLimit({
  windowMs: Number(process.env.CHAT_RATE_LIMIT_WINDOW_MS || 60 * 1000),
  max: Number(process.env.CHAT_RATE_LIMIT_MAX || 5),
  keyGenerator: (req) => `chat:${req.body?.sessionId || req.params?.sessionId || 'unknown'}`,
})

router.post('/session', startSession)
router.post('/message', chatRateLimit, sendMessage)
router.get('/session/:sessionId/messages', validateNumericId('sessionId'), getMessages)

export default router
