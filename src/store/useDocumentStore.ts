import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CustomBlock } from '@/components/CustomDocumentEditor';

export interface DocumentVersion {
  versionId: string;
  timestamp: string;
  data: CustomBlock[];
  updatedBy?: string;
  commitMessage?: string;
}

export interface DocumentActivity {
  id: string;
  action: 'Created' | 'Updated' | 'Deleted' | 'Archived' | 'Restored' | 'Duplicated' | 'Exported';
  timestamp: string;
  user: string;
  details?: string;
}

export interface UnifiedDocument {
  id: string;
  title: string;
  docType: string;          // e.g., 'brd', 'custom', 'srs'
  workspaceId?: string;     // maps to projectId
  moduleId?: string;        // mapped feature module
  status: string;           // 'Draft', 'In Review', 'Published', 'Needs Approval'
  createdAt: string;
  updatedAt: string;
  owner: string;
  isArchived: boolean;
  isDeleted: boolean;
  isAiGenerated: boolean;
  wordCount: number;
  completionPercentage: number;
  data: CustomBlock[];
  versionHistory: DocumentVersion[];
  activityFeed: DocumentActivity[];
}

interface DocumentStore {
  documents: UnifiedDocument[];
  createDocument: (doc: Partial<UnifiedDocument>) => UnifiedDocument;
  updateDocument: (id: string, updates: Partial<UnifiedDocument>, commitMessage?: string) => void;
  deleteDocument: (id: string, hardDelete?: boolean) => void;
  duplicateDocument: (id: string) => UnifiedDocument | undefined;
  archiveDocument: (id: string) => void;
  restoreDocument: (id: string) => void;
  syncFromLegacyStorage: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 11);

export const useDocumentStore = create<DocumentStore>()(
  persist(
    (set, get) => ({
      documents: [],
      createDocument: (docParams) => {
        const id = docParams.id || generateId();
        
        // Ensure new documents map to the active workspace automatically
        let resolvedWorkspaceId = docParams.workspaceId;
        if (!resolvedWorkspaceId && typeof window !== 'undefined') {
          // Dynamic import or direct localStorage fallback to prevent cycle issues initially
          resolvedWorkspaceId = localStorage.getItem('docforge_active_workspace') || undefined;
        }

          const newActivity: DocumentActivity = {
            id: generateId(),
            action: 'Created',
            timestamp: new Date().toISOString(),
            user: docParams.owner || 'Siddiq Admin'
          };

          const newDoc: UnifiedDocument = {
            id,
            title: docParams.title || 'Untitled Document',
            docType: docParams.docType || 'custom',
            workspaceId: resolvedWorkspaceId,
            moduleId: docParams.moduleId,
            status: docParams.status || 'Draft',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            owner: docParams.owner || 'Siddiq Admin',
            isArchived: false,
            isDeleted: false,
            isAiGenerated: !!docParams.isAiGenerated,
            wordCount: docParams.wordCount || 0,
            completionPercentage: docParams.completionPercentage || 0,
            data: docParams.data || [],
            versionHistory: [],
            activityFeed: [newActivity]
          };

        set((state) => ({ documents: [newDoc, ...state.documents] }));
        return newDoc;
      },
      updateDocument: (id, updates, commitMessage) => {
        set((state) => {
          const docIndex = state.documents.findIndex(d => d.id === id);
          if (docIndex === -1) return state;

          const doc = state.documents[docIndex];
          const updatedDoc = { ...doc, ...updates, updatedAt: new Date().toISOString() };
          
          // Create a version snapshot if data changed significantly
          if (updates.data) {
            const version: DocumentVersion = {
              versionId: `v_${Date.now()}`,
              timestamp: new Date().toISOString(),
              data: doc.data,
              updatedBy: updatedDoc.owner,
              commitMessage: commitMessage || 'Auto-save snapshot'
            };
            updatedDoc.versionHistory = [version, ...doc.versionHistory].slice(0, 10); // Keep last 10 versions
          }

          const newActivity: DocumentActivity = {
            id: generateId(),
            action: 'Updated',
            timestamp: new Date().toISOString(),
            user: updatedDoc.owner,
            details: commitMessage
          };
          updatedDoc.activityFeed = [newActivity, ...doc.activityFeed].slice(0, 50);

          const newDocs = [...state.documents];
          newDocs[docIndex] = updatedDoc;
          return { documents: newDocs };
        });
      },
      deleteDocument: (id, hardDelete = false) => {
        set((state) => {
          if (hardDelete) {
            return { documents: state.documents.filter(d => d.id !== id) };
          }
          return {
            documents: state.documents.map(d => 
              d.id === id 
                ? { 
                    ...d, 
                    isDeleted: true, 
                    updatedAt: new Date().toISOString(),
                    activityFeed: [{
                      id: generateId(),
                      action: 'Deleted' as const,
                      timestamp: new Date().toISOString(),
                      user: d.owner
                    }, ...d.activityFeed]
                  } 
                : d
            )
          };
        });
      },
      duplicateDocument: (id) => {
        const doc = get().documents.find(d => d.id === id);
        if (!doc) return undefined;
        
        const cloneId = generateId();
        const clone: UnifiedDocument = {
          ...doc,
          id: cloneId,
          title: `${doc.title} (Copy)`,
          status: 'Draft',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isArchived: false,
          isDeleted: false,
          versionHistory: [],
          activityFeed: [{
            id: generateId(),
            action: 'Duplicated' as const,
            timestamp: new Date().toISOString(),
            user: doc.owner,
            details: `Cloned from ${doc.title}`
          }]
        };
        
        set((state) => ({ documents: [clone, ...state.documents] }));
        return clone;
      },
      archiveDocument: (id) => {
        set((state) => ({
          documents: state.documents.map(d => 
            d.id === id 
              ? { 
                  ...d, 
                  isArchived: true, 
                  updatedAt: new Date().toISOString(),
                  activityFeed: [{
                    id: generateId(),
                    action: 'Archived' as const,
                    timestamp: new Date().toISOString(),
                    user: d.owner
                  }, ...d.activityFeed]
                } 
              : d
          )
        }));
      },
      restoreDocument: (id) => {
        set((state) => ({
          documents: state.documents.map(d => 
            d.id === id 
              ? { 
                  ...d, 
                  isArchived: false, 
                  isDeleted: false,
                  updatedAt: new Date().toISOString(),
                  activityFeed: [{
                    id: generateId(),
                    action: 'Restored' as const,
                    timestamp: new Date().toISOString(),
                    user: d.owner
                  }, ...d.activityFeed]
                } 
              : d
          )
        }));
      },
      syncFromLegacyStorage: () => {
        // Only run once if empty
        if (get().documents.length > 0) return;

        try {
          const migratedDocs: UnifiedDocument[] = [];
          
          // 1. Get from docforge_saved_documents
          const savedStr = localStorage.getItem('docforge_saved_documents');
          let savedDocs: any[] = [];
          if (savedStr) {
            savedDocs = JSON.parse(savedStr);
          }

          // 2. Get from docforge_docs_meta
          const metaStr = localStorage.getItem('docforge_docs_meta');
          let metaList: any[] = [];
          if (metaStr) {
            metaList = JSON.parse(metaStr);
          }

          // Process Saved Documents first
          savedDocs.forEach(sd => {
            const docId = sd.id;
            const existingMeta = metaList.find(m => m.id === docId);
            
            migratedDocs.push({
              id: docId,
              title: sd.title || existingMeta?.title || 'Untitled',
              docType: sd.templateId || existingMeta?.type || 'custom',
              workspaceId: sd.projectId || existingMeta?.projectId,
              status: sd.status || 'Draft',
              createdAt: existingMeta?.lastSaved ? new Date(existingMeta.lastSaved).toISOString() : new Date().toISOString(),
              updatedAt: sd.updatedAt || new Date().toISOString(),
              owner: 'Siddiq Admin',
              isArchived: false,
              isDeleted: false,
              isAiGenerated: !!sd.isAiGenerated,
              wordCount: sd.wordCount || 0,
              completionPercentage: 100, // mock
              data: sd.data || [],
              versionHistory: sd.versionHistory || [],
              activityFeed: [{
                id: generateId(),
                action: 'Created' as const,
                timestamp: sd.updatedAt || new Date().toISOString(),
                user: 'Siddiq Admin',
                details: 'Migrated from legacy storage'
              }]
            });
          });

          // Process Meta files that aren't in Saved Documents (e.g. newly created templates)
          metaList.forEach(m => {
            if (!migratedDocs.some(md => md.id === m.id) && !m.isTemplate) {
              let data: any[] = [];
              const rootData = localStorage.getItem(`doc_root_${m.id}`);
              if (rootData) {
                try {
                  data = JSON.parse(rootData);
                } catch(e){}
              }

              migratedDocs.push({
                id: m.id,
                title: m.title || 'Untitled',
                docType: m.type || 'custom',
                workspaceId: m.projectId,
                status: 'Draft',
                createdAt: m.lastSaved ? new Date(m.lastSaved).toISOString() : new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                owner: 'Siddiq Admin',
                isArchived: false,
                isDeleted: false,
                isAiGenerated: false,
                wordCount: 0,
                completionPercentage: 0,
                data: data,
                versionHistory: [],
                activityFeed: [{
                  id: generateId(),
                  action: 'Created' as const,
                  timestamp: new Date().toISOString(),
                  user: 'Siddiq Admin',
                  details: 'Migrated from meta storage'
                }]
              });
            }
          });

          if (migratedDocs.length > 0) {
            set({ documents: migratedDocs });
          }
        } catch (e) {
          console.error("Migration failed", e);
        }
      }
    }),
    {
      name: 'docforge_unified_documents'
    }
  )
);
