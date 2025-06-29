'use client'

import { useLanguage } from '@/app/providers'
import { Metadata } from 'next'

export default function TermsOfService() {
  const { t, language } = useLanguage()

  const sections = {
    es: [
      {
        title: "1. Definiciones",
        content: [
          'En estos Términos de Servicio, los siguientes términos tendrán los significados que se indican:',
          '• "Nosotros", "Nuestro", "Compañía": Se refiere a Code Solutions Studio.',
          '• "Cliente", "Usted": Se refiere a la persona física o jurídica que contrata nuestros servicios.',
          '• "Servicios": Incluye desarrollo web, aplicaciones móviles, soluciones e-commerce, migración a la nube, inteligencia artificial y consultoría TI.',
          '• "Plataforma": Se refiere a nuestro sitio web y todas las herramientas digitales proporcionadas.',
          '• "Proyecto": Cualquier trabajo específico acordado entre las partes.'
        ]
      },
      {
        title: "2. Aceptación de los Términos",
        content: [
          'Al acceder y utilizar nuestros servicios, usted acepta cumplir con estos Términos de Servicio y todas las leyes aplicables.',
          'Si no está de acuerdo con alguno de estos términos, no debe utilizar nuestros servicios.',
          'Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en nuestro sitio web.',
          'Es su responsabilidad revisar periódicamente estos términos para estar al tanto de cualquier modificación.'
        ]
      },
      {
        title: "3. Descripción de Servicios",
        content: [
          'Code Solutions Studio ofrece servicios profesionales de desarrollo tecnológico, incluyendo:',
          '• Desarrollo de aplicaciones web personalizadas utilizando tecnologías modernas',
          '• Desarrollo de aplicaciones móviles nativas e híbridas para iOS y Android',
          '• Implementación de soluciones e-commerce completas y escalables',
          '• Servicios de migración y consultoría en tecnologías de nube',
          '• Desarrollo e implementación de soluciones de inteligencia artificial',
          '• Consultoría especializada en tecnologías de la información',
          'Todos los servicios se prestan de acuerdo con las especificaciones acordadas en cada proyecto específico.'
        ]
      },
      {
        title: "4. Proceso de Cotización y Contratación",
        content: [
          'Las cotizaciones se proporcionan a través de nuestro sistema automatizado y pueden variar según la complejidad del proyecto.',
          'Todas las cotizaciones tienen una validez de 30 días calendario desde su emisión.',
          'Los precios están sujetos a cambios sin previo aviso, pero se respetarán las cotizaciones válidas ya emitidas.',
          'Para confirmar un proyecto, se requiere la aceptación formal de la cotización y el pago del anticipo correspondiente.',
          'Los proyectos se inician únicamente después de recibir la confirmación por escrito y el pago inicial.'
        ]
      },
      {
        title: "5. Términos de Pago",
        content: [
          'Aceptamos pagos en pesos mexicanos (MXN) y dólares estadounidenses (USD).',
          'Se requiere un anticipo del 50% para iniciar cualquier proyecto, salvo acuerdo diferente por escrito.',
          'El saldo restante se cobrará según el cronograma de pagos acordado en cada proyecto.',
          'Los pagos vencidos generarán intereses moratorios del 3% mensual.',
          'En caso de incumplimiento de pago, nos reservamos el derecho de suspender el proyecto y retener el trabajo realizado.',
          'Todos los precios incluyen los impuestos aplicables según la legislación mexicana.'
        ]
      },
      {
        title: "6. Cronograma de Entrega",
        content: [
          'Los tiempos de entrega se establecen en función de la complejidad y alcance de cada proyecto.',
          'Los cronogramas son estimaciones basadas en la información proporcionada por el cliente.',
          'Cualquier cambio en los requisitos del proyecto puede afectar los tiempos de entrega.',
          'Force majeure, incluyendo pero no limitado a desastres naturales o pandemias, puede justificar extensiones en los plazos.',
          'Notificaremos cualquier retraso potencial con la mayor anticipación posible.'
        ]
      },
      {
        title: "7. Responsabilidades del Cliente",
        content: [
          'Proporcionar toda la información necesaria para el desarrollo del proyecto de manera oportuna.',
          'Revisar y aprobar entregables dentro de los plazos establecidos.',
          'Realizar los pagos según los términos acordados.',
          'Proporcionar acceso a sistemas, servidores o plataformas cuando sea necesario.',
          'Mantener la confidencialidad de las credenciales de acceso proporcionadas.',
          'Cumplir con todas las leyes y regulaciones aplicables en el uso de nuestros servicios.'
        ]
      },
      {
        title: "8. Propiedad Intelectual",
        content: [
          'El código fuente y todos los deliverables del proyecto serán propiedad del cliente una vez completado el pago total.',
          'Nos reservamos el derecho de utilizar conocimientos generales y técnicas desarrolladas durante el proyecto en trabajos futuros.',
          'El cliente garantiza tener los derechos necesarios sobre todo el contenido proporcionado (textos, imágenes, logos, etc.).',
          'Code Solutions Studio mantendrá los derechos sobre su metodología, frameworks internos y herramientas propietarias.',
          'Cualquier software de terceros utilizado estará sujeto a sus respectivas licencias.'
        ]
      },
      {
        title: "9. Confidencialidad",
        content: [
          'Mantendremos la confidencialidad de toda la información comercial sensible proporcionada por el cliente.',
          'Esta obligación de confidencialidad permanecerá vigente por un período de 5 años después de la finalización del proyecto.',
          'Podemos divulgar información cuando sea requerido por ley o por orden judicial.',
          'El cliente autoriza el uso de su proyecto como referencia en nuestro portafolio, salvo acuerdo contrario por escrito.'
        ]
      },
      {
        title: "10. Limitación de Responsabilidad",
        content: [
          'Nuestra responsabilidad total no excederá el valor total pagado por el cliente para el proyecto específico.',
          'No seremos responsables por daños indirectos, incidentales, especiales o consecuenciales.',
          'No garantizamos la compatibilidad con futuras versiones de navegadores, sistemas operativos o plataformas de terceros.',
          'El cliente es responsable de mantener copias de seguridad de su información y datos.',
          'No seremos responsables por interrupciones de servicios de terceros fuera de nuestro control.'
        ]
      },
      {
        title: "11. Garantía y Soporte",
        content: [
          'Ofrecemos una garantía de 90 días para corrección de errores en la funcionalidad acordada originalmente.',
          'La garantía no cubre nuevas funcionalidades, cambios en requisitos o problemas causados por modificaciones del cliente.',
          'El soporte técnico post-lanzamiento está disponible bajo términos separados.',
          'Las actualizaciones y mantenimiento continuo requieren acuerdos de soporte adicionales.'
        ]
      },
      {
        title: "12. Cancelación y Terminación",
        content: [
          'Cualquier parte puede cancelar el proyecto con 15 días de aviso por escrito.',
          'En caso de cancelación por parte del cliente, se cobrará el trabajo realizado hasta la fecha.',
          'Los pagos anticipos no son reembolsables, pero se aplicarán al trabajo completado.',
          'Nos reservamos el derecho de terminar el servicio en caso de incumplimiento material del cliente.',
          'Al terminar el proyecto, entregaremos todo el trabajo completado hasta esa fecha.'
        ]
      },
      {
        title: "13. Ley Aplicable y Jurisdicción",
        content: [
          'Estos términos se rigen por las leyes de México.',
          'Cualquier disputa se resolverá en los tribunales competentes de Guadalajara, Jalisco, México.',
          'Las partes intentarán resolver cualquier disputa mediante negociación directa antes de recurrir a procedimientos legales.',
          'En caso de controversia, las partes podrán optar por mediación o arbitraje antes del litigio.'
        ]
      },
      {
        title: "14. Disposiciones Generales",
        content: [
          'Si alguna disposición de estos términos es declarada inválida, el resto permanecerá en pleno vigor.',
          'Estos términos constituyen el acuerdo completo entre las partes respecto a los servicios.',
          'Cualquier modificación debe ser realizada por escrito y firmada por ambas partes.',
          'La falta de ejercicio de cualquier derecho no constituye una renuncia al mismo.',
          'Estos términos son efectivos desde el 1 de enero de 2024.'
        ]
      }
    ],
    en: [
      {
        title: "1. Definitions",
        content: [
          'In these Terms of Service, the following terms shall have the meanings indicated:',
          '• "We", "Our", "Company": Refers to Code Solutions Studio.',
          '• "Client", "You": Refers to the individual or legal entity contracting our services.',
          '• "Services": Includes web development, mobile applications, e-commerce solutions, cloud migration, artificial intelligence, and IT consulting.',
          '• "Platform": Refers to our website and all digital tools provided.',
          '• "Project": Any specific work agreed upon between the parties.'
        ]
      },
      {
        title: "2. Acceptance of Terms",
        content: [
          'By accessing and using our services, you agree to comply with these Terms of Service and all applicable laws.',
          'If you do not agree with any of these terms, you should not use our services.',
          'We reserve the right to modify these terms at any time. Changes will take effect immediately after publication on our website.',
          'It is your responsibility to periodically review these terms to stay informed of any modifications.'
        ]
      },
      {
        title: "3. Service Description",
        content: [
          'Code Solutions Studio offers professional technology development services, including:',
          '• Development of custom web applications using modern technologies',
          '• Development of native and hybrid mobile applications for iOS and Android',
          '• Implementation of complete and scalable e-commerce solutions',
          '• Cloud migration and consulting services',
          '• Development and implementation of artificial intelligence solutions',
          '• Specialized information technology consulting',
          'All services are provided according to specifications agreed upon in each specific project.'
        ]
      },
      {
        title: "4. Quotation and Contracting Process",
        content: [
          'Quotations are provided through our automated system and may vary according to project complexity.',
          'All quotations are valid for 30 calendar days from their issuance.',
          'Prices are subject to change without prior notice, but valid quotations already issued will be honored.',
          'To confirm a project, formal acceptance of the quotation and payment of the corresponding advance is required.',
          'Projects are initiated only after receiving written confirmation and initial payment.'
        ]
      },
      {
        title: "5. Payment Terms",
        content: [
          'We accept payments in Mexican pesos (MXN) and US dollars (USD).',
          'A 50% advance is required to start any project, unless otherwise agreed in writing.',
          'The remaining balance will be charged according to the payment schedule agreed upon in each project.',
          'Overdue payments will generate late fees of 3% monthly.',
          'In case of payment default, we reserve the right to suspend the project and retain completed work.',
          'All prices include applicable taxes according to Mexican legislation.'
        ]
      },
      {
        title: "6. Delivery Schedule",
        content: [
          'Delivery times are established based on the complexity and scope of each project.',
          'Schedules are estimates based on information provided by the client.',
          'Any changes in project requirements may affect delivery times.',
          'Force majeure, including but not limited to natural disasters or pandemics, may justify extensions in deadlines.',
          'We will notify any potential delays with as much advance notice as possible.'
        ]
      },
      {
        title: "7. Client Responsibilities",
        content: [
          'Provide all necessary information for project development in a timely manner.',
          'Review and approve deliverables within established deadlines.',
          'Make payments according to agreed terms.',
          'Provide access to systems, servers, or platforms when necessary.',
          'Maintain confidentiality of provided access credentials.',
          'Comply with all applicable laws and regulations in the use of our services.'
        ]
      },
      {
        title: "8. Intellectual Property",
        content: [
          'Source code and all project deliverables will be owned by the client once full payment is completed.',
          'We reserve the right to use general knowledge and techniques developed during the project in future work.',
          'The client guarantees having the necessary rights over all provided content (texts, images, logos, etc.).',
          'Code Solutions Studio will retain rights over its methodology, internal frameworks, and proprietary tools.',
          'Any third-party software used will be subject to their respective licenses.'
        ]
      },
      {
        title: "9. Confidentiality",
        content: [
          'We will maintain confidentiality of all sensitive business information provided by the client.',
          'This confidentiality obligation will remain in effect for 5 years after project completion.',
          'We may disclose information when required by law or court order.',
          'The client authorizes the use of their project as a reference in our portfolio, unless otherwise agreed in writing.'
        ]
      },
      {
        title: "10. Limitation of Liability",
        content: [
          'Our total liability will not exceed the total amount paid by the client for the specific project.',
          'We will not be responsible for indirect, incidental, special, or consequential damages.',
          'We do not guarantee compatibility with future versions of browsers, operating systems, or third-party platforms.',
          'The client is responsible for maintaining backups of their information and data.',
          'We will not be responsible for interruptions of third-party services beyond our control.'
        ]
      },
      {
        title: "11. Warranty and Support",
        content: [
          'We offer a 90-day warranty for bug fixes in originally agreed functionality.',
          'The warranty does not cover new features, changes in requirements, or issues caused by client modifications.',
          'Post-launch technical support is available under separate terms.',
          'Updates and ongoing maintenance require additional support agreements.'
        ]
      },
      {
        title: "12. Cancellation and Termination",
        content: [
          'Either party may cancel the project with 15 days written notice.',
          'In case of cancellation by the client, work completed to date will be charged.',
          'Advance payments are non-refundable but will be applied to completed work.',
          'We reserve the right to terminate service in case of material breach by the client.',
          'Upon project termination, we will deliver all work completed to that date.'
        ]
      },
      {
        title: "13. Applicable Law and Jurisdiction",
        content: [
          'These terms are governed by the laws of Mexico.',
          'Any dispute will be resolved in the competent courts of Guadalajara, Jalisco, Mexico.',
          'The parties will attempt to resolve any dispute through direct negotiation before resorting to legal proceedings.',
          'In case of controversy, the parties may opt for mediation or arbitration before litigation.'
        ]
      },
      {
        title: "14. General Provisions",
        content: [
          'If any provision of these terms is declared invalid, the rest shall remain in full force.',
          'These terms constitute the complete agreement between the parties regarding the services.',
          'Any modification must be made in writing and signed by both parties.',
          'Failure to exercise any right does not constitute a waiver thereof.',
          'These terms are effective from January 1, 2024.'
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
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              {language === 'es' ? 'Términos de Servicio' : 'Terms of Service'}
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 leading-relaxed">
              {language === 'es' 
                ? 'Condiciones generales que rigen el uso de nuestros servicios profesionales de desarrollo tecnológico'
                : 'General conditions governing the use of our professional technology development services'
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
                  ? 'Bienvenido a Code Solutions Studio. Estos Términos de Servicio ("Términos") rigen el uso de nuestros servicios profesionales de desarrollo tecnológico. Al contratar nuestros servicios, usted acepta estar sujeto a estos términos y condiciones.'
                  : 'Welcome to Code Solutions Studio. These Terms of Service ("Terms") govern the use of our professional technology development services. By contracting our services, you agree to be bound by these terms and conditions.'
                }
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <p className="text-blue-800 font-medium">
                  {language === 'es' 
                    ? 'Es importante que lea cuidadosamente estos términos antes de utilizar nuestros servicios. Si tiene alguna pregunta, no dude en contactarnos.'
                    : 'It is important that you carefully read these terms before using our services. If you have any questions, please do not hesitate to contact us.'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Terms Sections */}
          <div className="space-y-6">
            {currentSections.map((section, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 sm:px-8 py-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    {section.title}
                  </h2>
                </div>
                <div className="p-6 sm:p-8">
                  <div className="prose prose-gray max-w-none">
                    {section.content.map((paragraph, pIndex) => (
                      <p key={pIndex} className="text-gray-700 leading-relaxed mb-4 last:mb-0">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg p-6 sm:p-8 mt-12 text-white text-center">
            <h3 className="text-xl sm:text-2xl font-bold mb-4">
              {language === 'es' ? '¿Tienes preguntas?' : 'Have questions?'}
            </h3>
            <p className="text-blue-100 mb-6">
              {language === 'es' 
                ? 'Si necesitas aclarar alguno de estos términos, nuestro equipo está disponible para ayudarte.'
                : 'If you need clarification on any of these terms, our team is available to help you.'
              }
            </p>
            <a 
              href="/contact" 
              className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200"
            >
              {language === 'es' ? 'Contáctanos' : 'Contact Us'}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

