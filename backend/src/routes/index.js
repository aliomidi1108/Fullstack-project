import express from 'express'
import authRoutes from './auth.routes.js'
import userRoutes from './user.routes.js'
import courseRoutes from './course.routes.js'
import blogRoutes from './blog.routes.js'
import basketRoutes from './basket.routes.js'
import walletRoutes from './wallet.routes.js'
import reportRoutes from './report.routes.js'
import paymentRoutes from './payment.routes.js'
import chatbotRoutes from './chatbot.routes.js'
import adminRoutes from './admin.routes.js'
import dashboardRoutes from './dashboard.routes.js'

const router = express.Router()

router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/courses', courseRoutes)
router.use('/blogs', blogRoutes)
router.use('/basket', basketRoutes)
router.use('/wallet', walletRoutes)
router.use('/reports', reportRoutes)
router.use('/payments', paymentRoutes)
router.use('/chat', chatbotRoutes)
router.use('/admin', adminRoutes)
router.use('/dashboard', dashboardRoutes)
router.get('/health', (req, res) => res.json({ ok: true }))

export default router
