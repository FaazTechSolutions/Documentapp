export interface DocumentVersion {
  versionId: string;
  timestamp: string;
  data: any;
}

export interface SavedDocument {
  id: string;
  title: string;
  templateId: string; // 'custom' or specific template ID
  updatedAt: string;
  data: any; // Record<string, string> for standard, CustomBlock[] for custom
  projectId?: string;
  status?: string; // 'Draft', 'Published', 'In Review'
  wordCount?: number;
  isAiGenerated?: boolean;
  versionHistory?: DocumentVersion[];
}

const STORAGE_KEY = 'docforge_saved_documents';

export function generateDocumentId(prefix: string = 'doc'): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 7);
  return `${prefix}_${timestamp}_${randomStr}`;
}

export function getSavedDocuments(): SavedDocument[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error('Failed to parse saved documents', e);
    return [];
  }
}

export function getSavedDocument(id: string): SavedDocument | undefined {
  const docs = getSavedDocuments();
  return docs.find(d => d.id === id);
}

export function saveDocument(doc: SavedDocument) {
  if (typeof window === 'undefined') return;
  const docs = getSavedDocuments();
  const existingIndex = docs.findIndex(d => d.id === doc.id);
  
  // Create a version snapshot
  const snapshot: DocumentVersion = {
    versionId: `v_${Date.now()}`,
    timestamp: new Date().toISOString(),
    data: doc.data
  };

  const existingDoc = existingIndex >= 0 ? docs[existingIndex] : null;
  const versionHistory = existingDoc?.versionHistory || [];
  
  // Keep only last 5 versions
  versionHistory.unshift(snapshot);
  if (versionHistory.length > 5) {
    versionHistory.pop();
  }

  const docToSave: SavedDocument = { 
    ...existingDoc,
    ...doc, 
    updatedAt: new Date().toISOString(),
    versionHistory 
  };
  
  if (existingIndex >= 0) {
    docs[existingIndex] = docToSave;
  } else {
    docs.push(docToSave);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
}

export function deleteDocument(id: string) {
  if (typeof window === 'undefined') return;
  const docs = getSavedDocuments();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(docs.filter(d => d.id !== id)));
}
