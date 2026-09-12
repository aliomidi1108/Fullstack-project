import express from 'express'
import authMiddleware from '../middlewares/auth.middleware.js'

const router = express.Router()

router.get('/', authMiddleware, (req, res) => {
  return res.json({ ok: true, user: req.user })
})

export default router
