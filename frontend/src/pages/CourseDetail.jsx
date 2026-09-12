import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import videoImage from '../assets/images/video.png'
import instructorAvatar from '../assets/images/image 15.png'
import userIcon from '../assets/icons/user.png'
import infoIcon from '../assets/icons/info-circle.png'
import checkIcon from '../assets/icons/check.png'
import LoadingSpinner from '../components/common/LoadingSpinner'
import CourseVideoPlayer from '../components/CourseVideoPlayer'
import { useAuth } from '../context/AuthContext'
import { addToBasket } from '../services/basket.service'
import { requestZarinpalPayment } from '../services/payment.service'
import {
  addCourseComment,
  deleteCourseComment,
  getCourseById,
  getCourseComments,
  updateCourseComment,
} from '../services/course.service'

function CourseDetail() {
  const COMMENT_COOLDOWN_MS = 15000
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const [openIndex, setOpenIndex] = useState(0)
  const [course, setCourse] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [isBuying, setIsBuying] = useState(false)
  const [comments, setComments] = useState([])
  const [isCommentsLoading, setIsCommentsLoading] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [commentError, setCommentError] = useState('')
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false)
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editText, setEditText] = useState('')
  const [isCommentUpdating, setIsCommentUpdating] = useState(false)
  const [isCommentDeleting, setIsCommentDeleting] = useState(false)
  const [lastCommentAt, setLastCommentAt] = useState(0)
  const [commentCharLimit] = useState(1000)

  useEffect(() => {
    const loadCourse = async () => {
      setIsLoading(true)
      setIsCommentsLoading(true)
      setError('')
      try {
        const [courseData, commentData] = await Promise.all([
          getCourseById(courseId),
          getCourseComments(courseId),
        ])
        setCourse(courseData)
        setComments(Array.isArray(commentData) ? commentData : [])
      } catch (err) {
        setError(err?.response?.data?.message || 'دریافت اطلاعات دوره ناموفق بود.')
      } finally {
        setIsCommentsLoading(false)
        setIsLoading(false)
      }
    }

    loadCourse()
  }, [courseId])


  const details = useMemo(() => {
    if (!course) {
      return {
        title: '',
        description: '',
        price: null,
        sessions: [],
        reviews: [],
        video: { url: videoImage },
        stats: {
          sessionsCount: '۰ جلسه',
          duration: 'نامشخص',
          level: 'نامشخص',
          students: '۰ نفر',
        },
        instructor: null,
      }
    }

    const studentsCount = Array.isArray(course.students) ? course.students.length : 0
    return {
      title: course.title,
      description: course.description || 'توضیحات این دوره به زودی اضافه می‌شود.',
      price: course.price,
      sessions: course.sessions || [],
      reviews: course.reviews || [],
      video: { url: course?.video?.url || videoImage },
      stats: {
        sessionsCount: `${course.sessions?.length || 0} جلسه`,
        duration: course?.video?.duration ? `${course.video.duration} دقیقه` : 'نامشخص',
        level: course?.level || 'نامشخص',
        students: `${studentsCount} نفر`,
      },
      instructor: course.instructor || null,
    }
  }, [course])

  const isEnrolled = useMemo(() => {
    if (!user || !courseId) return false
    const userId = user.id ?? user._id
    const enrolledByUser = Array.isArray(user.courses)
      ? user.courses.some((id) => String(id) === String(courseId))
      : false
    const enrolledByCourse = Array.isArray(course?.students)
      ? course.students.some((id) => String(id) === String(userId))
      : false
    return enrolledByUser || enrolledByCourse
  }, [user, courseId, course])

  const formatRelativeDate = (dateValue) => {
    if (!dateValue) return ''
    const date = new Date(dateValue)
    const diffMs = date.getTime() - Date.now()
    const diffSeconds = Math.round(diffMs / 1000)
    const rtf = new Intl.RelativeTimeFormat('fa-IR', { numeric: 'auto' })
    const ranges = [
      { unit: 'year', seconds: 60 * 60 * 24 * 365 },
      { unit: 'month', seconds: 60 * 60 * 24 * 30 },
      { unit: 'day', seconds: 60 * 60 * 24 },
      { unit: 'hour', seconds: 60 * 60 },
      { unit: 'minute', seconds: 60 },
    ]
    for (const range of ranges) {
      if (Math.abs(diffSeconds) >= range.seconds) {
        return rtf.format(Math.round(diffSeconds / range.seconds), range.unit)
      }
    }
    return rtf.format(diffSeconds, 'second')
  }

  const handleAddToBasket = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    const targetCourseId = course?.id ?? course?._id
    if (!targetCourseId) return
    setActionError('')
    setIsAdding(true)
    try {
      await addToBasket(targetCourseId)
      navigate('/dashboard/basket')
    } catch (err) {
      setActionError(err?.response?.data?.message || 'افزودن به سبد خرید ناموفق بود.')
    } finally {
      setIsAdding(false)
    }
  }

  const handleBuyCourse = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    const targetCourseId = course?.id ?? course?._id
    const price = typeof course?.price === 'number' ? course.price : 0
    if (!targetCourseId) return
    if (price <= 0) {
      setActionError('این دوره رایگان است.')
      return
    }
    setActionError('')
    setIsBuying(true)
    try {
      const { redirectUrl } = await requestZarinpalPayment(targetCourseId)
      if (redirectUrl) {
        window.location.href = redirectUrl
      } else {
        setActionError('دریافت لینک پرداخت ناموفق بود.')
      }
    } catch (err) {
      if (err?.response?.status === 401) {
        navigate('/login')
        return
      }
      setActionError(err?.response?.data?.message || 'شروع پرداخت ناموفق بود.')
    } finally {
      setIsBuying(false)
    }
  }

  const handleSubmitComment = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    const text = commentText.trim()
    if (!text) {
      setCommentError('متن نظر را وارد کنید.')
      return
    }
    if (text.length > commentCharLimit) {
      setCommentError('متن نظر بیش از حد طولانی است.')
      return
    }
    if (Date.now() - lastCommentAt < COMMENT_COOLDOWN_MS) {
      setCommentError('برای ارسال نظر بعدی کمی صبر کنید.')
      return
    }
    setIsCommentSubmitting(true)
    setCommentError('')
    try {
      await addCourseComment(courseId, text)
      setCommentText('')
      setLastCommentAt(Date.now())
      const commentData = await getCourseComments(courseId)
      setComments(Array.isArray(commentData) ? commentData : [])
    } catch (err) {
      if (err?.response?.status === 401) {
        navigate('/login')
        return
      }
      setCommentError(err?.response?.data?.message || 'ارسال نظر ناموفق بود.')
    } finally {
      setIsCommentSubmitting(false)
    }
  }

  const startEditComment = (comment) => {
    setEditingCommentId(comment.id ?? comment._id)
    setEditText(comment.content || comment.text || '')
    setCommentError('')
  }

  const cancelEditComment = () => {
    setEditingCommentId(null)
    setEditText('')
  }

  const handleUpdateComment = async (commentId) => {
    const text = editText.trim()
    if (!text) {
      setCommentError('متن نظر را وارد کنید.')
      return
    }
    setIsCommentUpdating(true)
    setCommentError('')
    try {
      const updated = await updateCourseComment(courseId, commentId, text)
      setComments((prev) =>
        prev.map((item) => ((item.id ?? item._id) === commentId ? updated : item))
      )
      cancelEditComment()
    } catch (err) {
      setCommentError(err?.response?.data?.message || 'ویرایش نظر ناموفق بود.')
    } finally {
      setIsCommentUpdating(false)
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('آیا از حذف این نظر مطمئن هستید؟')) return
    setIsCommentDeleting(true)
    setCommentError('')
    const previous = comments
    setComments((prev) => prev.filter((item) => (item.id ?? item._id) !== commentId))
    try {
      await deleteCourseComment(courseId, commentId)
      if (editingCommentId === commentId) {
        cancelEditComment()
      }
    } catch (err) {
      setComments(previous)
      setCommentError(err?.response?.data?.message || 'حذف نظر ناموفق بود.')
    } finally {
      setIsCommentDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 flex items-center justify-center">
        <p className="text-body-md text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          <div className="space-y-8">
            <div className="bg-white rounded-3xl shadow-[0_10px_24px_rgba(0,0,0,0.06)] overflow-hidden">
              <CourseVideoPlayer courseId={courseId} title={details.title} poster={details.video.url} />
              <div className="p-6 text-right space-y-4">
                <h1 className="text-h1 font-bold text-text-primary">
                  {details.title}
                </h1>
                <p className="text-body-lg font-normal text-text-secondary leading-relaxed">
                  {details.description}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-[0_10px_24px_rgba(0,0,0,0.06)] p-6">
              <h2 className="text-section-title font-semibold text-text-primary mb-4 text-right">
                جلسات دوره
              </h2>
              <div className="space-y-3">
                {details.sessions.length === 0 ? (
                  <p className="text-body-md text-text-secondary text-right">
                    اطلاعات جلسات هنوز ثبت نشده است.
                  </p>
                ) : (
                  details.sessions.map((session, index) => (
                    <div
                      key={session.id || session._id || `${index}`}
                      className="border border-gray-200 rounded-2xl overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenIndex(index === openIndex ? -1 : index)}
                        className="w-full flex items-center justify-between px-5 py-4 text-right"
                      >
                        <span className="text-body-md font-semibold text-text-primary">
                          {session.title || 'جلسه بدون عنوان'}
                        </span>
                        <span className="text-body-md font-normal text-text-secondary">
                          {session.duration || 'مدت نامشخص'}
                        </span>
                      </button>
                      {openIndex === index && (
                        <div className="px-5 pb-4 text-right text-body-md font-normal text-text-secondary">
                          {session.description || 'توضیحات این جلسه در دسترس نیست.'}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-[0_10px_24px_rgba(0,0,0,0.06)] p-6">
              <h2 className="text-section-title font-semibold text-text-primary mb-4 text-right">
                نظرات دوره
              </h2>
              <div className="space-y-4 max-h-[28rem] overflow-y-auto">
                {isAuthenticated ? (
                  <div className="mb-6 space-y-3 text-right">
                    {Date.now() - lastCommentAt < COMMENT_COOLDOWN_MS ? (
                      <p className="text-body-md text-text-secondary text-right">
                        برای ارسال نظر بعدی کمی صبر کنید.
                      </p>
                    ) : null}
                    <div className="flex items-center gap-3">
                      <img
                        src={user?.avatar || userIcon}
                        alt={user?.name || 'کاربر'}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <textarea
                          rows={3}
                          value={commentText}
                          onChange={(event) => setCommentText(event.target.value)}
                          placeholder="نظر خود را بنویسید..."
                          maxLength={commentCharLimit}
                          disabled={isCommentSubmitting}
                          className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-body-md text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary disabled:bg-gray-50"
                        />
                        <p className="mt-2 text-body-md text-text-secondary text-left">
                          {commentText.length}/{commentCharLimit}
                        </p>
                      </div>
                    </div>
                    {commentError ? (
                      <p className="text-body-md text-red-500">{commentError}</p>
                    ) : null}
                    <button
                      type="button"
                      onClick={handleSubmitComment}
                      disabled={
                        isCommentSubmitting ||
                        Date.now() - lastCommentAt < COMMENT_COOLDOWN_MS
                      }
                      className="px-6 py-2 rounded-2xl bg-primary text-white text-body-md font-semibold disabled:opacity-70"
                    >
                      {isCommentSubmitting ? 'در حال ارسال...' : 'ارسال نظر'}
                    </button>
                  </div>
                ) : null}

                {isCommentsLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <LoadingSpinner size="sm" />
                  </div>
                ) : comments.length === 0 ? (
                  <p className="text-body-md text-text-secondary text-right">
                    هنوز نظری ثبت نشده است.
                  </p>
                ) : (
                  comments.map((review, index) => {
                    const reviewId = review.id ?? review._id
                    const currentUserId = user?.id ?? user?._id
                    const reviewUserId = review?.user?.id ?? review?.user?._id
                    const isOwner =
                      currentUserId && reviewUserId && String(currentUserId) === String(reviewUserId)
                    const isAdmin = user?.role === 'admin'
                    const isEditing = editingCommentId === reviewId
                    return (
                    <div
                      key={review.id || review._id || `${index}`}
                      className="border border-gray-200 rounded-2xl p-4 text-right"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <img
                          src={review?.user?.avatar || userIcon}
                          alt={review?.user?.name || 'کاربر ناشناس'}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="text-body-lg font-semibold text-text-primary">
                            {review?.user?.phone || 'کاربر ناشناس'}
                          </h3>
                          <p className="text-body-md text-text-secondary">
                            {formatRelativeDate(review?.createdAt)}
                          </p>
                        </div>
                      </div>
                      {isEditing ? (
                        <div className="space-y-3">
                          <textarea
                            rows={3}
                            value={editText}
                            onChange={(event) => setEditText(event.target.value)}
                            className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-body-md text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary"
                          />
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => handleUpdateComment(reviewId)}
                              disabled={isCommentUpdating}
                              className="px-4 py-2 rounded-2xl bg-primary text-white text-body-md font-semibold disabled:opacity-70"
                            >
                              {isCommentUpdating ? 'در حال ذخیره...' : 'ذخیره'}
                            </button>
                            <button
                              type="button"
                              onClick={cancelEditComment}
                              className="px-4 py-2 rounded-2xl border border-gray-200 text-body-md text-text-secondary"
                            >
                              انصراف
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-body-md font-normal text-text-secondary leading-relaxed">
                          {review.content || review.text || 'متن نظر ثبت نشده است.'}
                        </p>
                      )}
                      {(isOwner || isAdmin) && !isEditing ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {isOwner ? (
                            <button
                              type="button"
                              onClick={() => startEditComment(review)}
                              className="px-4 py-2 rounded-2xl border border-gray-200 text-body-md text-text-secondary"
                            >
                              ویرایش
                            </button>
                          ) : null}
                          <button
                            type="button"
                            onClick={() => handleDeleteComment(reviewId)}
                            disabled={isCommentDeleting}
                            className="px-4 py-2 rounded-2xl border border-red-200 text-body-md text-red-500 disabled:opacity-70"
                          >
                            {isCommentDeleting ? 'در حال حذف...' : 'حذف'}
                          </button>
                        </div>
                      ) : null}
                    </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6 lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-3xl shadow-[0_10px_24px_rgba(0,0,0,0.06)] p-6 text-right space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-body-md font-normal text-text-secondary">قیمت دوره</span>
                <span className="text-body-lg font-semibold text-text-primary">
                  {typeof details.price === 'number'
                    ? details.price.toLocaleString('fa-IR')
                    : details.price || 'نامشخص'}{' '}
                  تومان
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-body-md font-normal text-text-secondary">
                <div className="flex items-center gap-2">
                  <img src={infoIcon} alt="" className="w-4 h-4" />
                  {details.stats.sessionsCount}
                </div>
                <div className="flex items-center gap-2">
                  <img src={infoIcon} alt="" className="w-4 h-4" />
                  {details.stats.duration}
                </div>
                <div className="flex items-center gap-2">
                  <img src={checkIcon} alt="" className="w-4 h-4" />
                  {details.stats.level}
                </div>
                <div className="flex items-center gap-2">
                  <img src={checkIcon} alt="" className="w-4 h-4" />
                  {details.stats.students}
                </div>
              </div>
              {details.price > 0 && !isEnrolled ? (
                <button
                  type="button"
                  onClick={handleBuyCourse}
                  disabled={isBuying}
                  className="w-full rounded-2xl bg-primary py-4 text-button font-semibold text-white disabled:opacity-70"
                >
                  {isBuying ? 'در حال انتقال...' : 'خرید دوره'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={isEnrolled ? () => navigate(`/courses/${courseId}/content`) : handleAddToBasket}
                  disabled={isAdding}
                  className="w-full rounded-2xl bg-primary py-4 text-button font-semibold text-white disabled:opacity-70"
                >
                  {isAdding ? 'در حال افزودن...' : isEnrolled ? 'مشاهده محتوا' : 'برای یادگیری وارد شوید'}
                </button>
              )}
              {actionError ? (
                <p className="text-body-md text-red-500">{actionError}</p>
              ) : null}
            </div>

            <div className="bg-white rounded-3xl shadow-[0_10px_24px_rgba(0,0,0,0.06)] p-6 text-right">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={details.instructor?.avatar || instructorAvatar}
                  alt={details.instructor?.name || 'مدرس دوره'}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-body-lg font-semibold text-text-primary">
                    مدرس دوره
                  </h3>
                  <p className="text-body-md font-normal text-text-secondary">
                    {details.instructor?.name || 'نامشخص'}
                  </p>
                </div>
              </div>
              <p className="text-body-md font-normal text-text-secondary leading-relaxed">
                {details.instructor?.bio || 'اطلاعات مدرس ثبت نشده است.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden">
        {details.price > 0 && !isEnrolled ? (
          <button
            type="button"
            onClick={handleBuyCourse}
            disabled={isBuying}
            className="w-full rounded-2xl bg-primary py-4 text-button font-semibold text-white"
          >
            {isBuying ? 'در حال انتقال...' : 'خرید دوره'}
          </button>
        ) : (
          <button
            type="button"
            onClick={isEnrolled ? () => navigate(`/courses/${courseId}/content`) : handleAddToBasket}
            disabled={isAdding}
            className="w-full rounded-2xl bg-primary py-4 text-button font-semibold text-white"
          >
            {isAdding ? 'در حال افزودن...' : isEnrolled ? 'مشاهده محتوا' : 'برای یادگیری وارد شوید'}
          </button>
        )}
      </div>
    </div>
  )
}

export default CourseDetail
