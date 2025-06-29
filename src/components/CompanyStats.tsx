'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { useLanguage } from '@/app/providers'
import { Users, Code, Trophy, Clock, Star, Zap } from 'lucide-react'
import Link from 'next/link'

export default function CompanyStats() {
  const { t } = useLanguage()
  const [isIntersecting, setIsIntersecting] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true)
        }
      },
      { threshold: 0.2 }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const stats = useMemo(() => [
    {
      icon: Users,
      number: 150,
      suffix: '+',
      key: 'stats.clients',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Code,
      number: 300,
      suffix: '+',
      key: 'stats.projects',
      color: 'from-teal-500 to-teal-600'
    },
    {
      icon: Trophy,
      number: 98,
      suffix: '%',
      key: 'stats.satisfaction',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      icon: Clock,
      number: 5,
      suffix: '+',
      key: 'stats.experience',
      color: 'from-slate-500 to-slate-600'
    },
    {
      icon: Star,
      number: 24,
      suffix: '/7',
      key: 'stats.support',
      color: 'from-cyan-500 to-cyan-600'
    },
    {
      icon: Zap,
      number: 99,
      suffix: '%',
      key: 'stats.delivery',
      color: 'from-blue-600 to-blue-700'
    }
  ], [])

  // Counter animation
  const [counts, setCounts] = useState(stats.map(() => 0))

  useEffect(() => {
    if (isIntersecting) {
      stats.forEach((stat, index) => {
        const increment = stat.number / 50
        let current = 0
        const timer = setInterval(() => {
          current += increment
          if (current >= stat.number) {
            current = stat.number
            clearInterval(timer)
          }
          setCounts(prev => {
            const newCounts = [...prev]
            newCounts[index] = Math.floor(current)
            return newCounts
          })
        }, 40)
      })
    }
  }, [isIntersecting, stats])

  return (    <section 
      ref={elementRef}
      className="py-16 lg:py-24 bg-white relative overflow-hidden"
    >
      <div className="container mx-auto px-4 relative z-10">
        {/* Stats Card with Blue Background */}
        <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900 rounded-3xl p-8 lg:p-12 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          
          {/* Header */}
          <div className="text-center mb-12 relative z-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              {t('stats.title')}
            </h2>
            <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              {t('stats.subtitle')}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 mb-8 relative z-10">
            {stats.slice(0, 4).map((stat, index) => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.key}
                  className="text-center group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`
                    ${isIntersecting ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}
                    transition-all duration-500
                  `}>
                    {/* Icon */}
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4 group-hover:bg-white/30 transition-colors duration-300">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    {/* Number */}
                    <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                      {counts[index]}{stat.suffix}
                    </div>
                    
                    {/* Label */}
                    <div className="text-blue-100 font-medium">
                      {t(stat.key)}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* CTA Button */}
          <div className="text-center relative z-10">
            <Link 
              href="/contact"
              className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              {t('stats.cta.contact')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

