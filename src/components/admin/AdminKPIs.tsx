'use client'

import { 
  Users, FileText, Calendar, DollarSign, TrendingUp, 
  CheckCircle, Clock, AlertTriangle, Target, ArrowUpRight, ArrowDownRight
} from 'lucide-react'

interface DashboardStats {
  totalUsers: number
  totalQuotes: number
  totalProjects: number
  totalRevenue: number
  pendingQuotes: number
  activeProjects: number
  unreadMessages: number
  conversionRate: number
  monthlyGrowth: number
}

interface AdminKPIsProps {
  stats: DashboardStats | null
}

export default function AdminKPIs({ stats }: AdminKPIsProps) {
  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
            <div className="animate-pulse">
              <div className="flex items-center justify-between">
                <div className="h-4 bg-secondary-200 rounded w-1/2"></div>
                <div className="h-8 w-8 bg-secondary-200 rounded-lg"></div>
              </div>
              <div className="mt-4 h-8 bg-secondary-200 rounded w-3/4"></div>
              <div className="mt-2 h-4 bg-secondary-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const kpis = [
    {
      id: 'users',
      title: 'Usuarios Totales',
      value: stats.totalUsers || 0,
      change: stats.totalUsers > 0 ? '+0%' : 'Sin usuarios',
      changeType: 'neutral' as const,
      icon: Users,
      color: 'blue',
      description: 'Usuarios registrados'
    },
    {
      id: 'quotes',
      title: 'Cotizaciones',
      value: stats.totalQuotes || 0,
      change: `${stats.pendingQuotes || 0} pendientes`,
      changeType: 'neutral' as const,
      icon: FileText,
      color: 'purple',
      description: 'Total de cotizaciones'
    },
    {
      id: 'projects',
      title: 'Proyectos',
      value: stats.totalProjects || 0,
      change: `${stats.activeProjects || 0} activos`,
      changeType: 'positive' as const,
      icon: Calendar,
      color: 'green',
      description: 'Proyectos en total'
    },
    {
      id: 'revenue',
      title: 'Ingresos',
      value: `$${Math.max(0, (stats.totalRevenue || 0) / 1000).toFixed(0)}K`,
      change: `+${Math.max(0, stats.monthlyGrowth || 0)}%`,
      changeType: (stats.monthlyGrowth || 0) > 0 ? 'positive' as const : 'negative' as const,
      icon: DollarSign,
      color: 'emerald',
      description: 'Ingresos totales'
    },
    {
      id: 'conversion',
      title: 'Conversión',
      value: `${stats.conversionRate || 0}%`,
      change: stats.conversionRate > 0 ? '+0%' : 'Sin datos',
      changeType: 'neutral' as const,
      icon: Target,
      color: 'orange',
      description: 'Tasa de conversión'
    },
    {
      id: 'pending',
      title: 'Pendientes',
      value: stats.pendingQuotes || 0,
      change: 'Requieren atención',
      changeType: (stats.pendingQuotes || 0) > 5 ? 'negative' as const : 'neutral' as const,
      icon: Clock,
      color: 'yellow',
      description: 'Cotizaciones pendientes'
    },
    {
      id: 'messages',
      title: 'Mensajes',
      value: stats.unreadMessages || 0,
      change: 'Sin leer',
      changeType: (stats.unreadMessages || 0) > 0 ? 'negative' as const : 'positive' as const,
      icon: AlertTriangle,
      color: 'red',
      description: 'Mensajes no leídos'
    },
    {
      id: 'growth',
      title: 'Crecimiento',
      value: `${stats.monthlyGrowth >= 0 ? '+' : ''}${Math.round(stats.monthlyGrowth || 0)}%`,
      change: 'Este mes',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'indigo',
      description: 'Crecimiento mensual'
    }
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      purple: 'bg-purple-100 text-purple-600',
      green: 'bg-green-100 text-green-600',
      emerald: 'bg-emerald-100 text-emerald-600',
      orange: 'bg-orange-100 text-orange-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      red: 'bg-red-100 text-red-600',
      indigo: 'bg-indigo-100 text-indigo-600'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  const getChangeIcon = (changeType: 'positive' | 'negative' | 'neutral') => {
    switch (changeType) {
      case 'positive':
        return <ArrowUpRight className="w-4 h-4 text-green-500" />
      case 'negative':
        return <ArrowDownRight className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  const getChangeTextColor = (changeType: 'positive' | 'negative' | 'neutral') => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600'
      case 'negative':
        return 'text-red-600'
      default:
        return 'text-secondary-500'
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {kpis.map((kpi) => {
        const Icon = kpi.icon
        
        return (
          <div
            key={kpi.id}
            className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-secondary-600 mb-1">
                  {kpi.title}
                </p>
                <p className="text-2xl font-bold text-secondary-900">
                  {kpi.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${getColorClasses(kpi.color)}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-1">
                {getChangeIcon(kpi.changeType)}
                <span className={`text-sm font-medium ${getChangeTextColor(kpi.changeType)}`}>
                  {kpi.change}
                </span>
              </div>
              <span className="text-xs text-secondary-400">
                {kpi.description}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
