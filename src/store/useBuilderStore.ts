import { create } from 'zustand';

export type BuilderModule = 'm-req' | 'm-scope' | 'm-stake' | 'm-work' | 'm-risk' | 'm-appr' | null;

export interface Requirement {
  id: string;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Approved' | 'Draft' | 'Issue' | 'Rejected';
  owner: string;
  completion: number;
}

export interface Risk {
  id: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  probability: 'High' | 'Medium' | 'Low';
  owner: string;
  mitigation: string;
  status: 'Open' | 'Mitigated' | 'Resolved';
}

export interface WorkflowNode {
  id: string;
  type: 'Process' | 'Decision' | 'Approval' | 'Integration' | 'AI Step';
  label: string;
}

export interface Stakeholder {
  id: string;
  name: string;
  role: string;
  department: string;
  influence: 'High' | 'Medium' | 'Low';
  approvalStatus: 'Pending' | 'Approved' | 'Rejected';
}

export interface Approval {
  id: string;
  section: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Escalated';
  approver: string;
  role: string;
  date: string;
}

interface BuilderState {
  activeModule: BuilderModule;
  setActiveModule: (module: BuilderModule) => void;

  requirements: Requirement[];
  risks: Risk[];
  workflows: WorkflowNode[];
  stakeholders: Stakeholder[];
  approvals: Approval[];

  addRequirement: (req: Requirement) => void;
  addRisk: (risk: Risk) => void;
  addApproval: (appr: Approval) => void;
}

// Initial Mock Data
const initialRequirements: Requirement[] = [
  { id: 'REQ-001', title: 'Employee Login', priority: 'High', status: 'Approved', owner: 'Alice', completion: 95 },
  { id: 'REQ-002', title: 'SSO Integration', priority: 'High', status: 'Issue', owner: 'Bob', completion: 50 },
  { id: 'REQ-003', title: 'User Profile Sync', priority: 'Medium', status: 'Issue', owner: 'Charlie', completion: 10 }
];

const initialRisks: Risk[] = [
  { id: 'RSK-001', description: 'SSO API deprecation', severity: 'Critical', probability: 'High', owner: 'Bob', mitigation: 'Update to v3 API', status: 'Open' },
  { id: 'RSK-002', description: 'Data migration delay', severity: 'Critical', probability: 'Medium', owner: 'Alice', mitigation: 'Allocate more dev resources', status: 'Open' },
  { id: 'RSK-003', description: 'Third-party downtime', severity: 'Critical', probability: 'Low', owner: 'Charlie', mitigation: 'Implement fallback', status: 'Open' }
];

const initialWorkflows: WorkflowNode[] = [
  { id: 'WF-1', type: 'Process', label: 'User submits form' } // Missing steps implies more needed
];

const initialApprovals: Approval[] = [
  { id: 'APP-001', section: 'System Architecture', status: 'Pending', approver: 'Sarah J.', role: 'Lead Architect', date: 'May 24, 2026' }
];

export const useBuilderStore = create<BuilderState>((set) => ({
  activeModule: 'm-req',
  setActiveModule: (module) => set({ activeModule: module }),

  requirements: initialRequirements,
  risks: initialRisks,
  workflows: initialWorkflows,
  stakeholders: [],
  approvals: initialApprovals,

  addRequirement: (req) => set((state) => ({ requirements: [...state.requirements, req] })),
  addRisk: (risk) => set((state) => ({ risks: [...state.risks, risk] })),
  addApproval: (appr) => set((state) => ({ approvals: [...state.approvals, appr] }))
}));
