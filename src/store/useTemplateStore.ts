import * as Initializers from '@/lib/templateInitializers';
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
      const stored = typeof window !== 'undefined' ? localStorage.getItem('docforge_editable_templates') : null;
      const draftsStored = typeof window !== 'undefined' ? localStorage.getItem('docforge_template_drafts') : null;
      const v2Flag = typeof window !== 'undefined' ? localStorage.getItem('docforge_templates_v2') : null;
      
      if (stored && v2Flag === 'true') {
        set({ templates: JSON.parse(stored) });
      } else {
        const defaultTemplates: EditableTemplate[] = [
          // Business
          { id: 'template-brd', name: 'Business Requirements (BRD)', category: 'business', description: 'Business requirement management workspace.', tags: ['Planning', 'Strategy'], status: 'Published', visibility: 'Global', lastEdited: new Date().toISOString(), createdAt: new Date().toISOString(), version: 'v1.0', blocks: Initializers.getBrdTemplateBlocks('BRD'), versions: [] },
          { id: 'template-frd', name: 'Feature Requirements (FRD)', category: 'business', description: 'Feature and functional specifications map.', tags: ['Features', 'Product'], status: 'Published', visibility: 'Global', lastEdited: new Date().toISOString(), createdAt: new Date().toISOString(), version: 'v1.0', blocks: Initializers.getFrdTemplateBlocks('FRD'), versions: [] },
          { id: 'template-srs', name: 'Software Requirements (SRS)', category: 'business', description: 'System requirements and architecture definition.', tags: ['Architecture', 'Technical'], status: 'Published', visibility: 'Global', lastEdited: new Date().toISOString(), createdAt: new Date().toISOString(), version: 'v1.0', blocks: Initializers.getEnterpriseSrsTemplateBlocks('SRS'), versions: [] },
          { id: 'template-tdd', name: 'Technical Design (TDD)', category: 'business', description: 'Engineering schemas and system design docs.', tags: ['Engineering', 'Backend'], status: 'Published', visibility: 'Global', lastEdited: new Date().toISOString(), createdAt: new Date().toISOString(), version: 'v1.0', blocks: Initializers.getTddTemplateBlocks('TDD'), versions: [] },
          
          // Agile
          { id: 'template-sprint', name: 'Sprint Planning', category: 'agile', description: 'Sprint backlog and capacity planning.', tags: ['Agile', 'Scrum'], status: 'Published', visibility: 'Global', lastEdited: new Date().toISOString(), createdAt: new Date().toISOString(), version: 'v1.0', blocks: [], versions: [] },
          { id: 'template-backlog', name: 'Product Backlog', category: 'agile', description: 'Master feature and user story list.', tags: ['Product', 'Agile'], status: 'Published', visibility: 'Global', lastEdited: new Date().toISOString(), createdAt: new Date().toISOString(), version: 'v1.0', blocks: [], versions: [] },
          { id: 'template-risk', name: 'Risk Register', category: 'agile', description: 'Track project risks and mitigation.', tags: ['Management', 'Risk'], status: 'Published', visibility: 'Global', lastEdited: new Date().toISOString(), createdAt: new Date().toISOString(), version: 'v1.0', blocks: [], versions: [] },
          
          // QA
          { id: 'template-testplan', name: 'Master Test Plan', category: 'qa', description: 'QA strategy and coverage outline.', tags: ['QA', 'Strategy'], status: 'Published', visibility: 'Global', lastEdited: new Date().toISOString(), createdAt: new Date().toISOString(), version: 'v1.0', blocks: Initializers.getTestPlanTemplateBlocks('Test Plan'), versions: [] },
          { id: 'template-testcases', name: 'Test Cases & Suites', category: 'qa', description: 'Detailed execution test steps.', tags: ['Testing', 'Execution'], status: 'Published', visibility: 'Global', lastEdited: new Date().toISOString(), createdAt: new Date().toISOString(), version: 'v1.0', blocks: Initializers.getTestCasesTemplateBlocks('Test Cases'), versions: [] },
          { id: 'template-buglog', name: 'Bug & Defect Log', category: 'qa', description: 'Track discovered system issues.', tags: ['QA', 'Triage'], status: 'Published', visibility: 'Global', lastEdited: new Date().toISOString(), createdAt: new Date().toISOString(), version: 'v1.0', blocks: Initializers.getBugLogTemplateBlocks('Bug Log'), versions: [] },
          { id: 'template-uat', name: 'UAT Sign-off', category: 'qa', description: 'User acceptance criteria and sign-off.', tags: ['UAT', 'Approvals'], status: 'Published', visibility: 'Global', lastEdited: new Date().toISOString(), createdAt: new Date().toISOString(), version: 'v1.0', blocks: Initializers.getUatTemplateBlocks('UAT'), versions: [] },
          
          // DevOps
          { id: 'template-deploy', name: 'Deployment Guide', category: 'devops', description: 'Step-by-step release procedures.', tags: ['DevOps', 'Release'], status: 'Published', visibility: 'Global', lastEdited: new Date().toISOString(), createdAt: new Date().toISOString(), version: 'v1.0', blocks: Initializers.getDevopsDeployTemplateBlocks('Deploy'), versions: [] },
          { id: 'template-server', name: 'Server Configuration', category: 'devops', description: 'Infrastructure and hardware specs.', tags: ['Infra', 'Server'], status: 'Published', visibility: 'Global', lastEdited: new Date().toISOString(), createdAt: new Date().toISOString(), version: 'v1.0', blocks: Initializers.getDevopsServerTemplateBlocks('Server'), versions: [] },
          { id: 'template-pipeline', name: 'CI/CD Pipeline', category: 'devops', description: 'Automation workflow documentation.', tags: ['Automation', 'CI/CD'], status: 'Published', visibility: 'Global', lastEdited: new Date().toISOString(), createdAt: new Date().toISOString(), version: 'v1.0', blocks: Initializers.getDevopsPipelineTemplateBlocks('Pipeline'), versions: [] },
          { id: 'template-backup', name: 'Backup Strategy', category: 'devops', description: 'Disaster recovery procedures.', tags: ['Security', 'Recovery'], status: 'Published', visibility: 'Global', lastEdited: new Date().toISOString(), createdAt: new Date().toISOString(), version: 'v1.0', blocks: Initializers.getDevopsBackupTemplateBlocks('Backup'), versions: [] },
          { id: 'template-env', name: 'Environment Setup', category: 'devops', description: 'Local and staging env configurations.', tags: ['Config', 'Setup'], status: 'Published', visibility: 'Global', lastEdited: new Date().toISOString(), createdAt: new Date().toISOString(), version: 'v1.0', blocks: Initializers.getDevopsEnvTemplateBlocks('Environment'), versions: [] },
          { id: 'template-monitor', name: 'Monitoring Alerts', category: 'devops', description: 'System health and alert thresholds.', tags: ['Monitoring', 'SRE'], status: 'Published', visibility: 'Global', lastEdited: new Date().toISOString(), createdAt: new Date().toISOString(), version: 'v1.0', blocks: Initializers.getDevopsMonitorTemplateBlocks('Monitor'), versions: [] },
          
          // Support
          { id: 'template-usermanual', name: 'End-User Manual', category: 'support', description: 'Customer facing documentation.', tags: ['Manual', 'Docs'], status: 'Published', visibility: 'Global', lastEdited: new Date().toISOString(), createdAt: new Date().toISOString(), version: 'v1.0', blocks: Initializers.getSupportUserManualBlocks('User Manual'), versions: [] },
          { id: 'template-adminmanual', name: 'Admin Guide', category: 'support', description: 'System administrator procedures.', tags: ['Admin', 'Docs'], status: 'Published', visibility: 'Global', lastEdited: new Date().toISOString(), createdAt: new Date().toISOString(), version: 'v1.0', blocks: Initializers.getSupportAdminManualBlocks('Admin Guide'), versions: [] },
          { id: 'template-faq', name: 'FAQ & Help', category: 'support', description: 'Common questions and resolutions.', tags: ['Support', 'Docs'], status: 'Published', visibility: 'Global', lastEdited: new Date().toISOString(), createdAt: new Date().toISOString(), version: 'v1.0', blocks: Initializers.getSupportFaqBlocks('FAQ'), versions: [] },
          { id: 'template-troubleshoot', name: 'Troubleshooting', category: 'support', description: 'Diagnostic steps for system issues.', tags: ['Support', 'Engineering'], status: 'Published', visibility: 'Global', lastEdited: new Date().toISOString(), createdAt: new Date().toISOString(), version: 'v1.0', blocks: Initializers.getSupportTroubleshootBlocks('Troubleshoot'), versions: [] },
          { id: 'template-releasenotes', name: 'Release Notes', category: 'support', description: 'Changelog and version announcements.', tags: ['Product', 'Updates'], status: 'Published', visibility: 'Global', lastEdited: new Date().toISOString(), createdAt: new Date().toISOString(), version: 'v1.0', blocks: Initializers.getSupportReleaseNotesBlocks('Release Notes'), versions: [] }
        ];

        if (typeof window !== 'undefined') {
          localStorage.setItem('docforge_editable_templates', JSON.stringify(defaultTemplates));
          localStorage.setItem('docforge_templates_v2', 'true');
        }
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
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('docforge_editable_templates', JSON.stringify(updated));
        
        // Clear draft on successful save
        const newDrafts = { ...state.drafts };
        delete newDrafts[id];
        localStorage.setItem('docforge_template_drafts', JSON.stringify(newDrafts));
        return { templates: updated, drafts: newDrafts };
      }
      return { templates: updated };
    });
  },

  saveAsNewTemplate: (templateData, blocks) => {
    const id = `tmpl_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
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
      if (typeof window !== 'undefined') {
        localStorage.setItem('docforge_editable_templates', JSON.stringify(updated));
      }
      return { templates: updated };
    });
    
    return id;
  },

  saveDraft: (id, blocks) => {
    set((state) => {
      const newDrafts = { ...state.drafts, [id]: blocks };
      if (typeof window !== 'undefined') {
        localStorage.setItem('docforge_template_drafts', JSON.stringify(newDrafts));
      }
      return { drafts: newDrafts };
    });
  },

  clearDraft: (id) => {
    set((state) => {
      const newDrafts = { ...state.drafts };
      delete newDrafts[id];
      if (typeof window !== 'undefined') {
        localStorage.setItem('docforge_template_drafts', JSON.stringify(newDrafts));
      }
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
              versions: [...t.versions, { version: t.version, timestamp: new Date().toISOString(), blocks: [...t.blocks], changesDescription: `Auto-save before restoring ${versionString}` }].slice(-10)
            };
          }
        }
        return t;
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('docforge_editable_templates', JSON.stringify(updated));
      }
      return { templates: updated };
    });
  },

  deleteTemplate: (id) => {
    set((state) => {
      const updated = state.templates.filter(t => t.id !== id);
      if (typeof window !== 'undefined') {
        localStorage.setItem('docforge_editable_templates', JSON.stringify(updated));
      }
      return { templates: updated };
    });
  },

  duplicateTemplate: (id) => {
    let newId = '';
    set((state) => {
      const target = state.templates.find(t => t.id === id);
      if (!target) return state;
      
      newId = `tmpl_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
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
      if (typeof window !== 'undefined') {
        localStorage.setItem('docforge_editable_templates', JSON.stringify(updated));
      }
      return { templates: updated };
    });
    return newId;
  }
}));

function incrementVersion(ver: string): string {
  const match = ver.match(/^v(\d+)\.(\d+)$/);
  if (match) {
    const major = parseInt(match[1]);
    const minor = parseInt(match[2]);
    return `v${major}.${minor + 1}`;
  }
  return `${ver}_new`;
}
