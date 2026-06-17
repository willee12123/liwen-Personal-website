import { useRef, useState, useCallback, useEffect } from 'react'

const DEFAULT_AUDIO = import.meta.env.BASE_URL + '空灵轻风_no-watermark.mp3'

export function useBackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const isPlayingRef = useRef(false)
  const [isPlaying, setIsPlaying] = useState(true) // optimistic start

  useEffect(() => {
    const audio = new Audio(DEFAULT_AUDIO)
    audio.loop = true
    audio.volume = 0.3
    audio.preload = 'auto'
    audioRef.current = audio

    let mounted = true

    const attemptPlay = () => {
      if (!mounted) return
      audio.play().then(() => {
        if (mounted) {
          isPlayingRef.current = true
          setIsPlaying(true)
        }
      }).catch(() => {
        if (mounted) {
          isPlayingRef.current = false
          setIsPlaying(false)
        }
      })
    }

    // Try when enough data is buffered
    if (audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      attemptPlay()
    } else {
      audio.addEventListener('canplay', attemptPlay, { once: true })
      // Fallback timer in case canplay never fires
      const fallback = setTimeout(attemptPlay, 1500)
      audio.addEventListener('canplay', () => clearTimeout(fallback), { once: true })
    }

    // If autoplay blocked, retry on first user interaction
    const onInteraction = () => {
      if (audio.paused && mounted) {
        audio.play().then(() => {
          if (mounted) {
            isPlayingRef.current = true
            setIsPlaying(true)
          }
        }).catch(() => {})
      }
      document.removeEventListener('click', onInteraction)
      document.removeEventListener('touchstart', onInteraction)
      document.removeEventListener('keydown', onInteraction)
    }
    document.addEventListener('click', onInteraction)
    document.addEventListener('touchstart', onInteraction)
    document.addEventListener('keydown', onInteraction)

    return () => {
      mounted = false
      audio.pause()
      audio.src = ''
      document.removeEventListener('click', onInteraction)
      document.removeEventListener('touchstart', onInteraction)
      document.removeEventListener('keydown', onInteraction)
    }
  }, [])

  const toggle = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlayingRef.current) {
      audio.pause()
      isPlayingRef.current = false
      setIsPlaying(false)
    } else {
      audio.play().then(() => {
        isPlayingRef.current = true
        setIsPlaying(true)
      }).catch(() => {
        isPlayingRef.current = false
        setIsPlaying(false)
      })
    }
  }, [])

  return { isPlaying, toggle }
}