import express from 'express'
import cors from 'cors'
import apiRoutes from './routes/index.js'
import requestLogger from './middlewares/requestLogger.middleware.js'
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js'
import { requireJsonBody } from './middlewares/validate.middleware.js'
import { rateLimit } from './middlewares/rateLimit.middleware.js'
import dbAvailabilityMiddleware from './middlewares/dbAvailability.middleware.js'

const app = express()

const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true)
      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true)
      }
      return callback(new Error('Not allowed by CORS'))
    },
    credentials: true,
  })
)

app.use(express.json({ limit: process.env.REQUEST_BODY_LIMIT || '1mb' }))
app.use(requireJsonBody)
app.use(requestLogger)

const globalRateLimit = rateLimit({
  windowMs: Number(process.env.GLOBAL_RATE_LIMIT_WINDOW_MS || 10 * 60 * 1000),
  max: Number(process.env.GLOBAL_RATE_LIMIT_MAX || 300),
  keyGenerator: (req) => `global:${req.ip}`,
})
app.use(globalRateLimit)

app.get('/health', (req, res) => {
  res.json({ status: 'OK' })
})

app.use('/api', dbAvailabilityMiddleware, apiRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

export default app
