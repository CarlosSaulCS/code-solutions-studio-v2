'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useLanguage } from '@/app/providers'
import { ArrowRight, Code, Smartphone, Globe, Cloud, Brain, Settings } from 'lucide-react'
import Link from 'next/link'

export default function Hero() {
  const { t } = useLanguage()
  const [currentService, setCurrentService] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  const services = useMemo(() => [
    { icon: Code, key: 'web' },
    { icon: Smartphone, key: 'mobile' },
    { icon: Globe, key: 'ecommerce' },
    { icon: Cloud, key: 'cloud' },
    { icon: Brain, key: 'ai' },
    { icon: Settings, key: 'consulting' },
  ], [])

  // Optimized floating elements
  const floatingElements = useMemo(() => [
    { left: '10%', top: '15%', delay: '0s', duration: '6s', size: 'w-1 h-1' },
    { left: '85%', top: '25%', delay: '1s', duration: '8s', size: 'w-1.5 h-1.5' },
    { left: '20%', top: '65%', delay: '2s', duration: '7s', size: 'w-1 h-1' },
    { left: '75%', top: '75%', delay: '3s', duration: '5s', size: 'w-2 h-2' },
    { left: '45%', top: '10%', delay: '4s', duration: '9s', size: 'w-1 h-1' },
    { left: '65%', top: '55%', delay: '5s', duration: '6s', size: 'w-1.5 h-1.5' },
  ], [])

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setCurrentService((prev) => (prev + 1) % services.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [services.length])

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 overflow-hidden pt-24 pb-16"
    >
      {/* Optimized Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.15)_1px,_transparent_0)] bg-[length:40px_40px]"></div>
      </div>

      {/* Performance-optimized Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingElements.map((element, i) => (
          <div
            key={i}
            className={`absolute ${element.size} bg-white/10 rounded-full animate-float`}
            style={{
              left: element.left,
              top: element.top,
              animationDelay: element.delay,
              animationDuration: element.duration,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white relative z-10 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Animated Service Icon */}
          <div className={`mb-8 sm:mb-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full backdrop-blur-sm border border-white/20 transition-all duration-500 hover:scale-110">
              {services[currentService] && (() => {
                const IconComponent = services[currentService].icon
                return <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-white transition-all duration-500" />
              })()}
            </div>
          </div>

          {/* Main Heading - Fully responsive */}
          <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <span className="block">Code Solutions</span>
            <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Studio
            </span>
          </h1>

          <h2 className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-light mb-6 sm:mb-8 text-blue-100 max-w-4xl mx-auto transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {t('hero.title')}
          </h2>

          <p className={`text-base sm:text-lg md:text-xl text-blue-200 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {t('hero.subtitle')}
          </p>

          {/* CTA Buttons - Mobile optimized */}
          <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-12 sm:mb-16 transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Link 
              href="/quoter"
              className="group w-full sm:w-auto bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-3 touch-manipulation"
            >
              {t('hero.cta')}
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              href="/services"
              className="group w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/40 touch-manipulation"
            >
              {t('services.title')}
            </Link>
          </div>

          {/* Stats - Responsive grid */}
          <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {[
              { number: '200+', label: t('hero.stats.projects') || 'Proyectos' },
              { number: '150+', label: t('hero.stats.clients') || 'Clientes' },
              { number: '24/7', label: t('hero.stats.support') || 'Soporte' },
              { number: '5★', label: t('hero.stats.rating') || 'Calificación' },
            ].map((stat, index) => (
              <div key={index} className="text-center p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-cyan-400 mb-1 sm:mb-2">
                  {stat.number}
                </div>
                <div className="text-xs sm:text-sm text-blue-200">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Mobile friendly */}
      <Link 
        href="/services"
        className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 hover:text-white transition-all duration-300 hover:scale-110 p-2 touch-manipulation"
        aria-label="Go to services"
      >
        <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-current rounded-full flex justify-center animate-bounce hover:animate-none">
          <div className="w-0.5 h-2 sm:w-1 sm:h-3 bg-current rounded-full mt-1.5 sm:mt-2 animate-pulse"></div>
        </div>
      </Link>
    </section>
  )
}
