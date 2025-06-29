import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      name,
      email,
      phone,
      company,
      service,
      budget,
      timeline,
      message,
      subject // For simple contact form
    } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Nombre, email y mensaje son requeridos' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Formato de email inválido' },
        { status: 400 }
      )
    }

    // Try to save to database, but don't fail if it's not available
    let contactForm = null
    try {
      const { prisma } = await import('@/lib/prisma')
      contactForm = await prisma.contactForm.create({
        data: {
          name,
          email,
          phone: phone || null,
          company: company || null,
          service: service || subject || null,
          budget: budget || null,
          timeline: timeline || null,
          message,
          status: 'NEW',
          priority: 'MEDIUM',
          responseMethod: 'EMAIL'
        }
      })
      console.log('Contact form saved to database:', contactForm)
    } catch (dbError) {
      console.warn('Database not available, proceeding with email only:', dbError)
    }

    // Send email notification
    try {
      await sendEmail({
        to: process.env.ADMIN_EMAIL || 'carlossaulcante@outlook.com',
        subject: `Nuevo mensaje de contacto - ${name}`,
        html: `
          <h2>Nuevo mensaje de contacto</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Teléfono:</strong> ${phone}</p>` : ''}
          ${company ? `<p><strong>Empresa:</strong> ${company}</p>` : ''}
          ${service ? `<p><strong>Servicio:</strong> ${service}</p>` : ''}
          ${budget ? `<p><strong>Presupuesto:</strong> ${budget}</p>` : ''}
          ${timeline ? `<p><strong>Timeline:</strong> ${timeline}</p>` : ''}
          <p><strong>Mensaje:</strong></p>
          <p>${message}</p>
          <hr>
          <p><small>Enviado desde: www.codesolutionstudio.com.mx</small></p>
        `
      })
      console.log('Notification email sent successfully')
    } catch (emailError) {
      console.warn('Email sending failed:', emailError)
    }

    // Return success response
    return NextResponse.json({
      success: true,
      messageId: contactForm?.id || `temp-${Date.now()}`,
      message: 'Mensaje enviado exitosamente. Te responderemos pronto.',
      data: {
        id: contactForm?.id || `temp-${Date.now()}`,
        name: name,
        email: email,
        service: service || subject,
        status: 'NEW',
        createdAt: new Date().toISOString(),
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Error processing contact form:', error)
    
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