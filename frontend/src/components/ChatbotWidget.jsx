import { useEffect, useRef, useState } from 'react'
import LoadingSpinner from './common/LoadingSpinner'
import { getChatMessages, sendChatMessage, startChatSession } from '../services/chatbot.service'

const BOT_INTRO = "I’m a basic support assistant, not a human."
const BOT_FALLBACK = 'I can help guide you or connect you to support.'
const SESSION_KEY = 'chat_session_id'
const GUEST_KEY = 'chat_guest_id'

const getGuestId = () => {
  const existing = localStorage.getItem(GUEST_KEY)
  if (existing) return existing
  const id =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `guest-${Date.now()}-${Math.random().toString(16).slice(2)}`
  localStorage.setItem(GUEST_KEY, id)
  return id
}

function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [sessionId, setSessionId] = useState(localStorage.getItem(SESSION_KEY))
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState('')
  const listRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    const guestId = getGuestId()

    const initialize = async () => {
      setIsLoading(true)
      setError('')
      try {
        const session = await startChatSession(guestId)
        const nextSessionId = session?.id ?? session?._id
        if (!nextSessionId) {
          throw new Error('Invalid chat session')
        }
        setSessionId(String(nextSessionId))
        localStorage.setItem(SESSION_KEY, String(nextSessionId))
        const list = await getChatMessages(nextSessionId, guestId)
        if (Array.isArray(list) && list.length > 0) {
          setMessages(list.map((msg) => ({ sender: msg.sender, text: msg.text })))
        } else {
          setMessages([{ sender: 'bot', text: BOT_INTRO }])
        }
      } catch (err) {
        setError(err?.response?.data?.message || 'ارتباط با پشتیبانی ناموفق بود.')
      } finally {
        setIsLoading(false)
      }
    }

    initialize()
  }, [isOpen])

  useEffect(() => {
    if (!listRef.current) return
    listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, isLoading, isTyping])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || !sessionId) return
    const guestId = getGuestId()
    setInput('')
    setMessages((prev) => [...prev, { sender: 'user', text }])
    setIsTyping(true)
    setError('')
    try {
      const response = await sendChatMessage(sessionId, text, guestId)
      const assistant =
        response?.assistantMessage?.text ||
        response?.assistantMessage?.content ||
        BOT_FALLBACK
      setMessages((prev) => [...prev, { sender: 'bot', text: assistant }])
    } catch (err) {
      setError(err?.response?.data?.message || 'ارسال پیام ناموفق بود.')
      setMessages((prev) => [...prev, { sender: 'bot', text: BOT_FALLBACK }])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-80 sm:w-96 bg-white rounded-2xl shadow-[0_12px_28px_rgba(0,0,0,0.18)] border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-primary text-white">
            <span className="text-body-md font-semibold">پشتیبانی</span>
            <button type="button" onClick={() => setIsOpen(false)} className="text-body-md">
              بستن
            </button>
          </div>
          <div ref={listRef} className="max-h-80 overflow-y-auto p-4 space-y-3 text-right">
            {messages.map((msg, index) => (
              <div
                key={`${msg.sender}-${index}`}
                className={`rounded-2xl px-4 py-2 text-body-md ${
                  msg.sender === 'user'
                    ? 'bg-primary text-white ml-10'
                    : 'bg-gray-100 text-text-primary mr-10'
                }`}
              >
                {msg.text}
              </div>
            ))}
            {isTyping ? (
              <div className="flex items-center justify-center gap-2 text-body-md text-text-secondary">
                <LoadingSpinner size="sm" />
                در حال تایپ...
              </div>
            ) : null}
          </div>
          {error ? <p className="px-4 text-body-md text-red-500">{error}</p> : null}
          <div className="flex items-center gap-2 p-4 border-t border-gray-100">
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="پیام خود را بنویسید..."
              disabled={isLoading || isTyping}
              className="flex-1 rounded-2xl border border-gray-200 px-4 py-2 text-body-md text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary disabled:bg-gray-50"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={isLoading || isTyping || !input.trim()}
              className="px-4 py-2 rounded-2xl bg-primary text-white text-body-md font-semibold disabled:opacity-70"
            >
              ارسال
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-primary text-white shadow-lg text-body-md font-semibold"
        >
          چت
        </button>
      )}
    </div>
  )
}

export default ChatbotWidget
