'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  TrendingUp, TrendingDown, BarChart3, PieChart, Calendar, 
  Users, FileText, DollarSign, Target, Clock, ArrowUp, ArrowDown,
  Download, Filter, RefreshCw
} from 'lucide-react'

interface AnalyticsData {
  revenue: {
    current: number
    previous: number
    growth: number
  }
  users: {
    total: number
    new: number
    growth: number
  }
  quotes: {
    total: number
    approved: number
    conversionRate: number
  }
  projects: {
    total: number
    completed: number
    inProgress: number
  }
  monthlyRevenue: Array<{
    month: string
    revenue: number
    quotes: number
  }>
  topServices: Array<{
    service: string
    revenue: number
    count: number
  }>
}

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/analytics?period=${timeRange}`)
      if (response.ok) {
        const result = await response.json()
        setData(result.data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
      // Datos de ejemplo para desarrollo
      setData({
        revenue: {
          current: 220633,
          previous: 150000,
          growth: 47.5
        },
        users: {
          total: 156,
          new: 7,
          growth: 15.4
        },
        quotes: {
          total: 89,
          approved: 67,
          conversionRate: 6.41025641025
        },
        projects: {
          total: 45,
          completed: 32,
          inProgress: 0
        },
        monthlyRevenue: [
          { month: 'Ene', revenue: 320000, quotes: 15 },
          { month: 'Feb', revenue: 380000, quotes: 18 },
          { month: 'Mar', revenue: 420000, quotes: 22 },
          { month: 'Abr', revenue: 350000, quotes: 16 },
          { month: 'May', revenue: 480000, quotes: 25 },
          { month: 'Jun', revenue: 450000, quotes: 23 }
        ],
        topServices: [
          { service: 'Desarrollo Web', revenue: 180000, count: 25 },
          { service: 'E-commerce', revenue: 150000, count: 18 },
          { service: 'Apps Móviles', revenue: 120000, count: 12 },
          { service: 'IA Solutions', revenue: 90000, count: 8 },
          { service: 'Cloud Migration', revenue: 60000, count: 6 }
        ]
      })
    } finally {
      setLoading(false)
    }
  }, [timeRange])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!data) return null

  const statCards = [
    {
      title: 'Ingresos Totales',
      value: formatCurrency(data.revenue.current),
      change: data.revenue.growth,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-50'
    },
    {
      title: 'Nuevos Usuarios',
      value: data.users.new.toString(),
      change: data.users.growth,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      gradient: 'from-blue-500 to-cyan-600',
      bgGradient: 'from-blue-50 to-cyan-50'
    },
    {
      title: 'Tasa de Conversión',
      value: `${((data.quotes.approved / data.quotes.total) * 100).toFixed(1)}%`,
      change: 2.5,
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      gradient: 'from-purple-500 to-violet-600',
      bgGradient: 'from-purple-50 to-violet-50'
    },
    {
      title: 'Proyectos Activos',
      value: data.projects.inProgress.toString(),
      change: -2.1,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      gradient: 'from-orange-500 to-amber-600',
      bgGradient: 'from-orange-50 to-amber-50'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics & Reportes</h1>
          <p className="mt-2 text-sm text-gray-600">
            Análisis detallado del rendimiento de tu negocio
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
          >
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
            <option value="90d">Últimos 90 días</option>
            <option value="1y">Último año</option>
          </select>
          
          <button
            onClick={fetchAnalytics}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </button>
          
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          const isPositive = stat.change > 0
          
          return (
            <div 
              key={index} 
              className="bg-white rounded-lg shadow border border-gray-200 p-6"
            >
              {/* Header con icono y título */}
              <div className="flex items-center mb-4">
                <div className={`${stat.bgColor} p-3 rounded-lg mr-3`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <h3 className="text-sm font-medium text-gray-600">
                  {stat.title}
                </h3>
              </div>
              
              {/* Valor principal */}
              <div className="mb-4">
                <p className="text-3xl font-bold text-gray-900 leading-tight">
                  {stat.value}
                </p>
              </div>
              
              {/* Cambio porcentual */}
              <div className={`flex items-center text-sm font-medium ${
                isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {isPositive ? (
                  <ArrowUp className="w-4 h-4 mr-1" />
                ) : (
                  <ArrowDown className="w-4 h-4 mr-1" />
                )}
                <span>{formatPercentage(Math.abs(stat.change))}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Ingresos Mensuales</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {data.monthlyRevenue.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">{item.month}</span>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">{item.quotes} cotizaciones</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(item.revenue)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Services */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Servicios Top</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {data.topServices.map((service, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{service.service}</div>
                    <div className="text-sm text-gray-500">{service.count} proyectos</div>
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    {formatCurrency(service.revenue)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Métricas Detalladas</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{data.quotes.total}</div>
              <div className="text-sm text-gray-500">Total Cotizaciones</div>
              <div className="text-sm text-green-600 mt-1">
                {data.quotes.approved} aprobadas
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{data.projects.completed}</div>
              <div className="text-sm text-gray-500">Proyectos Completados</div>
              <div className="text-sm text-blue-600 mt-1">
                {data.projects.inProgress} en progreso
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{data.users.total}</div>
              <div className="text-sm text-gray-500">Total Usuarios</div>
              <div className="text-sm text-purple-600 mt-1">
                {data.users.new} nuevos este mes
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
