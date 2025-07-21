'use client';
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';

interface ModalWrapperProps {
  buttonText: string;
  dialogName: string;
  children: React.ReactNode;
  dialogDescription?: string;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}

const ModalWrapper = ({
  buttonText,
  dialogName,
  children,
  dialogDescription,
  isOpen,
  setIsOpen,
}: ModalWrapperProps) => {
  const handleOpenChange = (open: boolean) => {
    setIsOpen?.(open);
  };
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant='costum'>{buttonText}</Button>
      </DialogTrigger>
      <DialogContent className=''>
        <DialogHeader>
          <DialogTitle>{dialogName}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default ModalWrapper;
