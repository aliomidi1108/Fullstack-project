import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import cameraImage from '../../assets/images/image 14.png'
import placeholderImage from '../../assets/icons/image-5.png'
import walletIcon from '../../assets/icons/wallet.png'
import playIcon from '../../assets/icons/play.png'
import chartIcon from '../../assets/icons/arrow-up-2.png'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { getMe } from '../../services/auth.service'
import { listCourses } from '../../services/course.service'
import { getWallet } from '../../services/wallet.service'

function Home() {
  const [wallet, setWallet] = useState(null)
  const [courses, setCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      setError('')
      try {
        const [user, walletData, allCourses] = await Promise.all([
          getMe(),
          getWallet(),
          listCourses(),
        ])
        const userCourseIds = new Set((user?.courses || []).map((id) => String(id)))
        const recent = Array.isArray(allCourses)
          ? allCourses.filter((course) => userCourseIds.has(String(course.id ?? course._id)))
          : []
        setCourses(recent.slice(0, 2))
        setWallet(walletData)
      } catch (err) {
        setError(err?.response?.data?.message || 'دریافت اطلاعات ناموفق بود.')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const balance = wallet?.balance || 0
  const totalCourses = useMemo(() => courses.length, [courses])

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-right">
        <div className="flex items-center gap-4">
          <img src={walletIcon} alt="" className="w-6 h-6" />
          <div>
            <p className="text-body-lg font-semibold text-text-primary">کیف پول</p>
            <p className="text-body-md text-text-secondary">
              {typeof balance === 'number' ? balance.toLocaleString('fa-IR') : balance} ریال
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <img src={playIcon} alt="" className="w-6 h-6" />
          <div>
            <p className="text-body-lg font-semibold text-text-primary">دوره‌های من</p>
            <p className="text-body-md text-text-secondary">
              {totalCourses.toLocaleString('fa-IR')} دوره خریداری شده
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <img src={chartIcon} alt="" className="w-6 h-6" />
          <div>
            <p className="text-body-lg font-semibold text-text-primary">درصد پیشرفت</p>
            <p className="text-body-md text-text-secondary">نامشخص</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-section-title font-semibold text-text-primary">
            اخیرا مشاهده شده
          </h2>
          <span className="w-10 h-10 rounded-full border border-primary text-primary flex items-center justify-center">
            ←
          </span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <p className="text-body-md text-red-500 text-right">{error}</p>
        ) : courses.length === 0 ? (
          <p className="text-body-md text-text-secondary text-right">
            دوره‌ای برای نمایش وجود ندارد.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((course, index) => {
              const courseId = course.id ?? course._id
              return (
                <Link
                  key={courseId}
                  to={`/courses/${courseId}`}
                  className="block border border-gray-200 rounded-2xl overflow-hidden"
                >
                  <img
                    src={course?.video?.thumbnail || (index % 2 ? placeholderImage : cameraImage)}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4 text-right">
                    <p className="text-body-lg font-semibold text-text-primary">
                      {course.title}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
