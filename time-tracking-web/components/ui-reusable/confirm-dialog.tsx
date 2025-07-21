import React from 'react';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

interface ConfirmDialogProps {
  buttonText: string;
  dialogTitle: string;
  dialogDescription: string;
  onConfirm?: (reason: any) => void;
  buttonClassName?: string; // Optional className for the trigger button
  actionClassName?: string; // Optional className for the action button
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  buttonText,
  dialogTitle,
  dialogDescription,
  onConfirm,
  buttonClassName = 'bg-red-500 hover:bg-red-600 text-white p-2 rounded-md',
  actionClassName = 'bg-red-500 hover:bg-red-600 text-white',
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger className={buttonClassName}>
        {buttonText}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
          <AlertDialogDescription>{dialogDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className={actionClassName}>
            {buttonText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmDialog;
