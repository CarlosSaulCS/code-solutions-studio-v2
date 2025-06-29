import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Obtener una cotización específica
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params
    const quote = await prisma.quote.findUnique({
      where: { id },
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
      }
    })

    if (!quote) {
      return NextResponse.json(
        { error: 'Cotización no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: quote
    })

  } catch (error) {
    console.error('Error fetching quote:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar una cotización específica
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { 
      status, 
      adminNotes, 
      totalPrice, 
      validUntil,
      packageType,
      serviceType,
      timeline,
      currency,
      notes,
      // Client data
      clientName,
      clientEmail,
      clientPhone,
      clientCompany
    } = body

    // Verify quote exists
    const { id } = await params
    const existingQuote = await prisma.quote.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true, company: true }
        }
      }
    })

    if (!existingQuote) {
      return NextResponse.json(
        { error: 'Cotización no encontrada' },
        { status: 404 }
      )
    }

    // Build update data
    const updateData: any = {
      updatedAt: new Date()
    }

    if (status !== undefined) updateData.status = status
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes
    if (totalPrice !== undefined) {
      updateData.totalPrice = totalPrice
      updateData.basePrice = totalPrice // Update basePrice when totalPrice changes
    }
    if (validUntil !== undefined) updateData.validUntil = new Date(validUntil)
    if (packageType !== undefined) updateData.packageType = packageType
    if (serviceType !== undefined) updateData.serviceType = serviceType
    if (timeline !== undefined) updateData.timeline = timeline
    if (currency !== undefined) updateData.currency = currency
    if (notes !== undefined) updateData.notes = notes

    // Update user data if provided
    if (clientName || clientEmail || clientPhone || clientCompany) {
      const userUpdateData: any = {}
      if (clientName !== undefined) userUpdateData.name = clientName
      if (clientEmail !== undefined) userUpdateData.email = clientEmail
      if (clientPhone !== undefined) userUpdateData.phone = clientPhone
      if (clientCompany !== undefined) userUpdateData.company = clientCompany

      await prisma.user.update({
        where: { id: existingQuote.userId },
        data: userUpdateData
      })
    }

    // If status is changing to APPROVED, create a project automatically
    let createdProject = null
    if (status === 'APPROVED' && existingQuote.status !== 'APPROVED') {
      // Check if quote already has a project
      const existingProject = await prisma.project.findUnique({
        where: { quoteId: id }
      })

      if (!existingProject) {
        // Create project title based on service type and user
        const serviceTypeTranslations: Record<string, string> = {
          WEB: 'Desarrollo Web',
          MOBILE: 'Aplicación Móvil',
          ECOMMERCE: 'E-commerce',
          CLOUD: 'Migración a la Nube',
          AI: 'Solución de IA',
          CONSULTING: 'Consultoría TI'
        }

        const serviceTitle = serviceTypeTranslations[existingQuote.serviceType] || existingQuote.serviceType
        const companyName = existingQuote.user.company || existingQuote.user.name || 'Cliente'
        const projectTitle = `${serviceTitle} para ${companyName}`

        // Calculate estimated end date (add timeline days to current date)
        const estimatedEndDate = new Date()
        estimatedEndDate.setDate(estimatedEndDate.getDate() + (timeline || existingQuote.timeline))

        createdProject = await prisma.project.create({
          data: {
            quoteId: id,
            userId: existingQuote.userId,
            title: projectTitle,
            description: `Proyecto creado automáticamente desde cotización aprobada. Servicio: ${serviceTitle}, Paquete: ${packageType || existingQuote.packageType}`,
            serviceType: existingQuote.serviceType,
            packageType: packageType || existingQuote.packageType,
            status: 'QUOTE_APPROVED',
            progress: 0,
            budget: totalPrice || existingQuote.totalPrice,
            startDate: new Date(),
            estimatedEndDate: estimatedEndDate,
            milestones: JSON.stringify([
              {
                id: 1,
                title: 'Inicio del proyecto',
                description: 'Proyecto creado y cotización aprobada',
                completed: true,
                completedAt: new Date().toISOString(),
                progress: 10
              },
              {
                id: 2,
                title: 'Planificación',
                description: 'Definición de requerimientos y planificación del proyecto',
                completed: false,
                progress: 0
              },
              {
                id: 3,
                title: 'Desarrollo',
                description: 'Implementación de la solución',
                completed: false,
                progress: 0
              },
              {
                id: 4,
                title: 'Pruebas',
                description: 'Testing y validación de la solución',
                completed: false,
                progress: 0
              },
              {
                id: 5,
                title: 'Entrega',
                description: 'Entrega final del proyecto',
                completed: false,
                progress: 0
              }
            ]),
            statusNotes: 'Proyecto creado automáticamente al aprobar cotización'
          }
        })

        // Project created automatically for approved quote (PUT method)
      }
    }

    const updatedQuote = await prisma.quote.update({
      where: { id },
      data: updateData,
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
      }
    })

    // Create notification for user if status changed
    if (status && status !== existingQuote.status) {
      let title = ''
      let message = ''
      
      switch (status) {
        case 'APPROVED':
          title = 'Cotización Aprobada'
          message = createdProject 
            ? `Tu cotización para ${updatedQuote.serviceType} ha sido aprobada y se ha creado el proyecto "${createdProject.title}". Te contactaremos pronto para los siguientes pasos.`
            : `Tu cotización para ${updatedQuote.serviceType} ha sido aprobada. Te contactaremos pronto para los siguientes pasos.`
          break
        case 'REJECTED':
          title = 'Cotización Rechazada'
          message = `Tu cotización para ${updatedQuote.serviceType} ha sido rechazada. Puedes crear una nueva cotización o contactarnos para más información.`
          break
        case 'CONVERTED':
          title = 'Cotización Convertida a Proyecto'
          message = `Tu cotización para ${updatedQuote.serviceType} ha sido convertida en un proyecto activo. ¡Comenzamos a trabajar!`
          break
        default:
          title = 'Cotización Actualizada'
          message = `Tu cotización para ${updatedQuote.serviceType} ha sido actualizada.`
      }

      await prisma.notification.create({
        data: {
          userId: existingQuote.userId,
          title,
          message,
          type: status === 'APPROVED' || status === 'CONVERTED' ? 'SUCCESS' : status === 'REJECTED' ? 'WARNING' : 'INFO',
          actionUrl: `/dashboard?tab=quotes&quote=${updatedQuote.id}`
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: createdProject 
        ? `Cotización actualizada exitosamente. Se ha creado automáticamente el proyecto "${createdProject.title}"`
        : 'Cotización actualizada exitosamente',
      data: updatedQuote,
      createdProject
    })

  } catch (error) {
    console.error('Error updating quote:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar una cotización específica
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    // Verify quote exists
    const { id } = await params
    const existingQuote = await prisma.quote.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true, company: true }
        },
        project: {
          select: { id: true, title: true }
        }
      }
    })

    if (!existingQuote) {
      return NextResponse.json(
        { error: 'Cotización no encontrada' },
        { status: 404 }
      )
    }

    // Check if quote has an associated project
    if (existingQuote.project) {
      return NextResponse.json(
        { error: 'No se puede eliminar una cotización que tiene un proyecto asociado' },
        { status: 400 }
      )
    }

    // Delete related notifications first
    await prisma.notification.deleteMany({
      where: {
        actionUrl: {
          contains: existingQuote.id
        }
      }
    })

    // Delete the quote
    await prisma.quote.delete({
      where: { id }
    })

    // Create notification for user
    await prisma.notification.create({
      data: {
        userId: existingQuote.userId,
        title: 'Cotización Eliminada',
        message: `Tu cotización para ${existingQuote.serviceType} ha sido eliminada del sistema.`,
        type: 'WARNING'
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Cotización eliminada exitosamente'
    })

  } catch (error) {
    console.error('Error deleting quote:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PATCH - Actualizar campos específicos de una cotización
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Verify admin role
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Acceso denegado. Se requieren permisos de administrador.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { status, adminNotes } = body

    // Verify quote exists
    const { id } = await params
    const existingQuote = await prisma.quote.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true, company: true }
        }
      }
    })

    if (!existingQuote) {
      return NextResponse.json(
        { error: 'Cotización no encontrada' },
        { status: 404 }
      )
    }

    // Build update data
    const updateData: any = {
      updatedAt: new Date()
    }

    if (status !== undefined) updateData.status = status
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes

    // If status is changing to APPROVED, create a project automatically
    let createdProject = null
    if (status === 'APPROVED' && existingQuote.status !== 'APPROVED') {
      // Check if quote already has a project
      const existingProject = await prisma.project.findUnique({
        where: { quoteId: id }
      })

      if (!existingProject) {
        // Create project title based on service type and user
        const serviceTypeTranslations: Record<string, string> = {
          WEB: 'Desarrollo Web',
          MOBILE: 'Aplicación Móvil',
          ECOMMERCE: 'E-commerce',
          CLOUD: 'Migración a la Nube',
          AI: 'Solución de IA',
          CONSULTING: 'Consultoría TI'
        }

        const serviceTitle = serviceTypeTranslations[existingQuote.serviceType] || existingQuote.serviceType
        const companyName = existingQuote.user.company || existingQuote.user.name || 'Cliente'
        const projectTitle = `${serviceTitle} para ${companyName}`

        // Calculate estimated end date (add timeline days to current date)
        const estimatedEndDate = new Date()
        estimatedEndDate.setDate(estimatedEndDate.getDate() + existingQuote.timeline)

        createdProject = await prisma.project.create({
          data: {
            quoteId: id,
            userId: existingQuote.userId,
            title: projectTitle,
            description: `Proyecto creado automáticamente desde cotización aprobada. Servicio: ${serviceTitle}, Paquete: ${existingQuote.packageType}`,
            serviceType: existingQuote.serviceType,
            packageType: existingQuote.packageType,
            status: 'QUOTE_APPROVED',
            progress: 0,
            budget: existingQuote.totalPrice,
            startDate: new Date(),
            estimatedEndDate: estimatedEndDate,
            milestones: JSON.stringify([
              {
                id: 1,
                title: 'Inicio del proyecto',
                description: 'Proyecto creado y cotización aprobada',
                completed: true,
                completedAt: new Date().toISOString(),
                progress: 10
              },
              {
                id: 2,
                title: 'Planificación',
                description: 'Definición de requerimientos y planificación del proyecto',
                completed: false,
                progress: 0
              },
              {
                id: 3,
                title: 'Desarrollo',
                description: 'Implementación de la solución',
                completed: false,
                progress: 0
              },
              {
                id: 4,
                title: 'Pruebas',
                description: 'Testing y validación de la solución',
                completed: false,
                progress: 0
              },
              {
                id: 5,
                title: 'Entrega',
                description: 'Entrega final del proyecto',
                completed: false,
                progress: 0
              }
            ]),
            statusNotes: 'Proyecto creado automáticamente al aprobar cotización'
          }
        })

        // Project created automatically for approved quote (PATCH method)
      }
    }

    const updatedQuote = await prisma.quote.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            company: true
          }
        }
      }
    })

    // Create notification for user if status changed
    if (status && status !== existingQuote.status) {
      let title = ''
      let message = ''
      
      switch (status) {
        case 'APPROVED':
          title = 'Cotización Aprobada'
          message = createdProject 
            ? `Tu cotización para ${updatedQuote.serviceType} ha sido aprobada y se ha creado el proyecto "${createdProject.title}".`
            : `Tu cotización para ${updatedQuote.serviceType} ha sido aprobada.`
          break
        case 'REJECTED':
          title = 'Cotización Rechazada'
          message = `Tu cotización para ${updatedQuote.serviceType} ha sido rechazada.`
          break
        case 'CONVERTED':
          title = 'Cotización Convertida'
          message = `Tu cotización para ${updatedQuote.serviceType} ha sido convertida en un proyecto.`
          break
        default:
          title = 'Estado de Cotización Actualizado'
          message = `El estado de tu cotización para ${updatedQuote.serviceType} ha sido actualizado.`
      }

      await prisma.notification.create({
        data: {
          userId: existingQuote.userId,
          title,
          message,
          type: status === 'APPROVED' || status === 'CONVERTED' ? 'SUCCESS' : status === 'REJECTED' ? 'WARNING' : 'INFO',
          actionUrl: `/dashboard?tab=quotes&quote=${updatedQuote.id}`
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: createdProject 
        ? `Cotización actualizada exitosamente. Se ha creado automáticamente el proyecto "${createdProject.title}"`
        : 'Cotización actualizada exitosamente',
      data: updatedQuote,
      createdProject
    })

  } catch (error) {
    console.error('Error updating quote:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
