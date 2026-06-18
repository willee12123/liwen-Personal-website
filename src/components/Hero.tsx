import { useEffect, useRef, useState, useCallback } from 'react'
import RevealLayer from './RevealLayer'

const BG_IMAGE_1 = import.meta.env.BASE_URL + 'hero-background-3.webp'
const BG_IMAGE_2 = import.meta.env.BASE_URL + 'hero-background-1.webp'

export default function Hero() {
  const mouseRef = useRef({ x: -999, y: -999 })
  const smoothRef = useRef({ x: -999, y: -999 })
  const rafRef = useRef<number>(0)
  const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 })
  const [showContact, setShowContact] = useState(false)

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
    <section
      id="home"
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
      <div className="absolute top-[14%] left-0 right-0 flex flex-col items-center text-center px-5 z-50">
        <h1 className="text-white leading-[0.95] pointer-events-none">
          <span
            className="hero-anim hero-reveal block font-playfair italic font-normal text-5xl sm:text-7xl md:text-8xl"
            style={{ animationDelay: '0.25s', letterSpacing: '-0.05em' }}
          >
            Welcome to
          </span>
          <span
            className="hero-anim hero-reveal block font-playfair italic font-normal text-5xl sm:text-7xl md:text-8xl -mt-1"
            style={{ animationDelay: '0.42s', letterSpacing: '-0.05em' }}
          >
            My Space
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="hero-anim hero-fade text-sm sm:text-base md:text-lg text-white/70 leading-relaxed mt-5 max-w-xl pointer-events-none"
          style={{ animationDelay: '0.6s' }}
        >
          Building global B2B platforms across supply chain finance and enterprise
          ecosystems
        </p>
      </div>

      {/* 4. Bottom-right block (z-50) */}
      <div
        className="hero-anim hero-fade absolute bottom-10 sm:bottom-24 left-5 right-5 sm:left-auto sm:right-10 md:right-14 max-w-full sm:max-w-[320px] flex flex-col items-start gap-4 sm:gap-5 z-50"
        style={{ animationDelay: '0.85s' }}
      >
        <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
          Cross-border B2B platform product design
          <br />
          End-to-end supply chain finance systems
          <br />
          AI-driven workflow automation
        </p>

        <button
          onClick={() => setShowContact(true)}
          className="bg-[#e8702a] hover:bg-[#d2611f] text-white text-sm font-medium px-7 py-3 rounded-full transition-all hover:scale-[1.03] active:scale-95 hover:shadow-lg hover:shadow-[#e8702a]/30"
        >
          Contact Me
        </button>
      </div>
      {/* Contact modal */}
      {showContact && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-5"
          onClick={() => setShowContact(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Card */}
          <div
            className="relative bg-[#0C0C0C] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl max-w-sm w-full flex flex-col items-center text-center gap-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowContact(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Title */}
            <h3 className="font-playfair italic text-2xl sm:text-3xl text-white">
              Get in Touch
            </h3>

            {/* Contact info */}
            <div className="flex flex-col gap-4 w-full">
              <a
                href="mailto:willeetjucl@163.com"
                className="flex items-center gap-3 bg-white/[0.05] hover:bg-white/[0.10] border border-white/10 rounded-xl px-5 py-4 transition-colors group"
              >
                {/* Email icon */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#e8702a] shrink-0">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M22 4L12 13L2 4" />
                </svg>
                <div className="text-left">
                  <span className="text-white/40 text-[10px] uppercase tracking-wider">Email</span>
                  <p className="text-white text-sm group-hover:text-[#e8702a] transition-colors break-all">
                    willeetjucl@163.com
                  </p>
                </div>
              </a>

              <div className="flex items-center gap-3 bg-white/[0.05] border border-white/10 rounded-xl px-5 py-4">
                {/* Phone icon */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#e8702a] shrink-0">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.338 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                </svg>
                <div className="text-left">
                  <span className="text-white/40 text-[10px] uppercase tracking-wider">Phone</span>
                  <p className="text-white text-sm">+86 15801729570</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
