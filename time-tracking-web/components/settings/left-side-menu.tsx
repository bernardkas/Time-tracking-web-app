'use client';
import React from 'react';
import { Button } from '../ui/button';
import { FaArrowCircleRight, FaArrowCircleLeft } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const LeftSideMenu = () => {
  const pathname = usePathname();
  return (
    <div className='flex items-center justify-center h-full'>
      <div className='p-2 flex flex-row items-start w-full bg-[#152058] rounded-md shadow-md'>
        <Button
          asChild
          variant={pathname === '/settings/profile' ? 'light' : 'link'}
          className='text-white  text-start text-md  w-full rounded-none  '>
          <Link href='/settings/profile'>Profile</Link>
        </Button>
        <Button
          asChild
          variant={pathname === '/settings/others' ? 'light' : 'link'}
          className='text-white  text-start text-md  w-full rounded-none'>
          <Link href='/settings/others'>Others</Link>
        </Button>
        <Button
          asChild
          variant={pathname === '/settings' ? 'light' : 'link'}
          className='text-white  text-start text-md  w-full rounded-none'>
          <Link href='/settings/profile'>Profile</Link>
        </Button>
      </div>
    </div>
  );
};

export default LeftSideMenu;
