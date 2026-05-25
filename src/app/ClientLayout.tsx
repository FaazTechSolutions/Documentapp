"use client";

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import EnterpriseTopNav from '@/components/EnterpriseTopNav';
import { Suspense, useState } from 'react';
import RightInsightsPanel from '@/components/RightInsightsPanel';
export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  if (isLoginPage) {
    return (
      <div className="login-layout-wrapper">
        {children}
      </div>
    );
  }

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Suspense fallback={<div style={{height: '64px'}} />}>
        {!isLoginPage && <EnterpriseTopNav />}
      </Suspense>
      
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        <Suspense fallback={<div />}>
          <Sidebar />
        </Suspense>
        
        <main className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', position: 'relative', background: 'var(--background)' }}>
          <Suspense fallback={<div>Loading...</div>}>
            {children}
          </Suspense>
        </main>
        
        <Suspense fallback={<div />}>
          {!isLoginPage && <RightInsightsPanel />}
        </Suspense>
      </div>
    </div>
  );
}
