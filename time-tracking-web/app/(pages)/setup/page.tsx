import { auth } from '@/auth';
import SetupForm from '@/components/company/setup/SetupForm';
import React from 'react';

const SetupPage = async () => {
  const user = (await auth()) as any;
  return (
    <div>
      <SetupForm user={user?.user} />
    </div>
  );
};

export default SetupPage;
