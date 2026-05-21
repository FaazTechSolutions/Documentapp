export interface SavedDocument {
  id: string;
  title: string;
  templateId: string; // 'custom' or specific template ID
  updatedAt: string;
  data: any; // Record<string, string> for standard, CustomBlock[] for custom
  projectId?: string;
}

const STORAGE_KEY = 'docforge_saved_documents';

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
  
  const docToSave = { ...doc, updatedAt: new Date().toISOString() };
  
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
