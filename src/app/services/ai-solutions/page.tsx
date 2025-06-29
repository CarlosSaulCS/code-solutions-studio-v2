'use client'

import Link from 'next/link'
import { 
  Brain, 
  ArrowRight, 
  CheckCircle, 
  Bot,
  Zap,
  BarChart3,
  Eye,
  MessageSquare,
  Target,
  Clock,
  Settings,
  TrendingUp
} from 'lucide-react'
import BackToTop from '@/components/BackToTop'
import { useLanguage } from '@/app/providers'
import { useCurrency } from '@/app/providers'

export default function AISolutionsPage() {
  const { t } = useLanguage()
  const { currency, convertPrice } = useCurrency()

  const applications = [
    {
      icon: Bot,
      title: t('pages.ai.applications.chatbot.title'),
      description: t('pages.ai.applications.chatbot.description')
    },
    {
      icon: Zap,
      title: t('pages.ai.applications.automation.title'),
      description: t('pages.ai.applications.automation.description')
    },
    {
      icon: BarChart3,
      title: t('pages.ai.applications.analytics.title'),
      description: t('pages.ai.applications.analytics.description')
    },
    {
      icon: Eye,
      title: t('pages.ai.applications.vision.title'),
      description: t('pages.ai.applications.vision.description')
    },
    {
      icon: MessageSquare,
      title: t('pages.ai.applications.nlp.title'),
      description: t('pages.ai.applications.nlp.description')
    },
    {
      icon: Target,
      title: t('pages.ai.applications.recommendation.title'),
      description: t('pages.ai.applications.recommendation.description')
    }
  ]

  const packages = [
    {
      id: 'chatbot',
      name: t('pages.ai.packages.chatbot.name'),
      price: Math.round(convertPrice(50000)),
      popular: false,
      description: t('pages.ai.packages.chatbot.description'),
      features: [
        t('pages.ai.packages.chatbot.features.nlp'),
        t('pages.ai.packages.chatbot.features.integration'),
        t('pages.ai.packages.chatbot.features.learning'),
        t('pages.ai.packages.chatbot.features.analytics'),
        t('pages.ai.packages.chatbot.features.customization'),
        t('pages.ai.packages.chatbot.features.support')
      ],
      timeline: t('pages.ai.packages.chatbot.timeline')
    },
    {
      id: 'automation',
      name: t('pages.ai.packages.automation.name'),
      price: Math.round(convertPrice(120000)),
      popular: true,
      description: t('pages.ai.packages.automation.description'),
      features: [
        t('pages.ai.packages.automation.features.workflow'),
        t('pages.ai.packages.automation.features.ml'),
        t('pages.ai.packages.automation.features.integration'),
        t('pages.ai.packages.automation.features.monitoring'),
        t('pages.ai.packages.automation.features.optimization'),
        t('pages.ai.packages.automation.features.training'),
        t('pages.ai.packages.automation.features.support')
      ],
      timeline: t('pages.ai.packages.automation.timeline')
    }
  ]

  const technologies = [
    { name: 'TensorFlow', icon: '🧠' },
    { name: 'PyTorch', icon: '🔥' },
    { name: 'OpenAI', icon: '🤖' },
    { name: 'Langchain', icon: '🔗' },
    { name: 'Hugging Face', icon: '🤗' },
    { name: 'AWS AI', icon: '☁️' },
    { name: 'Azure AI', icon: '🔷' },
    { name: 'Google AI', icon: '🎯' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative py-32 lg:py-40 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-blue-800/10"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
              <Brain className="w-4 h-4 mr-2" />
              {t('pages.ai.badge')}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              {t('pages.ai.title')}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {t('pages.ai.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/quoter" 
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {t('pages.ai.cta.explore')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link 
                href="/contact" 
                className="inline-flex items-center px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300 font-semibold"
              >
                {t('pages.ai.cta.consultation')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Applications Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t('pages.ai.applications.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('pages.ai.applications.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {applications.map((app, index) => (
              <div key={index} className="group bg-gradient-to-br from-gray-50 to-blue-50 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <app.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {app.title}
                </h3>
                <p className="text-gray-600">
                  {app.description}
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
              {t('pages.ai.solutions.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('pages.ai.solutions.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-4xl mx-auto">
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

      {/* Technologies Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
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
                {t('pages.ai.subtitle')}
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


