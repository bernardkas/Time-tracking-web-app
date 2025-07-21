'use server';

import { auth } from '@/auth';
import prisma from '@/db/db';
import Stripe from 'stripe';

export const payment = async (priceId: string | null) => {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: {
      id: session?.user?.id,
    },
  });
  const userid = user?.id;
  try {
    const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!);
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId!,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: process.env.STRIPE_URL_SUCCESS_PRODUCTION_REDIRECT,
      cancel_url: process.env.STRIPE_URL_CANCEL_PRODUCTION_REDIRECT,
      payment_intent_data: {
        metadata: {
          userId: Number(userid),
        },
      },
    });

    return { success: 'Payment was successful!' };
  } catch (err) {
    console.log('Error:', err);
    return { error: 'Something went wrong!' };
  }
};
