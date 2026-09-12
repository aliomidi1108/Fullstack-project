import { depositToWallet, getWalletByUserId } from '../services/wallet.service.js'

const getWallet = async (req, res) => {
  try {
    const wallet = getWalletByUserId(req.user?.id || 1)
    return res.json(wallet || { balance: 0, transactions: [] })
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
}

const deposit = async (req, res) => {
  try {
    const { userId, amount, referenceId, description } = req.body || {}
    const result = depositToWallet({
      userId: userId || req.user?.id,
      amount,
      referenceId,
      description,
    })
    if (result.status !== 200) {
      return res.status(result.status).json({ message: result.message })
    }
    return res.json(result.payload)
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export { deposit, getWallet }
