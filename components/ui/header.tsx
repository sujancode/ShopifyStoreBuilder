'use client';

import Link from 'next/link';
import { useAuthStore } from '@/modules/auth/infrastructure/store/useAuthStore';
import { UserNav } from './user-nav';
import { cn } from '@/lib/utils';

export function Header() {
  const { user } = useAuthStore();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-white">
      <div className="flex h-16 items-center px-4 sm:px-6">
        <Link href="/" className="mr-8">
          <div className="flex items-center space-x-2">
            <span className={cn(
              "text-2xl font-bold bg-gradient-to-r from-shopify-purple to-shopify-indigo",
              "bg-clip-text text-transparent font-sans tracking-tight"
            )}>
              BuildMyStore
            </span>
          </div>
        </Link>
        <div className="ml-auto flex items-center space-x-4">
          {user && <UserNav />}
        </div>
      </div>
    </header>
  );
}