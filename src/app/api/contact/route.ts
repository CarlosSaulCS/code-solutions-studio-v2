import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendContactFormNotification } from '@/lib/email'

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

    // Here you would typically:
    // 1. Save the message to your database ✓
    // 2. Send an email notification to your team
    // 3. Send an auto-reply to the client
    // 4. Create a CRM entry

    // Save contact form to database
    const contactForm = await prisma.contactForm.create({
      data: {
        name,
        email,
        phone: phone || null,
        company: company || null,
        service: service || subject || null, // Use subject if service not provided
        budget: budget || null,
        timeline: timeline || null,
        message,
        status: 'NEW',
        priority: 'MEDIUM',
        responseMethod: 'EMAIL'
      }
    })

    const messageId = contactForm.id
    
    // Contact form saved to database successfully
    const contactMessage = {
      id: contactForm.id,
      name: contactForm.name,
      email: contactForm.email,
      phone: contactForm.phone,
      company: contactForm.company,
      service: contactForm.service,
      budget: contactForm.budget,
      timeline: contactForm.timeline,
      message: contactForm.message,
      status: contactForm.status,
      createdAt: contactForm.createdAt.toISOString(),
    }

    // In a real implementation, you might use a service like:
    // - Nodemailer for sending emails
    // - Resend.com for transactional emails
    // - SendGrid for email delivery
    
    // Send notification to admin
    try {
      await sendContactFormNotification(name, email)
      console.log('Notification sent to admin successfully')
    } catch (emailError) {
      console.error('Error sending admin notification:', emailError)
      // Don't fail the request if email fails
    }

    const response = {
      success: true,
      messageId,
      message: 'Mensaje enviado exitosamente. Te responderemos pronto.',
      data: {
        id: messageId,
        status: 'received',
        estimatedResponseTime: '24 horas',
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error processing contact form:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor. Por favor intenta más tarde.' },
      { status: 500 }
    )
  }
}