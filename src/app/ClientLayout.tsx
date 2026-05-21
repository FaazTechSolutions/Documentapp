"use client";

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
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
    <div className="app-container" style={{ position: 'relative' }}>
      {!isSidebarOpen && (
        <button 
          onClick={() => setIsSidebarOpen(true)}
          style={{ position: 'fixed', top: '1rem', left: '1rem', zIndex: 100, background: 'var(--surface)', border: '1px solid var(--border)', padding: '0.4rem', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-main)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          title="Open Sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
      )}
      
      {isSidebarOpen && (
        <div style={{ position: 'relative', display: 'flex' }}>
          <Suspense fallback={<aside className="sidebar" style={{ width: '260px', opacity: 0.5 }} />}>
            <Sidebar />
          </Suspense>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            style={{ position: 'absolute', top: '1.25rem', right: '-12px', zIndex: 100, background: 'var(--surface)', border: '1px solid var(--border)', padding: '0.15rem', borderRadius: '50%', cursor: 'pointer', color: 'var(--text-muted)', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Hide Sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      )}
      <main className="main-content" style={{ flex: 1, width: isSidebarOpen ? 'calc(100vw - 260px)' : '100vw', transition: 'width 0.2s' }}>
        {children}
      </main>
    </div>
  );
}
