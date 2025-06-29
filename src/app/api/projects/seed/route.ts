import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { adminKey } = await request.json()
    
    // Validar clave de administrador
    if (adminKey !== 'setup-code-solutions-admin-2025') {
      return NextResponse.json(
        { error: 'Clave de administrador inválida' },
        { status: 401 }
      )
    }

    // Buscar un usuario existente para crear proyectos de ejemplo
    const user = await prisma.user.findFirst({
      where: {
        role: 'CLIENT'
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'No se encontró ningún usuario cliente para crear proyectos de ejemplo' },
        { status: 404 }
      )
    }

    // Crear proyectos de ejemplo con diferentes estados
    const sampleProjects = [
      {
        userId: user.id,
        title: 'Tienda E-commerce Startup',
        description: 'Desarrollo de tienda online para productos artesanales',
        serviceType: 'ECOMMERCE',
        packageType: 'STARTUP',
        status: 'DEVELOPMENT',
        progress: 60,
        budget: 35000,
        startDate: new Date('2024-12-01'),
        estimatedEndDate: new Date('2025-01-15'),
        statusNotes: 'Desarrollo del catálogo de productos en progreso'
      },
      {
        userId: user.id,
        title: 'App Móvil de Delivery',
        description: 'Aplicación móvil para delivery de comida',
        serviceType: 'MOBILE',
        packageType: 'BUSINESS',
        status: 'TESTING',
        progress: 85,
        budget: 55000,
        startDate: new Date('2024-11-15'),
        estimatedEndDate: new Date('2025-01-30'),
        statusNotes: 'Pruebas de integración con sistemas de pago'
      },
      {
        userId: user.id,
        title: 'Sitio Web Corporativo',
        description: 'Rediseño completo del sitio web corporativo',
        serviceType: 'WEB',
        packageType: 'ENTERPRISE',
        status: 'REVIEW',
        progress: 95,
        budget: 45000,
        startDate: new Date('2024-10-01'),
        estimatedEndDate: new Date('2025-01-10'),
        statusNotes: 'Esperando feedback del cliente para ajustes finales'
      },
      {
        userId: user.id,
        title: 'Migración a AWS Cloud',
        description: 'Migración de infraestructura legacy a AWS',
        serviceType: 'CLOUD',
        packageType: 'ENTERPRISE',
        status: 'PLANNING',
        progress: 15,
        budget: 80000,
        startDate: new Date('2025-01-01'),
        estimatedEndDate: new Date('2025-03-15'),
        statusNotes: 'Análisis de arquitectura actual en progreso'
      },
      {
        userId: user.id,
        title: 'Sistema de IA para Inventario',
        description: 'Implementación de IA para gestión automática de inventario',
        serviceType: 'AI',
        packageType: 'CUSTOM',
        status: 'QUOTE_APPROVED',
        progress: 5,
        budget: 120000,
        startDate: new Date('2025-01-20'),
        estimatedEndDate: new Date('2025-05-30'),
        statusNotes: 'Proyecto aprobado, iniciando fase de planificación'
      }
    ]

    const createdProjects = await Promise.all(
      sampleProjects.map(project => 
        prisma.project.create({
          data: project,
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        })
      )
    )

    // Crear notificaciones para cada proyecto
    const notifications = createdProjects.map((project: any) => ({
      userId: user.id,
      title: '🚀 Proyecto creado',
      message: `Se ha creado el proyecto: ${project.title}`,
      type: 'INFO',
      actionUrl: `/dashboard?tab=projects&project=${project.id}`
    }))

    await prisma.notification.createMany({
      data: notifications
    })

    return NextResponse.json({ 
      message: 'Proyectos de ejemplo creados exitosamente',
      projects: createdProjects,
      count: createdProjects.length
    })

  } catch (error) {
    console.error('Error al crear proyectos de ejemplo:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
