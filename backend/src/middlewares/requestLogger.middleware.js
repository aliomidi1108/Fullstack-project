import { logInfo } from '../utils/logger.js'

const requestLogger = (req, res, next) => {
  const start = Date.now()
  const requestId = req.headers['x-request-id'] || `${Date.now()}-${Math.random()}`
  req.requestId = requestId

  res.on('finish', () => {
    const durationMs = Date.now() - start
    logInfo('request.completed', {
      requestId,
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs,
      ip: req.ip,
    })
  })

  next()
}

export default requestLogger
