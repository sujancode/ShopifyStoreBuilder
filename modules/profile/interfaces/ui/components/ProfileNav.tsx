'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { UserCircle, Trash2 } from 'lucide-react';

const navItems = [
  {
    title: 'General',
    href: '/profile',
    icon: UserCircle,
  },
  {
    title: 'Delete Account',
    href: '/profile/delete',
    icon: Trash2,
    variant: 'destructive' as const,
  },
];

export function ProfileNav() {
  const pathname = usePathname();

  return (
    <nav className="flex space-y-1 flex-col">
      {navItems.map((item) => (
        <Button
          key={item.href}
          variant={item.variant || (pathname === item.href ? 'secondary' : 'ghost')}
          className={cn(
            'justify-start',
            item.variant === 'destructive' 
              ? 'text-white hover:text-white' 
              : pathname === item.href
              ? 'bg-muted'
              : 'hover:bg-transparent hover:underline'
          )}
          asChild
        >
          <Link href={item.href}>
            <item.icon className="mr-2 h-4 w-4" />
            {item.title}
          </Link>
        </Button>
      ))}
    </nav>
  );
}