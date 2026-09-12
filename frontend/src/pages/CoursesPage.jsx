import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Card from '../components/ui/Card'
import LoadingSpinner from '../components/common/LoadingSpinner'
import courseImage from '../assets/images/image 15.png'
import arrowLeftIcon from '../assets/icons/arrow-left-2.png'
import searchIcon from '../assets/icons/Vector.svg'
import { listCourses } from '../services/course.service'

function CoursesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const searchTerm = searchParams.get('q') || ''
  const [courses, setCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const handleSearchChange = (value) => {
    if (value) {
      setSearchParams({ q: value })
    } else {
      setSearchParams({})
    }
  }

  useEffect(() => {
    const loadCourses = async () => {
      setIsLoading(true)
      setError('')
      try {
        const data = await listCourses()
        setCourses(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err?.response?.data?.message || 'دریافت دوره‌ها ناموفق بود.')
      } finally {
        setIsLoading(false)
      }
    }

    loadCourses()
  }, [])

  const filteredCourses = useMemo(() => {
    const term = (searchTerm || '').trim().toLowerCase()
    if (!term) return courses
    return courses.filter((course) => {
      const title = (course.title || '').toLowerCase()
      const desc = (course.description || '').toLowerCase()
      return title.includes(term) || desc.includes(term)
    })
  }, [courses, searchTerm])

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-h1 font-bold text-primary">لیست دوره‌های مانی وی</h1>
        </div>

        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <img
              src={searchIcon}
              alt=""
              className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary"
            />
            <input
              type="text"
              placeholder="جستجو در دوره‌ها..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pr-12 pl-4 py-3 rounded-full border-2 border-gray-200 text-body-md text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <p className="text-body-md text-red-500 text-center">{error}</p>
        ) : filteredCourses.length === 0 ? (
          <p className="text-body-md text-text-secondary text-center">
            {searchTerm.trim() ? 'دوره‌ای با این جستجو یافت نشد.' : 'دوره‌ای یافت نشد.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredCourses.map((course) => {
              const courseId = course.id ?? course._id
              return (
                <Link key={courseId} to={`/courses/${courseId}`} className="block">
                  <Card className="rounded-2xl border border-gray-200 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
                    <div className="p-6 md:p-8 text-center sm:text-right">
                      <div className="flex justify-center sm:justify-end mb-6">
                        <img
                          src={course?.video?.thumbnail || courseImage}
                          alt={course.title}
                          className="w-20 h-20 rounded-2xl object-cover"
                        />
                      </div>

                      <h2 className="text-card-title font-semibold text-text-primary mb-2">
                        {course.title}
                      </h2>
                      <p className="text-body-md font-normal text-text-secondary mb-6">
                        {course.description || 'توضیحات این دوره به زودی اضافه می‌شود.'}
                      </p>

                      <span className="inline-flex items-center gap-3 text-primary font-medium">
                        <span className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center">
                          <img src={arrowLeftIcon} alt="" className="w-4 h-4" />
                        </span>
                        <span className="text-body-md font-normal">مشاهده دوره</span>
                      </span>
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default CoursesPage
