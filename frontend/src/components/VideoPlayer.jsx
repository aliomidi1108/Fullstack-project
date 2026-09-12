import { useEffect, useRef } from 'react'
import Hls from 'hls.js'

function VideoPlayer({ video, poster, className = '' }) {
  const videoRef = useRef(null)

  useEffect(() => {
    const element = videoRef.current
    if (!element || !video?.url) return

    if (video.type === 'hls') {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        })
        hls.loadSource(video.url)
        hls.attachMedia(element)
        return () => {
          hls.destroy()
        }
      }

      if (element.canPlayType('application/vnd.apple.mpegurl')) {
        element.src = video.url
      }
      return undefined
    }

    element.src = video.url
    return undefined
  }, [video])

  return (
    <video
      ref={videoRef}
      controls
      preload="metadata"
      poster={poster}
      className={`w-full h-64 sm:h-80 object-cover bg-black ${className}`}
    />
  )
}

export default VideoPlayer
