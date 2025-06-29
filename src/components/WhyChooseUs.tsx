'use client'

import { useLanguage } from '@/app/providers'
import { useState, useEffect, useRef } from 'react'
import { 
  Shield, 
  Zap, 
  Award, 
  Users, 
  Clock, 
  Globe,
  CheckCircle,
  Star
} from 'lucide-react'

export default function WhyChooseUs() {
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
      { threshold: 0.1 }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const benefits = [
    {
      icon: Shield,
      key: 'benefits.security',
      color: 'from-blue-500 to-blue-600'
    },
    {      icon: Zap,
      key: 'benefits.performance',
      color: 'from-cyan-500 to-cyan-600'
    },
    {
      icon: Award,
      key: 'benefits.quality',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      icon: Users,
      key: 'benefits.team',
      color: 'from-teal-500 to-teal-600'
    },
    {
      icon: Clock,
      key: 'benefits.delivery',
      color: 'from-blue-600 to-blue-700'
    },
    {
      icon: Globe,
      key: 'benefits.global',
      color: 'from-slate-500 to-slate-600'
    }
  ]

  const companyStats = [
    { icon: Star, value: '4.9/5', label: 'benefits.rating' },
    { icon: Users, value: '150+', label: 'benefits.clients' },
    { icon: Award, value: '98%', label: 'benefits.success' },
    { icon: Clock, value: '24/7', label: 'benefits.support' }
  ]

  return (    <section 
      ref={elementRef}
      className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {t('benefits.title')}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('benefits.subtitle')}
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <div
                key={benefit.key}
                className={`
                  group transform transition-all duration-700
                  ${isIntersecting ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}
                `}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 group-hover:border-transparent h-full">
                  {/* Gradient Background */}
                  <div className={`
                    absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 
                    group-hover:opacity-5 rounded-2xl transition-opacity duration-500
                  `}></div>
                  
                  {/* Icon */}
                  <div className={`
                    inline-flex items-center justify-center w-16 h-16 rounded-xl 
                    bg-gradient-to-br ${benefit.color} text-white mb-6 relative z-10
                    group-hover:scale-110 transition-transform duration-300
                  `}>
                    <Icon className="w-8 h-8" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {t(`${benefit.key}.title`)}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {t(`${benefit.key}.description`)}
                    </p>

                    {/* Features List */}
                    <ul className="space-y-2">
                      {[1, 2, 3].map((item) => (
                        <li key={item} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                          {t(`${benefit.key}.feature${item}`)}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 rounded-2xl transform -skew-x-12 group-hover:animate-shine"></div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-slate-900 rounded-3xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {t('benefits.stats.title')}
            </h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              {t('benefits.stats.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {companyStats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.label}
                  className={`
                    text-center transform transition-all duration-700
                    ${isIntersecting ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}
                  `}
                  style={{ animationDelay: `${600 + index * 100}ms` }}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 text-white mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">
                    {stat.value}
                  </div>
                  <p className="text-gray-300 text-sm">
                    {t(stat.label)}
                  </p>
                </div>
              )
            })}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <button className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              {t('benefits.cta')}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

