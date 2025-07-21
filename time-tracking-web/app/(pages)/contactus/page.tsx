import React from 'react';
import contactPhoto from '@/assets/contact-us.png';
import Image from 'next/image';
import Contact from '@/components/contact/Contact';

const ContactPage = () => {
  return (
    <div className='my-16'>
      <div className='flex flex-col justify-center items-center'>
        <Contact />
      </div>
    </div>
  );
};

export default ContactPage;
