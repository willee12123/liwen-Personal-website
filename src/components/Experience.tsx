import { useState } from 'react'

const EXPERIENCES = [
  {
    year: '2023 — Present',
    title: 'IT Product Manager',
    company: 'Olea (SCB & Linklogis JV)',
    description:
      'Orchestrating end‑to‑end product capabilities for a global supply chain finance platform. From platform architecture and cross‑border integrations to AI‑powered workflow automation, I focus on turning complex business needs into scalable, high‑impact solutions that serve 70+ countries and billions in transaction volume.',
  },
  {
    year: '2021 — 2023',
    title: 'Product Manager',
    company: 'Mei Tuan',
    description:
      'Drove enterprise collaboration product strategy, leading the 2.0 launch of a company‑wide content platform. Raised feature adoption from 20% to 75% through user‑centric design, cross‑functional coordination, and data‑informed iteration — gaining hands‑on experience in scaling B2B products.',
  },
  {
    year: '2020 — 2021',
    title: 'Master',
    company: 'UCL',
    description:
      'Deepened analytical and technical skills in data-driven urban analysis, mastering Python, SQL, and GIS. Developed a quantitative mindset that later became the backbone of product decision-making in complex business environments.',
  },
  {
    year: '2015 — 2020',
    title: 'Undergraduate',
    company: 'Tongji University',
    description:
      'Built a strong foundation in spatial reasoning and systems thinking through urban planning studies. Engaged in national research projects and took on leadership roles as Youth League Deputy Secretary, balancing academic excellence with organizational responsibilities.',
  },
]

export default function Experience() {
  const [expanded, setExpanded] = useState(0)

  return (
    <section
      id="experience"
      className="relative bg-black overflow-hidden"
      style={{ height: '100dvh' }}
    >
      {/* Blurred background */}
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat blur-sm scale-110"
        style={{ backgroundImage: "url('/hero-background-1.png')" }}
      />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 h-full flex flex-col px-5 sm:px-10 md:px-14 py-24 sm:py-28">
        {/* Section heading */}
        <h2 className="font-playfair italic text-4xl sm:text-5xl text-white mb-10 text-center shrink-0">
          Experience
        </h2>

        {/* Cards container */}
        <div className="flex-1 flex gap-3 min-h-0 max-w-4xl mx-auto w-full">
          {EXPERIENCES.map((exp, i) => {
            const isExpanded = expanded === i

            return (
              <div
                key={i}
                onMouseEnter={() => setExpanded(i)}
                className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex ${
                  isExpanded ? 'flex-[5]' : 'flex-[0.6]'
                }`}
              >
                {/* Card background */}
                <div className="absolute inset-0 bg-white/[0.04] border border-white/10 rounded-2xl" />

                {/* Collapsed state: vertical title */}
                <div
                  className={`flex items-center justify-center transition-opacity duration-300 ${
                    isExpanded ? 'opacity-0 absolute' : 'opacity-100 w-full'
                  }`}
                >
                  <span
                    className="text-white/80 text-sm font-medium tracking-wider whitespace-nowrap"
                    style={{
                      writingMode: 'vertical-rl',
                      textOrientation: 'mixed',
                    }}
                  >
                    {exp.title}
                  </span>
                </div>

                {/* Expanded state: full content */}
                <div
                  className={`flex flex-col justify-center p-6 sm:p-8 transition-opacity duration-300 delay-100 ${
                    isExpanded ? 'opacity-100 w-full' : 'opacity-0 absolute'
                  }`}
                >
                  <span className="text-[#e8702a] text-sm font-medium tracking-wider">
                    {exp.year}
                  </span>
                  <h3 className="text-white text-xl sm:text-2xl font-semibold mt-2">
                    {exp.title}
                  </h3>
                  <p className="text-white/60 text-sm mt-1">{exp.company}</p>
                  <p className="text-white/50 text-sm mt-4 leading-relaxed max-w-md">
                    {exp.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-6 shrink-0">
          {EXPERIENCES.map((_, i) => (
            <button
              key={i}
              onClick={() => setExpanded(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                expanded === i ? 'bg-[#e8702a] w-6' : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}