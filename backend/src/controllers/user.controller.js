import { updateUserProfile } from '../services/user.service.js'

const isDbMode = () => process.env.USE_DB === 'true'

const isValidEmail = (value) => {
  if (!value) return true
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(value)
}

const isValidAvatarUrl = (value) => {
  if (!value) return true
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch (error) {
    return false
  }
}

const getMe = async (req, res) => {
  return res.json(req.user)
}

const updateMe = async (req, res) => {
  try {
    if (isDbMode()) {
      return res.json(req.user)
    }

    const { name, email, avatar } = req.body || {}
    const nextPayload = {}

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 80) {
        return res.status(400).json({ message: 'Invalid name' })
      }
      nextPayload.name = name.trim()
    }

    if (email !== undefined) {
      if (typeof email !== 'string' || !isValidEmail(email.trim())) {
        return res.status(400).json({ message: 'Invalid email' })
      }
      nextPayload.email = email.trim()
    }

    if (avatar !== undefined) {
      if (avatar !== null && typeof avatar !== 'string') {
        return res.status(400).json({ message: 'Invalid avatar URL' })
      }
      const normalizedAvatar = typeof avatar === 'string' ? avatar.trim() : ''
      if (normalizedAvatar && !isValidAvatarUrl(normalizedAvatar)) {
        return res.status(400).json({ message: 'Invalid avatar URL' })
      }
      nextPayload.avatar = normalizedAvatar
    }

    const updatedUser = updateUserProfile(req.user.id, nextPayload)
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' })
    }
    return res.json(updatedUser)
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
}

const deleteAvatar = async (req, res) => {
  try {
    if (isDbMode()) {
      return res.json(req.user)
    }

    const updatedUser = updateUserProfile(req.user.id, { avatar: '' })
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' })
    }
    return res.json(updatedUser)
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export { getMe, updateMe, deleteAvatar }
