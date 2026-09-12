import { initDbModels } from '../db/models/index.js'

const toDomainUser = (record) => {
  if (!record) return null
  return {
    id: record.id,
    phone: record.phone,
    role: record.role || 'user',
    name: '',
    email: '',
    avatar: '',
    courses: [],
  }
}

const findUserById = async (id) => {
  const { User } = initDbModels()
  const row = await User.findByPk(Number(id))
  return toDomainUser(row ? row.get({ plain: true }) : null)
}

const findUserByPhone = async (phone) => {
  const { User } = initDbModels()
  const row = await User.findOne({ where: { phone: String(phone || '').trim() } })
  return toDomainUser(row ? row.get({ plain: true }) : null)
}

const findOrCreateUserByPhone = async (phone, role = 'user') => {
  const { User } = initDbModels()
  const normalizedPhone = String(phone || '').trim()
  if (!normalizedPhone) return null
  const [row] = await User.findOrCreate({
    where: { phone: normalizedPhone },
    defaults: { phone: normalizedPhone, role },
  })
  return toDomainUser(row.get({ plain: true }))
}

export { findUserById, findUserByPhone, findOrCreateUserByPhone }
