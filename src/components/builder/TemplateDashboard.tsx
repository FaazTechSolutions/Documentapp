"use client";

import React from 'react';
import { useBuilderStore } from '@/store/useBuilderStore';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { FileText, CheckSquare, Activity, ShieldCheck, Target, GitMerge, FileCheck } from 'lucide-react';

export default function TemplateDashboard() {
  const { activeWorkspaceId } = useWorkspaceStore();
  const { setActiveView } = useBuilderStore();

  const MetricCard = ({ title, value, icon, trend, color, subtitle }: any) => (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{title}</span>
        <div style={{ color: color, background: `rgba(0,0,0,0.1)`, padding: '0.4rem', borderRadius: '8px' }}>
          {icon}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
        <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>{value}</span>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: trend.startsWith('+') ? '#10b981' : trend.startsWith('-') ? '#ef4444' : '#f59e0b' }}>{trend}</span>
      </div>
      {subtitle && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '-0.5rem' }}>{subtitle}</div>}
    </div>
  );

  return (
    <div className="template-dashboard animate-fade-in" style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Template Overview Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
            <FileText size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Template Intelligence</h1>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.25rem 0 0 0', display: 'flex', gap: '1rem' }}>
              <span><strong>Category:</strong> Business Requirements</span>
              <span><strong>Version:</strong> v2.4.1</span>
              <span><strong>Updated:</strong> Today, 10:42 AM</span>
              <span style={{ color: '#10b981', fontWeight: 600 }}>● Active Status</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setActiveView('canvas')}
          className="btn btn-primary" 
          style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', fontWeight: 600, display: 'flex', gap: '0.5rem', alignItems: 'center' }}
        >
          <GitMerge size={16} /> Open in Canvas
        </button>
      </div>

      {/* Analytics Row */}
      <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <Activity size={18} color="#3b82f6" /> Template Analytics
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <MetricCard title="Documents Generated" value="142" icon={<FileCheck size={18} />} trend="+14 this week" color="#10b981" />
        <MetricCard title="Active Usage" value="89%" icon={<Activity size={18} />} trend="+2.4%" color="#3b82f6" subtitle="Across 4 workspaces" />
        <MetricCard title="Clone Count" value="28" icon={<GitMerge size={18} />} trend="+3" color="#8b5cf6" />
        <MetricCard title="Modification Rate" value="12%" icon={<Target size={18} />} trend="-1.5%" color="#f59e0b" subtitle="Low variance is good" />
        <MetricCard title="AI Usage Score" value="94/100" icon={<ShieldCheck size={18} />} trend="Optimal" color="#10b981" />
      </div>

      {/* 2-Column Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
        
        {/* LEFT COLUMN: Health & Canvas Relationship */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Template Health */}
          <div style={{ background: 'var(--surface)', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 1rem 0', display: 'flex', justifyContent: 'space-between' }}>
              Template Health <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f59e0b', padding: '0.2rem 0.5rem', background: 'rgba(245,158,11,0.1)', borderRadius: '6px' }}>Validation Score: 88%</span>
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--background)', borderRadius: '8px', borderLeft: '3px solid #ef4444' }}>
                <div><strong style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>Missing Sections</strong><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Security Requirements block absent</div></div>
                <button style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: '4px', padding: '0.2rem 0.5rem', fontSize: '0.75rem', color: 'var(--text-main)', cursor: 'pointer' }}>Fix</button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--background)', borderRadius: '8px', borderLeft: '3px solid #f59e0b' }}>
                <div><strong style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>Incomplete Variables</strong><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{"{ProjectSponsor}"} not bound</div></div>
                <button style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: '4px', padding: '0.2rem 0.5rem', fontSize: '0.75rem', color: 'var(--text-main)', cursor: 'pointer' }}>Fix</button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--background)', borderRadius: '8px', borderLeft: '3px solid #10b981' }}>
                <div><strong style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>Bindings & Logic</strong><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>All conditional logic passed</div></div>
                <CheckSquare size={16} color="#10b981" />
              </div>
            </div>
          </div>

          {/* Canvas Structure Overview */}
          <div style={{ background: 'var(--surface)', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 1rem 0' }}>Canvas Structure Overview</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Map of document sections and dynamic bindings. Edit directly in Canvas.</p>
            
            <div style={{ borderLeft: '2px solid var(--border)', marginLeft: '0.5rem', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-22px', top: '4px', width: '12px', height: '12px', borderRadius: '50%', background: '#3b82f6', border: '2px solid var(--surface)' }} />
                <h4 style={{ fontSize: '0.9rem', margin: '0 0 0.25rem 0' }}>1. Executive Summary</h4>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '1rem' }}><span>2 Blocks</span><span>1 Variable</span></div>
              </div>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-22px', top: '4px', width: '12px', height: '12px', borderRadius: '50%', background: '#8b5cf6', border: '2px solid var(--surface)' }} />
                <h4 style={{ fontSize: '0.9rem', margin: '0 0 0.25rem 0' }}>2. Business Scope (AI Bound)</h4>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '1rem' }}><span>4 Blocks</span><span style={{ color: '#8b5cf6', fontWeight: 600 }}>✨ AI Generative Module</span></div>
              </div>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-22px', top: '4px', width: '12px', height: '12px', borderRadius: '50%', background: '#10b981', border: '2px solid var(--surface)' }} />
                <h4 style={{ fontSize: '0.9rem', margin: '0 0 0.25rem 0' }}>3. Functional Requirements</h4>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '1rem' }}><span>Data Table</span><span>Connected to Workspace DB</span></div>
              </div>
            </div>
            
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => setActiveView('canvas')} style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.3)', padding: '0.4rem 1rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>Edit Structure in Canvas</button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Dependencies & Activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ background: 'var(--surface)', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 1rem 0' }}>Template Dependencies</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Connected Workspaces</span>
                <span style={{ fontWeight: 600 }}>4</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Assigned Modules</span>
                <span style={{ fontWeight: 600 }}>m-req, m-scope</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Referenced Variables</span>
                <span style={{ fontWeight: 600 }}>12 Active</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Linked Documents</span>
                <span style={{ fontWeight: 600, color: '#3b82f6' }}>142 Docs</span>
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--surface)', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 1rem 0' }}>Template Activity Feed</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { user: 'Siddiq Admin', action: 'Modified field bindings', time: '2h ago', type: 'edit' },
                { user: 'AI Copilot', action: 'Generated section outline', time: 'Yesterday', type: 'ai' },
                { user: 'Fathima Zahra', action: 'Approved version 2.4.1', time: '2 days ago', type: 'approve' },
                { user: 'System', action: 'Deployed to Workspace Alpha', time: '3 days ago', type: 'system' }
              ].map((act, i) => (
                <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ 
                    width: '8px', height: '8px', borderRadius: '50%', marginTop: '0.4rem',
                    background: act.type === 'ai' ? '#8b5cf6' : act.type === 'approve' ? '#10b981' : act.type === 'edit' ? '#3b82f6' : 'var(--border)' 
                  }} />
                  <div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}><strong>{act.user}</strong> {act.action}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{act.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
