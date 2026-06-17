import { useRef, useState, useCallback, useEffect } from 'react'

const DEFAULT_AUDIO = import.meta.env.BASE_URL + '空灵轻风_no-watermark.mp3'

export function useBackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(true)

  useEffect(() => {
    const audio = new Audio(DEFAULT_AUDIO)
    audio.loop = true
    audio.volume = 0.3
    audioRef.current = audio

    // Auto-play on page load
    audio.play().then(() => {
      setIsPlaying(true)
    }).catch(() => {
      // Browser may block autoplay – user can manually toggle
      setIsPlaying(false)
    })

    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [])

  const toggle = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play().then(() => {
        setIsPlaying(true)
      }).catch(() => {
        setIsPlaying(false)
      })
    }
  }, [isPlaying])

  return { isPlaying, toggle }
}