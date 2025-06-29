// Pricing configuration for different services and packages

export interface ServiceConfig {
  name: string
  basePrice: {
    STARTUP: number
    BUSINESS: number
    ENTERPRISE: number
  }
  timeline: {
    STARTUP: number // days
    BUSINESS: number
    ENTERPRISE: number
  }
  features: {
    STARTUP: string[]
    BUSINESS: string[]
    ENTERPRISE: string[]
  }
}

export interface AddonConfig {
  id: string
  name: string
  price: number
  timeline: number // additional days
  applicableTo: ServiceType[]
  description: string
}

export type ServiceType = 'WEB' | 'MOBILE' | 'ECOMMERCE' | 'CLOUD' | 'AI' | 'CONSULTING'
export type PackageType = 'STARTUP' | 'BUSINESS' | 'ENTERPRISE' | 'CUSTOM'

// Service configurations (prices in MXN)
export const serviceConfigs: Record<ServiceType, ServiceConfig> = {
  WEB: {
    name: 'Desarrollo Web',
    basePrice: {
      STARTUP: 15000,
      BUSINESS: 35000,
      ENTERPRISE: 75000
    },
    timeline: {
      STARTUP: 14,
      BUSINESS: 21,
      ENTERPRISE: 35
    },
    features: {
      STARTUP: [
        'Diseño responsivo',
        'Hasta 5 páginas',
        'Formulario de contacto',
        'Optimización SEO básica',
        'Panel de administración básico',
        '3 rondas de revisiones'
      ],
      BUSINESS: [
        'Todo lo de Startup',
        'Hasta 15 páginas',
        'Blog integrado',
        'Optimización SEO avanzada',
        'Integración con redes sociales',
        'Analytics y métricas',
        'Panel de administración avanzado',
        '5 rondas de revisiones'
      ],
      ENTERPRISE: [
        'Todo lo de Business',
        'Páginas ilimitadas',
        'Sistema de usuarios',
        'API personalizada',
        'Integraciones de terceros',
        'Seguridad avanzada',
        'Escalabilidad empresarial',
        'Soporte prioritario',
        'Revisiones ilimitadas'
      ]
    }
  },
  MOBILE: {
    name: 'Aplicación Móvil',
    basePrice: {
      STARTUP: 25000,
      BUSINESS: 55000,
      ENTERPRISE: 120000
    },
    timeline: {
      STARTUP: 21,
      BUSINESS: 35,
      ENTERPRISE: 60
    },
    features: {
      STARTUP: [
        'App nativa (iOS o Android)',
        'Hasta 8 pantallas',
        'Diseño personalizado',
        'Funcionalidades básicas',
        'Pruebas en dispositivos',
        '3 rondas de revisiones'
      ],
      BUSINESS: [
        'Todo lo de Startup',
        'App para ambas plataformas',
        'Hasta 20 pantallas',
        'Backend básico',
        'Push notifications',
        'Analytics integrados',
        'API REST',
        '5 rondas de revisiones'
      ],
      ENTERPRISE: [
        'Todo lo de Business',
        'Funcionalidades avanzadas',
        'Backend robusto',
        'Integración con sistemas',
        'Seguridad empresarial',
        'Escalabilidad',
        'Soporte 24/7',
        'Revisiones ilimitadas'
      ]
    }
  },
  ECOMMERCE: {
    name: 'Tienda en Línea',
    basePrice: {
      STARTUP: 20000,
      BUSINESS: 45000,
      ENTERPRISE: 95000
    },
    timeline: {
      STARTUP: 18,
      BUSINESS: 28,
      ENTERPRISE: 45
    },
    features: {
      STARTUP: [
        'Catálogo hasta 50 productos',
        'Carrito de compras',
        'Pasarela de pagos básica',
        'Gestión de inventario',
        'Panel de administración',
        'Diseño responsivo'
      ],
      BUSINESS: [
        'Todo lo de Startup',
        'Catálogo hasta 500 productos',
        'Múltiples pasarelas de pago',
        'Sistema de cupones',
        'Analytics de ventas',
        'Integración con redes sociales',
        'Email marketing básico'
      ],
      ENTERPRISE: [
        'Todo lo de Business',
        'Productos ilimitados',
        'Sistema de afiliados',
        'Multi-tienda',
        'API personalizada',
        'Integración ERP/CRM',
        'Soporte multiidioma',
        'Escalabilidad empresarial'
      ]
    }
  },
  CLOUD: {
    name: 'Migración a la Nube',
    basePrice: {
      STARTUP: 18000,
      BUSINESS: 40000,
      ENTERPRISE: 85000
    },
    timeline: {
      STARTUP: 10,
      BUSINESS: 20,
      ENTERPRISE: 35
    },
    features: {
      STARTUP: [
        'Análisis de infraestructura',
        'Migración básica',
        'Configuración en AWS/Azure',
        'Backup automático',
        'Documentación',
        'Capacitación básica'
      ],
      BUSINESS: [
        'Todo lo de Startup',
        'Migración avanzada',
        'Optimización de costos',
        'Monitoreo 24/7',
        'Escalabilidad automática',
        'Implementación CI/CD',
        'Capacitación extendida'
      ],
      ENTERPRISE: [
        'Todo lo de Business',
        'Arquitectura multi-región',
        'Recuperación ante desastres',
        'Seguridad avanzada',
        'Compliance empresarial',
        'Optimización continua',
        'Soporte dedicado'
      ]
    }
  },
  AI: {
    name: 'Soluciones de IA',
    basePrice: {
      STARTUP: 30000,
      BUSINESS: 65000,
      ENTERPRISE: 150000
    },
    timeline: {
      STARTUP: 25,
      BUSINESS: 40,
      ENTERPRISE: 70
    },
    features: {
      STARTUP: [
        'Consultoría en IA',
        'Prototipo funcional',
        'Modelo básico',
        'Integración simple',
        'Documentación técnica',
        'Capacitación básica'
      ],
      BUSINESS: [
        'Todo lo de Startup',
        'Modelo personalizado',
        'API robusta',
        'Dashboard de métricas',
        'Optimización continua',
        'Integración avanzada',
        'Soporte extendido'
      ],
      ENTERPRISE: [
        'Todo lo de Business',
        'IA empresarial',
        'Machine Learning avanzado',
        'Procesamiento en tiempo real',
        'Integración completa',
        'Escalabilidad masiva',
        'Soporte dedicado 24/7'
      ]
    }
  },
  CONSULTING: {
    name: 'Consultoría TI',
    basePrice: {
      STARTUP: 12000,
      BUSINESS: 25000,
      ENTERPRISE: 50000
    },
    timeline: {
      STARTUP: 7,
      BUSINESS: 14,
      ENTERPRISE: 21
    },
    features: {
      STARTUP: [
        'Análisis técnico',
        'Recomendaciones básicas',
        'Plan de acción',
        'Documento de análisis',
        '2 sesiones de consulta'
      ],
      BUSINESS: [
        'Todo lo de Startup',
        'Análisis detallado',
        'Roadmap tecnológico',
        'Estimaciones de costos',
        'Seguimiento mensual',
        '5 sesiones de consulta'
      ],
      ENTERPRISE: [
        'Todo lo de Business',
        'Auditoría completa',
        'Estrategia digital',
        'Plan de transformación',
        'Acompañamiento continuo',
        'Consultas ilimitadas'
      ]
    }
  }
}

// Available addons
export const availableAddons: AddonConfig[] = [
  {
    id: 'seo-advanced',
    name: 'SEO Avanzado',
    price: 5000,
    timeline: 7,
    applicableTo: ['WEB', 'ECOMMERCE'],
    description: 'Optimización SEO avanzada con análisis de palabras clave y estrategia de contenido'
  },
  {
    id: 'social-media',
    name: 'Integración Redes Sociales',
    price: 3000,
    timeline: 3,
    applicableTo: ['WEB', 'MOBILE', 'ECOMMERCE'],
    description: 'Integración completa con Facebook, Instagram, Twitter y LinkedIn'
  },
  {
    id: 'payment-gateway',
    name: 'Pasarela de Pagos Adicional',
    price: 4000,
    timeline: 5,
    applicableTo: ['WEB', 'MOBILE', 'ECOMMERCE'],
    description: 'Integración con pasarelas de pago adicionales (PayPal, Stripe, OXXO, etc.)'
  },
  {
    id: 'multilingual',
    name: 'Sitio Multiidioma',
    price: 8000,
    timeline: 10,
    applicableTo: ['WEB', 'ECOMMERCE'],
    description: 'Soporte para múltiples idiomas con gestión de contenido traducido'
  },
  {
    id: 'mobile-app',
    name: 'App Móvil Complementaria',
    price: 15000,
    timeline: 21,
    applicableTo: ['WEB', 'ECOMMERCE'],
    description: 'Aplicación móvil que complementa el sitio web'
  },
  {
    id: 'advanced-analytics',
    name: 'Analytics Avanzado',
    price: 6000,
    timeline: 7,
    applicableTo: ['WEB', 'MOBILE', 'ECOMMERCE'],
    description: 'Dashboard personalizado con métricas avanzadas y reportes automatizados'
  },
  {
    id: 'backup-system',
    name: 'Sistema de Respaldos',
    price: 3500,
    timeline: 3,
    applicableTo: ['WEB', 'MOBILE', 'ECOMMERCE', 'CLOUD'],
    description: 'Sistema automatizado de respaldos diarios con recuperación rápida'
  },
  {
    id: 'security-audit',
    name: 'Auditoría de Seguridad',
    price: 7500,
    timeline: 7,
    applicableTo: ['WEB', 'MOBILE', 'ECOMMERCE', 'CLOUD'],
    description: 'Auditoría completa de seguridad con reporte detallado y recomendaciones'
  },
  {
    id: 'performance-optimization',
    name: 'Optimización de Performance',
    price: 5500,
    timeline: 5,
    applicableTo: ['WEB', 'MOBILE', 'ECOMMERCE'],
    description: 'Optimización completa de velocidad y rendimiento'
  },
  {
    id: 'crm-integration',
    name: 'Integración CRM',
    price: 9000,
    timeline: 10,
    applicableTo: ['WEB', 'ECOMMERCE', 'CLOUD'],
    description: 'Integración con sistemas CRM populares (HubSpot, Salesforce, etc.)'
  }
]

// Calculate quote pricing
export interface QuoteCalculation {
  basePrice: number
  addonsPrice: number
  totalPrice: number
  timeline: number
  features: string[]
  addons: AddonConfig[]
  currency: string
}

export function calculateQuote(
  serviceType: ServiceType,
  packageType: PackageType,
  selectedAddonIds: string[] = [],
  currency: 'MXN' | 'USD' = 'MXN'
): QuoteCalculation {
  const serviceConfig = serviceConfigs[serviceType]
  
  if (!serviceConfig) {
    throw new Error(`Service type ${serviceType} not found`)
  }

  if (packageType === 'CUSTOM') {
    // Custom quotes need manual calculation
    return {
      basePrice: 0,
      addonsPrice: 0,
      totalPrice: 0,
      timeline: 0,
      features: ['Cotización personalizada - Contacta para más detalles'],
      addons: [],
      currency
    }
  }

  // Base price and timeline
  const basePrice = serviceConfig.basePrice[packageType]
  const baseTimeline = serviceConfig.timeline[packageType]
  const features = serviceConfig.features[packageType]

  // Calculate addons
  const selectedAddons = availableAddons.filter(addon => 
    selectedAddonIds.includes(addon.id) && 
    addon.applicableTo.includes(serviceType)
  )

  const addonsPrice = selectedAddons.reduce((total, addon) => total + addon.price, 0)
  const addonsTimeline = selectedAddons.reduce((total, addon) => total + addon.timeline, 0)

  let totalPrice = basePrice + addonsPrice
  let totalTimeline = baseTimeline + addonsTimeline

  // Apply currency conversion if needed
  if (currency === 'USD') {
    const exchangeRate = 20 // This should come from a real API in production
    totalPrice = Math.round(totalPrice / exchangeRate)
  }

  return {
    basePrice: currency === 'USD' ? Math.round(basePrice / 20) : basePrice,
    addonsPrice: currency === 'USD' ? Math.round(addonsPrice / 20) : addonsPrice,
    totalPrice,
    timeline: totalTimeline,
    features,
    addons: selectedAddons,
    currency
  }
}

// Get available addons for a service type
export function getAvailableAddons(serviceType: ServiceType): AddonConfig[] {
  return availableAddons.filter(addon => addon.applicableTo.includes(serviceType))
}

// Get service config
export function getServiceConfig(serviceType: ServiceType): ServiceConfig | null {
  return serviceConfigs[serviceType] || null
}

// Validate service and package combination
export function isValidCombination(serviceType: ServiceType, packageType: PackageType): boolean {
  if (packageType === 'CUSTOM') return true
  
  const config = serviceConfigs[serviceType]
  return config && config.basePrice[packageType] !== undefined
}

// Apply discount based on package size or special offers
export function applyDiscount(
  calculation: QuoteCalculation,
  discountType: 'EARLY_BIRD' | 'BULK' | 'LOYALTY' | 'CUSTOM',
  discountValue: number = 0
): QuoteCalculation {
  let discountAmount = 0

  switch (discountType) {
    case 'EARLY_BIRD':
      discountAmount = calculation.totalPrice * 0.1 // 10% discount
      break
    case 'BULK':
      if (calculation.totalPrice > 100000) {
        discountAmount = calculation.totalPrice * 0.15 // 15% for large projects
      }
      break
    case 'LOYALTY':
      discountAmount = calculation.totalPrice * 0.05 // 5% for returning clients
      break
    case 'CUSTOM':
      discountAmount = discountValue
      break
  }

  const newTotalPrice = Math.max(0, calculation.totalPrice - discountAmount)

  return {
    ...calculation,
    totalPrice: newTotalPrice
  }
}

// Generate quote summary for email/PDF
export function generateQuoteSummary(
  serviceType: ServiceType,
  packageType: PackageType,
  calculation: QuoteCalculation,
  clientInfo: { name: string; email: string; company?: string }
): string {
  const serviceConfig = serviceConfigs[serviceType]
  
  return `
COTIZACIÓN - CODE SOLUTIONS STUDIO
================================

Cliente: ${clientInfo.name}
Email: ${clientInfo.email}
${clientInfo.company ? `Empresa: ${clientInfo.company}` : ''}

Servicio: ${serviceConfig.name}
Paquete: ${packageType}

DESGLOSE:
---------
Precio base: ${calculation.currency} ${calculation.basePrice.toLocaleString()}
${calculation.addons.length > 0 ? `Addons: ${calculation.currency} ${calculation.addonsPrice.toLocaleString()}` : ''}
TOTAL: ${calculation.currency} ${calculation.totalPrice.toLocaleString()}

Tiempo de entrega: ${calculation.timeline} días

CARACTERÍSTICAS INCLUIDAS:
${calculation.features.map(feature => `• ${feature}`).join('\n')}

${calculation.addons.length > 0 ? `
ADDONS SELECCIONADOS:
${calculation.addons.map(addon => `• ${addon.name} - ${calculation.currency} ${addon.price.toLocaleString()}`).join('\n')}
` : ''}

Esta cotización es válida por 30 días.
Para proceder, responde a este email o visita nuestro sitio web.

¡Gracias por confiar en Code Solutions Studio!
  `.trim()
}
