import api from './api'

const getWallet = async () => {
  const { data } = await api.get('/wallet')
  return data
}

const deposit = async ({ amount, description }) => {
  const { data } = await api.post('/wallet/deposit', { amount, description })
  return data
}

const withdraw = async ({ amount, description }) => {
  const { data } = await api.post('/wallet/withdraw', { amount, description })
  return data
}

export { getWallet, deposit, withdraw }
