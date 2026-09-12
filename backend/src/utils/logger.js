import pino from 'pino'

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  redact: ['req.headers.authorization', 'token', 'refreshToken'],
})

const logInfo = (message, meta = {}) => {
  logger.info(meta, message)
}

const logError = (message, meta = {}) => {
  logger.error(meta, message)
}

export { logger, logInfo, logError }
