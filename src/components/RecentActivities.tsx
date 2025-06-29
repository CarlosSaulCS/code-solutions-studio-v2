'use client'

import { useState } from 'react'
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare,
  FileText,
  User,
  Calendar,
  ExternalLink,
  Filter,
  ChevronDown,
  Package,
  Code,
  TestTube,
  Truck,
  Star
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Activity {
  id: string
  type: 'project_update' | 'quote_received' | 'quote_approved' | 'milestone' | 'comment' | 'file_upload' | 'payment'
  title: string
  description: string
  date: string
  user?: string
  projectId?: string
  projectName?: string
  metadata?: {
    status?: string
    amount?: number
    currency?: string
    fileName?: string
    milestone?: string
  }
}

interface RecentActivitiesProps {
  activities: Activity[]
  language: 'es' | 'en'
  onActivityClick?: (activity: Activity) => void
  showFilters?: boolean
  maxItems?: number
  className?: string
}

const activityIcons = {
  project_update: Code,
  quote_received: Package,
  quote_approved: CheckCircle2,
  milestone: Star,
  comment: MessageSquare,
  file_upload: FileText,
  payment: CheckCircle2
}

const activityColors = {
  project_update: 'text-blue-600 bg-blue-100',
  quote_received: 'text-purple-600 bg-purple-100',
  quote_approved: 'text-green-600 bg-green-100',
  milestone: 'text-yellow-600 bg-yellow-100',
  comment: 'text-gray-600 bg-gray-100',
  file_upload: 'text-indigo-600 bg-indigo-100',
  payment: 'text-emerald-600 bg-emerald-100'
}

export default function RecentActivities({
  activities,
  language,
  onActivityClick,
  showFilters = true,
  maxItems = 10,
  className
}: RecentActivitiesProps) {
  const [filter, setFilter] = useState<string>('all')
  const [showAll, setShowAll] = useState(false)

  const texts = {
    es: {
      title: 'Actividad Reciente',
      noActivities: 'No hay actividades recientes',
      showMore: 'Ver más actividades',
      showLess: 'Ver menos',
      filters: {
        all: 'Todas',
        project_update: 'Actualizaciones',
        quote_received: 'Cotizaciones',
        milestone: 'Hitos',
        comment: 'Comentarios'
      },
      timeAgo: {
        now: 'Ahora',
        minute: 'hace 1 minuto',
        minutes: 'hace {0} minutos',
        hour: 'hace 1 hora',
        hours: 'hace {0} horas',
        day: 'hace 1 día',
        days: 'hace {0} días',
        week: 'hace 1 semana',
        weeks: 'hace {0} semanas'
      }
    },
    en: {
      title: 'Recent Activity',
      noActivities: 'No recent activities',
      showMore: 'Show more activities',
      showLess: 'Show less',
      filters: {
        all: 'All',
        project_update: 'Updates',
        quote_received: 'Quotes',
        milestone: 'Milestones',
        comment: 'Comments'
      },
      timeAgo: {
        now: 'Now',
        minute: '1 minute ago',
        minutes: '{0} minutes ago',
        hour: '1 hour ago',
        hours: '{0} hours ago',
        day: '1 day ago',
        days: '{0} days ago',
        week: '1 week ago',
        weeks: '{0} weeks ago'
      }
    }
  }

  const t = texts[language]

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return t.timeAgo.now
    if (diffInMinutes < 60) {
      return diffInMinutes === 1 
        ? t.timeAgo.minute 
        : t.timeAgo.minutes.replace('{0}', diffInMinutes.toString())
    }

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) {
      return diffInHours === 1 
        ? t.timeAgo.hour 
        : t.timeAgo.hours.replace('{0}', diffInHours.toString())
    }

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) {
      return diffInDays === 1 
        ? t.timeAgo.day 
        : t.timeAgo.days.replace('{0}', diffInDays.toString())
    }

    const diffInWeeks = Math.floor(diffInDays / 7)
    return diffInWeeks === 1 
      ? t.timeAgo.week 
      : t.timeAgo.weeks.replace('{0}', diffInWeeks.toString())
  }

  const filteredActivities = activities.filter(activity => 
    filter === 'all' || activity.type === filter
  )

  const displayedActivities = showAll 
    ? filteredActivities 
    : filteredActivities.slice(0, maxItems)

  const filters = [
    { value: 'all', label: t.filters.all },
    { value: 'project_update', label: t.filters.project_update },
    { value: 'quote_received', label: t.filters.quote_received },
    { value: 'milestone', label: t.filters.milestone },
    { value: 'comment', label: t.filters.comment }
  ]

  return (
    <div className={cn("bg-white rounded-xl border border-gray-200", className)}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{t.title}</h3>
          
          {showFilters && (
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="text-sm border-gray-200 rounded-md focus:ring-primary-500 focus:border-primary-500"
              >
                {filters.map((filterOption) => (
                  <option key={filterOption.value} value={filterOption.value}>
                    {filterOption.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Activities List */}
      <div className="p-6">
        {displayedActivities.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">{t.noActivities}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedActivities.map((activity, index) => {
              const Icon = activityIcons[activity.type] || MessageSquare
              const colorClass = activityColors[activity.type] || 'text-gray-600 bg-gray-100'

              return (
                <div
                  key={activity.id}
                  className={cn(
                    "flex items-start gap-4 p-4 rounded-lg border border-gray-100 transition-all duration-200",
                    onActivityClick 
                      ? "cursor-pointer hover:bg-gray-50 hover:border-gray-200 hover:shadow-sm" 
                      : "",
                    index === 0 ? "ring-2 ring-primary-100 bg-primary-50/30" : "bg-white"
                  )}
                  onClick={() => onActivityClick?.(activity)}
                >
                  {/* Icon */}
                  <div className={cn(
                    "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
                    colorClass
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 mb-1">
                          {activity.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {activity.description}
                        </p>
                        
                        {/* Metadata */}
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {getTimeAgo(activity.date)}
                          </div>
                          
                          {activity.user && (
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {activity.user}
                            </div>
                          )}
                          
                          {activity.projectName && (
                            <div className="flex items-center gap-1">
                              <Package className="h-3 w-3" />
                              {activity.projectName}
                            </div>
                          )}
                          
                          {activity.metadata?.amount && (
                            <div className="flex items-center gap-1 text-green-600">
                              <span>
                                {activity.metadata.currency} {activity.metadata.amount.toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {onActivityClick && (
                        <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Show More Button */}
        {filteredActivities.length > maxItems && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
            >
              {showAll ? t.showLess : t.showMore}
              <ChevronDown className={cn(
                "h-4 w-4 transition-transform",
                showAll ? "rotate-180" : ""
              )} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
