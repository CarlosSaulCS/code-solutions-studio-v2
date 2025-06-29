import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createPaymentIntent, createStripeCustomer } from '@/lib/stripe';
import { withRateLimit } from '@/lib/rate-limit';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function createPaymentHandler(request: NextRequest) {
  if (request.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { projectId, amount, description } = await request.json();

    if (!projectId || !amount) {
      return NextResponse.json(
        { error: 'ID del proyecto y monto son requeridos' },
        { status: 400 }
      );
    }

    // Verificar que el proyecto existe y pertenece al usuario
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: session.user.id
      }
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Proyecto no encontrado' },
        { status: 404 }
      );
    }

    // Obtener información del usuario y su stripeCustomerId usando SQL directo
    const userRecord = await prisma.$queryRaw<{
      id: string;
      email: string;
      name: string | null;
      stripeCustomerId: string | null;
    }[]>`SELECT id, email, name, stripeCustomerId FROM users WHERE id = ${session.user.id}`;

    if (!userRecord || userRecord.length === 0) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    const user = userRecord[0];

    // Crear o obtener customer de Stripe
    let stripeCustomerId = user.stripeCustomerId;
    
    if (!stripeCustomerId && user.email) {
      const customer = await createStripeCustomer(
        user.email,
        user.name || undefined,
        {
          userId: user.id,
          projectId: project.id
        }
      );
      
      stripeCustomerId = customer.id;
      
      // Actualizar el usuario con el customer ID usando SQL directo
      await prisma.$executeRaw`UPDATE users SET stripeCustomerId = ${stripeCustomerId} WHERE id = ${user.id}`;
    }

    // Crear payment intent en Stripe
    const paymentIntent = await createPaymentIntent(
      amount,
      'mxn',
      {
        projectId: project.id,
        userId: user.id,
        description: description || `Pago para proyecto: ${project.title}`
      }
    );

    // Crear registro de pago en la base de datos
    const payment = await prisma.payment.create({
      data: {
        projectId: project.id,
        userId: user.id,
        stripePaymentId: paymentIntent.id,
        amount,
        currency: 'MXN',
        status: 'PENDING',
        description: description || `Pago para proyecto: ${project.title}`
      }
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment.id,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency
    });

  } catch (error) {
    console.error('Error creando pago:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export const POST = withRateLimit(createPaymentHandler, 'general');
