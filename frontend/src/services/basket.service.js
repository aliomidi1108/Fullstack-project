import api from './api'

const getBasket = async () => {
  const { data } = await api.get('/basket')
  return data
}

const addToBasket = async (courseId) => {
  const { data } = await api.post('/basket/add', { courseId })
  return data
}

const removeFromBasket = async (courseId) => {
  const { data } = await api.delete(`/basket/remove/${courseId}`)
  return data
}

const clearBasket = async () => {
  const { data } = await api.delete('/basket/clear')
  return data
}

export { getBasket, addToBasket, removeFromBasket, clearBasket }
