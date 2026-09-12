import { AppError } from '../middlewares/error.middleware.js'
import { getCourseRecordById } from './course.service.js'
import {
  createComment as createCommentRepo,
  getCommentsByCourse,
  findCommentByIdWithUser,
  findCommentByIdAndCourseId,
  updateComment,
  deleteComment,
} from '../repositories/comment.repository.js'

const toPublicComment = (row) => {
  if (!row) return null
  const user = row.user || {}
  return {
    id: row.id,
    content: row.content,
    createdAt: row.created_at,
    user: {
      id: user.id,
      phone: user.phone,
    },
  }
}

const createComment = async ({ courseId, userId, content }) => {
  const normalizedContent = String(content || '').trim()
  if (!normalizedContent) {
    throw new AppError('Content is required', 400, 'validation_error')
  }

  const course = getCourseRecordById(courseId)
  if (!course) {
    throw new AppError('Course not found', 404, 'not_found')
  }

  const row = await createCommentRepo({
    userId,
    courseId,
    content: normalizedContent,
  })
  const full = await findCommentByIdWithUser(row.id)
  return toPublicComment(full)
}

const listCommentsByCourse = async (courseId) => {
  const course = getCourseRecordById(courseId)
  if (!course) {
    throw new AppError('Course not found', 404, 'not_found')
  }

  const rows = await getCommentsByCourse(courseId)
  return rows.map((r) => toPublicComment(r))
}

const updateCommentByUser = async ({ courseId, commentId, userId, userRole, content }) => {
  const normalizedContent = String(content || '').trim()
  if (!normalizedContent) {
    throw new AppError('Content is required', 400, 'validation_error')
  }

  const comment = await findCommentByIdAndCourseId(commentId, courseId)
  if (!comment) {
    throw new AppError('Comment not found', 404, 'not_found')
  }

  if (userRole !== 'admin' && Number(userId) !== comment.user_id) {
    throw new AppError('Access denied', 403, 'forbidden')
  }

  await updateComment(comment.id, normalizedContent)
  const full = await findCommentByIdWithUser(comment.id)
  return toPublicComment(full)
}

const deleteCommentByUser = async ({ courseId, commentId, userId, userRole }) => {
  const comment = await findCommentByIdAndCourseId(commentId, courseId)
  if (!comment) {
    throw new AppError('Comment not found', 404, 'not_found')
  }

  if (userRole !== 'admin' && Number(userId) !== comment.user_id) {
    throw new AppError('Access denied', 403, 'forbidden')
  }

  await deleteComment(comment.id)
  return { message: 'Comment deleted' }
}

export {
  createComment as addCourseComment,
  listCommentsByCourse as listCourseComments,
  updateCommentByUser as updateCourseComment,
  deleteCommentByUser as deleteCourseComment,
}
