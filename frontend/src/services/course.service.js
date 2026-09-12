import api from './api'

const listCourses = async () => {
  const { data } = await api.get('/courses')
  return data
}

const getCourseById = async (courseId) => {
  const { data } = await api.get(`/courses/${courseId}`)
  return data
}

const getCourseContent = async (courseId) => {
  const { data } = await api.get(`/courses/${courseId}/content`)
  return data
}

const getCourseComments = async (courseId) => {
  const { data } = await api.get(`/courses/${courseId}/comments`)
  return data
}

const addCourseComment = async (courseId, content) => {
  const { data } = await api.post(`/courses/${courseId}/comments`, { content })
  return data
}

const updateCourseComment = async (courseId, commentId, content) => {
  const { data } = await api.put(`/courses/${courseId}/comments/${commentId}`, { content })
  return data
}

const getCourseVideos = async (courseId) => {
  const { data } = await api.get(`/courses/${courseId}/videos`)
  return data
}

const deleteCourseComment = async (courseId, commentId) => {
  const { data } = await api.delete(`/courses/${courseId}/comments/${commentId}`)
  return data
}

export {
  listCourses,
  getCourseById,
  getCourseContent,
  getCourseComments,
  addCourseComment,
  updateCourseComment,
  deleteCourseComment,
  getCourseVideos,
}
