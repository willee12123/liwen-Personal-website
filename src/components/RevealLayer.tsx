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
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const revealRef = useRef<HTMLDivElement>(null)

  // Size canvas to window on mount + resize
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  // Draw spotlight gradient every time cursor moves
  useEffect(() => {
    const canvas = canvasRef.current
    const reveal = revealRef.current
    if (!canvas || !reveal) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Skip if cursor is off-screen
    if (cursorX === -999 && cursorY === -999) {
      reveal.style.maskImage = 'none'
      reveal.style.webkitMaskImage = 'none'
      return
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const gradient = ctx.createRadialGradient(
      cursorX,
      cursorY,
      0,
      cursorX,
      cursorY,
      SPOTLIGHT_R,
    )
    gradient.addColorStop(0, 'rgba(255,255,255,1)')
    gradient.addColorStop(0.4, 'rgba(255,255,255,1)')
    gradient.addColorStop(0.6, 'rgba(255,255,255,0.75)')
    gradient.addColorStop(0.75, 'rgba(255,255,255,0.4)')
    gradient.addColorStop(0.88, 'rgba(255,255,255,0.12)')
    gradient.addColorStop(1, 'rgba(255,255,255,0)')

    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(cursorX, cursorY, SPOTLIGHT_R, 0, Math.PI * 2)
    ctx.fill()

    const dataUrl = canvas.toDataURL()
    reveal.style.maskImage = `url(${dataUrl})`
    reveal.style.webkitMaskImage = `url(${dataUrl})`
  }, [cursorX, cursorY])

  return (
    <>
      {/* Hidden canvas used to generate the mask */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ display: 'none' }}
      />

      {/* Reveal layer – only visible where the mask allows */}
      <div
        ref={revealRef}
        className="absolute inset-0 bg-center bg-cover bg-no-repeat z-30 pointer-events-none"
        style={{
          backgroundImage: `url(${image})`,
          maskSize: '100% 100%',
          WebkitMaskSize: '100% 100%',
        }}
      />
    </>
  )
}
