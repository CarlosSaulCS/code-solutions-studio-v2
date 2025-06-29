import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendWelcomeEmail } from '@/lib/email';
import { withRateLimit } from '@/lib/rate-limit';

async function verifyEmailHandler(request: NextRequest) {
  if (request.method !== 'GET') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token de verificación requerido' },
        { status: 400 }
      );
    }

    // Buscar el token de verificación usando SQL directo para evitar problemas de tipos
    const verificationTokens = await prisma.$queryRaw<Array<{
      id: string;
      token: string;
      expires: Date;
      userId: string;
    }>>`SELECT * FROM email_verification_tokens WHERE token = ${token}`;

    if (!verificationTokens || verificationTokens.length === 0) {
      return NextResponse.json(
        { error: 'Token de verificación inválido o expirado' },
        { status: 400 }
      );
    }

    const verificationToken = verificationTokens[0];

    // Verificar si el token no ha expirado
    if (verificationToken.expires < new Date()) {
      // Eliminar token expirado
      await prisma.$executeRaw`DELETE FROM email_verification_tokens WHERE token = ${token}`;
      
      return NextResponse.json(
        { error: 'Token de verificación expirado' },
        { status: 400 }
      );
    }

    // Obtener el usuario asociado al token
    const user = await prisma.user.findUnique({
      where: { id: verificationToken.userId },
      select: {
        id: true,
        email: true,
        name: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 400 }
      );
    }

    // Activar la cuenta del usuario
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() }
    });

    // Eliminar el token usado
    await prisma.$executeRaw`DELETE FROM email_verification_tokens WHERE token = ${token}`;

    // Enviar email de bienvenida
    if (user.email) {
      await sendWelcomeEmail(
        user.email,
        user.name || 'Usuario'
      );
    }

    // Redirigir al login con mensaje de éxito
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('verified', 'true');
    
    return NextResponse.redirect(loginUrl);

  } catch (error) {
    console.error('Error verificando email:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export const GET = withRateLimit(verifyEmailHandler, 'auth');
