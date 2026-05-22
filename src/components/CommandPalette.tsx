import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, FileText, Sparkles, LayoutTemplate, X, Zap } from 'lucide-react';

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const mockCommands = [
    { id: 1, icon: <FileText size={16} />, label: 'Create New Document', action: () => router.push('/?tab=documents') },
    { id: 2, icon: <LayoutTemplate size={16} />, label: 'Browse Templates', action: () => router.push('/?tab=templates') },
    { id: 3, icon: <Sparkles size={16} color="#a855f7" />, label: 'AI Generate Document', action: () => alert('AI Generation triggered!') },
    { id: 4, icon: <Zap size={16} color="#f59e0b" />, label: 'View Dashboard Metrics', action: () => router.push('/?tab=dashboard') }
  ];

  const filteredCommands = mockCommands.filter(c => c.label.toLowerCase().includes(search.toLowerCase()));

  return (
    <div 
      style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '10vh', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={() => setIsOpen(false)}
    >
      <div 
        className="animate-fade-in"
        style={{ width: '100%', maxWidth: '600px', background: 'var(--mkt-card)', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)', overflow: 'hidden' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Search size={20} color="var(--text-muted)" />
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Search commands, documents, templates..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: '1.1rem', outline: 'none' }}
          />
          <button 
            onClick={() => setIsOpen(false)}
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', padding: '0.2rem 0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            ESC
          </button>
        </div>
        <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '0.5rem' }}>
          {filteredCommands.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No matching commands found.</div>
          ) : (
            <>
              <div style={{ padding: '0.5rem 0.75rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Suggestions</div>
              {filteredCommands.map(cmd => (
                <button
                  key={cmd.id}
                  onClick={() => { cmd.action(); setIsOpen(false); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.75rem', background: 'transparent', border: 'none', borderRadius: '8px', color: 'var(--text-main)', cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ background: 'var(--surface)', padding: '0.4rem', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {cmd.icon}
                  </div>
                  <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{cmd.label}</span>
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
