'use client'

import { useLanguage } from '@/app/providers'
import { useState, useEffect, useRef } from 'react'
import { 
  MessageCircle, 
  Lightbulb, 
  Code2, 
  TestTube, 
  Rocket, 
  HeadphonesIcon,
  ArrowRight 
} from 'lucide-react'
import Link from 'next/link'

export default function WorkProcess() {
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

  const steps = [
    {
      icon: MessageCircle,
      key: 'process.consultation',
      color: 'from-blue-500 to-blue-600',
      delay: '0ms'
    },
    {      icon: Lightbulb,
      key: 'process.planning',
      color: 'from-cyan-500 to-cyan-600',
      delay: '100ms'
    },
    {
      icon: Code2,
      key: 'process.development',
      color: 'from-teal-500 to-teal-600',
      delay: '200ms'
    },
    {
      icon: TestTube,
      key: 'process.testing',
      color: 'from-indigo-500 to-indigo-600',
      delay: '300ms'
    },
    {
      icon: Rocket,
      key: 'process.launch',
      color: 'from-blue-600 to-blue-700',
      delay: '400ms'
    },
    {
      icon: HeadphonesIcon,
      key: 'process.support',
      color: 'from-cyan-500 to-cyan-600',
      delay: '500ms'
    }
  ]

  return (    <section 
      ref={elementRef}
      className="py-16 lg:py-24 bg-white relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {t('process.title')}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('process.subtitle')}
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div
                key={step.key}
                className={`
                  group relative transform transition-all duration-700
                  ${isIntersecting ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}
                `}
                style={{ animationDelay: step.delay }}
              >
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-12 h-0.5 bg-gradient-to-r from-blue-200 to-transparent z-0"></div>
                )}

                <div className="relative bg-white rounded-2xl p-8 border border-gray-100 hover:border-gray-200 transition-all duration-500 group-hover:shadow-2xl hover:-translate-y-2 shadow-lg">
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-gray-900 font-bold text-lg shadow-lg">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className={`
                    inline-flex items-center justify-center w-16 h-16 rounded-xl 
                    bg-gradient-to-br ${step.color} text-white mb-6
                    group-hover:scale-110 transition-transform duration-300 shadow-lg
                  `}>
                    <Icon className="w-8 h-8" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                    {t(`${step.key}.title`)}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6 group-hover:text-gray-700 transition-colors duration-300">
                    {t(`${step.key}.description`)}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2">
                    {[1, 2, 3].map((item) => (
                      <li key={item} className="flex items-center text-sm text-gray-500">
                        <ArrowRight className="w-4 h-4 text-blue-400 mr-2 flex-shrink-0" />
                        {t(`${step.key}.feature${item}`)}
                      </li>
                    ))}
                  </ul>

                  {/* Hover Glow */}
                  <div className={`
                    absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 
                    group-hover:opacity-5 rounded-2xl transition-opacity duration-500
                  `}></div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-100 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t('process.guarantee.title')}
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {t('process.guarantee.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/quoter"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {t('process.cta.start')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link 
                href="/about"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-105"
              >
                {t('process.cta.learn')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

