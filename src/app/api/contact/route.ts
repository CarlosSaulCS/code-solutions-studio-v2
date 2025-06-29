import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

    // Save contact form to database
    const contactForm = await prisma.contactForm.create({
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

    console.log('Contact form saved:', contactForm)

    // Return success response
    return NextResponse.json({
      success: true,
      messageId: contactForm.id,
      message: 'Mensaje enviado exitosamente. Te responderemos pronto.',
      data: {
        id: contactForm.id,
        name: contactForm.name,
        email: contactForm.email,
        service: contactForm.service,
        status: contactForm.status,
        createdAt: contactForm.createdAt.toISOString(),
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