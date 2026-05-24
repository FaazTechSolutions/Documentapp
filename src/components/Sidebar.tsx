"use client";

import { useState, useEffect, useRef } from 'react';
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
import { useBuilderStore, BuilderModule } from '@/store/useBuilderStore';

type WorkspaceMode = 'Executive' | 'Business Analysis' | 'Product Management' | 'QA & Testing' | 'DevOps' | 'Client Workspace' | 'Project Management' | 'Documentation';

export default function Sidebar() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'dashboard';
  const [user, setUser] = useState<ApprovedUser | null>(null);
  const [isDark, setIsDark] = useState(true);
  const [sidebarMode, setSidebarMode] = useState<'expanded' | 'compact' | 'invisible'>('invisible');
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceMode>('Business Analysis');
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isHoveringSidebar, setIsHoveringSidebar] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  const { activeModule, setActiveModule, requirements, risks, approvals, workflows } = useBuilderStore();
  
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { projects, syncFromStorage } = useProjectStore();

  useEffect(() => {
    syncFromStorage();
    setUser(getActiveSession());
    setIsDark(document.body.classList.contains('dark-theme'));
  }, [syncFromStorage]);

  // Handle 3-second auto-hide inactivity timer
  useEffect(() => {
    // Only auto-hide on specific pages as requested: Dashboard, Builder, Templates, Documents
    const autoHidePages = ['dashboard', 'builder', 'templates', 'documents'];
    if (!autoHidePages.includes(activeTab)) return;

    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);

    if (!isHoveringSidebar && sidebarMode !== 'invisible') {
      inactivityTimerRef.current = setTimeout(() => {
        setSidebarMode('invisible');
      }, 3000);
    }

    return () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, [isHoveringSidebar, sidebarMode, activeTab]);

  // Handle ESC key to force invisible mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSidebarMode('invisible');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle Ctrl+K for search command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearchModal(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
    { id: 'approvals', label: 'Approvals', icon: CheckSquare, badge: `${approvals.filter(a => a.status === 'Pending').length} Pending`, badgeColor: '#f59e0b' },
    { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: '8', badgeColor: '#ef4444' },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const isCollapsed = sidebarMode === 'compact';
  const widthMap = {
    expanded: '260px',
    compact: '70px',
    invisible: '0px'
  };

  // Compute live stats for modules
  const reqIssues = requirements.filter(r => r.status === 'Issue').length;
  const reqProgress = requirements.length ? Math.round((requirements.filter(r => r.status === 'Approved').length / requirements.length) * 100) : 0;
  
  const riskCritical = risks.filter(r => r.severity === 'Critical' && r.status === 'Open').length;
  const pendingApprovals = approvals.filter(a => a.status === 'Pending').length;
  // Mock workflow missing steps
  const missingWorkflowSteps = 2;

  const documentModules: { id: BuilderModule, label: string, icon: any, status?: string, alert?: string, alertColor?: string, pinned?: boolean }[] = [
    { id: 'm-req', label: 'Requirements', icon: CheckSquare, status: `${reqProgress}%`, alert: reqIssues > 0 ? `${reqIssues} Issues` : undefined, alertColor: '#f59e0b', pinned: activeModule === 'm-req' },
    { id: 'm-scope', label: 'Scope Management', icon: Target, pinned: activeModule === 'm-scope' },
    { id: 'm-stake', label: 'Stakeholders', icon: Users, pinned: activeModule === 'm-stake' },
    { id: 'm-work', label: 'Workflows', icon: Activity, alert: missingWorkflowSteps > 0 ? `${missingWorkflowSteps} Missing` : undefined, alertColor: '#ef4444', pinned: activeModule === 'm-work' },
    { id: 'm-risk', label: 'Risks', icon: ShieldCheck, alert: riskCritical > 0 ? `${riskCritical} Critical` : undefined, alertColor: '#ef4444', pinned: activeModule === 'm-risk' },
    { id: 'm-appr', label: 'Approvals', icon: CheckSquare, alert: pendingApprovals > 0 ? `${pendingApprovals} Pending` : undefined, alertColor: '#3b82f6', pinned: activeModule === 'm-appr' },
  ];

  return (
    <>
      {/* Invisible Trigger Area - Hover left edge to reveal */}
      {sidebarMode === 'invisible' && (
        <div 
          style={{ position: 'fixed', top: 0, left: 0, width: '15px', height: '100vh', zIndex: 99, cursor: 'pointer' }}
          onMouseEnter={() => setSidebarMode('expanded')}
        />
      )}

      {/* Floating Logo Trigger Button */}
      {sidebarMode === 'invisible' && (
        <button
          onClick={() => setSidebarMode('expanded')}
          style={{
            position: 'fixed', top: '1rem', left: '1rem', zIndex: 101, background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)',
            padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', transition: 'all 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(15, 23, 42, 1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(15, 23, 42, 0.8)'}
        >
          <FileText size={20} />
        </button>
      )}

      <aside 
        onMouseEnter={() => setIsHoveringSidebar(true)}
        onMouseLeave={() => setIsHoveringSidebar(false)}
        className={`sidebar-enterprise ${sidebarMode}`} 
        style={{ 
          display: 'flex', flexDirection: 'column', height: '100%', 
          width: widthMap[sidebarMode],
          opacity: sidebarMode === 'invisible' ? 0 : 1,
          pointerEvents: sidebarMode === 'invisible' ? 'none' : 'auto',
          transition: 'width 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.2s ease, transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          transform: sidebarMode === 'invisible' ? 'translateX(-100%)' : 'translateX(0)',
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(30px)',
          borderRight: '1px solid rgba(255,255,255,0.08)',
          overflow: 'visible',
          position: 'fixed',
          top: 0, left: 0, bottom: 0,
          zIndex: 100,
          boxShadow: '4px 0 24px rgba(0,0,0,0.4)'
        }}
      >
        {/* Collapse Toggle */}
        <button 
          onClick={() => setSidebarMode(sidebarMode === 'expanded' ? 'compact' : sidebarMode === 'compact' ? 'invisible' : 'expanded')}
          style={{
            position: 'absolute', top: '1.5rem', right: '-12px', zIndex: 102,
            background: 'rgba(30, 41, 59, 1)', border: '1px solid rgba(255,255,255,0.1)',
            width: '24px', height: '24px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--text-muted)', boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
          }}
        >
          {sidebarMode === 'expanded' ? <ChevronLeft size={14} /> : sidebarMode === 'compact' ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>

      {/* SECTION 1: GLOBAL WORKSPACE */}
      <div style={{ padding: isCollapsed ? '1.5rem 0.5rem' : '1.5rem 1.5rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'relative' }}>
        {!isCollapsed ? (
          <div 
            onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
            style={{ 
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '8px', padding: '0.6rem 0.75rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              transition: 'all 0.2s ease', boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ background: 'var(--primary)', padding: '0.25rem', borderRadius: '6px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {(() => {
                  const ActiveIcon = workspaces.find(w => w.id === activeWorkspace)?.icon || Briefcase;
                  return <ActiveIcon size={14} />;
                })()}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', lineHeight: '1.2' }}>{activeWorkspace}</span>
                <span style={{ fontSize: '0.65rem', fontWeight: 500, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.1rem' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} /> Active
                </span>
              </div>
            </div>
            <ChevronDown size={14} style={{ color: '#94a3b8' }} />
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
          <div style={{ padding: '0 0.5rem' }}>
            {!isCollapsed && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', padding: '0 0.5rem' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Document Modules
                </span>
              </div>
            )}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              {documentModules.map(mod => {
                const ModIcon = mod.icon;
                return (
                <div 
                  key={mod.id}
                  onClick={() => setActiveModule(mod.id as BuilderModule)}
                  style={{ 
                    display: 'flex', alignItems: 'center', padding: isCollapsed ? '0.75rem' : '0.5rem 0.75rem', 
                    borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s',
                    background: mod.pinned ? 'rgba(255,255,255,0.03)' : 'transparent',
                    border: '1px solid transparent'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = mod.pinned ? 'rgba(255,255,255,0.03)' : 'transparent'; e.currentTarget.style.borderColor = 'transparent' }}
                >
                  <ModIcon size={isCollapsed ? 20 : 16} style={{ color: mod.pinned ? '#60a5fa' : '#94a3b8', minWidth: '16px' }} />
                  
                  {!isCollapsed && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 1, marginLeft: '0.75rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: mod.pinned ? 600 : 500, color: mod.pinned ? '#ffffff' : '#cbd5e1' }}>{mod.label}</span>
                      
                      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                        {mod.status && <span style={{ fontSize: '0.65rem', fontWeight: 600, color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '0.1rem 0.3rem', borderRadius: '4px' }}>{mod.status}</span>}
                        {mod.alert && <span style={{ fontSize: '0.65rem', fontWeight: 600, color: mod.alertColor, background: `${mod.alertColor}20`, padding: '0.1rem 0.3rem', borderRadius: '4px' }}>{mod.alert}</span>}
                      </div>
                    </div>
                  )}
                  {isCollapsed && mod.alert && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: mod.alertColor, position: 'absolute', right: '12px' }} />}
                </div>
                );
              })}
            </div>
            
            <button style={{ 
              marginTop: '1.5rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              background: 'rgba(255,255,255,0.05)', color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.1)', 
              padding: '0.6rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.2s'
            }} 
            onClick={() => window.location.href = '/?tab=dashboard'}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#ffffff' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#cbd5e1' }}>
              <ChevronLeft size={16} /> {!isCollapsed && "Exit Builder"}
            </button>
          </div>
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
                  display: 'flex', alignItems: 'center', gap: '0.75rem', padding: isCollapsed ? '0.75rem' : '0.5rem 0.75rem', 
                  borderRadius: '8px', textDecoration: 'none', color: activeTab === nav.id ? '#ffffff' : '#cbd5e1',
                  background: activeTab === nav.id ? 'rgba(255,255,255,0.06)' : 'transparent',
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  position: 'relative',
                  border: activeTab === nav.id ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent',
                  transition: 'all 0.2s',
                  boxShadow: activeTab === nav.id ? '0 2px 8px rgba(0,0,0,0.2)' : 'none'
                }}
                onMouseEnter={e => { if (activeTab !== nav.id) { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = '#ffffff'; } }}
                onMouseLeave={e => { if (activeTab !== nav.id) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#cbd5e1'; } }}
              >
                <NavIcon size={isCollapsed ? 20 : 18} />
                {!isCollapsed && (
                  <span style={{ fontSize: '0.85rem', fontWeight: activeTab === nav.id ? 600 : 500, flex: 1, letterSpacing: '0.01em' }}>{nav.label}</span>
                )}
                {!isCollapsed && nav.badge && (
                  <span style={{ 
                    fontSize: '0.65rem', fontWeight: 700, 
                    background: nav.badgeColor ? `${nav.badgeColor}20` : 'rgba(255,255,255,0.1)', 
                    color: nav.badgeColor || '#ffffff', 
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

      {/* Bottom Area: Quick Actions & Profile */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: isCollapsed ? '1rem 0.5rem' : '1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        
        {/* Quick Actions Icon Row */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {!isCollapsed && <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Quick Actions</span>}
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'space-between', gap: '0.25rem', background: 'rgba(255,255,255,0.02)', padding: '0.25rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <button title="Create Requirement" style={{ background: 'transparent', color: '#cbd5e1', border: 'none', padding: '0.4rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59, 130, 246, 0.15)'; e.currentTarget.style.color = '#60a5fa'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#cbd5e1'; }}>
              <Edit3 size={16} />
            </button>
            <button title="AI Generate" style={{ background: 'transparent', color: '#cbd5e1', border: 'none', padding: '0.4rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(168, 85, 247, 0.15)'; e.currentTarget.style.color = '#c084fc'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#cbd5e1'; }}>
              <Bot size={16} />
            </button>
            <button title="Open Templates" style={{ background: 'transparent', color: '#cbd5e1', border: 'none', padding: '0.4rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#ffffff'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#cbd5e1'; }}>
              <Layers size={16} />
            </button>
            <button title="Export" style={{ background: 'transparent', color: '#cbd5e1', border: 'none', padding: '0.4rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#ffffff'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#cbd5e1'; }}>
              <FileText size={16} />
            </button>
            <button title="Exit Builder" onClick={() => window.location.href = '/?tab=dashboard'} style={{ background: 'transparent', color: '#cbd5e1', border: 'none', padding: '0.4rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'; e.currentTarget.style.color = '#f87171'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#cbd5e1'; }}>
              <ChevronLeft size={16} />
            </button>
          </div>
        </div>

        {/* User Profile Avatar Dock (Hidden in Builder Mode for ultra-minimalism) */}
        {user && activeTab !== 'builder' && (
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', justifyContent: isCollapsed ? 'center' : 'flex-start' }}
            >
              <span style={{ fontSize: '1.2rem', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '50%', width: isCollapsed ? '36px' : '32px', height: isCollapsed ? '36px' : '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                {user.avatar}
              </span>
              {!isCollapsed && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.8rem', color: '#ffffff' }}>{user.fullName}</span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{user.role}</span>
                </div>
              )}
            </button>

            {/* Profile Popup Menu */}
            {showProfileMenu && (
              <div className="animate-fade-in" style={{ 
                position: 'absolute', bottom: '100%', left: isCollapsed ? '100%' : 0, marginLeft: isCollapsed ? '1rem' : 0, marginBottom: '0.5rem', width: '220px',
                background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '0.5rem', 
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)', zIndex: 100 
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <button style={{ background: 'transparent', border: 'none', padding: '0.5rem', textAlign: 'left', color: 'var(--text-main)', fontSize: '0.8rem', cursor: 'pointer', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <Settings size={14} /> Workspace Settings
                  </button>
                  <button onClick={toggleTheme} style={{ background: 'transparent', border: 'none', padding: '0.5rem', textAlign: 'left', color: 'var(--text-main)', fontSize: '0.8rem', cursor: 'pointer', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    {isDark ? <Sun size={14} /> : <Moon size={14} />} Toggle Theme
                  </button>
                  <button style={{ background: 'transparent', border: 'none', padding: '0.5rem', textAlign: 'left', color: 'var(--text-main)', fontSize: '0.8rem', cursor: 'pointer', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <Bell size={14} /> Preferences
                  </button>
                  <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '0.25rem 0' }} />
                  <button onClick={() => { logoutUser(); window.location.href = '/login'; }} style={{ background: 'transparent', border: 'none', padding: '0.5rem', textAlign: 'left', color: '#ef4444', fontSize: '0.8rem', cursor: 'pointer', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <LifeBuoy size={14} /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
    </>
  );
}
