import React, { useState } from 'react';
import { 
  LayoutDashboard, LayoutTemplate, Sparkles, Settings, PenTool, 
  Save, Undo, Redo, Share2, Search, Bell, ChevronDown, CheckCircle, Clock, Check, Edit3, Command, FileText
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
  saveStatus?: string;
  onSave?: () => void;
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
  onNavigateBack,
  saveStatus,
  onSave
}: EnterpriseWorkspaceToolbarProps) {
  
  const [showAiDropdown, setShowAiDropdown] = useState(false);

  const isPremiumTemplate = ['brd', 'frd', 'srs', 'tdd', 'sprint'].includes(docType) ||
    ['brd', 'frd', 'srs', 'tdd', 'sprint', 'business requirement', 'feature requirement', 'software requirement', 'technical design'].some(
      keyword => documentTitle.toLowerCase().includes(keyword)
    );

  const getSegmentStyles = (isActive: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.35rem 0.75rem',
    fontSize: '0.75rem',
    fontWeight: isActive ? 700 : 600,
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    background: isActive ? 'var(--surface)' : 'transparent',
    color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
    boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)' : 'none',
    transition: 'all 0.2s ease',
  });

  const getIconButtonStyles = () => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    border: 'none',
    background: 'transparent',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  });

  return (
    <>
      <CommandPalette />
      {/* Floating Container */}
      <div style={{
        position: 'sticky',
        top: '1rem',
        zIndex: 50,
        margin: '0 auto',
        width: '95%',
        maxWidth: '1400px',
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '0.5rem 1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 10px 40px -10px rgba(0,0,0,0.3)',
        transition: 'all 0.3s ease',
      }}>
        
        {/* LEFT SECTION: Compact Document Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, overflow: 'hidden' }}>
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
              color: 'white',
              flexShrink: 0
            }}
          >
            <FileText size={14} />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            <span 
              onClick={currentPageId ? onNavigateBack : undefined}
              style={{ 
                fontSize: '0.85rem', 
                fontWeight: 700, 
                color: 'var(--text-main)', 
                cursor: currentPageId ? 'pointer' : 'default',
                textOverflow: 'ellipsis',
                overflow: 'hidden'
              }}
            >
              {documentTitle || 'Untitled Document'}
            </span>
            
            {currentPageId && navigationStack && (
              <>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>/</span>
                <span style={{ color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: 600 }}>
                  {navigationStack[navigationStack.length - 1]?.title || 'Subpage'}
                </span>
              </>
            )}

            {/* Status Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginLeft: '0.5rem' }}>
              <span style={{ 
                fontSize: '0.65rem', 
                padding: '0.15rem 0.4rem', 
                background: saveStatus === 'Saving...' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)', 
                color: saveStatus === 'Saving...' ? '#f59e0b' : '#10b981', 
                borderRadius: '999px', 
                fontWeight: 700, 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.25rem',
                border: `1px solid ${saveStatus === 'Saving...' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`
              }}>
                {saveStatus === 'Saving...' ? <Clock size={10} className="animate-spin" /> : <Check size={10} />} 
                {saveStatus || 'Saved'}
              </span>
              
              <span style={{ 
                fontSize: '0.65rem', 
                color: 'var(--text-muted)', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.25rem' 
              }}>
                <Edit3 size={10} /> Just now
              </span>
            </div>
          </div>
        </div>

        {/* CENTER SECTION: Segmented View Switcher */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(0, 0, 0, 0.25)',
          padding: '0.25rem',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          gap: '0.2rem'
        }}>
          {isPremiumTemplate && (
            <button
              onClick={() => { setViewMode('dashboard'); setIsManualEdit(false); }}
              style={getSegmentStyles(viewMode === 'dashboard')}
              onMouseEnter={e => { if (viewMode !== 'dashboard') e.currentTarget.style.color = 'var(--text-main)'; }}
              onMouseLeave={e => { if (viewMode !== 'dashboard') e.currentTarget.style.color = 'var(--text-muted)'; }}
            >
              <LayoutDashboard size={14} style={{ color: viewMode === 'dashboard' ? '#3b82f6' : 'currentColor' }} />
              Dashboard
            </button>
          )}

          <button
            onClick={() => { setViewMode('canvas'); setIsManualEdit(false); }}
            style={getSegmentStyles(viewMode === 'canvas' && !isManualEdit)}
            onMouseEnter={e => { if (!(viewMode === 'canvas' && !isManualEdit)) e.currentTarget.style.color = 'var(--text-main)'; }}
            onMouseLeave={e => { if (!(viewMode === 'canvas' && !isManualEdit)) e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            <LayoutTemplate size={14} style={{ color: (viewMode === 'canvas' && !isManualEdit) ? '#3b82f6' : 'currentColor' }} />
            Canvas
          </button>

          <div style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.1)', margin: '0 0.2rem' }} />

          <button
            onClick={() => setShowAiPanel(!showAiPanel)}
            style={getSegmentStyles(showAiPanel)}
            onMouseEnter={e => { if (!showAiPanel) e.currentTarget.style.color = 'var(--text-main)'; }}
            onMouseLeave={e => { if (!showAiPanel) e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            <Sparkles size={14} style={{ color: showAiPanel ? '#a855f7' : 'currentColor' }} />
            Copilot
          </button>

          <button
            onClick={() => { setViewMode('canvas'); setIsManualEdit(true); }}
            style={getSegmentStyles(isManualEdit)}
            onMouseEnter={e => { if (!isManualEdit) e.currentTarget.style.color = 'var(--text-main)'; }}
            onMouseLeave={e => { if (!isManualEdit) e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            <PenTool size={14} style={{ color: isManualEdit ? '#3b82f6' : 'currentColor' }} />
            Editor
          </button>

          <button
            onClick={() => setShowPropertiesPanel(!showPropertiesPanel)}
            style={getSegmentStyles(showPropertiesPanel)}
            onMouseEnter={e => { if (!showPropertiesPanel) e.currentTarget.style.color = 'var(--text-main)'; }}
            onMouseLeave={e => { if (!showPropertiesPanel) e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            <Settings size={14} style={{ color: showPropertiesPanel ? '#3b82f6' : 'currentColor' }} />
            Props
          </button>
        </div>

        {/* RIGHT SECTION: Quick Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, justifyContent: 'flex-end' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0, 0, 0, 0.2)', borderRadius: '8px', padding: '0.15rem' }}>
            <button 
              style={getIconButtonStyles()} 
              title="Undo"
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <Undo size={14} />
            </button>
            <button 
              style={getIconButtonStyles()} 
              title="Redo"
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <Redo size={14} />
            </button>
            <button 
              onClick={onSave} 
              style={getIconButtonStyles()} 
              title="Save"
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <Save size={14} />
            </button>
          </div>

          <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.1)', margin: '0 0.25rem' }} />

          <button 
            style={{ ...getIconButtonStyles(), background: 'rgba(255,255,255,0.05)' }}
            title="Command Palette (Ctrl+K)"
            onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >
            <Command size={14} />
          </button>

          <button 
            style={getIconButtonStyles()}
            title="Share"
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <Share2 size={14} />
          </button>

          {/* AI Command Center */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowAiDropdown(!showAiDropdown)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.4rem', 
                padding: '0.4rem 0.75rem', 
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(124, 58, 237, 0.2))', 
                border: '1px solid rgba(168, 85, 247, 0.3)', 
                borderRadius: '8px', 
                color: '#d8b4fe', 
                fontSize: '0.75rem', 
                fontWeight: 700, 
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 0 10px rgba(168, 85, 247, 0.1)'
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 15px rgba(168, 85, 247, 0.3)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 10px rgba(168, 85, 247, 0.1)'}
            >
              <Sparkles size={14} /> AI Actions <ChevronDown size={14} />
            </button>
            {showAiDropdown && (
              <div 
                className="animate-fade-in"
                style={{ 
                  position: 'absolute', 
                  top: '100%', 
                  right: 0, 
                  marginTop: '0.5rem', 
                  width: '240px', 
                  background: 'rgba(15, 23, 42, 0.95)', 
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.1)', 
                  borderRadius: '12px', 
                  padding: '0.5rem', 
                  boxShadow: '0 10px 40px rgba(0,0,0,0.5)', 
                  zIndex: 100 
                }}
              >
                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '0.4rem 0.5rem', letterSpacing: '0.05em' }}>Smart Commands</div>
                {[
                  { icon: '📝', label: 'Generate Section' },
                  { icon: '✨', label: 'Improve Writing' },
                  { icon: '📊', label: 'Generate FRD' },
                  { icon: '🧪', label: 'Generate Test Cases' },
                  { icon: '🧠', label: 'AI Summary' },
                  { icon: '🔄', label: 'Workflow Suggestions' },
                ].map((item, idx) => (
                  <button 
                    key={idx}
                    onClick={() => { alert('Feature coming soon!'); setShowAiDropdown(false); }} 
                    style={{ 
                      width: '100%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem', 
                      padding: '0.5rem', 
                      background: 'transparent', 
                      border: 'none', 
                      color: 'var(--text-main)', 
                      fontSize: '0.8rem', 
                      fontWeight: 500,
                      cursor: 'pointer', 
                      borderRadius: '8px', 
                      textAlign: 'left',
                      transition: 'background 0.2s ease'
                    }} 
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} 
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <span style={{ fontSize: '0.9rem' }}>{item.icon}</span> {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, border: '1px solid rgba(255,255,255,0.2)', marginLeft: '0.25rem', cursor: 'pointer' }}>
            SA
          </div>
        </div>

      </div>
    </>
  );
}
