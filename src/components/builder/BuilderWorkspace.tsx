"use client";

import React from 'react';
import { useBuilderStore, BuilderModule } from '@/store/useBuilderStore';
import CustomDocumentEditor from '@/components/CustomDocumentEditor';
import RequirementsPanel from './RequirementsPanel';
import ScopeMatrix from './ScopeMatrix';
import StakeholderGrid from './StakeholderGrid';
import WorkflowDesigner from './WorkflowDesigner';
import RiskDashboard from './RiskDashboard';
import ApprovalCenter from './ApprovalCenter';
import { 
  CheckSquare, Target, Users, Activity, ShieldCheck
} from 'lucide-react';

const MODULES = [
  { id: 'm-req', label: 'Requirements', desc: 'Define and track project requirements and specifications.', icon: CheckSquare },
  { id: 'm-scope', label: 'Scope Management', desc: 'Manage project boundaries and deliverables.', icon: Target },
  { id: 'm-stake', label: 'Stakeholders', desc: 'Identify and analyze project stakeholders.', icon: Users },
  { id: 'm-work', label: 'Workflows', desc: 'Design and visualize business processes.', icon: Activity },
  { id: 'm-risk', label: 'Risks', desc: 'Identify, assess, and mitigate project risks.', icon: ShieldCheck },
  { id: 'm-appr', label: 'Approvals', desc: 'Manage sign-offs and approval workflows.', icon: CheckSquare },
];

export default function BuilderWorkspace() {
  const { activeModule, setActiveModule } = useBuilderStore();

  const renderModuleContent = () => {
    switch (activeModule) {
      case 'm-req': return <RequirementsPanel />;
      case 'm-scope': return <ScopeMatrix />;
      case 'm-stake': return <StakeholderGrid />;
      case 'm-work': return <WorkflowDesigner />;
      case 'm-risk': return <RiskDashboard />;
      case 'm-appr': return <ApprovalCenter />;
      default: return <CustomDocumentEditor />;
    }
  };

  const currentModuleData = MODULES.find(m => m.id === activeModule);

  if (!currentModuleData) {
    return <CustomDocumentEditor />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Current Module Context Panel */}
      <div style={{ padding: '1.5rem 2rem', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '0.75rem', borderRadius: '12px', color: '#3b82f6' }}>
            <currentModuleData.icon size={24} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>{currentModuleData.label}</h1>
            <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{currentModuleData.desc}</p>
          </div>
        </div>

        {/* Module Switcher (Horizontal Tabs) */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {MODULES.map(mod => {
            const isActive = activeModule === mod.id;
            const Icon = mod.icon;
            return (
              <button
                key={mod.id}
                onClick={() => setActiveModule(mod.id as BuilderModule)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid',
                  background: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                  borderColor: isActive ? 'rgba(59, 130, 246, 0.3)' : 'transparent',
                  color: isActive ? '#3b82f6' : 'var(--text-muted)',
                  cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
                  transition: 'all 0.2s', whiteSpace: 'nowrap'
                }}
              >
                <Icon size={16} />
                {mod.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Module Content Area */}
      <div style={{ flex: 1, overflow: 'auto', background: 'var(--background)' }}>
        {renderModuleContent()}
      </div>
    </div>
  );
}
