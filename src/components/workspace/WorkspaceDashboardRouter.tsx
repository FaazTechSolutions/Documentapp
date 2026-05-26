"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { useDocumentStore } from '@/store/useDocumentStore';
import { useTemplateStore } from '@/store/useTemplateStore';
import { useSectorStore } from '@/store/useSectorStore';
import StakeholderGrid from '@/components/builder/StakeholderGrid';
import { 
  Activity, Target, ShieldCheck, FileText, CheckSquare, BarChart2, 
  LayoutDashboard, Target as ScopeIcon, Users, GitBranch, Settings, 
  AlertTriangle, PlayCircle, Zap, Shield, BookOpen, Layers, 
  LayoutGrid, List as ListIcon, Search, ChevronDown 
} from 'lucide-react';

export default function WorkspaceDashboardRouter() {
  const router = useRouter();
  const { workspaces, activeWorkspaceId } = useWorkspaceStore();
  const { documents } = useDocumentStore();
  const { templates, syncFromStorage } = useTemplateStore();
  
  const [activeTab, setActiveTab] = useState('dashboard');

  // Documents list local states (from marked fields of the first image)
  const [docSearch, setDocSearch] = useState('');
  const [docStatusFilter, setDocStatusFilter] = useState('all'); // 'all', 'Draft', 'Needs Approval', 'Published'
  const [docSortBy, setDocSortBy] = useState('updated'); // 'updated', 'alphabetical', 'completion'
  const [docLayout, setDocLayout] = useState<'list' | 'grid'>('list');

  useEffect(() => {
    syncFromStorage();
  }, [syncFromStorage]);

  // Reset tab when workspace changes
  useEffect(() => {
    setActiveTab('dashboard');
  }, [activeWorkspaceId]);

  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId);

  if (!activeWorkspace) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No workspace selected.</div>;
  }

  // Filter active (non-deleted, non-archived) documents for the current workspace, strictly filtered by workspace type relevance
  const { activeSector, activeRoleId } = useSectorStore();
  const isSuperAdmin = activeRoleId === 'super_admin' || activeRoleId === 'admin' || activeRoleId === 'gov_admin';

  const workspaceDocs = documents.filter(d => {
    if (d.isDeleted || d.isArchived || String(d.workspaceId) !== String(activeWorkspaceId)) {
      return false;
    }
    
    // Workspace Sector Isolation: non-admins only see documents matching the active workspace sector
    const docSector = d.workspaceSector || 'operations';
    if (!isSuperAdmin && docSector !== activeSector) return false;
    const docType = (d.docType || '').toLowerCase();
    switch (activeWorkspace.type) {
      case 'business_analysis':
        return ['brd', 'frd', 'srs', 'tdd', 'custom'].includes(docType);
      case 'qa':
        return ['testplan', 'testcases', 'buglog', 'uat', 'custom'].includes(docType);
      case 'devops':
        return ['devops-deploy', 'devops-server', 'devops-backup', 'devops-pipeline', 'devops-env', 'devops-monitor', 'release', 'custom', 'sprint'].includes(docType);
      case 'executive':
        return ['portfolio', 'financials', 'okrs', 'custom'].includes(docType);
      case 'documentation':
        return ['kb', 'api_docs', 'release_notes', 'custom'].includes(docType);
      default:
        return true;
    }
  });

  // Shared top-level workspace document metrics (averages)
  const avgCompletion = workspaceDocs.length > 0
    ? Math.round(workspaceDocs.reduce((sum, d) => sum + (d.completionPercentage || 0), 0) / workspaceDocs.length)
    : 0;

  // Shared Design Tokens (mimicking CustomDocumentEditor)
  const ds = {
    card: { padding: '1.25rem', background: 'var(--surface)', borderRadius: '14px', border: '1px solid var(--border)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' } as React.CSSProperties,
    title: { fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' } as React.CSSProperties,
    badge: (color: string) => ({ fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: '4px', background: `${color}15`, color, textTransform: 'uppercase' as const, letterSpacing: '0.03em' }),
  };

  const DashboardHeader = () => (
    <div style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', background: 'var(--background)', flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `rgba(${activeWorkspace.theme.color ? parseInt(activeWorkspace.theme.color.slice(1,3), 16) + ',' + parseInt(activeWorkspace.theme.color.slice(3,5), 16) + ',' + parseInt(activeWorkspace.theme.color.slice(5,7), 16) : '59, 130, 246'}, 0.2)`, color: activeWorkspace.theme.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
          {activeWorkspace.theme.icon}
        </div>
        <div>
          <div style={{ fontSize: '0.65rem', fontWeight: 800, color: activeWorkspace.theme.color || 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>WORKSPACE DASHBOARD</div>
          <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>{activeWorkspace.name}</h1>
        </div>
      </div>
      <button 
        className="btn btn-primary"
        onClick={() => router.push('/?tab=templates')}
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.8rem', fontWeight: 700 }}
      >
        <FileText size={16} />
        Browse Templates
      </button>
    </div>
  );

  const getSidebarTabs = () => {
    switch (activeWorkspace.type) {
      case 'qa':
        return [
          { id: 'dashboard', label: 'QA Dashboard', icon: <LayoutDashboard size={16} /> },
          { id: 'test_suites', label: 'Test Suites', icon: <CheckSquare size={16} /> },
          { id: 'defects', label: 'Bug Tracking', icon: <AlertTriangle size={16} /> },
          { id: 'automation', label: 'Automation Runs', icon: <PlayCircle size={16} /> },
          { id: 'environments', label: 'Test Environments', icon: <Layers size={16} /> },
          { id: 'team', label: 'QA Team', icon: <Users size={16} /> }
        ];
      case 'devops':
        return [
          { id: 'dashboard', label: 'DevOps Dashboard', icon: <LayoutDashboard size={16} /> },
          { id: 'pipelines', label: 'CI/CD Pipelines', icon: <GitBranch size={16} /> },
          { id: 'infrastructure', label: 'Infrastructure', icon: <Layers size={16} /> },
          { id: 'monitoring', label: 'Monitoring', icon: <Activity size={16} /> },
          { id: 'security', label: 'Security & Auth', icon: <Shield size={16} /> },
          { id: 'team', label: 'DevOps Team', icon: <Users size={16} /> }
        ];
      case 'executive':
        return [
          { id: 'dashboard', label: 'Executive Summary', icon: <LayoutDashboard size={16} /> },
          { id: 'portfolio', label: 'Portfolio View', icon: <Layers size={16} /> },
          { id: 'financials', label: 'Financials', icon: <BarChart2 size={16} /> },
          { id: 'okrs', label: 'OKRs & Goals', icon: <Target size={16} /> },
          { id: 'team', label: 'Stakeholders', icon: <Users size={16} /> }
        ];
      case 'documentation':
        return [
          { id: 'dashboard', label: 'Knowledge Dashboard', icon: <LayoutDashboard size={16} /> },
          { id: 'kb', label: 'Knowledge Base', icon: <BookOpen size={16} /> },
          { id: 'api_docs', label: 'API Documentation', icon: <FileText size={16} /> },
          { id: 'release_notes', label: 'Release Notes', icon: <GitBranch size={16} /> },
          { id: 'team', label: 'Writers', icon: <Users size={16} /> }
        ];
      case 'business_analysis':
      default:
        return [
          { id: 'dashboard', label: 'Executive Summary', icon: <LayoutDashboard size={16} /> },
          { id: 'all_documents', label: 'All Documents', icon: <BookOpen size={16} /> },
          { id: 'requirements', label: 'Requirement Modules', icon: <FileText size={16} /> },
          { id: 'scope', label: 'Scope Management', icon: <ScopeIcon size={16} /> },
          { id: 'stakeholders', label: 'Stakeholders', icon: <Users size={16} /> },
          { id: 'workflows', label: 'Workflows', icon: <GitBranch size={16} /> },
          { id: 'analytics', label: 'Analytics', icon: <BarChart2 size={16} /> },
          { id: 'team', label: 'BA Team', icon: <Users size={16} /> }
        ];
    }
  };

  const renderMetricGrid = (metrics: any[]) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', position: 'relative' }}>
      {metrics.map((kpi, i) => (
        <div key={i} style={{ ...ds.card, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: kpi.color }} />
          <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{kpi.icon}</div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: kpi.color, lineHeight: 1 }}>{kpi.value}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '0.35rem' }}>{kpi.title}</div>
        </div>
      ))}
    </div>
  );

  const renderTeamTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>👥 Team Members</h2>
      <div style={ds.card}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
          {activeWorkspace.members.map(m => (
            <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--background)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: activeWorkspace.theme.color || 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>
                {m.name.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{m.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRequirementsTab = () => {
    // Filter and sort the workspace documents dynamically based on active search & status filter
    const filteredDocs = workspaceDocs
      .filter(d => {
        const matchesSearch = d.title.toLowerCase().includes(docSearch.toLowerCase()) || 
                              (d.owner && d.owner.toLowerCase().includes(docSearch.toLowerCase()));
        const matchesStatus = docStatusFilter === 'all' || d.status === docStatusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (docSortBy === 'alphabetical') {
          return a.title.localeCompare(b.title);
        }
        if (docSortBy === 'completion') {
          return (b.completionPercentage || 0) - (a.completionPercentage || 0);
        }
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });

    // Make metrics cards strictly reflect the dynamic filtered collection
    const currentTotalCount = filteredDocs.length;
    const currentDraftCount = filteredDocs.filter(d => d.status === 'Draft').length;
    const currentPendingCount = filteredDocs.filter(d => d.status === 'Needs Approval' || d.status === 'In Review').length;
    const currentAvgCompletion = filteredDocs.length > 0
      ? Math.round(filteredDocs.reduce((sum, d) => sum + (d.completionPercentage || 0), 0) / filteredDocs.length)
      : 0;

    const getDocTypeBadge = (type: string) => {
      const t = type.toLowerCase();
      if (t === 'brd') return { text: 'BRD', bg: '#2563eb', color: '#ffffff' };
      if (t === 'frd') return { text: 'FRD', bg: '#16a34a', color: '#ffffff' };
      if (t === 'srs') return { text: 'SRS', bg: '#8b5cf6', color: '#ffffff' };
      if (t === 'tdd') return { text: 'TDD', bg: '#d97706', color: '#ffffff' };
      return { text: type.toUpperCase() || 'CUSTOM', bg: '#4b5563', color: '#ffffff' };
    };

    const getStatusBadge = (status: string) => {
      const s = status.toLowerCase();
      if (s === 'draft') return { bg: 'rgba(75, 85, 99, 0.1)', color: '#9ca3af' };
      if (s === 'in review' || s === 'needs approval') return { bg: 'rgba(217, 119, 6, 0.1)', color: '#fbbf24' };
      if (s === 'published') return { bg: 'rgba(22, 163, 74, 0.1)', color: '#4ade80' };
      return { bg: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa' };
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>📋 Workspace Requirement Modules & Documents</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>
              Access all project documents (BRD, FRD, SRS, TDD) within the workspace. Click a document to navigate to its primary editor.
            </p>
          </div>
        </div>

        {/* ── METRICS GRID (Dynamically updated to strictly represent displayed documents) ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {/* Card 1: Total Documents */}
          <div style={{ ...ds.card, display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--surface)' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.1 }}>{currentTotalCount}</div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.2rem' }}>Total Documents</div>
            </div>
          </div>

          {/* Card 2: Active Drafts */}
          <div style={{ ...ds.card, display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--surface)' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.1 }}>{currentDraftCount}</div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.2rem' }}>Active Drafts</div>
            </div>
          </div>

          {/* Card 3: Pending Approval */}
          <div style={{ ...ds.card, display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--surface)' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.1 }}>{currentPendingCount}</div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.2rem' }}>Pending Approval</div>
            </div>
          </div>

          {/* Card 4: AI Quality Score */}
          <div style={{ ...ds.card, display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--surface)' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.1 }}>{currentAvgCompletion}%</div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.2rem' }}>Avg Completion</div>
            </div>
          </div>
        </div>

        {/* ── SEARCH, FILTERS & LAYOUT CONTROLS ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '0.75rem 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
            {/* Search documents */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
              <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                <Search size={16} />
              </span>
              <input 
                type="text" 
                placeholder="Search documents..." 
                value={docSearch}
                onChange={(e) => setDocSearch(e.target.value)}
                style={{ width: '100%', padding: '0.45rem 1rem 0.45rem 2.25rem', fontSize: '0.85rem', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text-main)', outline: 'none' }}
              />
            </div>

            {/* Dropdown 1: Active/Status filter */}
            <div style={{ position: 'relative' }}>
              <select
                value={docStatusFilter}
                onChange={(e) => setDocStatusFilter(e.target.value)}
                style={{ appearance: 'none', background: 'var(--background)', border: '1px solid var(--border)', padding: '0.45rem 2rem 0.45rem 0.75rem', borderRadius: '6px', color: 'var(--text-main)', fontSize: '0.85rem', outline: 'none', cursor: 'pointer' }}
              >
                <option value="all">Active Documents</option>
                <option value="Draft">Drafts</option>
                <option value="Needs Approval">Needs Approval</option>
                <option value="Published">Published</option>
              </select>
              <span style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none', display: 'flex', alignItems: 'center' }}>
                <ChevronDown size={14} />
              </span>
            </div>

            {/* Dropdown 2: Sorting option */}
            <div style={{ position: 'relative' }}>
              <select
                value={docSortBy}
                onChange={(e) => setDocSortBy(e.target.value)}
                style={{ appearance: 'none', background: 'var(--background)', border: '1px solid var(--border)', padding: '0.45rem 2rem 0.45rem 0.75rem', borderRadius: '6px', color: 'var(--text-main)', fontSize: '0.85rem', outline: 'none', cursor: 'pointer' }}
              >
                <option value="updated">Recently Updated</option>
                <option value="alphabetical">Alphabetical (A-Z)</option>
                <option value="completion">Completion Rate</option>
              </select>
              <span style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none', display: 'flex', alignItems: 'center' }}>
                <ChevronDown size={14} />
              </span>
            </div>
          </div>

          {/* Layout Controls (Grid vs List toggling) */}
          <div style={{ display: 'flex', gap: '0.25rem', border: '1px solid var(--border)', padding: '0.2rem', borderRadius: '6px', background: 'var(--background)' }}>
            <button 
              onClick={() => setDocLayout('grid')}
              style={{ background: docLayout === 'grid' ? 'var(--surface)' : 'transparent', border: 'none', color: docLayout === 'grid' ? 'var(--primary)' : 'var(--text-muted)', padding: '0.3rem', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              title="Grid Layout"
            >
              <LayoutGrid size={16} />
            </button>
            <button 
              onClick={() => setDocLayout('list')}
              style={{ background: docLayout === 'list' ? 'var(--surface)' : 'transparent', border: 'none', color: docLayout === 'list' ? 'var(--primary)' : 'var(--text-muted)', padding: '0.3rem', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              title="List Layout"
            >
              <ListIcon size={16} />
            </button>
          </div>
        </div>



        {/* ── MAIN DOCUMENTS CONTENT ── */}
        {filteredDocs.length === 0 ? (
          <div style={{ ...ds.card, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem', textAlign: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '3rem' }}>📁</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>No Documents Found</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '400px', margin: 0 }}>
              No project documents matched the current search filters in this workspace.
            </p>
          </div>
        ) : docLayout === 'grid' ? (
          /* Grid View Layout */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {filteredDocs.map((doc, index) => {
              const typeBadge = getDocTypeBadge(doc.docType);
              const statusBadge = getStatusBadge(doc.status);
              return (
                <div 
                  key={`${doc.id}-${index}`}
                  onClick={() => router.push(`/?tab=builder&id=${doc.id}`)}
                  style={{ ...ds.card, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '0.75rem', position: 'relative', transition: 'all 0.15s ease' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '1.5rem' }}>📄</span>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px', background: typeBadge.bg, color: typeBadge.color }}>
                      {typeBadge.text}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', margin: 0, lineBreak: 'anywhere' }}>{doc.title || 'Untitled'}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Owner: {doc.owner || 'Unknown'}</span>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${doc.completionPercentage || 0}%`, height: '100%', background: 'var(--primary)', borderRadius: '3px' }} />
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{doc.completionPercentage || 0}%</span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem', borderTop: '1px solid var(--border)', paddingTop: '0.5rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    <span style={{ fontWeight: 700, color: statusBadge.color }}>{doc.status}</span>
                    <span>{new Date(doc.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View Layout */
          <div style={{ ...ds.card, padding: 0, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ background: 'rgba(0,0,0,0.15)', borderBottom: '1px solid var(--border)' }}>
                <tr>
                  <th style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', width: '40%' }}>Document Title</th>
                  <th style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Type</th>
                  <th style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Completion</th>
                  <th style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocs.map((doc, index) => {
                  try {
                    const typeBadge = getDocTypeBadge(doc?.docType || 'custom');
                    const statusBadge = getStatusBadge(doc?.status || 'Draft');
                    
                    let formattedDate = 'Unknown';
                    try {
                      if (doc?.updatedAt) {
                        const parsedDate = new Date(doc.updatedAt);
                        if (!isNaN(parsedDate.getTime())) {
                          formattedDate = parsedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
                        }
                      }
                    } catch (dateErr) {
                      console.error('Error formatting date', dateErr);
                    }

                    return (
                      <tr 
                        key={`${doc?.id || index}-${index}`}
                        onClick={() => router.push(`/?tab=builder&id=${doc?.id}`)}
                        style={{ 
                          borderBottom: '1px solid var(--border)', 
                          cursor: 'pointer',
                          transition: 'background-color 0.15s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--hover)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '1rem 1.25rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <FileText size={18} color="var(--primary)" />
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span>{doc?.title || 'Untitled Document'}</span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>Owner: {doc?.owner || 'Unknown'}</span>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <span style={{ 
                            fontSize: '0.7rem', 
                            fontWeight: 700, 
                            padding: '0.2rem 0.5rem', 
                            borderRadius: '4px', 
                            background: typeBadge.bg, 
                            color: typeBadge.color 
                          }}>
                            {typeBadge.text}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <span style={{ 
                            fontSize: '0.7rem', 
                            fontWeight: 700, 
                            padding: '0.2rem 0.5rem', 
                            borderRadius: '4px', 
                            background: statusBadge.bg, 
                            color: statusBadge.color 
                          }}>
                            {doc?.status || 'Draft'}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 1.25rem', verticalAlign: 'middle' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '100px' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-main)', width: '30px' }}>{doc?.completionPercentage || 0}%</span>
                            <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                              <div style={{ width: `${doc?.completionPercentage || 0}%`, height: '100%', background: 'var(--primary)', borderRadius: '3px' }} />
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '1rem 1.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {formattedDate}
                        </td>
                      </tr>
                    );
                  } catch (rowErr: any) {
                    console.error('Error rendering row', rowErr);
                    return (
                      <tr key={`err-${index}`} style={{ borderBottom: '1px solid var(--border)', background: 'rgba(239, 68, 68, 0.1)' }}>
                        <td colSpan={5} style={{ padding: '1rem', color: 'var(--danger)', fontSize: '0.85rem' }}>
                          Error rendering row: {rowErr?.message || 'Unknown error'}
                        </td>
                      </tr>
                    );
                  }
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const renderCenterContent = () => {
    if (activeTab === 'team') return renderTeamTab();
    if (activeTab === 'all_documents') return renderRequirementsTab();
    if (activeTab === 'stakeholders') return <StakeholderGrid />;

    switch (activeWorkspace.type) {
      case 'qa':
        return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>QA Mock Module: {activeTab}</div>;
      case 'devops':
        return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>DevOps Mock Module: {activeTab}</div>;
      case 'business_analysis':
      default:
        if (activeTab === 'dashboard') {
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Executive Summary</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>Business Visibility • Real-time Intelligence</p>
              </div>
              {renderMetricGrid([
                { title: 'Total Requirements', value: workspaceDocs.length > 0 ? workspaceDocs.length : '124', color: '#2563EB', icon: '📋' },
                { title: 'Approved', value: workspaceDocs.filter(d => d.status === 'Published').length > 0 ? workspaceDocs.filter(d => d.status === 'Published').length : '89', color: '#16A34A', icon: '✅' },
                { title: 'Pending Reviews', value: workspaceDocs.filter(d => d.status === 'Needs Approval' || d.status === 'In Review').length > 0 ? workspaceDocs.filter(d => d.status === 'Needs Approval' || d.status === 'In Review').length : '12', color: '#F59E0B', icon: '⏳' },
                { title: 'Business Risks', value: '4', color: '#DC2626', icon: '⚠️' },
              ])}
              <div style={ds.card}>
                <h3 style={ds.title}>📈 Project Health Analytics</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    { label: 'Requirement Completion', pct: avgCompletion || 88, color: '#2563EB' },
                    { label: 'Stakeholder Approval', pct: 72, color: '#16A34A' },
                    { label: 'Workflow Mapping', pct: 64, color: '#F59E0B' },
                  ].map((h, i) => (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                        <span>{h.label}</span>
                        <span style={{ color: h.color }}>{h.pct}%</span>
                      </div>
                      <div style={{ height: '8px', background: 'var(--background)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${h.pct}%`, height: '100%', background: h.color, borderRadius: '4px' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        } else if (activeTab === 'scope') {
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>🎯 Scope Management</h2>
              <div style={ds.card}>
                <h3 style={ds.title}>In-Scope Features</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {['User Authentication', 'Role-Based Access Control', 'Dashboard Analytics', 'PDF Export'].map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                      <span style={{ color: '#10b981' }}>✔</span> {f}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ ...ds.card, borderLeft: '4px solid #ef4444' }}>
                <h3 style={ds.title}>Out of Scope</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {['Mobile App Development', 'Legacy Data Migration', 'Third-party Integrations'].map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <span style={{ color: '#ef4444' }}>❌</span> <span style={{ textDecoration: 'line-through' }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        }
        return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Mock Module: {activeTab}</div>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', background: 'var(--background)' }} className="animate-fade-in">
      <DashboardHeader />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* LEFT SIDEBAR */}
        <div style={{ width: '240px', borderRight: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', flexDirection: 'column', flexShrink: 0, overflowY: 'auto' }}>
          <div style={{ padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {getSidebarTabs().map(tab => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)} 
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.85rem', 
                  textAlign: 'left', fontSize: '0.85rem', fontWeight: activeTab === tab.id ? 700 : 500, 
                  color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-main)', 
                  background: activeTab === tab.id ? 'var(--primary-light)' : 'transparent', 
                  border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.15s',
                  borderLeft: activeTab === tab.id ? '3px solid var(--primary)' : '3px solid transparent'
                }}>
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* CENTER CONTENT */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
          {renderCenterContent()}
        </div>
      </div>
    </div>
  );
}
