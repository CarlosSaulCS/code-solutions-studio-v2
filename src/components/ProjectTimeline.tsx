'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { 
  CheckCircle2, 
  Clock, 
  Play, 
  Code, 
  TestTube, 
  Rocket, 
  Package,
  Truck,
  Star,
  AlertCircle,
  Calendar,
  User,
  MessageSquare,
  FileText,
  ChevronDown,
  ChevronRight,
  ExternalLink
} from 'lucide-react'

export type ProjectStatusType = 
  | 'QUOTE_RECEIVED'
  | 'QUOTE_APPROVED'
  | 'PLANNING'
  | 'DEVELOPMENT'
  | 'TESTING'
  | 'REVIEW'
  | 'DELIVERY'
  | 'COMPLETED'
  | 'ON_HOLD'
  | 'CANCELLED'

interface TimelineEvent {
  id: string
  type: 'milestone' | 'update' | 'comment' | 'file'
  title: string
  description: string
  date: string
  user?: string
  status?: ProjectStatusType
  attachments?: { name: string; url: string }[]
}

interface ProjectStep {
  id: ProjectStatusType
  title: string
  titleEn: string
  description: string
  descriptionEn: string
  icon: React.ComponentType<any>
  estimatedDays?: number
  actualDays?: number
  completedAt?: string
  events?: TimelineEvent[]
}

const projectSteps: ProjectStep[] = [
  {
    id: 'QUOTE_RECEIVED',
    title: 'Cotización Recibida',
    titleEn: 'Quote Received',
    description: 'Hemos recibido tu solicitud de cotización',
    descriptionEn: 'We have received your quote request',
    icon: Package,
    estimatedDays: 0
  },
  {
    id: 'QUOTE_APPROVED',
    title: 'Cotización Aprobada',
    titleEn: 'Quote Approved',
    description: 'Cotización aprobada y pago confirmado',
    descriptionEn: 'Quote approved and payment confirmed',
    icon: CheckCircle2,
    estimatedDays: 1
  },
  {
    id: 'PLANNING',
    title: 'Planificación',
    titleEn: 'Planning',
    description: 'Análisis de requisitos y diseño de arquitectura',
    descriptionEn: 'Requirements analysis and architecture design',
    icon: Play,
    estimatedDays: 3
  },
  {
    id: 'DEVELOPMENT',
    title: 'Desarrollo',
    titleEn: 'Development',
    description: 'Codificación e implementación de funcionalidades',
    descriptionEn: 'Coding and feature implementation',
    icon: Code,
    estimatedDays: 15
  },
  {
    id: 'TESTING',
    title: 'Pruebas',
    titleEn: 'Testing',
    description: 'Pruebas de calidad y corrección de errores',
    descriptionEn: 'Quality testing and bug fixes',
    icon: TestTube,
    estimatedDays: 5
  },
  {
    id: 'REVIEW',
    title: 'Revisión',
    titleEn: 'Review',
    description: 'Revisión del cliente y ajustes finales',
    descriptionEn: 'Client review and final adjustments',
    icon: AlertCircle,
    estimatedDays: 3
  },
  {
    id: 'DELIVERY',
    title: 'Entrega',
    titleEn: 'Delivery',
    description: 'Despliegue y entrega del proyecto',
    descriptionEn: 'Deployment and project delivery',
    icon: Truck,
    estimatedDays: 2
  },
  {
    id: 'COMPLETED',
    title: 'Completado',
    titleEn: 'Completed',
    description: 'Proyecto entregado exitosamente',
    descriptionEn: 'Project successfully delivered',
    icon: Star,
    estimatedDays: 0
  }
]

interface ProjectTimelineProps {
  currentStatus: ProjectStatusType
  projectId: string
  projectName: string
  startDate?: string
  estimatedEndDate?: string
  actualEndDate?: string
  events?: TimelineEvent[]
  language?: 'es' | 'en'
  showDetailed?: boolean
  className?: string
}

export default function ProjectTimeline({
  currentStatus,
  projectId,
  projectName,
  startDate,
  estimatedEndDate,
  actualEndDate,
  events = [],
  language = 'es',
  showDetailed = true,
  className
}: ProjectTimelineProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set())
  const [showAllEvents, setShowAllEvents] = useState(false)

  const toggleStepExpansion = (stepId: string) => {
    const newExpanded = new Set(expandedSteps)
    if (newExpanded.has(stepId)) {
      newExpanded.delete(stepId)
    } else {
      newExpanded.add(stepId)
    }
    setExpandedSteps(newExpanded)
  }

  const getCurrentStepIndex = () => {
    return projectSteps.findIndex(step => step.id === currentStatus)
  }

  const getStepStatus = (stepIndex: number) => {
    const currentIndex = getCurrentStepIndex()
    if (stepIndex < currentIndex) return 'completed'
    if (stepIndex === currentIndex) return 'current'
    return 'pending'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      language === 'es' ? 'es-ES' : 'en-US',
      { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    )
  }

  const getEstimatedDate = (stepIndex: number) => {
    if (!startDate) return null
    
    const start = new Date(startDate)
    let totalDays = 0
    
    for (let i = 0; i <= stepIndex; i++) {
      totalDays += projectSteps[i].estimatedDays || 0
    }
    
    const estimated = new Date(start)
    estimated.setDate(estimated.getDate() + totalDays)
    return estimated
  }

  const getProgressPercentage = () => {
    const currentIndex = getCurrentStepIndex()
    const totalSteps = projectSteps.length
    return Math.round(((currentIndex + 1) / totalSteps) * 100)
  }

  const stepEvents = events.filter(event => 
    event.status && projectSteps.some(step => step.id === event.status)
  )

  return (
    <div className={cn("space-y-6", className)}>
      {/* Progress Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{projectName}</h3>
            <p className="text-sm text-gray-600">
              {language === 'es' ? 'Progreso del Proyecto' : 'Project Progress'}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary-600">
              {getProgressPercentage()}%
            </div>
            <div className="text-sm text-gray-500">
              {language === 'es' ? 'Completado' : 'Complete'}
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div 
            className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>

        {/* Project Dates */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          {startDate && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">
                {language === 'es' ? 'Inicio: ' : 'Start: '}
                {formatDate(startDate)}
              </span>
            </div>
          )}
          {estimatedEndDate && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">
                {language === 'es' ? 'Est. Fin: ' : 'Est. End: '}
                {formatDate(estimatedEndDate)}
              </span>
            </div>
          )}
          {actualEndDate && (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-gray-600">
                {language === 'es' ? 'Finalizado: ' : 'Completed: '}
                {formatDate(actualEndDate)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Timeline Steps */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-6">
          {language === 'es' ? 'Cronograma del Proyecto' : 'Project Timeline'}
        </h4>
        
        <div className="space-y-4">
          {projectSteps.map((step, index) => {
            const status = getStepStatus(index)
            const Icon = step.icon
            const hasEvents = stepEvents.filter(e => e.status === step.id).length > 0
            const isExpanded = expandedSteps.has(step.id)
            const estimatedDate = getEstimatedDate(index)

            return (
              <div key={step.id} className="relative">
                {/* Timeline Line */}
                {index < projectSteps.length - 1 && (
                  <div className={cn(
                    "absolute left-6 top-12 w-0.5 h-16 transition-colors",
                    status === 'completed' 
                      ? 'bg-green-400' 
                      : status === 'current'
                      ? 'bg-gradient-to-b from-primary-400 to-gray-200'
                      : 'bg-gray-200'
                  )} />
                )}

                {/* Step Container */}
                <div className={cn(
                  "flex items-start gap-4 p-4 rounded-lg border transition-all duration-200",
                  status === 'completed' 
                    ? 'bg-green-50 border-green-200' 
                    : status === 'current'
                    ? 'bg-primary-50 border-primary-200 shadow-sm'
                    : 'bg-gray-50 border-gray-200',
                  showDetailed && hasEvents ? 'cursor-pointer hover:shadow-md' : ''
                )}>
                  {/* Icon */}
                  <div className={cn(
                    "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                    status === 'completed' 
                      ? 'bg-green-500 text-white' 
                      : status === 'current'
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  )}>
                    <Icon className="h-6 w-6" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => showDetailed && hasEvents && toggleStepExpansion(step.id)}
                    >
                      <div>
                        <h5 className={cn(
                          "font-medium transition-colors",
                          status === 'completed' 
                            ? 'text-green-900' 
                            : status === 'current'
                            ? 'text-primary-900'
                            : 'text-gray-600'
                        )}>
                          {language === 'es' ? step.title : step.titleEn}
                        </h5>
                        <p className="text-sm text-gray-600 mt-1">
                          {language === 'es' ? step.description : step.descriptionEn}
                        </p>
                        
                        {/* Dates and Duration */}
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          {step.estimatedDays && step.estimatedDays > 0 && (
                            <span>
                              {language === 'es' ? 'Duración est.: ' : 'Est. duration: '}
                              {step.estimatedDays} {language === 'es' ? 'días' : 'days'}
                            </span>
                          )}
                          {estimatedDate && status !== 'completed' && (
                            <span>
                              {language === 'es' ? 'Fecha est.: ' : 'Est. date: '}
                              {estimatedDate.toLocaleDateString(
                                language === 'es' ? 'es-ES' : 'en-US',
                                { month: 'short', day: 'numeric' }
                              )}
                            </span>
                          )}
                          {step.completedAt && (
                            <span className="text-green-600">
                              {language === 'es' ? 'Completado: ' : 'Completed: '}
                              {formatDate(step.completedAt)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Expand Button */}
                      {showDetailed && hasEvents && (
                        <button className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600">
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Expanded Events */}
                    {showDetailed && isExpanded && hasEvents && (
                      <div className="mt-4 pl-4 border-l-2 border-gray-200 space-y-3">
                        {stepEvents
                          .filter(e => e.status === step.id)
                          .slice(0, showAllEvents ? undefined : 3)
                          .map((event) => (
                            <div key={event.id} className="bg-white p-3 rounded-lg border border-gray-100">
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0">
                                  {event.type === 'milestone' && <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />}
                                  {event.type === 'update' && <MessageSquare className="h-4 w-4 text-blue-500 mt-0.5" />}
                                  {event.type === 'comment' && <User className="h-4 w-4 text-gray-500 mt-0.5" />}
                                  {event.type === 'file' && <FileText className="h-4 w-4 text-purple-500 mt-0.5" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h6 className="text-sm font-medium text-gray-900">{event.title}</h6>
                                  <p className="text-xs text-gray-600 mt-1">{event.description}</p>
                                  <div className="flex items-center justify-between mt-2">
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                      <Calendar className="h-3 w-3" />
                                      {formatDate(event.date)}
                                      {event.user && (
                                        <>
                                          <User className="h-3 w-3 ml-2" />
                                          {event.user}
                                        </>
                                      )}
                                    </div>
                                    {event.attachments && event.attachments.length > 0 && (
                                      <button className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1">
                                        <FileText className="h-3 w-3" />
                                        {event.attachments.length} {language === 'es' ? 'archivos' : 'files'}
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        
                        {stepEvents.filter(e => e.status === step.id).length > 3 && (
                          <button
                            onClick={() => setShowAllEvents(!showAllEvents)}
                            className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                          >
                            {showAllEvents 
                              ? (language === 'es' ? 'Ver menos' : 'Show less')
                              : (language === 'es' ? 'Ver más eventos' : 'Show more events')
                            }
                            <ExternalLink className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
