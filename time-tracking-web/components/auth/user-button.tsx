'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import SignOutBtn from './sign-out';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

interface UserButtonProps {
  onClose?: () => void;
  currentUser?: any;
}

const UserButton = ({ onClose, currentUser }: UserButtonProps) => {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src={currentUser?.image || ''} />
            <AvatarFallback className='bg-sky-500 text-white'>
              {currentUser?.name?.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-[200px] space-y-2'>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Dashboard</DropdownMenuItem>
          <DropdownMenuItem>Add others...</DropdownMenuItem>
          <DropdownMenuItem>
            <Link onClick={onClose} href='/settings'>
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <SignOutBtn />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserButton;
