import { useState, useEffect, useRef } from 'react'

export default function AboutMe() {
  const bgImage = import.meta.env.BASE_URL + 'bg-5.webp'
  const videoSrc = import.meta.env.BASE_URL + '7473396393260519424.mp4'
  const sectionRef = useRef<HTMLElement>(null)
  const [shouldLoad, setShouldLoad] = useState(false)

  /* ---- Lazy load video when section is near viewport ---- */
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      { rootMargin: '400px' } // Start loading 400px before scrolling into view
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative h-[100dvh] flex flex-col items-center pt-16 sm:pt-20 md:pt-24 px-5 sm:px-10 md:px-16 lg:px-24 overflow-hidden"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Title */}
      <h2 className="relative z-10 font-playfair italic text-4xl sm:text-5xl text-white text-center shrink-0">
        About Me
      </h2>

      {/* Blocks — centered in remaining space */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex-1 flex items-center">
        <div className="w-full flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-10">
          {/* Left: Video — lazy loaded */}
          <div className="flex-1 aspect-[4/3] md:aspect-auto md:h-[44vh] lg:h-[48vh] rounded-3xl border border-white/10 overflow-hidden shadow-2xl bg-black/30">
            {shouldLoad && (
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              >
                <source src={videoSrc} type="video/mp4" />
              </video>
            )}
          </div>

          {/* Right: Self-intro text */}
          <div className="flex-1 md:h-[44vh] lg:h-[48vh] rounded-3xl border border-white/10 bg-black/50 backdrop-blur-sm flex items-center justify-center p-8 sm:p-10 lg:p-14 shadow-2xl">
            <div className="text-white text-sm sm:text-base leading-relaxed text-center md:text-left flex flex-col gap-4">
              <p>
                I'm a product professional who builds scalable B2B platforms – from AI‑powered workflows and system integrations to cross‑border financing solutions. I turn complex business needs into reusable capabilities, drive data‑informed decisions, and coordinate multicultural teams across time zones.
              </p>
              <p>
                Outside work, travel fuels my curiosity, fitness keeps me grounded, and my four cats remind me to find joy in small moments. I'm always eager to try new things – whether a sport, a gadget, or a side project.
              </p>
              <p>
                That restless curiosity drives my product philosophy: never settle, always ask "what if," and deliver value with empathy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}