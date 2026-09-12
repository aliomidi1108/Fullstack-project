import { MOCK_TOKEN, getMockUser } from '../services/auth/mockAuth.service.js'

const mockAuthMiddleware = (req, res, next) => {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : header
  if (token !== MOCK_TOKEN) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  req.user = getMockUser()
  return next()
}

export default mockAuthMiddleware
