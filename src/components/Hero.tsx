import { useEffect, useRef, useState, useCallback } from 'react'
import Navbar from './Navbar'
import RevealLayer from './RevealLayer'

const BG_IMAGE_1 = '/hero-background-3.png'
const BG_IMAGE_2 = '/hero-background-1.png'

export default function Hero() {
  const mouseRef = useRef({ x: -999, y: -999 })
  const smoothRef = useRef({ x: -999, y: -999 })
  const rafRef = useRef<number>(0)
  const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 })

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current.x = e.clientX
    mouseRef.current.y = e.clientY
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  useEffect(() => {
    const animate = () => {
      const m = mouseRef.current
      const s = smoothRef.current
      s.x += (m.x - s.x) * 0.1
      s.y += (m.y - s.y) * 0.1
      setCursorPos({ x: s.x, y: s.y })
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <div className="min-h-screen bg-white tracking-[-0.02em]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      <section
        className="relative w-full overflow-hidden h-screen bg-black"
        style={{ height: '100dvh' }}
      >
        {/* 1. Base image (z-10) – slow Ken Burns zoom-out */}
        <div
          className="hero-zoom absolute inset-0 bg-center bg-cover bg-no-repeat z-10"
          style={{ backgroundImage: `url(${BG_IMAGE_1})` }}
        />

        {/* 2. Reveal layer (z-30) – cursor-following spotlight */}
        <RevealLayer
          image={BG_IMAGE_2}
          cursorX={cursorPos.x}
          cursorY={cursorPos.y}
        />

        {/* 3. Heading (z-50) */}
        <div className="absolute top-[14%] left-0 right-0 flex flex-col items-center text-center px-5 pointer-events-none z-50">
          <h1 className="text-white leading-[0.95]">
            <span
              className="hero-anim hero-reveal block font-playfair italic font-normal text-5xl sm:text-7xl md:text-8xl"
              style={{ animationDelay: '0.25s', letterSpacing: '-0.05em' }}
            >
              Layers hold
            </span>
            <span
              className="hero-anim hero-reveal block font-normal text-5xl sm:text-7xl md:text-8xl -mt-1"
              style={{ animationDelay: '0.42s', letterSpacing: '-0.08em' }}
            >
              tales of time
            </span>
          </h1>
        </div>

        {/* 4. Bottom-left paragraph (z-50) */}
        <div
          className="hero-anim hero-fade hidden sm:block absolute bottom-14 left-10 md:left-14 max-w-[260px] z-50"
          style={{ animationDelay: '0.7s' }}
        >
          <p className="text-sm text-white/80 leading-relaxed">
            Every layer of sediment records a chapter of our planet, from ancient
            seabeds to drifting ash, layered across millions of years beneath us.
          </p>
        </div>

        {/* 5. Bottom-right block (z-50) */}
        <div
          className="hero-anim hero-fade absolute bottom-10 sm:bottom-24 left-5 right-5 sm:left-auto sm:right-10 md:right-14 max-w-full sm:max-w-[260px] flex flex-col items-start gap-4 sm:gap-5 z-50"
          style={{ animationDelay: '0.85s' }}
        >
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            Our interactive maps let you peel back the crust to trace how stones,
            fossils, and deep time combine to shape the ground beneath your feet.
          </p>

          <button className="bg-[#e8702a] hover:bg-[#d2611f] text-white text-sm font-medium px-7 py-3 rounded-full transition-all hover:scale-[1.03] active:scale-95 hover:shadow-lg hover:shadow-[#e8702a]/30">
            Start Digging
          </button>
        </div>
      </section>
    </div>
  )
}
