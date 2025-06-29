import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { projectIds, action } = body

    if (!projectIds || !Array.isArray(projectIds) || projectIds.length === 0) {
      return NextResponse.json({ error: 'IDs de proyectos requeridos' }, { status: 400 })
    }

    let result

    switch (action) {
      case 'delete':
        result = await prisma.project.deleteMany({
          where: {
            id: {
              in: projectIds
            }
          }
        })
        break

      case 'archive':
        result = await prisma.project.updateMany({
          where: {
            id: {
              in: projectIds
            }
          },
          data: {
            status: 'CANCELLED'
          }
        })
        break

      case 'activate':
        result = await prisma.project.updateMany({
          where: {
            id: {
              in: projectIds
            }
          },
          data: {
            status: 'DEVELOPMENT'
          }
        })
        break

      default:
        return NextResponse.json({ error: 'Acción no válida' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: `Se procesaron ${result.count} proyectos`,
      data: result
    })
  } catch (error) {
    console.error('Error performing bulk action:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
