import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createQuoteSchema = z.object({
  serviceType: z.string(),
  packageType: z.string(),
  selectedAddons: z.array(z.string()).optional(),
  basePrice: z.number(),
  addonsPrice: z.number().default(0),
  totalPrice: z.number(),
  currency: z.string().default('MXN'),
  timeline: z.number(),
  notes: z.string().optional(),
  contactInfo: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string().optional(),
    company: z.string().optional(),
    message: z.string().optional()
  })
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const validatedData = createQuoteSchema.parse(body)

    let userId = session?.user?.id

    // Si no hay sesión, crear usuario temporal o usar datos de contacto
    if (!userId && validatedData.contactInfo) {
      // Buscar si existe usuario con este email
      let user = await prisma.user.findUnique({
        where: { email: validatedData.contactInfo.email }
      })

      // Si no existe, crear uno nuevo
      if (!user) {
        user = await prisma.user.create({
          data: {
            name: validatedData.contactInfo.name,
            email: validatedData.contactInfo.email,
            phone: validatedData.contactInfo.phone,
            company: validatedData.contactInfo.company,
            role: 'CLIENT'
          }
        })
      }

      userId = user.id
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'Usuario no autenticado y datos de contacto faltantes' },
        { status: 401 }
      )
    }

    // Calcular fecha de validez (30 días)
    const validUntil = new Date()
    validUntil.setDate(validUntil.getDate() + 30)

    // Crear la cotización
    const quote = await prisma.quote.create({
      data: {
        userId,
        serviceType: validatedData.serviceType,
        packageType: validatedData.packageType,
        selectedAddons: validatedData.selectedAddons ? JSON.stringify(validatedData.selectedAddons) : undefined,
        basePrice: validatedData.basePrice,
        addonsPrice: validatedData.addonsPrice,
        totalPrice: validatedData.totalPrice,
        currency: validatedData.currency,
        timeline: validatedData.timeline,
        notes: validatedData.notes,
        validUntil,
        status: 'PENDING'
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
        }
      }
    })

    // Crear notificación para el usuario
    await prisma.notification.create({
      data: {
        userId,
        title: '🎉 Cotización Creada',
        message: `Tu cotización para ${getServiceDisplayName(validatedData.serviceType)} ha sido generada exitosamente.`,
        type: 'SUCCESS',
        actionUrl: `/dashboard#quotes`
      }
    })

    // Crear notificación para admins
    const adminUsers = await prisma.user.findMany({
      where: { role: 'ADMIN' }
    })

    for (const admin of adminUsers) {
      await prisma.notification.create({
        data: {
          userId: admin.id,
          title: '📋 Nueva Cotización',
          message: `Nueva cotización de ${quote.user.name} para ${getServiceDisplayName(validatedData.serviceType)} - ${validatedData.packageType}`,
          type: 'INFO',
          actionUrl: `/admin/quotes/${quote.id}`
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Cotización creada exitosamente',
      quote: {
        id: quote.id,
        serviceType: quote.serviceType,
        packageType: quote.packageType,
        totalPrice: quote.totalPrice,
        currency: quote.currency,
        status: quote.status,
        validUntil: quote.validUntil
      }
    })

  } catch (error) {
    console.error('Error al crear cotización:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

function getServiceDisplayName(serviceType: string): string {
  const names: Record<string, string> = {
    web: 'Desarrollo Web',
    mobile: 'Aplicaciones Móviles',
    ecommerce: 'E-commerce',
    cloud: 'Migración a la Nube',
    ai: 'Inteligencia Artificial',
    consulting: 'Consultoría TI'
  }
  return names[serviceType] || serviceType
}
