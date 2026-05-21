"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { getSavedDocuments, deleteDocument, SavedDocument } from '@/lib/storage';
import { FileText, Trash2, Clock, Plus, LayoutTemplate, Download, Edit2, MoreVertical, Copy, Archive, Share2 } from 'lucide-react';
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

const templatesDatabase = [
  // Business
  { id: 'template-brd', type: 'brd', name: 'Business Requirements (BRD)', category: 'business', icon: '📘', desc: 'Business requirement management workspace.', sections: 18, difficulty: 'Enterprise', tags: ['Planning', 'Strategy'], used: '2 hours ago' },
  { id: 'template-frd', type: 'frd', name: 'Feature Requirements (FRD)', category: 'business', icon: '📗', desc: 'Feature and functional specifications map.', sections: 14, difficulty: 'Advanced', tags: ['Features', 'Product'], used: '1 day ago' },
  { id: 'template-srs', type: 'srs', name: 'Software Requirements (SRS)', category: 'business', icon: '📙', desc: 'System requirements and architecture definition.', sections: 24, difficulty: 'Enterprise', tags: ['Architecture', 'Technical'], used: '5 hours ago' },
  { id: 'template-tdd', type: 'tdd', name: 'Technical Design (TDD)', category: 'business', icon: '📓', desc: 'Engineering schemas and system design docs.', sections: 22, difficulty: 'Expert', tags: ['Engineering', 'Backend'], used: '3 days ago' },
  // Agile
  { id: 'template-sprint', type: 'sprint', name: 'Sprint Planning', category: 'agile', icon: '🏃', desc: 'Kanban boards and sprint capacity tracking.', sections: 8, difficulty: 'Intermediate', tags: ['Agile', 'Scrum'], used: '1 week ago' },
  { id: 'template-backlog', type: 'backlog', name: 'Product Backlog', category: 'agile', icon: '📋', desc: 'Prioritized feature list and story points.', sections: 5, difficulty: 'Beginner', tags: ['Planning', 'Features'], used: '2 weeks ago' },
  { id: 'template-risk', type: 'custom', name: 'Risk Register', category: 'agile', icon: '⚠️', desc: 'Project risks, impacts, and mitigations.', sections: 6, difficulty: 'Intermediate', tags: ['Management', 'Security'], used: 'New' },
  { id: 'template-change', type: 'custom', name: 'Change Requests', category: 'agile', icon: '🔄', desc: 'Formal change management tracking.', sections: 7, difficulty: 'Advanced', tags: ['Scope', 'Management'], used: 'New' },
  // QA
  { id: 'template-testplan', type: 'custom', name: 'Master Test Plan', category: 'qa', icon: '🧪', desc: 'Comprehensive QA testing strategy.', sections: 12, difficulty: 'Advanced', tags: ['QA', 'Strategy'], used: '1 month ago' },
  { id: 'template-testcases', type: 'custom', name: 'Test Cases', category: 'qa', icon: '✅', desc: 'Step-by-step test execution matrix.', sections: 4, difficulty: 'Intermediate', tags: ['QA', 'Execution'], used: '2 days ago' },
  { id: 'template-bug', type: 'custom', name: 'Bug Reports', category: 'qa', icon: '🐛', desc: 'Detailed defect tracking and replication.', sections: 8, difficulty: 'Beginner', tags: ['QA', 'Triage'], used: '4 hours ago' },
  { id: 'template-uat', type: 'custom', name: 'UAT Sign-off', category: 'qa', icon: '🤝', desc: 'User acceptance testing workflows.', sections: 5, difficulty: 'Intermediate', tags: ['Client', 'Sign-off'], used: 'New' },
  // DevOps
  { id: 'template-cicd', type: 'custom', name: 'CI/CD Pipeline', category: 'devops', icon: '⚡', desc: 'Continuous integration and delivery config.', sections: 9, difficulty: 'Expert', tags: ['DevOps', 'Automation'], used: 'New' },
  { id: 'template-deploy', type: 'custom', name: 'Deployment Guide', category: 'devops', icon: '🚀', desc: 'Step-by-step production release manual.', sections: 11, difficulty: 'Advanced', tags: ['Release', 'Ops'], used: '1 week ago' },
  { id: 'template-monitor', type: 'custom', name: 'Monitoring Setup', category: 'devops', icon: '📊', desc: 'Observability and alerting configurations.', sections: 8, difficulty: 'Advanced', tags: ['SRE', 'Ops'], used: 'New' },
  { id: 'template-infra', type: 'custom', name: 'Infrastructure (IaC)', category: 'devops', icon: '🏗️', desc: 'Cloud resource and network topology.', sections: 15, difficulty: 'Enterprise', tags: ['Cloud', 'Architecture'], used: 'New' },
  // Support
  { id: 'template-manual', type: 'custom', name: 'User Manual', category: 'support', icon: '📖', desc: 'End-user product documentation.', sections: 10, difficulty: 'Beginner', tags: ['Docs', 'Client'], used: 'New' },
  { id: 'template-faq', type: 'custom', name: 'FAQ & Help', category: 'support', icon: '❓', desc: 'Common questions and resolutions.', sections: 4, difficulty: 'Beginner', tags: ['Support', 'Docs'], used: 'New' },
  { id: 'template-trouble', type: 'custom', name: 'Troubleshooting', category: 'support', icon: '🔧', desc: 'Diagnostic steps for system issues.', sections: 6, difficulty: 'Intermediate', tags: ['Support', 'Engineering'], used: 'New' },
  { id: 'template-releasenotes', type: 'custom', name: 'Release Notes', category: 'support', icon: '📣', desc: 'Changelog and version announcements.', sections: 5, difficulty: 'Beginner', tags: ['Product', 'Updates'], used: '3 weeks ago' }
];

const TemplateMarketplace = ({ onUseTemplate, projectIdFilter }: { onUseTemplate: (title: string, templateId: string, isBuilder?: boolean) => void, projectIdFilter: string | null }) => {
  const { templates, duplicateTemplate, deleteTemplate, syncFromStorage } = useTemplateStore();
  const [activeCategory, setActiveCategory] = useState('business');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [isHovering, setIsHovering] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    syncFromStorage();
  }, [syncFromStorage]);

  useEffect(() => {
    if (templates.length > 0 && !selectedTemplate) {
      setSelectedTemplate(templates[0]);
    }
  }, [templates, selectedTemplate]);

  // Merge with static templates if store is empty for display fallback
  const displayTemplates = templates.length > 0 ? templates : templatesDatabase as any[];
  
  const filteredTemplates = displayTemplates.filter(t => 
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
      boxShadow: 'var(--mkt-shadow)'
    }}>
      {/* 8. TOP SEARCH & QUICK START */}
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
              placeholder="Search templates, workflows, dashboards..." 
              style={{ width: '350px', padding: '0.6rem 1rem 0.6rem 2.5rem', background: 'var(--mkt-input)', border: '1px solid var(--mkt-border-light)', borderRadius: '8px', color: 'var(--mkt-text)', fontSize: '0.85rem', outline: 'none', transition: 'border-color 0.2s' }}
              onFocus={e => e.currentTarget.style.borderColor = 'var(--mkt-accent)'}
              onBlur={e => e.currentTarget.style.borderColor = 'var(--mkt-border-light)'}
            />
          </div>
        </div>

        {/* 9. QUICK START CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          {[
            { label: 'Create Blank Document', icon: '📄', type: 'blank', bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' },
            { label: 'Import Existing Template', icon: '📥', type: 'import', bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
            { label: 'AI Generate Document', icon: '✨', type: 'ai', bg: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' },
            { label: 'Start From Recent', icon: '🕒', type: 'recent', bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }
          ].map(q => (
            <div key={q.label} onClick={() => q.type === 'blank' ? onUseTemplate('New Document', 'blank') : null} style={{ padding: '0.85rem', background: 'var(--mkt-glass)', borderRadius: '8px', border: '1px solid var(--mkt-border)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.background = 'var(--mkt-hover)'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'var(--mkt-card)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: q.bg, color: q.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>{q.icon}</div>
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{q.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* 3. LEFT CATEGORIES SIDEBAR */}
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
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', paddingLeft: '2.5rem', marginTop: '0.5rem' }}>
                    {cat.items.map(item => (
                      <div key={item} style={{ fontSize: '0.75rem', color: 'var(--mkt-muted)', padding: '0.25rem 0', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--mkt-text)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--mkt-muted)'}>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. CENTER TEMPLATE GRID */}
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
                  background: selectedTemplate.id === tmpl.id ? 'var(--mkt-hover-strong)' : 'var(--mkt-card)', 
                  backdropFilter: 'blur(12px)',
                  borderRadius: '12px', 
                  border: `1px solid ${selectedTemplate.id === tmpl.id ? 'var(--mkt-accent)' : isHovering === tmpl.id ? 'var(--mkt-border-hover)' : 'var(--mkt-border-light)'}`, 
                  padding: '1.25rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: isHovering === tmpl.id && selectedTemplate.id !== tmpl.id ? 'translateY(-4px)' : 'translateY(0)',
                  boxShadow: selectedTemplate.id === tmpl.id ? `0 0 0 1px var(--mkt-accent), 0 10px 25px -5px var(--mkt-glow)` : isHovering === tmpl.id ? 'var(--mkt-shadow-hover)' : 'var(--mkt-shadow)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* 5. Glassmorphism Top Gradient Border */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: selectedTemplate.id === tmpl.id ? 'var(--mkt-accent)' : 'transparent' }} />
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '1.75rem', background: 'var(--mkt-hover)', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px' }}>{tmpl.icon}</div>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '999px', background: tmpl.difficulty === 'Enterprise' ? 'rgba(139, 92, 246, 0.15)' : tmpl.difficulty === 'Advanced' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)', color: tmpl.difficulty === 'Enterprise' ? '#c4b5fd' : tmpl.difficulty === 'Advanced' ? '#fcd34d' : '#6ee7b7' }}>
                    {tmpl.difficulty}
                  </span>
                </div>
                
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem', color: selectedTemplate.id === tmpl.id ? 'var(--mkt-accent)' : 'var(--mkt-text)' }}>{tmpl.name}</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--mkt-search-icon)', lineHeight: 1.4, marginBottom: '1.25rem', height: '34px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{tmpl.desc}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--mkt-muted)' }}>{tmpl.sections} Sections</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--mkt-muted)' }}>Used: {tmpl.used}</span>
                </div>

                {isHovering === tmpl.id && selectedTemplate.id !== tmpl.id && (
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

        {/* 6 & 7. RIGHT PREVIEW PANEL + AI */}
        <div style={{ width: '340px', background: 'var(--mkt-panel)', borderLeft: '1px solid var(--mkt-border)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '2.5rem' }}>{selectedTemplate.icon}</div>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{selectedTemplate.name}</h2>
                <div style={{ fontSize: '0.75rem', color: 'var(--mkt-search-icon)', marginTop: '0.2rem' }}>{selectedTemplate.category.toUpperCase()} WORKSPACE</div>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--mkt-muted)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              {selectedTemplate.desc} Designed specifically for modern enterprise teams requiring high compliance and structural clarity.
            </p>

            {/* Dashboard Mock Preview Box */}
            <div style={{ width: '100%', height: '140px', background: 'var(--mkt-glass)', border: '1px solid var(--mkt-border-light)', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ display: 'flex', gap: '4px', padding: '8px', background: 'var(--mkt-hover)', borderBottom: '1px solid var(--mkt-border)' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} />
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
              </div>
              <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ width: '60%', height: '8px', background: 'var(--mkt-border-hover)', borderRadius: '4px' }} />
                <div style={{ width: '80%', height: '8px', background: 'var(--mkt-hover)', borderRadius: '4px' }} />
                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                  <div style={{ flex: 1, height: '40px', background: 'rgba(59, 130, 246, 0.2)', borderRadius: '6px', border: '1px solid rgba(59, 130, 246, 0.3)' }} />
                  <div style={{ flex: 1, height: '40px', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.3)' }} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--mkt-search-icon)', textTransform: 'uppercase' }}>Includes</div>
              {['Auto-generated structure', 'Kanban/Dashboard views', 'AI Copilot Assistant', 'Export to PDF/Word'].map((inc, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--mkt-text)' }}>
                  <span style={{ color: '#10b981' }}>✓</span> {inc}
                </div>
              ))}
            </div>

            <button 
              onClick={() => onUseTemplate(selectedTemplate.name, selectedTemplate.id)}
              style={{ width: '100%', padding: '0.85rem', background: 'var(--mkt-accent)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 15px var(--mkt-glow)', transition: 'background 0.2s', marginBottom: '2rem' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--mkt-accent)'}
            >
              Start With This Template
            </button>

            {/* 7. AI RECOMMENDATIONS */}
            <div style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)', borderRadius: '12px', padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1rem' }}>✨</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#c4b5fd', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Recommendations</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--mkt-text)' }}>
                  <span style={{ color: '#a78bfa' }}>✦</span> Best suited for your recent ERP modules.
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--mkt-text)' }}>
                  <span style={{ color: '#a78bfa' }}>✦</span> 84% of your team starts with this for planning.
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--mkt-text)' }}>
                  <span style={{ color: '#a78bfa' }}>✦</span> Highly recommended for Agile methodologies.
                </div>
              </div>
              <button style={{ width: '100%', padding: '0.5rem', background: 'var(--mkt-hover)', color: '#c4b5fd', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', marginTop: '1rem' }}>
                Generate Custom Template
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};


export default function SavedDocumentsList({ useTemplate }: { useTemplate?: (title: string, templateIdOrType: string) => void }) {
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
    <div style={{ padding: '3rem', maxWidth: '1000px', margin: '0 auto', height: '100%' }} className="animate-fade-in transition-colors duration-300 ease-in-out">
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
        useTemplate ? (
          <TemplateMarketplace onUseTemplate={useTemplate} projectIdFilter={projectIdFilter} />
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--surface)', borderRadius: '12px', border: '1px dashed var(--border)' }}>
            <div style={{ display: 'inline-flex', padding: '1.5rem', background: 'var(--background)', borderRadius: '50%', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              <FileText size={48} />
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>No saved documents</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>You haven't saved any documents yet. Create one and click "Save".</p>
            <Link href="/?tab=builder" className="btn btn-primary">Start Building</Link>
          </div>
        )
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

