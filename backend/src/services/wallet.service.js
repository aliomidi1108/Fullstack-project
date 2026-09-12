const wallets = new Map()

const getOrCreateWallet = (userId) => {
  const uid = Number(userId)
  if (!Number.isInteger(uid) || uid <= 0) return null
  if (!wallets.has(uid)) {
    wallets.set(uid, {
      id: uid,
      userId: uid,
      balance: 0,
      transactions: [],
    })
  }
  return wallets.get(uid)
}

const toPublicWallet = (wallet) => {
  if (!wallet) return null
  return {
    id: wallet.id,
    userId: wallet.userId,
    balance: wallet.balance,
    transactions: wallet.transactions.map((tx) => ({
      id: tx.id,
      type: tx.type,
      amount: tx.amount,
      referenceId: tx.referenceId,
      description: tx.description || tx.type,
      date: tx.date,
    })),
  }
}

const getWalletByUserId = (userId) => {
  const wallet = getOrCreateWallet(userId)
  return toPublicWallet(wallet)
}

const createTransaction = (wallet, payload) => {
  const nextId = wallet.transactions.length + 1
  wallet.transactions.unshift({
    id: nextId,
    type: payload.type,
    amount: Number(payload.amount || 0),
    referenceId: String(payload.referenceId || `tx-${nextId}`),
    description: payload.description || payload.type,
    date: new Date().toISOString(),
  })
}

const depositToWallet = ({ userId, amount, referenceId, description }) => {
  const wallet = getOrCreateWallet(userId)
  if (!wallet) return { status: 400, message: 'Invalid userId' }
  const value = Number(amount)
  if (!Number.isFinite(value) || value <= 0) {
    return { status: 400, message: 'Invalid amount' }
  }
  wallet.balance += value
  createTransaction(wallet, {
    type: 'deposit',
    amount: value,
    referenceId: referenceId || `deposit-${Date.now()}`,
    description: description || 'Manual deposit',
  })
  return { status: 200, payload: toPublicWallet(wallet) }
}

const purchaseFromWallet = ({ userId, amount, referenceId, description }) => {
  const wallet = getOrCreateWallet(userId)
  if (!wallet) return { status: 400, message: 'Invalid userId' }
  const value = Number(amount)
  if (!Number.isFinite(value) || value <= 0) {
    return { status: 400, message: 'Invalid amount' }
  }
  if (wallet.balance < value) {
    return { status: 400, message: 'Insufficient balance' }
  }
  wallet.balance -= value
  createTransaction(wallet, {
    type: 'purchase',
    amount: value,
    referenceId: referenceId || `purchase-${Date.now()}`,
    description: description || 'Course purchase',
  })
  return { status: 200, payload: toPublicWallet(wallet) }
}

export { depositToWallet, getWalletByUserId, purchaseFromWallet }
