import { addCoursesToUser } from './user.service.js'

const courses = new Map([
  [
    1,
    {
      id: 1,
      title: 'آشنایی با بورس',
      description: 'دوره مقدماتی بازار سرمایه برای شروع امن و اصولی.',
      price: 0,
      videoUrl: 'https://res.cloudinary.com/demo/video/upload/dog.mp4',
      thumbnailUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      isPublished: true,
      level: 'مقدماتی',
      durationMinutes: 24,
      studentIds: [1],
      instructor: {
        name: 'مانی رحمان',
        avatar: '',
        bio: 'تحلیلگر بازار سرمایه',
      },
      sessions: [
        { id: 1, title: 'مفاهیم پایه', duration: '12 دقیقه', description: 'تعریف بازار و ابزارها' },
        { id: 2, title: 'مدیریت ریسک', duration: '12 دقیقه', description: 'اصول کنترل ریسک' },
      ],
    },
  ],
  [
    2,
    {
      id: 2,
      title: 'تحلیل تکنیکال کاربردی',
      description: 'ابزارهای تکنیکال مورد نیاز برای تصمیم‌گیری روزانه.',
      price: 790000,
      videoUrl: 'https://res.cloudinary.com/demo/video/upload/dog.mp4',
      thumbnailUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      isPublished: true,
      level: 'متوسط',
      durationMinutes: 41,
      studentIds: [],
      instructor: {
        name: 'مانی رحمان',
        avatar: '',
        bio: 'مدرس تحلیل تکنیکال',
      },
      sessions: [
        { id: 1, title: 'ساختار روند', duration: '18 دقیقه', description: 'تشخیص روند بازار' },
        { id: 2, title: 'الگوهای کلاسیک', duration: '23 دقیقه', description: 'الگوهای برگشتی و ادامه‌دهنده' },
      ],
    },
  ],
])

let nextCourseId = 3

const normalizeId = (value) => {
  const id = Number(value)
  if (!Number.isInteger(id) || id <= 0) return null
  return id
}

const toPublicCourse = (course) => {
  if (!course) return null
  return {
    id: course.id,
    title: course.title,
    description: course.description,
    price: course.price,
    videoUrl: course.price > 0 ? null : course.videoUrl,
    thumbnailUrl: course.thumbnailUrl,
    isPublished: course.isPublished,
    level: course.level,
    students: [...(course.studentIds || [])],
    sessions: [...(course.sessions || [])],
    reviews: [],
    instructor: course.instructor || null,
    video: {
      url: course.videoUrl,
      thumbnail: course.thumbnailUrl,
      duration: course.durationMinutes,
      type: 'mp4',
    },
  }
}

const getCourseRecordById = (courseId) => {
  const id = normalizeId(courseId)
  if (!id) return null
  return courses.get(id) || null
}

const listPublishedCourses = () =>
  Array.from(courses.values())
    .filter((course) => course.isPublished)
    .map((course) => toPublicCourse(course))

const getCourseById = (courseId) => {
  const course = getCourseRecordById(courseId)
  if (!course || !course.isPublished) return null
  return toPublicCourse(course)
}

const isUserEnrolled = (courseId, userId) => {
  const course = getCourseRecordById(courseId)
  const normalizedUserId = normalizeId(userId)
  if (!course || !normalizedUserId) return false
  return (course.studentIds || []).includes(normalizedUserId)
}

const canUserAccessCourse = ({ courseId, user }) => {
  const course = getCourseRecordById(courseId)
  if (!course || !course.isPublished) return false
  if (Number(course.price || 0) <= 0) return true
  if (!user) return false
  if (user.role === 'admin') return true
  if ((user.courses || []).includes(course.id)) return true
  return (course.studentIds || []).includes(Number(user.id))
}

const getCourseContent = ({ courseId, user }) => {
  const course = getCourseRecordById(courseId)
  if (!course || !course.isPublished) {
    return { status: 404, message: 'Course not found' }
  }
  if (!canUserAccessCourse({ courseId, user })) {
    return { status: 403, message: 'Access denied' }
  }
  return {
    status: 200,
    payload: {
      courseId: course.id,
      video: {
        url: course.videoUrl,
        type: 'mp4',
        duration: course.durationMinutes * 60,
      },
    },
  }
}

const createCourse = (payload = {}) => {
  const course = {
    id: nextCourseId,
    title: String(payload.title || '').trim(),
    description: String(payload.description || '').trim(),
    price: Number(payload.price || 0),
    videoUrl: String(payload.videoUrl || '').trim(),
    thumbnailUrl: String(payload.thumbnailUrl || '').trim(),
    isPublished: Boolean(payload.isPublished),
    level: String(payload.level || 'نامشخص').trim(),
    durationMinutes: Number(payload.durationMinutes || 0) || 0,
    studentIds: [],
    instructor: payload.instructor || null,
    sessions: Array.isArray(payload.sessions) ? payload.sessions : [],
  }
  courses.set(course.id, course)
  nextCourseId += 1
  return toPublicCourse(course)
}

const updateCourse = (courseId, payload = {}) => {
  const course = getCourseRecordById(courseId)
  if (!course) return null
  if (payload.title !== undefined) course.title = String(payload.title || '').trim()
  if (payload.description !== undefined) course.description = String(payload.description || '').trim()
  if (payload.price !== undefined) course.price = Number(payload.price || 0)
  if (payload.videoUrl !== undefined) course.videoUrl = String(payload.videoUrl || '').trim()
  if (payload.thumbnailUrl !== undefined) course.thumbnailUrl = String(payload.thumbnailUrl || '').trim()
  if (payload.isPublished !== undefined) course.isPublished = Boolean(payload.isPublished)
  if (payload.level !== undefined) course.level = String(payload.level || '').trim()
  return toPublicCourse(course)
}

const deleteCourse = (courseId) => {
  const id = normalizeId(courseId)
  if (!id || !courses.has(id)) return false
  courses.delete(id)
  return true
}

const enrollUserInCourses = ({ userId, courseIds }) => {
  const uid = normalizeId(userId)
  if (!uid) return
  const normalizedCourseIds = Array.from(
    new Set((courseIds || []).map((id) => normalizeId(id)).filter(Boolean))
  )
  for (const courseId of normalizedCourseIds) {
    const course = getCourseRecordById(courseId)
    if (!course) continue
    const set = new Set(course.studentIds || [])
    set.add(uid)
    course.studentIds = Array.from(set)
  }
  addCoursesToUser(uid, normalizedCourseIds)
}

const getCoursePrice = (courseId) => {
  const course = getCourseRecordById(courseId)
  if (!course) return null
  return Number(course.price || 0)
}

export {
  canUserAccessCourse,
  createCourse,
  deleteCourse,
  enrollUserInCourses,
  getCourseById,
  getCourseContent,
  getCoursePrice,
  getCourseRecordById,
  isUserEnrolled,
  listPublishedCourses,
  toPublicCourse,
  updateCourse,
}
