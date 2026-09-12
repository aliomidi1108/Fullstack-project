import api from './api'

const startChatSession = async (guestId) => {
  const { data } = await api.post('/chat/session', { guestId })
  return data
}

const getChatMessages = async (sessionId, guestId) => {
  const { data } = await api.get(`/chat/session/${sessionId}/messages`, { params: { guestId } })
  return data
}

const sendChatMessage = async (sessionId, text, guestId) => {
  const { data } = await api.post('/chat/message', { sessionId, text, guestId })
  return data
}

export { startChatSession, getChatMessages, sendChatMessage }
