import React, { useState } from 'react';
import { GitBranch, Play, Plus, Trash2, Edit3, Settings, PlayCircle } from 'lucide-react';
import { useBuilderStore } from '@/store/useBuilderStore';

export default function WorkflowDesigner() {
  const { workflows } = useBuilderStore();
  
  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden', height: 'calc(100vh - 64px)' }}>
      {/* ── CENTER WORKSPACE ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GitBranch size={20} color="#10b981" /> Workflow & Logic
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>Design process flows and business logic diagrams.</p>
          </div>
        </div>

        {/* Top Section: Flowchart Area */}
        <div style={{ height: '350px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.05, backgroundImage: 'radial-gradient(var(--text-main) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          
          <div style={{ zIndex: 10, display: 'flex', gap: '2rem', alignItems: 'center' }}>
            {/* Visual Nodes */}
            <div style={{ padding: '1rem', background: 'var(--background)', border: '2px solid #3b82f6', borderRadius: '8px', color: 'var(--text-main)', fontWeight: 700, fontSize: '0.85rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>User Login</div>
            <div style={{ height: '2px', width: '40px', background: 'var(--border)' }} />
            <div style={{ padding: '1rem', background: 'var(--background)', border: '2px solid #f59e0b', borderRadius: '8px', color: 'var(--text-main)', fontWeight: 700, fontSize: '0.85rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>Auth Gateway</div>
            <div style={{ height: '2px', width: '40px', background: 'var(--border)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: 'var(--background)', border: '2px solid #10b981', borderRadius: '8px', color: 'var(--text-main)', fontWeight: 700, fontSize: '0.85rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>Access Granted</div>
              <div style={{ padding: '1rem', background: 'var(--background)', border: '2px solid #ef4444', borderRadius: '8px', color: 'var(--text-main)', fontWeight: 700, fontSize: '0.85rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>Access Denied</div>
            </div>
          </div>
          
          <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', display: 'flex', gap: '0.5rem' }}>
            <button style={{ background: 'var(--background)', border: '1px solid var(--border)', padding: '0.4rem', borderRadius: '6px', cursor: 'pointer', color: 'var(--text-main)' }}>-</button>
            <button style={{ background: 'var(--background)', border: '1px solid var(--border)', padding: '0.4rem', borderRadius: '6px', cursor: 'pointer', color: 'var(--text-main)' }}>100%</button>
            <button style={{ background: 'var(--background)', border: '1px solid var(--border)', padding: '0.4rem', borderRadius: '6px', cursor: 'pointer', color: 'var(--text-main)' }}>+</button>
          </div>
        </div>

        {/* Bottom Section: Step List */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>Step Details</h3>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--border)' }}>
                <tr>
                  <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Step</th>
                  <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Type</th>
                  <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Condition</th>
                  <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>API/Integration</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { step: '1. User Login', type: 'Trigger', cond: 'On Submit', api: '-' },
                  { step: '2. Auth Gateway', type: 'Logic', cond: 'Validate JWT', api: 'Auth0 /oauth/token' },
                  { step: '3. Access Granted', type: 'Action', cond: 'If 200 OK', api: 'Redirect to /dashboard' },
                  { step: '4. Access Denied', type: 'Action', cond: 'If 401 Unauth', api: 'Show Error Modal' },
                ].map((s, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>{s.step}</td>
                    <td style={{ padding: '0.75rem 1rem' }}><span style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{s.type}</span></td>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.cond}</td>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', color: '#3b82f6', fontFamily: 'monospace' }}>{s.api}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL (AI SIMULATION) ── */}
      <div style={{ width: '280px', borderLeft: '1px solid var(--border)', background: 'var(--background)', display: 'flex', flexDirection: 'column', flexShrink: 0, padding: '1.5rem', gap: '1.5rem', overflowY: 'auto' }}>
        <div>
          <h4 style={{ fontSize: '0.7rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <PlayCircle size={14} /> AI Simulation Engine
          </h4>
          
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '1rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Test Edge Cases</span>
              <span style={{ fontSize: '0.7rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>Ready</span>
            </div>
            <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', background: '#10b981', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
              <Play size={14} /> Run Simulation
            </button>
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Simulation Results</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ef4444', marginBottom: '0.25rem' }}>Dead End Detected</div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-main)', margin: 0, lineHeight: 1.4 }}>
                If "Auth Gateway" times out (504), there is no fallback route designed. Users will be stuck.
              </p>
            </div>
            
            <div style={{ padding: '0.75rem', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', marginBottom: '0.25rem' }}>Happy Path Verified</div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-main)', margin: 0, lineHeight: 1.4 }}>
                Standard login flow completes in ~120ms based on expected API response times.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
