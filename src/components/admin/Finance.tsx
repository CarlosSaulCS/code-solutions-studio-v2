'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  DollarSign, TrendingUp, CreditCard, PieChart, Calendar, 
  Download, Filter, ArrowUp, ArrowDown, Eye, MoreHorizontal,
  CheckCircle, XCircle, Clock, AlertCircle
} from 'lucide-react'

interface FinanceData {
  summary: {
    totalRevenue: number
    monthlyRevenue: number
    pendingPayments: number
    completedPayments: number
    refunds: number
  }
  recentTransactions: Array<{
    id: string
    client: string
    amount: number
    status: 'completed' | 'pending' | 'failed' | 'refunded'
    date: string
    description: string
    paymentMethod: string
  }>
  monthlyBreakdown: Array<{
    month: string
    revenue: number
    expenses: number
    profit: number
  }>
  paymentMethods: Array<{
    method: string
    percentage: number
    amount: number
  }>
}

export default function Finance() {
  const [data, setData] = useState<FinanceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('current-month')

  const fetchFinanceData = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/finance?period=${selectedPeriod}`)
      if (response.ok) {
        const result = await response.json()
        setData(result.data)
      }
    } catch (error) {
      console.error('Error fetching finance data:', error)
      // Datos de ejemplo para desarrollo
      setData({
        summary: {
          totalRevenue: 1250000,
          monthlyRevenue: 185000,
          pendingPayments: 45000,
          completedPayments: 140000,
          refunds: 2500
        },
        recentTransactions: [
          {
            id: 'TXN-001',
            client: 'Carlos Soul',
            amount: 25000,
            status: 'completed',
            date: '2025-06-25T10:30:00Z',
            description: 'Desarrollo Web - Paquete Business',
            paymentMethod: 'Stripe'
          },
          {
            id: 'TXN-002',
            client: 'María García',
            amount: 45000,
            status: 'pending',
            date: '2025-06-24T15:45:00Z',
            description: 'E-commerce - Paquete Enterprise',
            paymentMethod: 'Transferencia'
          },
          {
            id: 'TXN-003',
            client: 'Juan Pérez',
            amount: 15000,
            status: 'completed',
            date: '2025-06-23T09:15:00Z',
            description: 'App Móvil - Paquete Startup',
            paymentMethod: 'PayPal'
          },
          {
            id: 'TXN-004',
            client: 'Ana López',
            amount: 35000,
            status: 'failed',
            date: '2025-06-22T14:20:00Z',
            description: 'IA Solutions - Paquete Business',
            paymentMethod: 'Stripe'
          },
          {
            id: 'TXN-005',
            client: 'Roberto Silva',
            amount: 8000,
            status: 'refunded',
            date: '2025-06-21T11:10:00Z',
            description: 'Consultoría TI - Reembolso',
            paymentMethod: 'Stripe'
          }
        ],
        monthlyBreakdown: [
          { month: 'Enero', revenue: 180000, expenses: 45000, profit: 135000 },
          { month: 'Febrero', revenue: 220000, expenses: 52000, profit: 168000 },
          { month: 'Marzo', revenue: 195000, expenses: 48000, profit: 147000 },
          { month: 'Abril', revenue: 205000, expenses: 51000, profit: 154000 },
          { month: 'Mayo', revenue: 235000, expenses: 56000, profit: 179000 },
          { month: 'Junio', revenue: 185000, expenses: 44000, profit: 141000 }
        ],
        paymentMethods: [
          { method: 'Stripe', percentage: 65, amount: 120250 },
          { method: 'Transferencia', percentage: 25, amount: 46250 },
          { method: 'PayPal', percentage: 10, amount: 18500 }
        ]
      })
    } finally {
      setLoading(false)
    }
  }, [selectedPeriod])

  useEffect(() => {
    fetchFinanceData()
  }, [fetchFinanceData])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return { label: 'Completado', color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle }
      case 'pending':
        return { label: 'Pendiente', color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: Clock }
      case 'failed':
        return { label: 'Fallido', color: 'text-red-600', bgColor: 'bg-red-100', icon: XCircle }
      case 'refunded':
        return { label: 'Reembolsado', color: 'text-gray-600', bgColor: 'bg-gray-100', icon: AlertCircle }
      default:
        return { label: 'Desconocido', color: 'text-gray-600', bgColor: 'bg-gray-100', icon: AlertCircle }
    }
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

  const summaryCards = [
    {
      title: 'Ingresos Totales',
      value: formatCurrency(data.summary.totalRevenue),
      change: '+12.5%',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Ingresos del Mes',
      value: formatCurrency(data.summary.monthlyRevenue),
      change: '+8.2%',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Pagos Pendientes',
      value: formatCurrency(data.summary.pendingPayments),
      change: '-3.1%',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Pagos Completados',
      value: formatCurrency(data.summary.completedPayments),
      change: '+15.7%',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Finanzas</h1>
          <p className="mt-2 text-sm text-gray-600">
            Gestión financiera y reportes de ingresos
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
          >
            <option value="current-month">Mes Actual</option>
            <option value="last-month">Mes Anterior</option>
            <option value="quarter">Trimestre</option>
            <option value="year">Año</option>
          </select>
          
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => {
          const Icon = card.icon
          
          return (
            <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`${card.bgColor} p-3 rounded-md`}>
                      <Icon className={`h-6 w-6 ${card.color}`} />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {card.title}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {card.value}
                        </div>
                        <div className="ml-2 text-sm font-semibold text-green-600">
                          {card.change}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Breakdown */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Desglose Mensual</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {data.monthlyBreakdown.map((item, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-900">{item.month}</h4>
                    <span className="text-sm font-semibold text-green-600">
                      {formatCurrency(item.profit)}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Ingresos</span>
                      <div className="font-medium text-green-600">
                        {formatCurrency(item.revenue)}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Gastos</span>
                      <div className="font-medium text-red-600">
                        {formatCurrency(item.expenses)}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Ganancia</span>
                      <div className="font-medium text-blue-600">
                        {formatCurrency(item.profit)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Métodos de Pago</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {data.paymentMethods.map((method, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">{method.method}</div>
                      <div className="text-sm text-gray-500">{method.percentage}% del total</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {formatCurrency(method.amount)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Transacciones Recientes</h3>
            <button className="text-sm text-primary-600 hover:text-primary-700">
              Ver todas
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.recentTransactions.map((transaction) => {
                const statusConfig = getStatusConfig(transaction.status)
                const StatusIcon = statusConfig.icon
                
                return (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {transaction.client}
                      </div>
                      <div className="text-sm text-gray-500">
                        {transaction.paymentMethod}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {transaction.description}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {transaction.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {formatCurrency(transaction.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-gray-400 hover:text-gray-500">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
