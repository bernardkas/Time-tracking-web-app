import { headers } from 'next/headers';
import Stripe from 'stripe';
import prisma from '@/db/db';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getUserByEmail } from '@/data/user';
import { emailFirstSubscription } from '@/lib/email-subscription';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!);
const webhhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();

  const signature = headers().get('stripe-signature')!;

  let data;
  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhhookSecret);
  } catch (err) {
    console.log(`⚠️  Webhook signature verification failed.`);
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
  }

  data = event.data as any;

  async function getCustomerEmail(customerId: string): Promise<string | null> {
    try {
      const customer = await stripe.customers.retrieve(customerId);
      return (customer as Stripe.Customer).email;
    } catch (err) {
      console.error('Error fetching customer:', err);

      return null;
    }
  }

  let priceId: string | undefined;
  const price = process.env.PREMIUM_PRICE_ID ?? '';
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        try {
          const session = await stripe.checkout.sessions.retrieve(
            data.object.id
          );

          const customerId = session?.customer as any;
          const customer = await getCustomerEmail(customerId);

          const user = await getUserByEmail(customer);

          if (!user) {
            console.log(`User not found with email: ${customer}`);
            break;
          }

          if (price) {
            priceId = '24.99';
          }

          const activeSubscription = user.subscriptions.find(
            sub => sub.status === 'active'
          );

          if (activeSubscription) {
            await prisma.subscription.update({
              where: {
                id: activeSubscription.id,
              },
              data: {
                status: 'active',
                updatedAt: new Date(),
              },
            });
          }
          if (!activeSubscription) {
            await emailFirstSubscription(customer ?? '');

            await prisma.user.update({
              where: {
                id: user?.id,
              },
              data: {
                subscriptionType: 'PREMIUM',
              },
            });

            await prisma.subscription.create({
              data: {
                userId: user?.id,
                customerId: customerId,
                status: 'active',
                priceId: priceId ?? '',
              },
            });
          }
        } catch (err) {
          console.error('Error handling checkout.session.completed:', err);
        }

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = await stripe.subscriptions.retrieve(
          data.object.id
        );

        const customerId = subscription?.customer as any;
        const customer = await getCustomerEmail(customerId);

        // Find the user by email

        break;
      }
      default: {
        console.log(`Unhandled event type ${event.type}`);
      }
    }
  } catch (err) {
    console.error('stripe error: ' + err + ' | EVENT TYPE: ' + event.type);
    return NextResponse.error();
  }

  return NextResponse.json({});
}
