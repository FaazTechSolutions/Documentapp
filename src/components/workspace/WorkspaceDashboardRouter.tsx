"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { useDocumentStore } from '@/store/useDocumentStore';
import { useTemplateStore } from '@/store/useTemplateStore';
import { Activity, Target, ShieldCheck, FileText, CheckSquare, BarChart2, LayoutDashboard, Target as ScopeIcon, Users, GitBranch, Settings, AlertTriangle, PlayCircle, Zap, Shield, BookOpen, Layers } from 'lucide-react';

export default function WorkspaceDashboardRouter() {
  const router = useRouter();
  const { workspaces, activeWorkspaceId } = useWorkspaceStore();
  const { documents } = useDocumentStore();
  const { templates, syncFromStorage } = useTemplateStore();
  
  const [activeTab, setActiveTab] = useState('dashboard');

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

  const workspaceDocs = documents.filter(d => !d.isDeleted && String(d.workspaceId) === String(activeWorkspaceId));
  const totalDocsCount = workspaceDocs.length;
  const draftDocsCount = workspaceDocs.filter(d => d.status === 'Draft').length;
  const pendingDocsCount = workspaceDocs.filter(d => d.status === 'Needs Approval').length;
  const publishedDocsCount = workspaceDocs.filter(d => d.status === 'Published').length;

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

  const renderCenterContent = () => {
    if (activeTab === 'team') return renderTeamTab();

    switch (activeWorkspace.type) {
      case 'qa':
        if (activeTab === 'dashboard') {
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>QA Dashboard</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>Test Coverage • Defect Density • Automation Status</p>
              </div>
              {renderMetricGrid([
                { title: 'Test Cases', value: totalDocsCount, color: '#10b981', icon: '📝' },
                { title: 'Active Defects', value: '23', color: '#ef4444', icon: '🐛' },
                { title: 'Automation Coverage', value: '68%', color: '#3b82f6', icon: '🤖' },
                { title: 'Pass Rate', value: '94%', color: '#f59e0b', icon: '✅' },
              ])}
              <div style={ds.card}>
                <h3 style={ds.title}>Recent Test Runs</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {['Smoke Test - Production', 'Regression - Staging', 'API Contract Tests', 'E2E User Flows'].map((run, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', borderBottom: '1px solid var(--border)' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{run}</span>
                      <span style={ds.badge(i === 1 ? '#f59e0b' : '#10b981')}>{i === 1 ? 'Failed (2)' : 'Passed'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        }
        return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>QA Mock Module: {activeTab}</div>;

      case 'devops':
        if (activeTab === 'dashboard') {
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>DevOps Operations</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>Infrastructure Health • CI/CD Velocity</p>
              </div>
              {renderMetricGrid([
                { title: 'Deployments', value: '48', color: '#3b82f6', icon: '🚀' },
                { title: 'Open Incidents', value: '2', color: '#ef4444', icon: '🔥' },
                { title: 'System Uptime', value: '99.9%', color: '#10b981', icon: '⚡' },
                { title: 'Avg Build Time', value: '3.2m', color: '#8b5cf6', icon: '⏱️' },
              ])}
            </div>
          );
        }
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
                { title: 'Total Requirements', value: totalDocsCount > 0 ? totalDocsCount : '124', color: '#2563EB', icon: '📋' },
                { title: 'Approved', value: publishedDocsCount > 0 ? publishedDocsCount : '89', color: '#16A34A', icon: '✅' },
                { title: 'Pending Reviews', value: pendingDocsCount > 0 ? pendingDocsCount : '12', color: '#F59E0B', icon: '⏳' },
                { title: 'Business Risks', value: '4', color: '#DC2626', icon: '⚠️' },
              ])}
              <div style={ds.card}>
                <h3 style={ds.title}>📈 Project Health Analytics</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    { label: 'Requirement Completion', pct: 88, color: '#2563EB' },
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

