import { getSales, getSummary, getTopCourses } from '../services/admin.service.js'

const respondSuccess = (res, data) => res.json({ success: true, data })
const respondError = (res, status, message) => res.status(status).json({ success: false, message })

const getSummaryHandler = async (req, res) => {
  try {
    return respondSuccess(res, getSummary())
  } catch (error) {
    return respondError(res, 500, 'Internal server error')
  }
}

const getSalesHandler = async (req, res) => {
  try {
    return respondSuccess(res, getSales())
  } catch (error) {
    return respondError(res, 500, 'Internal server error')
  }
}

const getTopCoursesHandler = async (req, res) => {
  try {
    return respondSuccess(res, getTopCourses())
  } catch (error) {
    return respondError(res, 500, 'Internal server error')
  }
}

export {
  getSalesHandler as getSales,
  getSummaryHandler as getSummary,
  getTopCoursesHandler as getTopCourses,
}
