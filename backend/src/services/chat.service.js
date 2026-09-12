const sessions = new Map()
const messages = new Map()

let nextSessionId = 1
let nextMessageId = 1

const sanitizeText = (value) => {
  if (typeof value !== 'string') return ''
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

const getOrCreateSession = ({ userId, guestId }) => {
  const normalizedGuestId = String(guestId || '').trim()
  const uid = Number(userId) || null
  const existing = Array.from(sessions.values()).find(
    (session) =>
      session.status === 'open' &&
      (uid ? Number(session.userId) === uid : session.guestId === normalizedGuestId)
  )
  if (existing) return existing
  const session = {
    id: nextSessionId,
    userId: uid,
    guestId: normalizedGuestId || `guest-${Date.now()}`,
    status: 'open',
    createdAt: new Date().toISOString(),
  }
  sessions.set(session.id, session)
  messages.set(session.id, [
    {
      id: nextMessageId,
      sessionId: session.id,
      sender: 'bot',
      text: "I’m a basic support assistant, not a human.",
      createdAt: new Date().toISOString(),
    },
  ])
  nextSessionId += 1
  nextMessageId += 1
  return session
}

const validateSessionAccess = ({ session, userId, guestId }) => {
  if (!session) return false
  if (session.userId) {
    return Number(session.userId) === Number(userId)
  }
  return session.guestId === String(guestId || '').trim()
}

const startSession = ({ userId, guestId }) => {
  if (!userId && !String(guestId || '').trim()) {
    return { status: 400, message: 'guestId is required' }
  }
  const session = getOrCreateSession({ userId, guestId })
  return { status: 201, payload: { ...session } }
}

const getMessages = ({ sessionId, userId, guestId }) => {
  const sid = Number(sessionId)
  if (!Number.isInteger(sid) || sid <= 0) {
    return { status: 400, message: 'Invalid sessionId' }
  }
  const session = sessions.get(sid)
  if (!session) return { status: 404, message: 'Session not found' }
  if (!validateSessionAccess({ session, userId, guestId })) {
    return { status: 403, message: 'Access denied' }
  }
  return { status: 200, payload: [...(messages.get(sid) || [])] }
}

const sendMessage = ({ sessionId, userId, guestId, text }) => {
  const sid = Number(sessionId)
  if (!Number.isInteger(sid) || sid <= 0) {
    return { status: 400, message: 'Session is required' }
  }
  const normalizedText = sanitizeText(text)
  if (!normalizedText) {
    return { status: 400, message: 'Message is required' }
  }
  const session = sessions.get(sid)
  if (!session) return { status: 404, message: 'Session not found' }
  if (!validateSessionAccess({ session, userId, guestId })) {
    return { status: 403, message: 'Access denied' }
  }
  const list = messages.get(sid) || []
  const userMessage = {
    id: nextMessageId,
    sessionId: sid,
    sender: 'user',
    text: normalizedText,
    createdAt: new Date().toISOString(),
  }
  nextMessageId += 1
  const assistantMessage = {
    id: nextMessageId,
    sessionId: sid,
    sender: 'bot',
    text: 'پیام شما دریافت شد. به زودی پاسخ دقیق‌تری ارائه می‌شود.',
    createdAt: new Date().toISOString(),
  }
  nextMessageId += 1
  list.push(userMessage, assistantMessage)
  messages.set(sid, list)
  return { status: 201, payload: { userMessage, assistantMessage } }
}

export { getMessages, sendMessage, startSession }
