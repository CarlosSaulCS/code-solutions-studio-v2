import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';
import { withRateLimit } from '@/lib/rate-limit';
import { randomUUID } from 'crypto';

async function requestResetHandler(request: NextRequest) {
  if (request.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email es requerido' },
        { status: 400 }
      );
    }

    // Verificar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    // Siempre devolver éxito por seguridad (no revelar si el email existe)
    if (!user) {
      return NextResponse.json({
        message: 'Si el email existe, recibirás instrucciones para resetear tu contraseña'
      });
    }

    // Solo permitir reset para usuarios con cuentas verificadas
    if (!user.emailVerified) {
      return NextResponse.json({
        message: 'Si el email existe, recibirás instrucciones para resetear tu contraseña'
      });
    }

    // Eliminar tokens de reset anteriores
    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id }
    });

    // Crear nuevo token de reset
    const resetToken = randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 minutos

    await prisma.passwordResetToken.create({
      data: {
        token: resetToken,
        userId: user.id,
        expires: expiresAt
      }
    });

    // Enviar email de reset
    await sendPasswordResetEmail(user.email, user.name || 'Usuario', resetToken);

    return NextResponse.json({
      message: 'Si el email existe, recibirás instrucciones para resetear tu contraseña'
    });

  } catch (error) {
    console.error('Error solicitando reset de contraseña:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export const POST = withRateLimit(requestResetHandler, 'auth');
