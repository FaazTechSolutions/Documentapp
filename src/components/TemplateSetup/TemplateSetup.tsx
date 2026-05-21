"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, LayoutTemplate, Settings, Server, FileText, CheckCircle, Bug, HelpCircle, ChevronRight, MoreVertical, Edit2, Copy, Trash2, Share2, Upload, Download } from 'lucide-react';
import { useTemplateStore } from '@/store/useTemplateStore';

const CATEGORIES = [
  { id: 'business', label: 'Business Templates', icon: <FileText size={16} />, color: 'var(--primary)' },
  { id: 'agile', label: 'Agile Templates', icon: <CheckCircle size={16} />, color: '#10B981' },
  { id: 'qa', label: 'QA Templates', icon: <Bug size={16} />, color: '#F59E0B' },
  { id: 'devops', label: 'DevOps Templates', icon: <Server size={16} />, color: '#8B5CF6' },
  { id: 'support', label: 'Support Templates', icon: <HelpCircle size={16} />, color: '#EC4899' },
];

export default function TemplateSetup() {
  const router = useRouter();
  const { templates, duplicateTemplate, deleteTemplate, syncFromStorage } = useTemplateStore();
  
  const [activeCategory, setActiveCategory] = useState('business');
  const [searchQuery, setSearchQuery] = useState('');
  const [isHovering, setIsHovering] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [selectedTemplateForPreview, setSelectedTemplateForPreview] = useState<any>(null);

  useEffect(() => {
    syncFromStorage();
  }, [syncFromStorage]);

  const filteredTemplates = templates.filter(t => 
    (t.category === activeCategory) &&
    (t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     (t.tags && t.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))))
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--background)' }}>
      
      {/* HEADER SECTION */}
      <div style={{ padding: '2rem', borderBottom: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.6rem', background: 'var(--mkt-accent-bg, rgba(59,130,246,0.1))', color: 'var(--primary)', borderRadius: '12px' }}>
              <Settings size={24} />
            </div>
            Template Setup Center
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.5rem', fontWeight: 500 }}>
            Manage, edit, publish, and organize enterprise templates.
          </p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search templates, formats, layouts..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text-main)', fontSize: '0.9rem', outline: 'none' }}
            />
          </div>
          <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', borderRadius: '10px' }}>
            <Download size={16} /> Import
          </button>
          <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', borderRadius: '10px', boxShadow: 'var(--glow)' }}>
            <Plus size={16} /> Create Template
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* LEFT CATEGORY SIDEBAR */}
        <div style={{ width: '280px', borderRight: '1px solid var(--border)', background: 'var(--surface)', padding: '1.5rem', overflowY: 'auto' }}>
          <h3 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '1rem' }}>
            Categories
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {CATEGORIES.map(cat => {
              const isActive = activeCategory === cat.id;
              const count = templates.filter(t => t.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    borderRadius: '10px',
                    border: isActive ? `1px solid \${cat.color}` : '1px solid transparent',
                    background: isActive ? `${cat.color}15` : 'transparent',
                    color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                    fontWeight: isActive ? 600 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'left'
                  }}
                  onMouseEnter={e => !isActive && (e.currentTarget.style.background = 'var(--hover)')}
                  onMouseLeave={e => !isActive && (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ color: isActive ? cat.color : 'inherit' }}>{cat.icon}</div>
                    <span>{cat.label}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', background: isActive ? cat.color : 'var(--border)', color: isActive ? '#fff' : 'var(--text-main)', padding: '0.1rem 0.5rem', borderRadius: '10px', fontWeight: 700 }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* MAIN TEMPLATE WORKSPACE */}
        <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', background: 'var(--background)' }}>
          {filteredTemplates.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'var(--surface)', border: '1px dashed var(--border)', borderRadius: '16px' }}>
              <LayoutTemplate size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.5 }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>No templates found</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Create a new template in this category to get started.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {filteredTemplates.map(t => (
                <div 
                  key={t.id}
                  onMouseEnter={() => setIsHovering(t.id)}
                  onMouseLeave={() => setIsHovering(null)}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.25rem',
                    position: 'relative',
                    transition: 'all 0.3s',
                    transform: isHovering === t.id ? 'translateY(-4px)' : 'none',
                    boxShadow: isHovering === t.id ? '0 12px 30px -10px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--mkt-accent-bg, rgba(59,130,246,0.1))', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                        {t.icon || '📄'}
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>{t.name}</h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>{t.category}</span>
                      </div>
                    </div>
                    
                    {/* Action Menu */}
                    <div style={{ position: 'relative' }}>
                      <button 
                        onClick={() => setOpenMenuId(openMenuId === t.id ? null : t.id)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}
                      >
                        <MoreVertical size={18} />
                      </button>
                      
                      {openMenuId === t.id && (
                        <div className="animate-fade-in" style={{ position: 'absolute', top: '100%', right: 0, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', zIndex: 50, width: '160px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}>
                          <button onClick={() => { router.push(`/?tab=builder&id=\${t.id}`); setOpenMenuId(null); }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem', background: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: '0.85rem', cursor: 'pointer', textAlign: 'left', borderRadius: '6px' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--hover)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}><Edit2 size={14} /> Edit Template</button>
                          <button onClick={() => { duplicateTemplate(t.id); setOpenMenuId(null); }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem', background: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: '0.85rem', cursor: 'pointer', textAlign: 'left', borderRadius: '6px' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--hover)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}><Copy size={14} /> Duplicate</button>
                          <button onClick={() => { setOpenMenuId(null); }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem', background: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: '0.85rem', cursor: 'pointer', textAlign: 'left', borderRadius: '6px' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--hover)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}><Share2 size={14} /> Share</button>
                          <div style={{ height: '1px', background: 'var(--border)', margin: '0.25rem 0' }} />
                          <button onClick={() => { deleteTemplate(t.id); setOpenMenuId(null); }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem', background: 'transparent', border: 'none', color: '#ef4444', fontSize: '0.85rem', cursor: 'pointer', textAlign: 'left', borderRadius: '6px' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}><Trash2 size={14} /> Delete</button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Metadata Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', background: 'var(--hover)', padding: '1rem', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>VERSION</span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 700 }}>{t.version || 'v1.0'}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>STATUS</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: t.status === 'Draft' ? '#F59E0B' : '#10B981' }} />
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>{t.status || 'Published'}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', gridColumn: 'span 2' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>LAST UPDATED</span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{new Date(t.lastEdited).toLocaleDateString()} at {new Date(t.lastEdited).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {t.description || 'Enterprise template configuration.'}
                  </p>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {t.tags && t.tags.map((tag: string) => (
                      <span key={tag} style={{ padding: '0.25rem 0.6rem', background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--text-muted)', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 600 }}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                    <button 
                      style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-main)', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--hover)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      Preview
                    </button>
                    <button 
                      onClick={() => router.push(`/?tab=builder&id=\${t.id}`)}
                      style={{ padding: '0.5rem 1.5rem', background: 'var(--primary)', border: 'none', color: '#fff', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', boxShadow: 'var(--glow)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                      <Edit2 size={14} /> Edit Setup
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
