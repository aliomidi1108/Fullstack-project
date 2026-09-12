import { initDbModels } from '../db/models/index.js'

const toDomainOtpCode = (record) => {
  if (!record) return null
  return {
    id: record.id,
    phone: record.phone,
    code: record.code,
    expiresAt: record.expires_at,
    attempts: Number(record.attempts || 0),
    createdAt: record.created_at,
  }
}

const createOtpCode = async ({ phone, code, expiresAt }) => {
  const { OtpCode } = initDbModels()
  const row = await OtpCode.create({
    phone: String(phone || '').trim(),
    code: String(code || ''),
    expires_at: expiresAt,
    attempts: 0,
  })
  return toDomainOtpCode(row.get({ plain: true }))
}

const findOtpCodeByPhone = async (phone) => {
  const { OtpCode } = initDbModels()
  const row = await OtpCode.findOne({
    where: { phone: String(phone || '').trim() },
  })
  return toDomainOtpCode(row ? row.get({ plain: true }) : null)
}

const incrementOtpAttemptsById = async (id) => {
  const { OtpCode } = initDbModels()
  await OtpCode.increment('attempts', {
    by: 1,
    where: { id: Number(id) },
  })

  const row = await OtpCode.findByPk(Number(id))
  return toDomainOtpCode(row ? row.get({ plain: true }) : null)
}

const deleteOtpCodeById = async (id) => {
  const { OtpCode } = initDbModels()
  await OtpCode.destroy({ where: { id: Number(id) } })
}

const deleteOtpCodeByPhone = async (phone) => {
  const { OtpCode } = initDbModels()
  await OtpCode.destroy({ where: { phone: String(phone || '').trim() } })
}

export {
  createOtpCode,
  deleteOtpCodeById,
  deleteOtpCodeByPhone,
  findOtpCodeByPhone,
  incrementOtpAttemptsById,
}
