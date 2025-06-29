'use client'

import BackToTop from '@/components/BackToTop'
import { useLanguage } from '@/app/providers'
import Link from 'next/link'
import { 
  Users, 
  Award, 
  Target, 
  Heart,
  Eye,
  MapPin,
  Calendar,
  CheckCircle,
  TrendingUp,
  Code,
  Server,
  Smartphone,
  Cloud,
  ArrowRight,
  Globe,
  Lightbulb,
  Shield,
  Zap,
  Building,
  Clock,
  Coffee,
  Rocket,
  Briefcase,
  GraduationCap,
  BookOpen
} from 'lucide-react'

export default function AboutPage() {
  const { t } = useLanguage()

  const stats = [
    { number: '100+', label: t('pages.about.stats.projects'), icon: CheckCircle },
    { number: '50+', label: t('pages.about.stats.clients'), icon: Users },
    { number: '5', label: t('pages.about.stats.experience'), icon: Calendar },
    { number: '99%', label: t('pages.about.stats.satisfaction'), icon: TrendingUp },
  ]

  const technologies = [
    {
      category: t('pages.about.technologies.frontend.title'),
      description: t('pages.about.technologies.frontend.description'),
      icon: '⚛️',
      techs: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS']
    },
    {
      category: t('pages.about.technologies.backend.title'),
      description: t('pages.about.technologies.backend.description'),
      icon: '🚀',
      techs: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB']
    },
    {
      category: t('pages.about.technologies.mobile.title'),
      description: t('pages.about.technologies.mobile.description'),
      icon: '📱',
      techs: ['React Native', 'Flutter', 'iOS', 'Android']
    },
    {
      category: t('pages.about.technologies.cloud.title'),
      description: t('pages.about.technologies.cloud.description'),
      icon: '☁️',
      techs: ['AWS', 'Azure', 'Google Cloud', 'Docker']
    }
  ]

  const values = [
    {
      icon: Target,
      title: t('pages.about.values.excellence.title'),
      description: t('pages.about.values.excellence.description')
    },
    {
      icon: Users,
      title: t('pages.about.values.collaboration.title'),
      description: t('pages.about.values.collaboration.description')
    },
    {
      icon: Heart,
      title: t('pages.about.values.passion.title'),
      description: t('pages.about.values.passion.description')
    },
    {
      icon: Award,
      title: t('pages.about.values.innovation.title'),
      description: t('pages.about.values.innovation.description')
    }
  ]

  const timeline = [
    {
      year: '2019',
      title: 'Fundación de Code Solutions',
      description: 'Comenzamos como un pequeño estudio de desarrollo enfocado en soluciones web.',
      icon: Rocket,
      color: 'blue' as const
    },
    {
      year: '2020',
      title: 'Expansión de Servicios',
      description: 'Incorporamos servicios de análisis de datos y marketing digital.',
      icon: TrendingUp,
      color: 'green' as const
    },
    {
      year: '2021',
      title: 'Crecimiento del Equipo',
      description: 'Expandimos nuestro equipo y abrimos nuestra primera oficina física.',
      icon: Building,
      color: 'purple' as const
    },
    {
      year: '2022',
      title: 'Certificaciones y Reconocimientos',
      description: 'Obtuvimos certificaciones cloud y ganamos premios de excelencia.',
      icon: Award,
      color: 'orange' as const
    },
    {
      year: '2023',
      title: 'Innovación en IA',
      description: 'Incorporamos inteligencia artificial en nuestros procesos y servicios.',
      icon: Lightbulb,
      color: 'cyan' as const
    },
    {
      year: '2024',
      title: 'Presente y Futuro',
      description: 'Continuamos creciendo con nuevas tecnologías y mercados internacionales.',
      icon: Globe,
      color: 'indigo' as const
    }
  ]

  const projects = [
    {
      title: 'E-commerce Multiplataforma',
      category: 'Desarrollo Web',
      description: 'Plataforma de comercio electrónico con más de 10,000 productos y sistema de pagos integrado.',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
      metrics: ['300% aumento en ventas', '50% reducción en tiempo de carga'],
      icon: Globe,
      color: 'blue' as const
    },
    {
      title: 'Dashboard Analytics BI',
      category: 'Análisis de Datos',
      description: 'Sistema de business intelligence con visualizaciones en tiempo real para toma de decisiones.',
      technologies: ['Python', 'D3.js', 'MongoDB', 'AWS'],
      metrics: ['40% mejora en decisiones', '60% reducción en tiempo de análisis'],
      icon: TrendingUp,
      color: 'green' as const
    },
    {
      title: 'App Móvil Fintech',
      category: 'Desarrollo Móvil',
      description: 'Aplicación financiera con wallet digital y transferencias instantáneas.',
      technologies: ['React Native', 'Firebase', 'Blockchain'],
      metrics: ['100K+ descargas', '4.8/5 rating'],
      icon: Smartphone,
      color: 'purple' as const
    },
    {
      title: 'Sistema ERP Empresarial',
      category: 'Software Empresarial',
      description: 'Sistema de gestión empresarial completo para empresa de 500+ empleados.',
      technologies: ['Next.js', 'PostgreSQL', 'Docker', 'Kubernetes'],
      metrics: ['80% automatización', '30% reducción de costos'],
      icon: Building,
      color: 'orange' as const
    }
  ]

  const workProcess = [
    {
      step: '01',
      title: 'Descubrimiento',
      description: 'Analizamos tus necesidades y objetivos para crear la estrategia perfecta.',
      icon: Lightbulb,
      duration: '1-2 semanas'
    },
    {
      step: '02',
      title: 'Planificación',
      description: 'Diseñamos la arquitectura y definimos los entregables con cronograma detallado.',
      icon: BookOpen,
      duration: '1 semana'
    },
    {
      step: '03',
      title: 'Desarrollo',
      description: 'Implementamos la solución con metodologías ágiles y revisiones constantes.',
      icon: Code,
      duration: '2-8 semanas'
    },
    {
      step: '04',
      title: 'Testing',
      description: 'Realizamos pruebas exhaustivas para garantizar calidad y rendimiento óptimo.',
      icon: CheckCircle,
      duration: '1 semana'
    },
    {
      step: '05',
      title: 'Lanzamiento',
      description: 'Desplegamos la solución con monitoreo en tiempo real y soporte completo.',
      icon: Rocket,
      duration: '1 semana'
    },
    {
      step: '06',
      title: 'Soporte',
      description: 'Brindamos mantenimiento continuo y actualizaciones para máximo rendimiento.',
      icon: Shield,
      duration: 'Continuo'
    }
  ]
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-32 lg:py-40 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-8">
              {t('pages.about.hero.title')} <span className="text-blue-400">{t('pages.about.hero.titleHighlight')}</span>
            </h1>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              {t('pages.about.hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center sm:space-x-12 space-y-4 sm:space-y-0 text-gray-300">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-400" />
                <span>{t('pages.about.hero.location')}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-400" />
                <span>{t('pages.about.hero.founded')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 sm:p-12 lg:p-16 text-white shadow-2xl">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-white mb-4">
                  {t('pages.about.stats.title')}
                </h2>
                <p className="text-xl text-blue-100">
                  {t('pages.about.stats.subtitle')}
                </p>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <div key={index} className="text-center">
                      <div className="inline-flex p-4 rounded-2xl bg-white/20 text-white mb-6 backdrop-blur-sm">
                        <Icon className="w-8 h-8" />
                      </div>
                      <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                      <div className="text-blue-100">{stat.label}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {t('pages.about.mission.title')}
              </h2>
              <p className="text-xl text-gray-600">
                {t('pages.about.mission.subtitle')}
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:-translate-y-3 group">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">{t('pages.about.mission.mission.title')}</h3>
                <p className="text-gray-600 leading-relaxed text-center text-lg">
                  {t('pages.about.mission.mission.description')}
                </p>
              </div>
              
              <div className="bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:-translate-y-3 group">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
                  <Eye className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">{t('pages.about.mission.vision.title')}</h3>
                <p className="text-gray-600 leading-relaxed text-center text-lg">
                  {t('pages.about.mission.vision.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('pages.about.values.title')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('pages.about.values.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              const gradients = [
                'from-blue-500 to-blue-600',
                'from-cyan-500 to-cyan-600', 
                'from-indigo-500 to-indigo-600',
                'from-teal-500 to-teal-600'
              ]
              return (
                <div key={index} className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:-translate-y-3 text-center group">
                  <div className={`w-20 h-20 bg-gradient-to-br ${gradients[index]} rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">{value.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>      {/* Technologies & Tools Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('pages.about.technologies.title')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('pages.about.technologies.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {technologies.map((tech, index) => {
              const icons = [Code, Server, Smartphone, Cloud]
              const Icon = icons[index]
              const gradients = [
                'from-blue-500 to-blue-600',
                'from-green-500 to-green-600',
                'from-purple-500 to-purple-600', 
                'from-orange-500 to-orange-600'
              ]
              return (
                <div key={index} className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:-translate-y-3 group">
                  <div className={`w-20 h-20 bg-gradient-to-br ${gradients[index]} rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">{tech.category}</h3>
                  <p className="text-gray-600 mb-6 text-center">{tech.description}</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {tech.techs.map((techName, techIndex) => (
                      <span 
                        key={techIndex}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-blue-100 hover:text-blue-700 transition-colors duration-300"
                      >
                        {techName}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Nuestra Historia
            </h2>
            <p className="text-xl text-gray-600">
              El camino que nos llevó a donde estamos hoy
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
              
              {timeline.map((item, index) => {
                const Icon = item.icon
                const colors = {
                  blue: 'from-blue-500 to-blue-600',
                  green: 'from-green-500 to-green-600',
                  purple: 'from-purple-500 to-purple-600',
                  orange: 'from-orange-500 to-orange-600',
                  cyan: 'from-cyan-500 to-cyan-600',
                  indigo: 'from-indigo-500 to-indigo-600'
                }
                
                return (
                  <div key={index} className={`relative flex items-center mb-12 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                    {/* Content */}
                    <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                      <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:-translate-y-2">
                        <div className="text-2xl font-bold text-blue-600 mb-2">{item.year}</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                    
                    {/* Icon */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-white to-gray-50 rounded-full flex items-center justify-center shadow-xl border-4 border-white z-10">
                      <div className={`w-10 h-10 bg-gradient-to-br ${colors[item.color]} rounded-full flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Proyectos Destacados
            </h2>
            <p className="text-xl text-gray-600">
              Casos de éxito que demuestran nuestra experiencia
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {projects.map((project, index) => {
              const Icon = project.icon
              const colors = {
                blue: 'from-blue-500 to-blue-600',
                green: 'from-green-500 to-green-600',
                purple: 'from-purple-500 to-purple-600',
                orange: 'from-orange-500 to-orange-600'
              }
              
              return (
                <div key={index} className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:-translate-y-3 group">
                  <div className={`w-16 h-16 bg-gradient-to-br ${colors[project.color]} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="text-sm text-blue-600 font-semibold mb-2">{project.category}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{project.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{project.description}</p>
                  
                  <div className="mb-6">
                    <div className="text-sm font-semibold text-gray-900 mb-3">Tecnologías:</div>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, techIndex) => (
                        <span 
                          key={techIndex}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-100 pt-4">
                    <div className="text-sm font-semibold text-gray-900 mb-3">Resultados:</div>
                    <div className="space-y-2">
                      {project.metrics.map((metric, metricIndex) => (
                        <div key={metricIndex} className="flex items-center text-sm text-green-600">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          {metric}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Work Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Nuestro Proceso de Trabajo
            </h2>
            <p className="text-xl text-gray-600">
              Metodología probada para garantizar resultados excepcionales
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {workProcess.map((step, index) => {
              const Icon = step.icon
              const gradients = [
                'from-blue-500 to-blue-600',
                'from-green-500 to-green-600',
                'from-purple-500 to-purple-600',
                'from-orange-500 to-orange-600',
                'from-cyan-500 to-cyan-600',
                'from-indigo-500 to-indigo-600'
              ]
              
              return (
                <div key={index} className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:-translate-y-3 text-center group">
                  <div className={`w-20 h-20 bg-gradient-to-br ${gradients[index]} rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  
                  <div className="text-4xl font-bold text-gray-300 mb-2">{step.step}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{step.description}</p>
                  
                  <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    <Clock className="w-4 h-4 mr-2" />
                    {step.duration}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t('pages.about.cta.title')}
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              {t('pages.about.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contact"
                className="inline-flex items-center px-8 py-4 bg-white hover:bg-gray-50 text-blue-600 font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
              >
                {t('pages.about.cta.startProject')}
              </a>
              <a 
                href="/quoter"
                className="inline-flex items-center px-8 py-4 bg-transparent hover:bg-white/10 text-white font-semibold rounded-full border-2 border-white/30 hover:border-white/50 transition-all duration-300"
              >
                {t('pages.about.cta.getQuote')}
              </a>
            </div>
          </div>
        </div>
      </section>

      <BackToTop />
    </main>
  )
}

