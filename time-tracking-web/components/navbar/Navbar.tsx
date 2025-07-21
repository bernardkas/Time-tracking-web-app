'use client';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import logo from '@/assets/logo.png';
import Image from 'next/image';
import MobileNavbar from './MobileNavbar';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import UserButton from '../auth/user-button';
import NavigationMenuButton from './navbar-button';
import { SidebarTrigger } from '../ui/sidebar';

interface NavbarProps {
  currentUser: any;
  isLeftSideBarOpen: boolean;
}

const Navbar = ({ currentUser, isLeftSideBarOpen }: NavbarProps) => {
  const [openSheet, setOpenSheet] = useState(false);

  const handleSheetClose = () => {
    setOpenSheet(false);
  };

  return (
    <div className='shadow-lg '>
      <div className='mx-4 flex  h-[70px] flex-row items-center justify-between'>
        <div className='space-x-5'>
          {isLeftSideBarOpen && (
            <SidebarTrigger className='text-2xl font-bold text-orange-500 h-16' />
          )}
          <Link className='text-2xl font-bold text-orange-500 h-16' href='/'>
            eff
          </Link>
        </div>
        <div className='hidden flex-row gap-1 items-center lg:flex'>
          <NavigationMenuButton />

          {!currentUser ? (
            <Link
              className='mx-2 font-noto-sans font-[500] text-base text-white bg-orange-500 p-1 rounded-sm w-[100px] text-center'
              href='/auth/sign-in'>
              Login
            </Link>
          ) : (
            <>
              <UserButton currentUser={currentUser} />
            </>
          )}
        </div>

        <div className='text-gray-800 lg:hidden flex flex-row items-center gap-5'>
          <Sheet open={openSheet} onOpenChange={setOpenSheet}>
            <SheetTrigger className='text-gray-800 lg:hidden flex flex-row items-center gap-5'>
              <Menu />
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Foundlostx</SheetTitle>
                <SheetDescription>
                  <MobileNavbar
                    currentUser={currentUser}
                    onClose={handleSheetClose}
                  />
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
