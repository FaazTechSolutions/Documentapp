"use client";

import React, { useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { AlertCircle, FileText, CheckSquare, Zap, Target, Activity } from 'lucide-react';

export default function RightInsightsPanel() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams?.get('tab');
  
  if (tab === 'documents') return null;
  
  return (
    <aside style={{ 
      width: '300px', 
      borderLeft: '1px solid var(--border)', 
      background: 'var(--surface)',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
      overflowY: 'auto'
    }}>
      
      {/* AI Insights */}
      <div>
        <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <Zap size={14} /> AI Insights
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* Insight Card: Critical */}
          <div style={{ padding: '0.75rem', background: 'var(--background)', borderRadius: '8px', borderLeft: '3px solid #ef4444', fontSize: '0.85rem', color: 'var(--text-main)', display: 'flex', gap: '0.5rem' }}>
            Missing workflows detected in 3 modules
          </div>
          
          {/* Insight Card: Warning */}
          <div style={{ padding: '0.75rem', background: 'var(--background)', borderRadius: '8px', borderLeft: '3px solid #f59e0b', fontSize: '0.85rem', color: 'var(--text-main)', display: 'flex', gap: '0.5rem' }}>
            Duplicate requirements found (REQ-003, REQ-012)
          </div>
          
          {/* Insight Card: Info */}
          <div style={{ padding: '0.75rem', background: 'var(--background)', borderRadius: '8px', borderLeft: '3px solid #3b82f6', fontSize: '0.85rem', color: 'var(--text-main)', display: 'flex', gap: '0.5rem' }}>
            Approval delay: 2 stakeholders pending {'>'} 5 days
          </div>
          
          {/* Insight Card: Critical */}
          <div style={{ padding: '0.75rem', background: 'var(--background)', borderRadius: '8px', borderLeft: '3px solid #ef4444', fontSize: '0.85rem', color: 'var(--text-main)', display: 'flex', gap: '0.5rem' }}>
            Payroll module risk score: High
          </div>
        </div>
      </div>
      
      {/* Quick Generate Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <button style={{ width: '100%', padding: '0.5rem', background: 'transparent', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.background = 'var(--background)'; e.currentTarget.style.borderColor = 'var(--primary)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
          Generate FRD
        </button>
        <button style={{ width: '100%', padding: '0.5rem', background: 'transparent', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.background = 'var(--background)'; e.currentTarget.style.borderColor = 'var(--primary)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
          Generate Test Cases
        </button>
        <button style={{ width: '100%', padding: '0.5rem', background: 'transparent', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.background = 'var(--background)'; e.currentTarget.style.borderColor = 'var(--primary)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
          Generate SRS
        </button>
        <button style={{ width: '100%', padding: '0.5rem', background: 'transparent', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.background = 'var(--background)'; e.currentTarget.style.borderColor = 'var(--primary)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
          AI Summary
        </button>
      </div>
      
      {/* Recent Activity */}
      <div>
        <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <Activity size={14} /> Recent Activity
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div style={{ marginTop: '0.25rem', width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6', flexShrink: 0 }}></div>
            <div>
              <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-main)' }}>BRD updated by Ahmed</p>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>2m ago</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div style={{ marginTop: '0.25rem', width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', flexShrink: 0 }}></div>
            <div>
              <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-main)' }}>Payroll scope modified</p>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>1h ago</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div style={{ marginTop: '0.25rem', width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf6', flexShrink: 0 }}></div>
            <div>
              <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-main)' }}>New approval requested</p>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>3h ago</span>
            </div>
          </div>
        </div>
      </div>
      
    </aside>
  );
}
