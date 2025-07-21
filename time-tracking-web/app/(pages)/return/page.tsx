import React from 'react';

const Return = () => {
  return (
    <div className=' p-10 font-sans h-screen flex justify-center items-center'>
      <div className='max-w-lg mx-auto bg-white rounded-lg shadow-md overflow-hidden'>
        <div className='bg-blue-800 text-white text-center p-5'>
          <h1 className='m-0 text-2xl'>Welcome to Icuem Time Tracker!</h1>
        </div>
        <div className='p-5 text-center'>
          <p className='text-lg text-gray-800 mb-5'>Hi there,</p>
          <p className='text-lg text-gray-800 mb-5'>
            Thank you for subscribing to Icuem Time Tracker! We're thrilled to
            have you on board.
          </p>
          <p className='text-lg text-gray-800 mb-5'>
            If you have any questions or need assistance, our team is always
            here to help.
          </p>
          <a
            href='/dashboard'
            className='inline-block bg-blue-600 text-white py-2 px-4 no-underline rounded text-lg'>
            Return to Dashboard
          </a>
          <p className='text-lg text-gray-800 mt-5'>
            We’re excited to be part of your journey!
          </p>
          <p className='text-lg text-gray-800 mt-5'>
            Best regards, <br />
            The Icuem Team
          </p>
        </div>
      </div>
    </div>
  );
};

export default Return;
