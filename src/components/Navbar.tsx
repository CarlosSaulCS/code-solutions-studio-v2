'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useLanguage, useCurrency } from '../app/providers'
import { Menu, X, ChevronDown, Globe, DollarSign, User, LogOut, Settings } from 'lucide-react'

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage()
  const { currency, setCurrency } = useCurrency()
  const { data: session } = useSession()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false)
  const [isServicesOpen, setIsServicesOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const servicesTimeoutRef = useRef<NodeJS.Timeout>()

  // Hydration check
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Simplified navbar handler - always visible
  const handleScroll = useCallback(() => {
    if (!isMounted) return
    
    const currentScrollY = window.scrollY
    
    // Background logic for navbar styling only
    const isHeroPage = pathname === '/' 
    if (!isHeroPage) {
      setIsScrolled(true)
    } else {
      const windowHeight = window.innerHeight
      setIsScrolled(currentScrollY > windowHeight * 0.3)
    }
  }, [pathname, isMounted])

  useEffect(() => {
    if (!isMounted) return
    
    const onScroll = () => {
      handleScroll()
    }
    
    handleScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [handleScroll, isMounted])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
        setIsServicesOpen(false)
      }
      
      // Close dropdowns when clicking outside
      if (!navRef.current?.contains(event.target as Node)) {
        setIsLanguageOpen(false)
        setIsCurrencyOpen(false)
        setIsServicesOpen(false)
        setIsUserMenuOpen(false)
      }
    }

    if (isMenuOpen || isLanguageOpen || isCurrencyOpen || isServicesOpen || isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      if (isMenuOpen) {
        document.body.style.overflow = 'hidden' // Prevent scroll on mobile
      }
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen, isLanguageOpen, isCurrencyOpen, isServicesOpen, isUserMenuOpen])

  // Close menu on route change
  useEffect(() => {
    const handleRouteChange = () => {
      setIsMenuOpen(false)
      setIsServicesOpen(false)
    }
    
    window.addEventListener('popstate', handleRouteChange)
    return () => window.removeEventListener('popstate', handleRouteChange)
  }, [])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => {
    setIsMenuOpen(false)
    setIsServicesOpen(false)
    setIsLanguageOpen(false)
    setIsCurrencyOpen(false)
    setIsUserMenuOpen(false)
  }

  const handleServicesHover = () => {
    if (servicesTimeoutRef.current) {
      clearTimeout(servicesTimeoutRef.current)
    }
    setIsServicesOpen(true)
  }

  const handleServicesLeave = () => {
    servicesTimeoutRef.current = setTimeout(() => {
      setIsServicesOpen(false)
    }, 150)
  }

  const isActive = (path: string) => pathname === path

  const services = [
    { href: '/services/web-development', key: 'webDevelopment' },
    { href: '/services/mobile-apps', key: 'mobileApps' },
    { href: '/services/ecommerce', key: 'ecommerce' },
    { href: '/services/cloud-migration', key: 'cloudMigration' },
    { href: '/services/ai-solutions', key: 'aiSolutions' },
    { href: '/services/it-consulting', key: 'itConsulting' },
  ]

  if (!isMounted) {
    return null // Prevent hydration mismatch
  }

  return (
    <nav 
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-2xl border-b border-gray-300' 
          : 'bg-white/10 backdrop-blur-md'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-3 flex-shrink-0 group"
            onClick={closeMenu}
          >
            <div className="relative w-8 h-8 lg:w-12 lg:h-12 transition-transform duration-300 group-hover:scale-110">
              <svg 
                viewBox="0 0 48 48" 
                className="w-full h-full drop-shadow-lg"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Advanced gradient with multiple stops */}
                  <linearGradient id="logoGradientNavbar" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="30%" stopColor="#3b82f6" />
                    <stop offset="70%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                  </linearGradient>
                  
                  {/* Inner glow gradient */}
                  <radialGradient id="innerGlowNavbar" cx="50%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                  </radialGradient>
                  
                  {/* Outer shadow */}
                  <filter id="outerShadowNavbar">
                    <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.25" floodColor="#1e40af"/>
                  </filter>
                  
                  {/* Code glow effect */}
                  <filter id="codeGlowNavbar">
                    <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                    <feMerge> 
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                
                {/* Outer ring */}
                <circle cx="24" cy="24" r="22" fill="none" stroke="url(#logoGradientNavbar)" strokeWidth="1" opacity="0.3"/>
                
                {/* Main circle with advanced styling */}
                <circle 
                  cx="24" 
                  cy="24" 
                  r="20" 
                  fill="url(#logoGradientNavbar)" 
                  filter="url(#outerShadowNavbar)"
                  className="transition-all duration-300 group-hover:brightness-110"
                />
                
                {/* Inner glow overlay */}
                <circle cx="24" cy="24" r="20" fill="url(#innerGlowNavbar)" />
                
                {/* Code elements with glow */}
                <g filter="url(#codeGlowNavbar)" className="transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
                  {/* Opening tag < */}
                  <path 
                    d="M18 15 L12 24 L18 33" 
                    stroke="white" 
                    strokeWidth="3" 
                    fill="none" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="transition-all duration-300 group-hover:stroke-[4]"
                  />
                  
                  {/* Closing tag > */}
                  <path 
                    d="M30 15 L36 24 L30 33" 
                    stroke="white" 
                    strokeWidth="3" 
                    fill="none" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="transition-all duration-300 group-hover:stroke-[4]"
                  />
                  
                  {/* Forward slash / */}
                  <path 
                    d="M27 16 L21 32" 
                    stroke="white" 
                    strokeWidth="2.5" 
                    fill="none" 
                    strokeLinecap="round"
                    className="transition-all duration-300 group-hover:stroke-[3.5]"
                  />
                </g>
                
                {/* Decorative dots with subtle animation */}
                <circle cx="14" cy="10" r="0.8" fill="rgba(255,255,255,0.7)" className="animate-pulse" style={{animationDelay: '0s', animationDuration: '4s'}} />
                <circle cx="34" cy="10" r="0.8" fill="rgba(255,255,255,0.7)" className="animate-pulse" style={{animationDelay: '1s', animationDuration: '4s'}} />
                <circle cx="10" cy="34" r="0.8" fill="rgba(255,255,255,0.7)" className="animate-pulse" style={{animationDelay: '2s', animationDuration: '4s'}} />
                <circle cx="38" cy="34" r="0.8" fill="rgba(255,255,255,0.7)" className="animate-pulse" style={{animationDelay: '3s', animationDuration: '4s'}} />
              </svg>
              
              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-full bg-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-md -z-10"></div>
            </div>
            
            <div className="hidden sm:block transition-all duration-300 group-hover:translate-x-1">
              <span className={`font-bold text-lg lg:text-xl transition-all duration-300 bg-gradient-to-r ${
                isScrolled 
                  ? 'from-gray-900 to-gray-700 text-transparent bg-clip-text' 
                  : 'from-white to-gray-100 text-transparent bg-clip-text drop-shadow-md'
              }`}>
                Code Solutions
              </span>
              <span className={`block text-xs font-semibold tracking-wide transition-all duration-300 bg-gradient-to-r ${
                isScrolled
                  ? 'from-blue-600 to-blue-500 text-transparent bg-clip-text'
                  : 'from-blue-200 to-cyan-200 text-transparent bg-clip-text drop-shadow'
              }`}>
                STUDIO
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link 
              href="/"
              className={`font-medium transition-all duration-200 hover:scale-105 px-4 py-2 rounded-lg ${
                isActive('/') 
                  ? 'text-blue-600 font-semibold bg-blue-50/90 backdrop-blur-sm' 
                  : isScrolled 
                    ? 'text-gray-900 hover:text-blue-600 hover:bg-blue-50/90' 
                    : 'text-white drop-shadow-lg hover:text-blue-200 hover:bg-white/20 backdrop-blur-sm'
              }`}
            >
              {t('nav.home')}
            </Link>

            {/* Services Dropdown */}
            <div 
              className="relative"
              onMouseEnter={handleServicesHover}
              onMouseLeave={handleServicesLeave}
            >
              <button
                className={`flex items-center space-x-1 font-medium transition-all duration-200 hover:scale-105 px-4 py-2 rounded-lg ${
                  pathname.startsWith('/services') 
                    ? 'text-blue-600 font-semibold bg-blue-50/90 backdrop-blur-sm' 
                    : isScrolled 
                      ? 'text-gray-900 hover:text-blue-600 hover:bg-blue-50/90' 
                      : 'text-white drop-shadow-lg hover:text-blue-200 hover:bg-white/20 backdrop-blur-sm'
                }`}
                aria-expanded={isServicesOpen}
                aria-haspopup="true"
              >
                <span>{t('nav.services')}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                  isServicesOpen ? 'rotate-180' : ''
                }`} />
              </button>

              {/* Services Dropdown Menu */}
              {isServicesOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200/50 py-3 z-50 animate-in slide-in-from-top-2 duration-300">
                  <Link
                    href="/services"
                    className="block px-5 py-3 text-gray-700 hover:bg-blue-50/80 hover:text-blue-600 transition-all duration-200 font-medium hover:translate-x-1"
                  >
                    {t('nav.allServices')}
                  </Link>
                  <hr className="my-2 border-gray-100/70" />
                  {services.map((service) => (
                    <Link
                      key={service.href}
                      href={service.href}
                      className="block px-5 py-3 text-gray-700 hover:bg-blue-50/80 hover:text-blue-600 transition-all duration-200 hover:translate-x-1 group"
                    >
                      <span className="group-hover:font-medium transition-all duration-200">
                        {t(`services.${service.key}.title`)}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link 
              href="/about"
              className={`font-medium transition-all duration-200 hover:scale-105 px-4 py-2 rounded-lg ${
                isActive('/about') 
                  ? 'text-blue-600 font-semibold bg-blue-50/90 backdrop-blur-sm' 
                  : isScrolled 
                    ? 'text-gray-900 hover:text-blue-600 hover:bg-blue-50/90' 
                    : 'text-white drop-shadow-lg hover:text-blue-200 hover:bg-white/20 backdrop-blur-sm'
              }`}
            >
              {t('nav.about')}
            </Link>

            <Link 
              href="/contact"
              className={`font-medium transition-all duration-200 hover:scale-105 px-4 py-2 rounded-lg ${
                isActive('/contact') 
                  ? 'text-blue-600 font-semibold bg-blue-50/90 backdrop-blur-sm' 
                  : isScrolled 
                    ? 'text-gray-900 hover:text-blue-600 hover:bg-blue-50/90' 
                    : 'text-white drop-shadow-lg hover:text-blue-200 hover:bg-white/20 backdrop-blur-sm'
              }`}
            >
              {t('nav.contact')}
            </Link>

            <Link 
              href="/quoter"
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 border border-blue-500/20 backdrop-blur-sm"
            >
              {t('nav.quoter')}
            </Link>
          </div>

          {/* Auth & Controls */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* User Menu or Auth Links */}
            {session ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setIsUserMenuOpen(!isUserMenuOpen)
                    setIsLanguageOpen(false)
                    setIsCurrencyOpen(false)
                  }}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 border ${
                    isScrolled 
                      ? 'bg-white hover:bg-gray-50 border-gray-200 text-gray-900 shadow-sm' 
                      : 'bg-white/10 backdrop-blur-md hover:bg-white/20 border-white/20 text-white drop-shadow-lg'
                  }`}
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="true"
                >
                  <div className="w-6 h-6 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className={`text-sm font-semibold transition-colors duration-200 ${
                    isScrolled 
                      ? 'text-gray-900' 
                      : 'text-white drop-shadow-md'
                  }`}>
                    {session.user.name?.split(' ')[0] || 'Usuario'}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-all duration-200 ${
                    isUserMenuOpen ? 'rotate-180' : ''
                  } ${isScrolled ? 'text-gray-600' : 'text-white drop-shadow-md'}`} />
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200/50 py-3 z-50 animate-in slide-in-from-top-2 duration-300">
                    <div className="px-5 py-4 border-b border-gray-100/70 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 mx-2 rounded-lg">
                      <p className="text-sm font-semibold text-gray-900">{session.user.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{session.user.email}</p>
                    </div>
                    
                    <Link
                      href="/dashboard"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center space-x-3 px-5 py-3 text-gray-700 hover:bg-blue-50/80 hover:text-blue-600 transition-all duration-200 hover:translate-x-1 group"
                    >
                      <User className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                      <span className="group-hover:font-medium transition-all duration-200">Mi Dashboard</span>
                    </Link>
                    
                    {session.user.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-3 px-5 py-3 text-gray-700 hover:bg-purple-50/80 hover:text-purple-600 transition-all duration-200 hover:translate-x-1 group"
                      >
                        <Settings className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                        <span className="group-hover:font-medium transition-all duration-200">Admin Panel</span>
                      </Link>
                    )}
                    
                    <hr className="my-2 border-gray-100/70" />
                    
                    <button
                      onClick={() => {
                        signOut({ callbackUrl: '/' })
                        setIsUserMenuOpen(false)
                      }}
                      className="flex items-center space-x-3 px-5 py-3 text-gray-700 hover:bg-red-50/80 hover:text-red-600 transition-all duration-200 hover:translate-x-1 w-full text-left group"
                    >
                      <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                      <span className="group-hover:font-medium transition-all duration-200">Cerrar Sesión</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Auth Dropdown Button
              <div className="relative">
                <button
                  onClick={() => {
                    setIsUserMenuOpen(!isUserMenuOpen)
                    setIsLanguageOpen(false)
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 border ${
                    isScrolled 
                      ? 'bg-white hover:bg-gray-50 border-gray-200 text-gray-900 shadow-sm' 
                      : 'bg-white/10 backdrop-blur-md hover:bg-white/20 border-white/20 text-white drop-shadow-lg'
                  }`}
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="true"
                >
                  <User className={`w-4 h-4 transition-colors duration-200 ${
                    isScrolled ? 'text-gray-600' : 'text-white drop-shadow-md'
                  }`} />
                  <span className={`text-sm font-semibold transition-colors duration-200 ${
                    isScrolled 
                      ? 'text-gray-900' 
                      : 'text-white drop-shadow-md'
                  }`}>
                    Cuenta
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-all duration-200 ${
                    isUserMenuOpen ? 'rotate-180' : ''
                  } ${isScrolled ? 'text-gray-600' : 'text-white drop-shadow-md'}`} />
                </button>

                {/* Auth Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-52 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200/50 py-3 z-50 animate-in slide-in-from-top-2 duration-300">
                    <Link
                      href="/auth/login"
                      className="flex items-center space-x-3 px-5 py-4 text-gray-700 hover:bg-blue-50/80 hover:text-blue-600 transition-all duration-200 hover:translate-x-1 group"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <LogOut className="w-5 h-5 rotate-180 group-hover:scale-110 transition-transform duration-200" />
                      <div className="flex-1">
                        <div className="font-medium group-hover:font-semibold transition-all duration-200">{t('nav.account.login')}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{t('nav.account.loginDesc')}</div>
                      </div>
                    </Link>
                    
                    <hr className="my-2 border-gray-100/70" />
                    
                    <Link
                      href="/auth/register"
                      className="flex items-center space-x-3 px-5 py-4 text-gray-700 hover:bg-green-50/80 hover:text-green-600 transition-all duration-200 hover:translate-x-1 group"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                      <div className="flex-1">
                        <div className="font-medium group-hover:font-semibold transition-all duration-200">{t('nav.account.register')}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{t('nav.account.registerDesc')}</div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Language & Currency Selector Combined */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsLanguageOpen(!isLanguageOpen)
                  setIsCurrencyOpen(false)
                  setIsUserMenuOpen(false)
                }}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 border ${
                  isScrolled 
                    ? 'bg-white hover:bg-gray-50 border-gray-200 text-gray-900 shadow-sm' 
                    : 'bg-white/10 backdrop-blur-md hover:bg-white/20 border-white/20 text-white drop-shadow-lg'
                }`}
                aria-expanded={isLanguageOpen}
                aria-haspopup="true"
              >
                <Globe className={`w-4 h-4 transition-colors duration-200 ${
                  isScrolled ? 'text-gray-600' : 'text-white drop-shadow-md'
                }`} />
                <span className={`text-sm font-semibold transition-colors duration-200 ${
                  isScrolled 
                    ? 'text-gray-900' 
                    : 'text-white drop-shadow-md'
                }`}>
                  {language.toUpperCase()}/{currency}
                </span>
                <ChevronDown className={`w-4 h-4 transition-all duration-200 ${
                  isLanguageOpen ? 'rotate-180' : ''
                } ${isScrolled ? 'text-gray-600' : 'text-white drop-shadow-md'}`} />
              </button>

              {/* Combined Language & Currency Dropdown */}
              {isLanguageOpen && (
                <div className="absolute top-full right-0 mt-2 w-52 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200/50 py-3 z-50 animate-in slide-in-from-top-2 duration-300">
                  {/* Language Section */}
                  <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wide border-b border-gray-100/70 bg-gradient-to-r from-blue-50/30 to-indigo-50/30 mx-2 rounded-lg mb-2">
                    <Globe className="w-3 h-3 inline mr-2" />
                    Idioma
                  </div>
                  <button
                    onClick={() => {
                      setLanguage('es')
                      setIsLanguageOpen(false)
                    }}
                    className={`w-full flex items-center space-x-3 px-5 py-3 text-left hover:bg-blue-50/80 transition-all duration-200 hover:translate-x-1 group ${
                      language === 'es' ? 'bg-blue-50/60 text-blue-600 font-semibold' : 'text-gray-700'
                    }`}
                  >
                    <span className="text-lg group-hover:scale-110 transition-transform duration-200">🇪🇸</span>
                    <span className="font-medium group-hover:font-semibold transition-all duration-200">Español</span>
                    {language === 'es' && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full ml-auto animate-pulse"></div>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('en')
                      setIsLanguageOpen(false)
                    }}
                    className={`w-full flex items-center space-x-3 px-5 py-3 text-left hover:bg-blue-50/80 transition-all duration-200 hover:translate-x-1 group ${
                      language === 'en' ? 'bg-blue-50/60 text-blue-600 font-semibold' : 'text-gray-700'
                    }`}
                  >
                    <span className="text-lg group-hover:scale-110 transition-transform duration-200">🇺🇸</span>
                    <span className="font-medium group-hover:font-semibold transition-all duration-200">English</span>
                    {language === 'en' && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full ml-auto animate-pulse"></div>
                    )}
                  </button>
                  
                  {/* Currency Section */}
                  <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wide border-b border-gray-100/70 bg-gradient-to-r from-green-50/30 to-emerald-50/30 mx-2 rounded-lg mt-3 mb-2">
                    <DollarSign className="w-3 h-3 inline mr-2" />
                    Moneda
                  </div>
                  <button
                    onClick={() => {
                      setCurrency('MXN')
                      setIsLanguageOpen(false)
                    }}
                    className={`w-full flex items-center space-x-3 px-5 py-3 text-left hover:bg-green-50/80 hover:text-green-600 transition-all duration-200 hover:translate-x-1 group ${
                      currency === 'MXN' ? 'bg-green-50/60 text-green-600 font-semibold' : 'text-gray-700'
                    }`}
                  >
                    <span className="text-lg group-hover:scale-110 transition-transform duration-200">🇲🇽</span>
                    <span className="font-medium group-hover:font-semibold transition-all duration-200">Peso Mexicano</span>
                    {currency === 'MXN' && (
                      <div className="w-2 h-2 bg-green-600 rounded-full ml-auto animate-pulse"></div>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setCurrency('USD')
                      setIsLanguageOpen(false)
                    }}
                    className={`w-full flex items-center space-x-3 px-5 py-3 text-left hover:bg-green-50/80 hover:text-green-600 transition-all duration-200 hover:translate-x-1 group ${
                      currency === 'USD' ? 'bg-green-50/60 text-green-600 font-semibold' : 'text-gray-700'
                    }`}
                  >
                    <span className="group-hover:scale-110 transition-transform duration-200 font-semibold text-blue-600 bg-blue-50 px-1 py-0.5 rounded text-xs">US</span>
                    <span className="font-medium group-hover:font-semibold transition-all duration-200">US Dollar</span>
                    {currency === 'USD' && (
                      <div className="w-2 h-2 bg-green-600 rounded-full ml-auto animate-pulse"></div>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className={`lg:hidden p-3 rounded-lg transition-all duration-200 hover:scale-105 ${
              isScrolled 
                ? 'text-gray-900 hover:bg-gray-100 border border-gray-200' 
                : 'text-white hover:bg-white/20 bg-white/10 backdrop-blur-md drop-shadow-lg border border-white/20'
            }`}
            aria-expanded={isMenuOpen}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div 
          ref={mobileMenuRef}
          className="lg:hidden bg-white shadow-xl border-t border-gray-200"
        >
          <div className="px-4 py-6 space-y-6">
            {/* Mobile Navigation Links */}
            <div className="space-y-4">
              <Link 
                href="/"
                className={`block text-lg font-medium transition-colors duration-200 ${
                  isActive('/') ? 'text-blue-600' : 'text-gray-900 hover:text-blue-600'
                }`}
                onClick={closeMenu}
              >
                {t('nav.home')}
              </Link>

              {/* Mobile Services */}
              <div>
                <button
                  onClick={() => setIsServicesOpen(!isServicesOpen)}
                  className={`flex items-center justify-between w-full text-lg font-medium transition-colors duration-200 ${
                    pathname.startsWith('/services') ? 'text-blue-600' : 'text-gray-900 hover:text-blue-600'
                  }`}
                >
                  <span>{t('nav.services')}</span>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${
                    isServicesOpen ? 'rotate-180' : ''
                  }`} />
                </button>
                
                {isServicesOpen && (
                  <div className="mt-3 ml-4 space-y-3">
                    <Link
                      href="/services"
                      className="block text-gray-700 hover:text-blue-600 transition-colors duration-150"
                      onClick={closeMenu}
                    >
                      {t('nav.allServices')}
                    </Link>
                    {services.map((service) => (
                      <Link
                        key={service.href}
                        href={service.href}
                        className="block text-gray-700 hover:text-blue-600 transition-colors duration-150"
                        onClick={closeMenu}
                      >
                        {t(`services.${service.key}.title`)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link 
                href="/about"
                className={`block text-lg font-medium transition-colors duration-200 ${
                  isActive('/about') ? 'text-blue-600' : 'text-gray-900 hover:text-blue-600'
                }`}
                onClick={closeMenu}
              >
                {t('nav.about')}
              </Link>

              <Link 
                href="/contact"
                className={`block text-lg font-medium transition-colors duration-200 ${
                  isActive('/contact') ? 'text-blue-600' : 'text-gray-900 hover:text-blue-600'
                }`}
                onClick={closeMenu}
              >
                {t('nav.contact')}
              </Link>

              <Link 
                href="/quoter"
                className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 border border-blue-500/20"
                onClick={closeMenu}
              >
                {t('nav.quoter')}
              </Link>
            </div>

            {/* Mobile User Section */}
            {session ? (
              <div className="pt-6 border-t border-gray-200 space-y-4">
                <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{session.user.name}</p>
                    <p className="text-sm text-gray-600">{session.user.email}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Link
                    href="/dashboard"
                    onClick={closeMenu}
                    className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 rounded-lg group"
                  >
                    <User className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-medium">Mi Dashboard</span>
                  </Link>
                  
                  {session.user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      onClick={closeMenu}
                      className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all duration-200 rounded-lg group"
                    >
                      <Settings className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                      <span className="font-medium">Admin Panel</span>
                    </Link>
                  )}
                  
                  <button
                    onClick={() => {
                      signOut({ callbackUrl: '/' })
                      closeMenu()
                    }}
                    className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 rounded-lg w-full text-left group"
                  >
                    <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-medium">Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-6 border-t border-gray-200 space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700 font-semibold">Cuenta</span>
                </div>
                
                <div className="space-y-3">
                  <Link
                    href="/auth/login"
                    onClick={closeMenu}
                    className="flex items-center space-x-3 p-4 border-2 border-blue-200 hover:border-blue-300 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-lg transition-all duration-200 group"
                  >
                    <LogOut className="w-5 h-5 rotate-180 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
                    <div className="flex-1">
                      <div className="font-semibold text-blue-700">{t('nav.account.login')}</div>
                      <div className="text-sm text-blue-600">{t('nav.account.loginDesc')}</div>
                    </div>
                  </Link>
                  
                  <Link
                    href="/auth/register"
                    onClick={closeMenu}
                    className="flex items-center space-x-3 p-4 border-2 border-green-200 hover:border-green-300 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-lg transition-all duration-200 group"
                  >
                    <User className="w-5 h-5 text-green-600 group-hover:scale-110 transition-transform duration-200" />
                    <div className="flex-1">
                      <div className="font-semibold text-green-700">{t('nav.account.register')}</div>
                      <div className="text-sm text-green-600">{t('nav.account.registerDesc')}</div>
                    </div>
                  </Link>
                </div>
              </div>
            )}

            {/* Mobile Controls */}
            <div className="pt-6 border-t border-gray-200 space-y-4">
              {/* Mobile Language Selector */}
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700 font-medium">{t('nav.language')}:</span>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'es' | 'en')}
                  className="bg-gray-50 border border-gray-300 rounded-md px-3 py-1 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="es">Español</option>
                  <option value="en">English</option>
                </select>
              </div>

              {/* Mobile Currency Selector */}
              <div className="flex items-center space-x-3">
                <DollarSign className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700 font-medium">{t('nav.currency')}:</span>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as 'MXN' | 'USD')}
                  className="bg-gray-50 border border-gray-300 rounded-md px-3 py-1 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="MXN">MXN (Pesos)</option>
                  <option value="USD">USD (Dollars)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
