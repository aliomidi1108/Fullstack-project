import express from 'express'
import {
  listBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} from '../controllers/blog.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js'
import adminMiddleware from '../middlewares/admin.middleware.js'
import { validateNumericId } from '../middlewares/validate.middleware.js'

const router = express.Router()

router.get('/', listBlogs)
router.get('/:id', validateNumericId('id'), getBlogById)
router.post('/', authMiddleware, adminMiddleware, createBlog)
router.put('/:id', authMiddleware, adminMiddleware, validateNumericId('id'), updateBlog)
router.delete('/:id', authMiddleware, adminMiddleware, validateNumericId('id'), deleteBlog)

export default router
