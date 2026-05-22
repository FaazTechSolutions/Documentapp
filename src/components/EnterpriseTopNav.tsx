"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  Plus, 
  ChevronDown, 
  Layout, 
  Star, 
  Clock, 
  Settings, 
  Command,
  FileText,
  Briefcase,
  Activity,
  User as UserIcon,
  MessageSquare
} from 'lucide-react';

export default function EnterpriseTopNav() {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [workspace, setWorkspace] = useState('Business Analysis');
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);

  // Ctrl+K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
      if (e.key === 'Escape') {
        setShowSearch(false);
        setShowQuickActions(false);
        setShowNotifications(false);
        setShowWorkspaceMenu(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const workspaces = ['Business Analysis', 'QA & Testing', 'DevOps', 'Product Management', 'Executive'];

  const quickActions = [
    { icon: <FileText size={14} />, label: 'New BRD' },
    { icon: <FileText size={14} />, label: 'New Test Case' },
    { icon: <Briefcase size={14} />, label: 'New Project' },
    { icon: <Activity size={14} />, label: 'Log Risk' },
  ];

  const recentSearches = [
    'pending payroll approvals',
    'Q3 sprint velocity',
    'HR module requirements'
  ];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.75rem 1.5rem',
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 40, // Below the floating editor toolbar which is 100
      height: '64px',
    }}>
      
      {/* LEFT: Workspace Switcher & Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => {
              setShowWorkspaceMenu(!showWorkspaceMenu);
              setShowQuickActions(false);
              setShowNotifications(false);
            }}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', 
              padding: '0.4rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)',
              color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer'
            }}
          >
            <Layout size={14} style={{ color: '#60a5fa' }} />
            {workspace}
            <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
          </button>

          {showWorkspaceMenu && (
            <div className="animate-fade-in" style={{ position: 'absolute', top: '100%', left: 0, marginTop: '0.5rem', width: '220px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '0.5rem', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', zIndex: 50 }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '0.4rem 0.5rem', letterSpacing: '0.05em' }}>Switch Workspace</div>
              {workspaces.map(w => (
                <button 
                  key={w}
                  onClick={() => { setWorkspace(w); setShowWorkspaceMenu(false); }}
                  style={{ width: '100%', textAlign: 'left', padding: '0.5rem', background: w === workspace ? 'rgba(59, 130, 246, 0.1)' : 'transparent', border: 'none', color: w === workspace ? '#60a5fa' : 'var(--text-main)', fontSize: '0.85rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Layout size={14} style={{ opacity: w === workspace ? 1 : 0.5 }} /> {w}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
          <Star size={14} style={{ cursor: 'pointer' }} title="Favorites" />
          <Clock size={14} style={{ cursor: 'pointer' }} title="Recent" />
        </div>
      </div>

      {/* CENTER: Smart Global Search */}
      <div style={{ flex: 1, maxWidth: '600px', margin: '0 2rem', position: 'relative' }}>
        <div 
          onClick={() => setShowSearch(true)}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.2)', 
            border: '1px solid rgba(255,255,255,0.1)', padding: '0.4rem 1rem', borderRadius: '8px',
            color: 'var(--text-muted)', cursor: 'text', transition: 'border-color 0.2s ease',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.2)'
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
        >
          <Search size={16} />
          <span style={{ fontSize: '0.85rem', flex: 1 }}>Search workspace, requirements, or ask AI...</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 600 }}>
            <Command size={10} /> K
          </div>
        </div>

        {/* Global Search Overlay Modal */}
        {showSearch && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', justifyContent: 'center', paddingTop: '10vh' }}>
            <div className="animate-fade-in" style={{ width: '100%', maxWidth: '700px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '80vh' }}>
              <div style={{ display: 'flex', alignItems: 'center', padding: '1rem', borderBottom: '1px solid var(--border)' }}>
                <Search size={20} style={{ color: 'var(--text-muted)', marginRight: '0.75rem' }} />
                <input 
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Ask AI, search documents, Jira tickets..." 
                  style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: '1.1rem', outline: 'none' }}
                />
                <button onClick={() => setShowSearch(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', padding: '0.3rem', borderRadius: '6px', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700 }}>ESC</span>
                </button>
              </div>
              
              <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                <div style={{ flex: 2, padding: '1rem', overflowY: 'auto', borderRight: '1px solid var(--border)' }}>
                  {searchQuery.length === 0 ? (
                    <>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Recent Searches</div>
                      {recentSearches.map((s, i) => (
                        <div key={i} style={{ padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-main)' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          <Clock size={14} style={{ color: 'var(--text-muted)' }} /> {s}
                        </div>
                      ))}
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#3b82f6', marginBottom: '0.5rem', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Sparkles size={12} /> AI Semantic Matches
                      </div>
                      <div style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', marginBottom: '1rem' }}>
                        <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', color: '#60a5fa' }}>Pending Payroll Approvals</h4>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Found 3 workflows and 1 risk related to "{searchQuery}". The HR Compensation Policy 2026 is currently blocking approval.</p>
                      </div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Documents</div>
                      <div style={{ padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-main)' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <FileText size={14} style={{ color: '#60a5fa' }} /> HR Compensation Policy 2026
                      </div>
                    </>
                  )}
                </div>
                <div style={{ flex: 1, padding: '1rem', background: 'rgba(0,0,0,0.1)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Suggested Actions</div>
                  <button style={{ width: '100%', textAlign: 'left', padding: '0.6rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.85rem', marginBottom: '0.5rem', cursor: 'pointer' }}>Generate Status Report</button>
                  <button style={{ width: '100%', textAlign: 'left', padding: '0.6rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.85rem', cursor: 'pointer' }}>Find Missing Requirements</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT: Quick Actions, Notifications, Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        
        {/* Quick Actions */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => {
              setShowQuickActions(!showQuickActions);
              setShowWorkspaceMenu(false);
              setShowNotifications(false);
            }}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', 
              padding: '0.4rem 0.75rem', borderRadius: '8px', border: 'none',
              color: 'white', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
            }}
          >
            <Plus size={16} /> Create
          </button>

          {showQuickActions && (
            <div className="animate-fade-in" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem', width: '200px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '0.5rem', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', zIndex: 50 }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '0.4rem 0.5rem', letterSpacing: '0.05em' }}>New Item</div>
              {quickActions.map((action, i) => (
                <button 
                  key={i}
                  style={{ width: '100%', textAlign: 'left', padding: '0.5rem', background: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: '0.85rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {action.icon} {action.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowQuickActions(false);
              setShowWorkspaceMenu(false);
            }}
            style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', 
              width: '36px', height: '36px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)',
              color: 'var(--text-main)', cursor: 'pointer', position: 'relative'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >
            <Bell size={18} />
            <span style={{ position: 'absolute', top: '-2px', right: '-2px', background: '#ef4444', width: '10px', height: '10px', borderRadius: '50%', border: '2px solid var(--surface)' }} />
          </button>

          {showNotifications && (
            <div className="animate-fade-in" style={{ position: 'absolute', top: '100%', right: '-60px', marginTop: '0.5rem', width: '320px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '0', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', zIndex: 50, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Notifications</span>
                <span style={{ fontSize: '0.7rem', color: '#60a5fa', cursor: 'pointer' }}>Mark all read</span>
              </div>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '0.75rem', cursor: 'pointer', background: 'rgba(59, 130, 246, 0.05)' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MessageSquare size={16} />
                  </div>
                  <div>
                    <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: '1.4' }}><strong>Ahmad</strong> commented on <strong>HR Policy 2026</strong></p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>"Please review the vacation accrual section..."</p>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>2 mins ago</span>
                  </div>
                </div>
                <div style={{ padding: '1rem', display: 'flex', gap: '0.75rem', cursor: 'pointer' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Activity size={16} />
                  </div>
                  <div>
                    <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: '1.4' }}><strong>High Risk Detected</strong></p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>AI detected overlapping API endpoints in Sprint 4.</p>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>1 hour ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
