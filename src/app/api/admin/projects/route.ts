import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const projects = await prisma.project.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        quote: {
          select: {
            id: true,
            totalPrice: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform projects to match the expected format
    const transformedProjects = projects.map((project: any) => ({
      id: project.id,
      title: project.title,
      description: project.description || '',
      clientName: project.user?.name || 'Cliente Desconocido',
      clientEmail: project.user?.email || '',
      status: project.status,
      priority: 'MEDIUM', // Default priority since it's not in schema
      budget: project.budget,
      startDate: project.startDate?.toISOString() || project.createdAt.toISOString(),
      endDate: project.estimatedEndDate?.toISOString() || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      progress: project.progress,
      teamMembers: [], // TODO: Add team members relation
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString()
    }))

    return NextResponse.json({
      success: true,
      data: transformedProjects
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, clientEmail, budget, startDate, endDate } = body

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: clientEmail }
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: clientEmail,
          name: 'Cliente Nuevo',
          role: 'CLIENT'
        }
      })
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        serviceType: 'CONSULTING', // Default service type
        packageType: 'CUSTOM', // Default package type
        status: 'PLANNING',
        budget: budget || 0,
        startDate: startDate ? new Date(startDate) : null,
        estimatedEndDate: endDate ? new Date(endDate) : null,
        userId: user.id
      }
    })

    return NextResponse.json({
      success: true,
      data: project
    })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
