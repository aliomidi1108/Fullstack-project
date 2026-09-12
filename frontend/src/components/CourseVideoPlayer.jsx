import { useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'
import LoadingSpinner from './common/LoadingSpinner'
import { getCourseContent } from '../services/course.service'

const formatDuration = (seconds) => {
  if (!seconds || Number.isNaN(seconds)) return 'نامشخص'
  const total = Math.floor(seconds)
  const minutes = Math.floor(total / 60)
  const secs = total % 60
  return `${minutes}:${String(secs).padStart(2, '0')}`
}

function CourseVideoPlayer({ courseId, title, poster }) {
  const videoRef = useRef(null)
  const [content, setContent] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [playbackError, setPlaybackError] = useState('')

  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true)
      setError('')
      setPlaybackError('')
      try {
        const data = await getCourseContent(courseId)
        setContent(data)
      } catch (err) {
        const status = err?.response?.status
        if (status === 403) {
          setError('دسترسی شما به محتوا مجاز نیست یا منقضی شده است.')
        } else if (status === 401) {
          setError('برای مشاهده ویدیو وارد حساب شوید.')
        } else {
          setError(err?.response?.data?.message || 'دریافت محتوای دوره ناموفق بود.')
        }
      } finally {
        setIsLoading(false)
      }
    }

    if (courseId) {
      loadContent()
    }
  }, [courseId])

  useEffect(() => {
    const element = videoRef.current
    const video = content?.video
    if (!element || !video?.url) return

    let hls
    const handleError = () => {
      setPlaybackError('خطا در پخش ویدیو.')
    }

    const handleLoadedMetadata = () => {
      const key = `course_progress_${courseId}`
      const savedTime = Number(localStorage.getItem(key) || 0)
      if (savedTime > 0 && savedTime < element.duration) {
        element.currentTime = savedTime
      }
    }

    const handleTimeUpdate = () => {
      const key = `course_progress_${courseId}`
      localStorage.setItem(key, String(Math.floor(element.currentTime)))
    }

    element.addEventListener('loadedmetadata', handleLoadedMetadata)
    element.addEventListener('timeupdate', handleTimeUpdate)
    element.addEventListener('error', handleError)

    if (video.type === 'hls') {
      if (Hls.isSupported()) {
        hls = new Hls({ enableWorker: true, lowLatencyMode: true })
        hls.loadSource(video.url)
        hls.attachMedia(element)
        hls.on(Hls.Events.ERROR, handleError)
      } else if (element.canPlayType('application/vnd.apple.mpegurl')) {
        element.src = video.url
      } else {
        handleError()
      }
    } else {
      element.src = video.url
    }

    return () => {
      element.removeEventListener('loadedmetadata', handleLoadedMetadata)
      element.removeEventListener('timeupdate', handleTimeUpdate)
      element.removeEventListener('error', handleError)
      if (hls) hls.destroy()
    }
  }, [content, courseId])

  if (isLoading) {
    return (
      <div className="w-full h-64 sm:h-80 flex items-center justify-center bg-gray-100">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full h-64 sm:h-80 flex items-center justify-center bg-gray-100">
        <p className="text-body-md text-red-500">{error}</p>
      </div>
    )
  }

  if (!content?.video?.url) {
    return (
      <div className="w-full h-64 sm:h-80 flex items-center justify-center bg-gray-100">
        <img src={poster} alt={title} className="w-full h-64 sm:h-80 object-cover" />
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-body-md text-text-secondary">
        <span>{title}</span>
        <span>مدت: {formatDuration(content.video.duration)}</span>
      </div>
      <div onContextMenu={(event) => event.preventDefault()}>
        <video
          ref={videoRef}
          controls
          preload="metadata"
          poster={poster}
          controlsList="nodownload"
          className="w-full h-64 sm:h-80 object-cover bg-black"
        />
      </div>
      {playbackError ? <p className="text-body-md text-red-500">{playbackError}</p> : null}
    </div>
  )
}

export default CourseVideoPlayer
