import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const NAV_ITEMS = ['Course', 'Field Guides', 'Geology', 'Plans', 'Live Tour']

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-5">
      {/* Left: Logo + Wordmark */}
      <div className="flex items-center gap-2.5">
        {/* Lithos diamond logo */}
        <svg
          width="26"
          height="26"
          viewBox="0 0 256 256"
          fill="#ffffff"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
        </svg>
        <span className="text-white text-2xl font-playfair italic">Lithos</span>
      </div>

      {/* Center pill – desktop only */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-2 py-2 items-center gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = item === 'Course'
          return (
            <button
              key={item}
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

      {/* Right: Sign Up – desktop only */}
      <button className="hidden md:block bg-white text-gray-900 text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-gray-100 transition-colors">
        Sign Up
      </button>

      {/* Mobile hamburger */}
      <button
        className="md:hidden text-white p-1"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 mx-4 bg-black/90 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col gap-1 md:hidden">
          {NAV_ITEMS.map((item) => {
            const isActive = item === 'Course'
            return (
              <button
                key={item}
                onClick={() => setMenuOpen(false)}
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
          <hr className="border-white/15 my-1" />
          <button
            onClick={() => setMenuOpen(false)}
            className="w-full bg-white text-gray-900 text-sm font-semibold px-4 py-2.5 rounded-full hover:bg-gray-100 transition-colors text-center"
          >
            Sign Up
          </button>
        </div>
      )}
    </nav>
  )
}
