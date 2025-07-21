import React from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { cn } from '@/lib/utils';

interface CardWrapperProps {
  className?: string;
  title: string;
  children: React.ReactNode;
}

const CardWrapper = ({ children, title, className }: CardWrapperProps) => {
  return (
    <Card className={cn('space-y-1', className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default CardWrapper;
