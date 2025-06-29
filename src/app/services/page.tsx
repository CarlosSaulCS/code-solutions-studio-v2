'use client'

import { Metadata } from 'next'
import Link from 'next/link'
import { 
  Globe, 
  Smartphone, 
  ShoppingCart, 
  Cloud, 
  Brain, 
  Settings,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react'
import BackToTop from '@/components/BackToTop'
import { useLanguage } from '@/app/providers'
import { useCurrency } from '@/app/providers'

export default function ServicesPage() {
  const { t } = useLanguage()
  const { currency, convertPrice } = useCurrency()

  const services = [
    {
      id: 'web-development',
      icon: Globe,
      title: t('services.web.title'),
      description: t('services.web.description'),
      features: [
        t('features.web.responsive'),
        t('features.web.seo'),
        t('features.web.cms'),
        t('features.web.ssl')
      ],
      price: Math.round(convertPrice(25000)),
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'mobile-apps',
      icon: Smartphone,
      title: t('services.mobile.title'),
      description: t('services.mobile.description'),
      features: [
        t('features.mobile.platforms'),
        t('features.mobile.ui'),
        t('features.mobile.api'),
        t('features.mobile.deploy')
      ],
      price: Math.round(convertPrice(40000)),
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      id: 'ecommerce',
      icon: ShoppingCart,
      title: t('services.ecommerce.title'),
      description: t('services.ecommerce.description'),
      features: [
        t('features.ecommerce.cart'),
        t('features.ecommerce.payments'),
        t('features.ecommerce.inventory'),
        t('features.ecommerce.analytics')
      ],
      price: Math.round(convertPrice(35000)),
      color: 'from-teal-500 to-teal-600'
    },
    {
      id: 'cloud-migration',
      icon: Cloud,
      title: t('services.cloud.title'),
      description: t('services.cloud.description'),
      features: [
        t('features.cloud.migration'),
        t('features.cloud.optimization'),
        t('features.cloud.backup'),
        t('features.cloud.monitoring')
      ],
      price: Math.round(convertPrice(30000)),
      color: 'from-cyan-500 to-cyan-600'
    },
    {
      id: 'ai-solutions',
      icon: Brain,
      title: t('services.ai.title'),
      description: t('services.ai.description'),
      features: [
        t('features.ai.ml'),
        t('features.ai.automation'),
        t('features.ai.analytics'),
        t('features.ai.chatbots')
      ],
      price: Math.round(convertPrice(50000)),
      color: 'from-slate-500 to-slate-600'
    },
    {
      id: 'it-consulting',
      icon: Settings,
      title: t('services.consulting.title'),
      description: t('services.consulting.description'),
      features: [
        t('features.consulting.audit'),
        t('features.consulting.strategy'),
        t('features.consulting.training'),
        t('features.consulting.support')
      ],
      price: Math.round(convertPrice(20000)),
      color: 'from-gray-500 to-slate-500'
    }
  ]

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-32 lg:py-40 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              {t('services.page.title')}
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              {t('services.page.subtitle')}
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-center">
              <div className="flex items-center text-blue-200">
                <Star className="w-5 h-5 text-blue-400 mr-2" />
                <span>{t('services.page.stats.projects')}</span>
              </div>
              <div className="flex items-center text-blue-200">
                <CheckCircle className="w-5 h-5 text-blue-400 mr-2" />
                <span>{t('services.page.stats.guarantee')}</span>
              </div>
              <div className="flex items-center text-blue-200">
                <Settings className="w-5 h-5 text-cyan-400 mr-2" />
                <span>{t('services.page.stats.support')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <div key={service.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${service.color}`}></div>
                  <div className="p-8">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${service.color} text-white mb-6`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {service.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-6">
                      {service.description}
                    </p>
                    
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-gray-700">
                          <CheckCircle className="w-4 h-4 text-blue-500 mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-gray-500">{t('services.page.from')}</span>
                        <div className="text-2xl font-bold text-blue-600">
                          {currency} ${service.price.toLocaleString()}
                        </div>
                      </div>
                      
                      <Link 
                        href={`/services/${service.id}`}
                        className="group/btn inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300"
                      >
                        {t('services.page.viewDetails')}
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-8 sm:p-12 lg:p-16 text-white shadow-2xl">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  {t('services.page.cta.title')}
                </h2>
                <p className="text-xl text-blue-100 mb-8">
                  {t('services.page.cta.subtitle')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    href="/quoter"
                    className="inline-flex items-center px-8 py-4 bg-white hover:bg-gray-50 text-blue-600 font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
                  >
                    {t('services.page.cta.quote')}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                  <Link 
                    href="/contact"
                    className="inline-flex items-center px-8 py-4 bg-transparent hover:bg-white/10 text-white font-semibold rounded-full border-2 border-white/30 hover:border-white/50 transition-all duration-300"
                  >
                    {t('services.page.cta.contact')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BackToTop />
    </main>
  )
}


