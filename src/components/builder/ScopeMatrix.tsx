import React, { useState } from 'react';
import { Target, Search, Plus, Filter, AlertTriangle, ArrowRight, DollarSign, Clock } from 'lucide-react';

interface ScopeItem {
  id: string;
  title: string;
  inScope: boolean;
  module: string;
  effort: string;
  impact: 'High' | 'Medium' | 'Low';
}

export default function ScopeMatrix() {
  const [items, setItems] = useState<ScopeItem[]>([
    { id: 'SCP-001', title: 'User Authentication (SSO)', inScope: true, module: 'Security', effort: '2 Weeks', impact: 'High' },
    { id: 'SCP-002', title: 'Legacy Data Migration', inScope: false, module: 'Database', effort: '4 Weeks', impact: 'High' },
    { id: 'SCP-003', title: 'Real-time Notifications', inScope: true, module: 'Core', effort: '1 Week', impact: 'Medium' },
    { id: 'SCP-004', title: 'Offline Mobile Support', inScope: false, module: 'Mobile', effort: '3 Weeks', impact: 'Medium' },
    { id: 'SCP-005', title: 'Export to PDF/Docx', inScope: true, module: 'Reporting', effort: '3 Days', impact: 'Low' },
  ]);

  const inScopeItems = items.filter(i => i.inScope);
  const outScopeItems = items.filter(i => !i.inScope);

  const getImpactColor = (impact: string) => {
    switch(impact) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#10b981';
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
              <Target size={20} color="#3b82f6" /> Scope Management
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>Clearly define what is included and excluded from the project release.</p>
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#3b82f6', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
            <Plus size={14} /> Add Scope Item
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', flex: 1 }}>
          {/* In Scope Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '0.75rem 1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#10b981', margin: 0 }}>✅ IN SCOPE</h3>
              <span style={{ background: '#10b981', color: 'white', padding: '0.1rem 0.5rem', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 700 }}>{inScopeItems.length}</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {inScopeItems.map(item => (
                <div key={item.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '1rem', cursor: 'grab' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>{item.title}</div>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)' }}>{item.id}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', color: 'var(--text-muted)' }}>{item.module}</span>
                    <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', background: `${getImpactColor(item.impact)}15`, color: getImpactColor(item.impact), borderRadius: '4px', fontWeight: 600 }}>{item.impact} Impact</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Out of Scope Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '0.75rem 1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ef4444', margin: 0 }}>❌ OUT OF SCOPE</h3>
              <span style={{ background: '#ef4444', color: 'white', padding: '0.1rem 0.5rem', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 700 }}>{outScopeItems.length}</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {outScopeItems.map(item => (
                <div key={item.id} style={{ background: 'var(--surface)', border: '1px dashed var(--border)', opacity: 0.8, borderRadius: '8px', padding: '1rem', cursor: 'grab' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textDecoration: 'line-through' }}>{item.title}</div>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)' }}>{item.id}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', color: 'var(--text-muted)' }}>{item.module}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}><AlertTriangle size={12} /> Saved {item.effort}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL (COST/EFFORT CALCULATOR) ── */}
      <div style={{ width: '280px', borderLeft: '1px solid var(--border)', background: 'var(--background)', display: 'flex', flexDirection: 'column', flexShrink: 0, padding: '1.5rem', gap: '1.5rem', overflowY: 'auto' }}>
        <div>
          <h4 style={{ fontSize: '0.7rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <DollarSign size={14} /> Cost & Effort Impact
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '1rem', borderRadius: '8px', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.2rem' }}>Total Estimated Effort</span>
              <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                4.5 <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Weeks</span>
              </span>
            </div>
            
            <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '1rem', borderRadius: '8px', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, marginBottom: '0.2rem' }}>Effort Saved (Out of Scope)</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                7.0 <span style={{ fontSize: '0.8rem' }}>Weeks</span>
              </span>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                Moving "Legacy Migration" out of scope saved 4 weeks of dev effort.
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>AI Recommendations</h4>
          <div style={{ padding: '0.75rem', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f59e0b', marginBottom: '0.25rem' }}>Scope Creep Risk</div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-main)', margin: 0, lineHeight: 1.4 }}>
              "Real-time Notifications" may exceed the 1 week estimate due to websocket infrastructure missing. Consider moving to Phase 2.
            </p>
            <button style={{ marginTop: '0.5rem', width: '100%', padding: '0.4rem', fontSize: '0.7rem', background: '#f59e0b', color: 'black', fontWeight: 700, border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Move to Out of Scope
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
