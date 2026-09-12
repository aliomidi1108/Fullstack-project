import express from 'express'
import { generateReport, listReports } from '../controllers/report.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js'
import adminMiddleware from '../middlewares/admin.middleware.js'

const router = express.Router()

router.post('/generate', authMiddleware, adminMiddleware, generateReport)
router.get('/', authMiddleware, adminMiddleware, listReports)

export default router
