'use client'

import { 
  FileText, User, Calendar, MessageSquare, DollarSign,
  CheckCircle, Clock, AlertCircle, TrendingUp
} from 'lucide-react'

interface RecentActivity {
  id: string
  type: 'quote' | 'project' | 'user' | 'message' | 'payment'
  title: string
  description: string
  timestamp: string
  status?: string
  user?: {
    name: string
    email: string
  }
}

interface AdminActivityFeedProps {
  activities: RecentActivity[]
}

export default function AdminActivityFeed({ activities }: AdminActivityFeedProps) {
  const getActivityIcon = (type: string, status?: string) => {
    switch (type) {
      case 'quote':
        return status === 'approved' ? CheckCircle : FileText
      case 'project':
        return Calendar
      case 'user':
        return User
      case 'message':
        return MessageSquare
      case 'payment':
        return DollarSign
      default:
        return AlertCircle
    }
  }

  const getActivityColor = (type: string, status?: string) => {
    switch (type) {
      case 'quote':
        return status === 'approved' ? 'text-green-600 bg-green-100' : 'text-blue-600 bg-blue-100'
      case 'project':
        return 'text-purple-600 bg-purple-100'
      case 'user':
        return 'text-indigo-600 bg-indigo-100'
      case 'message':
        return 'text-orange-600 bg-orange-100'
      case 'payment':
        return 'text-emerald-600 bg-emerald-100'
      default:
        return 'text-secondary-600 bg-secondary-100'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Ahora mismo'
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`
    if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)} horas`
    if (diffInMinutes < 10080) return `Hace ${Math.floor(diffInMinutes / 1440)} días`
    
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTypeLabel = (type: string) => {
    const labels = {
      quote: 'Cotización',
      project: 'Proyecto',
      user: 'Usuario',
      message: 'Mensaje',
      payment: 'Pago'
    }
    return labels[type as keyof typeof labels] || type
  }

  // No mock data - use only real data from API
  const displayActivities = activities

  return (
    <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
      <div className="p-6 border-b border-secondary-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-secondary-900">
            Actividad Reciente
          </h3>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-secondary-400" />
            <span className="text-sm text-secondary-500">Últimas 24 horas</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {displayActivities.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="mx-auto h-12 w-12 text-secondary-300" />
            <h3 className="mt-4 text-sm font-medium text-secondary-900">
              No hay actividad reciente
            </h3>
            <p className="mt-2 text-sm text-secondary-500">
              Las actividades aparecerán aquí cuando ocurran eventos en el sistema.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayActivities.slice(0, 10).map((activity, index) => {
              const Icon = getActivityIcon(activity.type, activity.status)
              const colorClasses = getActivityColor(activity.type, activity.status)
              
              return (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${colorClasses}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-secondary-900">
                        {activity.title}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-600">
                          {getTypeLabel(activity.type)}
                        </span>
                        <span className="text-xs text-secondary-400">
                          {formatTimestamp(activity.timestamp)}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-secondary-600 mt-1">
                      {activity.description}
                    </p>
                    
                    {activity.user && (
                      <div className="flex items-center mt-2">
                        <div className="w-5 h-5 bg-primary-100 rounded-full flex items-center justify-center mr-2">
                          <span className="text-xs font-medium text-primary-600">
                            {activity.user.name.charAt(0)}
                          </span>
                        </div>
                        <span className="text-xs text-secondary-500">
                          {activity.user.name} ({activity.user.email})
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {displayActivities.length > 10 && (
          <div className="mt-6 text-center">
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Ver todas las actividades
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
