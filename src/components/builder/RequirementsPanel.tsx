import React, { useState } from 'react';
import { useBuilderStore, Requirement } from '@/store/useBuilderStore';
import { Plus, Search, Filter, MoreVertical, Edit3, Trash2, Copy, BarChart2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function RequirementsPanel() {
  const { requirements, addRequirement } = useBuilderStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRequirements = requirements.filter(req => 
    req.title.toLowerCase().includes(searchQuery.toLowerCase()) || req.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPriorityColor = (prio: string) => {
    switch(prio) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#10b981';
      default: return '#94a3b8';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Approved': return '#10b981';
      case 'Issue': return '#ef4444';
      case 'Draft': return '#3b82f6';
      case 'Rejected': return '#64748b';
      default: return '#94a3b8';
    }
  };

  // Right Panel Analytics
  const total = requirements.length;
  const approved = requirements.filter(r => r.status === 'Approved').length;
  const draft = requirements.filter(r => r.status === 'Draft').length;
  const issues = requirements.filter(r => r.status === 'Issue').length;

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden', height: 'calc(100vh - 64px)' }}>
      {/* ── CENTER WORKSPACE ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>Requirements</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>Manage product specifications and scope definitions.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
              <input 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search requirements..." 
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '0.4rem 1rem 0.4rem 2rem', borderRadius: '6px', color: 'var(--text-main)', fontSize: '0.85rem' }}
              />
            </div>
            <button style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--surface)', color: 'var(--text-main)', border: '1px solid var(--border)', padding: '0.4rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer' }}><Filter size={14} /> Filter</button>
          </div>
        </div>

        {/* Requirements Table */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--border)' }}>
              <tr>
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>ID</th>
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Title</th>
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Priority</th>
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Owner</th>
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Completion</th>
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredRequirements.map(req => (
                <tr key={req.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>{req.id}</td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>{req.title}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: getPriorityColor(req.priority), background: `${getPriorityColor(req.priority)}15`, padding: '0.15rem 0.4rem', borderRadius: '4px' }}>{req.priority}</span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem', fontWeight: 700, color: getStatusColor(req.status) }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: getStatusColor(req.status) }} /> {req.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem' }}>{req.owner.charAt(0)}</div>
                      {req.owner}
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${req.completion}%`, height: '100%', background: req.completion === 100 ? '#10b981' : '#3b82f6' }} />
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{req.completion}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'right', color: 'var(--text-muted)' }}>
                    <MoreVertical size={16} style={{ cursor: 'pointer' }} />
                  </td>
                </tr>
              ))}
              {filteredRequirements.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>No requirements found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── RIGHT PANEL (ANALYTICS) ── */}
      <div style={{ width: '280px', borderLeft: '1px solid var(--border)', background: 'var(--background)', display: 'flex', flexDirection: 'column', flexShrink: 0, padding: '1.5rem', gap: '1.5rem', overflowY: 'auto' }}>
        <div>
          <h4 style={{ fontSize: '0.7rem', fontWeight: 800, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <BarChart2 size={14} /> Requirement Analytics
          </h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '0.75rem', borderRadius: '8px', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>{total}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total</span>
            </div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '0.75rem', borderRadius: '8px', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981' }}>{approved}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Approved</span>
            </div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '0.75rem', borderRadius: '8px', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#3b82f6' }}>{draft}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Draft</span>
            </div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '0.75rem', borderRadius: '8px', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ef4444' }}>{issues}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Issues</span>
            </div>
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>AI Quality Checks</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {issues > 0 ? (
              <div style={{ padding: '0.75rem', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <AlertCircle size={14} color="#ef4444" style={{ marginTop: '0.1rem' }} />
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ef4444' }}>{issues} Critical Issues</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-main)', marginTop: '0.2rem' }}>Requirement REQ-002 is missing acceptance criteria.</div>
                </div>
              </div>
            ) : (
              <div style={{ padding: '0.75rem', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <CheckCircle2 size={14} color="#10b981" style={{ marginTop: '0.1rem' }} />
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981' }}>All Clear</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-main)', marginTop: '0.2rem' }}>No AI-detected quality issues in your requirements.</div>
                </div>
              </div>
            )}
            
            <button style={{ width: '100%', padding: '0.5rem', fontSize: '0.75rem', fontWeight: 600, background: 'rgba(168, 85, 247, 0.1)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.2)', borderRadius: '6px', cursor: 'pointer' }}>
              Detect Missing Requirements
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
