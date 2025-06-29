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

    const { messageIds, action } = await request.json()

    // Separar IDs de formularios de contacto y mensajes internos
    const contactFormIds = messageIds.filter((id: string) => id.startsWith('contact_')).map((id: string) => id.replace('contact_', ''))
    const internalMessageIds = messageIds.filter((id: string) => !id.startsWith('contact_'))

    switch (action) {
      case 'delete':
        // Eliminar formularios de contacto
        if (contactFormIds.length > 0) {
          await prisma.contactForm.deleteMany({
            where: { id: { in: contactFormIds } }
          })
        }
        
        // Eliminar mensajes internos
        if (internalMessageIds.length > 0) {
          await prisma.message.deleteMany({
            where: { id: { in: internalMessageIds } }
          })
        }
        break
      
      case 'read':
        // Marcar como leídos
        if (contactFormIds.length > 0) {
          await prisma.contactForm.updateMany({
            where: { id: { in: contactFormIds } },
            data: { status: 'IN_PROGRESS', updatedAt: new Date() }
          })
        }
        
        if (internalMessageIds.length > 0) {
          await prisma.message.updateMany({
            where: { id: { in: internalMessageIds } },
            data: { status: 'READ', readAt: new Date() }
          })
        }
        break
      
      case 'archive':
        // Archivar mensajes
        if (contactFormIds.length > 0) {
          await prisma.contactForm.updateMany({
            where: { id: { in: contactFormIds } },
            data: { status: 'CLOSED', updatedAt: new Date() }
          })
        }
        
        if (internalMessageIds.length > 0) {
          await prisma.message.updateMany({
            where: { id: { in: internalMessageIds } },
            data: { status: 'ARCHIVED' }
          })
        }
        break
      
      default:
        return NextResponse.json(
          { error: 'Acción no válida' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      message: `Acción '${action}' aplicada a ${messageIds.length} mensajes`
    })
  } catch (error) {
    console.error('Error performing bulk action:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
