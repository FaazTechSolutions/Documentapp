import React, { useState } from 'react';
import { PenTool, CheckCircle2, XCircle, Search, Clock, FileText } from 'lucide-react';
import { useBuilderStore } from '@/store/useBuilderStore';

export default function ApprovalCenter() {
  const { approvals } = useBuilderStore();
  const [searchQuery, setSearchQuery] = useState('');

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Approved': return '#10b981';
      case 'Pending': return '#f59e0b';
      case 'Rejected': return '#ef4444';
      default: return '#94a3b8';
    }
  };

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden', height: 'calc(100vh - 64px)' }}>
      {/* ── CENTER WORKSPACE ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PenTool size={20} color="#3b82f6" /> Approval Center
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>Manage digital sign-offs, document approvals, and stakeholder consensus.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
              <input 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search sign-offs..." 
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '0.4rem 1rem 0.4rem 2rem', borderRadius: '6px', color: 'var(--text-main)', fontSize: '0.85rem' }}
              />
            </div>
          </div>
        </div>

        {/* Approval List */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--border)' }}>
              <tr>
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Section / Item</th>
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Approver</th>
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Role</th>
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Date</th>
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {approvals.map(app => (
                <tr key={app.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <FileText size={14} color="#3b82f6" /> {app.section}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem' }}>{app.approver.charAt(0)}</div>
                      {app.approver}
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{app.role}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: getStatusColor(app.status), background: `${getStatusColor(app.status)}15`, padding: '0.15rem 0.4rem', borderRadius: '4px' }}>{app.status}</span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{app.date}</td>
                  <td style={{ padding: '0.75rem 1rem', display: 'flex', gap: '0.4rem' }}>
                    {app.status === 'Pending' && (
                      <>
                        <button style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '0.2rem 0.4rem', borderRadius: '4px', cursor: 'pointer' }}><CheckCircle2 size={14} /></button>
                        <button style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '0.2rem 0.4rem', borderRadius: '4px', cursor: 'pointer' }}><XCircle size={14} /></button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── RIGHT PANEL (AUDIT LOG & COMMENTS) ── */}
      <div style={{ width: '280px', borderLeft: '1px solid var(--border)', background: 'var(--background)', display: 'flex', flexDirection: 'column', flexShrink: 0, padding: '1.5rem', gap: '1.5rem', overflowY: 'auto' }}>
        <div>
          <h4 style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Clock size={14} /> Audit Trail
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
            <div style={{ position: 'absolute', left: '11px', top: '10px', bottom: '10px', width: '2px', background: 'var(--border)' }} />
            
            <div style={{ display: 'flex', gap: '0.75rem', position: 'relative', zIndex: 1 }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}><CheckCircle2 size={12} /></div>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)' }}>Sarah J. approved System Architecture</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Today at 10:45 AM</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '0.75rem', position: 'relative', zIndex: 1 }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}><Clock size={12} /></div>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)' }}>Approval request sent to Mike T.</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Yesterday at 4:30 PM</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '0.75rem', position: 'relative', zIndex: 1 }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}><PenTool size={12} /></div>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)' }}>Scope Section finalized by Admin</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>May 20 at 2:15 PM</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
