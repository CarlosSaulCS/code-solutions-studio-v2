'use client'

import { useContactForm } from '@/hooks/useContactForm'
import { useLanguage } from '@/app/providers'
import { useState, useEffect, useRef } from 'react'
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Clock, Users, Award } from 'lucide-react'

export default function ContactForm() {
  const { t } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [])
  const {
    formData,
    isLoading,
    isSuccess,
    error,
    updateField,
    submitForm,
    resetForm,
  } = useContactForm()

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12 text-center max-w-md w-full">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {t('contact.success.title')}
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            {t('contact.success.message')}
          </p>
          <button
            onClick={resetForm}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-105"
          >
            {t('contact.success.button')}
          </button>
        </div>
      </div>
    )
  }

  return (    <section 
      ref={elementRef}
      className="py-12 sm:py-16 lg:py-20 bg-gray-50 min-h-screen" 
      id="contact"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              {t('contact.title')}
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t('contact.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Information */}
            <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 sm:p-10 text-white h-full">
                <h3 className="text-2xl sm:text-3xl font-bold mb-6">
                  {t('contact.info.title')}
                </h3>
                <p className="text-blue-100 mb-8 text-lg leading-relaxed">
                  {t('contact.info.subtitle')}
                </p>

                {/* Contact Details */}
                <div className="space-y-6 mb-10">
                  <div className="flex items-start space-x-4">
                    <div className="bg-white/20 p-3 rounded-lg">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{t('contact.info.email.title')}</h4>
                      <p className="text-blue-100">info@codesolutions.com</p>
                      <p className="text-blue-100">support@codesolutions.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-white/20 p-3 rounded-lg">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{t('contact.info.phone.title')}</h4>
                      <p className="text-blue-100">+52 (55) 1234-5678</p>
                      <p className="text-blue-100">+52 (55) 8765-4321</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-white/20 p-3 rounded-lg">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{t('contact.info.address.title')}</h4>
                      <p className="text-blue-100">Ciudad de México, México</p>
                      <p className="text-blue-100">Zona Metropolitana</p>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/20">
                  <div className="text-center">
                    <Clock className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm text-blue-100">{t('contact.features.response')}</p>
                  </div>
                  <div className="text-center">
                    <Users className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm text-blue-100">{t('contact.features.support')}</p>
                  </div>
                  <div className="text-center">
                    <Award className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm text-blue-100">{t('contact.features.quality')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className={`transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                  {t('contact.form.title')}
                </h3>

                {error && (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6 flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-slate-800 font-medium">{t('contact.error.title')}</h4>
                      <p className="text-slate-700 text-sm">{error}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={submitForm} className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                      {t('contact.form.name.label')}
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      placeholder={t('contact.form.name.placeholder')}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                      {t('contact.form.email.label')}
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder={t('contact.form.email.placeholder')}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
                      {t('contact.form.phone.label')}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      placeholder={t('contact.form.phone.placeholder')}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  {/* Subject Field */}
                  <div>
                    <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">
                      {t('contact.form.subject.label')}
                    </label>
                    <select
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => updateField('subject', e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    >
                      <option value="">{t('contact.form.subject.placeholder')}</option>
                      <option value="web">{t('services.webDevelopment.title')}</option>
                      <option value="mobile">{t('services.mobileApps.title')}</option>
                      <option value="ecommerce">{t('services.ecommerce.title')}</option>
                      <option value="cloud">{t('services.cloudMigration.title')}</option>
                      <option value="ai">{t('services.aiSolutions.title')}</option>
                      <option value="consulting">{t('services.itConsulting.title')}</option>
                      <option value="other">{t('contact.form.subject.other')}</option>
                    </select>
                  </div>

                  {/* Message Field */}
                  <div>
                    <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                      {t('contact.form.message.label')}
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      value={formData.message}
                      onChange={(e) => updateField('message', e.target.value)}
                      placeholder={t('contact.form.message.placeholder')}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`
                      w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 
                      text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 
                      flex items-center justify-center space-x-3 hover:scale-105 hover:shadow-lg
                      disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                    `}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>{t('contact.form.sending')}</span>
                      </>
                    ) : (
                      <>
                        <span>{t('contact.form.send')}</span>
                        <Send className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  {/* Privacy Notice */}
                  <p className="text-sm text-gray-500 text-center">
                    {t('contact.form.privacy')}
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

