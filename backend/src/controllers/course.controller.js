import {
  createCourse,
  deleteCourse,
  getCourseById,
  getCourseContent,
  listPublishedCourses,
  updateCourse,
} from '../services/course.service.js'
import {
  addCourseComment,
  listCourseComments,
  updateCourseComment,
  deleteCourseComment,
} from '../services/comment.service.js'
import { createCourseVideo, findVideosByCourseId } from '../repositories/courseVideo.repository.js'

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0

const parseBoolean = (value) => {
  if (value === undefined) return undefined
  if (typeof value === 'boolean') return value
  if (value === 'true') return true
  if (value === 'false') return false
  return null
}

const parsePrice = (value) => {
  if (value === undefined) return undefined
  const numeric = Number(value)
  if (!Number.isFinite(numeric) || numeric < 0) return null
  return numeric
}

const listCourses = async (req, res) => {
  try {
    return res.json(listPublishedCourses())
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
}

const getCourseByIdHandler = async (req, res) => {
  try {
    const course = getCourseById(req.params.id)
    if (!course) {
      return res.status(404).json({ message: 'Course not found' })
    }
    return res.json(course)
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
}

const getCourseContentHandler = async (req, res) => {
  try {
    const result = getCourseContent({ courseId: req.params.id, user: req.user })
    if (result.status !== 200) {
      return res.status(result.status).json({ message: result.message })
    }
    return res.json(result.payload)
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
}

const createCourseHandler = async (req, res) => {
  try {
    const { title, description, price, videoUrl, thumbnailUrl, isPublished, level } = req.body || {}
    if (!isNonEmptyString(title)) {
      return res.status(400).json({ message: 'Title is required' })
    }
    if (!isNonEmptyString(videoUrl)) {
      return res.status(400).json({ message: 'videoUrl is required' })
    }
    const parsedPrice = parsePrice(price)
    if (parsedPrice === null) {
      return res.status(400).json({ message: 'Invalid price' })
    }
    const parsedIsPublished = parseBoolean(isPublished)
    if (parsedIsPublished === null) {
      return res.status(400).json({ message: 'Invalid isPublished' })
    }
    const course = createCourse({
      title: title.trim(),
      description: typeof description === 'string' ? description.trim() : '',
      price: parsedPrice ?? 0,
      videoUrl: videoUrl.trim(),
      thumbnailUrl: typeof thumbnailUrl === 'string' ? thumbnailUrl.trim() : '',
      isPublished: parsedIsPublished ?? false,
      level: typeof level === 'string' ? level.trim() : 'نامشخص',
    })
    return res.status(201).json(course)
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
}

const updateCourseHandler = async (req, res) => {
  try {
    const { title, description, price, videoUrl, thumbnailUrl, isPublished, level } = req.body || {}
    const parsedPrice = parsePrice(price)
    if (price !== undefined && parsedPrice === null) {
      return res.status(400).json({ message: 'Invalid price' })
    }
    const parsedIsPublished = parseBoolean(isPublished)
    if (isPublished !== undefined && parsedIsPublished === null) {
      return res.status(400).json({ message: 'Invalid isPublished' })
    }
    const updated = updateCourse(req.params.id, {
      ...(title !== undefined ? { title } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(price !== undefined ? { price: parsedPrice } : {}),
      ...(videoUrl !== undefined ? { videoUrl } : {}),
      ...(thumbnailUrl !== undefined ? { thumbnailUrl } : {}),
      ...(isPublished !== undefined ? { isPublished: parsedIsPublished } : {}),
      ...(level !== undefined ? { level } : {}),
    })
    if (!updated) {
      return res.status(404).json({ message: 'Course not found' })
    }
    return res.json(updated)
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
}

const deleteCourseHandler = async (req, res) => {
  try {
    const deleted = deleteCourse(req.params.id)
    if (!deleted) {
      return res.status(404).json({ message: 'Course not found' })
    }
    return res.json({ message: 'Course deleted' })
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
}

const listCourseCommentsHandler = async (req, res, next) => {
  try {
    const comments = await listCourseComments(req.params.id)
    return res.json(comments)
  } catch (error) {
    next(error)
  }
}

const addCourseCommentHandler = async (req, res, next) => {
  try {
    const comment = await addCourseComment({
      courseId: req.params.id,
      userId: req.user.id,
      content: req.body?.content,
    })
    return res.status(201).json(comment)
  } catch (error) {
    next(error)
  }
}

const updateCourseCommentHandler = async (req, res, next) => {
  try {
    const comment = await updateCourseComment({
      courseId: req.params.id,
      commentId: req.params.commentId,
      userId: req.user.id,
      userRole: req.user.role,
      content: req.body?.content,
    })
    return res.json(comment)
  } catch (error) {
    next(error)
  }
}

const deleteCourseCommentHandler = async (req, res, next) => {
  try {
    const result = await deleteCourseComment({
      courseId: req.params.id,
      commentId: req.params.commentId,
      userId: req.user.id,
      userRole: req.user.role,
    })
    return res.json(result)
  } catch (error) {
    next(error)
  }
}

const listCourseVideosHandler = async (req, res) => {
  try {
    const course = getCourseById(req.params.id)
    if (!course) {
      return res.status(404).json({ message: 'Course not found' })
    }
    const videos = await findVideosByCourseId(req.params.id)
    return res.json(videos)
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
}

const createCourseVideoHandler = async (req, res) => {
  try {
    const course = getCourseById(req.params.id)
    if (!course) {
      return res.status(404).json({ message: 'Course not found' })
    }
    const { title, videoUrl, duration, order } = req.body || {}
    if (!isNonEmptyString(title)) {
      return res.status(400).json({ message: 'Title is required' })
    }
    if (!isNonEmptyString(videoUrl)) {
      return res.status(400).json({ message: 'videoUrl is required' })
    }
    const parsedDuration = Math.max(0, Number(duration) || 0)
    const parsedOrder = Math.max(0, Number(order) || 0)
    const video = await createCourseVideo({
      courseId: req.params.id,
      title: title.trim(),
      videoUrl: videoUrl.trim(),
      duration: parsedDuration,
      order: parsedOrder,
    })
    return res.status(201).json(video)
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export {
  addCourseCommentHandler as addCourseComment,
  createCourseHandler as createCourse,
  createCourseVideoHandler as createCourseVideo,
  deleteCourseHandler as deleteCourse,
  deleteCourseCommentHandler as deleteCourseComment,
  getCourseByIdHandler as getCourseById,
  getCourseContentHandler as getCourseContent,
  listCourseCommentsHandler as listCourseComments,
  listCourseVideosHandler as listCourseVideos,
  listCourses,
  updateCourseHandler as updateCourse,
  updateCourseCommentHandler as updateCourseComment,
}
