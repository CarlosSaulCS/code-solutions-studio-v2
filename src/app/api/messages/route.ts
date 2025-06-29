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

    const searchParams = request.nextUrl.searchParams
    const projectId = searchParams.get('projectId')

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

    let whereClause: any = {}

    if (projectId) {
      // Messages for specific project
      whereClause.projectId = projectId
      
      // Verify user has access to this project
      if (user.role !== 'ADMIN') {
        const project = await prisma.project.findFirst({
          where: {
            id: projectId,
            userId: user.id
          }
        })
        
        if (!project) {
          return NextResponse.json(
            { error: 'Proyecto no encontrado' },
            { status: 404 }
          )
        }
      }
    } else {
      // General messages (no project)
      whereClause.projectId = null
      if (user.role !== 'ADMIN') {
        whereClause.userId = user.id
      }
    }

    const messages = await prisma.message.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    return NextResponse.json({
      success: true,
      data: messages
    })
  } catch (error) {
    console.error('Error fetching messages:', error)
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
    const { content, projectId, type = 'TEXT' } = body

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'El mensaje no puede estar vacío' },
        { status: 400 }
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

    console.log('📧 Message creation info:')
    console.log('  Session email:', session.user.email)
    console.log('  User found:', user.name, user.email, user.role)
    console.log('  Message content:', content.substring(0, 50) + '...')
    console.log('  Project ID:', projectId || 'General')

    // If projectId is provided, verify access
    if (projectId) {
      if (user.role !== 'ADMIN') {
        const project = await prisma.project.findFirst({
          where: {
            id: projectId,
            userId: user.id
          }
        })
        
        if (!project) {
          return NextResponse.json(
            { error: 'Proyecto no encontrado' },
            { status: 404 }
          )
        }
      }
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        userId: user.id,
        projectId: projectId || undefined,
        content: content.trim(),
        type,
        isFromAdmin: user.role === 'ADMIN'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    })

    console.log('✅ Message created:')
    console.log('  Message ID:', message.id)
    console.log('  User ID:', message.userId)
    console.log('  User info:', message.user.name, message.user.email, message.user.role)
    console.log('  isFromAdmin:', message.isFromAdmin)

    // Create notification for the other party
    if (projectId) {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: { user: true }
      })

      if (project) {
        if (user.role === 'ADMIN' && project.userId !== user.id) {
          // Admin sent message to client
          await prisma.notification.create({
            data: {
              userId: project.userId,
              title: 'Nuevo Mensaje del Equipo',
              message: `Tienes un nuevo mensaje en el proyecto "${project.title}".`,
              type: 'INFO',
              actionUrl: `/dashboard?tab=projects&project=${projectId}`
            }
          })
        } else if (user.role !== 'ADMIN') {
          // Client sent message, notify admins
          const admins = await prisma.user.findMany({
            where: { role: 'ADMIN' }
          })

          for (const admin of admins) {
            await prisma.notification.create({
              data: {
                userId: admin.id,
                title: 'Nuevo Mensaje de Cliente',
                message: `${user.name || user.email} envió un mensaje en el proyecto "${project.title}".`,
                type: 'INFO',
                actionUrl: `/admin/projects/${projectId}`
              }
            })
          }
        }
      }
    } else {
      // General message
      if (user.role === 'ADMIN') {
        // Admin sent general message, could notify all clients (optional)
      } else {
        // Client sent general message, notify admins
        const admins = await prisma.user.findMany({
          where: { role: 'ADMIN' }
        })

        for (const admin of admins) {
          await prisma.notification.create({
            data: {
              userId: admin.id,
              title: 'Nuevo Mensaje General',
              message: `${user.name || user.email} envió un mensaje general.`,
              type: 'INFO',
              actionUrl: `/admin/messages`
            }
          })
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: message
    })
  } catch (error) {
    console.error('Error creating message:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
