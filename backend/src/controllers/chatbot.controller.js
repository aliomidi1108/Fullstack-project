import { getMessages, sendMessage, startSession } from '../services/chat.service.js'
import { getUserByToken } from '../services/user.service.js'

const getOptionalUser = (req) => {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return null
  return getUserByToken(token)
}

const startSessionHandler = async (req, res) => {
  try {
    const user = getOptionalUser(req)
    const result = startSession({ userId: user?.id, guestId: req.body?.guestId })
    if (result.status >= 400) {
      return res.status(result.status).json({ message: result.message })
    }
    return res.status(result.status).json(result.payload)
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
}

const getMessagesHandler = async (req, res) => {
  try {
    const user = getOptionalUser(req)
    const result = getMessages({
      sessionId: req.params?.sessionId,
      userId: user?.id,
      guestId: req.query?.guestId,
    })
    if (result.status >= 400) {
      return res.status(result.status).json({ message: result.message })
    }
    return res.json(result.payload)
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
}

const sendMessageHandler = async (req, res) => {
  try {
    const user = getOptionalUser(req)
    const result = sendMessage({
      sessionId: req.body?.sessionId,
      userId: user?.id,
      guestId: req.body?.guestId,
      text: req.body?.text,
    })
    if (result.status >= 400) {
      return res.status(result.status).json({ message: result.message })
    }
    return res.status(result.status).json(result.payload)
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export {
  getMessagesHandler as getMessages,
  sendMessageHandler as sendMessage,
  startSessionHandler as startSession,
}
