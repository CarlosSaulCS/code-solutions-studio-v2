import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      title, 
      description, 
      clientName, 
      clientEmail, 
      status, 
      priority, 
      budget, 
      startDate, 
      endDate, 
      progress 
    } = body

    // Find or update user if email changed
    let user = await prisma.user.findUnique({
      where: { email: clientEmail }
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: clientEmail,
          name: clientName || 'Cliente',
          role: 'CLIENT'
        }
      })
    } else if (user.name !== clientName) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { name: clientName }
      })
    }

    const { id } = await params
    const project = await prisma.project.update({
      where: { id },
      data: {
        title,
        description,
        status,
        budget: budget || 0,
        progress: progress || 0,
        startDate: startDate ? new Date(startDate) : null,
        estimatedEndDate: endDate ? new Date(endDate) : null,
        userId: user.id
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    // Transform to match frontend format
    const transformedProject = {
      id: project.id,
      title: project.title,
      description: project.description || '',
      clientName: project.user?.name || 'Cliente Desconocido',
      clientEmail: project.user?.email || '',
      status: project.status,
      priority: priority || 'MEDIUM',
      budget: project.budget,
      startDate: project.startDate?.toISOString() || project.createdAt.toISOString(),
      endDate: project.estimatedEndDate?.toISOString() || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      progress: project.progress,
      teamMembers: [],
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString()
    }

    return NextResponse.json({
      success: true,
      data: transformedProject
    })
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = await params
    await prisma.project.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Proyecto eliminado correctamente'
    })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
