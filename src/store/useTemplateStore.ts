import { create } from 'zustand';

export interface TemplateBlock {
  id: string;
  type: string;
  value?: string;
  headingLevel?: string;
  checked?: boolean;
  metadata?: any;
}

export interface TemplateVersion {
  version: string;
  timestamp: string;
  blocks: TemplateBlock[];
  changesDescription?: string;
}

export interface EditableTemplate {
  id: string;
  name: string;
  category: string;
  description?: string;
  tags?: string[];
  status: 'Draft' | 'Published' | 'Archived' | 'Team Shared' | 'Private';
  visibility: 'Private' | 'Team' | 'Global';
  lastEdited: string;
  createdAt: string;
  version: string;
  blocks: TemplateBlock[];
  versions: TemplateVersion[];
  baseTemplateId?: string; // If this was duplicated from a core template
}

interface TemplateState {
  templates: EditableTemplate[];
  drafts: Record<string, TemplateBlock[]>; // Mapping of templateId -> unsaved blocks
  setTemplates: (templates: EditableTemplate[]) => void;
  syncFromStorage: () => void;
  
  // Save Actions
  saveTemplate: (id: string, blocks: TemplateBlock[], createSnapshot?: boolean, changesDescription?: string) => void;
  saveAsNewTemplate: (template: Omit<EditableTemplate, 'id' | 'createdAt' | 'lastEdited' | 'version' | 'versions'>, blocks: TemplateBlock[]) => string;
  
  // Draft Actions
  saveDraft: (id: string, blocks: TemplateBlock[]) => void;
  clearDraft: (id: string) => void;
  
  // Version Actions
  restoreVersion: (templateId: string, versionString: string) => void;
  
  // Core Actions
  deleteTemplate: (id: string) => void;
  duplicateTemplate: (id: string) => string;
}

export const useTemplateStore = create<TemplateState>((set, get) => ({
  templates: [],
  drafts: {},
  
  setTemplates: (templates) => {
    localStorage.setItem('docforge_editable_templates', JSON.stringify(templates));
    set({ templates });
  },

  syncFromStorage: () => {
    try {
      const stored = localStorage.getItem('docforge_editable_templates');
      const draftsStored = localStorage.getItem('docforge_template_drafts');
      
      if (stored) {
        set({ templates: JSON.parse(stored) });
      } else {

        const defaultTemplates: EditableTemplate[] = [
          {
            id: 'template-brd',
            name: 'Business Requirements (BRD)',
            category: 'business',
            description: 'Business requirement management workspace.',
            tags: ['Planning', 'Strategy'],
            status: 'Published',
            visibility: 'Global',
            lastEdited: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            version: 'v1.0',
            blocks: [], // Will be filled dynamically if empty or from page.tsx
            versions: []
          },
          {
            id: 'template-frd',
            name: 'Feature Requirements (FRD)',
            category: 'business',
            description: 'Feature and functional specifications map.',
            tags: ['Features', 'Product'],
            status: 'Published',
            visibility: 'Global',
            lastEdited: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            version: 'v1.0',
            blocks: [],
            versions: []
          }
        ];
        localStorage.setItem('docforge_editable_templates', JSON.stringify(defaultTemplates));
        set({ templates: defaultTemplates });

      }
      
      if (draftsStored) {
        set({ drafts: JSON.parse(draftsStored) });
      }
    } catch (e) {
      console.error("Failed to sync templates from storage", e);
    }
  },

  saveTemplate: (id, blocks, createSnapshot = false, changesDescription = "") => {
    set((state) => {
      const updated = state.templates.map(t => {
        if (t.id === id) {
          const newVersion = createSnapshot ? incrementVersion(t.version) : t.version;
          const newVersions = createSnapshot 
            ? [...t.versions, { version: t.version, timestamp: new Date().toISOString(), blocks: [...t.blocks], changesDescription }]
            : t.versions;
            
          return {
            ...t,
            blocks,
            version: newVersion,
            versions: newVersions.slice(-10), // Keep only last 10 versions
            lastEdited: new Date().toISOString(),
            status: t.status === 'Draft' ? 'Published' : t.status
          };
        }
        return t;
      });
      
      localStorage.setItem('docforge_editable_templates', JSON.stringify(updated));
      
      // Clear draft on successful save
      const newDrafts = { ...state.drafts };
      delete newDrafts[id];
      localStorage.setItem('docforge_template_drafts', JSON.stringify(newDrafts));

      return { templates: updated, drafts: newDrafts };
    });
  },

  saveAsNewTemplate: (templateData, blocks) => {
    const id = `tmpl_\${Date.now()}_\${Math.random().toString(36).substring(2, 9)}`;
    const newTemplate: EditableTemplate = {
      ...templateData,
      id,
      createdAt: new Date().toISOString(),
      lastEdited: new Date().toISOString(),
      version: 'v1.0',
      blocks,
      versions: [],
    };
    
    set((state) => {
      const updated = [...state.templates, newTemplate];
      localStorage.setItem('docforge_editable_templates', JSON.stringify(updated));
      return { templates: updated };
    });
    
    return id;
  },

  saveDraft: (id, blocks) => {
    set((state) => {
      const newDrafts = { ...state.drafts, [id]: blocks };
      localStorage.setItem('docforge_template_drafts', JSON.stringify(newDrafts));
      return { drafts: newDrafts };
    });
  },

  clearDraft: (id) => {
    set((state) => {
      const newDrafts = { ...state.drafts };
      delete newDrafts[id];
      localStorage.setItem('docforge_template_drafts', JSON.stringify(newDrafts));
      return { drafts: newDrafts };
    });
  },

  restoreVersion: (templateId, versionString) => {
    set((state) => {
      const updated = state.templates.map(t => {
        if (t.id === templateId) {
          const targetVersion = t.versions.find(v => v.version === versionString);
          if (targetVersion) {
            return {
              ...t,
              blocks: targetVersion.blocks,
              lastEdited: new Date().toISOString(),
              // We create a new snapshot of the pre-restore state just in case
              versions: [...t.versions, { version: t.version, timestamp: new Date().toISOString(), blocks: [...t.blocks], changesDescription: `Auto-save before restoring \${versionString}` }].slice(-10)
            };
          }
        }
        return t;
      });
      localStorage.setItem('docforge_editable_templates', JSON.stringify(updated));
      return { templates: updated };
    });
  },

  deleteTemplate: (id) => {
    set((state) => {
      const updated = state.templates.filter(t => t.id !== id);
      localStorage.setItem('docforge_editable_templates', JSON.stringify(updated));
      return { templates: updated };
    });
  },

  duplicateTemplate: (id) => {
    let newId = '';
    set((state) => {
      const target = state.templates.find(t => t.id === id);
      if (!target) return state;
      
      newId = `tmpl_\${Date.now()}_\${Math.random().toString(36).substring(2, 9)}`;
      const duplicated: EditableTemplate = {
        ...target,
        id: newId,
        name: `${target.name} (Copy)`,
        status: 'Draft',
        createdAt: new Date().toISOString(),
        lastEdited: new Date().toISOString(),
        version: 'v1.0',
        versions: [],
        baseTemplateId: target.id
      };
      
      const updated = [...state.templates, duplicated];
      localStorage.setItem('docforge_editable_templates', JSON.stringify(updated));
      return { templates: updated };
    });
    return newId;
  }
}));

// Helper to bump version, e.g. v1.4 -> v1.5
function incrementVersion(ver: string): string {
  const match = ver.match(/^v(\d+)\.(\d+)$/);
  if (match) {
    const major = parseInt(match[1]);
    const minor = parseInt(match[2]);
    return `v\${major}.\${minor + 1}`;
  }
  return `${ver}_new`;
}
