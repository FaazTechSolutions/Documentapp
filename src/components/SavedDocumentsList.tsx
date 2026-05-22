"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { getSavedDocuments, deleteDocument, SavedDocument } from '@/lib/storage';
import { 
  FileText, Trash2, Clock, Plus, LayoutTemplate, Download, Edit2, 
  MoreVertical, Copy, Archive, Share2, Search, Filter, LayoutGrid, List,
  Eye, BarChart2, Users, Bot, Settings, Tag, Info, AlertTriangle, CheckCircle, ChevronRight, X
} from 'lucide-react';
import { useTemplateStore } from '@/store/useTemplateStore';
import { generateCustomMarkdown } from '@/lib/markdown';
import { exportToMarkdown, exportToText, exportToPdf, exportToDocx } from '@/lib/export';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';


const categories = [
  { id: 'business', label: 'Business Documents', icon: '💼', items: ['BRD', 'FRD', 'SRS', 'TDD'] },
  { id: 'agile', label: 'Agile & Project Management', icon: '🏃', items: ['Sprint Planning', 'Product Backlog', 'Risk Register', 'Change Requests'] },
  { id: 'qa', label: 'QA & Testing', icon: '🧪', items: ['Test Plan', 'Test Cases', 'Bug Reports', 'UAT'] },
  { id: 'devops', label: 'DevOps & Deployment', icon: '🚀', items: ['CI/CD', 'Deployment Guide', 'Monitoring', 'Infrastructure'] },
  { id: 'support', label: 'User & Support', icon: '📖', items: ['User Manual', 'FAQ', 'Troubleshooting', 'Release Notes'] }
];

const TemplateMarketplace = ({ onUseTemplate, projectIdFilter }: { onUseTemplate: (title: string, templateId: string, isBuilder?: boolean) => void, projectIdFilter: string | null }) => {
  const { templates, duplicateTemplate, deleteTemplate, syncFromStorage } = useTemplateStore();
  const [activeCategory, setActiveCategory] = useState('business');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [isHovering, setIsHovering] = useState<string | null>(null);

  useEffect(() => {
    syncFromStorage();
  }, [syncFromStorage]);

  useEffect(() => {
    if (templates.length > 0 && !selectedTemplate) {
      setSelectedTemplate(templates[0]);
    }
  }, [templates, selectedTemplate]);

  const filteredTemplates = templates.filter(t => 
    (activeCategory === 'all' || t.category === activeCategory) &&
    (t.name.toLowerCase().includes(searchQuery.toLowerCase()) || (t.tags && t.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))))
  );

  return (
    <div className="animate-fade-in transition-colors duration-300 ease-in-out" style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      minHeight: '80vh',
      background: 'var(--mkt-bg)',
      color: 'var(--mkt-text)',
      borderRadius: '16px',
      border: '1px solid var(--mkt-border)',
      overflow: 'hidden',
      fontFamily: "'Inter', sans-serif",
      boxShadow: 'var(--mkt-shadow)',
      marginTop: '3rem'
    }}>
      <div style={{ padding: '1.5rem 2rem', background: 'var(--mkt-glass)', borderBottom: '1px solid var(--mkt-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, background: 'linear-gradient(90deg, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Template Marketplace
          </h2>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--mkt-search-icon)' }}>🔍</span>
            <input 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search templates..." 
              style={{ width: '350px', padding: '0.6rem 1rem 0.6rem 2.5rem', background: 'var(--mkt-input)', border: '1px solid var(--mkt-border-light)', borderRadius: '8px', color: 'var(--mkt-text)', fontSize: '0.85rem', outline: 'none' }}
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ width: '260px', background: 'var(--mkt-panel)', borderRight: '1px solid var(--mkt-border)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          <div style={{ padding: '1.5rem 1.25rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--mkt-search-icon)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Template Categories</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div 
                onClick={() => setActiveCategory('all')}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.85rem', borderRadius: '8px', cursor: 'pointer', background: activeCategory === 'all' ? 'var(--mkt-accent-bg)' : 'transparent', borderLeft: `3px solid ${activeCategory === 'all' ? 'var(--mkt-accent)' : 'transparent'}`, color: activeCategory === 'all' ? 'var(--mkt-accent)' : 'var(--mkt-text)', fontWeight: activeCategory === 'all' ? 700 : 500, transition: 'all 0.2s' }}
              >
                <span>🌍</span> <span style={{ fontSize: '0.85rem' }}>All Templates</span>
              </div>
              
              {categories.map(cat => (
                <div key={cat.id}>
                  <div 
                    onClick={() => setActiveCategory(cat.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.85rem', borderRadius: '8px', cursor: 'pointer', background: activeCategory === cat.id ? 'var(--mkt-accent-bg)' : 'transparent', borderLeft: `3px solid ${activeCategory === cat.id ? 'var(--mkt-accent)' : 'transparent'}`, color: activeCategory === cat.id ? 'var(--mkt-accent)' : 'var(--mkt-text)', fontWeight: activeCategory === cat.id ? 700 : 500, transition: 'all 0.2s' }}
                  >
                    <span>{cat.icon}</span> <span style={{ fontSize: '0.85rem' }}>{cat.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', background: 'transparent' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              {activeCategory === 'all' ? 'All Templates' : categories.find(c => c.id === activeCategory)?.label}
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--mkt-muted)' }}>{filteredTemplates.length} templates available</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {filteredTemplates.map(tmpl => (
              <div 
                key={tmpl.id}
                onMouseEnter={() => setIsHovering(tmpl.id)}
                onMouseLeave={() => setIsHovering(null)}
                onClick={() => setSelectedTemplate(tmpl)}
                style={{ 
                  background: selectedTemplate?.id === tmpl.id ? 'var(--mkt-hover-strong)' : 'var(--mkt-card)', 
                  backdropFilter: 'blur(12px)',
                  borderRadius: '12px', 
                  border: `1px solid ${selectedTemplate?.id === tmpl.id ? 'var(--mkt-accent)' : isHovering === tmpl.id ? 'var(--mkt-border-hover)' : 'var(--mkt-border-light)'}`, 
                  padding: '1.25rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: isHovering === tmpl.id && selectedTemplate?.id !== tmpl.id ? 'translateY(-4px)' : 'translateY(0)',
                  boxShadow: selectedTemplate?.id === tmpl.id ? `0 0 0 1px var(--mkt-accent), 0 10px 25px -5px var(--mkt-glow)` : isHovering === tmpl.id ? 'var(--mkt-shadow-hover)' : 'var(--mkt-shadow)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: selectedTemplate?.id === tmpl.id ? 'var(--mkt-accent)' : 'transparent' }} />
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '1.75rem', background: 'var(--mkt-hover)', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px' }}>{tmpl.icon}</div>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '999px', background: tmpl.difficulty === 'Enterprise' ? 'rgba(139, 92, 246, 0.15)' : tmpl.difficulty === 'Advanced' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)', color: tmpl.difficulty === 'Enterprise' ? '#c4b5fd' : tmpl.difficulty === 'Advanced' ? '#fcd34d' : '#6ee7b7' }}>
                    {tmpl.difficulty}
                  </span>
                </div>
                
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem', color: selectedTemplate?.id === tmpl.id ? 'var(--mkt-accent)' : 'var(--mkt-text)' }}>{tmpl.name}</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--mkt-search-icon)', lineHeight: 1.4, marginBottom: '1.25rem', height: '34px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{tmpl.desc}</p>
                
                {isHovering === tmpl.id && selectedTemplate?.id !== tmpl.id && (
                  <div style={{ position: 'absolute', inset: 0, background: 'var(--mkt-glass)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 1, animation: 'fadeIn 0.2s ease-out' }}>
                    <button style={{ padding: '0.5rem 1rem', background: 'var(--mkt-accent)', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px var(--mkt-glow)' }}>
                      Preview Template
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ width: '340px', background: 'var(--mkt-panel)', borderLeft: '1px solid var(--mkt-border)', display: 'flex', flexDirection: 'column' }}>
          {selectedTemplate ? (
            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '2.5rem' }}>{selectedTemplate.icon}</div>
                <div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{selectedTemplate.name}</h2>
                  <div style={{ fontSize: '0.75rem', color: 'var(--mkt-search-icon)', marginTop: '0.2rem' }}>{selectedTemplate.category.toUpperCase()} WORKSPACE</div>
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--mkt-muted)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                {selectedTemplate.desc}
              </p>
              <button 
                onClick={() => onUseTemplate(selectedTemplate.name, selectedTemplate.id)}
                style={{ width: '100%', padding: '0.85rem', background: 'var(--mkt-accent)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 15px var(--mkt-glow)', transition: 'background 0.2s', marginBottom: '2rem' }}
              >
                Start With This Template
              </button>
            </div>
          ) : (
            <div style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--mkt-muted)' }}>
              Select a template to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


// Main SavedDocumentsList Component
export default function SavedDocumentsList({ useTemplate }: { useTemplate?: (title: string, templateIdOrType: string) => void }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const format = searchParams.get('format');
  const projectIdFilter = searchParams.get('projectId');
  
  const [documents, setDocuments] = useState<any[]>([]);
  const [isExporting, setIsExporting] = useState<string | null>(null);
  
  // New States
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [selectedPreviewDoc, setSelectedPreviewDoc] = useState<any>(null);

  useEffect(() => {
    // Load documents and mock missing metadata for enterprise feel
    let docs = getSavedDocuments().sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    if (projectIdFilter) {
      docs = docs.filter(d => String(d.projectId) === String(projectIdFilter));
    }
    
    // Enrich docs with mocked status and tags
    const enrichedDocs = docs.map((doc, idx) => {
      // Create deterministic mock status based on id length or index
      const statuses = ['Published', 'Draft', 'In Review', 'Needs Approval'];
      const status = statuses[idx % statuses.length];
      const isAiGenerated = idx % 3 === 0;
      const wordCount = Math.floor(doc.data.length / 5) + 120;
      
      // Try getting real metadata type
      let docType = 'Custom';
      try {
        const metaList = JSON.parse(localStorage.getItem('docforge_docs_meta') || '[]');
        const meta = metaList.find((m: any) => String(m.id) === String(doc.id));
        if (meta && meta.type) docType = meta.type.toUpperCase();
      } catch(e) {}

      return {
        ...doc,
        status,
        isAiGenerated,
        wordCount,
        docType
      };
    });

    setDocuments(enrichedDocs);
  }, [projectIdFilter]);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      deleteDocument(id);
      setDocuments(docs => docs.filter(d => d.id !== id));
      if (selectedPreviewDoc?.id === id) setSelectedPreviewDoc(null);
    }
  };

  const getProjectName = () => {
    if (!projectIdFilter) return 'All Documents Workspace';
    try {
      const projects = JSON.parse(localStorage.getItem('docforge_projects') || '[]');
      const found = projects.find((p: any) => String(p.id) === String(projectIdFilter));
      return found ? found.name : 'Unknown Folder';
    } catch (e) {
      return 'Folder';
    }
  };

  // Analytics
  const totalDocs = documents.length;
  const draftDocs = documents.filter(d => d.status === 'Draft').length;
  const aiDocs = documents.filter(d => d.isAiGenerated).length;

  // Filter & Sort
  let filteredDocs = documents.filter(d => {
    if (filterStatus !== 'all' && d.status.toLowerCase() !== filterStatus.toLowerCase()) return false;
    if (searchQuery && !d.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  if (sortBy === 'name') {
    filteredDocs.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortBy === 'oldest') {
    filteredDocs.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
  } else {
    filteredDocs.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Published': return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' };
      case 'Draft': return { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' };
      case 'In Review': return { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' };
      case 'Needs Approval': return { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' };
      default: return { bg: 'rgba(148, 163, 184, 0.1)', color: '#94a3b8' };
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', overflow: 'hidden' }}>
      {/* Main Workspace Area */}
      <div style={{ flex: 1, padding: '3rem', overflowY: 'auto', background: 'var(--background)' }} className="animate-fade-in">
        
        {/* Project Header & Analytics */}
        <header style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '1rem' }}>
            <Link href="/?tab=projects" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}>Folders & Projects</Link>
            <span>/</span>
            <span style={{ color: 'var(--primary)' }}>{getProjectName()}</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {projectIdFilter ? `📂 ${getProjectName()}` : 'My Documents'}
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
                Enterprise document hub. Prioritize saved documents and recent drafts.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button 
                onClick={() => { router.push(`/?tab=templates&projectId=${projectIdFilter}`); }}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', fontWeight: 600 }}
              >
                <Plus size={18} /> New Document
              </button>
            </div>
          </div>

          {/* Quick Analytics Row */}
          {documents.length > 0 && (
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <div style={{ padding: '1rem 1.5rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', flex: 1, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '10px' }}><FileText size={20} /></div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{totalDocs}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Total Documents</div>
                </div>
              </div>
              <div style={{ padding: '1rem 1.5rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', flex: 1, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '0.75rem', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderRadius: '10px' }}><Edit2 size={20} /></div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{draftDocs}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Active Drafts</div>
                </div>
              </div>
              <div style={{ padding: '1rem 1.5rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', flex: 1, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '0.75rem', background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7', borderRadius: '10px' }}><Bot size={20} /></div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{aiDocs}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>AI Generated</div>
                </div>
              </div>
            </div>
          )}
        </header>

        {documents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'var(--surface)', borderRadius: '16px', border: '1px dashed var(--border)', marginBottom: '3rem' }}>
            <div style={{ display: 'inline-flex', padding: '1.5rem', background: 'var(--background)', borderRadius: '50%', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              <FileText size={48} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>No documents created yet</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem auto' }}>
              Start your workspace by creating a blank document, using AI to generate one, or selecting from the Template Marketplace below.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <Link href="/?tab=builder" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={16} /> Blank Document
              </Link>
              <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#8b5cf6', borderColor: 'rgba(139, 92, 246, 0.3)' }} onClick={() => alert('AI Generation modal would open here.')}>
                <Bot size={16} /> AI Generate
              </button>
            </div>
          </div>
        ) : (
          <div style={{ marginBottom: '4rem' }}>
            {/* Top Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', background: 'var(--surface)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', gap: '1rem', flex: 1 }}>
                <div style={{ position: 'relative', width: '300px' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="text" 
                    placeholder="Search saved documents..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem 1rem 0.5rem 2.5rem', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.85rem' }}
                  />
                </div>
                <select 
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  style={{ padding: '0.5rem 1rem', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  <option value="all">All Statuses</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="in review">In Review</option>
                </select>
                <select 
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  style={{ padding: '0.5rem 1rem', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  <option value="recent">Recently Updated</option>
                  <option value="oldest">Oldest</option>
                  <option value="name">Name (A-Z)</option>
                </select>
              </div>
              <div style={{ display: 'flex', background: 'var(--background)', borderRadius: '8px', border: '1px solid var(--border)', overflow: 'hidden' }}>
                <button onClick={() => setViewMode('grid')} style={{ padding: '0.5rem', background: viewMode === 'grid' ? 'var(--surface)' : 'transparent', border: 'none', color: viewMode === 'grid' ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer' }}><LayoutGrid size={16} /></button>
                <button onClick={() => setViewMode('list')} style={{ padding: '0.5rem', background: viewMode === 'list' ? 'var(--surface)' : 'transparent', border: 'none', color: viewMode === 'list' ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer', borderLeft: '1px solid var(--border)' }}><List size={16} /></button>
              </div>
            </div>

            {/* Document List/Grid Views */}
            {viewMode === 'grid' ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {filteredDocs.map(doc => {
                  const sColor = getStatusColor(doc.status);
                  return (
                    <div key={doc.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden', transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)', background: 'var(--background)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px', background: sColor.bg, color: sColor.color, textTransform: 'uppercase' }}>
                              {doc.status}
                            </span>
                            {doc.isAiGenerated && (
                              <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                <Bot size={10} /> AI
                              </span>
                            )}
                          </div>
                          <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem' }}><MoreVertical size={16} /></button>
                        </div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>{doc.title}</h3>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Template: {doc.docType}</div>
                      </div>
                      <div style={{ padding: '1rem 1.25rem', flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                          <Clock size={12} /> Last edited {new Date(doc.updatedAt).toLocaleDateString()}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          <BarChart2 size={12} /> {doc.wordCount} words
                        </div>
                      </div>
                      <div style={{ padding: '1rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.5rem', background: 'var(--background)' }}>
                        <Link href={`/?tab=builder&id=${doc.id}`} className="btn btn-primary" style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem', display: 'flex', justifyContent: 'center' }}>Open</Link>
                        <button onClick={() => setSelectedPreviewDoc(doc)} className="btn btn-secondary" style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem', display: 'flex', justifyContent: 'center' }}>Preview</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead style={{ background: 'var(--background)', borderBottom: '1px solid var(--border)' }}>
                    <tr>
                      <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Name</th>
                      <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
                      <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Template</th>
                      <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Last Updated</th>
                      <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDocs.map(doc => {
                      const sColor = getStatusColor(doc.status);
                      return (
                        <tr key={doc.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <FileText size={18} color="var(--primary)" />
                              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{doc.title}</span>
                              {doc.isAiGenerated && <Bot size={12} color="#a855f7" title="AI Generated" />}
                            </div>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px', background: sColor.bg, color: sColor.color, textTransform: 'uppercase' }}>
                              {doc.status}
                            </span>
                          </td>
                          <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{doc.docType}</td>
                          <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{new Date(doc.updatedAt).toLocaleDateString()}</td>
                          <td style={{ padding: '1rem', textAlign: 'right' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                              <button onClick={() => setSelectedPreviewDoc(doc)} className="btn btn-secondary" style={{ padding: '0.4rem', borderRadius: '6px' }} title="Preview"><Eye size={14} /></button>
                              <Link href={`/?tab=builder&id=${doc.id}`} className="btn btn-primary" style={{ padding: '0.4rem', borderRadius: '6px' }} title="Edit"><Edit2 size={14} /></Link>
                              <button onClick={() => handleDelete(doc.id)} className="btn btn-secondary" style={{ padding: '0.4rem', borderRadius: '6px', color: '#ef4444' }} title="Delete"><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Section Divider */}
        {documents.length > 0 && (
          <div style={{ margin: '4rem 0 2rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Template Marketplace</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          </div>
        )}

        {/* Template Marketplace Rendered Below */}
        {useTemplate && <TemplateMarketplace onUseTemplate={useTemplate} projectIdFilter={projectIdFilter} />}
      </div>

      {/* Right Side Document Preview Panel */}
      {selectedPreviewDoc && (
        <div className="animate-fade-in" style={{ width: '380px', background: 'var(--surface)', borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column', boxShadow: '-10px 0 30px rgba(0,0,0,0.1)' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--background)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Eye size={18} color="var(--primary)" /> Document Preview</h3>
            <button onClick={() => setSelectedPreviewDoc(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}><X size={18} /></button>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>{selectedPreviewDoc.title}</h2>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px', background: getStatusColor(selectedPreviewDoc.status).bg, color: getStatusColor(selectedPreviewDoc.status).color, textTransform: 'uppercase' }}>
                  {selectedPreviewDoc.status}
                </span>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  {selectedPreviewDoc.docType}
                </span>
              </div>
            </div>

            {/* AI Insights Panel */}
            <div style={{ background: 'rgba(168, 85, 247, 0.05)', border: '1px solid rgba(168, 85, 247, 0.2)', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#a855f7', fontWeight: 700, fontSize: '0.85rem' }}>
                <Bot size={16} /> AI Document Insights
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.8rem', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {selectedPreviewDoc.isAiGenerated ? (
                  <li>This document was drafted using AI assistance.</li>
                ) : (
                  <li>Drafted manually. AI analysis available.</li>
                )}
                {selectedPreviewDoc.wordCount < 200 && <li style={{ color: '#f59e0b' }}>Document appears too short. Consider expanding.</li>}
                <li>Readability score: <strong>Enterprise Grade</strong></li>
              </ul>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Created At</span>
                <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{new Date(selectedPreviewDoc.updatedAt).toLocaleDateString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Word Count</span>
                <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>~{selectedPreviewDoc.wordCount} words</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Collaborators</span>
                <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>1 (You)</span>
              </div>
            </div>

            <div style={{ height: '200px', background: 'var(--background)', border: '1px dashed var(--border)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: '1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', padding: '1rem', opacity: 0.5 }}>
                 {/* Visual mockup of doc content */}
                 <div style={{ width: '60%', height: '8px', background: 'var(--border)', borderRadius: '4px', marginBottom: '1rem' }} />
                 <div style={{ width: '100%', height: '4px', background: 'var(--border)', borderRadius: '2px', marginBottom: '0.5rem' }} />
                 <div style={{ width: '100%', height: '4px', background: 'var(--border)', borderRadius: '2px', marginBottom: '0.5rem' }} />
                 <div style={{ width: '80%', height: '4px', background: 'var(--border)', borderRadius: '2px', marginBottom: '1rem' }} />
                 <div style={{ width: '40%', height: '8px', background: 'var(--border)', borderRadius: '4px', marginBottom: '1rem' }} />
              </div>
              <span style={{ zIndex: 1, background: 'var(--surface)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border)', fontWeight: 600 }}>Mini Preview</span>
            </div>
          </div>
          
          <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)', background: 'var(--background)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link href={`/?tab=builder&id=${selectedPreviewDoc.id}`} className="btn btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '0.75rem' }}>Open Editor</Link>
            <button className="btn btn-secondary" style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '0.75rem' }}>Export PDF</button>
          </div>
        </div>
      )}

    </div>
  );
}
