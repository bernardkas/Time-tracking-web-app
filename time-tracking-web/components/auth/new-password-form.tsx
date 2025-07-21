'use client';
import { newPassword, reset } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react';
import AlertText from '@/components/ui-reusable/alert-text';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { BeatLoader } from 'react-spinners';
import BackButton from '../ui-reusable/back-button';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { NewPasswordSchema } from '@/schemas';

const NewPasswordForm = () => {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [loading, setLoading] = useState(false);
  const token = searchParams.get('token');

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: '',
    },
  });

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setLoading(true);
    setError('');
    setSuccess('');
    newPassword(values, token).then(val => {
      setLoading(false);
      setError(val?.error);
      setSuccess(val?.success);
    });
  };

  return (
    <div className='h-[80vh] '>
      <div className='flex flex-col justify-center items-center h-full'>
        <Card className='flex flex-col items-center'>
          <CardHeader>
            <h1 className='font-noto-sans text-3xl font-bold my-5 text-orange-500'>
              Enter a new password
            </h1>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                className='space-y-6 flex flex-col mb-5'
                onSubmit={form.handleSubmit(onSubmit)}>
                <div className='space-y-3'>
                  <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className='mb-2 outline-0 w-[300px] md:w-[350px]'
                            name='password'
                            type='password'
                            placeholder='******'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {error && <AlertText message={error || ''} type='error' />}
                {success && (
                  <AlertText message={success || ''} type='success' />
                )}
                <Button className='bg-orange-500 hover:bg-orange-600 mt-5'>
                  {loading ? (
                    <BeatLoader color='white' />
                  ) : (
                    <p className=''>Reset password</p>
                  )}
                </Button>
              </form>
            </Form>
            {/* <form
              className='flex flex-col mb-5'
              action={async formData => {
                await newPassword(formData, token).then(val => {
                  setLoading(false);
                  setError(val?.error);
                  setSuccess(val?.success);
                });
              }}>
              <label>
                New Password
                <Input
                  className='mb-2 outline-0 w-[300px] md:w-[350px]'
                  name='password'
                  type='password'
                  placeholder='******'
                />
              </label>
              {error && <AlertText message={error} type='error' />}
              {success && <AlertText message={success} type='success' />}
              <Button
                onClick={() => setLoading(true)}
                className='bg-orange-500 hover:bg-orange-600 mt-5'>
                {loading ? (
                  <BeatLoader color='white' />
                ) : (
                  <p className=''>Reset password</p>
                )}
              </Button>
            </form> */}
          </CardContent>
          <CardFooter>
            <div className='flex flex-row gap-1'>
              <BackButton label='Back to login' href='/auth/sign-in' />
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default NewPasswordForm;
