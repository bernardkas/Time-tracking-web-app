import { auth } from '@/auth';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import React from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const EmployeeLayout = async ({ children }: DashboardLayoutProps) => {
  const currentUser = (await auth()) as any;
  return (
    <div className='flex flex-row justify-center w-full'>
      <SidebarProvider>
        <div className='flex flex-col md:flex-row w-full'>
          <AppSidebar user={currentUser?.user} />
          <main className={cn('p-2 w-full')}>{children}</main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default EmployeeLayout;
