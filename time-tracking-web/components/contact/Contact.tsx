'use client';
import Image from 'next/image';
import React, { useState } from 'react';
const Contact = () => {
  const [input, setInput] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleContactForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!input.name || !input.email || !input.subject || !input.message) {
      setErrorMessage('All fields must be filled');
      return;
    }

    fetch('https://getform.io/f/paygeypa', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(input),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success === true) {
          console.log('Sended successfully');
          setInput({
            name: '',
            email: '',
            subject: '',
            message: '',
          });
        } else {
          console.log('error');
        }
      })
      .catch(error => console.error('Error:', error));
  };

  const handleInputChange = (field: string) => (e: any) => {
    setInput(prevInput => ({
      ...prevInput,
      [field]: e.target.value,
    }));
  };

  return (
    <div className=''>
      <div className='flex flex-row items-center justify-center md:justify-normal flex-wrap gap-5 '>
        <div>
          <Image
            className='w-[300px] h-[250px] md:w-[500px] md:h-[400px]'
            src=''
            alt=''
          />
        </div>
        <div className='w-[350px] md:w-[600px]'>
          <h1 className='mb-4 text-3xl font-bold text-black'>Contact us</h1>
          <form
            onSubmit={handleContactForm}
            action=''
            className='flex flex-col'>
            <input
              className='bg-transparent border-b-[1px] border-orange-700 p-2 outline-none text-black font-noto-sans'
              type='text'
              placeholder='Full name...'
              value={input.name}
              onChange={handleInputChange('name')}
            />
            <input
              className='bg-transparent border-b-[1px] border-orange-700 p-2 outline-none text-black font-noto-sans'
              type='text'
              placeholder='Email'
              value={input.email}
              onChange={handleInputChange('email')}
            />
            <input
              className='bg-transparent border-b-[1px] border-orange-700 p-2 outline-none text-black font-noto-sans'
              type='text'
              placeholder='Subject'
              value={input.subject}
              onChange={handleInputChange('subject')}
            />
            <textarea
              className='bg-transparent border-b-[1px] border-orange-700 resize-none p-2 outline-none text-black font-noto-sans'
              name=''
              placeholder='Message'
              cols={10}
              rows={5}
              value={input.message}
              onChange={handleInputChange('message')}></textarea>

            {errorMessage && (
              <p className='text-red-500 font-noto-sans mt-2'>{errorMessage}</p>
            )}

            <button
              className='mt-5  text-white rounded-md bg-orange-700 p-2'
              type='submit'>
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
