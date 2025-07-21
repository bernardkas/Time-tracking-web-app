'use client';
import React, { useCallback } from 'react';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

interface CheckoutProps {}

const Checkout = () => {
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ''
  );

  const fetchClientSecret = useCallback(async () => {
    return await fetch('/api/stripe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId:
          process.env.PREMIUM_PRICE_ID || 'price_1QmzYRGCnyYWU1lJWwFv0qlr',
      }),
    })
      .then(res => res.json())
      .then(data => data.client_secret);
  }, []);

  const options = { fetchClientSecret };
  return (
    <div className='flex flex-col justify-center mt-5 w-full'>
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};

export default Checkout;
