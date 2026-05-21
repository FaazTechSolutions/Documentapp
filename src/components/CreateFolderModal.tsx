"use client";

import React, { useState, useEffect, useRef } from 'react';
import { X, FolderPlus } from 'lucide-react';
import { useProjectStore } from '@/store/useProjectStore';

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newProjectId: string) => void;
}

const ICONS = ['📁', '🚀', '💼', '📊', '🛠️', '🔒', '📚', '⚡'];
const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#64748b'];

export default function CreateFolderModal({ isOpen, onClose, onSuccess }: CreateFolderModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('📁');
  const [selectedColor, setSelectedColor] = useState('#3b82f6');
  const [error, setError] = useState('');
  
  const inputRef = useRef<HTMLInputElement>(null);
  const { projects, addProject } = useProjectStore();

  useEffect(() => {
    if (isOpen) {
      setName('');
      setDescription('');
      setError('');
      setSelectedIcon('📁');
      setSelectedColor('#3b82f6');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!name.trim()) {
      setError('Folder name is required.');
      return;
    }

    try {
      if (projects.some(p => p.name.toLowerCase() === name.trim().toLowerCase())) {
        setError('A folder with this name already exists.');
        return;
      }

      const newProject = {
        id: Date.now().toString(),
        name: name.trim(),
        description: description.trim(),
        icon: selectedIcon,
        color: selectedColor,
        createdAt: new Date().toISOString(),
        status: 'active',
        category: 'Custom'
      };

      addProject(newProject);
      
      onSuccess(newProject.id);
      onClose();
    } catch (err) {
      setError('Failed to create folder. Please try again.');
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
          maxWidth: '450px',
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
              <FolderPlus size={18} />
            </div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--mkt-text, var(--text-main))', margin: 0 }}>Create New Folder</h2>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--mkt-muted, var(--text-muted))', cursor: 'pointer', padding: '0.25rem' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {error && (
            <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 500 }}>
              {error}
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--mkt-muted, var(--text-muted))', marginBottom: '0.5rem' }}>Folder Name</label>
            <input 
              ref={inputRef}
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g., HR Documents, Q3 Planning..."
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid var(--mkt-border-hover, var(--border))',
                background: 'var(--mkt-input, var(--background))',
                color: 'var(--mkt-text, var(--text-main))',
                fontSize: '0.9rem',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.currentTarget.style.borderColor = 'var(--mkt-accent, var(--primary))'}
              onBlur={e => e.currentTarget.style.borderColor = 'var(--mkt-border-hover, var(--border))'}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--mkt-muted, var(--text-muted))', marginBottom: '0.5rem' }}>Description (Optional)</label>
            <textarea 
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What goes in this folder?"
              rows={2}
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid var(--mkt-border-hover, var(--border))',
                background: 'var(--mkt-input, var(--background))',
                color: 'var(--mkt-text, var(--text-main))',
                fontSize: '0.9rem',
                outline: 'none',
                resize: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.currentTarget.style.borderColor = 'var(--mkt-accent, var(--primary))'}
              onBlur={e => e.currentTarget.style.borderColor = 'var(--mkt-border-hover, var(--border))'}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--mkt-muted, var(--text-muted))', marginBottom: '0.5rem' }}>Icon</label>
              <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                {ICONS.map(icon => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setSelectedIcon(icon)}
                    style={{
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '6px',
                      border: selectedIcon === icon ? '1px solid var(--mkt-accent, var(--primary))' : '1px solid transparent',
                      background: selectedIcon === icon ? 'var(--mkt-accent-bg, rgba(59, 130, 246, 0.1))' : 'var(--mkt-hover, rgba(255,255,255,0.05))',
                      fontSize: '1rem',
                      cursor: 'pointer'
                    }}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--mkt-muted, var(--text-muted))', marginBottom: '0.5rem' }}>Color</label>
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                {COLORS.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      border: selectedColor === color ? '2px solid var(--mkt-text, #fff)' : '2px solid transparent',
                      background: color,
                      cursor: 'pointer',
                      boxShadow: selectedColor === color ? `0 0 0 1px ${color}` : 'none'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

        </form>

        <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--mkt-border, var(--border))', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', background: 'var(--mkt-bg, var(--background))' }}>
          <button 
            type="button"
            onClick={onClose}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: '1px solid var(--mkt-border, var(--border))',
              background: 'transparent',
              color: 'var(--mkt-text, var(--text-main))',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button 
            type="button"
            onClick={handleSubmit}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '8px',
              border: 'none',
              background: 'var(--mkt-accent, var(--primary))',
              color: '#fff',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: 'var(--mkt-glow, 0 4px 15px rgba(59, 130, 246, 0.4))'
            }}
          >
            Create Folder
          </button>
        </div>

      </div>
    </div>
  );
}
