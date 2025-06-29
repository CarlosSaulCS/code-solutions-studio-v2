'use client'

import { 
  TrendingUp, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Package,
  BarChart3,
  Calendar,
  Target
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface DashboardStats {
  totalQuotes: number
  approvedQuotes: number
  totalProjects: number
  completedProjects: number
  totalBudget: number
  averageProjectDuration: number
  activeProjects: number
  pendingQuotes: number
}

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ComponentType<any>
  trend?: {
    value: number
    isPositive: boolean
  }
  color: 'blue' | 'green' | 'yellow' | 'purple' | 'red' | 'gray'
  className?: string
}

function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  color,
  className 
}: StatsCardProps) {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      icon: 'bg-blue-500 text-white',
      text: 'text-blue-600',
      trend: 'text-blue-600'
    },
    green: {
      bg: 'bg-green-50',
      icon: 'bg-green-500 text-white',
      text: 'text-green-600',
      trend: 'text-green-600'
    },
    yellow: {
      bg: 'bg-yellow-50',
      icon: 'bg-yellow-500 text-white',
      text: 'text-yellow-600',
      trend: 'text-yellow-600'
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'bg-purple-500 text-white',
      text: 'text-purple-600',
      trend: 'text-purple-600'
    },
    red: {
      bg: 'bg-red-50',
      icon: 'bg-red-500 text-white',
      text: 'text-red-600',
      trend: 'text-red-600'
    },
    gray: {
      bg: 'bg-gray-50',
      icon: 'bg-gray-500 text-white',
      text: 'text-gray-600',
      trend: 'text-gray-600'
    }
  }

  const colors = colorClasses[color]

  return (
    <div className={cn(
      "relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 transition-all duration-200 hover:shadow-lg hover:border-gray-300",
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex h-12 w-12 items-center justify-center rounded-lg",
              colors.icon
            )}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              {subtitle && (
                <p className="text-sm text-gray-500">{subtitle}</p>
              )}
            </div>
          </div>
        </div>
        
        {trend && (
          <div className={cn(
            "flex items-center gap-1 text-sm font-medium",
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          )}>
            <TrendingUp className={cn(
              "h-4 w-4",
              !trend.isPositive && "rotate-180"
            )} />
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
      
      {/* Background decoration */}
      <div className={cn(
        "absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-10",
        colors.bg
      )} />
    </div>
  )
}

interface DashboardStatsGridProps {
  stats: DashboardStats
  currency: string
  language: 'es' | 'en'
  formatPrice: (price: number, currency: string) => string
}

export default function DashboardStatsGrid({ 
  stats, 
  currency, 
  language,
  formatPrice 
}: DashboardStatsGridProps) {
  const texts = {
    es: {
      totalQuotes: 'Cotizaciones Totales',
      approvedQuotes: 'Cotizaciones Aprobadas',
      totalProjects: 'Proyectos Totales',
      completedProjects: 'Proyectos Completados',
      totalBudget: 'Presupuesto Total',
      averageProjectDuration: 'Duración Promedio',
      activeProjects: 'Proyectos Activos',
      pendingQuotes: 'Cotizaciones Pendientes',
      days: 'días',
      inProgress: 'en progreso',
      awaiting: 'esperando aprobación',
      completed: 'completados',
      approved: 'aprobadas'
    },
    en: {
      totalQuotes: 'Total Quotes',
      approvedQuotes: 'Approved Quotes',
      totalProjects: 'Total Projects',
      completedProjects: 'Completed Projects',
      totalBudget: 'Total Budget',
      averageProjectDuration: 'Average Duration',
      activeProjects: 'Active Projects',
      pendingQuotes: 'Pending Quotes',
      days: 'days',
      inProgress: 'in progress',
      awaiting: 'awaiting approval',
      completed: 'completed',
      approved: 'approved'
    }
  }

  const t = texts[language]

  const approvalRate = stats.totalQuotes > 0 
    ? Math.round((stats.approvedQuotes / stats.totalQuotes) * 100)
    : 0

  const completionRate = stats.totalProjects > 0
    ? Math.round((stats.completedProjects / stats.totalProjects) * 100)
    : 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title={t.totalQuotes}
        value={stats.totalQuotes}
        subtitle={`${stats.approvedQuotes} ${t.approved}`}
        icon={Package}
        trend={{
          value: approvalRate,
          isPositive: approvalRate >= 70
        }}
        color="blue"
      />
      
      <StatsCard
        title={t.activeProjects}
        value={stats.activeProjects}
        subtitle={t.inProgress}
        icon={Clock}
        color="yellow"
      />
      
      <StatsCard
        title={t.completedProjects}
        value={stats.completedProjects}
        subtitle={`${stats.totalProjects} ${t.totalProjects.toLowerCase()}`}
        icon={CheckCircle2}
        trend={{
          value: completionRate,
          isPositive: completionRate >= 80
        }}
        color="green"
      />
      
      <StatsCard
        title={t.totalBudget}
        value={`${currency} ${formatPrice(stats.totalBudget, currency)}`}
        subtitle={`${stats.totalProjects} ${language === 'es' ? 'proyectos' : 'projects'}`}
        icon={DollarSign}
        color="purple"
      />
      
      <StatsCard
        title={t.pendingQuotes}
        value={stats.pendingQuotes}
        subtitle={t.awaiting}
        icon={AlertCircle}
        color={stats.pendingQuotes > 0 ? "red" : "gray"}
      />
      
      <StatsCard
        title={t.averageProjectDuration}
        value={stats.averageProjectDuration}
        subtitle={t.days}
        icon={Calendar}
        color="gray"
      />
      
      <StatsCard
        title={language === 'es' ? 'Tasa de Aprobación' : 'Approval Rate'}
        value={`${approvalRate}%`}
        subtitle={language === 'es' ? 'de cotizaciones' : 'of quotes'}
        icon={Target}
        trend={{
          value: approvalRate,
          isPositive: approvalRate >= 70
        }}
        color={approvalRate >= 70 ? "green" : approvalRate >= 50 ? "yellow" : "red"}
      />
      
      <StatsCard
        title={language === 'es' ? 'Rendimiento' : 'Performance'}
        value={`${completionRate}%`}
        subtitle={t.completed}
        icon={BarChart3}
        trend={{
          value: completionRate,
          isPositive: completionRate >= 80
        }}
        color={completionRate >= 80 ? "green" : completionRate >= 60 ? "yellow" : "red"}
      />
    </div>
  )
}
