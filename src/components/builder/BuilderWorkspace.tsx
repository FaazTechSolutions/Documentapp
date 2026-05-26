"use client";

import React from 'react';
import { useBuilderStore, BuilderModule } from '@/store/useBuilderStore';
import CustomDocumentEditor from '@/components/CustomDocumentEditor';
import EnterpriseWorkspaceToolbar from '@/components/EnterpriseWorkspaceToolbar';
import TemplateDashboard from './TemplateDashboard';
import WorkspaceSettings from '../workspace/WorkspaceSettings';
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
  const { activeModule, setActiveModule, activeView } = useBuilderStore();

  const renderModuleContent = () => {
    switch (activeModule) {
      case 'm-req': return <RequirementsPanel />;
      case 'm-scope': return <ScopeMatrix />;
      case 'm-stake': return <StakeholderGrid />;
      case 'm-work': return <WorkflowDesigner />;
      case 'm-risk': return <RiskDashboard />;
      case 'm-appr': return <ApprovalCenter />;
      default: 
        return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No module selected. Please select a module or switch to Canvas view.</div>;
    }
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'canvas':
      case 'dashboard':
        return <CustomDocumentEditor />;
      case 'template':
        return <TemplateDashboard />;
      case 'properties':
        return <WorkspaceSettings />;
      default:
        return <CustomDocumentEditor />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Render toolbar directly here for all views EXCEPT canvas (since canvas renders its own fully-connected toolbar) */}
      {(activeView !== 'canvas' && activeView !== 'dashboard') && (
        <EnterpriseWorkspaceToolbar position="top" />
      )}

      {/* Module Content Area */}
      <div style={{ flex: 1, overflow: 'auto', background: 'var(--background)' }}>
        {renderActiveView()}
      </div>
    </div>
  );
}
