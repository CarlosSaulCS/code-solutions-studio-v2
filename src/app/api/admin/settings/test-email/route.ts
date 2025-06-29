import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendEmail } from '@/lib/email';
import { withRateLimit } from '@/lib/rate-limit';

async function testEmailHandler(request: NextRequest) {
  if (request.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const session = await getServerSession(authOptions);
    
    // Solo admins pueden probar email
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { email, subject, message } = await request.json();

    if (!email || !subject || !message) {
      return NextResponse.json(
        { error: 'Email, asunto y mensaje son requeridos' },
        { status: 400 }
      );
    }

    // Enviar email de prueba
    const result = await sendEmail({
      to: email,
      subject: `[TEST] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Email de Prueba - Code Solutions Studio</h2>
          <p>Este es un email de prueba enviado desde el panel administrativo.</p>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Mensaje:</h3>
            <p>${message}</p>
          </div>
          <p style="color: #64748b; font-size: 14px;">
            Enviado por: ${session.user.name || session.user.email}<br>
            Fecha: ${new Date().toLocaleString('es-MX')}
          </p>
        </div>
      `
    });

    if (!result.success) {
      return NextResponse.json(
        { error: `Error enviando email: ${result.error || 'Unknown error'}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Email de prueba enviado correctamente',
      messageId: result.messageId
    });

  } catch (error) {
    console.error('Error enviando email de prueba:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export const POST = withRateLimit(testEmailHandler, 'general');
