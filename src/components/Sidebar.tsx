"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  FileText, 
  LayoutDashboard, 
  Folder, 
  Layers, 
  Users, 
  CheckSquare, 
  History, 
  Bot, 
  Settings,
  Edit3,
  Moon,
  Sun
} from 'lucide-react';
import { getActiveSession, logoutUser, ApprovedUser } from '@/lib/auth';
import { useProjectStore } from '@/store/useProjectStore';

export default function Sidebar() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'dashboard';
  const [user, setUser] = useState<ApprovedUser | null>(null);
  const [isDark, setIsDark] = useState(true);
  const { projects, syncFromStorage } = useProjectStore();

  useEffect(() => {
    syncFromStorage();
  }, [syncFromStorage]);

  useEffect(() => {
    setUser(getActiveSession());
    setIsDark(document.body.classList.contains('dark-theme'));
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('docforge_theme', 'light');
      setIsDark(false);
    } else {
      document.body.classList.add('dark-theme');
      localStorage.setItem('docforge_theme', 'dark');
      setIsDark(true);
    }
  };

  const getTabClass = (tabName: string) => {
    return activeTab === tabName ? 'btn btn-primary' : 'btn btn-secondary';
  };

  return (
    <aside className="sidebar" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '8px', color: 'white', display: 'flex', alignItems: 'center' }}>
          <FileText size={24} />
        </div>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>DocForge</h1>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '1.5rem', flex: 1, overflowY: 'auto' }}>
        <div style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Workspace Hub
        </div>
        
        <Link 
          href="/?tab=dashboard" 
          className={getTabClass('dashboard')} 
          style={{ justifyContent: 'flex-start' }}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </Link>

        <Link 
          href="/?tab=projects" 
          className={getTabClass('projects')} 
          style={{ justifyContent: 'flex-start' }}
        >
          <Folder size={18} />
          <span>Projects</span>
        </Link>
        


        <Link 
          href="/?tab=documents" 
          className={getTabClass('documents')} 
          style={{ justifyContent: 'flex-start' }}
        >
          <FileText size={18} />
          <span>Documents</span>
        </Link>

        <Link 
          href="/?tab=templates" 
          className={getTabClass('templates')} 
          style={{ justifyContent: 'flex-start' }}
        >
          <Layers size={18} />
          <span>Templates</span>
        </Link>
        <Link 
          href="/?tab=template-setup" 
          className={getTabClass('template-setup')} 
          style={{ 
            justifyContent: 'flex-start',
            marginLeft: '1rem',
            paddingLeft: '1rem',
            borderLeft: '1px solid var(--border)',
            borderRadius: '0 8px 8px 0',
            fontSize: '0.85rem'
          }}
        >
          <Settings size={16} />
          <span>Template Setup</span>
        </Link>

        <div style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '1rem' }}>
          Collaboration
        </div>

        <Link 
          href="/?tab=teams" 
          className={getTabClass('teams')} 
          style={{ justifyContent: 'flex-start' }}
        >
          <Users size={18} />
          <span>Teams</span>
        </Link>

        <Link 
          href="/?tab=approvals" 
          className={getTabClass('approvals')} 
          style={{ justifyContent: 'flex-start' }}
        >
          <CheckSquare size={18} />
          <span>Approvals</span>
        </Link>

        <Link 
          href="/?tab=versions" 
          className={getTabClass('versions')} 
          style={{ justifyContent: 'flex-start' }}
        >
          <History size={18} />
          <span>Version History</span>
        </Link>

        <div style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '1rem' }}>
          Intelligence & Setup
        </div>

        <Link 
          href="/?tab=ai" 
          className={getTabClass('ai')} 
          style={{ justifyContent: 'flex-start' }}
        >
          <Bot size={18} />
          <span>AI Assistant</span>
        </Link>

        <Link 
          href="/?tab=settings" 
          className={getTabClass('settings')} 
          style={{ justifyContent: 'flex-start' }}
        >
          <Settings size={18} />
          <span>Settings</span>
        </Link>

        {activeTab === 'builder' && (
          <>
            <div style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '1rem' }}>
              Active Sheet
            </div>
            <Link 
              href="#" 
              className="btn btn-primary" 
              style={{ justifyContent: 'flex-start' }}
            >
              <Edit3 size={18} />
              <span>Canvas Editor</span>
            </Link>
          </>
        )}
      </nav>

      {/* Spacer to push profile to bottom */}
      <div style={{ flex: 'none', height: '1.5rem' }} />
      
      {/* Profile & Logout Section */}
      {user && (
        <div 
          style={{ 
            padding: '0.85rem', 
            background: 'rgba(255, 255, 255, 0.1)', 
            borderRadius: '12px', 
            border: '1px solid rgba(255, 255, 255, 0.15)',
            display: 'flex', 
            flexDirection: 'column', 
            gap: '0.5rem',
            marginTop: 'auto'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.65)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.02em' }}>
              Theme
            </span>
            <button 
              onClick={toggleTheme}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#fff',
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
              title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            >
              {isDark ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.25rem', background: 'rgba(255, 255, 255, 0.2)', padding: '0.25rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px' }}>
              {user.avatar}
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#ffffff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user.fullName}
              </span>
              <span style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.65)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.02em' }}>
                {user.role}
              </span>
            </div>
          </div>
          <button 
            onClick={() => {
              logoutUser();
              window.location.reload(); // Refresh to trigger auth guard page redirect
            }}
            className="btn btn-secondary" 
            style={{ 
              justifyContent: 'center', 
              background: 'rgba(239, 68, 68, 0.2)', 
              color: '#fca5a5', 
              border: 'none', 
              borderRadius: '8px',
              padding: '0.4rem',
              fontSize: '0.775rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            Sign Out
          </button>
        </div>
      )}
    </aside>
  );
}
