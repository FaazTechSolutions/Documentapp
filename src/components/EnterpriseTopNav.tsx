"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Search, Bell, Plus, ChevronDown, Layout, Star, Clock, Settings, Command,
  FileText, Briefcase, Activity, User as UserIcon, MessageSquare, Sparkles,
  Download, Upload, CheckSquare, ShieldCheck, GitMerge, Play, ChevronRight, PenTool, Hash
} from 'lucide-react';
import { useBuilderStore } from '@/store/useBuilderStore';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import CommandPalette from './CommandPalette';

export default function EnterpriseTopNav() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get('tab') || 'dashboard';
  
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const { activeModule, activeView } = useBuilderStore();
  const { workspaces, activeWorkspaceId, syncFromStorage } = useWorkspaceStore();

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
      
      {/* LEFT: Builder Identity Bar (Breadcrumbs) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
        {/* Workspace Identity */}
        {activeWorkspace ? (
          <div 
            onClick={() => router.push('/?tab=dashboard')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.5rem', 
              background: `rgba(${activeWorkspace.theme?.color ? parseInt(activeWorkspace.theme.color.slice(1,3), 16) + ',' + parseInt(activeWorkspace.theme.color.slice(3,5), 16) + ',' + parseInt(activeWorkspace.theme.color.slice(5,7), 16) : '59, 130, 246'}, 0.1)`, 
              padding: '0.4rem 0.75rem', borderRadius: '8px', border: `1px solid ${activeWorkspace.theme?.color || '#3b82f6'}40`,
              cursor: 'pointer'
            }}
          >
            <span style={{ color: activeWorkspace.theme?.color || '#60a5fa', fontSize: '14px', display: 'flex' }}>
              {activeWorkspace.theme?.icon || <Layout size={14} />}
            </span>
            <span style={{ color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: 700 }}>
              {activeWorkspace.name}
            </span>
          </div>
        ) : (
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, padding: '0.4rem 0.75rem', border: '1px dashed var(--border)', borderRadius: '8px' }}>
            No Workspace Selected
          </div>
        )}

        {/* Builder Mode Breadcrumb */}
        {activeTab === 'builder' && (
          <>
            <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
            <div style={{ 
              display: 'flex', alignItems: 'center', gap: '0.5rem', 
              background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)', 
              padding: '0.4rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(79, 70, 229, 0.3)',
              boxShadow: '0 0 10px rgba(79, 70, 229, 0.15)'
            }}>
              <PenTool size={14} color="#4f46e5" />
              <span style={{ color: '#4f46e5', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.02em' }}>BUILDER MODE</span>
            </div>

            {/* Module Breadcrumb */}
            <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: 600, background: 'var(--background)', padding: '0.4rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border)' }}>
              <Hash size={14} color="var(--text-muted)" />
              {activeModule ? getModuleLabel() : 'Document Context'}
            </div>

            {/* View Mode Breadcrumb */}
            <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: 600, background: 'var(--background)', padding: '0.4rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border)' }}>
              <Layout size={14} color="var(--text-muted)" />
              {getViewLabel()}
            </div>

            {/* Document Breadcrumb */}
            <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: 700 }}>
              <FileText size={14} color="#3b82f6" />
              Active Document
            </div>
          </>
        )}
      </div>

      {/* CENTER: Smart Global Search */}
      <div style={{ flex: 1, maxWidth: '400px', margin: '0 2rem', position: 'relative' }}>
        <div 
          onClick={() => setShowSearch(true)}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.2)', 
            border: '1px solid rgba(255,255,255,0.1)', padding: '0.4rem 1rem', borderRadius: '8px',
            color: 'var(--text-muted)', cursor: 'text', transition: 'border-color 0.2s ease',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
        >
          <Search size={14} />
          <span style={{ fontSize: '0.85rem', flex: 1 }}>Search workspace...</span>
          <div style={{ display: 'flex', gap: '0.2rem' }}>
            <kbd style={{ background: 'rgba(255,255,255,0.1)', padding: '0.1rem 0.3rem', borderRadius: '4px', fontSize: '0.7rem', fontFamily: 'monospace' }}>Ctrl</kbd>
            <kbd style={{ background: 'rgba(255,255,255,0.1)', padding: '0.1rem 0.3rem', borderRadius: '4px', fontSize: '0.7rem', fontFamily: 'monospace' }}>K</kbd>
          </div>
        </div>
      </div>

      {/* RIGHT: Status Panel & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, justifyContent: 'flex-end' }}>
        
        {/* Builder Status Panel (Small Card) */}
        {activeTab === 'builder' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', background: 'var(--background)', padding: '0.3rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border)', marginRight: '0.5rem' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Builder Status</span>
            <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} /> Saved 2m ago
            </span>
          </div>
        )}

        <button onClick={() => setShowQuickActions(!showQuickActions)} style={{ position: 'relative', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', color: '#3b82f6', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <Plus size={16} />
        </button>

        <button onClick={() => setShowNotifications(!showNotifications)} style={{ position: 'relative', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-main)', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <Bell size={16} />
          <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#ef4444', color: 'white', fontSize: '0.6rem', fontWeight: 'bold', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--surface)' }}>3</span>
        </button>

        <div style={{ width: '1px', height: '24px', background: 'var(--border)', margin: '0 0.25rem' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.25rem', borderRadius: '8px', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '0.9rem' }}>
            SA
          </div>
        </div>
      </div>

      {showSearch && <CommandPalette onClose={() => setShowSearch(false)} />}
    </div>
  );
}
