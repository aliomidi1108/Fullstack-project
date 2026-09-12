import { addToBasket, clearBasket, getBasket, removeFromBasket } from '../services/basket.service.js'

const getBasketHandler = async (req, res) => {
  try {
    const payload = getBasket(req.user?.id || 1)
    return res.json(payload)
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
}

const addToBasketHandler = async (req, res) => {
  try {
    const routeCourseId = req.params?.courseId
    const bodyCourseId = req.body?.courseId
    const courseId = routeCourseId || bodyCourseId
    const result = addToBasket({ userId: req.user?.id || 1, courseId })
    if (result.status !== 200) {
      return res.status(result.status).json({ message: result.message })
    }
    return res.json(result.payload)
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
}

const removeFromBasketHandler = async (req, res) => {
  try {
    const result = removeFromBasket({
      userId: req.user?.id || 1,
      courseId: req.params?.courseId,
    })
    if (result.status !== 200) {
      return res.status(result.status).json({ message: result.message })
    }
    return res.json(result.payload)
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
}

const clearBasketHandler = async (req, res) => {
  try {
    const result = clearBasket(req.user?.id || 1)
    if (result.status !== 200) {
      return res.status(result.status).json({ message: result.message })
    }
    return res.json(result.payload)
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
}

const checkoutBasket = async (req, res) => {
  try {
    return res.status(501).json({
      message: 'Checkout flow will be implemented via MySQL services',
    })
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export {
  addToBasketHandler as addToBasket,
  checkoutBasket,
  clearBasketHandler as clearBasket,
  getBasketHandler as getBasket,
  removeFromBasketHandler as removeFromBasket,
}
