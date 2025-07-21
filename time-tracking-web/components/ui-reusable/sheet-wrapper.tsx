import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface SheetWrapper {
  open: boolean;
  title: string;
  setOpenSheet: (a: boolean) => void;
  children: React.ReactNode;
  className?: string;
  description?: string;
}

const SheetWrapper = ({
  title,
  children,
  open,
  className,
  description,
  setOpenSheet,
}: SheetWrapper) => {
  return (
    <Sheet open={open} onOpenChange={() => setOpenSheet(false)}>
      <SheetContent className={cn('text-black', className)}>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
};

export default SheetWrapper;
