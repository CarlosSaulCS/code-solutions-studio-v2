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
    const limit = parseInt(searchParams.get('limit') || '20')
    const type = searchParams.get('type') // filter by activity type

    // Get recent activities from different sources
    const [recentQuotes, recentProjects, recentUsers, recentMessages] = await Promise.all([
      prisma.quote.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { name: true, email: true }
          }
        }
      }),
      prisma.project.findMany({
        take: 10,
        orderBy: { updatedAt: 'desc' },
        include: {
          user: {
            select: { name: true, email: true }
          }
        }
      }),
      prisma.user.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        where: {
          role: 'CLIENT' // Only show client registrations
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true
        }
      }),
      prisma.message.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        where: {
          isFromAdmin: false // Only messages from clients
        },
        include: {
          user: {
            select: { name: true, email: true }
          },
          project: {
            select: { title: true }
          }
        }
      })
    ])

    // Transform data into unified activity format
    const activities: any[] = []

    // Add quote activities
    recentQuotes.forEach((quote: any) => {
      activities.push({
        id: `quote-${quote.id}`,
        type: 'quote',
        title: 'Nueva cotización recibida',
        description: `Cotización para ${quote.serviceType} - paquete ${quote.packageType}`,
        timestamp: quote.createdAt.toISOString(),
        status: quote.status.toLowerCase(),
        user: {
          name: quote.user.name || 'Usuario',
          email: quote.user.email
        }
      })
    })

    // Add project activities
    recentProjects.forEach((project: any) => {
      activities.push({
        id: `project-${project.id}`,
        type: 'project',
        title: 'Proyecto actualizado',
        description: `${project.title} - Estado: ${project.status}`,
        timestamp: project.updatedAt.toISOString(),
        status: project.status.toLowerCase(),
        user: {
          name: project.user.name || 'Usuario',
          email: project.user.email
        }
      })
    })

    // Add user activities
    recentUsers.forEach((newUser: any) => {
      activities.push({
        id: `user-${newUser.id}`,
        type: 'user',
        title: 'Nuevo usuario registrado',
        description: `${newUser.name || 'Usuario'} se registró en la plataforma`,
        timestamp: newUser.createdAt.toISOString(),
        user: {
          name: newUser.name || 'Usuario',
          email: newUser.email
        }
      })
    })

    // Add message activities
    recentMessages.forEach((message: any) => {
      activities.push({
        id: `message-${message.id}`,
        type: 'message',
        title: 'Nuevo mensaje',
        description: message.project 
          ? `Mensaje en proyecto: ${message.project.title}`
          : 'Mensaje general recibido',
        timestamp: message.createdAt.toISOString(),
        user: {
          name: message.user.name || 'Usuario',
          email: message.user.email
        }
      })
    })

    // Sort by timestamp and limit
    const sortedActivities = activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit)

    // Filter by type if specified
    const filteredActivities = type 
      ? sortedActivities.filter(activity => activity.type === type)
      : sortedActivities

    return NextResponse.json({
      success: true,
      data: filteredActivities,
      meta: {
        total: filteredActivities.length,
        hasMore: activities.length > limit
      }
    })

  } catch (error) {
    console.error('Error fetching activities:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
