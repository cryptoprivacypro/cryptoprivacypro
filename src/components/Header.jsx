'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`w-full fixed top-0 left-0 z-50 transition-all ${
        scrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-semibold tracking-wide">
          CryptoPrivacy Pro
        </Link>
        <nav className="space-x-4">
          {/* Rezervirano za buduće: login, lang switch, dashboard */}
          <Link href="/about" className="text-sm text-gray-600 hover:text-black">
            About
          </Link>
          <Link href="/contact" className="text-sm text-gray-600 hover:text-black">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  )
}

