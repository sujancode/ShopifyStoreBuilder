'use client';

import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f6f6f7]">
      <Sidebar />
      <div className="pl-60 pt-16">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}