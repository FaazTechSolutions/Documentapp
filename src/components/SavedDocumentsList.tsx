"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { getSavedDocuments, deleteDocument, SavedDocument } from '@/lib/storage';
import { FileText, Trash2, Clock, Plus, LayoutTemplate, Download } from 'lucide-react';
import { generateCustomMarkdown } from '@/lib/markdown';
import { exportToMarkdown, exportToText, exportToPdf, exportToDocx } from '@/lib/export';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

export default function SavedDocumentsList() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const format = searchParams.get('format');
  const projectIdFilter = searchParams.get('projectId');
  const [documents, setDocuments] = useState<SavedDocument[]>([]);
  const [isExporting, setIsExporting] = useState<string | null>(null);

  useEffect(() => {
    let docs = getSavedDocuments().sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    if (projectIdFilter) {
      docs = docs.filter(d => String(d.projectId) === String(projectIdFilter));
    }
    setDocuments(docs);
  }, [projectIdFilter]);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      deleteDocument(id);
      let docs = getSavedDocuments().sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      if (projectIdFilter) {
        docs = docs.filter(d => String(d.projectId) === String(projectIdFilter));
      }
      setDocuments(docs);
    }
  };

  const handleExport = async (doc: SavedDocument) => {
    setIsExporting(doc.id);
    const md = generateCustomMarkdown(doc.title, doc.data);
    const filename = doc.title.toLowerCase().replace(/\s+/g, '-');
    
    setTimeout(() => {
      if (format === 'md') exportToMarkdown(md, filename);
      else if (format === 'txt') exportToText(md, filename);
      else if (format === 'docx') exportToDocx(md, filename);
      else if (format === 'pdf') exportToPdf(`hidden-render-${doc.id}`, filename);
      setIsExporting(null);
    }, 100);
  };

  const getPageTitle = () => {
    if (format === 'md') return 'Saved Documents: Markdown (.md)';
    if (format === 'txt') return 'Saved Documents: Text (.txt)';
    if (format === 'docx') return 'Saved Documents: Word (.docx)';
    if (format === 'pdf') return 'Saved Documents: PDF (.pdf)';
    return 'Saved Documents';
  };

  const getProjectName = () => {
    if (!projectIdFilter) return '';
    try {
      const projects = JSON.parse(localStorage.getItem('docforge_projects') || '[]');
      const found = projects.find((p: any) => String(p.id) === String(projectIdFilter));
      return found ? found.name : 'Unknown Folder';
    } catch (e) {
      return 'Folder';
    }
  };

  return (
    <div style={{ padding: '3rem', maxWidth: '1000px', margin: '0 auto', height: '100%' }} className="animate-fade-in">
      {projectIdFilter && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '1rem' }}>
          <Link href="/?tab=projects" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>Folders & Projects</Link>
          <span>/</span>
          <span style={{ color: 'var(--primary)' }}>{getProjectName()}</span>
        </div>
      )}
      <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {projectIdFilter ? `📂 ${getProjectName()}` : getPageTitle()}
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            {projectIdFilter ? 'Displaying documents inside this folder workspace.' : format ? `Click Download to export your saved documents as ${format.toUpperCase()}` : 'Manage your locally saved documents.'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {projectIdFilter && (
            <Link href="/?tab=projects" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              ← Back to Folders
            </Link>
          )}
          <button 
              onClick={() => {
              // Remove the direct custom document creation
              // And instead route to templates tab while passing projectId
              router.push(`/?tab=templates&projectId=${projectIdFilter}`);
            }}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={18} /> {projectIdFilter ? 'Choose Template in Project' : 'New Document'}
          </button>
        </div>
      </header>

      {documents.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--surface)', borderRadius: '12px', border: '1px dashed var(--border)' }}>
          <div style={{ display: 'inline-flex', padding: '1.5rem', background: 'var(--background)', borderRadius: '50%', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            <FileText size={48} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>No saved documents</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>You haven't saved any documents yet. Create one and click "Save".</p>
          <Link href="/?tab=builder" className="btn btn-primary">Start Building</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {documents.map(doc => (
            <div key={doc.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'transform 0.2s, border-color 0.2s', border: '1px solid var(--border)' }}>
              
              {/* Hidden Render Node for PDF Export */}
              {format === 'pdf' && (
                 <div id={`hidden-render-${doc.id}`} className="doc-preview" style={{ position: 'absolute', top: '-9999px', left: '-9999px', width: '800px', padding: '40px', background: 'white', color: 'black' }}>
                   <ReactMarkdown rehypePlugins={[rehypeRaw]}>{generateCustomMarkdown(doc.title, doc.data)}</ReactMarkdown>
                 </div>
              )}

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
                <div style={{ padding: '1rem', background: 'rgba(2, 132, 199, 0.1)', borderRadius: '12px', color: 'var(--primary)' }}>
                  <LayoutTemplate size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    <Link href={`/?tab=builder&id=${doc.id}`} style={{ color: 'var(--text-main)', textDecoration: 'none' }}>
                      {doc.title}
                    </Link>
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <LayoutTemplate size={14} /> Custom Builder
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={14} /> {new Date(doc.updatedAt).toLocaleDateString()} at {new Date(doc.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {format ? (
                  <>
                    <Link href={`/?tab=builder&id=${doc.id}`} className="btn btn-secondary">
                      Edit
                    </Link>
                    <button onClick={() => handleExport(doc)} disabled={isExporting === doc.id} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Download size={18} /> {isExporting === doc.id ? 'Exporting...' : `Download ${format.toUpperCase()}`}
                    </button>
                  </>
                ) : (
                  <Link href={`/?tab=builder&id=${doc.id}`} className="btn btn-primary">
                    Edit
                  </Link>
                )}
                
                <button onClick={() => handleDelete(doc.id)} className="btn btn-secondary" style={{ color: '#ef4444', borderColor: 'transparent', background: 'rgba(239, 68, 68, 0.1)' }} title="Delete Document">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

