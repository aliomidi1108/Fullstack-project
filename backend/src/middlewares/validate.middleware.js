import { AppError } from './error.middleware.js'

const requireJsonBody = (req, res, next) => {
  const contentLength = Number(req.headers['content-length'] || 0)
  if (contentLength <= 0) return next()
  if (req.method === 'GET' || req.method === 'HEAD') return next()
  if (!req.is('application/json')) {
    return next(new AppError('Unsupported content type', 415, 'unsupported_media_type'))
  }
  return next()
}

const validateNumericId = (paramName) => (req, res, next) => {
  const value = req.params?.[paramName]
  if (!value || !/^\d+$/.test(String(value))) {
    return next(new AppError('Invalid id', 400, 'invalid_id'))
  }
  return next()
}

export { requireJsonBody, validateNumericId }
