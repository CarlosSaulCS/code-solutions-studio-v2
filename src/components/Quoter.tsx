'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useSession } from 'next-auth/react'
import { useLanguage } from '@/app/providers'
import { useCurrency } from '@/app/providers'
import { 
  Calculator, Plus, Minus, Check, ArrowRight, Sparkles, Clock, Zap, 
  Send, User, Mail, Phone, Building, FileText, Info, CheckCircle2,
  Globe, Smartphone, ShoppingCart, Cloud, Brain, Settings, Star,
  Shield, TrendingUp, Award, Users, LogIn
} from 'lucide-react'
import { useToast } from '@/hooks/useToast'
import ToastContainer from '@/components/ToastContainer'
import { ButtonLoading } from '@/components/LoadingSpinner'
import Link from 'next/link'

interface ServiceOption {
  id: string
  name: string
  basePrice: number
  description: string
  features: string[]
  timeline: string
  complexity: 'basic' | 'intermediate' | 'advanced'
  included: string[]
  optional: string[]
}

interface QuoteOption {
  id: string
  name: string
  price: number
  description: string
  category: string
}

interface ContactInfo {
  name: string
  email: string
  phone: string
  company: string
  message: string
}

const serviceOptions: Record<string, ServiceOption[]> = {
  web: [
    {
      id: 'startup',
      name: 'Startup',
      basePrice: 25000,
      description: 'Sitio web profesional perfecto para emprendedores',
      features: ['Hasta 8 páginas', 'Diseño responsivo', 'SEO optimizado', 'Formulario de contacto', 'Analytics incluido'],
      timeline: '3-4 semanas',
      complexity: 'basic',
      included: ['Diseño personalizado', 'Optimización móvil', 'Dominio por 1 año', 'SSL gratuito', 'Google Analytics'],
      optional: ['Blog', 'Galería de imágenes', 'Integración redes sociales', 'Chat en vivo']
    },
    {
      id: 'business',
      name: 'Business',
      basePrice: 45000,
      description: 'Sitio web dinámico con CMS y funcionalidades empresariales',
      features: ['Hasta 20 páginas', 'CMS integrado', 'SEO avanzado', 'Blog', 'Panel admin', 'E-commerce básico'],
      timeline: '5-7 semanas',
      complexity: 'intermediate',
      included: ['Panel de administración', 'Blog integrado', 'Google Analytics', 'Optimización SEO', 'Backup automático'],
      optional: ['E-commerce avanzado', 'Múltiples idiomas', 'Chat en vivo', 'Newsletter', 'API integrations']
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      basePrice: 85000,
      description: 'Sitio web completo con funcionalidades empresariales avanzadas',
      features: ['Páginas ilimitadas', 'E-commerce completo', 'Múltiples idiomas', 'Integración de APIs', 'Soporte 24/7'],
      timeline: '8-12 semanas',
      complexity: 'advanced',
      included: ['Tienda online completa', 'Sistema multi-idioma', 'Integraciones API', 'Soporte prioritario', 'CDN global'],
      optional: ['App móvil complementaria', 'IA personalizada', 'Automatización avanzada', 'CRM integrado']
    },
    {
      id: 'custom',
      name: 'Personalizado',
      basePrice: 150000,
      description: 'Solución empresarial completa con arquitectura escalable',
      features: ['Arquitectura personalizada', 'Microservicios', 'Alta disponibilidad', 'DevOps integrado', 'Monitoreo 24/7'],
      timeline: '12-20 semanas',
      complexity: 'advanced',
      included: ['Infraestructura cloud', 'CI/CD pipeline', 'Monitoreo avanzado', 'Backup enterprise', 'Soporte dedicado'],
      optional: ['Multi-región', 'Disaster recovery', 'Compliance avanzado', 'White label']
    }
  ],
  mobile: [
    {
      id: 'startup',
      name: 'Startup',
      basePrice: 40000,
      description: 'Aplicación móvil híbrida con funcionalidades esenciales',
      features: ['Una plataforma (iOS o Android)', 'Funcionalidades core', 'UI/UX profesional', 'Testing básico'],
      timeline: '6-8 semanas',
      complexity: 'intermediate',
      included: ['Desarrollo híbrido', 'Publicación en tienda', 'Testing en dispositivos', 'Documentación básica'],
      optional: ['Segunda plataforma', 'Push notifications', 'Analytics', 'Backend API']
    },
    {
      id: 'business',
      name: 'Business',
      basePrice: 75000,
      description: 'Aplicación móvil nativa de alto rendimiento',
      features: ['Una plataforma (iOS o Android)', 'Rendimiento óptimo', 'Acceso completo al hardware', 'Publicación en tienda'],
      timeline: '10-14 semanas',
      complexity: 'advanced',
      included: ['Desarrollo nativo', 'Publicación en App Store/Play Store', 'Testing en dispositivos reales', 'Documentación técnica'],
      optional: ['Push notifications', 'Integración con APIs', 'Analytics avanzado', 'Modo offline']
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      basePrice: 150000,
      description: 'App multiplataforma con código compartido',
      features: ['iOS y Android', 'Desarrollo eficiente', 'Código compartido', 'UI nativa'],
      timeline: '12-18 semanas',
      complexity: 'advanced',
      included: ['Desarrollo React Native/Flutter', 'Publicación en ambas tiendas', 'UI adaptativa', 'Testing automatizado'],
      optional: ['Sincronización offline', 'Geolocalización', 'Cámara integrada', 'Biometría']
    },
    {
      id: 'custom',
      name: 'Personalizado',
      basePrice: 300000,
      description: 'Aplicación empresarial completa con backend robusto',
      features: ['Multiplataforma', 'Backend escalable', 'Seguridad avanzada', 'Integración enterprise'],
      timeline: '20-30 semanas',
      complexity: 'advanced',
      included: ['App completa + Backend', 'Autenticación segura', 'APIs empresariales', 'Monitoreo avanzado'],
      optional: ['Integraciones ERP/CRM', 'Analytics enterprise', 'Multi-tenant', 'White label']
    }
  ],
  ecommerce: [
    {
      id: 'startup',
      name: 'Startup',
      basePrice: 35000,
      description: 'Tienda online completa para emprendedores',
      features: ['Hasta 100 productos', 'Pagos básicos', 'Inventario simple', 'Panel básico', 'SSL incluido'],
      timeline: '4-6 semanas',
      complexity: 'basic',
      included: ['Catálogo básico', 'Carrito de compras', 'Pasarela de pagos', 'Gestión básica', 'SSL incluido'],
      optional: ['Múltiples métodos de pago', 'Cupones básicos', 'Sistema de reviews', 'Newsletter']
    },
    {
      id: 'business',
      name: 'Business',
      basePrice: 65000,
      description: 'Tienda online avanzada para pequeños y medianos negocios',
      features: ['Hasta 500 productos', 'Pagos seguros', 'Inventario avanzado', 'Panel administrativo', 'Analytics'],
      timeline: '6-10 semanas',
      complexity: 'intermediate',
      included: ['Catálogo de productos', 'Carrito de compras', 'Pasarela de pagos', 'Gestión de pedidos', 'Facturación'],
      optional: ['Múltiples métodos de pago', 'Cupones de descuento', 'Sistema de reviews', 'Wishlist']
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      basePrice: 125000,
      description: 'Plataforma e-commerce empresarial completa',
      features: ['Productos ilimitados', 'Múltiples pasarelas', 'Gestión avanzada', 'Reportes detallados', 'Multi-vendor'],
      timeline: '12-16 semanas',
      complexity: 'advanced',
      included: ['Sistema multi-vendedor', 'Análisis de ventas', 'CRM integrado', 'Marketing automation', 'API completa'],
      optional: ['IA para recomendaciones', 'App móvil', 'Integración con marketplaces', 'B2B features']
    },
    {
      id: 'custom',
      name: 'Personalizado',
      basePrice: 250000,
      description: 'Solución e-commerce completa con marketplace',
      features: ['Marketplace completo', 'Multi-tenant', 'Escalabilidad enterprise', 'Integraciones avanzadas'],
      timeline: '20-30 semanas',
      complexity: 'advanced',
      included: ['Plataforma marketplace', 'Multi-vendedor', 'API completa', 'Analytics avanzado', 'Soporte 24/7'],
      optional: ['White label', 'Integraciones ERP', 'IA avanzada', 'Blockchain payments']
    }
  ],
  cloud: [
    {
      id: 'startup',
      name: 'Startup',
      basePrice: 30000,
      description: 'Migración básica y segura a la nube',
      features: ['Análisis de infraestructura', 'Migración de datos', 'Configuración optimizada', 'Documentación completa'],
      timeline: '4-6 semanas',
      complexity: 'intermediate',
      included: ['Plan de migración', 'Transferencia de datos', 'Configuración inicial', 'Pruebas de rendimiento', 'Capacitación'],
      optional: ['Optimización de costos', 'Automatización', 'Monitoreo avanzado', 'Disaster recovery']
    },
    {
      id: 'business',
      name: 'Business',
      basePrice: 60000,
      description: 'Infraestructura cloud optimizada y escalable',
      features: ['Auto-scaling', 'Load balancing', 'Monitoring 24/7', 'Backup automático', 'Multi-región'],
      timeline: '6-10 semanas',
      complexity: 'advanced',
      included: ['Arquitectura escalable', 'Monitoreo 24/7', 'Backup automatizado', 'Optimización de costos', 'SLA garantizado'],
      optional: ['Multi-región', 'Disaster recovery', 'Compliance avanzado', 'DevOps pipeline']
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      basePrice: 120000,
      description: 'Solución cloud empresarial completa',
      features: ['Arquitectura enterprise', 'Alta disponibilidad', 'Disaster recovery', 'Compliance', 'DevOps avanzado'],
      timeline: '12-18 semanas',
      complexity: 'advanced',
      included: ['Infraestructura enterprise', 'Alta disponibilidad', 'Disaster recovery', 'Compliance', 'Soporte 24/7'],
      optional: ['Multi-cloud', 'Edge computing', 'Advanced security', 'Custom automation']
    },
    {
      id: 'custom',
      name: 'Personalizado',
      basePrice: 200000,
      description: 'Solución cloud híbrida y personalizada',
      features: ['Multi-cloud híbrido', 'Kubernetes', 'Microservicios', 'Edge computing', 'AI/ML pipeline'],
      timeline: '16-24 semanas',
      complexity: 'advanced',
      included: ['Arquitectura híbrida', 'Orquestación avanzada', 'Pipeline CI/CD', 'Monitoreo inteligente', 'Consultoría continua'],
      optional: ['Quantum computing ready', 'Blockchain integration', 'IoT connectivity', 'Advanced analytics']
    }
  ],
  ai: [
    {
      id: 'startup',
      name: 'Startup',
      basePrice: 50000,
      description: 'Chatbot inteligente con procesamiento de lenguaje natural',
      features: ['NLP básico', 'Integración web', 'Entrenamiento personalizado', 'Dashboard básico'],
      timeline: '6-10 semanas',
      complexity: 'intermediate',
      included: ['Entrenamiento personalizado', 'Integración web/móvil', 'Dashboard de métricas', 'API básica'],
      optional: ['Análisis de sentimientos', 'Múltiples idiomas', 'Integración con CRM', 'Voice recognition']
    },
    {
      id: 'business',
      name: 'Business',
      basePrice: 100000,
      description: 'Chatbot IA avanzado con múltiples canales',
      features: ['NLP avanzado', 'Integración múltiple', 'Aprendizaje continuo', 'Múltiples canales', 'Analytics'],
      timeline: '10-16 semanas',
      complexity: 'advanced',
      included: ['IA conversacional avanzada', 'Múltiples canales', 'Analytics avanzado', 'API personalizada', 'Capacitación'],
      optional: ['Computer vision', 'Análisis predictivo', 'Integración enterprise', 'Voice AI']
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      basePrice: 200000,
      description: 'Sistema de automatización empresarial con IA',
      features: ['Machine Learning', 'Análisis predictivo', 'Automatización de procesos', 'Reportes inteligentes'],
      timeline: '16-24 semanas',
      complexity: 'advanced',
      included: ['Modelos ML personalizados', 'Pipeline de datos', 'Dashboard ejecutivo', 'ROI tracking'],
      optional: ['Computer Vision', 'Análisis en tiempo real', 'API personalizada', 'Edge computing']
    },
    {
      id: 'custom',
      name: 'Personalizado',
      basePrice: 400000,
      description: 'Solución IA personalizada con modelos propietarios',
      features: ['Deep Learning', 'Modelos propietarios', 'Research & Development', 'Implementación enterprise'],
      timeline: '24-40 semanas',
      complexity: 'advanced',
      included: ['Investigación y desarrollo', 'Modelos propietarios', 'Infraestructura IA', 'Soporte científico'],
      optional: ['Quantum ML', 'Research papers', 'Patent assistance', 'Custom hardware']
    }
  ],
  consulting: [
    {
      id: 'startup',
      name: 'Startup',
      basePrice: 20000,
      description: 'Auditoría completa de infraestructura y sistemas',
      features: ['Análisis de seguridad', 'Evaluación de rendimiento', 'Recomendaciones', 'Roadmap tecnológico'],
      timeline: '2-4 semanas',
      complexity: 'basic',
      included: ['Reporte detallado', 'Presentación ejecutiva', 'Plan de acción', 'Seguimiento 3 meses'],
      optional: ['Auditoría de código', 'Análisis de vulnerabilidades', 'Benchmarking', 'Compliance review']
    },
    {
      id: 'business',
      name: 'Business',
      basePrice: 40000,
      description: 'Consultoría estratégica para transformación digital',
      features: ['Roadmap tecnológico', 'Análisis de ROI', 'Capacitación del equipo', 'Seguimiento trimestral'],
      timeline: '4-8 semanas',
      complexity: 'intermediate',
      included: ['Estrategia digital', 'Plan de transformación', 'KPIs y métricas', 'Workshops ejecutivos'],
      optional: ['Change management', 'Mentoring técnico', 'Revisiones mensuales', 'Innovation lab']
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      basePrice: 80000,
      description: 'Consultoría enterprise con arquitectura tecnológica',
      features: ['Arquitectura enterprise', 'Governance TI', 'Digital transformation', 'Change management'],
      timeline: '8-16 semanas',
      complexity: 'advanced',
      included: ['Arquitectura tecnológica', 'Governance framework', 'Roadmap ejecutivo', 'Change management'],
      optional: ['CTO as a Service', 'Innovation lab', 'Venture building', 'Technology scouting']
    },
    {
      id: 'custom',
      name: 'Personalizado',
      basePrice: 150000,
      description: 'CTO as a Service y consultoría estratégica continua',
      features: ['CTO as a Service', 'Estrategia continua', 'Innovation lab', 'Venture building'],
      timeline: '16-52 semanas',
      complexity: 'advanced',
      included: ['CTO dedicado', 'Estrategia continua', 'Team building', 'Innovation pipeline'],
      optional: ['Board advisory', 'Fundraising support', 'M&A technical DD', 'Patent strategy']
    }
  ]
}

const additionalOptions: QuoteOption[] = [
  { id: 'hosting', name: '', price: 8000, description: '', category: 'infrastructure' },
  { id: 'maintenance', name: '', price: 12000, description: '', category: 'support' },
  { id: 'training', name: '', price: 5000, description: '', category: 'training' },
  { id: 'seo', name: '', price: 10000, description: '', category: 'marketing' },
  { id: 'analytics', name: '', price: 6000, description: '', category: 'analytics' },
  { id: 'security', name: '', price: 15000, description: '', category: 'security' },
  { id: 'performance', name: '', price: 8000, description: '', category: 'optimization' },
  { id: 'backup', name: '', price: 4000, description: '', category: 'infrastructure' }
]

const serviceIcons = {
  web: Globe,
  mobile: Smartphone,
  ecommerce: ShoppingCart,
  cloud: Cloud,
  ai: Brain,
  consulting: Settings
}

const complexityColors = {
  basic: 'text-blue-600 bg-blue-100',
  intermediate: 'text-cyan-600 bg-cyan-100',
  advanced: 'text-indigo-600 bg-indigo-100'
}

export default function Quoter() {
  const { t, language } = useLanguage()
  const { currency, convertPrice } = useCurrency()
  const { data: session } = useSession()
  const { success, error: showError, warning } = useToast()
  
  // State management
  const [selectedService, setSelectedService] = useState<string>('')
  const [selectedOption, setSelectedOption] = useState<string>('')
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])
  const [timeline, setTimeline] = useState<number>(30)
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const [isCalculating, setIsCalculating] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showContactForm, setShowContactForm] = useState<boolean>(false)
  const [showSuccess, setShowSuccess] = useState<boolean>(false)
  const [quoteResult, setQuoteResult] = useState<any>(null)
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  })

  // Auto-fill contact info for authenticated users
  useEffect(() => {
    if (session?.user) {
      setContactInfo({
        name: session.user.name || '',
        email: session.user.email || '',
        phone: session.user.phone || '',
        company: session.user.company || '',
        message: ''
      })
    }
  }, [session])

  // Memoized service data
  const currentServiceOptions = useMemo(() => {
    return selectedService ? serviceOptions[selectedService] : []
  }, [selectedService])

  const currentOption = useMemo(() => {
    return currentServiceOptions.find(opt => opt.id === selectedOption)
  }, [currentServiceOptions, selectedOption])

  const formatPrice = (price: number) => {
    const converted = convertPrice(price)
    return currency === 'USD' 
      ? `$${Math.round(converted).toLocaleString()} USD`
      : `$${Math.round(converted).toLocaleString()} MXN`
  }
  // Helper function to get translated service names
  const getServiceName = (serviceKey: string) => {
    const serviceNames: Record<string, string> = {
      web: t('services.web.title'),
      mobile: t('services.mobile.title'),
      ecommerce: t('services.ecommerce.title'),
      cloud: t('services.cloud.title'),
      ai: t('services.ai.title'),
      consulting: t('services.consulting.title')
    }
    return serviceNames[serviceKey] || serviceKey
  }

  // Helper function to get translated service option data
  const getServiceOptionData = (serviceKey: string, optionId: string) => {
    const key = `service.${serviceKey}.${optionId}`
    return {
      name: t(`${key}.name`),
      description: t(`${key}.description`),
      timeline: t(`${key}.timeline`)
    }
  }

  // Helper function to get translated addon data
  const getAddonData = (addonId: string) => {
    return {
      name: t(`addons.${addonId}.name`),
      description: t(`addons.${addonId}.description`)
    }
  }

  // Helper function to get translated complexity level
  const getComplexityLabel = (complexity: 'basic' | 'intermediate' | 'advanced') => {
    return t(`quoter.complexity.${complexity}`)
  }

  // Optimized price calculation
  const calculateTotal = useCallback(() => {
    setIsCalculating(true)
    
    let total = 0
    
    // Base service price
    if (currentOption) {
      total += currentOption.basePrice
    }
    
    // Addon prices
    selectedAddons.forEach(addonId => {
      const addon = additionalOptions.find(opt => opt.id === addonId)
      if (addon) {
        total += addon.price
      }
    })

    // Timeline adjustments
    if (timeline < 14) {
      total *= 1.3 // Rush fee
    } else if (timeline > 60) {
      total *= 0.9 // Extended timeline discount
    }

    setTimeout(() => {
      setTotalPrice(total)
      setIsCalculating(false)
    }, 300)
  }, [currentOption, selectedAddons, timeline])

  // Effects
  useEffect(() => {
    if (selectedOption) {
      calculateTotal()
    }
  }, [selectedOption, selectedAddons, timeline, calculateTotal])

  const handleServiceSelect = (service: string) => {
    setSelectedService(service)
    setSelectedOption('')
    setSelectedAddons([])
  }

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId)
  }

  const toggleAddon = (addonId: string) => {
    setSelectedAddons(prev => 
      prev.includes(addonId) 
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    )
  }

  const handleSendQuote = async () => {
    setIsLoading(true)
    
    try {
      const quoteData = {
        service: selectedService,
        option: selectedOption,
        addons: selectedAddons,
        timeline,
        totalPrice,
        contactInfo,
        currency
      }

      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quoteData),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        // Store quote result for success modal
        setQuoteResult(result)
        
        // Show success modal instead of toast
        setShowContactForm(false)
        setShowSuccess(true)
        
        // Don't reset the form here - let user choose in success modal
      } else {
        showError(t('quoter.notifications.error.title'), result.error || 'Error desconocido')
      }
    } catch (error) {
      console.error('Error:', error)
      showError(t('quoter.notifications.connection.title'), t('quoter.notifications.connection.message'))
    } finally {
      setIsLoading(false)
    }
  }

  // Reset/restart quoter
  const restartQuoter = () => {
    setSelectedService('')
    setSelectedOption('')
    setSelectedAddons([])
    setTimeline(30)
    setTotalPrice(0)
    setShowContactForm(false)
    setShowSuccess(false)
    setQuoteResult(null)
    setContactInfo({
      name: '',
      email: '',
      phone: '',
      company: '',
      message: ''
    })
  }

  // Progress tracking
  const quoterProgress = useMemo(() => {
    let step = 0
    const totalSteps = 3

    if (selectedService) step++
    if (selectedOption) step++
    if (showContactForm) step++

    return { currentStep: step, totalSteps }
  }, [selectedService, selectedOption, showContactForm])

  // Success Modal - similar to ContactForm
  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12 text-center max-w-md w-full">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            ¡Cotización Enviada!
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Gracias por solicitar una cotización. Hemos recibido tu solicitud y te contactaremos pronto con los detalles.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Servicio:</strong> {getServiceName(selectedService)}
            </p>
            {currentOption && (
              <p className="text-sm text-gray-600 mb-2">
                <strong>Plan:</strong> {getServiceOptionData(selectedService, currentOption.id).name}
              </p>
            )}
            <p className="text-sm text-gray-600">
              <strong>Total Estimado:</strong> {formatPrice(totalPrice)}
            </p>
          </div>
          <button
            onClick={restartQuoter}
            className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-105"
          >
            Solicitar Nueva Cotización
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-white py-32 lg:py-40">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">          <div className="flex items-center justify-center mb-6">
            <Calculator className="w-8 h-8 text-primary-600 mr-3" />
            <h1 className="text-4xl font-bold text-secondary-900">
              {t('quoter.title')}
            </h1>
          </div>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            {t('quoter.subtitle')}
          </p></div>

        {/* Progress Bar */}
        {quoterProgress.currentStep > 0 && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-gray-700">
                  Paso {quoterProgress.currentStep} de {quoterProgress.totalSteps}
                </span>
                <span className="text-sm font-medium text-blue-600">
                  {Math.round((quoterProgress.currentStep / quoterProgress.totalSteps) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${(quoterProgress.currentStep / quoterProgress.totalSteps) * 100}%` 
                  }}
                />
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-5 lg:grid-cols-1 gap-6">
            {/* Service Selection */}
            <div className="xl:col-span-3 lg:col-span-1 space-y-6">
              {/* Services Grid */}
              <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8">                <h2 className="text-2xl font-bold text-secondary-900 mb-6 flex items-center">
                  <Sparkles className="w-6 h-6 text-primary-600 mr-3" />
                  {t('quoter.services.title')}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(serviceOptions).map(([key, options]) => {
                    const IconComponent = serviceIcons[key as keyof typeof serviceIcons]
                    const isSelected = selectedService === key
                    
                    return (
                      <button
                        key={key}
                        onClick={() => handleServiceSelect(key)}
                        className={`p-6 rounded-xl border-2 transition-all duration-300 text-left hover:shadow-lg ${
                          isSelected 
                            ? 'border-primary-500 bg-primary-50 shadow-lg' 
                            : 'border-secondary-200 hover:border-primary-300'
                        }`}
                      >
                        <div className="flex items-center mb-3">
                          <IconComponent className={`w-8 h-8 mr-3 ${
                            isSelected ? 'text-primary-600' : 'text-secondary-600'
                          }`} />                          <h3 className="text-lg font-semibold text-secondary-900">
                            {getServiceName(key)}
                          </h3>
                        </div>                        <p className="text-secondary-600 text-sm">
                          {options.length} {t('quoter.interface.availableOptions')} • {t('quoter.interface.from')} {formatPrice(Math.min(...options.map(o => o.basePrice)))}
                        </p>
                        {isSelected && (
                          <div className="mt-3 flex items-center text-primary-600">
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            <span className="text-sm font-medium">{t('quoter.interface.selected')}</span>
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Service Options */}
              {selectedService && (
                <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8">
                  <h2 className="text-2xl font-bold text-secondary-900 mb-6 flex items-center">
                    <Zap className="w-6 h-6 text-primary-600 mr-3" />
                    {t('quoter.options.title')} - {getServiceName(selectedService)}
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {currentServiceOptions.map((option) => {
                      const translatedData = getServiceOptionData(selectedService, option.id)
                      return (
                        <div
                          key={option.id}
                          className={`border-2 rounded-xl p-4 transition-all duration-300 cursor-pointer hover:scale-105 min-h-[300px] ${
                            selectedOption === option.id
                              ? 'border-primary-500 bg-primary-50 shadow-lg'
                              : 'border-secondary-200 hover:border-primary-300 hover:shadow-md'
                          }`}
                          onClick={() => handleOptionSelect(option.id)}
                        >
                          <div className="flex flex-col mb-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center">
                                <h3 className="text-lg font-bold text-secondary-900 mr-3">
                                  {translatedData.name}
                                </h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${complexityColors[option.complexity]}`}>
                                  {getComplexityLabel(option.complexity)}
                                </span>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-primary-600">
                                  {formatPrice(option.basePrice)}
                                </div>
                                <div className="text-xs text-secondary-500">{t('quoter.interface.basePrice')}</div>
                              </div>
                            </div>
                            <p className="text-secondary-600 mb-3 leading-relaxed text-sm">{translatedData.description}</p>
                            <div className="flex items-center text-sm text-secondary-500">
                              <Clock className="w-4 h-4 mr-2" />
                              <span>{t('quoter.interface.estimatedTime')} {translatedData.timeline}</span>
                            </div>
                          </div>

                          {/* Features */}
                          <div className="grid grid-cols-1 gap-4 mb-4">
                            <div>
                              <h4 className="font-semibold text-secondary-900 mb-2 flex items-center">
                                <CheckCircle2 className="w-4 h-4 text-blue-600 mr-2" />
                                {t('quoter.interface.included')}
                              </h4>
                              <ul className="space-y-1">
                                {option.included.slice(0, 4).map((item, idx) => (
                                  <li key={idx} className="text-sm text-secondary-600 flex items-center">
                                    <Check className="w-3 h-3 text-blue-600 mr-2 flex-shrink-0" />
                                    {item}
                                  </li>
                                ))}
                                {option.included.length > 4 && (
                                  <li className="text-sm text-primary-600 font-medium">
                                    +{option.included.length - 4} características más
                                  </li>
                                )}
                              </ul>
                            </div>
                          </div>

                          {selectedOption === option.id && (
                            <div className="mt-4 p-4 bg-primary-50 rounded-lg border border-primary-200">
                              <div className="flex items-center text-primary-700">
                                <Star className="w-4 h-4 mr-2" />
                                <span className="font-medium">{t('quoter.interface.selectedOption')}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Additional Services */}
              {selectedOption && (
                <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8">
                  <h2 className="text-2xl font-bold text-secondary-900 mb-6 flex items-center">
                    <Plus className="w-6 h-6 text-primary-600 mr-3" />
                    {t('quoter.addons.title')}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {additionalOptions.map((addon) => {
                      const addonData = getAddonData(addon.id)
                      return (
                        <div
                          key={addon.id}
                          onClick={() => toggleAddon(addon.id)}
                          className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                            selectedAddons.includes(addon.id)
                              ? 'border-primary-500 bg-primary-50 shadow-lg'
                              : 'border-secondary-200 hover:border-primary-300 hover:shadow-md'
                          }`}
                        >
                          <div className="flex flex-col h-full">
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-3">
                                <h4 className="text-lg font-bold text-secondary-900 leading-tight">
                                  {addonData.name}
                                </h4>
                                <div className="ml-3 flex-shrink-0">
                                  {selectedAddons.includes(addon.id) ? (
                                    <CheckCircle2 className="w-6 h-6 text-primary-600" />
                                  ) : (
                                    <Plus className="w-6 h-6 text-secondary-400" />
                                  )}
                                </div>
                              </div>
                              <p className="text-secondary-600 mb-4 leading-relaxed text-sm">
                                {addonData.description}
                              </p>
                            </div>
                            <div className="border-t border-secondary-100 pt-4">
                              <div className="flex items-center justify-between">
                                <div className="text-xl font-bold text-primary-600">
                                  {formatPrice(addon.price)}
                                </div>
                                <div className="text-sm text-secondary-500">
                                  {selectedAddons.includes(addon.id) ? 'Incluido' : 'Agregar'}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Timeline Selector */}
              {selectedOption && (
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-bold text-secondary-900 mb-6 flex items-center">
                    <Clock className="w-6 h-6 text-primary-600 mr-3" />
                    {t('quoter.timeline.title')}
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">                      <span className="text-secondary-900 font-medium">{t('quoter.interface.deliveryDays')}</span>
                      <span className="text-2xl font-bold text-primary-600">{timeline} {t('quoter.timeline.days')}</span>
                    </div>
                    
                    <input
                      type="range"
                      min="7"
                      max="120"
                      value={timeline}
                      onChange={(e) => setTimeline(Number(e.target.value))}
                      className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    
                    <div className="flex justify-between text-sm text-secondary-500">                      <span>7 {t('quoter.timeline.days')} ({t('quoter.timeline.urgent')})</span>
                      <span>30 {t('quoter.timeline.days')} ({t('quoter.interface.standard')})</span>
                      <span>120 {t('quoter.timeline.days')} ({t('quoter.timeline.extended')})</span>
                    </div>
                    
                    {timeline < 14 && (                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                        <div className="flex items-center text-slate-800">
                          <Info className="w-5 h-5 mr-2" />
                          <span className="font-medium">{t('quoter.interface.urgentNotice')}</span>
                        </div>
                      </div>
                    )}
                    
                    {timeline > 60 && (                      <div className="p-4 bg-cyan-50 border border-cyan-200 rounded-lg">
                        <div className="flex items-center text-cyan-800">
                          <TrendingUp className="w-5 h-5 mr-2" />
                          <span className="font-medium">{t('quoter.interface.extendedNotice')}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Price Summary */}
            <div className="xl:col-span-2 lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 sticky top-8 max-h-screen overflow-y-auto">                <h2 className="text-xl lg:text-2xl font-bold text-secondary-900 mb-4 lg:mb-6 flex items-center">
                  <Calculator className="w-5 h-5 lg:w-6 lg:h-6 text-primary-600 mr-2 lg:mr-3" />
                  {t('quoter.interface.summary')}
                </h2>

                {!selectedService && (
                  <div className="text-center py-8">
                    <Sparkles className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
                    <p className="text-secondary-500">{t('quoter.interface.selectService')}</p>
                  </div>
                )}

                {selectedService && !selectedOption && (
                  <div className="text-center py-8">
                    <Zap className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
                    <p className="text-secondary-500">{t('quoter.interface.selectOption')}</p>
                  </div>
                )}

                {selectedOption && (
                  <div className="space-y-6">
                    {/* Service Info */}
                    <div className="p-4 bg-secondary-50 rounded-lg">                      <h3 className="font-semibold text-secondary-900 mb-2">
                        {getServiceName(selectedService)} - {currentOption && getServiceOptionData(selectedService, currentOption.id).name}
                      </h3>
                      <p className="text-sm text-secondary-600">{currentOption && getServiceOptionData(selectedService, currentOption.id).description}</p>
                    </div>

                    {/* Price Breakdown */}
                    <div className="space-y-3">                      <div className="flex justify-between items-center">
                        <span className="text-secondary-700">{t('quoter.interface.baseService')}</span>
                        <span className="font-semibold">{formatPrice(currentOption?.basePrice || 0)}</span>
                      </div>

                      {selectedAddons.length > 0 && (
                        <>
                          <div className="text-sm text-secondary-600 font-medium">{t('quoter.interface.additionalServices')}</div>
                          {selectedAddons.map(addonId => {
                            const addon = additionalOptions.find(opt => opt.id === addonId)
                            const addonData = addon ? getAddonData(addon.id) : null
                            return addon && addonData ? (
                              <div key={addonId} className="flex justify-between items-center text-sm pl-4">
                                <span className="text-secondary-600">• {addonData.name}</span>
                                <span className="font-medium">{formatPrice(addon.price)}</span>
                              </div>
                            ) : null
                          })}
                        </>
                      )}

                      {timeline < 14 && (
                        <div className="flex justify-between items-center text-slate-700">
                          <span>{t('quoter.interface.rushCharge')}</span>
                          <span className="font-semibold">+{formatPrice((currentOption?.basePrice || 0) * 0.3)}</span>
                        </div>
                      )}

                      {timeline > 60 && (
                        <div className="flex justify-between items-center text-cyan-700">
                          <span>{t('quoter.interface.extendedDiscount')}</span>
                          <span className="font-semibold">-{formatPrice((currentOption?.basePrice || 0) * 0.1)}</span>
                        </div>
                      )}

                      <hr className="border-secondary-200" />
                      
                      <div className="flex justify-between items-center text-lg">                        <span className="font-bold text-secondary-900">{t('quoter.summary.total')}:</span>
                        <span className="font-bold text-2xl text-primary-600">
                          {isCalculating ? (
                            <div className="animate-pulse">{t('quoter.summary.calculating')}</div>
                          ) : (
                            formatPrice(totalPrice)
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Timeline Info */}
                    <div className="p-4 bg-primary-50 rounded-lg">
                      <div className="flex items-center text-primary-700 mb-2">
                        <Clock className="w-4 h-4 mr-2" />
                        <span className="font-medium">{t('quoter.delivery.title')}</span>
                      </div>
                      <p className="text-primary-600">{timeline} {t('quoter.delivery.days')}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <button
                        onClick={() => setShowContactForm(true)}
                        disabled={isLoading || isCalculating}
                        className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 disabled:from-secondary-300 disabled:to-secondary-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group"
                      >
                        <Send className="w-5 h-5" />
                        Solicitar Cotización Oficial
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>                    {/* Benefits */}
                    <div className="space-y-3 pt-4">                      <div className="flex items-center text-blue-600">
                        <Shield className="w-4 h-4 mr-2" />                        <span className="text-sm">{t('quoter.benefits.guarantee')}</span>
                      </div>
                      <div className="flex items-center text-blue-600">
                        <Users className="w-4 h-4 mr-2" />
                        <span className="text-sm">{t('quoter.benefits.support')}</span>
                      </div>
                      <div className="flex items-center text-blue-600">
                        <Award className="w-4 h-4 mr-2" />
                        <span className="text-sm">{t('quoter.benefits.quality')}</span>
                      </div>
                    </div>

                    {/* Restart Button */}
                    <div className="pt-4 border-t border-secondary-200">
                      <button
                        onClick={restartQuoter}
                        className="w-full text-secondary-600 hover:text-secondary-800 text-sm font-medium py-2 px-4 rounded-lg hover:bg-secondary-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <ArrowRight className="w-4 h-4 rotate-180" />
                        {t('quoter.actions.restart')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Modal */}
        {showContactForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-secondary-900 mb-6 flex items-center">
                  <Send className="w-6 h-6 text-primary-600 mr-3" />
                  {session ? 'Confirmar Cotización' : t('quoter.contact.title')}
                </h3>

                {/* User Authentication Status */}
                {session ? (
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center text-blue-700 mb-2">
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      <span className="font-medium">Sesión activa</span>
                    </div>
                    <p className="text-sm text-blue-600">
                      Tu cotización se guardará automáticamente en tu portal de cliente
                    </p>
                  </div>
                ) : (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          ¿Tienes cuenta?
                        </p>
                        <p className="text-xs text-gray-600">
                          Inicia sesión para un seguimiento mejor
                        </p>
                      </div>
                      <Link
                        href="/auth/login"
                        className="inline-flex items-center px-3 py-1 text-xs font-medium text-primary-600 hover:text-primary-700 border border-primary-300 rounded-lg hover:bg-primary-50 transition-colors"
                      >
                        <LogIn className="w-3 h-3 mr-1" />
                        Iniciar Sesión
                      </Link>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      {t('quoter.contact.name')} {t('quoter.interface.required')}
                    </label>
                    <input
                      type="text"
                      required
                      value={contactInfo.name}
                      onChange={(e) => setContactInfo({...contactInfo, name: e.target.value})}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder={t('quoter.placeholders.name')}
                      disabled={!!session?.user.name}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      {t('quoter.contact.email')} {t('quoter.interface.required')}
                    </label>
                    <input
                      type="email"
                      required
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder={t('quoter.placeholders.email')}
                      disabled={!!session?.user.email}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      {t('quoter.contact.phone')}
                    </label>
                    <input
                      type="tel"
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder={t('quoter.placeholders.phone')}
                      disabled={!!session?.user.phone}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      {t('quoter.contact.company')}
                    </label>
                    <input
                      type="text"
                      value={contactInfo.company}
                      onChange={(e) => setContactInfo({...contactInfo, company: e.target.value})}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder={t('quoter.placeholders.company')}
                      disabled={!!session?.user.company}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      {t('quoter.contact.message')}
                    </label>
                    <textarea
                      rows={4}
                      value={contactInfo.message}
                      onChange={(e) => setContactInfo({...contactInfo, message: e.target.value})}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder={t('quoter.placeholders.message')}
                    />
                  </div>

                  {/* Quote Summary */}
                  <div className="p-4 bg-secondary-50 rounded-lg">
                    <h4 className="font-semibold text-secondary-900 mb-2">{t('quoter.contact.summary')}</h4>                    <p className="text-sm text-secondary-600">
                      {getServiceName(selectedService)} - {currentOption && getServiceOptionData(selectedService, currentOption.id).name}
                    </p>
                    <p className="text-lg font-bold text-primary-600 mt-2">
                      {t('quoter.summary.total')}: {formatPrice(totalPrice)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() => setShowContactForm(false)}
                    className="flex-1 px-6 py-3 border border-secondary-300 text-secondary-700 font-medium rounded-lg hover:bg-secondary-50 transition-colors"
                  >
                    {t('quoter.contact.cancel')}
                  </button>                  <ButtonLoading
                    isLoading={isLoading}
                    onClick={handleSendQuote}
                    disabled={!contactInfo.name || !contactInfo.email}
                    className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
                  >
                    <Send className="w-4 h-4" />
                    {t('quoter.contact.send')}
                  </ButtonLoading>
                </div>
              </div>
            </div>
          </div>
        )}        <ToastContainer />
      </div>
    </div>
  )
}


