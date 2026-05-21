"use client";

import React, { useState } from 'react';
import { LayoutDashboard, LayoutTemplate, Sparkles, FileText, Settings, PenTool } from 'lucide-react';

interface GlobalEnterpriseToolbarProps {
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
  onSaveTemplateClick?: () => void;
}

export default function GlobalEnterpriseToolbar({
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
  onSaveTemplateClick
}: GlobalEnterpriseToolbarProps) {

  // Check if dashboard view should be shown
  const isPremiumTemplate = ['brd', 'frd', 'srs', 'tdd', 'sprint'].includes(docType) ||
    ['brd', 'frd', 'srs', 'tdd', 'sprint', 'business requirement', 'feature requirement', 'software requirement', 'technical design'].some(
      keyword => documentTitle.toLowerCase().includes(keyword)
    );

  // Active state logic mapping
  // Since we have multiple panels that can be active simultaneously (like canvas + AI),
  // we will map them into distinct interactive toggles within the segmented control.
  // However, viewMode (Dashboard vs Canvas/Editor) is mutually exclusive.
  
  const getButtonStyles = (isActive: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.4rem 1rem',
    fontSize: '0.8rem',
    fontWeight: 600,
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    background: isActive ? 'linear-gradient(180deg, #2563eb, #1d4ed8)' : 'transparent',
    color: isActive ? '#ffffff' : '#94a3b8',
    boxShadow: isActive ? '0 4px 15px -3px rgba(37, 99, 235, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)' : 'none',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: isActive ? 'translateY(0)' : 'translateY(0)',
  });

  return (
    <div style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      padding: '0.75rem 1.5rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: '1rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(0, 0, 0, 0.2)',
        padding: '0.25rem',
        borderRadius: '10px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        gap: '0.25rem'
      }}>
        
        {/* 1. Dashboard View (Conditional) */}
        {isPremiumTemplate && (
          <button
            onClick={() => { setViewMode('dashboard'); setIsManualEdit(false); }}
            style={{
              ...getButtonStyles(viewMode === 'dashboard'),
            }}
            onMouseEnter={e => { if (viewMode !== 'dashboard') { e.currentTarget.style.color = '#e2e8f0'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
            onMouseLeave={e => { if (viewMode !== 'dashboard') { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; } }}
          >
            <LayoutDashboard size={16} style={{ color: viewMode === 'dashboard' ? '#93c5fd' : 'currentColor' }} />
            Dashboard View
          </button>
        )}

        {isPremiumTemplate && <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)', margin: '0 4px' }} />}

        {/* 2. Canvas View */}
        <button
          onClick={() => { setViewMode('canvas'); setIsManualEdit(false); }}
          style={{
            ...getButtonStyles(viewMode === 'canvas' && !isManualEdit),
          }}
          onMouseEnter={e => { if (!(viewMode === 'canvas' && !isManualEdit)) { e.currentTarget.style.color = '#e2e8f0'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
          onMouseLeave={e => { if (!(viewMode === 'canvas' && !isManualEdit)) { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; } }}
        >
          <LayoutTemplate size={16} style={{ color: (viewMode === 'canvas' && !isManualEdit) ? '#93c5fd' : 'currentColor' }} />
          Canvas View
        </button>

        <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)', margin: '0 4px' }} />

        {/* 3. AI Panel */}
        <button
          onClick={() => setShowAiPanel(!showAiPanel)}
          style={{
            ...getButtonStyles(showAiPanel),
          }}
          onMouseEnter={e => { if (!showAiPanel) { e.currentTarget.style.color = '#e2e8f0'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
          onMouseLeave={e => { if (!showAiPanel) { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; } }}
        >
          <Sparkles size={16} style={{ color: showAiPanel ? '#93c5fd' : 'currentColor' }} />
          AI Panel
        </button>

        <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)', margin: '0 4px' }} />

        {/* 4. Document Editor */}
        <button
          onClick={() => { setViewMode('canvas'); setIsManualEdit(true); }}
          style={{
            ...getButtonStyles(isManualEdit),
          }}
          onMouseEnter={e => { if (!isManualEdit) { e.currentTarget.style.color = '#e2e8f0'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
          onMouseLeave={e => { if (!isManualEdit) { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; } }}
        >
          <PenTool size={16} style={{ color: isManualEdit ? '#93c5fd' : 'currentColor' }} />
          Document Editor
        </button>

        <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)', margin: '0 4px' }} />

        {/* 5. Properties */}
        <button
          onClick={() => setShowPropertiesPanel(!showPropertiesPanel)}
          style={{
            ...getButtonStyles(showPropertiesPanel),
          }}
          onMouseEnter={e => { if (!showPropertiesPanel) { e.currentTarget.style.color = '#e2e8f0'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
          onMouseLeave={e => { if (!showPropertiesPanel) { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; } }}
        >
          <Settings size={16} style={{ color: showPropertiesPanel ? '#93c5fd' : 'currentColor' }} />
          Properties
        </button>
      </div>
    </div>
  );
}
