"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Search, Bell, Plus, ChevronDown, Layout, Star, Clock, Settings, Command,
  FileText, Briefcase, Activity, User as UserIcon, MessageSquare, Sparkles,
  Download, Upload, CheckSquare, ShieldCheck, GitMerge, Play, ChevronLeft, ChevronRight, PenTool, Hash
} from 'lucide-react';
import { useBuilderStore } from '@/store/useBuilderStore';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { useSectorStore, SECTOR_ROLES, SectorType } from '@/store/useSectorStore';
import CommandPalette from './CommandPalette';

export default function EnterpriseTopNav() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get('tab') || 'dashboard';
  
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [showSectorDropdown, setShowSectorDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const { activeModule, activeView } = useBuilderStore();
  const { workspaces, activeWorkspaceId, syncFromStorage } = useWorkspaceStore();
  const { activeSector, activeRoleId, setSector, setRole, getActiveRoleLabel } = useSectorStore();

  useEffect(() => {
    syncFromStorage();
  }, [syncFromStorage]);

  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId);

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
        setShowSectorDropdown(false);
        setShowRoleDropdown(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getModuleLabel = () => {
    if (!activeModule) return 'Dashboard';
    const modules: Record<string, string> = {
      'm-req': 'Requirements', 'm-scope': 'Scope', 'm-stake': 'Stakeholders',
      'm-work': 'Workflows', 'm-risk': 'Risks', 'm-appr': 'Approvals',
      'm-testcases': 'Test Cases', 'm-bugs': 'Bug Tracking', 'm-suites': 'Test Suites',
      'm-deploy': 'Deployments', 'm-pipelines': 'Pipelines', 'm-env': 'Environments',
      'm-release': 'Release Tracking'
    };
    return modules[activeModule] || activeModule.replace('m-', '').toUpperCase();
  };

  const getViewLabel = () => {
    switch (activeView) {
      case 'dashboard': return 'Dashboard';
      case 'canvas': return 'Canvas View';
      case 'template': return 'Template Dashboard';
      case 'properties': return 'Properties & Settings';
      default: return 'Canvas View';
    }
  };

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
      zIndex: 40,
      height: '64px',
    }}>
      
      {/* LEFT: Top Level Navigation & Workspace switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1 }}>

        {/* Workspace Switcher Selector */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Workspace:
          </span>
          <button
            onClick={() => setShowSectorDropdown(!showSectorDropdown)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'rgba(30, 41, 59, 0.5)', border: '1px solid var(--border)',
              borderRadius: '6px', padding: '0.4rem 0.8rem', color: 'var(--text-main)',
              fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            {activeSector === 'operations' ? 'Document Operations' : activeSector === 'reviews' ? 'Review & Approval' : 'Governance Admin'}
            <ChevronDown size={14} />
          </button>

          {showSectorDropdown && (
            <div
              style={{
                position: 'absolute', top: '100%', left: 0, marginTop: '0.5rem',
                background: 'var(--mkt-card, var(--surface))', border: '1px solid var(--border)',
                borderRadius: '8px', boxShadow: 'var(--shadow-lg)', zIndex: 100,
                width: '200px', padding: '0.25rem'
              }}
            >
              {[
                { id: 'operations', label: 'Document Operations' },
                { id: 'reviews', label: 'Review & Approval' },
                { id: 'governance', label: 'Governance Admin' }
              ].map(s => (
                <button
                  key={s.id}
                  onClick={() => {
                    setSector(s.id as SectorType);
                    setShowSectorDropdown(false);
                  }}
                  style={{
                    display: 'flex', width: '100%', padding: '0.5rem 0.75rem',
                    background: activeSector === s.id ? 'var(--primary)' : 'transparent',
                    color: activeSector === s.id ? 'white' : 'var(--text-main)',
                    border: 'none', borderRadius: '6px', fontSize: '0.85rem',
                    fontWeight: activeSector === s.id ? 700 : 500, cursor: 'pointer',
                    textAlign: 'left', transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => { if (activeSector !== s.id) e.currentTarget.style.background = 'var(--hover)'; }}
                  onMouseLeave={e => { if (activeSector !== s.id) e.currentTarget.style.background = 'transparent'; }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Role Switcher Selector */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Role:
          </span>
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'transparent', border: 'none',
              borderRadius: '6px', padding: '0.4rem 0.5rem', color: 'var(--primary)',
              fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            {getActiveRoleLabel()}
            <ChevronDown size={14} />
          </button>

          {showRoleDropdown && (
            <div
              style={{
                position: 'absolute', top: '100%', left: 0, marginTop: '0.5rem',
                background: 'var(--mkt-card, var(--surface))', border: '1px solid var(--border)',
                borderRadius: '8px', boxShadow: 'var(--shadow-lg)', zIndex: 100,
                width: '180px', padding: '0.25rem', maxHeight: '200px', overflowY: 'auto'
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
                    display: 'flex', width: '100%', padding: '0.5rem 0.75rem',
                    background: activeRoleId === r.id ? 'var(--primary)' : 'transparent',
                    color: activeRoleId === r.id ? 'white' : 'var(--text-main)',
                    border: 'none', borderRadius: '6px', fontSize: '0.85rem',
                    fontWeight: activeRoleId === r.id ? 700 : 500, cursor: 'pointer',
                    textAlign: 'left', transition: 'all 0.2s'
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
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginLeft: '1rem' }}>
          <button 
            onClick={() => window.history.back()} 
            title="Go Back"
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.4rem', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
            onMouseEnter={e => e.currentTarget.style.background = 'var(--background)'} 
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            onClick={() => window.history.forward()} 
            title="Go Forward"
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.4rem', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
            onMouseEnter={e => e.currentTarget.style.background = 'var(--background)'} 
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <ChevronRight size={16} />
          </button>
          <div style={{ width: '1px', height: '14px', background: 'var(--border)', margin: '0 0.25rem' }} />
          <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.4rem', borderRadius: '6px' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--background)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <Star size={16} />
          </button>
          <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.4rem', borderRadius: '6px' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--background)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <Clock size={16} />
          </button>
        </div>
      </div>

      {/* CENTER: Smart Global Search */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <div 
          onClick={() => setShowSearch(true)}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--background)', 
            border: '1px solid var(--border)', padding: '0.4rem 1rem', borderRadius: '8px',
            color: 'var(--text-muted)', cursor: 'text', transition: 'all 0.2s ease',
            width: '100%', maxWidth: '450px'
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          <Search size={14} />
          <span style={{ fontSize: '0.85rem', flex: 1 }}>Search workspace, requirements, or ask AI...</span>
          <div style={{ display: 'flex', gap: '0.2rem', alignItems: 'center' }}>
            <Command size={12} />
            <kbd style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>K</kbd>
          </div>
        </div>
      </div>

      {/* RIGHT: Status Panel & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, justifyContent: 'flex-end' }}>
        <button className="btn btn-primary" style={{ padding: '0.4rem 1rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
          <Plus size={16} /> Create
        </button>

        <button onClick={() => setShowNotifications(!showNotifications)} style={{ position: 'relative', background: 'transparent', border: 'none', color: 'var(--text-main)', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <Bell size={18} />
          <span style={{ position: 'absolute', top: '2px', right: '4px', background: '#ef4444', color: 'white', fontSize: '0.6rem', fontWeight: 'bold', width: '10px', height: '10px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}></span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.85rem' }}>
            SA
          </div>
        </div>
      </div>

      {showSearch && <CommandPalette onClose={() => setShowSearch(false)} />}
    </div>
  );
}
