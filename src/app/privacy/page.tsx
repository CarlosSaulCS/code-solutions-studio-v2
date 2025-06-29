'use client'

import { useLanguage } from '@/app/providers'
import { Shield, Eye, Lock, UserCheck, Database, Globe } from 'lucide-react'

export default function PrivacyPolicy() {
  const { t, language } = useLanguage()

  const sections = {
    es: [
      {
        title: "1. Información que Recopilamos",
        icon: Database,
        content: [
          'En Code Solutions Studio, recopilamos diferentes tipos de información para proporcionar y mejorar nuestros servicios:',
          '',
          '**Información Personal:**',
          '• Nombre completo y datos de contacto (email, teléfono)',
          '• Información de la empresa (nombre, sector, tamaño)',
          '• Datos de facturación y direcciones',
          '• Información proporcionada en formularios de contacto y cotizaciones',
          '',
          '**Información Técnica:**',
          '• Dirección IP y datos de geolocalización aproximada',
          '• Tipo de navegador, sistema operativo y dispositivo',
          '• Páginas visitadas, tiempo de permanencia y patrones de navegación',
          '• Datos de rendimiento y analíticas del sitio web',
          '',
          '**Información del Proyecto:**',
          '• Requisitos técnicos y especificaciones del proyecto',
          '• Archivos, documentos y contenido proporcionado para el desarrollo',
          '• Comunicaciones relacionadas con el proyecto',
          '• Historial de cotizaciones y transacciones'
        ]
      },
      {
        title: "2. Cómo Utilizamos su Información",
        icon: Eye,
        content: [
          'Utilizamos la información recopilada para los siguientes propósitos:',
          '',
          '**Prestación de Servicios:**',
          '• Procesar y gestionar cotizaciones de proyectos',
          '• Desarrollar y entregar los servicios contratados',
          '• Proporcionar soporte técnico y atención al cliente',
          '• Gestionar pagos y facturación',
          '',
          '**Comunicación:**',
          '• Enviar actualizaciones sobre el estado de proyectos',
          '• Responder a consultas y solicitudes de soporte',
          '• Enviar notificaciones importantes sobre nuestros servicios',
          '• Compartir contenido educativo y newsletters (con su consentimiento)',
          '',
          '**Mejora de Servicios:**',
          '• Analizar el uso de nuestra plataforma para optimizar la experiencia',
          '• Desarrollar nuevas funcionalidades y servicios',
          '• Realizar estudios de mercado y análisis de tendencias',
          '• Personalizar el contenido y las recomendaciones'
        ]
      },
      {
        title: "3. Base Legal para el Procesamiento",
        icon: UserCheck,
        content: [
          'Procesamos su información personal basándonos en las siguientes bases legales:',
          '',
          '**Ejecución de Contrato:**',
          '• Procesamiento necesario para la prestación de servicios contratados',
          '• Gestión de la relación comercial y cumplimiento de obligaciones',
          '',
          '**Intereses Legítimos:**',
          '• Mejora de nuestros servicios y desarrollo de nuevas funcionalidades',
          '• Análisis de uso para optimización de la plataforma',
          '• Protección contra fraude y actividades maliciosas',
          '',
          '**Consentimiento:**',
          '• Envío de comunicaciones comerciales y newsletters',
          '• Uso de cookies no esenciales para analíticas y personalización',
          '• Procesamiento de datos sensibles cuando sea aplicable',
          '',
          '**Cumplimiento Legal:**',
          '• Cumplimiento de obligaciones fiscales y contables',
          '• Respuesta a requerimientos legales y autoridades competentes'
        ]
      },
      {
        title: "4. Compartir Información con Terceros",
        icon: Globe,
        content: [
          'No vendemos, alquilamos o comercializamos su información personal. Podemos compartir información limitada en las siguientes circunstancias:',
          '',
          '**Proveedores de Servicios:**',
          '• Procesadores de pagos (Stripe) para transacciones seguras',
          '• Servicios de hosting y almacenamiento en la nube',
          '• Herramientas de analíticas (Google Analytics) con datos anonimizados',
          '• Servicios de email marketing (con su consentimiento explícito)',
          '',
          '**Requisitos Legales:**',
          '• Cuando sea requerido por ley o autoridades competentes',
          '• Para proteger nuestros derechos legales o los de terceros',
          '• En caso de investigaciones de seguridad o fraude',
          '',
          '**Transferencias Comerciales:**',
          '• En caso de fusión, adquisición o venta de activos',
          '• Con socios comerciales para la prestación conjunta de servicios (con su consentimiento)',
          '',
          'Todos los terceros están obligados contractualmente a proteger su información y utilizarla únicamente para los fines especificados.'
        ]
      },
      {
        title: "5. Seguridad de los Datos",
        icon: Lock,
        content: [
          'Implementamos medidas de seguridad robustas para proteger su información:',
          '',
          '**Medidas Técnicas:**',
          '• Cifrado SSL/TLS para todas las transmisiones de datos',
          '• Encriptación de datos sensibles en nuestras bases de datos',
          '• Firewalls y sistemas de detección de intrusiones',
          '• Acceso restringido mediante autenticación multifactor',
          '',
          '**Medidas Organizacionales:**',
          '• Acceso limitado al personal autorizado bajo principio de menor privilegio',
          '• Capacitación regular del equipo en seguridad y privacidad',
          '• Auditorías de seguridad y evaluaciones de vulnerabilidades',
          '• Planes de respuesta a incidentes y recuperación de datos',
          '',
          '**Almacenamiento:**',
          '• Respaldos regulares en ubicaciones geográficamente distribuidas',
          '• Retención de datos según períodos legalmente requeridos',
          '• Eliminación segura de datos al final de su ciclo de vida',
          '',
          'A pesar de estas medidas, ningún sistema es completamente seguro. Le recomendamos mantener seguras sus credenciales de acceso.'
        ]
      },
      {
        title: "6. Sus Derechos de Privacidad",
        icon: Shield,
        content: [
          'Como titular de datos personales, usted tiene los siguientes derechos:',
          '',
          '**Acceso y Rectificación:**',
          '• Solicitar una copia de los datos personales que mantenemos sobre usted',
          '• Corregir datos inexactos o desactualizados',
          '• Completar datos incompletos',
          '',
          '**Eliminación y Restricción:**',
          '• Solicitar la eliminación de sus datos personales ("derecho al olvido")',
          '• Restringir el procesamiento en ciertas circunstancias',
          '• Oponerse al procesamiento basado en intereses legítimos',
          '',
          '**Portabilidad:**',
          '• Recibir sus datos en un formato estructurado y legible por máquina',
          '• Transferir sus datos a otro proveedor de servicios',
          '',
          '**Gestión de Consentimiento:**',
          '• Retirar su consentimiento en cualquier momento',
          '• Opt-out de comunicaciones comerciales',
          '',
          'Para ejercer cualquiera de estos derechos, puede contactarnos a través de privacy@codesolutions.studio. Responderemos a su solicitud dentro de 30 días hábiles.'
        ]
      },
      {
        title: "7. Cookies y Tecnologías de Seguimiento",
        icon: Database,
        content: [
          'Utilizamos cookies y tecnologías similares para mejorar su experiencia:',
          '',
          '**Cookies Esenciales:**',
          '• Necesarias para el funcionamiento básico del sitio web',
          '• Gestión de sesiones de usuario y autenticación',
          '• Preferencias de idioma y configuración',
          '',
          '**Cookies de Analíticas:**',
          '• Google Analytics para entender el uso del sitio web',
          '• Métricas de rendimiento y optimización',
          '• Datos anonimizados y agregados',
          '',
          '**Cookies de Funcionalidad:**',
          '• Recordar preferencias de usuario',
          '• Personalización de contenido',
          '• Funcionalidades de chat y soporte',
          '',
          'Puede gestionar sus preferencias de cookies a través de la configuración de su navegador. Tenga en cuenta que deshabilitar ciertas cookies puede afectar la funcionalidad del sitio.'
        ]
      },
      {
        title: "8. Retención de Datos",
        icon: Database,
        content: [
          'Mantenemos sus datos personales durante los siguientes períodos:',
          '',
          '**Datos de Clientes Activos:**',
          '• Durante la duración de la relación comercial',
          '• Hasta 7 años después de la última transacción para cumplimiento fiscal',
          '',
          '**Datos de Proyectos:**',
          '• Durante la ejecución del proyecto y período de garantía',
          '• Archivos de código fuente según términos contractuales',
          '',
          '**Datos de Marketing:**',
          '• Hasta que retire su consentimiento',
          '• Máximo 3 años sin actividad para contactos inactivos',
          '',
          '**Datos de Soporte:**',
          '• 2 años para propósitos de seguimiento y mejora',
          '',
          'Al finalizar estos períodos, eliminamos o anonimizamos irreversiblemente los datos, excepto cuando la ley requiera un período de retención más largo.'
        ]
      },
      {
        title: "9. Transferencias Internacionales",
        icon: Globe,
        content: [
          'Sus datos pueden ser transferidos y procesados fuera de México:',
          '',
          '**Proveedores de Servicios:**',
          '• Algunos de nuestros proveedores tecnológicos están ubicados en Estados Unidos y Europa',
          '• Todos cumplen con estándares internacionales de protección de datos',
          '',
          '**Medidas de Protección:**',
          '• Contratos con cláusulas contractuales estándar aprobadas',
          '• Verificación de niveles adecuados de protección',
          '• Encriptación durante la transferencia y almacenamiento',
          '',
          '**Sus Opciones:**',
          '• Puede solicitar información sobre las transferencias específicas',
          '• Tiene derecho a oponerse a transferencias en ciertas circunstancias'
        ]
      },
      {
        title: "10. Privacidad de Menores",
        icon: Shield,
        content: [
          'Nuestros servicios están dirigidos a empresas y profesionales mayores de 18 años:',
          '',
          '• No recopilamos intencionalmente información de menores de 18 años',
          '• Si descubrimos que hemos recopilado datos de un menor, los eliminaremos inmediatamente',
          '• Los padres o tutores pueden contactarnos para solicitar la eliminación de datos de menores',
          '• Implementamos verificaciones de edad en nuestros formularios de registro'
        ]
      },
      {
        title: "11. Cambios a esta Política",
        icon: UserCheck,
        content: [
          'Podemos actualizar esta Política de Privacidad periódicamente:',
          '',
          '• Le notificaremos cambios materiales por email o mediante aviso prominente en nuestro sitio web',
          '• Los cambios menores se publicarán con la fecha de "última actualización"',
          '• Su uso continuado de nuestros servicios constituye aceptación de los cambios',
          '• Siempre puede revisar la versión más actual en nuestro sitio web'
        ]
      },
      {
        title: "12. Contacto y Quejas",
        icon: Eye,
        content: [
          'Para cualquier consulta sobre privacidad o para ejercer sus derechos:',
          '',
          '**Oficial de Protección de Datos:**',
          '• Email: privacy@codesolutions.studio',
          '• Teléfono: +52 (33) 1234-5678',
          '• Dirección: Guadalajara, Jalisco, México',
          '',
          '**Autoridad de Control:**',
          '• Instituto Nacional de Transparencia, Acceso a la Información y Protección de Datos Personales (INAI)',
          '• Puede presentar quejas si considera que hemos violado sus derechos de privacidad',
          '',
          'Nos comprometemos a investigar y responder a todas las consultas y quejas de manera oportuna y transparente.'
        ]
      }
    ],
    en: [
      {
        title: "1. Information We Collect",
        icon: Database,
        content: [
          'At Code Solutions Studio, we collect different types of information to provide and improve our services:',
          '',
          '**Personal Information:**',
          '• Full name and contact information (email, phone)',
          '• Company information (name, sector, size)',
          '• Billing information and addresses',
          '• Information provided in contact forms and quotations',
          '',
          '**Technical Information:**',
          '• IP address and approximate geolocation data',
          '• Browser type, operating system, and device',
          '• Pages visited, time spent, and browsing patterns',
          '• Website performance and analytics data',
          '',
          '**Project Information:**',
          '• Technical requirements and project specifications',
          '• Files, documents, and content provided for development',
          '• Project-related communications',
          '• Quote and transaction history'
        ]
      },
      {
        title: "2. How We Use Your Information",
        icon: Eye,
        content: [
          'We use collected information for the following purposes:',
          '',
          '**Service Provision:**',
          '• Process and manage project quotations',
          '• Develop and deliver contracted services',
          '• Provide technical support and customer service',
          '• Manage payments and billing',
          '',
          '**Communication:**',
          '• Send project status updates',
          '• Respond to inquiries and support requests',
          '• Send important notifications about our services',
          '• Share educational content and newsletters (with your consent)',
          '',
          '**Service Improvement:**',
          '• Analyze platform usage to optimize experience',
          '• Develop new features and services',
          '• Conduct market research and trend analysis',
          '• Personalize content and recommendations'
        ]
      },
      {
        title: "3. Legal Basis for Processing",
        icon: UserCheck,
        content: [
          'We process your personal information based on the following legal bases:',
          '',
          '**Contract Performance:**',
          '• Processing necessary for contracted service delivery',
          '• Management of business relationship and obligation fulfillment',
          '',
          '**Legitimate Interests:**',
          '• Service improvement and new feature development',
          '• Usage analysis for platform optimization',
          '• Protection against fraud and malicious activities',
          '',
          '**Consent:**',
          '• Sending commercial communications and newsletters',
          '• Use of non-essential cookies for analytics and personalization',
          '• Processing sensitive data when applicable',
          '',
          '**Legal Compliance:**',
          '• Compliance with tax and accounting obligations',
          '• Response to legal requirements and competent authorities'
        ]
      },
      {
        title: "4. Sharing Information with Third Parties",
        icon: Globe,
        content: [
          'We do not sell, rent, or commercialize your personal information. We may share limited information in the following circumstances:',
          '',
          '**Service Providers:**',
          '• Payment processors (Stripe) for secure transactions',
          '• Hosting and cloud storage services',
          '• Analytics tools (Google Analytics) with anonymized data',
          '• Email marketing services (with your explicit consent)',
          '',
          '**Legal Requirements:**',
          '• When required by law or competent authorities',
          '• To protect our legal rights or those of third parties',
          '• In case of security or fraud investigations',
          '',
          '**Business Transfers:**',
          '• In case of merger, acquisition, or asset sale',
          '• With business partners for joint service delivery (with your consent)',
          '',
          'All third parties are contractually obligated to protect your information and use it only for specified purposes.'
        ]
      },
      {
        title: "5. Data Security",
        icon: Lock,
        content: [
          'We implement robust security measures to protect your information:',
          '',
          '**Technical Measures:**',
          '• SSL/TLS encryption for all data transmissions',
          '• Encryption of sensitive data in our databases',
          '• Firewalls and intrusion detection systems',
          '• Restricted access through multi-factor authentication',
          '',
          '**Organizational Measures:**',
          '• Limited access to authorized personnel under least privilege principle',
          '• Regular team training on security and privacy',
          '• Security audits and vulnerability assessments',
          '• Incident response and data recovery plans',
          '',
          '**Storage:**',
          '• Regular backups in geographically distributed locations',
          '• Data retention according to legally required periods',
          '• Secure data deletion at end of lifecycle',
          '',
          'Despite these measures, no system is completely secure. We recommend keeping your access credentials secure.'
        ]
      },
      {
        title: "6. Your Privacy Rights",
        icon: Shield,
        content: [
          'As a personal data subject, you have the following rights:',
          '',
          '**Access and Rectification:**',
          '• Request a copy of personal data we maintain about you',
          '• Correct inaccurate or outdated data',
          '• Complete incomplete data',
          '',
          '**Deletion and Restriction:**',
          '• Request deletion of your personal data ("right to be forgotten")',
          '• Restrict processing under certain circumstances',
          '• Object to processing based on legitimate interests',
          '',
          '**Portability:**',
          '• Receive your data in a structured, machine-readable format',
          '• Transfer your data to another service provider',
          '',
          '**Consent Management:**',
          '• Withdraw your consent at any time',
          '• Opt-out of commercial communications',
          '',
          'To exercise any of these rights, you can contact us at privacy@codesolutions.studio. We will respond to your request within 30 business days.'
        ]
      },
      {
        title: "7. Cookies and Tracking Technologies",
        icon: Database,
        content: [
          'We use cookies and similar technologies to improve your experience:',
          '',
          '**Essential Cookies:**',
          '• Necessary for basic website functionality',
          '• User session management and authentication',
          '• Language preferences and settings',
          '',
          '**Analytics Cookies:**',
          '• Google Analytics to understand website usage',
          '• Performance metrics and optimization',
          '• Anonymized and aggregated data',
          '',
          '**Functionality Cookies:**',
          '• Remember user preferences',
          '• Content personalization',
          '• Chat and support functionalities',
          '',
          'You can manage your cookie preferences through your browser settings. Please note that disabling certain cookies may affect site functionality.'
        ]
      },
      {
        title: "8. Data Retention",
        icon: Database,
        content: [
          'We maintain your personal data for the following periods:',
          '',
          '**Active Customer Data:**',
          '• During the duration of the business relationship',
          '• Up to 7 years after the last transaction for tax compliance',
          '',
          '**Project Data:**',
          '• During project execution and warranty period',
          '• Source code files according to contractual terms',
          '',
          '**Marketing Data:**',
          '• Until you withdraw your consent',
          '• Maximum 3 years without activity for inactive contacts',
          '',
          '**Support Data:**',
          '• 2 years for tracking and improvement purposes',
          '',
          'At the end of these periods, we irreversibly delete or anonymize data, except when law requires a longer retention period.'
        ]
      },
      {
        title: "9. International Transfers",
        icon: Globe,
        content: [
          'Your data may be transferred and processed outside of Mexico:',
          '',
          '**Service Providers:**',
          '• Some of our technology providers are located in the United States and Europe',
          '• All comply with international data protection standards',
          '',
          '**Protection Measures:**',
          '• Contracts with approved standard contractual clauses',
          '• Verification of adequate protection levels',
          '• Encryption during transfer and storage',
          '',
          '**Your Options:**',
          '• You can request information about specific transfers',
          '• You have the right to object to transfers under certain circumstances'
        ]
      },
      {
        title: "10. Children's Privacy",
        icon: Shield,
        content: [
          'Our services are directed to businesses and professionals over 18 years old:',
          '',
          '• We do not intentionally collect information from minors under 18',
          '• If we discover we have collected data from a minor, we will delete it immediately',
          '• Parents or guardians can contact us to request deletion of minor data',
          '• We implement age verification in our registration forms'
        ]
      },
      {
        title: "11. Changes to This Policy",
        icon: UserCheck,
        content: [
          'We may update this Privacy Policy periodically:',
          '',
          '• We will notify you of material changes by email or prominent notice on our website',
          '• Minor changes will be posted with the "last updated" date',
          '• Your continued use of our services constitutes acceptance of changes',
          '• You can always review the most current version on our website'
        ]
      },
      {
        title: "12. Contact and Complaints",
        icon: Eye,
        content: [
          'For any privacy inquiries or to exercise your rights:',
          '',
          '**Data Protection Officer:**',
          '• Email: privacy@codesolutions.studio',
          '• Phone: +52 (33) 1234-5678',
          '• Address: Guadalajara, Jalisco, Mexico',
          '',
          '**Supervisory Authority:**',
          '• National Institute for Transparency, Access to Information and Personal Data Protection (INAI)',
          '• You can file complaints if you believe we have violated your privacy rights',
          '',
          'We commit to investigating and responding to all inquiries and complaints in a timely and transparent manner.'
        ]
      }
    ]
  }

  const currentSections = sections[language as keyof typeof sections] || sections.es

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/10 rounded-full p-4">
                <Shield className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              {language === 'es' ? 'Política de Privacidad' : 'Privacy Policy'}
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
              {language === 'es' 
                ? 'Tu privacidad es fundamental para nosotros. Esta política explica cómo recopilamos, utilizamos y protegemos tu información personal.'
                : 'Your privacy is fundamental to us. This policy explains how we collect, use, and protect your personal information.'
              }
            </p>
            <div className="mt-8 text-sm text-blue-200">
              {language === 'es' 
                ? 'Última actualización: 1 de enero de 2024'
                : 'Last updated: January 1, 2024'
              }
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                {language === 'es' 
                  ? 'En Code Solutions Studio, nos comprometemos a proteger y respetar su privacidad. Esta Política de Privacidad explica cómo recopilamos, utilizamos, almacenamos y protegemos su información personal cuando utiliza nuestros servicios de desarrollo tecnológico.'
                  : 'At Code Solutions Studio, we are committed to protecting and respecting your privacy. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our technology development services.'
                }
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <p className="text-blue-800 font-medium">
                  {language === 'es' 
                    ? 'Esta política cumple con las leyes de protección de datos aplicables, incluyendo la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) de México.'
                    : 'This policy complies with applicable data protection laws, including the Federal Law on Protection of Personal Data Held by Private Parties (LFPDPPP) of Mexico.'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Privacy Sections */}
          <div className="space-y-6">
            {currentSections.map((section, index) => {
              const IconComponent = section.icon
              return (
                <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 sm:px-8 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-white/10 rounded-lg p-2">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white">
                        {section.title}
                      </h2>
                    </div>
                  </div>
                  <div className="p-6 sm:p-8">
                    <div className="prose prose-gray max-w-none">
                      {section.content.map((paragraph, pIndex) => {
                        if (paragraph === '') {
                          return <br key={pIndex} />
                        }
                        if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                          return (
                            <h4 key={pIndex} className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                              {paragraph.slice(2, -2)}
                            </h4>
                          )
                        }
                        return (
                          <p key={pIndex} className="text-gray-700 leading-relaxed mb-4 last:mb-0">
                            {paragraph}
                          </p>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Data Protection Summary */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl shadow-lg p-6 sm:p-8 mt-12 text-white">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Lock className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-4">
                {language === 'es' ? 'Nuestro Compromiso con su Privacidad' : 'Our Commitment to Your Privacy'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <Shield className="w-8 h-8 mx-auto mb-2 text-green-200" />
                  <p className="font-semibold mb-2">
                    {language === 'es' ? 'Protección Robusta' : 'Robust Protection'}
                  </p>
                  <p className="text-sm text-green-100">
                    {language === 'es' 
                      ? 'Encriptación avanzada y medidas de seguridad de grado empresarial'
                      : 'Advanced encryption and enterprise-grade security measures'
                    }
                  </p>
                </div>
                <div className="text-center">
                  <Eye className="w-8 h-8 mx-auto mb-2 text-green-200" />
                  <p className="font-semibold mb-2">
                    {language === 'es' ? 'Transparencia Total' : 'Complete Transparency'}
                  </p>
                  <p className="text-sm text-green-100">
                    {language === 'es' 
                      ? 'Siempre sabrás qué datos tenemos y cómo los utilizamos'
                      : 'You will always know what data we have and how we use it'
                    }
                  </p>
                </div>
                <div className="text-center">
                  <UserCheck className="w-8 h-8 mx-auto mb-2 text-green-200" />
                  <p className="font-semibold mb-2">
                    {language === 'es' ? 'Control Total' : 'Full Control'}
                  </p>
                  <p className="text-sm text-green-100">
                    {language === 'es' 
                      ? 'Tus datos, tus decisiones. Ejerce tus derechos cuando quieras'
                      : 'Your data, your decisions. Exercise your rights whenever you want'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white border-2 border-blue-200 rounded-2xl shadow-lg p-6 sm:p-8 mt-8">
            <div className="text-center">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                {language === 'es' ? '¿Preguntas sobre Privacidad?' : 'Privacy Questions?'}
              </h3>
              <p className="text-gray-600 mb-6">
                {language === 'es' 
                  ? 'Nuestro equipo de protección de datos está aquí para ayudarte con cualquier consulta o para ejercer tus derechos.'
                  : 'Our data protection team is here to help you with any questions or to exercise your rights.'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="mailto:privacy@codesolutions.studio" 
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
                >
                  {language === 'es' ? 'Contactar Privacidad' : 'Contact Privacy'}
                </a>
                <a 
                  href="/contact" 
                  className="inline-block border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200"
                >
                  {language === 'es' ? 'Contacto General' : 'General Contact'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

