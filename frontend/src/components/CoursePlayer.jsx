import { useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'

const formatDuration = (seconds) => {
  if (!seconds || Number.isNaN(seconds)) return 'نامشخص'
  const total = Math.floor(seconds)
  const minutes = Math.floor(total / 60)
  const secs = total % 60
  return `${minutes}:${String(secs).padStart(2, '0')}`
}

function CoursePlayer({ courseId, title, duration, video, poster, onError }) {
  const videoRef = useRef(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const element = videoRef.current
    if (!element || !video?.url) return

    let hls
    const handleError = () => {
      setError('پخش ویدیو با خطا مواجه شد.')
      onError?.()
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
  }, [courseId, video, onError])

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-body-md text-text-secondary">
        <span>{title}</span>
        <span>مدت: {formatDuration(duration)}</span>
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
      {error ? <p className="text-body-md text-red-500 text-right">{error}</p> : null}
    </div>
  )
}

export default CoursePlayer
