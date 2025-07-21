'use client';

import * as React from 'react';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

interface NaviagtionMenuButtonProps {
  onClose?: () => void;
  className?: string;
  linkClassName?: string;
}

export default function NavigationMenuButton({
  onClose,
  className,
  linkClassName,
}: NaviagtionMenuButtonProps) {
  const components: { title: string; href: string }[] = [
    {
      title: 'Docs',
      href: '/docs',
    },
  ];
  return (
    <NavigationMenu>
      <NavigationMenuList className={cn(className)}>
        <NavigationMenuItem>
          {components.map(item => (
            <Link
              key={item.title}
              onClick={onClose}
              href={item.href}
              legacyBehavior
              passHref>
              <NavigationMenuLink
                className={`${cn(
                  navigationMenuTriggerStyle(),
                  linkClassName
                )} bg-transparent rounded-full`}>
                {item.title}
              </NavigationMenuLink>
            </Link>
          ))}
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Community</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className='grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]'>
              <li className='row-span-3'>
                <NavigationMenuLink asChild>
                  <a
                    className='flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md'
                    href='/'>
                    <div className='mb-2 mt-4 text-lg font-medium'>
                      Community
                    </div>
                    <p className='text-sm leading-tight text-muted-foreground'>
                      Explore, create, and share innovative ideas for a brighter
                      future.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href='/' title='Free talk'>
                Talk about the future of the world.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}>
          <div className='text-sm font-medium leading-none'>{title}</div>
          <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';
