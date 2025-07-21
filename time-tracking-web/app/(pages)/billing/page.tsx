import { auth } from '@/auth';
import Subscription from '@/components/price/Subscription';
import { getUserById } from '@/data/user';
import React, { useEffect, useState } from 'react';

const PricePage = async () => {
  const session = await auth();
  const user = (await getUserById(session?.user.id as string)) as any;

  return (
    <div className='flex justify-center mt-5'>
      <Subscription session={session} user={user} />
    </div>
  );
};

export default PricePage;
