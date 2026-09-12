const defaultKeyGenerator = (req) => req.ip || 'unknown'
const store = new Map()

const cleanupExpired = () => {
  const now = Date.now()
  for (const [key, record] of store.entries()) {
    if (!record || record.resetAt <= now) {
      store.delete(key)
    }
  }
}

setInterval(cleanupExpired, 60 * 1000).unref()

const rateLimit = ({ windowMs, max, keyGenerator = defaultKeyGenerator }) => {
  if (!windowMs || !max) {
    throw new Error('rateLimit requires windowMs and max')
  }

  return (req, res, next) => {
    try {
      const now = Date.now()
      const resetAt = now + windowMs
      const rawKey = keyGenerator(req)
      const key = String(rawKey || 'unknown').slice(0, 200)

      const record = store.get(key)
      if (!record || record.resetAt <= now) {
        store.set(key, { count: 1, resetAt })
        return next()
      }

      if (record.count >= max) {
        return res.status(429).json({ message: 'Too many requests' })
      }

      store.set(key, { ...record, count: record.count + 1 })
      return next()
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}

const userRateLimit = ({ windowMs, max }) =>
  rateLimit({
    windowMs,
    max,
    keyGenerator: (req) => {
      const userId = req.user?.id ? String(req.user.id) : 'anonymous'
      return `user:${userId}:${req.baseUrl}${req.path}`
    },
  })

export { rateLimit, userRateLimit }
