"use client";

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import EnterpriseTopNav from '@/components/EnterpriseTopNav';
import { Suspense, useState } from 'react';
export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (isLoginPage) {
    return (
      <div className="login-layout-wrapper">
        {children}
      </div>
    );
  }

  return (
    <div className="app-container" style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Suspense fallback={<div />}>
        <Sidebar />
      </Suspense>
      <main className="main-content" style={{ width: '100vw', display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        {!isLoginPage && <EnterpriseTopNav />}
        <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
