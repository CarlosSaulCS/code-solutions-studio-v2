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

    const { status, priority } = await request.json()
    const { id: messageId } = await params

    // Determinar si es un formulario de contacto o mensaje interno
    const isContactForm = messageId.startsWith('contact_')
    const actualId = isContactForm ? messageId.replace('contact_', '') : messageId

    if (isContactForm) {
      // Actualizar formulario de contacto
      const statusMap: { [key: string]: string } = {
        'UNREAD': 'NEW',
        'READ': 'IN_PROGRESS',
        'REPLIED': 'REPLIED',
        'ARCHIVED': 'CLOSED'
      }

      await prisma.contactForm.update({
        where: { id: actualId },
        data: {
          status: statusMap[status] || status,
          priority: priority,
          updatedAt: new Date()
        }
      })
    } else {
      // Actualizar mensaje interno
      const updateData: any = { updatedAt: new Date() }
      
      if (status) {
        updateData.status = status
        if (status === 'READ' && !updateData.readAt) {
          updateData.readAt = new Date()
        }
      }
      if (priority) updateData.priority = priority

      await prisma.message.update({
        where: { id: actualId },
        data: updateData
      })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Estado del mensaje actualizado correctamente'
    })
  } catch (error) {
    console.error('Error updating message:', error)
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

    const { id: messageId } = await params

    // Determinar si es un formulario de contacto o mensaje interno
    const isContactForm = messageId.startsWith('contact_')
    const actualId = isContactForm ? messageId.replace('contact_', '') : messageId

    if (isContactForm) {
      // Eliminar formulario de contacto
      await prisma.contactForm.delete({
        where: { id: actualId }
      })
    } else {
      // Eliminar mensaje interno
      await prisma.message.delete({
        where: { id: actualId }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Mensaje eliminado correctamente'
    })
  } catch (error) {
    console.error('Error deleting message:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
