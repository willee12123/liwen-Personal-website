import { useEffect, useState, useCallback } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Skills from './components/Skills'
import AboutMe from './components/AboutMe'
import { useBackgroundMusic } from './hooks/useBackgroundMusic'

const SECTION_IDS: Record<string, string> = {
  Home: 'home',
  Experience: 'experience',
  Projects: 'projects',
  Skills: 'skills',
  'About Me': 'about',
}

export default function App() {
  const [activeSection, setActiveSection] = useState('Home')
  const { isPlaying, toggle } = useBackgroundMusic()

  // IntersectionObserver to track which section is in view
  useEffect(() => {
    const sectionEls = Object.entries(SECTION_IDS).map(([name, id]) => {
      return { name, el: document.getElementById(id) }
    })

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const match = sectionEls.find((s) => s.el === entry.target)
            if (match) setActiveSection(match.name)
          }
        }
      },
      { threshold: 0.3, rootMargin: '-60px 0px 0px 0px' },
    )

    sectionEls.forEach(({ el }) => {
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const handleNavigate = useCallback((section: string) => {
    const id = SECTION_IDS[section]
    if (id) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  return (
    <div
      className="min-h-screen bg-black tracking-[-0.02em]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        isAudioPlaying={isPlaying}
        onToggleAudio={toggle}
      />
      <Hero />
      <Experience />
      <Projects />
      <Skills />
      <AboutMe />
    </div>
  )
}