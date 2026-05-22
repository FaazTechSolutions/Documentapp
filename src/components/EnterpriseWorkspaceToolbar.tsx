import React, { useState } from 'react';
import { 
  LayoutDashboard, LayoutTemplate, Sparkles, Settings, PenTool, 
  Save, Undo, Redo, Share2, Search, Bell, ChevronDown, CheckCircle, Clock
} from 'lucide-react';
import CommandPalette from './CommandPalette';

interface EnterpriseWorkspaceToolbarProps {
  viewMode: 'canvas' | 'dashboard';
  setViewMode: (mode: 'canvas' | 'dashboard') => void;
  showAiPanel: boolean;
  setShowAiPanel: (show: boolean) => void;
  showPropertiesPanel: boolean;
  setShowPropertiesPanel: (show: boolean) => void;
  isManualEdit: boolean;
  setIsManualEdit: (edit: boolean) => void;
  docType: string;
  documentTitle: string;
  isTemplateBuilder?: boolean;
  currentPageId?: string | null;
  navigationStack?: { id: string; title: string }[];
  onNavigateBack?: () => void;
}

export default function EnterpriseWorkspaceToolbar({
  viewMode,
  setViewMode,
  showAiPanel,
  setShowAiPanel,
  showPropertiesPanel,
  setShowPropertiesPanel,
  isManualEdit,
  setIsManualEdit,
  docType,
  documentTitle,
  isTemplateBuilder,
  currentPageId,
  navigationStack,
  onNavigateBack
}: EnterpriseWorkspaceToolbarProps) {
  
  const [showAiDropdown, setShowAiDropdown] = useState(false);

  const isPremiumTemplate = ['brd', 'frd', 'srs', 'tdd', 'sprint'].includes(docType) ||
    ['brd', 'frd', 'srs', 'tdd', 'sprint', 'business requirement', 'feature requirement', 'software requirement', 'technical design'].some(
      keyword => documentTitle.toLowerCase().includes(keyword)
    );

  const getButtonStyles = (isActive: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.4rem 1rem',
    fontSize: '0.85rem',
    fontWeight: 600,
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    background: isActive ? 'linear-gradient(180deg, #2563eb, #1d4ed8)' : 'transparent',
    color: isActive ? '#ffffff' : 'var(--text-muted)',
    boxShadow: isActive ? '0 4px 15px -3px rgba(37, 99, 235, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)' : 'none',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: isActive ? 'translateY(0)' : 'translateY(0)',
  });

  return (
    <>
      <CommandPalette />
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        padding: '0.5rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        height: '60px'
      }}>
        
        {/* LEFT SECTION: Document Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span 
                onClick={currentPageId ? onNavigateBack : undefined}
                style={{ 
                  fontSize: '1rem', 
                  fontWeight: 800, 
                  color: currentPageId ? 'var(--primary)' : 'var(--text-main)', 
                  letterSpacing: '-0.01em',
                  cursor: currentPageId ? 'pointer' : 'default',
                  textDecoration: currentPageId ? 'underline' : 'none'
                }}
              >
                {documentTitle || 'Untitled Document'}
              </span>
              {currentPageId && navigationStack && (
                <>
                  <span style={{ color: 'var(--text-muted)' }}>/</span>
                  <span style={{ color: 'var(--text-main)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.95rem', fontWeight: 600 }}>
                    📄 {navigationStack[navigationStack.length - 1]?.title || 'Subpage'}
                  </span>
                </>
              )}
              <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '4px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <CheckCircle size={10} /> Saved
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>Workspace</span>
              <span>/</span>
              <span style={{ color: 'var(--primary)' }}>{docType ? docType.toUpperCase() : 'Custom'}</span>
              <span>/</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><Clock size={10} /> Just now</span>
            </div>
          </div>
        </div>

        {/* CENTER SECTION: View Switcher */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(0, 0, 0, 0.2)',
          padding: '0.25rem',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          gap: '0.25rem'
        }}>
          {isPremiumTemplate && (
            <button
              onClick={() => { setViewMode('dashboard'); setIsManualEdit(false); }}
              style={getButtonStyles(viewMode === 'dashboard')}
              onMouseEnter={e => { if (viewMode !== 'dashboard') { e.currentTarget.style.color = 'var(--text-main)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; } }}
              onMouseLeave={e => { if (viewMode !== 'dashboard') { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; } }}
            >
              <LayoutDashboard size={14} style={{ color: viewMode === 'dashboard' ? '#93c5fd' : 'currentColor' }} />
              Dashboard
            </button>
          )}

          {isPremiumTemplate && <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.1)' }} />}

          <button
            onClick={() => { setViewMode('canvas'); setIsManualEdit(false); }}
            style={getButtonStyles(viewMode === 'canvas' && !isManualEdit)}
            onMouseEnter={e => { if (!(viewMode === 'canvas' && !isManualEdit)) { e.currentTarget.style.color = 'var(--text-main)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; } }}
            onMouseLeave={e => { if (!(viewMode === 'canvas' && !isManualEdit)) { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; } }}
          >
            <LayoutTemplate size={14} style={{ color: (viewMode === 'canvas' && !isManualEdit) ? '#93c5fd' : 'currentColor' }} />
            Canvas
          </button>

          <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.1)' }} />

          <button
            onClick={() => setShowAiPanel(!showAiPanel)}
            style={getButtonStyles(showAiPanel)}
            onMouseEnter={e => { if (!showAiPanel) { e.currentTarget.style.color = 'var(--text-main)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; } }}
            onMouseLeave={e => { if (!showAiPanel) { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; } }}
          >
            <Sparkles size={14} style={{ color: showAiPanel ? '#93c5fd' : 'currentColor' }} />
            AI Copilot
          </button>

          <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.1)' }} />

          <button
            onClick={() => { setViewMode('canvas'); setIsManualEdit(true); }}
            style={getButtonStyles(isManualEdit)}
            onMouseEnter={e => { if (!isManualEdit) { e.currentTarget.style.color = 'var(--text-main)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; } }}
            onMouseLeave={e => { if (!isManualEdit) { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; } }}
          >
            <PenTool size={14} style={{ color: isManualEdit ? '#93c5fd' : 'currentColor' }} />
            Editor
          </button>

          <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.1)' }} />

          <button
            onClick={() => setShowPropertiesPanel(!showPropertiesPanel)}
            style={getButtonStyles(showPropertiesPanel)}
            onMouseEnter={e => { if (!showPropertiesPanel) { e.currentTarget.style.color = 'var(--text-main)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; } }}
            onMouseLeave={e => { if (!showPropertiesPanel) { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; } }}
          >
            <Settings size={14} style={{ color: showPropertiesPanel ? '#93c5fd' : 'currentColor' }} />
            Properties
          </button>
        </div>

        {/* RIGHT SECTION: Quick Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, justifyContent: 'flex-end' }}>
          
          <div style={{ display: 'flex', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
            <button style={{ padding: '0.4rem 0.6rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', borderRight: '1px solid var(--border)' }} title="Undo"><Undo size={14} /></button>
            <button style={{ padding: '0.4rem 0.6rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', borderRight: '1px solid var(--border)' }} title="Redo"><Redo size={14} /></button>
            <button style={{ padding: '0.4rem 0.6rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Save"><Save size={14} /></button>
          </div>

          <button 
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.75rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
          >
            <Share2 size={14} /> Share
          </button>

          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowAiDropdown(!showAiDropdown)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.75rem', background: 'rgba(168, 85, 247, 0.15)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '8px', color: '#c084fc', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
            >
              <Sparkles size={14} /> AI Actions <ChevronDown size={14} />
            </button>
            {showAiDropdown && (
              <div 
                className="animate-fade-in"
                style={{ position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem', width: '220px', background: 'var(--mkt-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '0.5rem', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', zIndex: 100 }}
              >
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '0.25rem 0.5rem', marginBottom: '0.25rem' }}>Smart Commands</div>
                <button onClick={() => alert('Feature coming soon!')} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', background: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: '0.85rem', cursor: 'pointer', borderRadius: '6px', textAlign: 'left' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--hover)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>✨ Generate Full Document</button>
                <button onClick={() => alert('Feature coming soon!')} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', background: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: '0.85rem', cursor: 'pointer', borderRadius: '6px', textAlign: 'left' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--hover)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>✨ Generate Section</button>
                <button onClick={() => alert('Feature coming soon!')} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', background: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: '0.85rem', cursor: 'pointer', borderRadius: '6px', textAlign: 'left' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--hover)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>✨ Improve Content</button>
                <button onClick={() => alert('Feature coming soon!')} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', background: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: '0.85rem', cursor: 'pointer', borderRadius: '6px', textAlign: 'left' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--hover)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>✨ AI Summary</button>
              </div>
            )}
          </div>

          <button 
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.6rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer' }}
            title="Command Palette (Ctrl+K)"
            onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
          >
            <Search size={14} /> <span style={{ background: 'var(--background)', padding: '0.1rem 0.3rem', borderRadius: '4px', border: '1px solid var(--border)', fontSize: '0.65rem' }}>⌘K</span>
          </button>

          <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <Bell size={18} />
          </button>
          
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, border: '2px solid rgba(255,255,255,0.1)' }}>
            SA
          </div>
        </div>

      </div>
    </>
  );
}
