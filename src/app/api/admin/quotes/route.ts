import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Verify admin role
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Acceso denegado. Se requieren permisos de administrador.' },
        { status: 403 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const userId = searchParams.get('userId')
    const serviceType = searchParams.get('serviceType')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = (page - 1) * limit

    // Build where clause
    const whereClause: any = {}
    
    if (status && status !== 'all') {
      whereClause.status = status
    }
    
    if (userId) {
      whereClause.userId = userId
    }
    
    if (serviceType) {
      whereClause.serviceType = serviceType
    }

    // Get quotes with user information
    const [quotes, totalCount] = await Promise.all([
      prisma.quote.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              company: true
            }
          },
          project: {
            select: {
              id: true,
              title: true,
              status: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: offset,
        take: limit
      }),
      prisma.quote.count({
        where: whereClause
      })
    ])

    // Get summary statistics
    const stats = await prisma.quote.groupBy({
      by: ['status'],
      _count: {
        status: true
      },
      where: whereClause
    })

    const statusCounts = stats.reduce((acc: any, stat: any) => {
      acc[stat.status] = stat._count.status
      return acc
    }, {} as Record<string, number>)

    return NextResponse.json({
      success: true,
      data: quotes,
      meta: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
        statusCounts
      }
    })

  } catch (error) {
    console.error('Error fetching admin quotes:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Verify admin role
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Acceso denegado. Se requieren permisos de administrador.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { quoteIds, status, adminNotes } = body

    if (!quoteIds || !Array.isArray(quoteIds) || quoteIds.length === 0) {
      return NextResponse.json(
        { error: 'Se requiere al menos un ID de cotización' },
        { status: 400 }
      )
    }

    if (!status) {
      return NextResponse.json(
        { error: 'El estado es requerido' },
        { status: 400 }
      )
    }

    // Update quotes
    const updateData: any = {
      status,
      updatedAt: new Date()
    }

    if (adminNotes) {
      updateData.adminNotes = adminNotes
    }

    const updatedQuotes = await prisma.quote.updateMany({
      where: {
        id: {
          in: quoteIds
        }
      },
      data: updateData
    })

    // Create notifications for affected users
    const quotes = await prisma.quote.findMany({
      where: {
        id: { in: quoteIds }
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    // Create notifications for each affected user
    const notificationPromises = quotes.map((quote: any) => {
      let title = ''
      let message = ''
      
      switch (status) {
        case 'APPROVED':
          title = 'Cotización Aprobada'
          message = `Tu cotización para ${quote.serviceType} ha sido aprobada. Te contactaremos pronto para los siguientes pasos.`
          break
        case 'REJECTED':
          title = 'Cotización Rechazada'
          message = `Tu cotización para ${quote.serviceType} ha sido rechazada. Puedes crear una nueva cotización o contactarnos para más información.`
          break
        case 'CONVERTED':
          title = 'Cotización Convertida a Proyecto'
          message = `Tu cotización para ${quote.serviceType} ha sido convertida en un proyecto activo. ¡Comenzamos a trabajar!`
          break
        default:
          title = 'Estado de Cotización Actualizado'
          message = `El estado de tu cotización para ${quote.serviceType} ha sido actualizado a ${status}.`
      }

      return prisma.notification.create({
        data: {
          userId: quote.userId,
          title,
          message,
          type: status === 'APPROVED' || status === 'CONVERTED' ? 'SUCCESS' : status === 'REJECTED' ? 'WARNING' : 'INFO',
          actionUrl: `/dashboard?tab=quotes&quote=${quote.id}`
        }
      })
    })

    await Promise.all(notificationPromises)

    return NextResponse.json({
      success: true,
      message: `${updatedQuotes.count} cotización(es) actualizada(s) exitosamente`,
      data: {
        updatedCount: updatedQuotes.count,
        status
      }
    })

  } catch (error) {
    console.error('Error updating quotes:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Create new quote
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Verify admin role
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Acceso denegado. Se requieren permisos de administrador.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      clientName,
      clientEmail,
      clientPhone,
      clientCompany,
      serviceType,
      packageType,
      totalPrice,
      currency,
      timeline,
      status,
      notes,
      adminNotes,
      validUntil
    } = body

    // Validate required fields
    if (!clientName || !clientEmail || !serviceType || !packageType || !totalPrice || !currency || !timeline || !validUntil) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Check if user exists or create new one
    let clientUser = await prisma.user.findUnique({
      where: { email: clientEmail }
    })

    if (!clientUser) {
      // Create new user
      clientUser = await prisma.user.create({
        data: {
          name: clientName,
          email: clientEmail,
          phone: clientPhone || null,
          company: clientCompany || null,
          role: 'CLIENT'
        }
      })
    } else {
      // Update existing user if data provided
      const updateData: any = {}
      if (clientName !== clientUser.name) updateData.name = clientName
      if (clientPhone !== clientUser.phone) updateData.phone = clientPhone
      if (clientCompany !== clientUser.company) updateData.company = clientCompany

      if (Object.keys(updateData).length > 0) {
        clientUser = await prisma.user.update({
          where: { id: clientUser.id },
          data: updateData
        })
      }
    }

    // Create quote
    const quote = await prisma.quote.create({
      data: {
        userId: clientUser.id,
        serviceType,
        packageType,
        totalPrice: Number(totalPrice),
        basePrice: Number(totalPrice), // Use totalPrice as basePrice
        addonsPrice: 0, // Default addon price
        currency,
        timeline: Number(timeline),
        status: status || 'PENDING',
        notes: notes || null,
        adminNotes: adminNotes || null,
        validUntil: new Date(validUntil)
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            company: true
          }
        }
      }
    })

    // Create notification for user
    await prisma.notification.create({
      data: {
        userId: clientUser.id,
        title: 'Nueva Cotización Creada',
        message: `Se ha creado una nueva cotización para ${serviceType}. Puedes revisarla en tu panel de control.`,
        type: 'INFO',
        actionUrl: `/dashboard?tab=quotes&quote=${quote.id}`
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Cotización creada exitosamente',
      data: quote
    })

  } catch (error) {
    console.error('Error creating quote:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}