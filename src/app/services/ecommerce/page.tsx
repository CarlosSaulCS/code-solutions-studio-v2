'use client'

import { useLanguage } from '@/app/providers'
import { useCurrency } from '@/app/providers'
import { ShoppingCart, CreditCard, Package, TrendingUp, Smartphone, Globe, Shield, Users } from 'lucide-react'
import Link from 'next/link'

export default function EcommercePage() {
  const { t, language } = useLanguage()
  const { currency } = useCurrency()

  const features = [
    {
      icon: ShoppingCart,
      title: t('ecommerce.features.cart.title'),
      description: t('ecommerce.features.cart.description')
    },    {
      icon: CreditCard,
      title: t('ecommerce.features.payments.title'),
      description: t('ecommerce.features.payments.description')
    },
    {
      icon: Package,
      title: t('ecommerce.features.inventory.title'),
      description: t('ecommerce.features.inventory.description')
    },
    {
      icon: TrendingUp,
      title: t('ecommerce.features.analytics.title'),
      description: t('ecommerce.features.analytics.description')
    },
    {
      icon: Smartphone,
      title: t('ecommerce.features.mobile.title'),
      description: t('ecommerce.features.mobile.description')
    },
    {
      icon: Globe,
      title: t('ecommerce.features.multilang.title'),
      description: t('ecommerce.features.multilang.description')
    }
  ]

  const packages = [
    {      name: t('pages.ecommerce.packages.basic.name'),
      price: currency === 'MXN' ? '$45,000' : '$2,500',
      period: t('pages.common.packages.project'),
      features: [
        t('pages.ecommerce.packages.basic.features.products'),
        t('pages.ecommerce.packages.basic.features.cart'),
        t('pages.ecommerce.packages.basic.features.payment'),
        t('pages.ecommerce.packages.basic.features.admin'),
        t('pages.ecommerce.packages.basic.features.seo'),
        t('pages.ecommerce.packages.basic.features.support')
      ]
    },
    {      name: t('pages.ecommerce.packages.professional.name'),
      price: currency === 'MXN' ? '$75,000' : '$4,200',
      period: t('pages.common.packages.project'),
      popular: true,
      features: [
        t('pages.ecommerce.packages.professional.features.products'),
        t('pages.ecommerce.packages.professional.features.payments'),
        t('pages.ecommerce.packages.professional.features.inventory'),
        t('pages.ecommerce.packages.professional.features.analytics'),
        t('pages.ecommerce.packages.professional.features.multilang'),
        t('pages.ecommerce.packages.professional.features.pwa'),
        t('pages.ecommerce.packages.professional.features.support')
      ]
    },
    {      name: t('pages.ecommerce.packages.enterprise.name'),
      price: currency === 'MXN' ? '$120,000' : '$6,700',
      period: t('pages.common.packages.project'),
      features: [
        t('pages.ecommerce.packages.enterprise.features.products'),
        t('pages.ecommerce.packages.enterprise.features.marketplace'),
        t('pages.ecommerce.packages.enterprise.features.b2b'),
        t('pages.ecommerce.packages.enterprise.features.api'),
        t('pages.ecommerce.packages.enterprise.features.integrations'),
        t('pages.ecommerce.packages.enterprise.features.hosting'),
        t('pages.ecommerce.packages.enterprise.features.support')
      ]
    }
  ]
  const process = [
    {
      step: 1,
      title: t('pages.ecommerce.process.analysis.title'),
      description: t('pages.ecommerce.process.analysis.description')
    },
    {
      step: 2,
      title: t('pages.ecommerce.process.design.title'),
      description: t('pages.ecommerce.process.design.description')
    },
    {
      step: 3,
      title: t('pages.ecommerce.process.development.title'),
      description: t('pages.ecommerce.process.development.description')
    },
    {
      step: 4,
      title: t('pages.ecommerce.process.integration.title'),
      description: t('pages.ecommerce.process.integration.description')
    },
    {
      step: 5,
      title: t('pages.ecommerce.process.testing.title'),
      description: t('pages.ecommerce.process.testing.description')
    },
    {
      step: 6,
      title: t('pages.ecommerce.process.launch.title'),
      description: t('pages.ecommerce.process.launch.description')
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Hero Section */}
      <section className="py-32 lg:py-40">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">            <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <ShoppingCart className="w-4 h-4" />
              <span>{t('pages.ecommerce.badge')}</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-600">{t('pages.ecommerce.title')}</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {t('pages.ecommerce.subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/quoter"
                className="bg-gradient-to-r from-primary-600 to-primary-600 hover:from-primary-700 hover:to-primary-700 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>{t('pages.ecommerce.cta.quote')}</span>
              </Link>
              <Link
                href="/contact"
                className="border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 inline-flex items-center justify-center space-x-2"
              >
                <Users className="w-5 h-5" />
                <span>{t('pages.ecommerce.cta.expert')}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('pages.ecommerce.features.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('pages.ecommerce.features.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>      {/* Packages Section */}
      <section className="py-20 bg-gradient-to-br from-secondary-50 to-primary-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('pages.ecommerce.packages.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('pages.ecommerce.packages.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {packages.map((pkg, index) => (
              <div key={index} className={`bg-white rounded-2xl p-8 shadow-lg relative ${
                pkg.popular ? 'ring-2 ring-primary-500 scale-105' : ''
              }`}>
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                      {t('pages.common.packages.popular')}
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{pkg.name}</h3>
                  <div className="text-4xl font-bold text-primary-600 mb-2">{pkg.price}</div>
                  <div className="text-gray-500">{pkg.period}</div>
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/quoter"
                  className={`block w-full text-center py-3 rounded-lg font-semibold transition-all duration-300 ${                    pkg.popular
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('pages.common.process.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('pages.ecommerce.process.subtitle')}
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {process.map((step, index) => (
              <div key={index} className="flex items-start mb-12 last:mb-0">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-6">
                  {step.step}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl shadow-2xl p-8 sm:p-12 lg:p-16 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              {t('pages.ecommerce.cta.title')}
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              {t('pages.ecommerce.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/quoter"
                className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>{t('pages.ecommerce.cta.quote')}</span>
              </Link>
              <Link
                href="/contact"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-4 rounded-lg transition-all duration-300 inline-flex items-center justify-center space-x-2"
              >
                <Users className="w-5 h-5" />
                <span>{t('pages.ecommerce.cta.expert')}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}


