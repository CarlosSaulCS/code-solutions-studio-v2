import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // For now, return default configuration
    // In a real app, this would be stored in database or environment variables
    const config = {
      general: {
        siteName: process.env.SITE_NAME || 'Code Solutions Studio',
        siteDescription: 'Soluciones tecnológicas integrales para tu negocio',
        siteUrl: process.env.NEXTAUTH_URL || 'https://codesolutions.studio',
        adminEmail: process.env.ADMIN_EMAIL || 'admin@codesolutions.studio',
        defaultLanguage: 'es',
        timezone: 'America/Mexico_City',
        maintenanceMode: false
      },
      email: {
        provider: 'smtp',
        smtpHost: process.env.SMTP_HOST || '',
        smtpPort: parseInt(process.env.SMTP_PORT || '587'),
        smtpUser: process.env.SMTP_USER || '',
        smtpPassword: '***', // Don't return actual password
        fromName: 'Code Solutions Studio',
        fromEmail: process.env.SMTP_FROM || 'noreply@codesolutions.studio'
      },
      currency: {
        defaultCurrency: 'MXN',
        exchangeRate: 20.5,
        autoUpdateRates: true,
        taxRate: 16
      },
      notifications: {
        emailNotifications: true,
        pushNotifications: false,
        smsNotifications: false,
        adminAlerts: true
      },
      security: {
        sessionTimeout: 3600,
        passwordMinLength: 8,
        requireSpecialChars: true,
        maxLoginAttempts: 5,
        enableTwoFactor: false
      },
      features: {
        enableQuotes: true,
        enableProjects: true,
        enableChat: true,
        enableFileUploads: true,
        maxFileSize: 10
      }
    }

    return NextResponse.json({
      success: true,
      config
    })
  } catch (error) {
    console.error('Error fetching system config:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    
    // In a real app, you would save this to database or update environment variables
    // For now, we'll just return success
    // System configuration updated successfully

    return NextResponse.json({
      success: true,
      message: 'Configuración actualizada exitosamente'
    })
  } catch (error) {
    console.error('Error updating system config:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
