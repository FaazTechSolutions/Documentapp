"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MoreVertical, Copy, Archive, Trash2, Edit3, Share2, Clock } from 'lucide-react';
import { useDocumentStore } from '@/store/useDocumentStore';
import { useRouter } from 'next/navigation';

export default function DocumentActionMenu({ doc, onEdit }: { doc: any, onEdit?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { duplicateDocument, archiveDocument, restoreDocument, deleteDocument } = useDocumentStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateDocument(doc.id);
    setIsOpen(false);
  };

  const handleArchiveToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (doc.isArchived) {
      restoreDocument(doc.id);
    } else {
      archiveDocument(doc.id);
    }
    setIsOpen(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${doc.title}"?`)) {
      deleteDocument(doc.id);
    }
    setIsOpen(false);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) onEdit();
    setIsOpen(false);
  };

  return (
    <div style={{ position: 'relative' }} ref={menuRef}>
      <button 
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem', borderRadius: '4px' }}
      >
        <MoreVertical size={16} />
      </button>

      {isOpen && (
        <div style={{ 
          position: 'absolute', right: 0, top: '100%', marginTop: '0.25rem',
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: '8px', boxShadow: 'var(--shadow-md)', minWidth: '180px',
          zIndex: 50, padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.2rem'
        }}>
          <button onClick={handleEdit} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer', borderRadius: '4px', fontSize: '0.85rem', color: 'var(--text-main)' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--background)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <Edit3 size={14} /> Edit Metadata
          </button>
          <button onClick={(e) => { e.stopPropagation(); router.push(`/?tab=builder&id=${doc.id}`); }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer', borderRadius: '4px', fontSize: '0.85rem', color: 'var(--text-main)' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--background)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <Share2 size={14} /> Open in Builder
          </button>
          <button onClick={handleDuplicate} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer', borderRadius: '4px', fontSize: '0.85rem', color: 'var(--text-main)' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--background)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <Copy size={14} /> Duplicate
          </button>
          
          <div style={{ height: '1px', background: 'var(--border)', margin: '0.2rem 0' }} />
          
          <button onClick={handleArchiveToggle} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer', borderRadius: '4px', fontSize: '0.85rem', color: 'var(--text-main)' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--background)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <Archive size={14} /> {doc.isArchived ? 'Restore' : 'Archive'}
          </button>
          <button onClick={handleDelete} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer', borderRadius: '4px', fontSize: '0.85rem', color: 'var(--danger, #ef4444)' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <Trash2 size={14} /> Delete
          </button>
        </div>
      )}
    </div>
  );
}
