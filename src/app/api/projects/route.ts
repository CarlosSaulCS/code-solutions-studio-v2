import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('id')

    // Si se solicita un proyecto específico
    if (projectId) {
      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          user: {
            email: session.user.email
          }
        },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          },
          quote: {
            select: {
              serviceType: true,
              packageType: true,
              totalPrice: true,
              currency: true
            }
          }
        }
      })

      if (!project) {
        return NextResponse.json(
          { error: 'Proyecto no encontrado' },
          { status: 404 }
        )
      }

    return NextResponse.json({ 
      success: true,
      project 
    })
    }

    // Obtener todos los proyectos del usuario
    const projects = await prisma.project.findMany({
      where: {
        user: {
          email: session.user.email
        }
      },
      include: {
        quote: {
          select: {
            serviceType: true,
            packageType: true,
            totalPrice: true,
            currency: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ 
      success: true,
      data: projects 
    })

  } catch (error) {
    console.error('Error al obtener proyectos:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Solo admins pueden crear proyectos directamente
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No tienes permisos para esta acción' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { 
      quoteId, 
      userId, 
      title, 
      description, 
      serviceType, 
      packageType, 
      budget,
      estimatedEndDate,
      status = 'QUOTE_APPROVED'
    } = body

    const project = await prisma.project.create({
      data: {
        quoteId,
        userId,
        title,
        description,
        serviceType,
        packageType,
        status,
        budget,
        startDate: new Date(),
        estimatedEndDate: estimatedEndDate ? new Date(estimatedEndDate) : null
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        quote: true
      }
    })

    // Crear notificación para el cliente
    await prisma.notification.create({
      data: {
        userId,
        title: '🚀 ¡Proyecto iniciado!',
        message: `Tu proyecto "${title}" ha sido iniciado y ya está en desarrollo.`,
        type: 'SUCCESS',
        actionUrl: `/dashboard?tab=projects&project=${project.id}`
      }
    })

    return NextResponse.json({ project })

  } catch (error) {
    console.error('Error al crear proyecto:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Solo admins pueden actualizar el estado de proyectos
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No tienes permisos para esta acción' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { projectId, status, statusNotes, progress, estimatedEndDate } = body

    const project = await prisma.project.update({
      where: { id: projectId },
      data: {
        ...(status && { status }),
        ...(statusNotes && { statusNotes }),
        ...(progress !== undefined && { progress }),
        ...(estimatedEndDate && { estimatedEndDate: new Date(estimatedEndDate) }),
        ...(status === 'COMPLETED' && { actualEndDate: new Date() })
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    // Crear notificación para el cliente sobre la actualización
    const statusMessages: { [key: string]: string } = {
      'QUOTE_APPROVED': '✅ Tu cotización ha sido aprobada',
      'PLANNING': '📋 Iniciamos la planificación de tu proyecto',
      'DEVELOPMENT': '👨‍💻 Tu proyecto está en desarrollo',
      'TESTING': '🧪 Estamos probando tu proyecto',
      'REVIEW': '👀 Tu proyecto está listo para revisión',
      'DELIVERY': '🚚 Estamos preparando la entrega',
      'COMPLETED': '🎉 ¡Tu proyecto ha sido completado!',
      'ON_HOLD': '⏸️ Tu proyecto está temporalmente en pausa',
      'CANCELLED': '❌ Tu proyecto ha sido cancelado'
    }

    if (status && statusMessages[status]) {
      await prisma.notification.create({
        data: {
          userId: project.user.id,
          title: 'Actualización de Proyecto',
          message: `${statusMessages[status]}: ${project.title}`,
          type: status === 'COMPLETED' ? 'SUCCESS' : 
                status === 'CANCELLED' ? 'ERROR' : 
                status === 'ON_HOLD' ? 'WARNING' : 'INFO',
          actionUrl: `/dashboard?tab=projects&project=${projectId}`
        }
      })
    }

    return NextResponse.json({ project })

  } catch (error) {
    console.error('Error al actualizar proyecto:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
