"use client";

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Download, FileText, File, Upload } from 'lucide-react';
import { exportToMarkdown, exportToText, exportToPdf, exportToDocx } from '@/lib/export';
import GithubModal from '@/components/GithubModal';

export default function QuickDraftEditor() {
  const [title, setTitle] = useState('Untitled Document');
  const [content, setContent] = useState('');
  const [isGithubModalOpen, setIsGithubModalOpen] = useState(false);

  const markdown = `# ${title}\n\n${content}`;

  return (
    <div style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column' }} className="animate-fade-in">
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Quick Draft</h1>
          <p style={{ color: 'var(--text-muted)' }}>Quickly draft a new document here, or choose Custom Builder from the sidebar for Notion-style dynamic blocks.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={() => exportToMarkdown(markdown, 'quick-doc')} className="btn btn-secondary" title="Download Markdown">
            <FileText size={18} /> MD
          </button>
          <button onClick={() => exportToText(markdown, 'quick-doc')} className="btn btn-secondary" title="Download Text">
            <FileText size={18} /> TXT
          </button>
          <button onClick={() => exportToDocx(markdown, 'quick-doc')} className="btn btn-secondary" title="Download DOCX">
            <File size={18} /> DOCX
          </button>
          <button onClick={() => exportToPdf('dashboard-preview', 'quick-doc')} className="btn btn-primary" title="Download PDF">
            <Download size={18} /> PDF
          </button>
          <button onClick={() => setIsGithubModalOpen(true)} className="btn btn-secondary" title="Push to GitHub" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: '#24292e', color: 'white', borderColor: '#24292e' }}>
            <Upload size={18} /> GitHub
          </button>
        </div>
      </header>

      <div className="editor-layout" style={{ flex: 1, minHeight: 0 }}>
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%', padding: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label">Document Title</label>
            <input 
              type="text" 
              className="form-input" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="Enter document title..."
            />
          </div>
          <div className="form-group" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <label className="form-label">Content (Markdown supported)</label>
            <textarea 
              className="form-textarea" 
              style={{ flex: 1, resize: 'none', fontFamily: 'monospace' }}
              value={content} 
              onChange={e => setContent(e.target.value)} 
              placeholder="Start writing your blank document here..."
            />
          </div>
        </div>

        <div className="glass-panel doc-preview" id="dashboard-preview" style={{ overflowY: 'auto', height: '100%', padding: '3rem', backgroundColor: 'white', borderRadius: 'var(--radius-lg)' }}>
          {content || title !== 'Untitled Document' ? (
            <ReactMarkdown>{markdown}</ReactMarkdown>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
              Live preview will appear here...
            </div>
          )}
        </div>
      </div>
      
      <GithubModal 
        isOpen={isGithubModalOpen} 
        onClose={() => setIsGithubModalOpen(false)} 
        markdownContent={markdown}
        defaultFilename="quick-doc"
      />
    </div>
  );
}
