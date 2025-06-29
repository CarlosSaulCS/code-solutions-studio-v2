import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-05-28.basil',
  typescript: true,
});

export const STRIPE_CURRENCY = 'mxn';
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

// Helper function to convert amount to Stripe format (cents)
export function toStripeAmount(amount: number): number {
  return Math.round(amount * 100);
}

// Helper function to convert from Stripe format to regular amount
export function fromStripeAmount(amount: number): number {
  return amount / 100;
}

// Create a payment intent for a project
export async function createPaymentIntent(
  amount: number,
  currency: string = STRIPE_CURRENCY,
  metadata: Record<string, string> = {}
) {
  return await stripe.paymentIntents.create({
    amount: toStripeAmount(amount),
    currency: currency.toLowerCase(),
    automatic_payment_methods: {
      enabled: true,
    },
    metadata,
  });
}

// Create a customer
export async function createStripeCustomer(
  email: string,
  name?: string,
  metadata?: Record<string, string>
) {
  return await stripe.customers.create({
    email,
    name,
    metadata,
  });
}

// Get payment intent
export async function getPaymentIntent(paymentIntentId: string) {
  return await stripe.paymentIntents.retrieve(paymentIntentId);
}

// Cancel payment intent
export async function cancelPaymentIntent(paymentIntentId: string) {
  return await stripe.paymentIntents.cancel(paymentIntentId);
}

// Create refund
export async function createRefund(
  paymentIntentId: string,
  amount?: number,
  reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer'
) {
  const refundData: any = {
    payment_intent: paymentIntentId,
  };
  
  if (amount) {
    refundData.amount = toStripeAmount(amount);
  }
  
  if (reason) {
    refundData.reason = reason;
  }
  
  return await stripe.refunds.create(refundData);
}
