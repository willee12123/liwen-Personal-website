import { useState } from 'react'
import { Menu, X, Volume2, VolumeX } from 'lucide-react'

const NAV_ITEMS = ['Home', 'Experience', 'Projects', 'Skills', 'About Me']

interface NavbarProps {
  activeSection: string
  onNavigate: (section: string) => void
  isAudioPlaying: boolean
  onToggleAudio: () => void
}

export default function Navbar({
  activeSection,
  onNavigate,
  isAudioPlaying,
  onToggleAudio,
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleNav = (item: string) => {
    setMenuOpen(false)
    onNavigate(item)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-5 sm:px-10 md:px-14 py-4 sm:py-5">
      {/* Left: Wordmark */}
      <button onClick={() => handleNav('Home')} className="flex items-center">
        <span className="text-white text-2xl">Wen Li</span>
      </button>

      {/* Center pill – desktop only */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-2 py-2 items-center gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item
          return (
            <button
              key={item}
              onClick={() => handleNav(item)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                isActive
                  ? 'text-white'
                  : 'text-white/80 hover:bg-white/20 hover:text-white'
              }`}
            >
              {item}
            </button>
          )
        })}
      </div>

      {/* Right: Audio toggle + mobile hamburger */}
      <div className="flex items-center gap-2">
        {/* Audio toggle */}
        <button
          onClick={onToggleAudio}
          className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label={isAudioPlaying ? 'Mute background music' : 'Play background music'}
        >
          {isAudioPlaying ? <Volume2 size={22} /> : <VolumeX size={22} />}
        </button>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 mx-4 bg-black/90 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col gap-1 md:hidden">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item
            return (
              <button
                key={item}
                onClick={() => handleNav(item)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-white bg-white/15'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item}
              </button>
            )
          })}
        </div>
      )}
    </nav>
  )
}