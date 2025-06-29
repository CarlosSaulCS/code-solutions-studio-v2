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

    const users = await prisma.user.findMany({
      include: {
        quotes: true,
        projects: true,
        _count: {
          select: {
            quotes: true,
            projects: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform users to match the expected format
    const transformedUsers = users.map((user: any) => ({
      id: user.id,
      name: user.name || 'Sin nombre',
      email: user.email,
      role: user.role as 'CLIENT' | 'ADMIN',
      emailVerified: !!user.emailVerified,
      createdAt: user.createdAt.toISOString(),
      lastLogin: null, // No disponible en el esquema actual
      quotesCount: user._count.quotes,
      projectsCount: user._count.projects,
      status: 'ACTIVE' as const // Por defecto ACTIVE (no disponible en el esquema)
    }))

    return NextResponse.json({
      success: true,
      data: transformedUsers
    })
  } catch (error) {
    console.error('Error fetching users:', error)
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
    const { name, email, role, password } = body

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'El usuario ya existe' },
        { status: 400 }
      )
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        role: role || 'CLIENT',
        password: password || null // TODO: Hash password
      }
    })

    return NextResponse.json({
      success: true,
      data: user
    })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
