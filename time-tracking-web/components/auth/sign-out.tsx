'use client';
import React from 'react';
import { Button } from '../ui/button';
import { logout } from '@/actions/auth';

interface SignOutBtnProps {
  className?: string;
}

const SignOutBtn = ({ className }: SignOutBtnProps) => {
  const onSignOut = () => {
    logout();
  };
  return (
    <div className=''>
      <Button
        onClick={onSignOut}
        variant='secondary'
        className={`bg-transparent p-0 m-0 ${className}`}
        type='submit'>
        Sign Out
      </Button>
    </div>
  );
};

export default SignOutBtn;
