"use client";

import React from 'react';
import { X, Clock, RotateCcw } from 'lucide-react';
import { useTemplateStore } from '@/store/useTemplateStore';

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateId: string;
}

export default function VersionHistoryModal({ isOpen, onClose, templateId }: VersionHistoryModalProps) {
  const { templates, restoreVersion } = useTemplateStore();
  const template = templates.find(t => t.id === templateId);

  if (!isOpen || !template) return null;

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
          maxWidth: '550px',
          maxHeight: '80vh',
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
              <Clock size={18} />
            </div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--mkt-text, var(--text-main))', margin: 0 }}>Version History</h2>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--mkt-muted, var(--text-muted))', cursor: 'pointer', padding: '0.25rem' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {(!template.versions || template.versions.length === 0) ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--mkt-muted, var(--text-muted))', fontSize: '0.9rem' }}>
              No version snapshots available for this template.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {/* Current Version */}
              <div style={{ padding: '1rem', border: '1px solid var(--mkt-accent, var(--primary))', borderRadius: '8px', background: 'var(--mkt-accent-bg, rgba(59,130,246,0.05))', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 700, color: 'var(--mkt-text, var(--text-main))' }}>{template.version}</span>
                    <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', background: 'var(--mkt-accent, var(--primary))', color: '#fff', borderRadius: '4px', fontWeight: 600 }}>CURRENT</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--mkt-muted, var(--text-muted))' }}>Last edited {new Date(template.lastEdited).toLocaleString()}</span>
                </div>
              </div>

              {/* Previous Versions */}
              {[...template.versions].reverse().map((v, idx) => (
                <div key={`${v.version}-\${idx}`} style={{ padding: '1rem', border: '1px solid var(--mkt-border, var(--border))', borderRadius: '8px', background: 'var(--mkt-panel, var(--surface))', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--mkt-text, var(--text-main))' }}>{v.version}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--mkt-muted, var(--text-muted))' }}>Saved {new Date(v.timestamp).toLocaleString()}</span>
                    {v.changesDescription && (
                      <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'var(--mkt-text, var(--text-main))' }}>
                        {v.changesDescription}
                      </p>
                    )}
                  </div>
                  <button 
                    onClick={() => {
                      if (confirm(`Are you sure you want to restore template to \${v.version}? Current changes will be overwritten.`)) {
                        restoreVersion(templateId, v.version);
                        onClose();
                      }
                    }}
                    style={{ padding: '0.4rem 0.75rem', borderRadius: '6px', border: '1px solid var(--mkt-border, var(--border))', background: 'var(--mkt-hover, rgba(0,0,0,0.05))', color: 'var(--mkt-text, var(--text-main))', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    <RotateCcw size={14} /> Restore
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
