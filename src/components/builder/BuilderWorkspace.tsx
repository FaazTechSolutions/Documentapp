"use client";

import React from 'react';
import { useBuilderStore } from '@/store/useBuilderStore';
import CustomDocumentEditor from '@/components/CustomDocumentEditor';
import RequirementsPanel from './RequirementsPanel';
import ScopeMatrix from './ScopeMatrix';
import StakeholderGrid from './StakeholderGrid';
import WorkflowDesigner from './WorkflowDesigner';
import RiskDashboard from './RiskDashboard';
import ApprovalCenter from './ApprovalCenter';

export default function BuilderWorkspace() {
  const { activeModule } = useBuilderStore();

  switch (activeModule) {
    case 'm-req':
      return <RequirementsPanel />;
    case 'm-scope':
      return <ScopeMatrix />;
    case 'm-stake':
      return <StakeholderGrid />;
    case 'm-work':
      return <WorkflowDesigner />;
    case 'm-risk':
      return <RiskDashboard />;
    case 'm-appr':
      return <ApprovalCenter />;
    default:
      // Fallback to the classic document editor if no specific module is selected or it's the 'Canvas' view
      return <CustomDocumentEditor />;
  }
}
