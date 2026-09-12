import { getUserByToken } from '../services/user.service.js'
import { getUserByDbToken } from '../services/auth/dbAuth.service.js'

const isDbMode = () => process.env.USE_DB === 'true'

const authMiddleware = async (req, res, next) => {
  try {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const user = isDbMode() ? await getUserByDbToken(token) : getUserByToken(token)
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
}

export default authMiddleware
