import express from 'express'
import {
  listCourses,
  getCourseById,
  getCourseContent,
  createCourse,
  updateCourse,
  deleteCourse,
  listCourseComments,
  addCourseComment,
  updateCourseComment,
  deleteCourseComment,
  listCourseVideos,
  createCourseVideo,
} from '../controllers/course.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js'
import adminMiddleware from '../middlewares/admin.middleware.js'
import {
  courseAccessMiddleware,
  courseEnrollmentMiddleware,
} from '../middlewares/courseAccess.middleware.js'
import { validateNumericId } from '../middlewares/validate.middleware.js'
import { rateLimit, userRateLimit } from '../middlewares/rateLimit.middleware.js'

const router = express.Router()

const commentRateLimit = rateLimit({
  windowMs: Number(process.env.COMMENT_RATE_LIMIT_WINDOW_MS || 60 * 1000),
  max: Number(process.env.COMMENT_RATE_LIMIT_MAX || 3),
  keyGenerator: (req) => `comment:${req.user?.id || 'anonymous'}:${req.params?.id}`,
})

const userRouteLimit = userRateLimit({
  windowMs: Number(process.env.USER_RATE_LIMIT_WINDOW_MS || 60 * 1000),
  max: Number(process.env.USER_RATE_LIMIT_MAX || 30),
})

router.get('/', listCourses)
router.get('/:id', validateNumericId('id'), getCourseById)
router.get(
  '/:id/content',
  authMiddleware,
  userRouteLimit,
  validateNumericId('id'),
  courseAccessMiddleware,
  getCourseContent
)
router.get(
  '/:id/videos',
  authMiddleware,
  userRouteLimit,
  validateNumericId('id'),
  courseEnrollmentMiddleware,
  listCourseVideos
)
router.post(
  '/:id/videos',
  authMiddleware,
  userRouteLimit,
  validateNumericId('id'),
  adminMiddleware,
  createCourseVideo
)
router.get('/:id/comments', validateNumericId('id'), listCourseComments)
router.post(
  '/:id/comments',
  authMiddleware,
  userRouteLimit,
  validateNumericId('id'),
  commentRateLimit,
  addCourseComment
)
router.put(
  '/:id/comments/:commentId',
  authMiddleware,
  userRouteLimit,
  validateNumericId('id'),
  validateNumericId('commentId'),
  courseEnrollmentMiddleware,
  updateCourseComment
)
router.delete(
  '/:id/comments/:commentId',
  authMiddleware,
  userRouteLimit,
  validateNumericId('id'),
  validateNumericId('commentId'),
  courseEnrollmentMiddleware,
  deleteCourseComment
)
router.post('/', authMiddleware, adminMiddleware, createCourse)
router.put('/:id', authMiddleware, adminMiddleware, validateNumericId('id'), updateCourse)
router.delete('/:id', authMiddleware, adminMiddleware, validateNumericId('id'), deleteCourse)

export default router
