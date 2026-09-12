import { initDbModels } from '../db/models/index.js'

const toDomainVideo = (record) => {
  if (!record) return null
  return {
    id: record.id,
    courseId: record.course_id,
    title: record.title,
    videoUrl: record.video_url,
    duration: record.duration,
    order: record.order,
    createdAt: record.created_at,
  }
}

const createCourseVideo = async ({ courseId, title, videoUrl, duration, order }) => {
  const { CourseVideo } = initDbModels()
  const row = await CourseVideo.create({
    course_id: Number(courseId),
    title: String(title || '').trim(),
    video_url: String(videoUrl || '').trim(),
    duration: Math.max(0, Number(duration) || 0),
    order: Math.max(0, Number(order) || 0),
  })
  return toDomainVideo(row.get({ plain: true }))
}

const findVideosByCourseId = async (courseId) => {
  const { CourseVideo } = initDbModels()
  const rows = await CourseVideo.findAll({
    where: { course_id: Number(courseId) },
    order: [
      ['order', 'ASC'],
      ['id', 'ASC'],
    ],
  })
  return rows.map((r) => toDomainVideo(r.get({ plain: true })))
}

export { createCourseVideo, findVideosByCourseId }
