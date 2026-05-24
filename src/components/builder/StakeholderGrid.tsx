import React, { useState } from 'react';
import { Users, Search, Plus, Mail } from 'lucide-react';

export default function StakeholderGrid() {
  const [stakeholders, setStakeholders] = useState([
    { id: '1', name: 'Sarah Jenkins', role: 'Product Sponsor', dept: 'Executive', power: 'High', interest: 'High' },
    { id: '2', name: 'Mike Thompson', role: 'Lead Architect', dept: 'Engineering', power: 'Medium', interest: 'High' },
    { id: '3', name: 'Amanda Clarke', role: 'Compliance Officer', dept: 'Legal', power: 'High', interest: 'Low' },
    { id: '4', name: 'David Lee', role: 'End User Rep', dept: 'Operations', power: 'Low', interest: 'High' },
  ]);

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden', height: 'calc(100vh - 64px)' }}>
      {/* ── CENTER WORKSPACE ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={20} color="#8b5cf6" /> Stakeholder Registry
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>Manage roles, responsibilities, and communication plans.</p>
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#8b5cf6', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
            <Plus size={14} /> Add Stakeholder
          </button>
        </div>

        {/* Stakeholder Table */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--border)' }}>
              <tr>
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Name</th>
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Role</th>
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Department</th>
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Power</th>
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Interest</th>
              </tr>
            </thead>
            <tbody>
              {stakeholders.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>{s.name.charAt(0)}</div>
                      {s.name}
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: 'var(--text-main)' }}>{s.role}</td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.dept}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: s.power === 'High' ? '#ef4444' : s.power === 'Medium' ? '#f59e0b' : '#10b981', background: s.power === 'High' ? 'rgba(239, 68, 68, 0.1)' : s.power === 'Medium' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>{s.power}</span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: s.interest === 'High' ? '#ef4444' : s.interest === 'Medium' ? '#f59e0b' : '#10b981', background: s.interest === 'High' ? 'rgba(239, 68, 68, 0.1)' : s.interest === 'Medium' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>{s.interest}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── RIGHT PANEL (POWER/INTEREST GRID) ── */}
      <div style={{ width: '280px', borderLeft: '1px solid var(--border)', background: 'var(--background)', display: 'flex', flexDirection: 'column', flexShrink: 0, padding: '1.5rem', gap: '1.5rem', overflowY: 'auto' }}>
        <div>
          <h4 style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Power / Interest Grid</h4>
          
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '1rem', borderRadius: '8px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '4px', height: '180px' }}>
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: '#ef4444', textAlign: 'center', padding: '0.5rem', borderRadius: '4px' }}>Keep Satisfied (1)</div>
              <div style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: '#8b5cf6', textAlign: 'center', padding: '0.5rem', borderRadius: '4px' }}>Manage Closely (2)</div>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: '#10b981', textAlign: 'center', padding: '0.5rem', borderRadius: '4px' }}>Monitor (0)</div>
              <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: '#f59e0b', textAlign: 'center', padding: '0.5rem', borderRadius: '4px' }}>Keep Informed (1)</div>
            </div>
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Communication Plan</h4>
          <button style={{ width: '100%', padding: '0.5rem', fontSize: '0.75rem', fontWeight: 600, background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
            <Mail size={14} /> Send Project Update
          </button>
        </div>
      </div>
    </div>
  );
}
