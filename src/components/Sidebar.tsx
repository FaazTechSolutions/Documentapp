"use client";

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FileText, LayoutDashboard, Folder, Layers, Users, CheckSquare, 
  Settings, Moon, Sun, Search, Bell, BookOpen, BarChart2, ChevronDown, 
  ChevronLeft, ChevronRight, User as UserIcon, LogOut, CheckCircle, ShieldAlert, Sparkles
} from 'lucide-react';
import { getActiveSession, logoutUser, ApprovedUser } from '@/lib/auth';
import { useProjectStore } from '@/store/useProjectStore';
import { useBuilderStore, BuilderModule } from '@/store/useBuilderStore';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { useSectorStore, SECTOR_ROLES, SectorType } from '@/store/useSectorStore';

export default function Sidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'dashboard';
  const [user, setUser] = useState<ApprovedUser | null>(null);
  const [isDark, setIsDark] = useState(true);
  const [sidebarMode, setSidebarMode] = useState<'expanded' | 'compact' | 'invisible'>('expanded');
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isHoveringSidebar, setIsHoveringSidebar] = useState(false);
  const [workspaceSearch, setWorkspaceSearch] = useState('');
  const [isContextCollapsed, setIsContextCollapsed] = useState(false);

  const { activeModule, setActiveModule, setActiveView, requirements, risks, approvals } = useBuilderStore();
  const { workspaces, activeWorkspaceId, setActiveWorkspace } = useWorkspaceStore();
  const { activeSector, activeRoleId, setSector, setRole, getActiveRoleLabel, syncFromStorage: syncSector } = useSectorStore();
  const { projects, syncFromStorage } = useProjectStore();

  useEffect(() => {
    syncFromStorage();
    syncSector();
    setUser(getActiveSession());
    setIsDark(document.body.classList.contains('dark-theme'));
  }, [syncFromStorage, syncSector]);

  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId);
  const getTabClass = (tabName: string) => {
    return activeTab === tabName 
      ? 'sidebar-nav-item active' 
      : 'sidebar-nav-item';
  };

  const handleWorkspaceSwitch = (wsId: string) => {
    setActiveWorkspace(wsId);
    setShowWorkspaceModal(false);
    const newWs = workspaces.find(w => w.id === wsId);
    if (newWs) {
      setActiveView('dashboard');
      router.push('/?tab=dashboard');
    }
  };

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

  // Main navigation configuration matching sector visibilities
  const mainNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: Folder, activeColor: '#3b82f6' },
    { id: 'templates', label: 'Templates', icon: Layers, activeColor: '#f97316' },
    { id: 'template-setup', label: 'Template Setup', icon: Settings },
    { id: 'analytics', label: 'Analytics', icon: BarChart2, activeColor: '#06b6d4' },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'approvals', label: 'Approvals', icon: CheckSquare, badge: `${approvals.filter(a => a.status === 'Pending').length} Pending`, badgeColor: '#f59e0b' },
    { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: '8', badgeColor: '#ef4444' },
    { id: 'settings', label: 'Settings', icon: Settings }
  ].filter(item => {
    if (activeSector === 'operations') {
      return ['dashboard', 'projects', 'templates', 'template-setup', 'analytics', 'knowledge'].includes(item.id);
    } else if (activeSector === 'reviews') {
      return ['dashboard', 'approvals', 'reports', 'notifications', 'analytics'].includes(item.id);
    } else if (activeSector === 'governance') {
      return ['dashboard', 'analytics', 'settings'].includes(item.id);
    }
    return true;
  });

  const isCollapsed = sidebarMode === 'compact';
  const widthMap = {
    expanded: '260px',
    compact: '70px',
    invisible: '0px'
  };

  // Switcher Items mapped dynamically
  const switcherItems = [
    { id: 'operations', label: 'Document Operations', type: 'sector', desc: 'Creation, editing, and AI synthesis', icon: '⚙️' },
    { id: 'reviews', label: 'Review & Approval', type: 'sector', desc: 'Review lifecycle & active comments', icon: '👁️' },
    { id: 'governance', label: 'Governance Admin', type: 'sector', desc: 'System settings, audit, and RBAC', icon: '🛡️' },
    ...workspaces.map(w => ({
      id: w.id,
      label: w.name,
      type: 'workspace',
      desc: w.description,
      icon: w.theme?.icon || '💼'
    }))
  ];

  const filteredSwitcher = switcherItems.filter(item => 
    item.label.toLowerCase().includes(workspaceSearch.toLowerCase()) ||
    item.desc.toLowerCase().includes(workspaceSearch.toLowerCase())
  );

  return (
    <>
      {/* Invisible Trigger Area - Hover left edge to reveal */}
      {sidebarMode === 'invisible' && (
        <div 
          style={{ position: 'fixed', top: 0, left: 0, width: '15px', height: '100vh', zIndex: 99, cursor: 'pointer' }}
          onMouseEnter={() => setSidebarMode('expanded')}
        />
      )}

      {/* Floating Toggle Icon */}
      {sidebarMode === 'invisible' && (
        <button
          onClick={() => setSidebarMode('expanded')}
          style={{
            position: 'fixed', top: '1rem', left: '1rem', zIndex: 101, 
            background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(10px)', 
            border: '1px solid rgba(255,255,255,0.1)', padding: '0.5rem', 
            borderRadius: '8px', cursor: 'pointer', color: 'white', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)', transition: 'all 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(15, 23, 42, 1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(15, 23, 42, 0.8)'}
        >
          <ChevronRight size={16} />
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
          transition: 'width 0.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: sidebarMode === 'invisible' ? 'translateX(-100%)' : 'translateX(0)',
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(30px)',
          borderRight: '1px solid rgba(255,255,255,0.08)',
          position: 'fixed',
          top: 0, left: 0, bottom: 0,
          zIndex: 100,
          boxShadow: '4px 0 24px rgba(0,0,0,0.4)',
          overflow: 'hidden'
        }}
      >
        {/* Collapse / Hide Toggle Button */}
        <button 
          onClick={() => setSidebarMode(sidebarMode === 'expanded' ? 'compact' : sidebarMode === 'compact' ? 'invisible' : 'expanded')}
          style={{
            position: 'absolute', top: '1rem', right: '10px', zIndex: 102,
            background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(255,255,255,0.1)',
            width: '24px', height: '24px', borderRadius: '6px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--text-muted)', transition: 'all 0.2s'
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(30, 41, 59, 0.6)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
        >
          {sidebarMode === 'expanded' ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>
        
        {/* SECTION 1 — WORKSPACE SWITCHER */}
        <div style={{ padding: isCollapsed ? '1rem 0.5rem' : '1.25rem 1.25rem 0.75rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div 
            onClick={() => setShowWorkspaceModal(true)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '8px', padding: '0.6rem 0.75rem', cursor: 'pointer', transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
              <div style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                width: '28px', height: '28px', borderRadius: '6px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0
              }}>
                {activeSector === 'operations' ? '⚙️' : activeSector === 'reviews' ? '👁️' : '🛡️'}
              </div>
              {!isCollapsed && (
                <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'white', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {activeSector === 'operations' ? 'Document Operations' : activeSector === 'reviews' ? 'Review & Approval' : 'Governance Admin'}
                  </span>
                  <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginTop: '0.1rem' }}>
                    {activeWorkspace?.name || 'Governance Workspace'}
                  </span>
                </div>
              )}
            </div>
            {!isCollapsed && <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />}
          </div>
        </div>

        {/* SECTION 2 — ROLE SWITCHER */}
        {!isCollapsed && (
          <div style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Security Role
            </span>
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                style={{
                  display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between',
                  background: 'transparent', border: 'none', padding: '0.4rem 0.25rem',
                  color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer'
                }}
              >
                <span>{getActiveRoleLabel()}</span>
                <ChevronDown size={12} />
              </button>

              {showRoleDropdown && (
                <div
                  className="animate-fade-in"
                  style={{
                    position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '0.25rem',
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: '8px', boxShadow: 'var(--shadow-xl)', zIndex: 115,
                    padding: '0.25rem', maxHeight: '160px', overflowY: 'auto'
                  }}
                >
                  {SECTOR_ROLES[activeSector].map(r => (
                    <button
                      key={r.id}
                      onClick={() => {
                        setRole(r.id);
                        setShowRoleDropdown(false);
                      }}
                      style={{
                        display: 'flex', width: '100%', padding: '0.45rem 0.6rem',
                        background: activeRoleId === r.id ? 'var(--primary)' : 'transparent',
                        color: activeRoleId === r.id ? 'white' : 'var(--text-main)',
                        border: 'none', borderRadius: '6px', fontSize: '0.8rem',
                        fontWeight: activeRoleId === r.id ? 700 : 500, cursor: 'pointer',
                        textAlign: 'left', transition: 'all 0.2s', marginBottom: '1px'
                      }}
                      onMouseEnter={e => { if (activeRoleId !== r.id) e.currentTarget.style.background = 'var(--hover)'; }}
                      onMouseLeave={e => { if (activeRoleId !== r.id) e.currentTarget.style.background = 'transparent'; }}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SECTION 3 — MAIN NAVIGATION */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', padding: isCollapsed ? '0.75rem 0.5rem' : '1rem 1.25rem', flex: 1, overflowY: 'auto' }}>
          {mainNav.map(nav => {
            const NavIcon = nav.icon;
            const isActive = activeTab === nav.id;
            return (
              <Link 
                key={nav.id}
                href={`/?tab=${nav.id}`}
                className={getTabClass(nav.id)}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '0.75rem', padding: isCollapsed ? '0.75rem' : '0.5rem 0.75rem', 
                  borderRadius: '6px', textDecoration: 'none', color: isActive ? (nav.activeColor || '#ffffff') : '#cbd5e1',
                  background: isActive ? (nav.activeColor ? `${nav.activeColor}15` : 'rgba(255,255,255,0.06)') : 'transparent',
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  position: 'relative',
                  border: isActive ? `1px solid ${nav.activeColor ? `${nav.activeColor}30` : 'rgba(255,255,255,0.05)'}` : '1px solid transparent',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = '#ffffff'; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#cbd5e1'; } }}
              >
                <NavIcon size={isCollapsed ? 18 : 16} />
                {!isCollapsed && (
                  <span style={{ fontSize: '0.8rem', fontWeight: isActive ? 600 : 500, flex: 1 }}>{nav.label}</span>
                )}
                {!isCollapsed && nav.badge && (
                  <span style={{ 
                    fontSize: '0.6rem', fontWeight: 700, 
                    background: nav.badgeColor ? `${nav.badgeColor}20` : 'rgba(255,255,255,0.1)',
                    color: nav.badgeColor || '#fff', padding: '0.1rem 0.35rem', borderRadius: '4px'
                  }}>
                    {nav.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* SECTION 4 — CONTEXT PANEL */}
        {!isCollapsed && (
          <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div 
              onClick={() => setIsContextCollapsed(!isContextCollapsed)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', marginBottom: isContextCollapsed ? 0 : '0.5rem' }}
            >
              <span style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Context Scope
              </span>
              <span style={{ fontSize: '0.6rem', color: 'var(--primary)' }}>{isContextCollapsed ? 'Show' : 'Hide'}</span>
            </div>

            {!isContextCollapsed && (
              <div style={{ background: 'rgba(59, 130, 246, 0.03)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px', padding: '0.6rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>
                  {activeWorkspace?.name || 'Mawarid ERP Suite'}
                </span>
                
                {/* Permissions tag cloud */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.2rem' }}>
                  {activeSector === 'operations' ? (
                    <>
                      <span style={{ fontSize: '0.55rem', padding: '0.1rem 0.3rem', borderRadius: '4px', background: 'rgba(59,130,246,0.1)', color: '#60a5fa', fontWeight: 700 }}>EDIT</span>
                      <span style={{ fontSize: '0.55rem', padding: '0.1rem 0.3rem', borderRadius: '4px', background: 'rgba(168,85,247,0.1)', color: '#c084fc', fontWeight: 700 }}>AI GEN</span>
                      <span style={{ fontSize: '0.55rem', padding: '0.1rem 0.3rem', borderRadius: '4px', background: 'rgba(16,185,129,0.1)', color: '#34d399', fontWeight: 700 }}>TEMPLATES</span>
                    </>
                  ) : activeSector === 'reviews' ? (
                    <>
                      <span style={{ fontSize: '0.55rem', padding: '0.1rem 0.3rem', borderRadius: '4px', background: 'rgba(59,130,246,0.1)', color: '#60a5fa', fontWeight: 700 }}>VIEW</span>
                      <span style={{ fontSize: '0.55rem', padding: '0.1rem 0.3rem', borderRadius: '4px', background: 'rgba(245,158,11,0.1)', color: '#fbbf24', fontWeight: 700 }}>APPROVE</span>
                      <span style={{ fontSize: '0.55rem', padding: '0.1rem 0.3rem', borderRadius: '4px', background: 'rgba(239,68,68,0.1)', color: '#f87171', fontWeight: 700 }}>AUDIT</span>
                    </>
                  ) : (
                    <>
                      <span style={{ fontSize: '0.55rem', padding: '0.1rem 0.3rem', borderRadius: '4px', background: 'rgba(239,68,68,0.1)', color: '#f87171', fontWeight: 700 }}>FULL ADMIN</span>
                      <span style={{ fontSize: '0.55rem', padding: '0.1rem 0.3rem', borderRadius: '4px', background: 'rgba(16,185,129,0.1)', color: '#34d399', fontWeight: 700 }}>RBAC MGT</span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECTION 5 — USER PROFILE */}
        <div style={{ marginTop: 'auto', padding: isCollapsed ? '0.75rem 0.5rem' : '1rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {user && (
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'space-between', width: '100%' }}>
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, justifyContent: isCollapsed ? 'center' : 'flex-start' }}
                >
                  <span style={{ fontSize: '1.1rem', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {user.avatar}
                  </span>
                  {!isCollapsed && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', overflow: 'hidden' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.8rem', color: '#ffffff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', width: '120px', textAlign: 'left' }}>{user.fullName}</span>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{getActiveRoleLabel()}</span>
                    </div>
                  )}
                </button>
                
                {!isCollapsed && (
                  <button 
                    onClick={() => { logoutUser(); window.location.href = '/login'; }}
                    title="Log Out"
                    style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.25rem', borderRadius: '4px' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <LogOut size={16} />
                  </button>
                )}
              </div>

              {/* Profile Config menu */}
              {showProfileMenu && (
                <div className="animate-fade-in" style={{ 
                  position: 'absolute', bottom: '100%', left: isCollapsed ? '100%' : 0, marginLeft: isCollapsed ? '0.5rem' : 0, marginBottom: '0.5rem', width: '200px',
                  background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.35rem', 
                  boxShadow: 'var(--shadow-xl)', zIndex: 120 
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <button onClick={toggleTheme} style={{ background: 'transparent', border: 'none', padding: '0.5rem', textAlign: 'left', color: 'var(--text-main)', fontSize: '0.8rem', cursor: 'pointer', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--hover)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      {isDark ? <Sun size={14} /> : <Moon size={14} />} Toggle Theme
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* SEARCHABLE WORKSPACE SELECTOR POPUP MODAL */}
      {showWorkspaceModal && (
        <div 
          onClick={() => setShowWorkspaceModal(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        >
          <div 
            onClick={e => e.stopPropagation()}
            className="animate-fade-in"
            style={{ width: '420px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem', boxShadow: 'var(--shadow-2xl)', display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 800 }}>Switch Domain & Workspace</span>
              <button onClick={() => setShowWorkspaceModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>Close</button>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <Search size={16} style={{ color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Search domain or workspace..." 
                value={workspaceSearch}
                onChange={e => setWorkspaceSearch(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: '0.85rem', outline: 'none', width: '100%' }}
                autoFocus
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', maxHeight: '320px', overflowY: 'auto' }}>
              {/* Category: Sectors / Domains */}
              <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '0.25rem 0.5rem' }}>Logical Sectors</div>
              {filteredSwitcher.filter(i => i.type === 'sector').map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setSector(item.id as SectorType);
                    setShowWorkspaceModal(false);
                  }}
                  style={{
                    display: 'flex', gap: '0.75rem', alignItems: 'center', width: '100%', padding: '0.6rem',
                    background: activeSector === item.id ? 'var(--primary)' : 'transparent',
                    color: activeSector === item.id ? 'white' : 'var(--text-main)',
                    border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => { if (activeSector !== item.id) e.currentTarget.style.background = 'var(--hover)'; }}
                  onMouseLeave={e => { if (activeSector !== item.id) e.currentTarget.style.background = 'transparent'; }}
                >
                  <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{item.label}</span>
                    <span style={{ fontSize: '0.65rem', color: activeSector === item.id ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)' }}>{item.desc}</span>
                  </div>
                </button>
              ))}

              {/* Category: Environments */}
              <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '0.25rem 0.5rem', marginTop: '0.5rem' }}>Workspace Environments</div>
              {filteredSwitcher.filter(i => i.type === 'workspace').map(item => (
                <button
                  key={item.id}
                  onClick={() => handleWorkspaceSwitch(item.id)}
                  style={{
                    display: 'flex', gap: '0.75rem', alignItems: 'center', width: '100%', padding: '0.6rem',
                    background: activeWorkspaceId === item.id ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                    border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                    borderLeft: activeWorkspaceId === item.id ? '3px solid var(--primary)' : '3px solid transparent'
                  }}
                  onMouseEnter={e => { if (activeWorkspaceId !== item.id) e.currentTarget.style.background = 'var(--hover)'; }}
                  onMouseLeave={e => { if (activeWorkspaceId !== item.id) e.currentTarget.style.background = 'transparent'; }}
                >
                  <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: activeWorkspaceId === item.id ? 'var(--primary)' : 'var(--text-main)' }}>{item.label}</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{item.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
