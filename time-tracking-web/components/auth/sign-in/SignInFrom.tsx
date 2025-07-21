'use client';
import { login } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import React, { useState } from 'react';
import Social from '../social';
import { useSearchParams } from 'next/navigation';
import AlertText from '@/components/ui-reusable/alert-text';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { BeatLoader } from 'react-spinners';
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
import { LoginSchema } from '@/schemas';
import { Eye, EyeOff } from 'lucide-react';

const SignInFrom = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  // This is when you use more provider like Github and Google if exist on of this it goig to show that message.
  // This is Automatic so when you add more than one provider when you register with google and you have an account
  // But when you register with github with the same account is going to show that error
  const urlError =
    searchParams.get('error') === 'OAuthAccountNotLinked'
      ? 'Email already in use with different provider!'
      : '';
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setLoading(true);
    setError('');
    setSuccess('');
    login(values, callbackUrl).then(val => {
      setLoading(false);
      setError(val?.error);
      setSuccess(val?.success);
    });
  };

  return (
    <div className='h-[80vh] '>
      <div className='flex flex-col justify-center items-center h-full'>
        <Card className='flex flex-col items-center'>
          <CardHeader></CardHeader>
          <CardContent>
            <Social type={['google']} />
            <p className='font-golos-text my-5 border-b-[1px] text-center'>
              or
            </p>
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
                            className='mb-2 outline-0 w-[300px] md:w-[350px] bg-white'
                            name='email'
                            type='email'
                            placeholder='John doe'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className='relative'>
                            <Input
                              {...field}
                              className='mb-2 outline-0 bg-white'
                              name='password'
                              type={showPassword ? 'text' : 'password'}
                              placeholder='******'
                            />
                            <div
                              className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer'
                              onClick={() => setShowPassword(!showPassword)}>
                              {showPassword ? (
                                <EyeOff className='h-5 w-5 text-gray-500' />
                              ) : (
                                <Eye className='h-5 w-5 text-gray-500' />
                              )}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className='flex items-end justify-end w-full mb-2'>
                    <Link
                      href='/auth/reset'
                      className=' text-sm  text-gray-500'>
                      Forgot password?
                    </Link>
                  </div>
                </div>
                {urlError && <AlertText message={urlError} type='error' />}
                {error && <AlertText message={error || ''} type='error' />}
                {success && (
                  <AlertText message={success || ''} type='success' />
                )}
                <Button className='bg-orange-500 hover:bg-orange-600 mt-5'>
                  {loading ? (
                    <BeatLoader color='white' />
                  ) : (
                    <p className=''>Login</p>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <div className='flex flex-row gap-1'>
              <p className='font-noto-sans text-sm text-gray-500'>
                You don't have an Account?
              </p>
              <Link
                className='font-noto-sans text-sm underline'
                href='/auth/sign-up'>
                Create account
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignInFrom;
