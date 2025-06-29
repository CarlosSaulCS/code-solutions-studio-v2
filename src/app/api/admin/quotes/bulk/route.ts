import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST - Bulk operations on quotes
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
    const { action, quoteIds, data } = body

    if (!action || !quoteIds || !Array.isArray(quoteIds) || quoteIds.length === 0) {
      return NextResponse.json(
        { error: 'Acción y IDs de cotizaciones son requeridos' },
        { status: 400 }
      )
    }

    let result

    switch (action) {
      case 'updateStatus':
        result = await bulkUpdateStatus(quoteIds, data.status, data.adminNotes)
        break
      case 'delete':
        result = await bulkDelete(quoteIds)
        break
      case 'export':
        result = await bulkExport(quoteIds)
        break
      case 'convertToProject':
        result = await bulkConvertToProject(quoteIds)
        break
      default:
        return NextResponse.json(
          { error: 'Acción no válida' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      data: result.data
    })

  } catch (error) {
    console.error('Error in bulk quote operation:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Helper function to bulk update status
async function bulkUpdateStatus(quoteIds: string[], status: string, adminNotes?: string) {
  if (!status) {
    throw new Error('El estado es requerido')
  }

  // Get quotes before update for notifications
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
      id: { in: quoteIds }
    },
    data: updateData
  })

  // Create notifications for affected users
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

  return {
    message: `${updatedQuotes.count} cotización(es) actualizada(s) exitosamente`,
    data: {
      updatedCount: updatedQuotes.count,
      status
    }
  }
}

// Helper function to bulk delete quotes
async function bulkDelete(quoteIds: string[]) {
  // Get quotes to check for associated projects
  const quotes = await prisma.quote.findMany({
    where: {
      id: { in: quoteIds }
    },
    include: {
      user: {
        select: { id: true, name: true, email: true }
      },
      project: {
        select: { id: true }
      }
    }
  })

  // Check if any quotes have associated projects
  const quotesWithProjects = quotes.filter((quote: any) => quote.project)
  if (quotesWithProjects.length > 0) {
    return {
      message: `No se pueden eliminar ${quotesWithProjects.length} cotización(es) que tienen proyectos asociados`,
      data: {
        deletedCount: 0,
        skippedCount: quotesWithProjects.length,
        skippedQuotes: quotesWithProjects.map((q: any) => q.id)
      }
    }
  }

  // Delete related notifications first
  await prisma.notification.deleteMany({
    where: {
      OR: quoteIds.map(id => ({
        actionUrl: {
          contains: id
        }
      }))
    }
  })

  // Delete quotes
  const deletedQuotes = await prisma.quote.deleteMany({
    where: {
      id: { in: quoteIds }
    }
  })

  // Create notifications for affected users
  const notificationPromises = quotes.map((quote: any) =>
    prisma.notification.create({
      data: {
        userId: quote.userId,
        title: 'Cotización Eliminada',
        message: `Tu cotización para ${quote.serviceType} ha sido eliminada del sistema.`,
        type: 'WARNING'
      }
    })
  )

  await Promise.all(notificationPromises)

  return {
    message: `${deletedQuotes.count} cotización(es) eliminada(s) exitosamente`,
    data: {
      deletedCount: deletedQuotes.count
    }
  }
}

// Helper function to bulk export quotes
async function bulkExport(quoteIds: string[]) {
  const quotes = await prisma.quote.findMany({
    where: {
      id: { in: quoteIds }
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
    }
  })

  // Format data for export
  const exportData = quotes.map((quote: any) => ({
    id: quote.id,
    cliente: quote.user?.name || 'Sin nombre',
    email: quote.user?.email || '',
    telefono: quote.user?.phone || '',
    empresa: quote.user?.company || '',
    servicio: quote.serviceType,
    paquete: quote.packageType,
    precio_base: quote.basePrice,
    precio_addons: quote.addonsPrice,
    precio_total: quote.totalPrice,
    moneda: quote.currency,
    timeline: quote.timeline,
    estado: quote.status,
    notas: quote.notes || '',
    notas_admin: quote.adminNotes || '',
    valida_hasta: quote.validUntil,
    fecha_creacion: quote.createdAt,
    fecha_actualizacion: quote.updatedAt,
    proyecto_id: quote.project?.id || '',
    proyecto_titulo: quote.project?.title || '',
    proyecto_estado: quote.project?.status || ''
  }))

  return {
    message: `${quotes.length} cotización(es) preparada(s) para exportar`,
    data: {
      quotes: exportData,
      count: quotes.length
    }
  }
}

// Helper function to bulk convert quotes to projects
async function bulkConvertToProject(quoteIds: string[]) {
  // Get quotes that can be converted
  const quotes = await prisma.quote.findMany({
    where: {
      id: { in: quoteIds },
      status: 'APPROVED',
      project: null // No existing project
    },
    include: {
      user: {
        select: { id: true, name: true, email: true }
      }
    }
  })

  if (quotes.length === 0) {
    return {
      message: 'No hay cotizaciones elegibles para convertir (deben estar aprobadas y sin proyecto asociado)',
      data: {
        convertedCount: 0
      }
    }
  }

  // Create projects for each quote
  const projectPromises = quotes.map(async (quote: any) => {
    // Create project
    const project = await prisma.project.create({
      data: {
        quoteId: quote.id,
        userId: quote.userId,
        title: `Proyecto ${quote.serviceType} - ${quote.packageType}`,
        description: `Proyecto generado automáticamente desde cotización ${quote.id}`,
        serviceType: quote.serviceType,
        packageType: quote.packageType,
        status: 'PLANNING',
        budget: quote.totalPrice,
        progress: 0,
        startDate: new Date(),
        estimatedEndDate: new Date(Date.now() + quote.timeline * 24 * 60 * 60 * 1000) // Add timeline days
      }
    })

    // Update quote status to CONVERTED
    await prisma.quote.update({
      where: { id: quote.id },
      data: { 
        status: 'CONVERTED',
        updatedAt: new Date()
      }
    })

    // Create notification for user
    await prisma.notification.create({
      data: {
        userId: quote.userId,
        title: 'Cotización Convertida a Proyecto',
        message: `Tu cotización para ${quote.serviceType} ha sido convertida en un proyecto activo. ¡Comenzamos a trabajar!`,
        type: 'SUCCESS',
        actionUrl: `/dashboard?tab=projects&project=${project.id}`
      }
    })

    return project
  })

  const createdProjects = await Promise.all(projectPromises)

  return {
    message: `${createdProjects.length} cotización(es) convertida(s) a proyecto(s) exitosamente`,
    data: {
      convertedCount: createdProjects.length,
      projects: createdProjects.map((p: any) => ({ id: p.id, title: p.title }))
    }
  }
}
