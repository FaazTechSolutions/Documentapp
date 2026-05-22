export interface SidebarItem {
  id: string;
  icon: string;
  label: string;
}

export interface KpiWidget {
  id: string;
  title: string;
  value: string;
  trend: string;
  color: string;
  icon?: string;
}

export interface WorkflowStep {
  id: string;
  step: number;
  title: string;
  status: 'Completed' | 'In Progress' | 'Pending' | 'Review' | 'Blocked';
  assignee: string;
}

export interface AnalyticsBlock {
  id: string;
  title: string;
  type: 'progress' | 'bar' | 'list' | 'pie';
  data: any;
}

export interface TemplateDashboardConfig {
  sidebarItems: SidebarItem[];
  kpiWidgets: KpiWidget[];
  workflowSteps: WorkflowStep[];
  analyticsBlocks: AnalyticsBlock[];
  theme?: {
    primaryColor: string;
    secondaryColor: string;
  };
}

export const getDefaultDashboardConfig = (templateType: string): TemplateDashboardConfig => {
  const tType = templateType.toLowerCase().replace('template-', '');

  // Base default
  let config: TemplateDashboardConfig = {
    sidebarItems: [
      { id: 'executive', icon: '📝', label: 'Executive Summary' },
      { id: 'requirements', icon: '📋', label: 'Requirements' },
      { id: 'stakeholders', icon: '👥', label: 'Stakeholders' },
      { id: 'workflows', icon: '🔄', label: 'Workflows' }
    ],
    kpiWidgets: [
      { id: 'kpi-1', title: 'Total Requirements', value: '0', trend: 'Neutral', color: '#3b82f6' },
      { id: 'kpi-2', title: 'Approval Status', value: 'Pending', trend: 'Waiting', color: '#f59e0b' }
    ],
    workflowSteps: [
      { id: 'wf-1', step: 1, title: 'Draft Creation', status: 'In Progress', assignee: 'Analyst' },
      { id: 'wf-2', step: 2, title: 'Review', status: 'Pending', assignee: 'Manager' }
    ],
    analyticsBlocks: []
  };

  if (tType === 'brd') {
    config = {
      sidebarItems: [
        { id: 'executive', icon: '📝', label: 'Executive Summary' },
        { id: 'templates', icon: '📋', label: 'BRD Templates' },
        { id: 'requirements', icon: '✅', label: 'Requirement Modules' },
        { id: 'scope', icon: '🎯', label: 'Scope Management' },
        { id: 'stakeholders', icon: '👥', label: 'Stakeholders' },
        { id: 'workflows', icon: '🔄', label: 'Workflows' },
        { id: 'approvals', icon: '🛡️', label: 'Approvals' },
        { id: 'risks', icon: '⚠️', label: 'Risks' },
        { id: 'integrations', icon: '🔌', label: 'Integrations' },
        { id: 'analytics', icon: '📈', label: 'Analytics' },
        { id: 'timeline', icon: '⏳', label: 'Timeline' },
        { id: 'versions', icon: '🕒', label: 'Version History' },
        { id: 'attachments', icon: '📎', label: 'Attachments' },
      ],
      kpiWidgets: [
        { id: 'brd-kpi-1', title: 'Total Requirements', value: '42', trend: '+5 this week', color: '#2563EB', icon: '📋' },
        { id: 'brd-kpi-2', title: 'Approval Status', value: '75%', trend: 'Pending VP Signoff', color: '#F59E0B', icon: '🛡️' },
        { id: 'brd-kpi-3', title: 'Identified Risks', value: '4', trend: '2 Critical, 2 Low', color: '#EF4444', icon: '⚠️' }
      ],
      workflowSteps: [
        { id: 'wf-1', step: 1, title: 'Draft Phase', status: 'Completed', assignee: 'Sarah J.' },
        { id: 'wf-2', step: 2, title: 'Stakeholder Review', status: 'In Progress', assignee: 'Michael T.' },
        { id: 'wf-3', step: 3, title: 'Technical Feasibility', status: 'Pending', assignee: 'Dev Team' },
        { id: 'wf-4', step: 4, title: 'Final Sign-off', status: 'Pending', assignee: 'VP Engineering' }
      ],
      analyticsBlocks: []
    };
  } else if (tType === 'frd') {
    config = {
      sidebarItems: [
        { id: 'overview', icon: '📝', label: 'Feature Overview' },
        { id: 'usecases', icon: '🎯', label: 'Use Cases & User Stories' },
        { id: 'uiux', icon: '🎨', label: 'UI/UX Mockups' },
        { id: 'functional', icon: '⚙️', label: 'Functional Specs' },
        { id: 'data', icon: '💾', label: 'Data Dictionary' },
        { id: 'api', icon: '🔌', label: 'API Specifications' },
        { id: 'acceptance', icon: '✅', label: 'Acceptance Criteria' },
        { id: 'nonfunctional', icon: '🛡️', label: 'Non-Functional Specs' },
        { id: 'out-of-scope', icon: '🚫', label: 'Out of Scope' },
        { id: 'dependencies', icon: '🔗', label: 'Dependencies' },
        { id: 'approvals', icon: '✍️', label: 'Sign-offs' }
      ],
      kpiWidgets: [
        { id: 'frd-kpi-1', title: 'Total Features', value: '28', trend: '12 core, 16 secondary', color: '#10B981' },
        { id: 'frd-kpi-2', title: 'API Endpoints', value: '15', trend: '8 new, 7 modified', color: '#6366F1' },
        { id: 'frd-kpi-3', title: 'Mockup Coverage', value: '95%', trend: 'Missing Edge Cases', color: '#F59E0B' }
      ],
      workflowSteps: [
        { id: 'wf-1', step: 1, title: 'Requirements Gathering', status: 'Completed', assignee: 'Product Team' },
        { id: 'wf-2', step: 2, title: 'UX Design Sync', status: 'In Progress', assignee: 'Design Team' },
        { id: 'wf-3', step: 3, title: 'Technical Review', status: 'Pending', assignee: 'Arch. Board' }
      ],
      analyticsBlocks: []
    };
  } else if (tType === 'srs') {
    config = {
      sidebarItems: [
        { id: 'overview', icon: '📝', label: 'System Overview' },
        { id: 'architecture', icon: '🏗️', label: 'Architecture & Design' },
        { id: 'components', icon: '🧩', label: 'System Components' },
        { id: 'database', icon: '🗄️', label: 'Database Schema' },
        { id: 'interfaces', icon: '🔌', label: 'External Interfaces' },
        { id: 'security', icon: '🔒', label: 'Security & Auth' },
        { id: 'performance', icon: '⚡', label: 'Performance SLA' },
        { id: 'deployment', icon: '🚀', label: 'Deployment Strategy' },
        { id: 'maintenance', icon: '🔧', label: 'Maintenance Plan' },
        { id: 'appendix', icon: '📚', label: 'Appendix & Glossary' }
      ],
      kpiWidgets: [
        { id: 'srs-kpi-1', title: 'System Components', value: '14', trend: '3 Microservices', color: '#8B5CF6' },
        { id: 'srs-kpi-2', title: 'Security Posture', value: 'Tier 1', trend: 'SOC2 Compliant', color: '#10B981' },
        { id: 'srs-kpi-3', title: 'Uptime Target', value: '99.99%', trend: 'HA Architecture', color: '#3B82F6' }
      ],
      workflowSteps: [],
      analyticsBlocks: []
    };
  } else if (tType === 'tdd') {
    config = {
      sidebarItems: [
        { id: 'overview', icon: '📝', label: 'Technical Overview' },
        { id: 'system-context', icon: '🌍', label: 'System Context Diagram' },
        { id: 'api-design', icon: '🔌', label: 'API Design (OpenAPI)' },
        { id: 'data-model', icon: '💾', label: 'Data Model & Migrations' },
        { id: 'algorithms', icon: '🧠', label: 'Core Algorithms' },
        { id: 'caching', icon: '⚡', label: 'Caching Strategy' },
        { id: 'error-handling', icon: '🛡️', label: 'Error Handling' },
        { id: 'monitoring', icon: '📊', label: 'Monitoring & Logging' },
        { id: 'ci-cd', icon: '🚀', label: 'CI/CD Pipeline' }
      ],
      kpiWidgets: [
        { id: 'tdd-kpi-1', title: 'API Endpoints', value: '24', trend: 'REST & GraphQL', color: '#EC4899' },
        { id: 'tdd-kpi-2', title: 'DB Tables', value: '12', trend: 'Relational Schema', color: '#3B82F6' },
        { id: 'tdd-kpi-3', title: 'Cache Hit Ratio', value: '85%', trend: 'Redis Cluster', color: '#F59E0B' }
      ],
      workflowSteps: [],
      analyticsBlocks: []
    };
  } else if (tType === 'sprint' || tType === 'sprint-planning') {
    config = {
      sidebarItems: [
        { id: 'sprint-overview', icon: '🎯', label: 'Sprint Overview' },
        { id: 'backlog', icon: '📋', label: 'Sprint Backlog' },
        { id: 'capacity', icon: '⚖️', label: 'Team Capacity' },
        { id: 'dependencies', icon: '🔗', label: 'Blockers & Dependencies' },
        { id: 'burndown', icon: '📉', label: 'Burndown Chart' },
        { id: 'retro', icon: '🔄', label: 'Retrospective Notes' }
      ],
      kpiWidgets: [
        { id: 'sp-kpi-1', title: 'Sprint Velocity', value: '45', trend: 'Story Points', color: '#10B981' },
        { id: 'sp-kpi-2', title: 'Completion Rate', value: '92%', trend: 'Last 3 sprints', color: '#3B82F6' },
        { id: 'sp-kpi-3', title: 'Active Blockers', value: '2', trend: 'Requires attention', color: '#EF4444' }
      ],
      workflowSteps: [],
      analyticsBlocks: []
    };
  }

  return config;
};
