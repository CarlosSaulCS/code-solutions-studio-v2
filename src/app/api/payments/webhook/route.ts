import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe, STRIPE_WEBHOOK_SECRET } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { sendPaymentConfirmationEmail, sendAdminNotificationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature || !STRIPE_WEBHOOK_SECRET) {
      console.error('Missing signature or webhook secret');
      return NextResponse.json(
        { error: 'Missing signature or webhook secret' },
        { status: 400 }
      );
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      
      case 'payment_intent.canceled':
        await handlePaymentCanceled(event.data.object);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentSuccess(paymentIntent: any) {
  try {
    // Buscar el pago por stripePaymentId usando findFirst ya que no es unique
    const payment = await prisma.payment.findFirst({
      where: { stripePaymentId: paymentIntent.id },
      include: {
        user: true,
        project: true
      }
    });

    if (!payment) {
      console.error('Payment not found for Stripe ID:', paymentIntent.id);
      return;
    }

    // Actualizar el pago en la base de datos
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'COMPLETED',
        paidAt: new Date()
      }
    });

    // Actualizar el estado del proyecto si es el primer pago
    if (payment.project.status === 'QUOTE_APPROVED') {
      await prisma.project.update({
        where: { id: payment.project.id },
        data: {
          status: 'PLANNING',
          startDate: new Date()
        }
      });
    }

    // Enviar email de confirmación al cliente
    if (payment.user.email) {
      await sendPaymentConfirmationEmail(
        payment.user.email,
        payment.user.name || 'Cliente',
        {
          amount: payment.amount,
          currency: payment.currency,
          projectTitle: payment.project.title,
          paymentId: payment.id
        }
      );
    }

    // Notificar al admin
    await sendAdminNotificationEmail(
      `Pago recibido: $${payment.amount} ${payment.currency}`,
      `
        <h3>Nuevo pago recibido</h3>
        <p><strong>Cliente:</strong> ${payment.user.name} (${payment.user.email})</p>
        <p><strong>Proyecto:</strong> ${payment.project.title}</p>
        <p><strong>Monto:</strong> $${payment.amount} ${payment.currency}</p>
        <p><strong>ID de pago:</strong> ${payment.id}</p>
        <p><strong>Stripe ID:</strong> ${paymentIntent.id}</p>
      `
    );

    console.log('Payment success handled:', paymentIntent.id);
  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

async function handlePaymentFailed(paymentIntent: any) {
  try {
    // Buscar y actualizar el pago
    const payment = await prisma.payment.findFirst({
      where: { stripePaymentId: paymentIntent.id }
    });
    
    if (payment) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED' }
      });
    }

    console.log('Payment failed handled:', paymentIntent.id);
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

async function handlePaymentCanceled(paymentIntent: any) {
  try {
    // Buscar y eliminar el pago
    const payment = await prisma.payment.findFirst({
      where: { stripePaymentId: paymentIntent.id }
    });
    
    if (payment) {
      await prisma.payment.delete({
        where: { id: payment.id }
      });
    }

    console.log('Payment canceled handled:', paymentIntent.id);
  } catch (error) {
    console.error('Error handling payment cancellation:', error);
  }
}
