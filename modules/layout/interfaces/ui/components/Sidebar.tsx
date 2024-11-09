'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  Home,
  Settings,
  ShoppingBag,
  ChevronDown,
  Tag,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useState } from 'react';

const sidebarLinks = [
  {
    title: 'Home',
    icon: Home,
    href: '/dashboard',
  },
  {
    title: 'Products',
    icon: ShoppingBag,
    subItems: [
      {
        title: 'Templates',
        href: '/products',
        icon: ShoppingBag,
      },
      {
        title: 'Product Types',
        href: '/products/types',
        icon: Tag,
      }
    ]
  },
  {
    title: 'Generate',
    icon: Sparkles,
    subItems: [
      {
        title: 'New Generation',
        href: '/generate',
        icon: Sparkles,
      },
      {
        title: 'Generated Products',
        href: '/generations',
        icon: ShoppingBag,
      }
    ]
  }
];

export function Sidebar() {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<string[]>(['Products', 'Generate']);

  const toggleSection = (title: string) => {
    setOpenSections(current =>
      current.includes(title)
        ? current.filter(t => t !== title)
        : [...current, title]
    );
  };

  return (
    <div className="w-60 h-screen bg-[#f6f6f7] border-r border-gray-200 flex flex-col fixed left-0 top-0 pt-16">
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <nav className="space-y-1">
          {sidebarLinks.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            if (item.subItems) {
              return (
                <Collapsible
                  key={item.title}
                  open={openSections.includes(item.title)}
                  onOpenChange={() => toggleSection(item.title)}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        'w-full justify-between hover:bg-gray-100',
                        isActive && 'bg-gray-100'
                      )}
                    >
                      <div className="flex items-center">
                        <Icon className="h-5 w-5 mr-3 text-gray-500" />
                        <span className="text-sm font-medium text-gray-900">
                          {item.title}
                        </span>
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-10 space-y-1 mt-1">
                    {item.subItems.map((subItem) => {
                      const SubIcon = subItem.icon;
                      return (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={cn(
                            'flex items-center py-2 px-3 rounded-md text-sm text-gray-600',
                            'hover:bg-gray-100 transition-colors',
                            pathname === subItem.href && 'bg-gray-100 text-gray-900 font-medium'
                          )}
                        >
                          {SubIcon && <SubIcon className="h-4 w-4 mr-2" />}
                          {subItem.title}
                        </Link>
                      );
                    })}
                  </CollapsibleContent>
                </Collapsible>
              );
            }

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full justify-start hover:bg-gray-100',
                    isActive && 'bg-gray-100'
                  )}
                >
                  <Icon className="h-5 w-5 mr-3 text-gray-500" />
                  <span className="text-sm font-medium text-gray-900">
                    {item.title}
                  </span>
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className="w-full justify-start hover:bg-gray-100"
        >
          <Settings className="h-5 w-5 mr-3 text-gray-500" />
          <span className="text-sm font-medium text-gray-900">Settings</span>
        </Button>
      </div>
    </div>
  );
}