import { getCompanyById } from '@/actions/Model/company';
import { auth } from '@/auth';
import SettingsForm from '@/components/settings/settings-form';
import React from 'react';

const SettingsPage = async () => {
  const currentUser = (await auth()) as any;
  const getCompanies = await getCompanyById();
  return (
    <div className='flex justify-center items-center w-full'>
      <SettingsForm currentUser={currentUser?.user} company={getCompanies} />
    </div>
  );
};

export default SettingsPage;
