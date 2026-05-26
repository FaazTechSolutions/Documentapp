"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDocumentStore, UnifiedDocument } from '@/store/useDocumentStore';
import DocumentActionMenu from './DocumentActionMenu';
import EditDocumentMetadataModal from './EditDocumentMetadataModal';
import { 
  FileText, Trash2, Clock, Plus, LayoutTemplate, Download, Edit2, 
  MoreVertical, Copy, Archive, Share2, Search, Filter, LayoutGrid, List,
  Eye, BarChart2, Users, Bot, Settings, Tag, Info, AlertTriangle, CheckCircle, ChevronRight, X, Zap, Activity
} from 'lucide-react';
import { useTemplateStore } from '@/store/useTemplateStore';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { useSectorStore } from '@/store/useSectorStore';
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
      display: 'flex', flexDirection: 'column', width: '100%', minHeight: '80vh',
      background: 'var(--mkt-bg)', color: 'var(--mkt-text)', borderRadius: '16px',
      border: '1px solid var(--mkt-border)', overflow: 'hidden', fontFamily: "'Inter', sans-serif",
      boxShadow: 'var(--mkt-shadow)', marginTop: '3rem'
    }}>
      <div style={{ padding: '1.5rem 2rem', background: 'var(--mkt-glass)', borderBottom: '1px solid var(--mkt-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, background: 'linear-gradient(90deg, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Template Marketplace
          </h2>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--mkt-search-icon)' }}>🔍</span>
            <input 
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
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
              <div onClick={() => setActiveCategory('all')} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.85rem', borderRadius: '8px', cursor: 'pointer', background: activeCategory === 'all' ? 'var(--mkt-accent-bg)' : 'transparent', borderLeft: `3px solid ${activeCategory === 'all' ? 'var(--mkt-accent)' : 'transparent'}`, color: activeCategory === 'all' ? 'var(--mkt-accent)' : 'var(--mkt-text)', fontWeight: activeCategory === 'all' ? 700 : 500, transition: 'all 0.2s' }}>
                <span>🌍</span> <span style={{ fontSize: '0.85rem' }}>All Templates</span>
              </div>
              {categories.map(cat => (
                <div key={cat.id}>
                  <div onClick={() => setActiveCategory(cat.id)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.85rem', borderRadius: '8px', cursor: 'pointer', background: activeCategory === cat.id ? 'var(--mkt-accent-bg)' : 'transparent', borderLeft: `3px solid ${activeCategory === cat.id ? 'var(--mkt-accent)' : 'transparent'}`, color: activeCategory === cat.id ? 'var(--mkt-accent)' : 'var(--mkt-text)', fontWeight: activeCategory === cat.id ? 700 : 500, transition: 'all 0.2s' }}>
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
              <div key={tmpl.id} onMouseEnter={() => setIsHovering(tmpl.id)} onMouseLeave={() => setIsHovering(null)} onClick={() => setSelectedTemplate(tmpl)}
                style={{ 
                  background: selectedTemplate?.id === tmpl.id ? 'var(--mkt-hover-strong)' : 'var(--mkt-card)', 
                  backdropFilter: 'blur(12px)', borderRadius: '12px', 
                  border: `1px solid ${selectedTemplate?.id === tmpl.id ? 'var(--mkt-accent)' : isHovering === tmpl.id ? 'var(--mkt-border-hover)' : 'var(--mkt-border-light)'}`, 
                  padding: '1.25rem', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: isHovering === tmpl.id && selectedTemplate?.id !== tmpl.id ? 'translateY(-4px)' : 'translateY(0)',
                  boxShadow: selectedTemplate?.id === tmpl.id ? `0 0 0 1px var(--mkt-accent), 0 10px 25px -5px var(--mkt-glow)` : isHovering === tmpl.id ? 'var(--mkt-shadow-hover)' : 'var(--mkt-shadow)',
                  position: 'relative', overflow: 'hidden'
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
  
  const { documents, syncFromLegacyStorage, deleteDocument, archiveDocument } = useDocumentStore();
  const { activeWorkspaceId, workspaces } = useWorkspaceStore();
  
  // New States
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [selectedPreviewDoc, setSelectedPreviewDoc] = useState<UnifiedDocument | null>(null);
  
  // Modals
  const [editingDoc, setEditingDoc] = useState<UnifiedDocument | null>(null);
  
  // Bulk Actions
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  
  // View Toggle
  const [showTemplates, setShowTemplates] = useState(false);

  useEffect(() => {
    syncFromLegacyStorage();
  }, [syncFromLegacyStorage]);

  const getProjectName = () => {
    if (projectIdFilter) {
      try {
        const projects = JSON.parse(localStorage.getItem('docforge_projects') || '[]');
        const found = projects.find((p: any) => String(p.id) === String(projectIdFilter));
        if (found) return found.name;
      } catch (e) {}
    }
    if (activeWorkspaceId) {
      const found = workspaces.find(w => w.id === activeWorkspaceId);
      if (found) return found.name;
    }
    return 'All Documents Workspace';
  };

  // Filter & Sort
  const { activeSector, activeRoleId } = useSectorStore();
  const isSuperAdmin = activeRoleId === 'super_admin' || activeRoleId === 'admin' || activeRoleId === 'gov_admin';

  let filteredDocs = documents.filter(d => {
    if (d.isDeleted) return false;
    
    // Workspace Sector Isolation: non-admins only see documents matching the active workspace sector
    const docSector = d.workspaceSector || 'operations';
    if (!isSuperAdmin && docSector !== activeSector) return false;
    
    return true;
  });
  
  // Prefer projectIdFilter over activeWorkspaceId so projects opened from the hub display correctly
  const effectiveWorkspaceId = projectIdFilter || activeWorkspaceId;

  if (effectiveWorkspaceId) {
    filteredDocs = filteredDocs.filter(d => String(d.workspaceId) === String(effectiveWorkspaceId));
  }

  if (filterStatus !== 'all') {
    if (filterStatus === 'archived') {
      filteredDocs = filteredDocs.filter(d => d.isArchived);
    } else {
      filteredDocs = filteredDocs.filter(d => !d.isArchived && d.status.toLowerCase() === filterStatus.toLowerCase());
    }
  } else {
    // Hide archived by default if all
    filteredDocs = filteredDocs.filter(d => !d.isArchived);
  }

  if (searchQuery) {
    filteredDocs = filteredDocs.filter(d => d.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }

  if (sortBy === 'name') {
    filteredDocs.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortBy === 'oldest') {
    filteredDocs.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
  } else {
    filteredDocs.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  // Analytics
  const projectDocsForAnalytics = effectiveWorkspaceId
    ? documents.filter(d => !d.isDeleted && !d.isArchived && String(d.workspaceId) === String(effectiveWorkspaceId))
    : documents.filter(d => !d.isDeleted && !d.isArchived);

  const totalDocs = projectDocsForAnalytics.length;
  const draftDocs = projectDocsForAnalytics.filter(d => d.status === 'Draft').length;
  const aiDocs = projectDocsForAnalytics.filter(d => d.isAiGenerated).length;
  const pendingDocs = projectDocsForAnalytics.filter(d => d.status === 'Needs Approval' || d.status === 'Pending Approval' || d.status === 'Pending').length;

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedDocIds.length} documents?`)) {
      selectedDocIds.forEach(id => deleteDocument(id));
      setSelectedDocIds([]);
    }
  };

  const handleBulkArchive = () => {
    selectedDocIds.forEach(id => archiveDocument(id));
    setSelectedDocIds([]);
  };

  const toggleSelectAll = () => {
    if (selectedDocIds.length === filteredDocs.length) {
      setSelectedDocIds([]);
    } else {
      setSelectedDocIds(filteredDocs.map(d => d.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedDocIds.includes(id)) {
      setSelectedDocIds(selectedDocIds.filter(i => i !== id));
    } else {
      setSelectedDocIds([...selectedDocIds, id]);
    }
  };

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
      
      {/* Left Copilot Chat Panel */}
      <div style={{ width: '280px', borderRight: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Bot size={20} color="var(--primary)" />
          <h2 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>AI Copilot</h2>
        </div>
        <div style={{ flex: 1, padding: '1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: 'var(--background)', padding: '0.85rem', borderRadius: '8px', borderBottomLeftRadius: '0', fontSize: '0.85rem', color: 'var(--text-main)', border: '1px solid var(--border)' }}>
            Hi! I'm your workspace Copilot. I can help you find documents, summarize projects, or draft new requirements. What can I do for you today?
          </div>
        </div>
        <div style={{ padding: '1rem', borderTop: '1px solid var(--border)', background: 'var(--background)' }}>
          <input type="text" placeholder="Ask Copilot..." style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: '0.85rem', outline: 'none' }} />
        </div>
      </div>

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
                {projectIdFilter ? `📂 ${getProjectName()}` : 'Document Dashboard'}
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
                Centralized view for managing all enterprise documents, templates, and analytics.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {!showTemplates ? (
                <button 
                  onClick={() => setShowTemplates(true)}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', fontWeight: 600 }}
                >
                  <Plus size={18} /> Create Document
                </button>
              ) : (
                <button 
                  onClick={() => setShowTemplates(false)}
                  className="btn btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', fontWeight: 600 }}
                >
                  <List size={18} /> View Documents
                </button>
              )}
            </div>
          </div>

          {/* Quick Analytics Row */}
          {documents.length > 0 && (
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <div style={{ padding: '1.25rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', flex: 1, display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ padding: '0.85rem', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '12px' }}><FileText size={24} /></div>
                <div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, lineHeight: 1.1 }}>{totalDocs}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginTop: '0.2rem' }}>Total Documents</div>
                </div>
              </div>
              <div style={{ padding: '1.25rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', flex: 1, display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ padding: '0.85rem', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderRadius: '12px' }}><Edit2 size={24} /></div>
                <div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, lineHeight: 1.1 }}>{draftDocs}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginTop: '0.2rem' }}>Active Drafts</div>
                </div>
              </div>
              <div style={{ padding: '1.25rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', flex: 1, display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ padding: '0.85rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '12px' }}><AlertTriangle size={24} /></div>
                <div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, lineHeight: 1.1 }}>{pendingDocs}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginTop: '0.2rem' }}>Pending Approval</div>
                </div>
              </div>
              <div style={{ padding: '1.25rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', flex: 1, display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ padding: '0.85rem', background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7', borderRadius: '12px' }}><Bot size={24} /></div>
                <div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, lineHeight: 1.1 }}>{aiDocs}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginTop: '0.2rem' }}>AI Quality Score</div>
                </div>
              </div>
            </div>
          )}
        </header>

        {showTemplates ? (
          <div className="animate-fade-in" style={{ marginTop: '1rem', marginBottom: '4rem' }}>
            {useTemplate && <TemplateMarketplace onUseTemplate={useTemplate} projectIdFilter={projectIdFilter} />}
          </div>
        ) : (
          <>
            {documents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'var(--surface)', borderRadius: '16px', border: '1px dashed var(--border)', marginBottom: '3rem' }}>
                <div style={{ display: 'inline-flex', padding: '1.5rem', background: 'var(--background)', borderRadius: '50%', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              <FileText size={48} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>No documents available</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem auto' }}>
              Start your workspace by creating a blank document or selecting from the Template Marketplace below.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button onClick={() => useTemplate && useTemplate('Blank Document', 'blank')} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={16} /> Blank Document
              </button>
            </div>
          </div>
        ) : (
          <div style={{ marginBottom: '4rem' }}>
            {/* Top Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', background: 'var(--surface)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', gap: '1rem', flex: 1, alignItems: 'center' }}>
                
                {selectedDocIds.length > 0 ? (
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'rgba(59, 130, 246, 0.1)', padding: '0.4rem 0.8rem', borderRadius: '8px', color: '#3b82f6', fontWeight: 600 }}>
                    <span style={{ marginRight: '0.5rem' }}>{selectedDocIds.length} selected</span>
                    <button onClick={handleBulkArchive} className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', display: 'flex', gap: '0.3rem', alignItems: 'center', background: 'var(--background)' }}>
                      <Archive size={14} /> Archive
                    </button>
                    <button onClick={handleBulkDelete} className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', display: 'flex', gap: '0.3rem', alignItems: 'center', background: 'var(--background)', color: '#ef4444', borderColor: '#ef4444' }}>
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                ) : (
                  <>
                    <div style={{ position: 'relative', width: '300px' }}>
                      <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input 
                        type="text" 
                        placeholder="Search documents..."
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
                      <option value="all">Active Documents</option>
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="in review">In Review</option>
                      <option value="archived">Archived</option>
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
                  </>
                )}
              </div>
              <div style={{ display: 'flex', background: 'var(--background)', borderRadius: '8px', border: '1px solid var(--border)', overflow: 'hidden' }}>
                <button onClick={() => setViewMode('grid')} style={{ padding: '0.5rem', background: viewMode === 'grid' ? 'var(--surface)' : 'transparent', border: 'none', color: viewMode === 'grid' ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer' }}><LayoutGrid size={16} /></button>
                <button onClick={() => setViewMode('list')} style={{ padding: '0.5rem', background: viewMode === 'list' ? 'var(--surface)' : 'transparent', border: 'none', color: viewMode === 'list' ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer', borderLeft: '1px solid var(--border)' }}><List size={16} /></button>
              </div>
            </div>

            {/* Document List/Grid Views */}
            {viewMode === 'grid' ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {filteredDocs.map(doc => {
                  const sColor = getStatusColor(doc.status);
                  const isChecked = selectedDocIds.includes(doc.id);
                  return (
                    <div key={doc.id} style={{ background: 'var(--surface)', border: `1px solid ${isChecked ? 'var(--primary)' : 'var(--border)'}`, borderRadius: '16px', overflow: 'hidden', transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)', background: isChecked ? 'rgba(59, 130, 246, 0.05)' : 'var(--background)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <input type="checkbox" checked={isChecked} onChange={() => toggleSelect(doc.id)} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                            <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px', background: sColor.bg, color: sColor.color, textTransform: 'uppercase' }}>
                              {doc.status}
                            </span>
                            {doc.isArchived && <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', textTransform: 'uppercase' }}>Archived</span>}
                            {doc.isAiGenerated && (
                              <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                <Bot size={10} /> AI
                              </span>
                            )}
                          </div>
                          <DocumentActionMenu doc={doc} onEdit={() => setEditingDoc(doc)} />
                        </div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem', cursor: 'pointer' }} onClick={() => router.push(`/?tab=builder&id=${doc.id}`)}>{doc.title}</h3>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                          <span style={{ fontSize: '0.75rem', padding: '0.15rem 0.4rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text-muted)' }}>{doc.docType}</span>
                          {doc.versionHistory?.length > 0 && <span style={{ fontSize: '0.75rem', padding: '0.15rem 0.4rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text-muted)' }}>v{doc.versionHistory.length}</span>}
                        </div>
                      </div>
                      <div style={{ padding: '1rem 1.25rem', flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Clock size={12} /> {new Date(doc.updatedAt).toLocaleDateString()}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Users size={12} /> {doc.owner}</div>
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
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead style={{ borderBottom: '1px solid var(--border)' }}>
                    <tr>
                      <th style={{ padding: '1rem', width: '40px' }}><input type="checkbox" checked={selectedDocIds.length === filteredDocs.length && filteredDocs.length > 0} onChange={toggleSelectAll} style={{ cursor: 'pointer' }} /></th>
                      <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</th>
                      <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                      <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</th>
                      <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Owner</th>
                      <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Last Updated</th>
                      <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDocs.map(doc => {
                      const sColor = getStatusColor(doc.status);
                      const isChecked = selectedDocIds.includes(doc.id);
                      return (
                        <tr key={doc.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s', background: isChecked ? 'rgba(59, 130, 246, 0.05)' : 'transparent' }} onMouseEnter={e => !isChecked && (e.currentTarget.style.background = 'rgba(0,0,0,0.02)')} onMouseLeave={e => !isChecked && (e.currentTarget.style.background = 'transparent')}>
                          <td style={{ padding: '1rem' }}><input type="checkbox" checked={isChecked} onChange={() => toggleSelect(doc.id)} style={{ cursor: 'pointer' }} /></td>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => router.push(`/?tab=builder&id=${doc.id}`)}>
                              <FileText size={18} color="var(--primary)" />
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{doc.title}</span>
                                {doc.versionHistory?.length > 0 && <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>v{doc.versionHistory.length}</span>}
                              </div>
                              {doc.isAiGenerated && <span title="AI Generated"><Bot size={14} color="#a855f7" /></span>}
                            </div>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px', background: sColor.bg, color: sColor.color, textTransform: 'uppercase' }}>
                                {doc.status}
                              </span>
                              {doc.isArchived && <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', textTransform: 'uppercase' }}>Archived</span>}
                            </div>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <span style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text-muted)' }}>
                              {doc.docType}
                            </span>
                          </td>
                          <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 500 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 'bold' }}>{doc.owner.charAt(0)}</div>
                              {doc.owner}
                            </div>
                          </td>
                          <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{new Date(doc.updatedAt).toLocaleDateString()}</td>
                          <td style={{ padding: '1rem', textAlign: 'right' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', alignItems: 'center' }}>
                              <button onClick={() => setSelectedPreviewDoc(doc)} className="btn btn-secondary" style={{ padding: '0.4rem', borderRadius: '6px' }} title="Preview"><Eye size={14} /></button>
                              <DocumentActionMenu doc={doc} onEdit={() => setEditingDoc(doc)} />
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
          </>
        )}
      </div>

      {/* Right Side Dynamic AI Insights Panel */}
      <div style={{ width: '300px', borderLeft: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', flexDirection: 'column', flexShrink: 0, padding: '1.5rem', gap: '2rem', overflowY: 'auto' }}>
        
        {/* AI Insights */}
        <div>
          <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <Zap size={14} /> AI Insights
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {selectedPreviewDoc ? (
              <>
                <div style={{ padding: '0.75rem', background: 'var(--background)', borderRadius: '8px', borderLeft: '3px solid #3b82f6', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                  Selected <strong>{selectedPreviewDoc.title}</strong>
                </div>
                {selectedPreviewDoc.docType === 'brd' && (
                  <div style={{ padding: '0.75rem', background: 'var(--background)', borderRadius: '8px', borderLeft: '3px solid #f59e0b', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                    Consider generating Test Cases next.
                  </div>
                )}
                <div style={{ padding: '0.75rem', background: 'var(--background)', borderRadius: '8px', borderLeft: '3px solid #10b981', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                  Readability score: Enterprise Grade
                </div>
              </>
            ) : (
              <>
                <div style={{ padding: '0.75rem', background: 'var(--background)', borderRadius: '8px', borderLeft: '3px solid #ef4444', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                  Missing workflows detected in 3 modules
                </div>
                <div style={{ padding: '0.75rem', background: 'var(--background)', borderRadius: '8px', borderLeft: '3px solid #f59e0b', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                  Duplicate requirements found (REQ-003, REQ-012)
                </div>
                <div style={{ padding: '0.75rem', background: 'var(--background)', borderRadius: '8px', borderLeft: '3px solid #3b82f6', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                  Approval delay: 2 stakeholders pending
                </div>
              </>
            )}
          </div>
        </div>

        {/* Generate Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {selectedPreviewDoc ? (
            <>
              {selectedPreviewDoc.docType === 'brd' ? (
                <>
                  <button className="btn btn-secondary" style={{ width: '100%', padding: '0.5rem', fontSize: '0.85rem' }}>Generate FRD</button>
                  <button className="btn btn-secondary" style={{ width: '100%', padding: '0.5rem', fontSize: '0.85rem' }}>Generate Test Cases</button>
                  <button className="btn btn-secondary" style={{ width: '100%', padding: '0.5rem', fontSize: '0.85rem' }}>Generate SRS</button>
                </>
              ) : selectedPreviewDoc.docType === 'frd' ? (
                <>
                  <button className="btn btn-secondary" style={{ width: '100%', padding: '0.5rem', fontSize: '0.85rem' }}>Generate Architecture</button>
                  <button className="btn btn-secondary" style={{ width: '100%', padding: '0.5rem', fontSize: '0.85rem' }}>Generate API Spec</button>
                </>
              ) : (
                <>
                  <button className="btn btn-secondary" style={{ width: '100%', padding: '0.5rem', fontSize: '0.85rem' }}>AI Summary</button>
                  <button className="btn btn-secondary" style={{ width: '100%', padding: '0.5rem', fontSize: '0.85rem' }}>Review & Analyze</button>
                </>
              )}
              <Link href={`/?tab=builder&id=${selectedPreviewDoc.id}`} className="btn btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '0.5rem', fontSize: '0.85rem', marginTop: '0.5rem' }}>Open Editor</Link>
            </>
          ) : (
            <>
              <button className="btn btn-secondary" style={{ width: '100%', padding: '0.5rem', fontSize: '0.85rem' }}>Generate Dashboard</button>
              <button className="btn btn-secondary" style={{ width: '100%', padding: '0.5rem', fontSize: '0.85rem' }}>Workspace Report</button>
            </>
          )}
        </div>

        {/* Recent Activity */}
        <div>
          <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <Activity size={14} /> Recent Activity
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
            <div style={{ position: 'absolute', left: '3px', top: '5px', bottom: '5px', width: '2px', background: 'var(--border)' }} />
            <div style={{ display: 'flex', gap: '0.75rem', position: 'relative', zIndex: 1 }}>
              <div style={{ marginTop: '0.25rem', width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6', flexShrink: 0, outline: '3px solid var(--background)' }}></div>
              <div>
                <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-main)' }}>BRD updated by Ahmed</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>2m ago</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', position: 'relative', zIndex: 1 }}>
              <div style={{ marginTop: '0.25rem', width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', flexShrink: 0, outline: '3px solid var(--background)' }}></div>
              <div>
                <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-main)' }}>Payroll scope modified</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>1h ago</span>
              </div>
            </div>
          </div>
        </div>

      </div>
      
      <EditDocumentMetadataModal 
        isOpen={!!editingDoc} 
        document={editingDoc} 
        onSave={(id, updates) => {
          useDocumentStore.getState().updateDocument(id, updates, 'Metadata updated');
        }} 
        onClose={() => setEditingDoc(null)} 
      />

    </div>
  );
}
