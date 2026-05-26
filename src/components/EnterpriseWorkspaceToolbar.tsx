import React, { useState } from 'react';
import { 
  LayoutDashboard, LayoutTemplate, Sparkles, Settings, PenTool, 
  Save, Undo, Redo, Share2, Search, Bell, ChevronDown, Command, FileText, Menu
} from 'lucide-react';
import CommandPalette from './CommandPalette';
import { useBuilderStore } from '@/store/useBuilderStore';

interface EnterpriseWorkspaceToolbarProps {
  showAiPanel?: boolean;
  setShowAiPanel?: (show: boolean) => void;
  showPropertiesPanel?: boolean;
  setShowPropertiesPanel?: (show: boolean) => void;
  isManualEdit?: boolean;
  setIsManualEdit?: (edit: boolean) => void;
  docType?: string;
  documentTitle?: string;
  isTemplateBuilder?: boolean;
  currentPageId?: string | null;
  navigationStack?: { id: string; title: string }[];
  onNavigateBack?: () => void;
  saveStatus?: string;
  onSave?: () => void;
  /** 'top' = borderBottom (default when used inside document editor); 'bottom' = borderTop (when used as BuilderWorkspace status bar) */
  position?: 'top' | 'bottom';
}

export default function EnterpriseWorkspaceToolbar({
  showAiPanel,
  setShowAiPanel,
  showPropertiesPanel,
  setShowPropertiesPanel,
  isManualEdit = false,
  setIsManualEdit = () => {},
  docType = 'custom',
  documentTitle = 'Untitled Document',
  isTemplateBuilder,
  currentPageId,
  navigationStack,
  onNavigateBack,
  saveStatus,
  onSave,
  position = 'top'
}: EnterpriseWorkspaceToolbarProps) {
  
  const { activeView, setActiveView } = useBuilderStore();
  const [showAiDropdown, setShowAiDropdown] = useState(false);

  const isPremiumTemplate = ['brd', 'frd', 'srs', 'tdd', 'sprint'].includes(docType) ||
    ['brd', 'frd', 'srs', 'tdd', 'sprint', 'business requirement', 'feature requirement', 'software requirement', 'technical design'].some(
      keyword => documentTitle.toLowerCase().includes(keyword)
    );

  const getSegmentStyles = (isActive: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    padding: '0.25rem 0.6rem',
    fontSize: '0.75rem',
    fontWeight: isActive ? 700 : 600,
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    background: isActive ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : 'transparent',
    color: isActive ? '#ffffff' : '#cbd5e1',
    boxShadow: isActive ? '0 4px 15px -3px rgba(37, 99, 235, 0.5), inset 0 1px 0 rgba(255,255,255,0.2)' : 'none',
    transform: isActive ? 'translateY(-1px)' : 'translateY(0)',
    transition: 'all 0.2s ease',
  });

  const getIconButtonStyles = () => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '26px',
    height: '26px',
    borderRadius: '6px',
    border: 'none',
    background: 'transparent',
    color: '#cbd5e1',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  });

  return (
    <>
      {/* Full-width Toolbar Container */}
      <div style={{
        width: '100%',
        height: '48px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 1.5rem',
        background: 'var(--surface)',
        borderTop: position === 'bottom' ? '1px solid var(--border)' : 'none',
        borderBottom: position === 'top' ? '1px solid var(--border)' : 'none',
        flexShrink: 0,
        zIndex: 10
      }}>

        {/* LEFT SECTION: Document Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={16} style={{ color: 'var(--primary)' }} />
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>{documentTitle}</span>
          </div>
          <div style={{ padding: '0.15rem 0.5rem', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {docType}
          </div>
        </div>

        {/* CENTER SECTION: Segmented View Switcher */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(0, 0, 0, 0.25)',
          padding: '0.15rem',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          gap: '0.15rem'
        }}>


          <button
            title="Canvas View"
            onClick={() => setActiveView('canvas')}
            style={getSegmentStyles(activeView === 'canvas')}
            onMouseEnter={e => { if (activeView !== 'canvas') { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; } }}
            onMouseLeave={e => { if (activeView !== 'canvas') { e.currentTarget.style.color = '#cbd5e1'; e.currentTarget.style.background = 'transparent'; } }}
          >
            <LayoutTemplate size={14} style={{ color: activeView === 'canvas' ? '#ffffff' : 'currentColor' }} />
            Canvas
          </button>

          <button
            title="Template Dashboard"
            onClick={() => setActiveView('template')}
            style={getSegmentStyles(activeView === 'template')}
            onMouseEnter={e => { if (activeView !== 'template') { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; } }}
            onMouseLeave={e => { if (activeView !== 'template') { e.currentTarget.style.color = '#cbd5e1'; e.currentTarget.style.background = 'transparent'; } }}
          >
            <FileText size={14} style={{ color: activeView === 'template' ? '#ffffff' : 'currentColor' }} />
            Template Dashboard
          </button>

          <button
            title="Properties"
            onClick={() => setActiveView('properties')}
            style={getSegmentStyles(activeView === 'properties')}
            onMouseEnter={e => { if (activeView !== 'properties') { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; } }}
            onMouseLeave={e => { if (activeView !== 'properties') { e.currentTarget.style.color = '#cbd5e1'; e.currentTarget.style.background = 'transparent'; } }}
          >
            <Settings size={14} style={{ color: activeView === 'properties' ? '#ffffff' : 'currentColor' }} />
            Properties
          </button>
          
          {activeView === 'canvas' && setShowAiPanel && (
            <>
              <div style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.1)', margin: '0 0.2rem' }} />
              <button
                title="Toggle Navigation"
                onClick={() => setShowAiPanel(!showAiPanel)}
                style={getSegmentStyles(!!showAiPanel)}
                onMouseEnter={e => { if (!showAiPanel) { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; } }}
                onMouseLeave={e => { if (!showAiPanel) { e.currentTarget.style.color = '#cbd5e1'; e.currentTarget.style.background = 'transparent'; } }}
              >
                <Menu size={14} style={{ color: showAiPanel ? '#ffffff' : 'currentColor' }} />
                Navigation
              </button>
            </>
          )}
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
                gap: '0.35rem', 
                padding: '0.25rem 0.6rem', 
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(124, 58, 237, 0.2))', 
                border: '1px solid rgba(168, 85, 247, 0.3)', 
                borderRadius: '6px', 
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
                      padding: '0.4rem', 
                      background: 'transparent', 
                      border: 'none', 
                      color: 'var(--text-main)', 
                      fontSize: '0.8rem', 
                      fontWeight: 500,
                      cursor: 'pointer', 
                      borderRadius: '6px', 
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
          
          <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, border: '1px solid rgba(255,255,255,0.2)', marginLeft: '0.25rem', cursor: 'pointer' }}>
            SA
          </div>
        </div>

      </div>
    </>
  );
}
