import React from 'react';
import { Button } from '../ui/button';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { FaGithub } from 'react-icons/fa';
import { signIn } from 'next-auth/react';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';

type ProviderType = 'google' | 'facebook' | 'github';

interface SocialProps {
  type: ProviderType[];
}

const Social = ({ type }: SocialProps) => {
  const onClick = (provider: 'google' | 'github' | 'facebook') => {
    signIn(provider, {
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
    });
  };

  const renderIcon = (provider: ProviderType) => {
    switch (provider) {
      case 'google':
        return <FcGoogle className='mr-2' />;
      case 'facebook':
        return <FaFacebook className='mr-2' />;
      case 'github':
        return <FaGithub className='mr-2' />;
      default:
        return null;
    }
  };

  return (
    <div className='space-y-3'>
      {type.map(item => (
        <Button
          key={item}
          onClick={() => onClick(item)}
          className='w-[300px] md:w-[350px]'
          variant='secondary'
          type='submit'>
          {renderIcon(item)} Continue with{' '}
          {item.charAt(0).toUpperCase() + item.slice(1)}
        </Button>
      ))}
      {/* <Button
        onClick={() => onClick('facebook')}
        className='w-[300px] md:w-[350px]'
        variant='secondary'
        type='submit'>
        <FaFacebook className='mr-2 ' /> Continue with Facebook
      </Button>
      <Button
        onClick={() => onClick('github')}
        className='w-[300px] md:w-[350px]'
        variant='secondary'
        type='submit'>
        <FaGithub className='mr-2 ' /> Continue with Github
      </Button> */}
    </div>
  );
};

export default Social;
