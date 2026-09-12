import { initDbModels } from '../db/models/index.js'

const toDomainPayment = (record) => {
  if (!record) return null
  return {
    id: record.id,
    authority: record.authority,
    userId: record.user_id,
    courseId: record.course_id,
    amount: record.amount,
    status: record.status,
    createdAt: record.created_at,
  }
}

const createPayment = async ({ authority, userId, courseId, amount }) => {
  const { Payment } = initDbModels()
  const row = await Payment.create({
    authority: String(authority || '').trim(),
    user_id: Number(userId),
    course_id: Number(courseId),
    amount: Number(amount),
    status: 'pending',
  })
  return toDomainPayment(row.get({ plain: true }))
}

const findPaymentByAuthority = async (authority) => {
  const { Payment } = initDbModels()
  const row = await Payment.findOne({
    where: { authority: String(authority || '').trim() },
  })
  return toDomainPayment(row ? row.get({ plain: true }) : null)
}

const updatePaymentStatus = async (id, status) => {
  const { Payment } = initDbModels()
  const row = await Payment.findByPk(Number(id))
  if (!row) return null
  row.status = String(status)
  await row.save()
  return toDomainPayment(row.get({ plain: true }))
}

export { createPayment, findPaymentByAuthority, updatePaymentStatus }
