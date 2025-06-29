'use client'

import { useState } from 'react'
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Calendar,
  DollarSign,
  User,
  Package,
  TrendingUp,
  Eye,
  ExternalLink,
  Filter,
  Search,
  Grid3X3,
  List,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import ProjectTimeline from './ProjectTimeline'

interface Project {
  id: string
  quoteId?: string
  userId: string
  title: string
  description?: string
  serviceType: string
  packageType: string
  status: string
  progress: number
  budget: number
  startDate?: string
  estimatedEndDate?: string
  actualEndDate?: string
  statusNotes?: string
  createdAt: string
  updatedAt: string
  user?: {
    name: string | null
    email: string
  }
  quote?: {
    serviceType: string
    packageType: string
    totalPrice: number
    currency: string
  }
}

interface ProjectsOverviewProps {
  projects: Project[]
  language: 'es' | 'en'
  currency: string
  formatPrice: (price: number, currency: string) => string
  onProjectClick?: (project: Project) => void
  className?: string
}

const statusConfig = {
  QUOTE_RECEIVED: {
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: Package,
    es: 'Cotización Recibida',
    en: 'Quote Received'
  },
  QUOTE_APPROVED: {
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle2,
    es: 'Cotización Aprobada',
    en: 'Quote Approved'
  },
  PLANNING: {
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: Calendar,
    es: 'Planificación',
    en: 'Planning'
  },
  DEVELOPMENT: {
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Clock,
    es: 'En Desarrollo',
    en: 'In Development'
  },
  TESTING: {
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    icon: AlertCircle,
    es: 'Pruebas',
    en: 'Testing'
  },
  REVIEW: {
    color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    icon: Eye,
    es: 'Revisión',
    en: 'Review'
  },
  DELIVERY: {
    color: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    icon: TrendingUp,
    es: 'Entrega',
    en: 'Delivery'
  },
  COMPLETED: {
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    icon: CheckCircle2,
    es: 'Completado',
    en: 'Completed'
  },
  ON_HOLD: {
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: Clock,
    es: 'En Pausa',
    en: 'On Hold'
  },
  CANCELLED: {
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: AlertCircle,
    es: 'Cancelado',
    en: 'Cancelled'
  }
}

export default function ProjectsOverview({
  projects,
  language,
  currency,
  formatPrice,
  onProjectClick,
  className
}: ProjectsOverviewProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const texts = {
    es: {
      title: 'Proyectos',
      noProjects: 'No tienes proyectos activos',
      searchPlaceholder: 'Buscar proyectos...',
      allStatuses: 'Todos los estados',
      viewDetails: 'Ver detalles',
      progress: 'Progreso',
      budget: 'Presupuesto',
      startDate: 'Fecha de inicio',
      endDate: 'Fecha estimada de fin',
      actualEndDate: 'Fecha real de fin',
      daysRemaining: 'días restantes',
      daysOverdue: 'días de retraso',
      completed: 'completado',
      service: 'Servicio',
      package: 'Paquete',
      timeline: 'Cronograma'
    },
    en: {
      title: 'Projects',
      noProjects: 'You have no active projects',
      searchPlaceholder: 'Search projects...',
      allStatuses: 'All statuses',
      viewDetails: 'View details',
      progress: 'Progress',
      budget: 'Budget',
      startDate: 'Start date',
      endDate: 'Estimated end date',
      actualEndDate: 'Actual end date',
      daysRemaining: 'days remaining',
      daysOverdue: 'days overdue',
      completed: 'completed',
      service: 'Service',
      package: 'Package',
      timeline: 'Timeline'
    }
  }

  const t = texts[language]

  const getServiceName = (serviceType: string) => {
    const services: Record<string, { es: string; en: string }> = {
      WEB: { es: 'Desarrollo Web', en: 'Web Development' },
      MOBILE: { es: 'Apps Móviles', en: 'Mobile Apps' },
      ECOMMERCE: { es: 'E-commerce', en: 'E-commerce' },
      CLOUD: { es: 'Migración a la Nube', en: 'Cloud Migration' },
      AI: { es: 'Inteligencia Artificial', en: 'Artificial Intelligence' },
      CONSULTING: { es: 'Consultoría TI', en: 'IT Consulting' }
    }
    return services[serviceType]?.[language] || serviceType
  }

  const getPackageName = (packageType: string) => {
    const packages: Record<string, string> = {
      STARTUP: 'Startup',
      BUSINESS: 'Business',
      ENTERPRISE: 'Enterprise',
      CUSTOM: language === 'es' ? 'Personalizado' : 'Custom'
    }
    return packages[packageType] || packageType
  }

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    const diffTime = end.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getServiceName(project.serviceType).toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const uniqueStatuses = Array.from(new Set(projects.map(p => p.status)))

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      language === 'es' ? 'es-ES' : 'en-US',
      { year: 'numeric', month: 'short', day: 'numeric' }
    )
  }

  if (selectedProject) {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setSelectedProject(null)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
            {language === 'es' ? 'Volver a proyectos' : 'Back to projects'}
          </button>
        </div>
        
        <ProjectTimeline
          currentStatus={selectedProject.status as any}
          projectId={selectedProject.id}
          projectName={selectedProject.title}
          startDate={selectedProject.startDate}
          estimatedEndDate={selectedProject.estimatedEndDate}
          actualEndDate={selectedProject.actualEndDate}
          language={language}
          showDetailed={true}
        />
      </div>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h3 className="text-lg font-semibold text-gray-900">{t.title}</h3>
        
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">{t.allStatuses}</option>
            {uniqueStatuses.map(status => (
              <option key={status} value={status}>
                {statusConfig[status as keyof typeof statusConfig]?.[language] || status}
              </option>
            ))}
          </select>
          
          {/* View Toggle */}
          <div className="flex border border-gray-200 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-2 rounded transition-colors",
                viewMode === 'grid'
                  ? "bg-primary-100 text-primary-600"
                  : "text-gray-400 hover:text-gray-600"
              )}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "p-2 rounded transition-colors",
                viewMode === 'list'
                  ? "bg-primary-100 text-primary-600"
                  : "text-gray-400 hover:text-gray-600"
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Projects Grid/List */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">{t.noProjects}</p>
        </div>
      ) : (
        <div className={cn(
          viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
        )}>
          {filteredProjects.map((project) => {
            const status = statusConfig[project.status as keyof typeof statusConfig]
            const StatusIcon = status?.icon || Package
            const daysRemaining = project.estimatedEndDate ? getDaysRemaining(project.estimatedEndDate) : null

            if (viewMode === 'list') {
              return (
                <div
                  key={project.id}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all duration-200 cursor-pointer"
                  onClick={() => onProjectClick ? onProjectClick(project) : setSelectedProject(project)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">{project.title}</h4>
                        <span className={cn(
                          "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border",
                          status?.color || 'bg-gray-100 text-gray-800 border-gray-200'
                        )}>
                          <StatusIcon className="h-3 w-3" />
                          {status?.[language] || project.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">{t.service}:</span> {getServiceName(project.serviceType)}
                        </div>
                        <div>
                          <span className="font-medium">{t.budget}:</span> {currency} {formatPrice(project.budget, currency)}
                        </div>
                        <div>
                          <span className="font-medium">{t.progress}:</span> {project.progress}%
                        </div>
                        {project.estimatedEndDate && (
                          <div>
                            <span className="font-medium">{t.endDate}:</span> {formatDate(project.estimatedEndDate)}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <ExternalLink className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              )
            }

            return (
              <div
                key={project.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                onClick={() => onProjectClick ? onProjectClick(project) : setSelectedProject(project)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                      {project.title}
                    </h4>
                    {project.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
                    )}
                  </div>
                  <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-primary-500 transition-colors" />
                </div>

                {/* Status Badge */}
                <div className="mb-4">
                  <span className={cn(
                    "inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border",
                    status?.color || 'bg-gray-100 text-gray-800 border-gray-200'
                  )}>
                    <StatusIcon className="h-4 w-4" />
                    {status?.[language] || project.status}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">{t.progress}</span>
                    <span className="font-medium text-gray-900">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Project Info */}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>{t.service}:</span>
                    <span className="font-medium">{getServiceName(project.serviceType)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>{t.package}:</span>
                    <span className="font-medium">{getPackageName(project.packageType)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>{t.budget}:</span>
                    <span className="font-medium text-green-600">
                      {currency} {formatPrice(project.budget, currency)}
                    </span>
                  </div>
                  
                  {project.estimatedEndDate && (
                    <div className="flex items-center justify-between">
                      <span>{t.endDate}:</span>
                      <div className="text-right">
                        <div className="font-medium">{formatDate(project.estimatedEndDate)}</div>
                        {daysRemaining !== null && (
                          <div className={cn(
                            "text-xs",
                            daysRemaining > 0 ? "text-green-600" : "text-red-600"
                          )}>
                            {Math.abs(daysRemaining)} {daysRemaining > 0 ? t.daysRemaining : t.daysOverdue}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
