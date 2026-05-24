import { useDocumentStore } from '@/store/useDocumentStore';
import { CustomBlock } from '@/components/CustomDocumentEditor';

export interface DocumentVersion {
  versionId: string;
  timestamp: string;
  data: any;
}

export interface SavedDocument {
  id: string;
  title: string;
  templateId: string;
  updatedAt: string;
  data: any;
  projectId?: string;
  status?: string;
  wordCount?: number;
  isAiGenerated?: boolean;
  versionHistory?: DocumentVersion[];
}

export function generateDocumentId(prefix: string = 'doc'): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 7);
  return `${prefix}_${timestamp}_${randomStr}`;
}

export function getSavedDocuments(): SavedDocument[] {
  if (typeof window === 'undefined') return [];
  const state = useDocumentStore.getState();
  // Ensure we migrate if empty but try not to call it in tight loops if possible
  if (state.documents.length === 0) {
    state.syncFromLegacyStorage();
  }
  
  // Transform back to SavedDocument interface for legacy support
  return useDocumentStore.getState().documents.map(d => ({
    id: d.id,
    title: d.title,
    templateId: d.docType,
    updatedAt: d.updatedAt,
    data: d.data,
    projectId: d.workspaceId,
    status: d.status,
    wordCount: d.wordCount,
    isAiGenerated: d.isAiGenerated,
    versionHistory: d.versionHistory as unknown as DocumentVersion[]
  }));
}

export function getSavedDocument(id: string): SavedDocument | undefined {
  const docs = getSavedDocuments();
  return docs.find(d => d.id === id);
}

export function saveDocument(doc: SavedDocument) {
  if (typeof window === 'undefined') return;
  const store = useDocumentStore.getState();
  
  // Check if it exists
  const exists = store.documents.some(d => d.id === doc.id);
  
  if (exists) {
    store.updateDocument(doc.id, {
      title: doc.title,
      docType: doc.templateId,
      workspaceId: doc.projectId,
      status: doc.status,
      wordCount: doc.wordCount,
      isAiGenerated: doc.isAiGenerated,
      data: doc.data as CustomBlock[]
    }, 'Manual Save');
  } else {
    store.createDocument({
      id: doc.id,
      title: doc.title,
      docType: doc.templateId,
      workspaceId: doc.projectId,
      status: doc.status,
      wordCount: doc.wordCount,
      isAiGenerated: doc.isAiGenerated,
      data: doc.data as CustomBlock[]
    });
  }
}

export function deleteDocument(id: string) {
  if (typeof window === 'undefined') return;
  useDocumentStore.getState().deleteDocument(id, true);
}
