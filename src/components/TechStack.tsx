'use client'

import { useLanguage } from '@/app/providers'
import { useState, useEffect, useRef } from 'react'
import { 
  Code2, 
  Smartphone, 
  Database, 
  Cloud, 
  Shield, 
  Zap
} from 'lucide-react'
import Link from 'next/link'

export default function TechStack() {
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

  const techCategories = [
    {
      icon: Code2,
      key: 'tech.frontend',
      color: 'from-blue-500 to-blue-600',
      technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Vue.js', 'Angular']
    },
    {
      icon: Database,      key: 'tech.backend',
      color: 'from-teal-500 to-teal-600',
      technologies: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'Redis', 'GraphQL']
    },
    {
      icon: Smartphone,
      key: 'tech.mobile',
      color: 'from-indigo-500 to-indigo-600',
      technologies: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Expo', 'Ionic']
    },
    {
      icon: Cloud,
      key: 'tech.cloud',
      color: 'from-cyan-500 to-cyan-600',
      technologies: ['AWS', 'Google Cloud', 'Azure', 'Vercel', 'Docker', 'Kubernetes']
    },
    {
      icon: Shield,
      key: 'tech.security',
      color: 'from-blue-600 to-blue-700',
      technologies: ['Auth0', 'JWT', 'OAuth', 'SSL/TLS', 'HTTPS', 'Encryption']
    },
    {
      icon: Zap,
      key: 'tech.tools',
      color: 'from-slate-500 to-slate-600',
      technologies: ['Git', 'GitHub', 'VS Code', 'Figma', 'Postman', 'Jest']
    }
  ]

  return (    <section 
      ref={elementRef}
      className="py-16 lg:py-24 bg-white relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {t('tech.title')}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('tech.subtitle')}
          </p>
        </div>

        {/* Tech Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {techCategories.map((category, index) => {
            const Icon = category.icon
            return (
              <div
                key={category.key}
                className={`
                  group transform transition-all duration-700
                  ${isIntersecting ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}
                `}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 group-hover:border-transparent h-full">
                  {/* Gradient Background */}
                  <div className={`
                    absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 
                    group-hover:opacity-5 rounded-2xl transition-opacity duration-500
                  `}></div>
                  
                  {/* Icon */}
                  <div className={`
                    inline-flex items-center justify-center w-16 h-16 rounded-xl 
                    bg-gradient-to-br ${category.color} text-white mb-6 relative z-10
                    group-hover:scale-110 transition-transform duration-300
                  `}>
                    <Icon className="w-8 h-8" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {t(`${category.key}.title`)}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {t(`${category.key}.description`)}
                    </p>

                    {/* Technologies Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      {category.technologies.map((tech, techIndex) => (
                        <div
                          key={tech}
                          className={`
                            px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-700 text-center
                            hover:bg-gradient-to-r hover:${category.color} hover:text-white
                            transition-all duration-300 font-medium
                            transform hover:scale-105
                          `}
                          style={{ animationDelay: `${index * 100 + techIndex * 50}ms` }}
                        >
                          {tech}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 rounded-2xl transform -skew-x-12 group-hover:animate-shine"></div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-slate-900 rounded-3xl p-8 lg:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {t('tech.cta.title')}
            </h3>
            <p className="text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
              {t('tech.cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {t('tech.cta.consult')}
              </Link>
              <Link 
                href="/about"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
              >
                {t('tech.cta.portfolio')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

