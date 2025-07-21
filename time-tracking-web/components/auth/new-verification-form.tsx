import React, { useCallback, useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import BackButton from '../ui-reusable/back-button';
import { BeatLoader } from 'react-spinners';
import { useSearchParams } from 'next/navigation';
import { newVerification } from '@/actions/auth';
import AlertText from '../ui-reusable/alert-text';

const NewVerificationForm = () => {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const token = searchParams.get('token');

  const onSubmit = useCallback(() => {
    if (!token) {
      setError('Missing token!');
      return;
    }

    newVerification(token)
      .then(data => {
        setSuccess(data?.success);
        setError(data?.error);
      })
      .catch(() => {
        setError('Something went wrong!');
      });
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);
  return (
    <div className='flex justify-center my-10'>
      <Card className='w-[400px] shadow-md flex flex-col items-center text-center'>
        <CardHeader>
          <CardTitle className='text-xl'>
            Confirming your verification!
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!success && !error && <BeatLoader />}
          {success && <AlertText type='success' message={success} />}
          {error && <AlertText type='error' message={error} />}
        </CardContent>
        <CardFooter>
          <BackButton label='Back to login' href='/auth/sign-in' />
        </CardFooter>
      </Card>
    </div>
  );
};

export default NewVerificationForm;
