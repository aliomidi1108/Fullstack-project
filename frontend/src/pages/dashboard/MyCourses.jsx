import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import courseImage from '../../assets/images/image 14 (1).png'
import { getMe } from '../../services/auth.service'
import { listCourses } from '../../services/course.service'

function MyCourses() {
  const [courses, setCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadCourses = async () => {
      setIsLoading(true)
      setError('')
      try {
        const user = await getMe()
        const userCourseIds = new Set((user?.courses || []).map((id) => String(id)))
        if (userCourseIds.size === 0) {
          setCourses([])
          return
        }
        const allCourses = await listCourses()
        const matched = Array.isArray(allCourses)
          ? allCourses.filter((course) => userCourseIds.has(String(course.id ?? course._id)))
          : []
        setCourses(matched)
      } catch (err) {
        setError(err?.response?.data?.message || 'دریافت دوره‌ها ناموفق بود.')
      } finally {
        setIsLoading(false)
      }
    }

    loadCourses()
  }, [])

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h2 className="text-section-title font-semibold text-text-primary mb-6 text-right">
        دوره‌های آموزشی
      </h2>
      {isLoading ? (
        <div className="flex items-center justify-center py-6">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <p className="text-body-md text-red-500 text-right">{error}</p>
      ) : courses.length === 0 ? (
        <p className="text-body-md text-text-secondary text-right">
          هنوز دوره‌ای برای شما ثبت نشده است.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => {
            const courseId = course.id ?? course._id
            return (
              <Link
                key={courseId}
                to={`/courses/${courseId}`}
                className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-[0_10px_24px_rgba(0,0,0,0.08)] transition-shadow"
              >
                <img
                  src={course?.video?.thumbnail || courseImage}
                  alt={course.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 text-right">
                  <h3 className="text-card-title font-semibold text-text-primary">
                    {course.title}
                  </h3>
                  <p className="text-body-md text-text-secondary mt-2">
                    {course.description || 'توضیحات این دوره ثبت نشده است.'}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MyCourses
