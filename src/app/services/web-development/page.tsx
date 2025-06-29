'use client'

import { Metadata } from 'next'
import Link from 'next/link'
import { 
  Globe, 
  ArrowRight, 
  CheckCircle, 
  Code, 
  Smartphone, 
  Search, 
  Shield,
  Zap,
  Users,
  TrendingUp,
  Clock,
  Award
} from 'lucide-react'
import BackToTop from '@/components/BackToTop'
import { useLanguage } from '@/app/providers'
import { useCurrency } from '@/app/providers'

export default function WebDevelopmentPage() {
  const { t } = useLanguage()
  const { currency, convertPrice } = useCurrency()

  const packages = [
    {
      id: 'basic',
      name: t('pages.web.packages.basic.name'),
      price: Math.round(convertPrice(15000)),
      popular: false,
      description: t('pages.web.packages.basic.description'),
      features: [
        t('pages.web.packages.basic.features.pages'),
        t('pages.web.packages.basic.features.responsive'),
        t('pages.web.packages.basic.features.seo'),
        t('pages.web.packages.basic.features.contact'),
        t('pages.web.packages.basic.features.analytics'),
        t('pages.web.packages.basic.features.ssl'),
        t('pages.web.packages.basic.features.domain'),
        t('pages.web.packages.basic.features.hosting')
      ],
      timeline: t('pages.web.packages.basic.timeline')
    },
    {
      id: 'standard',
      name: t('pages.web.packages.standard.name'),
      price: Math.round(convertPrice(25000)),
      popular: true,
      description: t('pages.web.packages.standard.description'),
      features: [
        t('pages.web.packages.standard.features.pages'),
        t('pages.web.packages.standard.features.cms'),
        t('pages.web.packages.standard.features.seo'),
        t('pages.web.packages.standard.features.blog'),
        t('pages.web.packages.standard.features.forms'),
        t('pages.web.packages.standard.features.social'),
        t('pages.web.packages.standard.features.backup'),
        t('pages.web.packages.standard.features.support')
      ],
      timeline: t('pages.web.packages.standard.timeline')
    },
    {
      id: 'premium',
      name: t('pages.web.packages.premium.name'),
      price: Math.round(convertPrice(45000)),
      popular: false,
      description: t('pages.web.packages.premium.description'),
      features: [
        t('pages.web.packages.premium.features.unlimited'),
        t('pages.web.packages.premium.features.ecommerce'),
        t('pages.web.packages.premium.features.crm'),
        t('pages.web.packages.premium.features.api'),
        t('pages.web.packages.premium.features.performance'),
        t('pages.web.packages.premium.features.security'),
        t('pages.web.packages.premium.features.training'),
        t('pages.web.packages.premium.features.support')
      ],
      timeline: t('pages.web.packages.premium.timeline')
    }
  ]

  const technologies = [
    { name: 'Next.js', icon: '⚡' },
    { name: 'React', icon: '⚛️' },
    { name: 'TypeScript', icon: '🔷' },
    { name: 'Tailwind CSS', icon: '🎨' },
    { name: 'Node.js', icon: '🟢' },
    { name: 'PostgreSQL', icon: '🗄️' },
    { name: 'Prisma', icon: '🔺' },
    { name: 'Vercel', icon: '🚀' }
  ]

  const processSteps = [
    {
      step: '01',
      title: t('pages.web.process.analysis.title'),
      description: t('pages.web.process.analysis.description'),
      icon: Users
    },
    {
      step: '02',
      title: t('pages.web.process.development.title'),
      description: t('pages.web.process.development.description'),
      icon: Code
    },
    {
      step: '03',
      title: t('pages.web.process.testing.title'),
      description: t('pages.web.process.testing.description'),
      icon: CheckCircle
    },
    {
      step: '04',
      title: t('pages.web.process.launch.title'),
      description: t('pages.web.process.launch.description'),
      icon: Globe
    }
  ]

  const features = [
    {
      icon: Smartphone,
      title: t('pages.web.features.responsive.title'),
      description: t('pages.web.features.responsive.description')
    },
    {
      icon: Search,
      title: t('pages.web.features.seo.title'),
      description: t('pages.web.features.seo.description')
    },
    {
      icon: Zap,
      title: t('pages.web.features.performance.title'),
      description: t('pages.web.features.performance.description')
    },
    {
      icon: Shield,
      title: t('pages.web.features.security.title'),
      description: t('pages.web.features.security.description')
    },
    {
      icon: TrendingUp,
      title: t('pages.web.features.analytics.title'),
      description: t('pages.web.features.analytics.description')
    },
    {
      icon: Award,
      title: t('pages.web.features.maintenance.title'),
      description: t('pages.web.features.maintenance.description')
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative py-32 lg:py-40 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-blue-800/10"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
              <Globe className="w-4 h-4 mr-2" />
              {t('pages.web.badge')}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              {t('pages.web.title')}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {t('pages.web.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/quoter" 
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {t('pages.web.cta.quote')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link 
                href="/contact" 
                className="inline-flex items-center px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300 font-semibold"
              >
                {t('pages.web.cta.portfolio')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t('pages.web.features.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('pages.web.features.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group bg-gradient-to-br from-gray-50 to-blue-50 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t('pages.web.packages.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('pages.web.packages.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {packages.map((pkg) => (
              <div key={pkg.id} className={`relative bg-white rounded-xl shadow-md p-4 ${pkg.popular ? 'ring-2 ring-blue-500 ring-offset-1' : ''} hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5`}>
                {pkg.popular && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-0.5 rounded-full text-xs font-semibold">
                      {t('pages.common.packages.popular')}
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{pkg.name}</h3>
                  <p className="text-gray-600 text-xs mb-2">{pkg.description}</p>
                  <div className="text-2xl font-bold text-blue-600 mb-0.5">
                    {currency} ${pkg.price.toLocaleString()}
                  </div>
                  <p className="text-gray-500 text-xs">{t('pages.common.packages.project')}</p>
                </div>
                
                <ul className="space-y-1 mb-4">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-3 h-3 text-blue-500 mt-0.5 mr-1.5 flex-shrink-0" />
                      <span className="text-gray-700 text-xs">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="border-t pt-3 mb-3">
                  <div className="flex items-center text-gray-600 text-xs">
                    <Clock className="w-3 h-3 mr-1.5" />
                    <span>{pkg.timeline}</span>
                  </div>
                </div>
                
                <Link 
                  href="/quoter" 
                  className={`block w-full text-center py-2 rounded-lg font-semibold transition-all duration-300 text-xs ${
                    pkg.popular 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg' 
                      : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
                  }`}
                >
                  {t('pages.common.packages.select')}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t('pages.common.process.title')}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <step.icon className="w-10 h-10 text-white" />
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-2">{step.step}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t('pages.web.technologies.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('pages.web.technologies.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {technologies.map((tech, index) => (
              <div key={index} className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-center group hover:-translate-y-1">
                <div className="text-2xl mb-2">{tech.icon}</div>
                <h4 className="font-medium text-sm text-gray-900 group-hover:text-blue-600 transition-colors">
                  {tech.name}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-8 sm:p-12 lg:p-16 text-white shadow-2xl">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                {t('pages.common.cta.ready')}
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                {t('pages.web.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/quoter" 
                  className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  {t('pages.common.cta.quote')}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link 
                  href="/contact" 
                  className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-300 font-semibold"
                >
                  {t('pages.common.cta.free')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BackToTop />
    </div>
  )
}


