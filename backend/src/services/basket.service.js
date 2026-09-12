import { getCourseById, getCoursePrice } from './course.service.js'

const baskets = new Map()

const normalizeId = (value) => {
  const id = Number(value)
  if (!Number.isInteger(id) || id <= 0) return null
  return id
}

const getOrCreateBasket = (userId) => {
  const uid = normalizeId(userId)
  if (!uid) return null
  if (!baskets.has(uid)) {
    baskets.set(uid, { id: uid, userId: uid, courseIds: [] })
  }
  return baskets.get(uid)
}

const toBasketPayload = (basket) => {
  if (!basket) return { courses: [], totalPrice: 0, items: [] }
  const items = basket.courseIds
    .map((courseId) => getCourseById(courseId))
    .filter(Boolean)
    .map((course) => ({ course }))
  const totalPrice = basket.courseIds.reduce((sum, courseId) => {
    const price = getCoursePrice(courseId) || 0
    return sum + price
  }, 0)
  return {
    id: basket.id,
    userId: basket.userId,
    courses: [...basket.courseIds],
    totalPrice,
    items,
  }
}

const getBasket = (userId) => {
  const basket = getOrCreateBasket(userId)
  return toBasketPayload(basket)
}

const addToBasket = ({ userId, courseId }) => {
  const uid = normalizeId(userId)
  const cid = normalizeId(courseId)
  if (!uid || !cid) return { status: 400, message: 'Invalid payload' }
  const course = getCourseById(cid)
  if (!course) return { status: 404, message: 'Course not found' }
  const basket = getOrCreateBasket(uid)
  const set = new Set(basket.courseIds)
  set.add(cid)
  basket.courseIds = Array.from(set)
  return { status: 200, payload: toBasketPayload(basket) }
}

const removeFromBasket = ({ userId, courseId }) => {
  const uid = normalizeId(userId)
  const cid = normalizeId(courseId)
  if (!uid || !cid) return { status: 400, message: 'Invalid payload' }
  const basket = getOrCreateBasket(uid)
  basket.courseIds = basket.courseIds.filter((id) => id !== cid)
  return { status: 200, payload: toBasketPayload(basket) }
}

const clearBasket = (userId) => {
  const basket = getOrCreateBasket(userId)
  if (!basket) return { status: 400, message: 'Invalid userId' }
  basket.courseIds = []
  return { status: 200, payload: toBasketPayload(basket) }
}

export { addToBasket, clearBasket, getBasket, removeFromBasket }
