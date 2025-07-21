import Link from 'next/link';
import React from 'react';

interface BackButtonProps {
  label: string;
  href: string;
}
const BackButton = ({ label, href }: BackButtonProps) => {
  return (
    <div>
      <Link className='font-noto-sans' href={href}>
        {label}
      </Link>
    </div>
  );
};

export default BackButton;
