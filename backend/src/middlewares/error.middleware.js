import { logError } from '../utils/logger.js'

class AppError extends Error {
  constructor(message, status = 500, code = 'internal_error') {
    super(message)
    this.status = status
    this.code = code
    this.isOperational = true
  }
}

const notFoundHandler = (req, res, next) => {
  next(new AppError('Route not found', 404, 'not_found'))
}

const errorHandler = (err, req, res, next) => {
  const status = err.status || 500
  const requestId = req.requestId

  logError('request.failed', {
    requestId,
    method: req.method,
    path: req.originalUrl,
    status,
    message: err.message,
    stack: err.stack,
  })

  const safeMessage = status >= 500 ? 'Internal server error' : err.message
  res.status(status).json({
    message: safeMessage,
    code: err.code || 'request_error',
    requestId,
  })
}

export { AppError, notFoundHandler, errorHandler }
