import {
  createOrderFromBasket,
  handlePaymentCallback,
  initiateOrderPayment,
  verifyPayment,
} from '../services/mockPayment.service.js'

const createOrderFromBasketHandler = async (req, res) => {
  try {
    const result = createOrderFromBasket(req.user?.id || 1)
    if (result.status !== 201) {
      return res.status(result.status).json({ message: result.message })
    }
    return res.status(201).json(result.payload)
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
}

const initiateOrderPaymentHandler = async (req, res) => {
  try {
    const result = initiateOrderPayment({
      userId: req.user?.id || 1,
      orderId: req.params?.orderId,
    })
    if (result.status !== 200) {
      return res.status(result.status).json({ message: result.message })
    }
    return res.json(result.payload)
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
}

const handlePaymentCallbackHandler = async (req, res) => {
  try {
    const result = handlePaymentCallback({
      provider: req.params?.provider,
      query: req.query,
    })
    return res.status(result.status).json(result.payload)
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
}

const verifyPaymentById = async (req, res) => {
  try {
    const result = verifyPayment({
      userId: req.user?.id || 1,
      paymentId: req.params?.paymentId,
    })
    if (result.status !== 200) {
      return res.status(result.status).json({ message: result.message })
    }
    return res.json(result.payload)
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export {
  createOrderFromBasketHandler as createOrderFromBasket,
  handlePaymentCallbackHandler as handlePaymentCallback,
  initiateOrderPaymentHandler as initiateOrderPayment,
  verifyPaymentById,
}
