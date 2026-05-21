"use client";

import React, { useState, useEffect } from 'react';
import { X, Save, Copy, Check } from 'lucide-react';
import { useTemplateStore, TemplateBlock } from '@/store/useTemplateStore';

interface TemplateSaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateId: string;
  blocks: TemplateBlock[];
  onSuccess: () => void;
}

export default function TemplateSaveModal({ isOpen, onClose, templateId, blocks, onSuccess }: TemplateSaveModalProps) {
  const { templates, saveTemplate, saveAsNewTemplate } = useTemplateStore();
  const [saveMode, setSaveMode] = useState<'update' | 'new'>('update');
  
  // For 'new' mode
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [createSnapshot, setCreateSnapshot] = useState(true);
  const [changesDesc, setChangesDesc] = useState('');
  
  const currentTemplate = templates.find(t => t.id === templateId);

  useEffect(() => {
    if (isOpen && currentTemplate) {
      setNewName(`${currentTemplate.name} (Copy)`);
      setNewDesc(currentTemplate.description || '');
      setSaveMode('update');
      setCreateSnapshot(true);
      setChangesDesc('');
    }
  }, [isOpen, currentTemplate]);

  if (!isOpen || !currentTemplate) return null;

  const handleSave = () => {
    if (saveMode === 'update') {
      saveTemplate(templateId, blocks, createSnapshot, changesDesc);
      onSuccess();
      onClose();
    } else {
      if (!newName.trim()) return;
      saveAsNewTemplate({
        name: newName,
        description: newDesc,
        category: currentTemplate.category,
        visibility: currentTemplate.visibility,
        status: 'Draft',
        tags: currentTemplate.tags,
        baseTemplateId: currentTemplate.id
      }, blocks);
      onSuccess();
      onClose();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(4px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }} className="animate-fade-in" onClick={onClose}>
      
      <div 
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '500px',
          background: 'var(--mkt-card, var(--surface))',
          border: '1px solid var(--mkt-border, var(--border))',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--mkt-border, var(--border))', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ padding: '0.5rem', background: 'var(--mkt-accent-bg, rgba(59, 130, 246, 0.1))', borderRadius: '8px', color: 'var(--mkt-accent, var(--primary))' }}>
              <Save size={18} />
            </div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--mkt-text, var(--text-main))', margin: 0 }}>Save Template Changes?</h2>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--mkt-muted, var(--text-muted))', cursor: 'pointer', padding: '0.25rem' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--mkt-text, var(--text-main))', lineHeight: 1.5 }}>
            You are about to save changes to <strong>{currentTemplate.name}</strong>. This will update the template structure and affect future documents created from it.
          </p>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={() => setSaveMode('update')}
              style={{
                flex: 1,
                padding: '1rem',
                borderRadius: '8px',
                border: saveMode === 'update' ? '2px solid var(--mkt-accent, var(--primary))' : '1px solid var(--mkt-border, var(--border))',
                background: saveMode === 'update' ? 'var(--mkt-accent-bg, rgba(59,130,246,0.05))' : 'transparent',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <Save size={24} style={{ color: saveMode === 'update' ? 'var(--mkt-accent, var(--primary))' : 'var(--mkt-muted, var(--text-muted))' }} />
              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: saveMode === 'update' ? 'var(--mkt-text, var(--text-main))' : 'var(--mkt-muted, var(--text-muted))' }}>Update Existing</span>
            </button>
            <button 
              onClick={() => setSaveMode('new')}
              style={{
                flex: 1,
                padding: '1rem',
                borderRadius: '8px',
                border: saveMode === 'new' ? '2px solid var(--mkt-accent, var(--primary))' : '1px solid var(--mkt-border, var(--border))',
                background: saveMode === 'new' ? 'var(--mkt-accent-bg, rgba(59,130,246,0.05))' : 'transparent',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <Copy size={24} style={{ color: saveMode === 'new' ? 'var(--mkt-accent, var(--primary))' : 'var(--mkt-muted, var(--text-muted))' }} />
              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: saveMode === 'new' ? 'var(--mkt-text, var(--text-main))' : 'var(--mkt-muted, var(--text-muted))' }}>Save As New</span>
            </button>
          </div>

          {saveMode === 'update' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--mkt-text, var(--text-main))' }}>
                <input type="checkbox" checked={createSnapshot} onChange={e => setCreateSnapshot(e.target.checked)} style={{ cursor: 'pointer' }} />
                Create version snapshot before saving
              </label>
              {createSnapshot && (
                <input 
                  type="text" 
                  value={changesDesc}
                  onChange={e => setChangesDesc(e.target.value)}
                  placeholder="Describe your changes (optional)..."
                  style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid var(--mkt-border, var(--border))', background: 'var(--mkt-input, var(--background))', color: 'var(--mkt-text, var(--text-main))', fontSize: '0.85rem', outline: 'none' }}
                />
              )}
            </div>
          )}

          {saveMode === 'new' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--mkt-muted, var(--text-muted))', marginBottom: '0.5rem' }}>New Template Name</label>
                <input 
                  type="text" 
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid var(--mkt-border, var(--border))', background: 'var(--mkt-input, var(--background))', color: 'var(--mkt-text, var(--text-main))', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--mkt-muted, var(--text-muted))', marginBottom: '0.5rem' }}>Description</label>
                <textarea 
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  rows={2}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid var(--mkt-border, var(--border))', background: 'var(--mkt-input, var(--background))', color: 'var(--mkt-text, var(--text-main))', fontSize: '0.9rem', outline: 'none', resize: 'none' }}
                />
              </div>
            </div>
          )}
        </div>

        <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--mkt-border, var(--border))', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', background: 'var(--mkt-bg, var(--background))' }}>
          <button onClick={onClose} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--mkt-border, var(--border))', background: 'transparent', color: 'var(--mkt-text, var(--text-main))', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSave} style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', border: 'none', background: 'var(--mkt-accent, var(--primary))', color: '#fff', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', boxShadow: 'var(--mkt-glow, 0 4px 15px rgba(59, 130, 246, 0.4))' }}>
            {saveMode === 'update' ? 'Save Changes' : 'Create Template'}
          </button>
        </div>

      </div>
    </div>
  );
}
