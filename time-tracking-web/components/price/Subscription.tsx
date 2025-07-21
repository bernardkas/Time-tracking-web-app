'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { User } from '@prisma/client';
import { UserWithDetails } from '@/types/UserType';

interface SubscriptionProps {
  session: any;
  user: UserWithDetails;
  handleSubscription?: (priceId: string) => void;
  loading?: boolean;
}

const Subscription = ({ session, user }: SubscriptionProps) => {
  const [showCheckout, setShowCheckout] = useState(false);
  const pricePlans = [
    {
      priceId: process.env.NEXT_PUBLIC_BASIC_PRICE_ID || '',
      name: 'Basic',
      description: 'Ideal for freelancers and small teams',
      color: '#4CAF50', // Green
      features: [
        'Up to 2 users',
        'Time tracking',
        'Detailed activity logs',
        'Advanced reports & analytics',
        'Mouse & keyboard tracking',
        'Screenshot capture every 15 min',
        'Screen time tracking',
      ],
      price: 'Free',
      btnText: '',
      href: '',
    },
    {
      priceId: process.env.NEXT_PUBLIC_PREMIUM_PRICE_ID || '',
      name: 'Premium',
      description: 'Best for growing teams with advanced tracking',
      color: '#FF9800', // Orange
      features: [
        'Unlimited users',
        'Time tracking & idle detection',
        'Advanced reports & analytics',
        'Full mouse & keyboard tracking',
        'Screenshot capture every 5 min',
        'Automated productivity insights',
      ],
      price: '24.99€',
      timeFrame: 'monthly',
      btnText: 'Get Premium',
      href: '',
      link: '/billing/checkout',
    },
    // {
    //   priceId: process.env.NEXT_PUBLIC_ENTERPRISE_PRICE_ID || '',
    //   name: 'Enterprise',
    //   description: 'Unlimited access and customization for large organizations',
    //   color: '#673AB7', // Purple
    //   features: [
    //     'Unlimited users',
    //     'Real-time activity monitoring',
    //     'Unlimited activity logs',
    //     'Advanced reporting & custom dashboards',
    //     'Full mouse & keyboard tracking',
    //     'Screenshot capture every 5 min',
    //     'AI-based productivity analysis',
    //     'Automated alerts for inactivity',
    //     'Custom API access',
    //     'Dedicated account manager',
    //     'On-premise deployment option',
    //   ],
    //   price: 'Contact Us',
    //   timeFrame: 'Custom Plan',
    //   btnText: 'Request a Demo',
    //   free: 'Custom Pricing Available',
    //   href: '',
    //   link: '/contactus',
    // },
  ];

  const activeSubscription = user?.subscriptions?.find(
    sub => sub?.status === 'active'
  );
  const activePriceId = activeSubscription?.priceId;
  const isBasic = user?.subscriptionType === 'BASIC';

  return (
    <div className='flex flex-row gap-5 items-center flex-wrap justify-center'>
      {pricePlans.map(item => (
        <div
          key={item.priceId}
          className='flex flex-col justify-between gap-5 w-[350px] h-[650px] border-[2px] rounded-2xl'>
          <div>
            <div
              style={{ backgroundColor: item.color }}
              className={` rounded-t-2xl h-[90px] flex justify-center items-center relative`}>
              {activePriceId === item.priceId && (
                <div className='absolute top-0 right-0 p-2 '>
                  <Star className='text-2xl font-sans font-bold text-yellow-500' />
                </div>
              )}
              <div className='flex flex-col gap-5'>
                <h1 className='text-2xl font-sans font-bold'>{item.name}</h1>
              </div>
            </div>
            <div className='flex flex-col items-center p-2'>
              <div className='space-y-3'>
                <h3 className='w-[200px] text-sm text-slate-500 '>
                  {item.description}
                </h3>
                {item.features.map(future => (
                  <ul key={future} className='space-y-2 text-sm'>
                    <li>✅ {future}</li>
                  </ul>
                ))}
              </div>
            </div>
          </div>
          <div className='flex flex-col justify-center items-center mb-3'>
            <p className='text-xl font-bold font-sans mb-2'>
              {item.price} <label className='text-sm'>{item.timeFrame}</label>{' '}
            </p>
            {item.btnText && (
              <Button className='rounded-[50px] w-[150px]' variant='costum'>
                <Link href={item.link ?? ''}>{item?.btnText}</Link>
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Subscription;
