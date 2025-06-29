import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validación básica
    const {
      serviceType,
      packageType,
      basePrice,
      totalPrice,
      timeline,
      contactInfo,
      selectedAddons = [],
      addonsPrice = 0,
      currency = 'MXN',
      notes = ''
    } = body

    // Validar campos requeridos
    if (!serviceType || !packageType || !basePrice || !totalPrice || !contactInfo) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    if (!contactInfo.name || !contactInfo.email) {
      return NextResponse.json(
        { error: 'Nombre y email son requeridos' },
        { status: 400 }
      )
    }

    // Buscar o crear usuario
    let user = await prisma.user.findUnique({
      where: { email: contactInfo.email }
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: contactInfo.name,
          email: contactInfo.email,
          phone: contactInfo.phone || null,
          company: contactInfo.company || null,
          role: 'CLIENT'
        }
      })
    }

    // Crear la cotización
    const quote = await prisma.quote.create({
      data: {
        userId: user.id,
        serviceType,
        packageType,
        selectedAddons: selectedAddons.length > 0 ? JSON.stringify(selectedAddons) : null,
        basePrice,
        addonsPrice,
        totalPrice,
        currency,
        timeline,
        notes,
        status: 'PENDING',
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 días
      }
    })

    console.log('Quote created:', quote)

    // Crear notificación
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: 'QUOTE_CREATED',
        title: 'Cotización Generada',
        message: `Tu cotización para ${serviceType} ha sido generada exitosamente.`,
        read: false
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Cotización creada exitosamente',
      data: {
        quoteId: quote.id,
        serviceType: quote.serviceType,
        packageType: quote.packageType,
        totalPrice: quote.totalPrice,
        currency: quote.currency,
        timeline: quote.timeline,
        status: quote.status,
        validUntil: quote.validUntil,
        createdAt: quote.createdAt
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating quote:', error)
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Error interno del servidor. Por favor intenta de nuevo.',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    )
  }
}
