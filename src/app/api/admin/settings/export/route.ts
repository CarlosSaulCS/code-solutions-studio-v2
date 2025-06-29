import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { withRateLimit } from '@/lib/rate-limit';
import { prisma } from '@/lib/prisma';

async function exportSettingsHandler(request: NextRequest) {
  if (request.method !== 'GET') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const session = await getServerSession(authOptions);
    
    // Solo admins pueden exportar configuraciones
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Obtener estadísticas y configuraciones del sistema
    const [users, quotes, projects, payments, messages] = await Promise.all([
      prisma.user.count(),
      prisma.quote.count(),
      prisma.project.count(),
      prisma.payment.count(),
      prisma.message.count()
    ]);

    // Obtener usuarios más recientes
    const recentUsers = await prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    // Obtener cotizaciones recientes
    const recentQuotes = await prisma.quote.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        serviceType: true,
        packageType: true,
        totalPrice: true,
        status: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    const exportData = {
      exportInfo: {
        generatedAt: new Date().toISOString(),
        generatedBy: session.user.email,
        systemVersion: '1.0.0'
      },
      statistics: {
        totalUsers: users,
        totalQuotes: quotes,
        totalProjects: projects,
        totalPayments: payments,
        totalMessages: messages
      },
      systemConfig: {
        environment: process.env.NODE_ENV || 'development',
        databaseUrl: process.env.DATABASE_URL ? 'configured' : 'not_configured',
        resendApiKey: process.env.RESEND_API_KEY ? 'configured' : 'not_configured',
        stripeSecretKey: process.env.STRIPE_SECRET_KEY ? 'configured' : 'not_configured',
        nextauthSecret: process.env.NEXTAUTH_SECRET ? 'configured' : 'not_configured',
        nextauthUrl: process.env.NEXTAUTH_URL || 'not_configured'
      },
      recentData: {
        users: recentUsers,
        quotes: recentQuotes
      }
    };

    // Generar archivo JSON para descarga
    const fileName = `code-solutions-export-${new Date().toISOString().split('T')[0]}.json`;
    
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${fileName}"`
      }
    });

  } catch (error) {
    console.error('Error exportando configuraciones:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export const GET = withRateLimit(exportSettingsHandler, 'general');
