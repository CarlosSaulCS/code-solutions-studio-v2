import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { content, responseMethod, sendEmail } = await request.json()
    const { id: messageId } = await params

    if (!content?.trim()) {
      return NextResponse.json({ error: 'El contenido de la respuesta es requerido' }, { status: 400 })
    }

    // Determinar si es un formulario de contacto o mensaje interno
    const isContactForm = messageId.startsWith('contact_')
    const actualId = isContactForm ? messageId.replace('contact_', '') : messageId

    if (isContactForm) {
      // Actualizar estado del formulario de contacto
      const contactForm = await prisma.contactForm.update({
        where: { id: actualId },
        data: {
          status: 'REPLIED',
          updatedAt: new Date(),
          internalNotes: content
        }
      })

      // Si se selecciona enviar email, aquí iría la lógica de envío
      if (sendEmail) {
        // TODO: Integrar con servicio de email (Nodemailer, SendGrid, etc.)
        // Email would be sent to: ${contactForm.email} with content: ${content}
        
        // Por ahora, crear una notificación de que se debe enviar manualmente
        await createEmailTask(contactForm.email, contactForm.name, content, 'contact_form_reply')
      }

      return NextResponse.json({
        success: true,
        message: sendEmail 
          ? 'Respuesta guardada y email programado para envío'
          : 'Respuesta guardada correctamente',
        data: {
          type: 'contact_form',
          email: contactForm.email,
          requiresManualEmail: sendEmail && true // Cambia a false cuando tengas email integrado
        }
      })
    } else {
      // Manejar mensaje interno del sistema
      const message = await prisma.message.findUnique({
        where: { id: actualId },
        include: {
          user: { select: { email: true, name: true } }
        }
      })

      if (!message) {
        return NextResponse.json({ error: 'Mensaje no encontrado' }, { status: 404 })
      }

      // Actualizar mensaje como respondido
      await prisma.message.update({
        where: { id: actualId },
        data: {
          status: 'REPLIED',
          repliedAt: new Date()
        }
      })

      // Crear respuesta como nuevo mensaje del admin
      await prisma.message.create({
        data: {
          userId: message.userId,
          projectId: message.projectId,
          content: content,
          type: 'TEXT',
          isFromAdmin: true,
          status: 'READ',
          priority: 'MEDIUM',
          subject: `Re: ${message.subject || 'Mensaje'}`,
          responseMethod: responseMethod || 'CHAT'
        }
      })

      // Si se selecciona enviar email, crear tarea de email
      if (sendEmail && message.user.email) {
        await createEmailTask(message.user.email, message.user.name || 'Usuario', content, 'internal_message_reply')
      }

      return NextResponse.json({
        success: true,
        message: sendEmail 
          ? 'Respuesta enviada al chat y email programado'
          : 'Respuesta enviada al chat interno',
        data: {
          type: 'internal_message',
          email: message.user.email,
          requiresManualEmail: sendEmail && true
        }
      })
    }
  } catch (error) {
    console.error('Error sending reply:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Función para crear tareas de email (puede ser una tabla separada o notificaciones)
async function createEmailTask(
  email: string, 
  name: string, 
  content: string, 
  type: 'contact_form_reply' | 'internal_message_reply'
) {
  try {
    // Buscar un usuario admin para crear la notificación
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })
    
    if (adminUser) {
      await prisma.notification.create({
        data: {
          userId: adminUser.id,
          title: '📧 Email pendiente de envío',
          message: `Responder a ${name} (${email}): ${content.substring(0, 100)}...`,
          type: 'INFO',
          actionUrl: `mailto:${email}?subject=Re: Tu consulta&body=${encodeURIComponent(content)}`
        }
      })
    }
  } catch (error) {
    console.error('Error creating email task:', error)
  }
}
