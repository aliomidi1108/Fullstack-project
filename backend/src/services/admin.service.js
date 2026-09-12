import { listPublishedCourses } from './course.service.js'
import { listUsers } from './user.service.js'

const getSummary = () => {
  const users = listUsers()
  const courses = listPublishedCourses()
  const totalUsers = users.length
  const totalCourses = courses.length
  const totalRevenue = courses.reduce((sum, course) => {
    const studentsCount = Array.isArray(course.students) ? course.students.length : 0
    return sum + Number(course.price || 0) * studentsCount
  }, 0)
  return {
    totalUsers,
    totalCourses,
    totalRevenue,
    totalPurchases: courses.reduce((sum, course) => sum + (course.students?.length || 0), 0),
  }
}

const getSales = () => {
  const courses = listPublishedCourses()
  return courses.map((course) => ({
    date: new Date().toISOString().slice(0, 10),
    purchases: course.students?.length || 0,
    revenue: Number(course.price || 0) * (course.students?.length || 0),
    cumulativeRevenue: Number(course.price || 0) * (course.students?.length || 0),
    courseStats: [
      {
        courseId: course.id,
        title: course.title,
        purchases: course.students?.length || 0,
        revenue: Number(course.price || 0) * (course.students?.length || 0),
      },
    ],
  }))
}

const getTopCourses = () => {
  const courses = listPublishedCourses()
  return courses
    .map((course) => ({
      courseId: course.id,
      title: course.title,
      purchases: course.students?.length || 0,
      revenue: Number(course.price || 0) * (course.students?.length || 0),
    }))
    .sort((a, b) => b.purchases - a.purchases)
    .slice(0, 5)
}

export { getSales, getSummary, getTopCourses }
