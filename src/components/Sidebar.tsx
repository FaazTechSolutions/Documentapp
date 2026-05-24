"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  FileText, LayoutDashboard, Folder, Layers, Users, CheckSquare, 
  History, Bot, Settings, Edit3, Moon, Sun, Search,
  Briefcase, Activity, Target, ShieldCheck, LifeBuoy,
  ChevronLeft, ChevronRight, Bell, BookOpen, BarChart2, ChevronDown
} from 'lucide-react';
import { getActiveSession, logoutUser, ApprovedUser } from '@/lib/auth';
import { useProjectStore } from '@/store/useProjectStore';

type WorkspaceMode = 'Executive' | 'Business Analysis' | 'Product Management' | 'QA & Testing' | 'DevOps' | 'Client Workspace' | 'Project Management' | 'Documentation';

export default function Sidebar() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'dashboard';
  const [user, setUser] = useState<ApprovedUser | null>(null);
  const [isDark, setIsDark] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceMode>('Business Analysis');
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);

  const { projects, syncFromStorage } = useProjectStore();

  useEffect(() => {
    syncFromStorage();
    setUser(getActiveSession());
    setIsDark(document.body.classList.contains('dark-theme'));
  }, [syncFromStorage]);

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
    return activeTab === tabName 
      ? 'sidebar-nav-item active' 
      : 'sidebar-nav-item';
  };

  const workspaces: { id: WorkspaceMode, icon: any, desc: string }[] = [
    { id: 'Business Analysis', icon: Target, desc: 'Requirements, scope, approvals.' },
    { id: 'QA & Testing', icon: ShieldCheck, desc: 'Test cases, defects, validation.' },
    { id: 'DevOps', icon: Activity, desc: 'Deployment, environments, CI/CD.' },
    { id: 'Executive', icon: Briefcase, desc: 'High-level reporting and KPIs.' },
    { id: 'Documentation', icon: BookOpen, desc: 'Knowledge base and manuals.' },
  ];

  const mainNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: Folder },
    { id: 'documents', label: 'Documents', icon: FileText, badge: '12' },
    { id: 'templates', label: 'Templates', icon: Layers },
    { id: 'template-setup', label: 'Template Setup', icon: Settings },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'approvals', label: 'Approvals', icon: CheckSquare, badge: '4 Pending', badgeColor: '#f59e0b' },
    { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: '8', badgeColor: '#ef4444' },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside 
      className={`sidebar-enterprise ${isCollapsed ? 'collapsed' : ''}`} 
      style={{ 
        display: 'flex', flexDirection: 'column', height: '100%', 
        width: isCollapsed ? '80px' : '280px', 
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        overflow: 'visible',
        position: 'relative'
      }}
    >
      {/* Collapse Toggle */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        style={{
          position: 'absolute', top: '1.5rem', right: '-12px', zIndex: 50,
          background: 'var(--surface)', border: '1px solid var(--border)',
          width: '24px', height: '24px', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'var(--text-muted)', boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* SECTION 1: GLOBAL WORKSPACE */}
      <div style={{ padding: isCollapsed ? '1rem 0.5rem' : '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', position: 'relative' }}>
        {!isCollapsed ? (
          <div 
            onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
            style={{ 
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px', padding: '0.75rem', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', gap: '0.25rem',
              transition: 'background 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Workspace</span>
              <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '0.1rem 0.3rem', borderRadius: '4px' }}>ACTIVE</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ background: 'var(--primary)', padding: '0.3rem', borderRadius: '6px', color: 'white' }}>
                  {(() => {
                    const ActiveIcon = workspaces.find(w => w.id === activeWorkspace)?.icon || Briefcase;
                    return <ActiveIcon size={14} />;
                  })()}
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>{activeWorkspace}</span>
              </div>
              <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
            </div>
          </div>
        ) : (
          <div 
            onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
            style={{ 
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px', padding: '0.5rem', cursor: 'pointer',
              display: 'flex', justifyContent: 'center', alignItems: 'center'
            }}
          >
            <div style={{ background: 'var(--primary)', padding: '0.4rem', borderRadius: '8px', color: 'white' }}>
              {(() => {
                const ActiveIcon = workspaces.find(w => w.id === activeWorkspace)?.icon || Briefcase;
                return <ActiveIcon size={18} />;
              })()}
            </div>
          </div>
        )}

        {/* Workspace Dropdown */}
        {showWorkspaceMenu && (
          <div className="animate-fade-in" style={{ 
            position: 'absolute', top: '100%', left: isCollapsed ? '100%' : '1.5rem', right: isCollapsed ? 'auto' : '1.5rem', marginLeft: isCollapsed ? '1rem' : 0, width: isCollapsed ? '280px' : 'auto',
            background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '0.5rem', 
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)', zIndex: 100 
          }}>
            <div style={{ padding: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.4rem 0.75rem', borderRadius: '6px', marginBottom: '0.75rem' }}>
                <Search size={14} style={{ color: 'var(--text-muted)' }} />
                <input type="text" placeholder="Quick find workspace..." style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: '0.8rem', outline: 'none', width: '100%' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {workspaces.map(w => {
                  const IconComponent = w.icon;
                  return (
                  <button 
                    key={w.id}
                    onClick={() => { setActiveWorkspace(w.id); setShowWorkspaceMenu(false); }}
                    style={{ 
                      width: '100%', textAlign: 'left', padding: '0.6rem', 
                      background: w.id === activeWorkspace ? 'rgba(59, 130, 246, 0.1)' : 'transparent', 
                      border: 'none', borderRadius: '8px', cursor: 'pointer',
                      display: 'flex', gap: '0.75rem', alignItems: 'flex-start'
                    }}
                    onMouseEnter={e => { if (w.id !== activeWorkspace) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                    onMouseLeave={e => { if (w.id !== activeWorkspace) e.currentTarget.style.background = 'transparent' }}
                  >
                    <div style={{ color: w.id === activeWorkspace ? '#60a5fa' : 'var(--text-muted)', marginTop: '0.1rem' }}>
                      <IconComponent size={16} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: w.id === activeWorkspace ? '#60a5fa' : 'var(--text-main)' }}>{w.id}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{w.desc}</span>
                    </div>
                  </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: CONTEXTUAL NAVIGATION */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', padding: isCollapsed ? '1rem 0.5rem' : '1.5rem', flex: 1, overflowY: 'auto' }}>
        
        {activeTab === 'builder' ? (
          <>
            {!isCollapsed && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Document Modules
                </span>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#10b981' }}>92% Complete</span>
              </div>
            )}
            
            {[
              { id: 'm-req', label: 'Requirements', icon: CheckSquare, status: '92% Complete', alert: '2 Issues', alertColor: '#f59e0b', pinned: true },
              { id: 'm-scope', label: 'Scope Management', icon: Target },
              { id: 'm-stake', label: 'Stakeholders', icon: Users },
              { id: 'm-work', label: 'Workflows', icon: Activity, alert: '2 Missing Steps', alertColor: '#ef4444' },
              { id: 'm-risk', label: 'Risks', icon: ShieldCheck, alert: '3 Critical', alertColor: '#ef4444', pinned: true },
              { id: 'm-appr', label: 'Approvals', icon: CheckSquare, alert: '1 Pending', alertColor: '#f59e0b' },
            ].map(mod => {
              const ModIcon = mod.icon;
              return (
              <div 
                key={mod.id}
                style={{ 
                  display: 'flex', flexDirection: 'column', padding: isCollapsed ? '0.75rem' : '0.6rem 0.75rem', 
                  borderRadius: '8px', cursor: 'pointer', transition: 'background 0.2s',
                  background: 'transparent'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <ModIcon size={isCollapsed ? 20 : 16} style={{ color: mod.pinned ? '#f59e0b' : 'var(--text-muted)' }} />
                  {!isCollapsed && <span style={{ fontSize: '0.85rem', fontWeight: 500, flex: 1, color: 'var(--text-main)' }}>{mod.label}</span>}
                  {isCollapsed && mod.alert && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: mod.alertColor }} />}
                </div>
                {!isCollapsed && (mod.alert || mod.status) && (
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem', marginLeft: '1.75rem' }}>
                    {mod.alert && <span style={{ fontSize: '0.65rem', color: mod.alertColor }}>{mod.alert}</span>}
                    {mod.status && !mod.alert && <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{mod.status}</span>}
                  </div>
                )}
              </div>
              );
            })}
            
            <button className="btn btn-secondary" style={{ marginTop: '1rem', justifyContent: 'center', fontSize: '0.75rem' }} onClick={() => window.location.href = '/?tab=dashboard'}>
              ← Exit Builder
            </button>
          </>
        ) : (
          <>
            {/* PROJECT CONTEXT PANEL */}
            {!isCollapsed && (
              <div style={{ padding: '0 0.5rem', marginBottom: '1rem' }}>
                <div style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '12px', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)', padding: '0.1rem 0.3rem', borderRadius: '4px' }}>ACTIVE SPRINT</span>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#10b981' }}>82% Health</span>
                  </div>
                  <h4 style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: '1.2' }}>
                    UNITRACON BRD SYSTEM
                  </h4>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ABC Industries</span>
                  
                  {/* Mini Progress */}
                  <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginTop: '0.25rem', overflow: 'hidden' }}>
                    <div style={{ width: '82%', height: '100%', background: '#3b82f6', borderRadius: '2px' }} />
                  </div>
                </div>
              </div>
            )}

            {!isCollapsed && (
              <div style={{ marginBottom: '1.5rem', padding: '0 0.5rem' }}>
                <div 
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.5rem 0.75rem', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                  onClick={() => {
                    const event = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true });
                    document.dispatchEvent(event);
                  }}
                >
                  <Search size={14} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', flex: 1 }}>Search...</span>
                  <div style={{ display: 'flex', gap: '0.2rem' }}>
                    <span style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.1)', padding: '0.1rem 0.3rem', borderRadius: '4px', color: 'var(--text-muted)' }}>Ctrl</span>
                    <span style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.1)', padding: '0.1rem 0.3rem', borderRadius: '4px', color: 'var(--text-muted)' }}>K</span>
                  </div>
                </div>
              </div>
            )}

            {!isCollapsed && (
              <div style={{ padding: '0.25rem 0.5rem', fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                Main Navigation
              </div>
            )}
            
            {mainNav.map(nav => {
              const NavIcon = nav.icon;
              return (
              <Link 
                key={nav.id}
                href={`/?tab=${nav.id}`}
                className={getTabClass(nav.id)}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '0.75rem', padding: isCollapsed ? '0.75rem' : '0.6rem 0.75rem', 
                  borderRadius: '8px', textDecoration: 'none', color: activeTab === nav.id ? '#60a5fa' : 'var(--text-muted)',
                  background: activeTab === nav.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  position: 'relative'
                }}
              >
                <NavIcon size={isCollapsed ? 20 : 18} />
                {!isCollapsed && (
                  <span style={{ fontSize: '0.875rem', fontWeight: 500, flex: 1 }}>{nav.label}</span>
                )}
                {!isCollapsed && nav.badge && (
                  <span style={{ 
                    fontSize: '0.65rem', fontWeight: 700, 
                    background: nav.badgeColor ? `${nav.badgeColor}20` : 'rgba(255,255,255,0.1)', 
                    color: nav.badgeColor || 'var(--text-main)', 
                    padding: '0.1rem 0.4rem', borderRadius: '10px' 
                  }}>
                    {nav.badge}
                  </span>
                )}
                {isCollapsed && nav.badge && (
                  <span style={{ 
                    position: 'absolute', top: '4px', right: '4px', width: '8px', height: '8px', 
                    borderRadius: '50%', background: nav.badgeColor || 'var(--primary)' 
                  }} />
                )}
              </Link>
              );
            })}

            {!isCollapsed && (
              <>
                <div style={{ padding: '0.25rem 0.5rem', fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '1.5rem 0 0.5rem 0' }}>
                  Collaboration Hub
                </div>
                
                {/* Realtime Indicators */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0 0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.6rem', borderRadius: '8px' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>A</div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-main)' }}><strong style={{ color: '#60a5fa' }}>Ahmed</strong> commented</span>
                      <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>2 mins ago</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.6rem', borderRadius: '8px' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CheckSquare size={12} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-main)' }}>Approval Pending</span>
                      <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>5 items</span>
                    </div>
                  </div>
                </div>

                <div style={{ padding: '0.25rem 0.5rem', fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '1.5rem 0 0.5rem 0' }}>
                  Enterprise AI
                </div>

                {/* AI Widget Panel */}
                <div style={{ background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(124, 58, 237, 0.05))', border: '1px solid rgba(168, 85, 247, 0.2)', borderRadius: '12px', padding: '0.75rem', margin: '0 0.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Bot size={16} color="#c084fc" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e9d5ff' }}>Quick Generate</span>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                    <button style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '6px', padding: '0.4rem', fontSize: '0.65rem', color: '#c084fc', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(168, 85, 247, 0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.2)'}>BRD</button>
                    <button style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '6px', padding: '0.4rem', fontSize: '0.65rem', color: '#c084fc', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(168, 85, 247, 0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.2)'}>FRD</button>
                    <button style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '6px', padding: '0.4rem', fontSize: '0.65rem', color: '#c084fc', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(168, 85, 247, 0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.2)'}>Risks</button>
                    <button style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '6px', padding: '0.4rem', fontSize: '0.65rem', color: '#c084fc', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(168, 85, 247, 0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.2)'}>Tests</button>
                  </div>

                  <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '6px', padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.65rem', color: '#e9d5ff', lineHeight: '1.4' }}>Missing stakeholder analysis detected. Generate now?</span>
                    <button style={{ background: '#a855f7', color: 'white', border: 'none', borderRadius: '4px', padding: '0.25rem 0.5rem', fontSize: '0.65rem', cursor: 'pointer', fontWeight: 600 }}>Generate</button>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </nav>

      {/* Profile & Logout Section */}
      {user && (
        <div style={{ padding: isCollapsed ? '1rem 0.5rem' : '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          {!isCollapsed ? (
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.02em' }}>Theme</span>
                <button onClick={toggleTheme} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
                  {isDark ? <Sun size={14} /> : <Moon size={14} />}
                </button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.25rem', background: 'rgba(255, 255, 255, 0.1)', padding: '0.25rem', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {user.avatar}
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
                  <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#ffffff', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{user.fullName}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{user.role}</span>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <button onClick={toggleTheme} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%' }}>
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <span style={{ fontSize: '1.5rem', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {user.avatar}
              </span>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
