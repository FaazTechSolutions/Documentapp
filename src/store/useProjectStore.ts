import { create } from 'zustand';

export interface Project {
  id: string | number;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  status?: string;
  category?: string;
  createdAt?: string;
  isFavorite?: boolean;
  isArchived?: boolean;
}

interface ProjectState {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string | number, updates: Partial<Project>) => void;
  deleteProject: (id: string | number) => void;
  syncFromStorage: () => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  setProjects: (projects) => {
    localStorage.setItem('docforge_projects', JSON.stringify(projects));
    set({ projects });
  },
  addProject: (project) => set((state) => {
    const updated = [...state.projects, project];
    localStorage.setItem('docforge_projects', JSON.stringify(updated));
    return { projects: updated };
  }),
  updateProject: (id, updates) => set((state) => {
    const updated = state.projects.map(p => String(p.id) === String(id) ? { ...p, ...updates } : p);
    localStorage.setItem('docforge_projects', JSON.stringify(updated));
    return { projects: updated };
  }),
  deleteProject: (id) => set((state) => {
    const updated = state.projects.filter(p => String(p.id) !== String(id));
    localStorage.setItem('docforge_projects', JSON.stringify(updated));
    
    // Cleanup metadata references
    try {
      const metaList = JSON.parse(localStorage.getItem('docforge_docs_meta') || '[]');
      const updatedMeta = metaList.map((m: any) => {
        if (String(m.projectId) === String(id)) {
          const { projectId, ...rest } = m;
          return rest;
        }
        return m;
      });
      localStorage.setItem('docforge_docs_meta', JSON.stringify(updatedMeta));
    } catch (e) {}

    return { projects: updated };
  }),
  syncFromStorage: () => {
    try {
      const stored = localStorage.getItem('docforge_projects');
      if (stored) {
        set({ projects: JSON.parse(stored) });
      } else {
        // Initialize default if empty
        const defaultProjects = [
          { id: '1', name: 'Mawarid ERP Suite Integration', status: 'active', color: '#0284c7', category: 'HR & ERP', icon: '💼', createdAt: new Date().toISOString() },
          { id: '3', name: 'Charitable Trust Grant Proposal', status: 'draft', color: '#f59e0b', category: 'NGO Sector', icon: '📊', createdAt: new Date().toISOString() },
          { id: '4', name: 'Business Requirement Document (BRD)', status: 'active', color: '#10b981', category: 'Development', icon: '🚀', createdAt: new Date().toISOString() }
        ];
        localStorage.setItem('docforge_projects', JSON.stringify(defaultProjects));
        set({ projects: defaultProjects });
      }
    } catch (e) {
      console.error("Failed to sync projects from storage", e);
    }
  }
}));
