"use client";

import React from 'react';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { Activity, Target, ShieldCheck, FileText, CheckSquare, BarChart2 } from 'lucide-react';

export default function WorkspaceDashboardRouter() {
  const { workspaces, activeWorkspaceId } = useWorkspaceStore();
  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId);

  if (!activeWorkspace) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No workspace selected.</div>;
  }

  // Common Header for all dashboards
  const DashboardHeader = () => (
    <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `rgba(${activeWorkspace.theme.color ? parseInt(activeWorkspace.theme.color.slice(1,3), 16) + ',' + parseInt(activeWorkspace.theme.color.slice(3,5), 16) + ',' + parseInt(activeWorkspace.theme.color.slice(5,7), 16) : '59, 130, 246'}, 0.2)`, color: activeWorkspace.theme.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
        {activeWorkspace.theme.icon}
      </div>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>{activeWorkspace.name} Dashboard</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>{activeWorkspace.description}</p>
      </div>
    </div>
  );

  const MetricCard = ({ title, value, icon, trend, color }: any) => (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{title}</span>
        <div style={{ color: color, background: `rgba(0,0,0,0.1)`, padding: '0.4rem', borderRadius: '8px' }}>
          {icon}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
        <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>{value}</span>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: trend.startsWith('+') ? '#10b981' : '#f59e0b' }}>{trend}</span>
      </div>
    </div>
  );

  const renderDashboard = () => {
    switch (activeWorkspace.type) {
      case 'qa':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            <MetricCard title="Tests Passed" value="1,204" icon={<CheckSquare size={18} />} trend="+12%" color="#10b981" />
            <MetricCard title="Coverage" value="84%" icon={<BarChart2 size={18} />} trend="+2%" color="#3b82f6" />
            <MetricCard title="Active Defects" value="23" icon={<Target size={18} />} trend="-5" color="#ef4444" />
            <MetricCard title="Blocked Cases" value="4" icon={<ShieldCheck size={18} />} trend="-1" color="#f59e0b" />
          </div>
        );
      case 'devops':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            <MetricCard title="Deployments" value="48" icon={<Activity size={18} />} trend="+8" color="#3b82f6" />
            <MetricCard title="Incidents" value="2" icon={<Target size={18} />} trend="-1" color="#ef4444" />
            <MetricCard title="Downtime" value="0.01%" icon={<ShieldCheck size={18} />} trend="-0.02%" color="#10b981" />
            <MetricCard title="Build Success" value="99.2%" icon={<CheckSquare size={18} />} trend="+0.5%" color="#10b981" />
          </div>
        );
      case 'executive':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            <MetricCard title="Portfolio Health" value="92/100" icon={<Activity size={18} />} trend="+4" color="#10b981" />
            <MetricCard title="Budget Variance" value="-$12k" icon={<Target size={18} />} trend="On Track" color="#3b82f6" />
            <MetricCard title="Delivery Rate" value="95%" icon={<CheckSquare size={18} />} trend="+2%" color="#10b981" />
            <MetricCard title="Risks High" value="3" icon={<ShieldCheck size={18} />} trend="-2" color="#f59e0b" />
          </div>
        );
      case 'documentation':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            <MetricCard title="KB Articles" value="450" icon={<FileText size={18} />} trend="+24" color="#3b82f6" />
            <MetricCard title="Views" value="12k" icon={<Activity size={18} />} trend="+1.2k" color="#10b981" />
            <MetricCard title="Outdated SOPs" value="5" icon={<ShieldCheck size={18} />} trend="-12" color="#f59e0b" />
            <MetricCard title="Draft Policies" value="8" icon={<CheckSquare size={18} />} trend="+2" color="#6366f1" />
          </div>
        );
      case 'business_analysis':
      default:
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            <MetricCard title="Requirements" value="142" icon={<FileText size={18} />} trend="+14" color="#3b82f6" />
            <MetricCard title="Risks Logged" value="12" icon={<ShieldCheck size={18} />} trend="-3" color="#f59e0b" />
            <MetricCard title="Pending Approvals" value="8" icon={<CheckSquare size={18} />} trend="-5" color="#ef4444" />
            <MetricCard title="Completion" value="78%" icon={<Activity size={18} />} trend="+12%" color="#10b981" />
          </div>
        );
    }
  };

  return (
    <div className="workspace-dashboard animate-fade-in" style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <DashboardHeader />
      {renderDashboard()}

      <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div style={{ background: 'var(--surface)', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 1rem 0' }}>Recent Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {activeWorkspace.activities.slice(0, 5).map(act => (
              <div key={act.id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', marginTop: '0.4rem' }} />
                <div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}><strong>{act.user}</strong> {act.action.toLowerCase()}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{new Date(act.timestamp).toLocaleString()}</div>
                  {act.details && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{act.details}</div>}
                </div>
              </div>
            ))}
            {activeWorkspace.activities.length === 0 && <div style={{ color: 'var(--text-muted)' }}>No recent activity.</div>}
          </div>
        </div>
        
        <div style={{ background: 'var(--surface)', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 1rem 0' }}>Workspace Members ({activeWorkspace.members.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {activeWorkspace.members.map(m => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', borderRadius: '8px', background: 'var(--background)' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 'bold' }}>
                  {m.name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{m.name}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{m.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
