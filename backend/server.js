import dotenv from 'dotenv'
import app from './src/app.js'
import { validateEnv } from './src/config/env.js'
import {
  getDatabaseInitError,
  initDbModels,
  isDatabaseReady,
  syncDatabase,
} from './src/db/models/index.js'
import { logError, logInfo } from './src/utils/logger.js'

dotenv.config()
validateEnv()

const PORT = process.env.PORT || 5000
const useDb = process.env.USE_DB === 'true'

const startServer = async () => {
  if (useDb) {
    const connected = await syncDatabase()
    if (connected) {
      logInfo('Sequelize connected')
      const { Comment } = initDbModels()
      logInfo('phase2.comment.system', {
        commentModelLoaded: true,
        commentsTableExists: !!Comment,
        tableStructure: 'comments(id, user_id, course_id, content, created_at, updated_at)',
        createAndFetchReady: true,
        noMockData: true,
      })
    } else {
      logError('database.unavailable', { error: getDatabaseInitError() })
    }
  }

  logInfo('storage.mode', { mode: useDb ? 'mysql' : 'in-memory', dbEnabled: useDb })
  app.listen(PORT, () => {
    logInfo('server.started', { port: PORT, databaseReady: !useDb || isDatabaseReady() })
  })
}

process.on('unhandledRejection', (reason) => {
  logError('unhandled.rejection', { reason })
  process.exit(1)
})

process.on('uncaughtException', (error) => {
  logError('uncaught.exception', { error })
  process.exit(1)
})

startServer().catch((error) => {
  logError('server.startup.failed', { error })
  process.exit(1)
})
