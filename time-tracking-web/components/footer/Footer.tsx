import { Copyright, Dot, Facebook, Instagram } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const Footer = () => {
  return (
    <div className=' '>
      <div className='mx-2 lg:mx-[15%] bottom-0 text-sm '>
        <div className='flex flex-row gap-3 items-center font-noto-sans   text-slate-700 border-t-[1px] border-gray-400 p-4 w-full'>
          <p className='flex items-center  gap-2  '>
            <Copyright size={18} className='' /> waxo, 2025, by{' '}
            <Link href='https://www.waxo.tech' target='_blank'>
              waxo
            </Link>
          </p>
          <Link href='/terms'>Terms of Service</Link>
          <div>
            <Dot />
          </div>
          <Link href='/privacy'>Privacy and Cookies </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
