import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { getCourseContent, getCourseVideos } from '../services/course.service'

function CourseContent() {
  const { courseId } = useParams()
  const [content, setContent] = useState(null)
  const [videos, setVideos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [accessDenied, setAccessDenied] = useState(false)

  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true)
      setError('')
      setAccessDenied(false)
      try {
        const [contentData, videosData] = await Promise.all([
          getCourseContent(courseId),
          getCourseVideos(courseId),
        ])
        setContent(contentData)
        setVideos(Array.isArray(videosData) ? videosData : [])
      } catch (err) {
        const status = err?.response?.status
        if (status === 403) {
          setAccessDenied(true)
          setError('دسترسی شما به محتوای این دوره مجاز نیست.')
        } else if (status === 401) {
          setAccessDenied(true)
          setError('برای مشاهده محتوا وارد حساب شوید.')
        } else {
          setError(err?.response?.data?.message || 'دریافت محتوا ناموفق بود.')
        }
      } finally {
        setIsLoading(false)
      }
    }

    if (courseId) {
      loadContent()
    }
  }, [courseId])

  const formatDuration = (seconds) => {
    if (typeof seconds !== 'number' || seconds < 0) return 'نامشخص'
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m} دقیقه${s > 0 ? ` و ${s} ثانیه` : ''}`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 text-right space-y-6">
          <h2 className="text-section-title font-semibold text-text-primary">محتوای دوره</h2>
          {accessDenied ? (
            <div className="space-y-3">
              <p className="text-body-md text-red-500">{error}</p>
              <Link
                to={`/courses/${courseId}`}
                className="inline-block px-6 py-2 rounded-2xl bg-primary text-white text-body-md font-semibold"
              >
                مشاهده و خرید دوره
              </Link>
            </div>
          ) : error ? (
            <p className="text-body-md text-red-500">{error}</p>
          ) : (
            <>
              {videos.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-body-lg font-semibold text-text-primary">ویدیوهای دوره</h3>
                  <div className="space-y-3">
                    {videos.map((video) => (
                      <div
                        key={video.id}
                        className="border border-gray-200 rounded-2xl p-4 flex items-center justify-between gap-4"
                      >
                        <div className="flex-1 text-right">
                          <h4 className="text-body-md font-semibold text-text-primary">
                            {video.title || 'بدون عنوان'}
                          </h4>
                          <p className="text-body-md text-text-secondary mt-1">
                            مدت: {formatDuration(video.duration)}
                          </p>
                        </div>
                        <a
                          href={video.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-2xl bg-primary text-white text-body-md font-semibold whitespace-nowrap"
                        >
                          پخش ویدیو
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
              {content?.video?.url ? (
                <div className="space-y-2">
                  <h3 className="text-body-lg font-semibold text-text-primary">پخش اصلی</h3>
                  {content.video.type === 'mp4' ? (
                    <video
                      controls
                      preload="metadata"
                      className="w-full h-64 sm:h-96 object-cover bg-black rounded-2xl"
                    >
                      <source src={content.video.url} type="video/mp4" />
                    </video>
                  ) : (
                    <div className="text-body-md text-text-secondary">
                      پخش HLS آماده است. لطفا با نسخه بعدی به‌روزرسانی کنید.
                    </div>
                  )}
                </div>
              ) : videos.length === 0 ? (
                <p className="text-body-md text-text-secondary">محتوایی برای نمایش وجود ندارد.</p>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default CourseContent
