import React from 'react';
import { Alert, AlertDescription } from '../ui/alert';
import { cn } from '@/lib/utils';
import { MdErrorOutline } from 'react-icons/md';
import { Check } from 'lucide-react';

interface AlertTextProps {
  message: string;
  type: 'success' | 'error';
  style?: string;
}

const AlertText = ({ message, style, type }: AlertTextProps) => {
  return type === 'success' ? (
    <Alert className={cn('mb-2 border-green-500', style)}>
      <Check size={15} color='green' />
      <AlertDescription className='text-green-500 '>{message}</AlertDescription>
    </Alert>
  ) : (
    <Alert className={cn('mb-2 border-red-500', style)}>
      <MdErrorOutline style={{ color: 'red' }} />
      <AlertDescription className='text-red-500'>{message}</AlertDescription>
    </Alert>
  );
};

export default AlertText;
