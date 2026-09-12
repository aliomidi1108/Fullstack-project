import { requestPayment, verifyPayment } from '../services/zarinpal.service.js'
import { createPayment, findPaymentByAuthority, updatePaymentStatus } from '../repositories/payment.repository.js'
import { getCourseById, getCoursePrice, enrollUserInCourses } from '../services/course.service.js'

/**
 * POST /api/payments/zarinpal/request
 * Auth required. Body: { courseId }
 * DB-backed only (USE_DB=true).
 */
const requestZarinpalPayment = async (req, res) => {
  if (process.env.USE_DB !== 'true') {
    return res.status(503).json({ message: 'Payment requires database mode' })
  }

  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const courseId = Number(req.body?.courseId)
    if (!courseId || !Number.isInteger(courseId) || courseId <= 0) {
      return res.status(400).json({ message: 'Valid courseId is required' })
    }

    const course = getCourseById(courseId)
    if (!course) {
      return res.status(404).json({ message: 'Course not found' })
    }

    const amount = getCoursePrice(courseId)
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Course is free or invalid' })
    }

    const callbackUrl = process.env.ZARINPAL_CALLBACK_URL
    if (!callbackUrl) {
      return res.status(503).json({ message: 'Payment gateway not configured' })
    }

    const { authority, redirectUrl } = await requestPayment({
      amount,
      callbackUrl,
      description: `خرید دوره: ${course.title || 'Course'}`,
      metadata: { user_id: String(userId), course_id: String(courseId) },
    })

    await createPayment({
      authority,
      userId,
      courseId,
      amount,
    })

    return res.status(200).json({
      authority,
      redirectUrl,
      amount,
    })
  } catch (err) {
    return res.status(500).json({ message: 'Payment request failed' })
  }
}

/**
 * GET /api/payments/zarinpal/callback
 * Query: Authority, Status (OK|NOK)
 * DB-backed only (USE_DB=true).
 */
const handleZarinpalCallback = async (req, res) => {
  const failureRedirect = process.env.ZARINPAL_FAILURE_URL || '/payment/failed'

  if (process.env.USE_DB !== 'true') {
    return res.redirect(302, `${failureRedirect}?error=unavailable`)
  }

  const authority = req.query?.Authority || req.query?.authority
  const status = req.query?.Status || req.query?.status

  const successRedirect = process.env.ZARINPAL_SUCCESS_URL || '/payment/success'

  if (!authority) {
    return res.redirect(302, `${failureRedirect}?error=missing_authority`)
  }

  const payment = await findPaymentByAuthority(authority)
  if (!payment) {
    return res.redirect(302, `${failureRedirect}?error=payment_not_found`)
  }

  if (payment.status === 'paid') {
    return res.redirect(302, `${successRedirect}?refId=${payment.id}`)
  }

  if (status !== 'OK') {
    await updatePaymentStatus(payment.id, 'failed')
    return res.redirect(302, `${failureRedirect}?error=cancelled`)
  }

  try {
    await verifyPayment({ authority, amount: payment.amount })
  } catch (err) {
    await updatePaymentStatus(payment.id, 'failed')
    return res.redirect(302, `${failureRedirect}?error=verify_failed`)
  }

  await updatePaymentStatus(payment.id, 'paid')
  enrollUserInCourses({ userId: payment.userId, courseIds: [payment.courseId] })

  return res.redirect(302, `${successRedirect}?refId=${payment.id}`)
}

export { requestZarinpalPayment, handleZarinpalCallback }
