'use client';
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Home,
  Inbox,
  ListCollapse,
  Search,
  Settings,
  User2,
  User2Icon,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { User } from '@prisma/client';
import SignOutBtn from '../auth/sign-out';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Badge } from '../ui/badge';

// Menu items.

interface AppSidebarProps {
  user?: User;
}

export function AppSidebar({ user }: AppSidebarProps) {
  const {
    state,
    open,
    setOpen,
    openMobile,
    setOpenMobile,
    isMobile,
    toggleSidebar,
  } = useSidebar();

  const items = [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: Home,
      role: 'COMPANY',
    },
    {
      title: 'Employees',
      url: '/employees',
      icon: User2Icon,
      role: 'COMPANY',
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: Settings,
      role: 'COMPANY',
    },
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: Home,
      role: 'EMPLOYEE',
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: Settings,
      role: 'EMPLOYEE',
    },
  ];

  const filteredItems = items.filter(item => item.role === user?.role);
  const router = useRouter();

  const handlePrice = () => {
    router.push('/billing');
  };

  return (
    <div className=''>
      <div className='block md:hidden '>
        <SidebarTrigger className='text-2xl font-bold text-blue-500 h-16 hover:bg-transparent hover:text-blue-600' />
      </div>
      <Sidebar collapsible='icon'>
        <SidebarContent>
          <SidebarGroup>
            <div className='flex flex-row justify-between'>
              <SidebarGroupLabel>
                <div className='flex flex-row gap-2 items-center '>
                  <h3 className='font-tilt-prism text-orange-500'>
                    <span>i</span>
                    <span>C</span>
                    <span>u</span>
                    <span>e</span>
                    <span>m</span>
                  </h3>
                  <p className='text-[15.5px]'>Time Tracker</p>
                </div>
              </SidebarGroupLabel>
              <SidebarGroupLabel>
                <SidebarTrigger className='text-2xl font-bold text-blue-500 h-16 hover:bg-transparent hover:text-blue-600' />
              </SidebarGroupLabel>
            </div>
            <SidebarGroupContent>
              <SidebarMenu>
                {state === 'collapsed' && (
                  <SidebarTrigger className='text-2xl font-bold text-blue-500 h-16 hover:bg-transparent hover:text-blue-600' />
                )}
                {filteredItems.map(item => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <Badge className={state === 'collapsed' ? 'hidden' : 'block'}>
                {user?.subscriptionType}
              </Badge>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <User2 /> {user?.name}
                    <ChevronUp className='ml-auto' />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side='top'
                  className='w-[--radix-popper-anchor-width]'>
                  <DropdownMenuItem>
                    <Link
                      href='https://billing.stripe.com/p/login/test_aEU3f98awg75c2k288'
                      target='_blank'>
                      Manage billing
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span onClick={handlePrice}>Price</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <SignOutBtn />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </div>
  );
}
