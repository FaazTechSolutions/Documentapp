import { create } from 'zustand';

export interface WorkspaceMember {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Manager' | 'Editor' | 'Viewer' | 'Guest';
  avatar?: string;
  status: 'Active' | 'Pending' | 'Deactivated';
}

export interface WorkspaceActivity {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details?: string;
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  type: 'business_analysis' | 'qa' | 'devops' | 'executive' | 'documentation' | 'custom';
  theme: {
    color: string;
    icon: string;
    logo?: string;
  };
  enabledModules: string[];
  members: WorkspaceMember[];
  activities: WorkspaceActivity[];
}

interface WorkspaceState {
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  setActiveWorkspace: (id: string) => void;
  createWorkspace: (workspace: Omit<Workspace, 'id' | 'members' | 'activities'>) => void;
  updateWorkspace: (id: string, updates: Partial<Workspace>) => void;
  deleteWorkspace: (id: string) => void;
  addMember: (workspaceId: string, member: Omit<WorkspaceMember, 'id'>) => void;
  updateMemberRole: (workspaceId: string, memberId: string, role: WorkspaceMember['role']) => void;
  removeMember: (workspaceId: string, memberId: string) => void;
  logActivity: (workspaceId: string, action: string, user: string, details?: string) => void;
  syncFromStorage: () => void;
}

const defaultWorkspaces: Workspace[] = [
  {
    id: 'ws_ba_1',
    name: 'Business Analysis',
    description: 'Requirements, scope, and stakeholder management.',
    type: 'business_analysis',
    theme: { color: '#3b82f6', icon: '💼' },
    enabledModules: ['m-req', 'm-scope', 'm-stake', 'm-appr', 'm-risk', 'm-work'],
    members: [
      { id: 'm1', name: 'Alice Smith', email: 'alice@docforge.com', role: 'Owner', status: 'Active' },
      { id: 'm2', name: 'Bob Jones', email: 'bob@docforge.com', role: 'Editor', status: 'Active' }
    ],
    activities: [
      { id: 'act_1', action: 'Workspace created', user: 'System', timestamp: new Date(Date.now() - 86400000 * 5).toISOString() }
    ]
  },
  {
    id: 'ws_qa_1',
    name: 'QA & Testing',
    description: 'Test cases, bug tracking, and validation.',
    type: 'qa',
    theme: { color: '#10b981', icon: '🧪' },
    enabledModules: ['m-testcases', 'm-bugs', 'm-suites', 'm-coverage', 'm-validation'],
    members: [
      { id: 'm3', name: 'Charlie QA', email: 'charlie@docforge.com', role: 'Owner', status: 'Active' }
    ],
    activities: []
  },
  {
    id: 'ws_devops_1',
    name: 'DevOps',
    description: 'Deployments, environments, CI/CD.',
    type: 'devops',
    theme: { color: '#f59e0b', icon: '🚀' },
    enabledModules: ['m-deploy', 'm-pipelines', 'm-env', 'm-logs', 'm-release'],
    members: [],
    activities: []
  },
  {
    id: 'ws_exec_1',
    name: 'Executive',
    description: 'Portfolio metrics, health, approvals.',
    type: 'executive',
    theme: { color: '#8b5cf6', icon: '📈' },
    enabledModules: ['m-portfolio', 'm-health', 'm-budget', 'm-appr'],
    members: [],
    activities: []
  },
  {
    id: 'ws_doc_1',
    name: 'Documentation',
    description: 'Knowledge base, guides, policies.',
    type: 'documentation',
    theme: { color: '#ec4899', icon: '📖' },
    enabledModules: ['m-kb', 'm-sop', 'm-guides', 'm-wiki', 'm-policies'],
    members: [],
    activities: []
  }
];

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  workspaces: [],
  activeWorkspaceId: null,

  setActiveWorkspace: (id) => {
    set({ activeWorkspaceId: id });
    if (typeof window !== 'undefined') {
      localStorage.setItem('docforge_active_workspace', id);
    }
  },

  createWorkspace: (workspaceData) => {
    const newWs: Workspace = {
      ...workspaceData,
      id: `ws_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      members: [{ id: 'm_owner', name: 'Current User', email: 'user@docforge.com', role: 'Owner', status: 'Active' }],
      activities: [{ id: `act_${Date.now()}`, action: 'Workspace created', user: 'Current User', timestamp: new Date().toISOString() }]
    };

    set((state) => {
      const updated = [...state.workspaces, newWs];
      if (typeof window !== 'undefined') {
        localStorage.setItem('docforge_workspaces', JSON.stringify(updated));
      }
      return { workspaces: updated };
    });
  },

  updateWorkspace: (id, updates) => {
    set((state) => {
      const updated = state.workspaces.map(ws => ws.id === id ? { ...ws, ...updates } : ws);
      if (typeof window !== 'undefined') {
        localStorage.setItem('docforge_workspaces', JSON.stringify(updated));
      }
      return { workspaces: updated };
    });
  },

  deleteWorkspace: (id) => {
    set((state) => {
      const updated = state.workspaces.filter(ws => ws.id !== id);
      if (typeof window !== 'undefined') {
        localStorage.setItem('docforge_workspaces', JSON.stringify(updated));
        if (state.activeWorkspaceId === id) {
          localStorage.removeItem('docforge_active_workspace');
        }
      }
      return { 
        workspaces: updated,
        activeWorkspaceId: state.activeWorkspaceId === id ? (updated[0]?.id || null) : state.activeWorkspaceId
      };
    });
  },

  addMember: (workspaceId, memberData) => {
    const newMember: WorkspaceMember = {
      ...memberData,
      id: `m_${Date.now()}`
    };
    set((state) => {
      const updated = state.workspaces.map(ws => {
        if (ws.id === workspaceId) {
          return { ...ws, members: [...ws.members, newMember] };
        }
        return ws;
      });
      if (typeof window !== 'undefined') localStorage.setItem('docforge_workspaces', JSON.stringify(updated));
      return { workspaces: updated };
    });
    get().logActivity(workspaceId, 'Member invited', 'Current User', `Invited ${memberData.email}`);
  },

  updateMemberRole: (workspaceId, memberId, role) => {
    set((state) => {
      const updated = state.workspaces.map(ws => {
        if (ws.id === workspaceId) {
          return { ...ws, members: ws.members.map(m => m.id === memberId ? { ...m, role } : m) };
        }
        return ws;
      });
      if (typeof window !== 'undefined') localStorage.setItem('docforge_workspaces', JSON.stringify(updated));
      return { workspaces: updated };
    });
  },

  removeMember: (workspaceId, memberId) => {
    set((state) => {
      const updated = state.workspaces.map(ws => {
        if (ws.id === workspaceId) {
          return { ...ws, members: ws.members.filter(m => m.id !== memberId) };
        }
        return ws;
      });
      if (typeof window !== 'undefined') localStorage.setItem('docforge_workspaces', JSON.stringify(updated));
      return { workspaces: updated };
    });
  },

  logActivity: (workspaceId, action, user, details) => {
    const activity: WorkspaceActivity = {
      id: `act_${Date.now()}`,
      action,
      user,
      details,
      timestamp: new Date().toISOString()
    };
    set((state) => {
      const updated = state.workspaces.map(ws => {
        if (ws.id === workspaceId) {
          return { ...ws, activities: [activity, ...ws.activities].slice(0, 100) };
        }
        return ws;
      });
      if (typeof window !== 'undefined') localStorage.setItem('docforge_workspaces', JSON.stringify(updated));
      return { workspaces: updated };
    });
  },

  syncFromStorage: () => {
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('docforge_workspaces') : null;
      const activeStored = typeof window !== 'undefined' ? localStorage.getItem('docforge_active_workspace') : null;

      if (stored) {
        const parsedWorkspaces = JSON.parse(stored);
        set({ workspaces: parsedWorkspaces });
        
        if (activeStored && parsedWorkspaces.some((ws: Workspace) => ws.id === activeStored)) {
          set({ activeWorkspaceId: activeStored });
        } else if (parsedWorkspaces.length > 0) {
          set({ activeWorkspaceId: parsedWorkspaces[0].id });
        }
      } else {
        set({ workspaces: defaultWorkspaces, activeWorkspaceId: defaultWorkspaces[0].id });
        if (typeof window !== 'undefined') {
          localStorage.setItem('docforge_workspaces', JSON.stringify(defaultWorkspaces));
          localStorage.setItem('docforge_active_workspace', defaultWorkspaces[0].id);
        }
      }
    } catch (e) {
      console.error("Failed to sync workspaces", e);
    }
  }
}));
