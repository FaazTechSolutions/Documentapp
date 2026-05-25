"use client";

import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { UnifiedDocument } from '@/store/useDocumentStore';

interface EditDocumentMetadataModalProps {
  isOpen: boolean;
  document: UnifiedDocument | null;
  onSave: (id: string, updates: Partial<UnifiedDocument>) => void;
  onClose: () => void;
}

export default function EditDocumentMetadataModal({ isOpen, document, onSave, onClose }: EditDocumentMetadataModalProps) {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('');
  const [workspaceId, setWorkspaceId] = useState('');

  useEffect(() => {
    if (document) {
      setTitle(document.title);
      setStatus(document.status);
      setWorkspaceId(document.workspaceId || '');
    }
  }, [document]);

  if (!isOpen || !document) return null;

  const handleSave = () => {
    onSave(document.id, { title, status, workspaceId: workspaceId || undefined });
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
      <div style={{ background: 'var(--surface)', borderRadius: '12px', width: '500px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid var(--border)', overflow: 'hidden', animation: 'fadeIn 0.2s ease-out' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--background)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>Edit Metadata</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
        </div>
        
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>Document Title</label>
            <input 
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-main)' }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>Status</label>
            <select 
              value={status} 
              onChange={e => setStatus(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-main)' }}
            >
              <option value="Draft">Draft</option>
              <option value="In Review">In Review</option>
              <option value="Needs Approval">Needs Approval</option>
              <option value="Published">Published</option>
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>Workspace ID</label>
            <input 
              type="text" 
              value={workspaceId} 
              onChange={e => setWorkspaceId(e.target.value)}
              placeholder="Leave blank for root"
              style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-main)' }}
            />
          </div>
        </div>
        
        <div style={{ padding: '1.25rem 1.5rem', background: 'var(--background)', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button 
            onClick={onClose}
            style={{ padding: '0.6rem 1.25rem', background: 'transparent', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-main)', fontWeight: 600, cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="btn btn-primary"
            style={{ padding: '0.6rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Save size={16} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
