'use client';
import { reset } from '@/actions/auth';
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
import { ResetPasswordSchema } from '@/schemas';

const ResetForm = () => {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (values: z.infer<typeof ResetPasswordSchema>) => {
    setLoading(true);
    setError('');
    setSuccess('');
    reset(values).then(val => {
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
              Forgot your password?
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
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className='mb-2 outline-0 w-[300px] md:w-[350px]'
                            name='email'
                            type='email'
                            placeholder='john.doe@example.com'
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
                    <p className=''>Send reset email</p>
                  )}
                </Button>
              </form>
            </Form>
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

export default ResetForm;
