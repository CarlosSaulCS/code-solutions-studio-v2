'use client'

import { useLanguage } from '@/app/providers'
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Github, ArrowUp } from 'lucide-react'
import Link from 'next/link'
import { useCallback } from 'react'

export default function Footer() {
  const { t } = useLanguage()

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook', color: 'hover:text-blue-500' },
    { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:text-blue-400' },
    { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:text-cyan-500' },
    { icon: Linkedin, href: '#', label: 'LinkedIn', color: 'hover:text-blue-600' },
    { icon: Github, href: '#', label: 'GitHub', color: 'hover:text-gray-400' },
  ]

  const services = [
    { key: 'webDevelopment', href: '/services/web-development' },
    { key: 'mobileApps', href: '/services/mobile-apps' },
    { key: 'ecommerce', href: '/services/ecommerce' },
    { key: 'cloudMigration', href: '/services/cloud-migration' },
    { key: 'aiSolutions', href: '/services/ai-solutions' },
    { key: 'itConsulting', href: '/services/it-consulting' },
  ]

  const quickLinks = [
    { labelKey: 'footer.links.about', href: '/about' },
    { labelKey: 'footer.links.services', href: '/services' },
    { labelKey: 'footer.links.contact', href: '/contact' },
    { labelKey: 'footer.links.quoter', href: '/quoter' },
  ]

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.1)_1px,_transparent_0)] bg-[length:50px_50px]"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6 group cursor-pointer">
              <div className="relative w-12 h-12 transition-transform duration-300 group-hover:scale-105">
                <svg 
                  viewBox="0 0 48 48" 
                  className="w-full h-full drop-shadow-xl"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    {/* Advanced gradient with multiple stops for footer */}
                    <linearGradient id="logoGradientFooter" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#60a5fa" />
                      <stop offset="25%" stopColor="#3b82f6" />
                      <stop offset="60%" stopColor="#2563eb" />
                      <stop offset="85%" stopColor="#1d4ed8" />
                      <stop offset="100%" stopColor="#1e40af" />
                    </linearGradient>
                    
                    {/* Inner highlight gradient */}
                    <radialGradient id="innerHighlightFooter" cx="50%" cy="25%" r="80%">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
                      <stop offset="50%" stopColor="rgba(255,255,255,0.2)" />
                      <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                    </radialGradient>
                    
                    {/* Enhanced shadow filter */}
                    <filter id="enhancedShadowFooter">
                      <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.4" floodColor="#0f172a"/>
                      <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.6" floodColor="#1e40af"/>
                    </filter>
                    
                    {/* Advanced glow effect */}
                    <filter id="advancedGlowFooter">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                      <feColorMatrix in="coloredBlur" type="matrix" values="1 1 1 0 0  1 1 1 0 0  1 1 1 0 0  0 0 0 1 0"/>
                      <feMerge> 
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  
                  {/* Background rings for depth */}
                  <circle cx="24" cy="24" r="23" fill="none" stroke="url(#logoGradientFooter)" strokeWidth="0.5" opacity="0.3"/>
                  <circle cx="24" cy="24" r="21.5" fill="none" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="0.5"/>
                  
                  {/* Main circle with enhanced styling */}
                  <circle 
                    cx="24" 
                    cy="24" 
                    r="20" 
                    fill="url(#logoGradientFooter)" 
                    filter="url(#enhancedShadowFooter)"
                    className="transition-all duration-500 group-hover:brightness-125"
                  />
                  
                  {/* Inner highlight overlay */}
                  <circle cx="24" cy="24" r="20" fill="url(#innerHighlightFooter)" />
                  
                  {/* Subtle inner border */}
                  <circle cx="24" cy="24" r="19" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                  
                  {/* Code elements with enhanced glow */}
                  <g filter="url(#advancedGlowFooter)" className="transition-all duration-500 group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.9)]">
                    {/* Opening tag < with premium styling */}
                    <path 
                      d="M18 15 L12 24 L18 33" 
                      stroke="white" 
                      strokeWidth="3.2" 
                      fill="none" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className="transition-all duration-500 group-hover:stroke-[4.2] drop-shadow-sm"
                    />
                    
                    {/* Closing tag > with premium styling */}
                    <path 
                      d="M30 15 L36 24 L30 33" 
                      stroke="white" 
                      strokeWidth="3.2" 
                      fill="none" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className="transition-all duration-500 group-hover:stroke-[4.2] drop-shadow-sm"
                    />
                    
                    {/* Forward slash / with premium styling */}
                    <path 
                      d="M27 16 L21 32" 
                      stroke="white" 
                      strokeWidth="2.8" 
                      fill="none" 
                      strokeLinecap="round"
                      className="transition-all duration-500 group-hover:stroke-[3.8] drop-shadow-sm"
                    />
                  </g>
                  
                  {/* Premium decorative elements */}
                  <circle cx="13" cy="9" r="1" fill="rgba(255,255,255,0.8)" className="animate-pulse" style={{animationDelay: '0s', animationDuration: '5s'}} />
                  <circle cx="35" cy="9" r="1" fill="rgba(255,255,255,0.8)" className="animate-pulse" style={{animationDelay: '1.25s', animationDuration: '5s'}} />
                  <circle cx="9" cy="35" r="1" fill="rgba(255,255,255,0.8)" className="animate-pulse" style={{animationDelay: '2.5s', animationDuration: '5s'}} />
                  <circle cx="39" cy="35" r="1" fill="rgba(255,255,255,0.8)" className="animate-pulse" style={{animationDelay: '3.75s', animationDuration: '5s'}} />
                  
                  {/* Additional micro-details */}
                  <circle cx="17" cy="39" r="0.5" fill="rgba(96, 165, 250, 0.6)" className="animate-pulse" style={{animationDelay: '0.8s', animationDuration: '6s'}} />
                  <circle cx="31" cy="39" r="0.5" fill="rgba(96, 165, 250, 0.6)" className="animate-pulse" style={{animationDelay: '4.2s', animationDuration: '6s'}} />
                </svg>
                
                {/* Enhanced hover glow effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 group-hover:opacity-25 transition-all duration-500 blur-lg -z-10 group-hover:scale-110"></div>
                <div className="absolute inset-0 rounded-full bg-blue-300 opacity-0 group-hover:opacity-15 transition-all duration-300 blur-sm -z-10"></div>
              </div>
              
              <div className="transition-all duration-300 group-hover:translate-x-1">
                <h3 className="text-xl font-bold bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent transition-all duration-300 group-hover:from-blue-100 group-hover:to-cyan-100">
                  Code Solutions
                </h3>
                <p className="text-sm font-semibold tracking-widest bg-gradient-to-r from-blue-300 via-blue-400 to-cyan-300 bg-clip-text text-transparent transition-all duration-300 group-hover:from-cyan-200 group-hover:to-blue-200">
                  STUDIO
                </p>
              </div>
            </div>
            
            <p className="text-gray-400 mb-6 leading-relaxed">
              {t('footer.description')}
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors duration-200">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">info@codesolutions.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors duration-200">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">+52 (55) 1234-5678</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors duration-200">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">CDMX, México</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">
              {t('footer.services.title')}
            </h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.key}>
                  <Link
                    href={service.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm block py-1"
                  >
                    {t(`services.${service.key}.title`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">
              {t('footer.links.title')}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm block py-1"
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">
              {t('footer.newsletter.title')}
            </h4>
            <p className="text-gray-400 mb-4 text-sm leading-relaxed">
              {t('footer.newsletter.subtitle')}
            </p>
            
            {/* Newsletter Form */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder={t('footer.newsletter.placeholder')}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 whitespace-nowrap">
                  {t('footer.newsletter.subscribe')}
                </button>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h5 className="text-white font-medium mb-4">{t('footer.social.title')}</h5>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon
                  return (
                    <a
                      key={index}
                      href={social.href}
                      className={`text-gray-400 ${social.color} transition-colors duration-200 p-2 rounded-lg hover:bg-gray-800`}
                      aria-label={social.label}
                    >
                      <IconComponent className="w-5 h-5" />
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-center sm:text-left">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} Code Solutions Studio. {t('footer.copyright')}
              </p>
            </div>
            
            <div className="flex items-center space-x-6">
              <Link 
                href="/privacy" 
                className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
              >
                {t('footer.legal.privacy')}
              </Link>
              <Link 
                href="/terms" 
                className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
              >
                {t('footer.legal.terms')}
              </Link>
              
              {/* Back to Top Button */}
              <button
                onClick={scrollToTop}
                className="bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white p-2 rounded-lg transition-all duration-200 hover:scale-110"
                aria-label="Back to top"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

