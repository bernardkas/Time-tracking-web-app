import React from 'react';

const Aboutus = () => {
  return (
    <div className='mx-3 my-16 md:mx-[15%]'>
      <div>
        <h1 className='font-bold text-xl mb-5 border-b-[2px] pb-1'>About Us</h1>
        <div className='flex flex-col gap-4'>
          <p className='font-noto-sans'>
            FoundLostX is a comprehensive platform designed to assist users in
            managing lost and found items seamlessly. With FoundLostX, users can
            effortlessly upload details of lost or found items, enabling swift
            identification and retrieval.
          </p>
          <p className='font-noto-sans'>
            Our platform offers a user-friendly interface, allowing individuals
            to easily navigate through the process of documenting lost or found
            possessions. Users can provide detailed descriptions, including
            images, of the items they have lost or found, enhancing the chances
            of successful recovery.
          </p>
          <p className='font-noto-sans'>
            One of the key features of FoundLostX is its robust search
            functionality. Utilizing advanced search algorithms, users can
            efficiently sift through the database to locate items that match
            their criteria. Whether it&apos;s a lost pet, a misplaced electronic
            device, or a found piece of jewelry, our search capabilities
            streamline the process of reconnecting owners with their belongings.
          </p>
          <p className='font-noto-sans'>
            FoundLostX prioritizes user privacy and security, ensuring that
            personal information remains protected throughout the process. Our
            platform employs state-of-the-art encryption techniques to safeguard
            user data, providing peace of mind to all participants.
          </p>
          <p className='font-noto-sans'>
            Join FoundLostX today and become part of a community dedicated to
            reuniting lost items with their rightful owners. Experience the
            convenience of managing lost and found possessions with ease, all in
            one centralized platform.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Aboutus;
