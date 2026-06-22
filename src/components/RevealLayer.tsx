import { useEffect, useRef } from 'react'

const SPOTLIGHT_R = 260

interface RevealLayerProps {
  /** URL for the image that gets revealed by the spotlight. */
  image: string
  /** Current (already smoothed) X position of the cursor. */
  cursorX: number
  /** Current (already smoothed) Y position of the cursor. */
  cursorY: number
}

export default function RevealLayer({ image, cursorX, cursorY }: RevealLayerProps) {
  const revealRef = useRef<HTMLDivElement>(null)

  // Update mask-image directly via ref — CSS radial-gradient is GPU-accelerated
  // and avoids the expensive canvas.toDataURL() per frame that caused stuttering on
  // high-DPI displays (e.g. Mac Retina).
  useEffect(() => {
    const reveal = revealRef.current
    if (!reveal) return

    if (cursorX === -999 && cursorY === -999) {
      reveal.style.maskImage = 'none'
      reveal.style.webkitMaskImage = 'none'
      return
    }

    const mask = `radial-gradient(circle ${SPOTLIGHT_R}px at ${cursorX}px ${cursorY}px, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.75) 60%, rgba(0,0,0,0.4) 75%, rgba(0,0,0,0.12) 88%, rgba(0,0,0,0) 100%)`
    reveal.style.maskImage = mask
    reveal.style.webkitMaskImage = mask
  }, [cursorX, cursorY])

  return (
    <div
      ref={revealRef}
      className="absolute inset-0 bg-center bg-cover bg-no-repeat z-30 pointer-events-none"
      style={{
        backgroundImage: `url(${image})`,
        maskSize: '100% 100%',
        WebkitMaskSize: '100% 100%',
      }}
    />
  )
}