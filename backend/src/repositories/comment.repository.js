import { initDbModels } from '../db/models/index.js'

const createComment = async ({ userId, courseId, content }) => {
  const { Comment } = initDbModels()
  const row = await Comment.create({
    user_id: Number(userId),
    course_id: Number(courseId),
    content: String(content || '').trim(),
  })
  return row.get({ plain: true })
}

const findCommentsByCourseId = async (courseId) => {
  const { Comment, User } = initDbModels()
  const rows = await Comment.findAll({
    where: { course_id: Number(courseId) },
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'phone'],
      },
    ],
    order: [['created_at', 'ASC']],
  })
  return rows.map((row) => row.get({ plain: true }))
}

const findCommentByIdWithUser = async (id) => {
  const { Comment, User } = initDbModels()
  const row = await Comment.findByPk(Number(id), {
    include: [{ model: User, as: 'user', attributes: ['id', 'phone'] }],
  })
  return row ? row.get({ plain: true }) : null
}

const findCommentByIdAndCourseId = async (commentId, courseId) => {
  const { Comment } = initDbModels()
  const row = await Comment.findOne({
    where: {
      id: Number(commentId),
      course_id: Number(courseId),
    },
  })
  return row ? row.get({ plain: true }) : null
}

const updateComment = async (id, content) => {
  const { Comment } = initDbModels()
  const row = await Comment.findByPk(Number(id))
  if (!row) return null
  row.content = String(content || '').trim()
  await row.save()
  return row.get({ plain: true })
}

const deleteComment = async (id) => {
  const { Comment } = initDbModels()
  const row = await Comment.findByPk(Number(id))
  if (!row) return false
  await row.destroy()
  return true
}

const getCommentsByCourse = findCommentsByCourseId

export {
  createComment,
  getCommentsByCourse,
  findCommentByIdWithUser,
  findCommentByIdAndCourseId,
  updateComment,
  deleteComment,
}
