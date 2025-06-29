'use client'

import { useCallback } from 'react'
import { ArrowUp } from 'lucide-react'

export default function BackToTop() {
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, [])

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-[9999] 
                 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 
                 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl 
                 transition-all duration-300 transform hover:scale-110 
                 backdrop-blur-sm border-2 border-white/20
                 ring-4 ring-blue-500/20 hover:ring-blue-500/40"
      aria-label="Volver arriba"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        minWidth: '56px',
        minHeight: '56px'
      }}
    >
      <ArrowUp className="w-6 h-6" />
    </button>
  )
}
