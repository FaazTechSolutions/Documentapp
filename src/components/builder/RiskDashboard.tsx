import React, { useState } from 'react';
import { ShieldAlert, Plus, Activity, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useBuilderStore } from '@/store/useBuilderStore';

export default function RiskDashboard() {
  const { risks } = useBuilderStore();

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden', height: 'calc(100vh - 64px)' }}>
      {/* ── CENTER WORKSPACE ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert size={20} color="#ef4444" /> Risk Register
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>Identify, assess, and mitigate project risks.</p>
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#ef4444', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
            <Plus size={14} /> Log Risk
          </button>
        </div>

        {/* Risk Matrix (Heatmap) */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', display: 'flex', gap: '2rem' }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 1rem 0' }}>Risk Heatmap</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.5rem', alignItems: 'center' }}>
              <div style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>PROBABILITY</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
                <div style={{ aspectRatio: '1', background: '#fef08a', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#ca8a04' }}>1</div>
                <div style={{ aspectRatio: '1', background: '#fde047', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#a16207' }}>0</div>
                <div style={{ aspectRatio: '1', background: '#fca5a5', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#991b1b' }}>2</div>
                
                <div style={{ aspectRatio: '1', background: '#bbf7d0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#166534' }}>0</div>
                <div style={{ aspectRatio: '1', background: '#fef08a', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#ca8a04' }}>3</div>
                <div style={{ aspectRatio: '1', background: '#fca5a5', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#991b1b' }}>0</div>
                
                <div style={{ aspectRatio: '1', background: '#86efac', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#14532d' }}>5</div>
                <div style={{ aspectRatio: '1', background: '#bbf7d0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#166534' }}>1</div>
                <div style={{ aspectRatio: '1', background: '#fef08a', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#ca8a04' }}>0</div>
              </div>
              <div />
              <div style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', paddingTop: '0.5rem' }}>IMPACT</div>
            </div>
          </div>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', justifyContent: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ef4444' }}>Critical Risks</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#ef4444' }}>2</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f59e0b' }}>Medium Risks</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#f59e0b' }}>4</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10b981' }}>Low Risks</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#10b981' }}>6</span>
            </div>
          </div>
        </div>

        {/* Risk List */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--border)' }}>
              <tr>
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Risk ID</th>
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Description</th>
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Category</th>
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Severity</th>
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Owner</th>
              </tr>
            </thead>
            <tbody>
              {risks.map(r => (
                <tr key={r.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>{r.id}</td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>{r.description}</td>
                  <td style={{ padding: '0.75rem 1rem' }}><span style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>Technical</span></td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: r.severity === 'Critical' ? '#ef4444' : r.severity === 'Medium' ? '#f59e0b' : '#10b981', background: r.severity === 'Critical' ? 'rgba(239, 68, 68, 0.1)' : r.severity === 'Medium' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>{r.severity}</span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: 'var(--text-main)' }}>{r.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── RIGHT PANEL (AI MITIGATION) ── */}
      <div style={{ width: '280px', borderLeft: '1px solid var(--border)', background: 'var(--background)', display: 'flex', flexDirection: 'column', flexShrink: 0, padding: '1.5rem', gap: '1.5rem', overflowY: 'auto' }}>
        <div>
          <h4 style={{ fontSize: '0.7rem', fontWeight: 800, color: '#c084fc', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ShieldCheck size={14} /> AI Mitigation Plans
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(168, 85, 247, 0.05)', border: '1px solid rgba(168, 85, 247, 0.2)', padding: '1rem', borderRadius: '8px', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.75rem', color: '#c084fc', fontWeight: 700, marginBottom: '0.25rem' }}>RSK-001 Mitigation</span>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-main)', margin: '0 0 0.5rem 0', lineHeight: 1.4 }}>
                For API Rate Limits, implement Redis caching layer and Circuit Breaker pattern.
              </p>
              <button style={{ width: '100%', padding: '0.4rem', fontSize: '0.7rem', background: '#c084fc', color: 'white', fontWeight: 700, border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Apply to Architecture
              </button>
            </div>
            
            <div style={{ background: 'rgba(168, 85, 247, 0.05)', border: '1px solid rgba(168, 85, 247, 0.2)', padding: '1rem', borderRadius: '8px', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.75rem', color: '#c084fc', fontWeight: 700, marginBottom: '0.25rem' }}>RSK-002 Mitigation</span>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-main)', margin: '0 0 0.5rem 0', lineHeight: 1.4 }}>
                Vendor lock-in risk: Ensure database access layers use interfaces/repositories.
              </p>
              <button style={{ width: '100%', padding: '0.4rem', fontSize: '0.7rem', background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', fontWeight: 700, border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Add to Requirements
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
