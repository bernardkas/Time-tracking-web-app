import { sendInvitation } from '@/actions/Model/invitation';
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
import { InvitationSchema } from '@/schemas/InvitationSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { BeatLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { z } from 'zod';

interface InvitationFormProps {
  onClose: () => void;
}

const InvitationForm = ({ onClose }: InvitationFormProps) => {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof InvitationSchema>>({
    resolver: zodResolver(InvitationSchema),
    defaultValues: {
      uuid: '',
      name: '',
      email: '',
    },
  });

  const onSubmit = (values: z.infer<typeof InvitationSchema>) => {
    setLoading(true);
    sendInvitation(values).then(res => {
      if (res?.success) {
        toast(res?.success, { type: 'success' });
        setLoading(false);
        onClose();
      }
      if (res?.error) {
        toast(res?.error, { type: 'error' });
        setLoading(false);
        onClose();
      }
    });
  };
  return (
    <div>
      <Form {...form}>
        <form className='space-y-5' onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>*Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Don Joe'
                    {...field}
                    className='mb-2 outline-0  bg-white text-black'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>*Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder='don.joe@gmail.com'
                    {...field}
                    className='mb-2 outline-0  bg-white text-black'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex flex-row justify-end'>
            <Button type='submit' className='bg-slate-600 hover:bg-slate-700'>
              {loading ? <BeatLoader color='white' /> : 'Send Invitation'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default InvitationForm;
