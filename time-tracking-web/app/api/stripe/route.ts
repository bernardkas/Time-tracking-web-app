import Stripe from 'stripe';
import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/db/db';

export async function POST(req: NextRequest) {
  const currentUser = await auth();
  const user = await prisma.user.findUnique({
    where: {
      id: currentUser?.user?.id,
    },
  });

  const userid = user?.id;
  try {
    const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!);
    let data = await req.json();
    console.log('req', data);
    let price = data.priceId;
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      payment_method_types: ['card'],
      line_items: [
        {
          price: price,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      return_url: `${req.headers.get(
        'origin'
      )}/return?session_id={CHECKOUT_SESSION_ID}`,
    });

    return NextResponse.json({
      id: session.id,
      client_secret: session.client_secret,
    });
  } catch (err) {
    console.log(err);
  }
}
