import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createProjectMeeting, CalendarIntegration } from '@/lib/calendar';
import { prisma } from '@/lib/prisma';
import { withRateLimit } from '@/lib/rate-limit';
import { sendAdminNotificationEmail } from '@/lib/email';

async function createMeetingHandler(request: NextRequest) {
  if (request.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { 
      projectId, 
      startTime, 
      durationMinutes = 60,
      description 
    } = await request.json();

    if (!projectId || !startTime) {
      return NextResponse.json(
        { error: 'ID del proyecto y hora de inicio son requeridos' },
        { status: 400 }
      );
    }

    // Verificar que el proyecto existe y pertenece al usuario
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: session.user.id
      },
      include: {
        user: true
      }
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Proyecto no encontrado' },
        { status: 404 }
      );
    }

    // Para este ejemplo, usaremos tokens de admin para crear la reunión
    // En producción, cada usuario debería tener sus propios tokens de Calendar
    const adminIntegration: CalendarIntegration = {
      accessToken: process.env.ADMIN_CALENDAR_ACCESS_TOKEN || '',
      refreshToken: process.env.ADMIN_CALENDAR_REFRESH_TOKEN
    };

    if (!adminIntegration.accessToken) {
      return NextResponse.json(
        { error: 'Integración de calendario no configurada' },
        { status: 500 }
      );
    }

    // Crear la reunión en el calendario
    const meetingResult = await createProjectMeeting(adminIntegration, {
      title: project.title,
      clientName: project.user.name || 'Cliente',
      clientEmail: project.user.email,
      startTime: new Date(startTime),
      durationMinutes,
      description: description || `Reunión para el proyecto: ${project.title}`
    });

    if (!meetingResult.success) {
      return NextResponse.json(
        { error: meetingResult.error || 'Error al crear la reunión' },
        { status: 500 }
      );
    }

    // Enviar notificación al admin
    await sendAdminNotificationEmail(
      'Nueva reunión programada',
      `
        <h3>Nueva reunión programada</h3>
        <p><strong>Proyecto:</strong> ${project.title}</p>
        <p><strong>Cliente:</strong> ${project.user.name} (${project.user.email})</p>
        <p><strong>Fecha:</strong> ${new Date(startTime).toLocaleString('es-MX')}</p>
        <p><strong>Duración:</strong> ${durationMinutes} minutos</p>
        <p><strong>ID del evento:</strong> ${meetingResult.eventId}</p>
      `
    );

    return NextResponse.json({
      message: 'Reunión creada exitosamente',
      eventId: meetingResult.eventId,
      startTime: new Date(startTime).toISOString(),
      durationMinutes
    });

  } catch (error) {
    console.error('Error creating meeting:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export const POST = withRateLimit(createMeetingHandler, 'general');
