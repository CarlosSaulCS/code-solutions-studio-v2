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

    // Obtener mensajes del sistema interno
    const messages = await prisma.message.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
            company: true
          }
        },
        project: {
          select: {
            title: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Obtener formularios de contacto como mensajes
    const contactForms = await prisma.contactForm.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transformar mensajes internos
    const transformedMessages = messages.map((message: any) => ({
      id: message.id,
      content: message.content,
      senderName: message.user?.name || 'Usuario Desconocido',
      senderEmail: message.user?.email || '',
      senderPhone: message.user?.phone || '',
      senderCompany: message.user?.company || '',
      recipientName: 'Administrador',
      recipientEmail: 'admin@codesolutions.studio',
      subject: message.subject || message.project?.title || 'Mensaje del sistema',
      type: message.type as 'CHAT' | 'SUPPORT' | 'NOTIFICATION' | 'SYSTEM',
      status: message.status as 'UNREAD' | 'READ' | 'REPLIED' | 'ARCHIVED',
      priority: message.priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
      createdAt: message.createdAt.toISOString(),
      readAt: message.readAt?.toISOString(),
      repliedAt: message.repliedAt?.toISOString(),
      hasAttachments: false,
      quoteId: undefined,
      projectId: message.projectId || undefined,
      requiresEmailResponse: message.requiresEmailResponse || false,
      responseMethod: message.responseMethod || 'CHAT',
      source: 'INTERNAL' as const
    }))

    // Transformar formularios de contacto en mensajes
    const transformedContactForms = contactForms.map((form: any) => ({
      id: `contact_${form.id}`,
      content: `${form.message}\n\n--- Detalles del contacto ---\n` +
               `Servicio solicitado: ${form.service || 'No especificado'}\n` +
               `Presupuesto: ${form.budget || 'No especificado'}\n` +
               `Timeline: ${form.timeline || 'No especificado'}\n` +
               `Empresa: ${form.company || 'No especificada'}`,
      senderName: form.name,
      senderEmail: form.email,
      senderPhone: form.phone || '',
      senderCompany: form.company || '',
      recipientName: 'Administrador',
      recipientEmail: 'admin@codesolutions.studio',
      subject: `Nuevo contacto: ${form.service || 'Consulta general'}`,
      type: 'SUPPORT' as const,
      status: mapContactFormStatus(form.status),
      priority: form.priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
      createdAt: form.createdAt.toISOString(),
      readAt: form.status !== 'NEW' ? form.updatedAt.toISOString() : undefined,
      repliedAt: form.status === 'REPLIED' ? form.updatedAt.toISOString() : undefined,
      hasAttachments: false,
      quoteId: undefined,
      projectId: undefined,
      requiresEmailResponse: true, // Formularios de contacto siempre requieren respuesta por email
      responseMethod: form.responseMethod || 'EMAIL',
      source: 'CONTACT_FORM' as const,
      originalFormId: form.id,
      serviceRequested: form.service,
      budgetRange: form.budget,
      timelineRequested: form.timeline
    }))

    // Combinar y ordenar todos los mensajes
    const allMessages = [...transformedMessages, ...transformedContactForms]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({
      success: true,
      data: allMessages
    })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

function mapContactFormStatus(status: string): 'UNREAD' | 'READ' | 'REPLIED' | 'ARCHIVED' {
  switch (status) {
    case 'NEW': return 'UNREAD'
    case 'IN_PROGRESS': return 'READ'
    case 'REPLIED': return 'REPLIED'
    case 'CLOSED': return 'ARCHIVED'
    default: return 'UNREAD'
  }
}

function determineMessageType(content: string): 'CHAT' | 'SUPPORT' | 'NOTIFICATION' | 'SYSTEM' {
  const lowerContent = content.toLowerCase()
  
  if (lowerContent.includes('ayuda') || lowerContent.includes('problema') || lowerContent.includes('error')) {
    return 'SUPPORT'
  }
  if (lowerContent.includes('notificación') || lowerContent.includes('aviso')) {
    return 'NOTIFICATION'
  }
  if (lowerContent.includes('sistema') || lowerContent.includes('automático')) {
    return 'SYSTEM'
  }
  
  return 'CHAT'
}

function determinePriority(content: string): 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' {
  const lowerContent = content.toLowerCase()
  
  if (lowerContent.includes('urgente') || lowerContent.includes('crítico') || lowerContent.includes('inmediato')) {
    return 'URGENT'
  }
  if (lowerContent.includes('importante') || lowerContent.includes('prioridad')) {
    return 'HIGH'
  }
  if (lowerContent.includes('cuando puedas') || lowerContent.includes('sin prisa')) {
    return 'LOW'
  }
  
  return 'MEDIUM'
}
