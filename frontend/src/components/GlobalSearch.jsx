import { useEffect, useMemo, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { listCourses } from '../services/course.service'

const SITE_SECTIONS = [
  { label: 'خانه', path: '/', keywords: ['خانه', 'صفحه اصلی', 'main', 'home'] },
  { label: 'دوره های آموزشی', path: '/courses', keywords: ['دوره', 'دوره‌ها', 'آموزش', 'courses'] },
  { label: 'درباره ما', path: '/about', keywords: ['درباره', 'ما', 'about'] },
  { label: 'مقالات', path: '/blog', keywords: ['مقاله', 'مقالات', 'blog'] },
  { label: 'تماس با ما', path: '/contact', keywords: ['تماس', 'contact'] },
]

function GlobalSearch({ value, onChange, placeholder, className, inputClassName, searchIcon, variant, onSelect }) {
  const [courses, setCourses] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoadingCourses, setIsLoadingCourses] = useState(false)
  const containerRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const loadCourses = async () => {
      setIsLoadingCourses(true)
      try {
        const data = await listCourses()
        setCourses(Array.isArray(data) ? data : [])
      } catch {
        setCourses([])
      } finally {
        setIsLoadingCourses(false)
      }
    }
    loadCourses()
  }, [])

  const term = (value || '').trim().toLowerCase()

  const results = useMemo(() => {
    if (!term) return { sections: [], courses: [] }

    const matchedSections = SITE_SECTIONS.filter((s) => {
      const labelLower = (s.label || '').toLowerCase()
      const matchesLabel = labelLower.includes(term) || term.includes(labelLower)
      const matchesKeyword = (s.keywords || []).some(
        (k) => (k || '').toLowerCase().includes(term) || term.includes((k || '').toLowerCase())
      )
      return matchesLabel || matchesKeyword
    })

    const matchedCourses = courses.filter(
      (c) =>
        (c.title || '').toLowerCase().includes(term) ||
        (c.description || '').toLowerCase().includes(term)
    )

    return { sections: matchedSections, courses: matchedCourses }
  }, [term, courses])

  const hasResults = results.sections.length > 0 || results.courses.length > 0

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const handleSelect = (item) => {
    if (item.path) {
      navigate(item.path)
      onChange('')
      setIsOpen(false)
      onSelect?.()
    } else if (item.courseId) {
      navigate(`/courses/${item.courseId}`)
      onChange('')
      setIsOpen(false)
      onSelect?.()
    }
  }

  const handleSubmit = (e) => {
    e?.preventDefault?.()
    if (!term) return
    setIsOpen(true)
    if (results.sections.length > 0) {
      handleSelect(results.sections[0])
    } else if (results.courses.length > 0) {
      handleSelect({ courseId: results.courses[0].id ?? results.courses[0]._id })
    } else {
      navigate(`/courses?q=${encodeURIComponent(value.trim())}`)
      onChange('')
      onSelect?.()
    }
  }

  return (
    <div ref={containerRef} className={`relative ${className || ''}`}>
      <form onSubmit={handleSubmit} className="relative w-full h-full flex items-center">
        {searchIcon && (
          <img
            src={searchIcon}
            alt=""
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary pointer-events-none flex-shrink-0"
          />
        )}
        <input
          type="text"
          placeholder={placeholder ?? ''}
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          className={`flex-1 min-w-0 bg-transparent ${inputClassName || ''} ${searchIcon ? 'pr-10' : ''}`}
        />
      </form>

      {isOpen && (
        <div className="search-dropdown absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-200 shadow-xl z-[100] max-h-80 overflow-y-auto">
          {!term ? (
            <div className="p-2">
              <p className="px-2 py-1 text-body-sm text-text-secondary">پیشنهادات</p>
              {SITE_SECTIONS.map((s) => (
                <button
                  key={s.path}
                  type="button"
                  onClick={() => handleSelect(s)}
                  className="w-full px-4 py-2.5 text-right text-body-md text-text-primary hover:bg-primary/5 rounded-xl transition-colors"
                >
                  {s.label}
                </button>
              ))}
            </div>
          ) : isLoadingCourses && !hasResults ? (
            <div className="p-4 text-body-md text-text-secondary text-center">
              در حال جستجو...
            </div>
          ) : !hasResults ? (
            <button
              type="button"
              onClick={() => {
                navigate(`/courses?q=${encodeURIComponent(value.trim())}`)
                onChange('')
                setIsOpen(false)
                onSelect?.()
              }}
              className="w-full px-4 py-3 text-right text-body-md text-primary hover:bg-primary/5 rounded-b-2xl transition-colors"
            >
              جستجو در دوره‌ها: «{value.trim()}»
            </button>
          ) : (
            <>
              {results.sections.length > 0 && (
                <div className="p-2 border-b border-gray-100">
                  <p className="px-2 py-1 text-body-sm text-text-secondary">صفحات</p>
                  {results.sections.map((s) => (
                    <button
                      key={s.path}
                      type="button"
                      onClick={() => handleSelect(s)}
                      className="w-full px-4 py-2.5 text-right text-body-md text-text-primary hover:bg-primary/5 rounded-xl transition-colors"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
              {results.courses.length > 0 && (
                <div className="p-2">
                  <p className="px-2 py-1 text-body-sm text-text-secondary">دوره‌ها</p>
                  {results.courses.slice(0, 5).map((c) => {
                    const id = c.id ?? c._id
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => handleSelect({ courseId: id })}
                        className="w-full px-4 py-2.5 text-right text-body-md text-text-primary hover:bg-primary/5 rounded-xl transition-colors"
                      >
                        {c.title || 'بدون عنوان'}
                      </button>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default GlobalSearch
