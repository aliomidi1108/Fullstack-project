import { isDatabaseReady } from '../db/models/index.js'

const dbAvailabilityMiddleware = (req, res, next) => {
  if (process.env.USE_DB !== 'true') {
    return next()
  }

  if (isDatabaseReady()) {
    return next()
  }

  return res.status(503).json({ message: 'Database unavailable' })
}

export default dbAvailabilityMiddleware
