import { getCourseById } from '../services/course.service.js'

const isEnrolled = (course, user) => {
  if (!user) return false
  if (user.role === 'admin') return true
  const userCourseIds = new Set((user.courses || []).map((id) => Number(id)))
  if (userCourseIds.has(Number(course.id))) return true
  const courseStudentIds = new Set((course.students || []).map((id) => Number(id)))
  return courseStudentIds.has(Number(user.id))
}

const courseAccessMiddleware = async (req, res, next) => {
  try {
    const course = getCourseById(req.params.id)
    if (!course) {
      return res.status(404).json({ message: 'Course not found' })
    }

    const isPaid = Number(course.price || 0) > 0
    if (isPaid && !isEnrolled(course, req.user)) {
      return res.status(403).json({ message: 'Access denied' })
    }

    req.course = course
    return next()
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
}

const courseEnrollmentMiddleware = async (req, res, next) => {
  try {
    const course = getCourseById(req.params.id)
    if (!course) {
      return res.status(404).json({ message: 'Course not found' })
    }

    if (!isEnrolled(course, req.user)) {
      return res.status(403).json({ message: 'Access denied' })
    }

    req.course = course
    return next()
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export { courseAccessMiddleware, courseEnrollmentMiddleware, isEnrolled }
