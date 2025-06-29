import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Verificar conexión a base de datos
    const dbStart = Date.now();
    const userCount = await prisma.user.count();
    const quoteCount = await prisma.quote.count();
    const projectCount = await prisma.project.count();
    const dbDuration = Date.now() - dbStart;
    
    // Verificar variables de entorno críticas
    const envCheck = {
      database: !!process.env.DATABASE_URL,
      nextauth: !!process.env.NEXTAUTH_SECRET,
      resend: !!process.env.RESEND_API_KEY,
      stripe: !!process.env.STRIPE_SECRET_KEY,
      googleOAuth: !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET,
      githubOAuth: !!process.env.GITHUB_CLIENT_ID && !!process.env.GITHUB_CLIENT_SECRET,
    };

    // Estado de funcionalidades
    const features = {
      authentication: envCheck.nextauth,
      emailService: envCheck.resend,
      payments: envCheck.stripe,
      fileUpload: true, // Siempre disponible (local)
      rateLimit: true, // Siempre disponible
      quotingSystem: true, // Implementado
      calendar: envCheck.googleOAuth,
      reports: true, // Implementado
      oauthGoogle: envCheck.googleOAuth,
      oauthGithub: envCheck.githubOAuth,
    };

    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      database: {
        connected: true,
        users: userCount,
        quotes: quoteCount,
        projects: projectCount,
      },
      configuration: envCheck,
      features,
      endpoints: {
        auth: [
          '/api/auth/login',
          '/api/auth/register', 
          '/api/auth/verify-email',
          '/api/auth/reset-password'
        ],
        business: [
          '/api/quotes',
          '/api/payments/create',
          '/api/payments/webhook',
          '/api/calendar/create-meeting'
        ],
        files: [
          '/api/files/upload',
          '/api/files/download'
        ],
        admin: [
          '/api/admin/reports'
        ]
      },
      integrations: {
        stripe: envCheck.stripe ? 'configured' : 'not configured',
        resend: envCheck.resend ? 'configured' : 'not configured',
        googleCalendar: envCheck.googleOAuth ? 'configured' : 'not configured',
        oAuth: {
          google: envCheck.googleOAuth ? 'configured' : 'not configured',
          github: envCheck.githubOAuth ? 'configured' : 'not configured'
        }
      }
    };

    const responseTime = Date.now() - startTime;
    
    logger.info('Health check completed', {
      responseTime,
      dbResponseTime: dbDuration,
      userCount,
      quoteCount,
      projectCount
    });

    return NextResponse.json(health);

  } catch (error) {
    const responseTime = Date.now() - startTime;
    logger.error('Health check failed', error, { responseTime });
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      responseTime,
      database: {
        connected: false
      }
    }, { status: 500 });
  }
}
