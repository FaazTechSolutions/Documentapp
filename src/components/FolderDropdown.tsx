"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Folder, Check, X, ChevronDown } from 'lucide-react';
import { useProjectStore } from '@/store/useProjectStore';

interface Project {
  id: string;
  name: string;
  color?: string;
  icon?: string;
}

interface FolderDropdownProps {
  selectedProjectId: string;
  onSelectProject: (id: string) => void;
  onCreateNewClick: () => void;
}

export default function FolderDropdown({ selectedProjectId, onSelectProject, onCreateNewClick }: FolderDropdownProps) {
  const { projects } = useProjectStore();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [docCounts, setDocCounts] = useState<Record<string, number>>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Calculate document counts per folder
    try {
      const metaList = JSON.parse(localStorage.getItem('docforge_docs_meta') || '[]');
      const counts: Record<string, number> = {};
      metaList.forEach((m: any) => {
        if (m.projectId) {
          counts[m.projectId] = (counts[m.projectId] || 0) + 1;
        }
      });
      setDocCounts(counts);
    } catch (e) {}
  }, [isOpen, projects]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredProjects = projects.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const selectedProject = projects.find(p => String(p.id) === String(selectedProjectId));

  return (
    <div className="folder-dropdown-container" ref={dropdownRef} style={{ position: 'relative', width: '100%' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '0.5rem 0.75rem',
          borderRadius: '8px',
          border: '1px solid var(--mkt-border, var(--border))',
          background: 'var(--mkt-input, var(--surface))',
          color: 'var(--mkt-text, var(--text-main))',
          fontSize: '0.85rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s',
          boxShadow: isOpen ? '0 0 0 2px var(--mkt-glow, rgba(59, 130, 246, 0.2))' : 'none',
          borderColor: isOpen ? 'var(--mkt-accent, var(--primary))' : 'var(--mkt-border, var(--border))'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Folder size={16} style={{ color: selectedProject?.color || 'var(--mkt-muted, var(--text-muted))' }} />
          <span style={{ fontWeight: 500 }}>{selectedProject ? selectedProject.name : 'No Folder Selected'}</span>
        </div>
        <ChevronDown size={16} style={{ color: 'var(--mkt-muted, var(--text-muted))', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 4px)',
          left: 0,
          right: 0,
          background: 'var(--mkt-panel, var(--surface))',
          border: '1px solid var(--mkt-border, var(--border))',
          borderRadius: '12px',
          boxShadow: 'var(--mkt-shadow-hover, 0 10px 25px -5px rgba(0,0,0,0.2))',
          zIndex: 100,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          backdropFilter: 'blur(16px)'
        }} className="animate-fade-in transition-colors duration-300">
          
          <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--mkt-border, var(--border))' }}>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--mkt-muted, var(--text-muted))' }} />
              <input 
                autoFocus
                type="text"
                placeholder="Find folder..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.4rem 0.5rem 0.4rem 1.75rem',
                  background: 'var(--mkt-hover, rgba(255,255,255,0.05))',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'var(--mkt-text, var(--text-main))',
                  fontSize: '0.8rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ maxHeight: '200px', overflowY: 'auto', padding: '0.5rem' }}>
            <div 
              onClick={() => { onSelectProject(''); setIsOpen(false); }}
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.8rem',
                color: 'var(--mkt-text, var(--text-main))',
                background: !selectedProjectId ? 'var(--mkt-hover, rgba(255,255,255,0.05))' : 'transparent',
                transition: 'background 0.2s'
              }}
              onMouseEnter={e => { if (selectedProjectId) e.currentTarget.style.background = 'var(--mkt-hover, rgba(255,255,255,0.05))'; }}
              onMouseLeave={e => { if (selectedProjectId) e.currentTarget.style.background = 'transparent'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Folder size={14} style={{ color: 'var(--mkt-muted, var(--text-muted))', opacity: 0.5 }} />
                <span>No Folder</span>
              </div>
              {!selectedProjectId && <Check size={14} style={{ color: 'var(--mkt-accent, var(--primary))' }} />}
            </div>

            {filteredProjects.map(p => (
              <div 
                key={p.id}
                onClick={() => { onSelectProject(String(p.id)); setIsOpen(false); }}
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.8rem',
                  color: 'var(--mkt-text, var(--text-main))',
                  background: String(selectedProjectId) === String(p.id) ? 'var(--mkt-hover, rgba(255,255,255,0.05))' : 'transparent',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={e => { if (String(selectedProjectId) !== String(p.id)) e.currentTarget.style.background = 'var(--mkt-hover, rgba(255,255,255,0.05))'; }}
                onMouseLeave={e => { if (String(selectedProjectId) !== String(p.id)) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>{p.icon || '📁'}</span>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 500, color: p.color || 'inherit' }}>{p.name}</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--mkt-muted, var(--text-muted))' }}>{docCounts[p.id] || 0} Documents</span>
                  </div>
                </div>
                {String(selectedProjectId) === String(p.id) && <Check size={14} style={{ color: 'var(--mkt-accent, var(--primary))' }} />}
              </div>
            ))}
          </div>

          <div style={{ padding: '0.5rem', borderTop: '1px solid var(--mkt-border, var(--border))' }}>
            <button
              onClick={() => {
                setIsOpen(false);
                onCreateNewClick();
              }}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '6px',
                border: 'none',
                background: 'var(--mkt-accent-bg, rgba(59, 130, 246, 0.1))',
                color: 'var(--mkt-accent, var(--primary))',
                fontSize: '0.8rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--mkt-accent, var(--primary))'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--mkt-accent-bg, rgba(59, 130, 246, 0.1))'; e.currentTarget.style.color = 'var(--mkt-accent, var(--primary))'; }}
            >
              <Plus size={14} /> Create New Folder
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
