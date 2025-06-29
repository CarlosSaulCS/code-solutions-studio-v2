import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { withRateLimit } from '@/lib/rate-limit'
import { sendQuoteApprovedEmail, sendContactFormNotification } from '@/lib/email'
import { calculateQuote, ServiceType, PackageType, generateQuoteSummary } from '@/lib/pricing'

// Types for quote data
interface QuoteRequestData {
  client: {
    name: string
    email: string
    phone?: string
    company?: string
  }
  project: {
    service: string // WEB, MOBILE, ECOMMERCE, CLOUD, AI, CONSULTING
    option: string  // STARTUP, BUSINESS, ENTERPRISE, CUSTOM
    timeline?: number
    addons?: string[]
    currency?: 'MXN' | 'USD'
  }
  requirements?: string
}

// Service type mapping
const SERVICE_TYPE_MAP: Record<string, ServiceType> = {
  'web': 'WEB',
  'mobile': 'MOBILE',
  'ecommerce': 'ECOMMERCE',
  'cloud': 'CLOUD',
  'ai': 'AI',
  'consulting': 'CONSULTING'
}

// Package type mapping
const PACKAGE_TYPE_MAP: Record<string, PackageType> = {
  'startup': 'STARTUP',
  'business': 'BUSINESS',
  'enterprise': 'ENTERPRISE',
  'custom': 'CUSTOM'
}

async function handleCreateQuote(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()

    // Handle both new format and legacy format
    const quoteData: QuoteRequestData = body.client ? body : {
      client: {
        name: body.contactInfo?.name || body.name || '',
        email: body.contactInfo?.email || body.email || '',
        phone: body.contactInfo?.phone || body.phone,
        company: body.contactInfo?.company || body.company
      },
      project: {
        service: body.service || 'web',
        option: body.option || 'startup',
        addons: body.addons || [],
        currency: body.currency || 'MXN'
      },
      requirements: body.requirements || body.message || ''
    }

    // Validate required fields
    if (!quoteData.client?.email || !quoteData.client?.name) {
      return NextResponse.json(
        { error: 'Email y nombre son requeridos' },
        { status: 400 }
      )
    }

    // Map service and package types
    const serviceType = SERVICE_TYPE_MAP[quoteData.project.service.toLowerCase()] || 'WEB'
    const packageType = PACKAGE_TYPE_MAP[quoteData.project.option.toLowerCase()] || 'STARTUP'

    // Calculate pricing automatically
    const calculation = calculateQuote(
      serviceType,
      packageType,
      quoteData.project.addons || [],
      quoteData.project.currency || 'MXN'
    )

    // Find or create user
    let userId: string | null = null
    
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email }
      })
      userId = user?.id || null
    }

    // If not logged in but email provided, try to find existing user
    if (!userId && quoteData.client.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: quoteData.client.email }
      })
      
      if (existingUser) {
        userId = existingUser.id
      } else {
        // Create a new user for the quote
        const newUser = await prisma.user.create({
          data: {
            email: quoteData.client.email,
            name: quoteData.client.name,
            phone: quoteData.client.phone,
            company: quoteData.client.company,
            role: 'CLIENT'
          }
        })
        userId = newUser.id
      }
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'No se pudo crear o encontrar el usuario' },
        { status: 400 }
      )
    }

    // Calculate valid until date (30 days from now)
    const validUntil = new Date()
    validUntil.setDate(validUntil.getDate() + 30)

    // Create quote in database
    const quote = await prisma.quote.create({
      data: {
        userId,
        serviceType,
        packageType,
        selectedAddons: JSON.stringify(quoteData.project.addons || []),
        basePrice: calculation.basePrice,
        addonsPrice: calculation.addonsPrice,
        totalPrice: calculation.totalPrice,
        currency: calculation.currency,
        timeline: calculation.timeline,
        notes: quoteData.requirements,
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

    // Create notification for admin
    try {
      const adminUser = await prisma.user.findFirst({
        where: { role: 'ADMIN' },
        select: { id: true }
      })
      
      if (adminUser) {
        await prisma.notification.create({
          data: {
            userId: adminUser.id,
            title: 'Nueva cotización recibida',
            message: `Nueva cotización de ${quoteData.client.name} por ${calculation.currency} ${calculation.totalPrice.toLocaleString()}`,
            type: 'INFO',
            actionUrl: `/admin/quotes/${quote.id}`
          }
        })
      }
    } catch (error) {
      console.error('Error creating notification:', error)
    }

    // Send notification email to admin
    try {
      await sendContactFormNotification(quoteData.client.name, quoteData.client.email)
    } catch (error) {
      console.error('Error sending admin notification:', error)
    }

    // Generate quote summary
    const quoteSummary = generateQuoteSummary(
      serviceType,
      packageType,
      calculation,
      quoteData.client
    )

    return NextResponse.json({
      success: true,
      data: {
        quote: {
          id: quote.id,
          serviceType: quote.serviceType,
          packageType: quote.packageType,
          basePrice: quote.basePrice,
          addonsPrice: quote.addonsPrice,
          totalPrice: quote.totalPrice,
          currency: quote.currency,
          timeline: quote.timeline,
          status: quote.status,
          validUntil: quote.validUntil,
          createdAt: quote.createdAt,
          features: calculation.features,
          addons: calculation.addons
        },
        user: quote.user,
        summary: quoteSummary
      }
    })

  } catch (error) {
    console.error('Error creating quote:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

async function handleGetQuotes(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Get user from database to check role and get ID
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build where clause
    const where: any = {}
    
    // If user is not admin, only show their quotes
    if (user.role !== 'ADMIN') {
      where.userId = user.id
    } else if (userId) {
      where.userId = userId
    }
    
    if (status) {
      where.status = status
    }

    const quotes = await prisma.quote.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true
          }
        },
        project: {
          select: {
            id: true,
            title: true,
            status: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    })

    const total = await prisma.quote.count({ where })

    return NextResponse.json({
      success: true,
      data: {
        quotes,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total
        }
      }
    })

  } catch (error) {
    console.error('Error fetching quotes:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export const POST = withRateLimit(handleCreateQuote, 'quotes')
export const GET = withRateLimit(handleGetQuotes, 'general')
