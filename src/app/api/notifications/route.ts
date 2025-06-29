import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
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

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const unreadOnly = searchParams.get('unread') === 'true'
    const limit = parseInt(searchParams.get('limit') || '50')

    // Build where clause
    const whereClause: any = { userId: user.id }
    if (unreadOnly) {
      whereClause.read = false
    }

    // Get notifications
    const notifications = await prisma.notification.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    })

    // Get unread count
    const unreadCount = await prisma.notification.count({
      where: {
        userId: user.id,
        read: false
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        notifications,
        unreadCount
      }
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
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

    const body = await request.json()
    const { action, notificationId } = body

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    if (action === 'markAsRead') {
      if (notificationId) {
        // Mark specific notification as read
        await prisma.notification.update({
          where: {
            id: notificationId,
            userId: user.id
          },
          data: {
            read: true
          }
        })
      } else {
        // Mark all notifications as read
        await prisma.notification.updateMany({
          where: {
            userId: user.id,
            read: false
          },
          data: {
            read: true
          }
        })
      }

      return NextResponse.json({ success: true })
    }

    if (action === 'delete') {
      if (!notificationId) {
        return NextResponse.json(
          { error: 'ID de notificación requerido' },
          { status: 400 }
        )
      }

      await prisma.notification.delete({
        where: {
          id: notificationId,
          userId: user.id
        }
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { error: 'Acción no válida' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error updating notification:', error)
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

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    const { notificationId, read } = await request.json()

    if (!notificationId) {
      return NextResponse.json(
        { error: 'ID de notificación requerido' },
        { status: 400 }
      )
    }

    // Update notification
    const notification = await prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId: user.id
      },
      data: {
        read: read ?? true,
        ...(read && { readAt: new Date() })
      }
    })

    if (notification.count === 0) {
      return NextResponse.json(
        { error: 'Notificación no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating notification:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    const { notificationId } = await request.json()

    if (!notificationId) {
      return NextResponse.json(
        { error: 'ID de notificación requerido' },
        { status: 400 }
      )
    }

    // Delete notification
    const notification = await prisma.notification.deleteMany({
      where: {
        id: notificationId,
        userId: user.id
      }
    })

    if (notification.count === 0) {
      return NextResponse.json(
        { error: 'Notificación no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting notification:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
