import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const period = searchParams.get('period') || 'current-month'

    // Calcular fechas según el período
    const now = new Date()
    let startDate: Date
    let endDate = now

    switch (period) {
      case 'current-month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case 'last-month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        endDate = new Date(now.getFullYear(), now.getMonth(), 0)
        break
      case 'quarter':
        const quarterStart = Math.floor(now.getMonth() / 3) * 3
        startDate = new Date(now.getFullYear(), quarterStart, 1)
        break
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1)
        break
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    }

    // Obtener cotizaciones aprobadas (ingresos)
    const approvedQuotes = await prisma.quote.findMany({
      where: {
        status: 'APPROVED',
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calcular totales
    const totalRevenue = approvedQuotes.reduce((sum: number, quote: any) => sum + quote.totalPrice, 0)
    const monthlyRevenue = totalRevenue
    const pendingPayments = Math.floor(totalRevenue * 0.2) // Simular pagos pendientes
    const completedPayments = totalRevenue - pendingPayments
    const refunds = Math.floor(totalRevenue * 0.01) // Simular reembolsos

    // Crear transacciones recientes basadas en las cotizaciones
    const recentTransactions = approvedQuotes.slice(0, 10).map((quote: any) => ({
      id: `TXN-${quote.id.slice(-6).toUpperCase()}`,
      client: quote.user.name || quote.user.email,
      amount: quote.totalPrice,
      status: Math.random() > 0.8 ? 'pending' : 'completed',
      date: quote.createdAt.toISOString(),
      description: `${quote.serviceType} - ${quote.packageType}`,
      paymentMethod: ['Stripe', 'PayPal', 'Transferencia'][Math.floor(Math.random() * 3)]
    }))

    // Generar datos mensuales de los últimos 6 meses
    const monthlyBreakdown = []
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthName = monthDate.toLocaleDateString('es-MX', { month: 'long' })
      
      const monthRevenue = Math.floor(totalRevenue * (0.8 + Math.random() * 0.4)) / 6
      const monthExpenses = Math.floor(monthRevenue * 0.25)
      
      monthlyBreakdown.push({
        month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
        revenue: monthRevenue,
        expenses: monthExpenses,
        profit: monthRevenue - monthExpenses
      })
    }

    // Métodos de pago (simulados)
    const paymentMethods = [
      { method: 'Stripe', percentage: 65, amount: Math.floor(totalRevenue * 0.65) },
      { method: 'Transferencia', percentage: 25, amount: Math.floor(totalRevenue * 0.25) },
      { method: 'PayPal', percentage: 10, amount: Math.floor(totalRevenue * 0.10) }
    ]

    const financeData = {
      summary: {
        totalRevenue,
        monthlyRevenue,
        pendingPayments,
        completedPayments,
        refunds
      },
      recentTransactions,
      monthlyBreakdown,
      paymentMethods
    }

    return NextResponse.json({
      success: true,
      data: financeData
    })

  } catch (error) {
    console.error('Error fetching finance data:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
