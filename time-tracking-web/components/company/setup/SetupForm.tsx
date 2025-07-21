'use client';
import { createSetup } from '@/actions/Model/setup';
import SignOutBtn from '@/components/auth/sign-out';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { SetupSchema } from '@/schemas/SetupSchema';
import { UserWithDetails } from '@/types/UserType';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { getSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BeatLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { z } from 'zod';

interface SetupFormProps {
  user: UserWithDetails;
}

const SetupForm = ({ user }: SetupFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof SetupSchema>>({
    resolver: zodResolver(SetupSchema),
    defaultValues: {
      name: '',
      role: 'COMPANY',
      password: '',
    },
  });
  const [showPassword, setShowPassword] = useState(false);

  const role = form.watch('role');

  const onSubmit = (values: z.infer<typeof SetupSchema>) => {
    setLoading(true);
    createSetup(values).then(async res => {
      if (res?.error) {
        setLoading(false);
        toast(res.error, { type: 'error' });
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    if (user?.profileCompleted) {
      router.push('/dashboard');
    }
  }, [user]);

  return (
    <div className='h-[100vh] flex flex-col justify-center items-center'>
      <div className='flex flex-col gap-5 justify-center items-center w-auto md:w-[500px] h-auto md:h-[400px]   bg-white p-5 rounded-lg text-black'>
        <SignOutBtn className='' />

        <Form {...form}>
          <form className='space-y-5' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='role'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={value => field.onChange(value)}
                      {...field}
                      defaultValue='COMPANY'>
                      <div className='flex flex-row gap-4'>
                        <div className='flex items-center space-x-2'>
                          <RadioGroupItem value='COMPANY' id='r1' />
                          <Label htmlFor='r1'>Company</Label>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <RadioGroupItem value='EMPLOYEE' id='r2' />
                          <Label htmlFor='r2'>Employee</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {role !== 'EMPLOYEE' ? (
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Company Name'
                        {...field}
                        className='mb-2 outline-0 w-[300px] md:w-[350px] bg-white text-black'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <div className='w-[300px] md:w-[350px]'>
                <p className='font-noto-sans italic my-4'>
                  No action needed for employees
                </p>
              </div>
            )}
            {user?.isOAuth && (
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
                          required
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
            )}
            <div className='flex justify-end'>
              <Button type='submit'>
                {loading ? <BeatLoader color='white' /> : 'Finish'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SetupForm;
