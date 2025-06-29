import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withRateLimit } from '@/lib/rate-limit';
import { hash } from 'bcryptjs';

async function resetPasswordHandler(request: NextRequest) {
  if (request.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token y nueva contraseña son requeridos' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 8 caracteres' },
        { status: 400 }
      );
    }

    // Buscar el token de reset
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!resetToken) {
      return NextResponse.json(
        { error: 'Token de reset inválido o expirado' },
        { status: 400 }
      );
    }

    // Verificar si el token no ha expirado
    if (resetToken.expires < new Date()) {
      // Eliminar token expirado
      await prisma.passwordResetToken.delete({
        where: { token }
      });
      
      return NextResponse.json(
        { error: 'Token de reset expirado' },
        { status: 400 }
      );
    }

    // Hash de la nueva contraseña
    const hashedPassword = await hash(password, 12);

    // Actualizar la contraseña del usuario
    await prisma.user.update({
      where: { id: resetToken.user.id },
      data: { password: hashedPassword }
    });

    // Eliminar el token usado
    await prisma.passwordResetToken.delete({
      where: { token }
    });

    // Eliminar todas las sesiones activas del usuario por seguridad
    await prisma.session.deleteMany({
      where: { userId: resetToken.user.id }
    });

    return NextResponse.json({
      message: 'Contraseña actualizada correctamente'
    });

  } catch (error) {
    console.error('Error reseteando contraseña:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export const POST = withRateLimit(resetPasswordHandler, 'auth');
