import { Op } from 'sequelize'
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

const toDomainRefreshToken = (record) => {
  if (!record) return null
  return {
    id: record.id,
    userId: record.user_id,
    token: record.token,
    expiresAt: record.expires_at,
    createdAt: record.created_at,
    user: toDomainUser(record.user),
  }
}

const createRefreshToken = async ({ userId, token, expiresAt }) => {
  const { RefreshToken } = initDbModels()
  const row = await RefreshToken.create({
    user_id: Number(userId),
    token: String(token),
    expires_at: expiresAt,
  })
  return toDomainRefreshToken(row.get({ plain: true }))
}

const findValidRefreshTokenByToken = async (token) => {
  const { RefreshToken, User } = initDbModels()
  const row = await RefreshToken.findOne({
    where: {
      token: String(token || ''),
      expires_at: { [Op.gt]: new Date() },
    },
    include: [{ model: User, as: 'user' }],
  })
  return toDomainRefreshToken(row ? row.get({ plain: true }) : null)
}

const extendRefreshTokenExpiryById = async (id, expiresAt) => {
  const { RefreshToken } = initDbModels()
  await RefreshToken.update(
    { expires_at: expiresAt },
    {
      where: { id: Number(id) },
    }
  )
}

const deleteRefreshTokenByToken = async (token) => {
  const { RefreshToken } = initDbModels()
  await RefreshToken.destroy({ where: { token: String(token || '') } })
}

export {
  createRefreshToken,
  deleteRefreshTokenByToken,
  extendRefreshTokenExpiryById,
  findValidRefreshTokenByToken,
}
