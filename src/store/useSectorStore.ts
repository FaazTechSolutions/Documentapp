import { create } from 'zustand';

export type SectorType = 'operations' | 'reviews' | 'governance';

export interface RoleConfig {
  id: string;
  label: string;
  permissions: string[];
}

export const SECTOR_ROLES: Record<SectorType, RoleConfig[]> = {
  operations: [
    {
      id: 'creator',
      label: 'Document Creator',
      permissions: ['create_docs', 'edit_docs', 'ai_generate', 'version_control', 'view_analytics', 'read_approvals']
    },
    {
      id: 'editor',
      label: 'Document Editor',
      permissions: ['edit_docs', 'version_control', 'read_approvals']
    },
    {
      id: 'ba',
      label: 'Business Analyst',
      permissions: ['create_docs', 'edit_docs', 'ai_generate', 'version_control', 'view_analytics', 'read_approvals']
    },
    {
      id: 'template_manager',
      label: 'Template Manager',
      permissions: ['manage_templates', 'read_approvals']
    },
    {
      id: 'project_owner',
      label: 'Project Owner',
      permissions: ['create_docs', 'edit_docs', 'manage_projects', 'version_control', 'view_analytics', 'read_approvals']
    },
    {
      id: 'knowledge_manager',
      label: 'Knowledge Manager',
      permissions: ['edit_docs', 'read_approvals']
    },
    {
      id: 'ai_generator',
      label: 'AI Generator',
      permissions: ['ai_generate', 'read_approvals']
    }
  ],
  reviews: [
    {
      id: 'viewer',
      label: 'Viewer / User',
      permissions: ['view_docs', 'comment', 'read_analytics']
    },
    {
      id: 'reviewer',
      label: 'Reviewer',
      permissions: ['view_docs', 'review_docs', 'comment', 'notifications', 'read_analytics']
    },
    {
      id: 'approver',
      label: 'Approver',
      permissions: ['view_docs', 'approve_reject', 'comment', 'notifications', 'read_analytics']
    },
    {
      id: 'stakeholder',
      label: 'Stakeholder',
      permissions: ['view_docs', 'comment', 'notifications', 'read_analytics']
    },
    {
      id: 'auditor',
      label: 'Auditor',
      permissions: ['view_docs', 'reports_access', 'audit_logs', 'read_analytics']
    },
    {
      id: 'client',
      label: 'Client User',
      permissions: ['view_docs', 'comment']
    },
    {
      id: 'admin',
      label: 'Workspace Admin',
      permissions: ['view_docs', 'review_docs', 'approve_reject', 'comment', 'reports_access', 'audit_logs', 'notifications', 'read_analytics', 'admin_access']
    }
  ],
  governance: [
    {
      id: 'gov_auditor',
      label: 'Governance Auditor',
      permissions: ['view_docs', 'reports_access', 'audit_logs', 'compliance_check']
    },
    {
      id: 'gov_admin',
      label: 'Governance Admin',
      permissions: ['view_docs', 'reports_access', 'audit_logs', 'compliance_check', 'admin_access']
    }
  ]
};

interface SectorState {
  activeSector: SectorType;
  activeRoleId: string;
  setSector: (sector: SectorType) => void;
  setRole: (roleId: string) => void;
  hasPermission: (permission: string) => boolean;
  getActiveRoleLabel: () => string;
}

// Initialize from localStorage if client-side
const getInitialSector = (): SectorType => {
  if (typeof window !== 'undefined') {
    return (localStorage.getItem('docforge_active_sector') as SectorType) || 'operations';
  }
  return 'operations';
};

const getInitialRole = (sector: SectorType): string => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('docforge_active_role');
    if (saved) {
      const exists = SECTOR_ROLES[sector]?.some(r => r.id === saved);
      if (exists) return saved;
    }
  }
  return SECTOR_ROLES[sector]?.[0]?.id || 'creator';
};

export const useSectorStore = create<SectorState>((set, get) => ({
  activeSector: getInitialSector(),
  activeRoleId: getInitialRole(getInitialSector()),

  setSector: (sector) => {
    const roles = SECTOR_ROLES[sector];
    const defaultRole = roles[0]?.id || '';
    if (typeof window !== 'undefined') {
      localStorage.setItem('docforge_active_sector', sector);
      localStorage.setItem('docforge_active_role', defaultRole);
    }
    set({ activeSector: sector, activeRoleId: defaultRole });
  },

  setRole: (roleId) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('docforge_active_role', roleId);
    }
    set({ activeRoleId: roleId });
  },

  hasPermission: (permission) => {
    const { activeSector, activeRoleId } = get();
    const role = SECTOR_ROLES[activeSector]?.find(r => r.id === activeRoleId);
    if (!role) return false;
    return role.permissions.includes(permission);
  },

  getActiveRoleLabel: () => {
    const { activeSector, activeRoleId } = get();
    const role = SECTOR_ROLES[activeSector]?.find(r => r.id === activeRoleId);
    return role ? role.label : '';
  }
}));
