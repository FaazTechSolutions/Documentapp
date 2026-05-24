"use client";

import React, { useState } from 'react';
import { 
  BarChart2, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  AlertTriangle, 
  Users, 
  CheckCircle,
  Clock,
  PieChart,
  Brain
} from 'lucide-react';

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('30d');

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem 0' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Brain size={24} style={{ color: '#a855f7' }} /> AI Business Intelligence
          </h2>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Enterprise workflow analytics, risks, and AI predictions.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.25rem', borderRadius: '8px' }}>
          {['7d', '30d', '90d', 'YTD'].map(range => (
            <button 
              key={range}
              onClick={() => setTimeRange(range)}
              style={{
                background: timeRange === range ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                color: timeRange === range ? '#60a5fa' : 'var(--text-muted)',
                border: 'none',
                padding: '0.4rem 1rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        <KPICard title="Project Health Score" value="94%" trend="+2.4%" positive={true} icon={<Activity size={20} color="#10b981" />} />
        <KPICard title="Requirement Coverage" value="88%" trend="-1.2%" positive={false} icon={<CheckCircle size={20} color="#3b82f6" />} />
        <KPICard title="Approval Velocity" value="1.2 days" trend="+0.4 days" positive={true} icon={<Clock size={20} color="#8b5cf6" />} />
        <KPICard title="Active Risks" value="12" trend="-3" positive={true} icon={<AlertTriangle size={20} color="#f59e0b" />} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Main Chart Area */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Requirement Delivery Velocity</h3>
            <button style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)', padding: '0.4rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }}>Export Report</button>
          </div>
          <div style={{ flex: 1, minHeight: '300px', display: 'flex', alignItems: 'flex-end', gap: '1rem', padding: '1rem 0' }}>
            {/* Mock Bar Chart */}
            {[45, 60, 35, 80, 55, 90, 75, 100, 65, 85, 40, 70].map((val, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '100%', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '4px', position: 'relative', height: '100%', display: 'flex', alignItems: 'flex-end' }}>
                  <div style={{ width: '100%', background: 'linear-gradient(to top, #1d4ed8, #3b82f6)', borderRadius: '4px', height: `${val}%`, transition: 'height 1s ease-out' }} />
                </div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>W{i+1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Heatmap & AI Insights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={18} color="#f59e0b" /> Risk Heatmap
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              <HeatmapCell color="#ef4444" label="Critical" count={3} />
              <HeatmapCell color="#f97316" label="High" count={8} />
              <HeatmapCell color="#f59e0b" label="Medium" count={15} />
              <HeatmapCell color="#eab308" label="Low" count={42} />
              <HeatmapCell color="#10b981" label="Resolved" count={128} />
              <HeatmapCell color="#64748b" label="Ignored" count={5} />
            </div>
          </div>

          <div style={{ background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(124, 58, 237, 0.1))', border: '1px solid rgba(168, 85, 247, 0.2)', borderRadius: '12px', padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#d8b4fe' }}>
              <Brain size={18} /> AI Executive Summary
            </h3>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li style={{ fontSize: '0.85rem', color: 'var(--text-main)', display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: '#a855f7' }}>•</span> Sprint velocity is up 12% compared to last month.
              </li>
              <li style={{ fontSize: '0.85rem', color: 'var(--text-main)', display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: '#a855f7' }}>•</span> HR Module requires immediate attention (3 critical dependencies pending).
              </li>
              <li style={{ fontSize: '0.85rem', color: 'var(--text-main)', display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: '#a855f7' }}>•</span> Approval bottleneck detected in "Legal & Compliance" team.
              </li>
            </ul>
          </div>

        </div>
      </div>

    </div>
  );
}

function KPICard({ title, value, trend, positive, icon }: { title: string, value: string, trend: string, positive: boolean, icon: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>{title}</span>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.4rem', borderRadius: '8px' }}>
          {icon}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
        <span style={{ fontSize: '1.75rem', fontWeight: 800 }}>{value}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.75rem', fontWeight: 700, color: positive ? '#10b981' : '#ef4444' }}>
          {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {trend}
        </span>
      </div>
    </div>
  );
}

function HeatmapCell({ color, label, count }: { color: string, label: string, count: number }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${color}40`, borderRadius: '6px', padding: '0.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
      <span style={{ fontSize: '1.2rem', fontWeight: 800, color }}>{count}</span>
      <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{label}</span>
    </div>
  );
}
