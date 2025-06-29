import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'

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

    // Try to save to database, but don't fail if it's not available
    let user = null
    let quote = null
    
    try {
      const { prisma } = await import('@/lib/prisma')
      
      // Buscar o crear usuario
      user = await prisma.user.findUnique({
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
      quote = await prisma.quote.create({
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

      console.log('Quote created in database:', quote)

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

    } catch (dbError) {
      console.warn('Database not available, proceeding with email only:', dbError)
    }

    // Send email notification
    try {
      await sendEmail({
        to: process.env.ADMIN_EMAIL || 'carlossaulcante@outlook.com',
        subject: `Nueva cotización - ${contactInfo.name}`,
        html: `
          <h2>Nueva solicitud de cotización</h2>
          <p><strong>Cliente:</strong> ${contactInfo.name}</p>
          <p><strong>Email:</strong> ${contactInfo.email}</p>
          ${contactInfo.phone ? `<p><strong>Teléfono:</strong> ${contactInfo.phone}</p>` : ''}
          ${contactInfo.company ? `<p><strong>Empresa:</strong> ${contactInfo.company}</p>` : ''}
          <hr>
          <p><strong>Servicio:</strong> ${serviceType}</p>
          <p><strong>Paquete:</strong> ${packageType}</p>
          <p><strong>Precio base:</strong> $${basePrice} ${currency}</p>
          <p><strong>Precio total:</strong> $${totalPrice} ${currency}</p>
          <p><strong>Timeline:</strong> ${timeline} días</p>
          ${notes ? `<p><strong>Notas:</strong> ${notes}</p>` : ''}
          ${selectedAddons.length > 0 ? `<p><strong>Add-ons:</strong> ${selectedAddons.join(', ')}</p>` : ''}
          <hr>
          <p><small>Enviado desde: www.codesolutionstudio.com.mx</small></p>
        `
      })
      console.log('Notification email sent successfully')
    } catch (emailError) {
      console.warn('Email sending failed:', emailError)
    }

    return NextResponse.json({
      success: true,
      message: 'Cotización creada exitosamente',
      data: {
        quoteId: quote?.id || `temp-${Date.now()}`,
        serviceType: serviceType,
        packageType: packageType,
        totalPrice: totalPrice,
        currency: currency,
        timeline: timeline,
        status: 'PENDING',
        validUntil: quote?.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        createdAt: quote?.createdAt || new Date()
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
