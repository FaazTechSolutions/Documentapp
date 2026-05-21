"use client";

import { Suspense, useEffect, useState } from 'react';
import { useProjectStore } from '@/store/useProjectStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { isAuthenticated, getActiveSession } from '@/lib/auth';
import { 
  Plus, 
  Projector, 
  Layers, 
  Users, 
  CheckSquare, 
  History, 
  Bot, 
  Settings, 
  FileText, 
  TrendingUp, 
  Sparkles, 
  UserPlus, 
  Search, 
  Sliders, 
  Check, 
  RefreshCw,
  ArrowRight,
  Clipboard,
  Trash2,
  Upload,
  Edit3
} from 'lucide-react';
import QuickDraftEditor from '@/components/QuickDraftEditor';
import CustomDocumentEditor from '@/components/CustomDocumentEditor';
import SavedDocumentsList from '@/components/SavedDocumentsList';
import TemplateSetup from '@/components/TemplateSetup/TemplateSetup';


import { getBrdTemplateBlocks, getFrdTemplateBlocks, getEnterpriseSrsTemplateBlocks, getTddTemplateBlocks, getTestPlanTemplateBlocks, getTestCasesTemplateBlocks, getBugLogTemplateBlocks, getUatTemplateBlocks, getDevopsDeployTemplateBlocks, getDevopsServerTemplateBlocks, getDevopsBackupTemplateBlocks, getDevopsPipelineTemplateBlocks, getDevopsEnvTemplateBlocks, getDevopsMonitorTemplateBlocks, getSupportUserManualBlocks, getSupportAdminManualBlocks, getSupportTrainingBlocks, getSupportFaqBlocks, getSupportTroubleshootBlocks, getSupportReleaseNotesBlocks } from '@/lib/templateInitializers';

const useTemplate = (title: string, templateIdOrType: string, isBuilder?: boolean) => {
    const id = Math.random().toString(36).substring(2, 11);
    
    // Always try to fetch the blocks from the global useTemplateStore first
    // This guarantees template inheritance (e.g. if an Admin updated the BRD template, new documents inherit it)
    let initialBlocks = [];
    try {
      const editableTemplates = JSON.parse(localStorage.getItem('docforge_editable_templates') || '[]');
      const targetTemplate = editableTemplates.find((t: any) => t.id === templateIdOrType);
      if (targetTemplate && targetTemplate.blocks && targetTemplate.blocks.length > 0) {
        // Deep clone to prevent reference mutations
        initialBlocks = JSON.parse(JSON.stringify(targetTemplate.blocks));
      }
    } catch (e) {}

    if (initialBlocks.length === 0) {
      try {
        const savedBlocks = localStorage.getItem(`doc_root_${templateIdOrType}`);
        if (savedBlocks) {
          initialBlocks = JSON.parse(savedBlocks);
        } else {
          if (templateIdOrType === 'template-srs' || templateIdOrType === 'srs') initialBlocks = getEnterpriseSrsTemplateBlocks(title);
          else if (templateIdOrType === 'template-tdd' || templateIdOrType === 'tdd') initialBlocks = getTddTemplateBlocks(title);
          else if (templateIdOrType === 'template-brd' || templateIdOrType === 'brd') initialBlocks = getBrdTemplateBlocks(title);
          else if (templateIdOrType === 'template-frd' || templateIdOrType === 'frd') initialBlocks = getFrdTemplateBlocks(title);
          else {
            initialBlocks = [
              { id: '1', type: 'header', headingLevel: '1', value: title },
              { id: '2', type: 'textarea', value: 'Start writing your custom document here...' }
            ];
          }
        }
      } catch(e) {}
    }

    localStorage.setItem(`doc_root_${id}`, JSON.stringify(initialBlocks));
    // Save metadata
    const metaList = JSON.parse(localStorage.getItem('docforge_docs_meta') || '[]');
    metaList.unshift({
      id,
      title: `${title}`,
      lastSaved: new Date().toLocaleString(),
      type: templateIdOrType === 'blank' ? 'custom' : templateIdOrType.replace('template-', ''),
      projectId: searchParams.get('projectId') || undefined,
      isTemplate: !!isBuilder,
      isTemplateBuilder: !!isBuilder
    });
    localStorage.setItem('docforge_docs_meta', JSON.stringify(metaList));

    router.push(`/?tab=builder&id=${id}`);
  };

  // Call Mawarid AI Agent API Proxy
  const handleCallAI = async () => {
    if (!aiInput.trim()) return;
    setAiLoading(true);
    setAiOutput('');

    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: aiInput,
          options: {
            temperature: aiTemperature,
            maxOutputTokens: aiMaxTokens,
          }
        }),
      });

      const resJson = await response.json();
      if (resJson.success && resJson.data?.data?.output) {
        setAiOutput(resJson.data.data.output);
      } else if (resJson.success && resJson.data?.data?.text) {
        setAiOutput(resJson.data.data.text);
      } else {
        setAiOutput(`Failed to fetch response: ${resJson.message || 'Unknown server error.'}`);
      }
    } catch (err: any) {
      setAiOutput(`Network error during agent execution: ${err.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSendToCanvas = () => {
    if (!aiOutput) return;
    const id = Math.random().toString(36).substring(2, 11);
    const blocks = [
      { id: '1', type: 'header', headingLevel: '1', value: 'AI Agent Generated Draft' },
      { id: '2', type: 'textarea', value: aiOutput }
    ];
    localStorage.setItem(`doc_root_${id}`, JSON.stringify(blocks));
    
    const metaList = JSON.parse(localStorage.getItem('docforge_docs_meta') || '[]');
    metaList.unshift({
      id,
      title: 'AI Draft Generation',
      lastSaved: new Date().toLocaleString(),
      type: 'custom'
    });
    localStorage.setItem('docforge_docs_meta', JSON.stringify(metaList));
    router.push(`/?tab=builder&id=${id}`);
  };

  const handleResetDatabase = () => {
    if (confirm("Are you sure you want to restore pristine demo files and clear saved cache?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // Active User Info
  const activeUser = getActiveSession();

  switch (tab) {
    case 'builder':
      return <CustomDocumentEditor />;
      
    case 'template-setup':
      return <TemplateSetup />;

    case 'documents':
    case 'saved':
      return <SavedDocumentsList useTemplate={useTemplate} />;

    case 'projects':
      return (
        <div className="enterprise-workspace animate-fade-in">
          <div className="enterprise-header">
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>📁 Projects</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Centralized projects managing multi-branch document scopes.</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', position: 'relative' }}>
                <input 
                  type="text" 
                  placeholder="Project name..." 
                  className={`form-input ${folderError ? 'error' : ''}`} 
                  style={{ 
                    width: '220px', 
                    padding: '0.5rem', 
                    borderColor: folderError ? '#ef4444' : 'var(--border)',
                    boxShadow: folderError ? '0 0 0 2px rgba(239, 68, 68, 0.15)' : 'none',
                    transition: 'all 0.2s'
                  }} 
                  value={newProjectName}
                  onChange={e => {
                    setNewProjectName(e.target.value);
                    if (e.target.value.trim()) setfolderError('');
                  }}
                />
                {folderError && (
                  <span style={{ 
                    color: '#ef4444', 
                    fontSize: '0.75rem', 
                    fontWeight: 600, 
                    position: 'absolute', 
                    top: '100%', 
                    left: '2px', 
                    marginTop: '0.15rem' 
                  }}>
                    ⚠️ {folderError}
                  </span>
                )}
              </div>
              <button 
                onClick={() => {
                  if (!newProjectName.trim()) {
                    setfolderError('Project name is required.');
                    return;
                  }
                  setfolderError('');
                  saveProjects([...projects, {
                    id: Math.random().toString(36).substring(2, 9),
                    name: newProjectName.trim(),
                    status: 'draft',
                    color: '#6366f1',
                    category: 'Development'
                  }]);
                  setNewProjectName('');
                }}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', height: '38px' }}
              >
                <Plus size={16} /> New Project
              </button>
            </div>
          </div>

          <div className="projects-grid">
            {projects.map(proj => (
              <div 
                key={proj.id} 
                className="project-card"
                onClick={() => router.push(`/?tab=documents&projectId=${proj.id}`)}
                style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
              >
                <div className="project-card-header">
                  <span className="project-folder-icon" style={{ color: proj.color }}>📂</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span className={`project-badge ${proj.status}`}>{proj.status}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditProject(proj);
                      }} 
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem', borderRadius: '4px', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}
                      onMouseEnter={evt => evt.currentTarget.style.color = 'var(--primary)'}
                      onMouseLeave={evt => evt.currentTarget.style.color = 'var(--text-muted)'}
                      title="Rename Project"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProject(proj.id, proj.name);
                      }} 
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem', borderRadius: '4px', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}
                      onMouseEnter={evt => evt.currentTarget.style.color = '#ef4444'}
                      onMouseLeave={evt => evt.currentTarget.style.color = 'var(--text-muted)'}
                      title="Delete Project"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0.25rem 0' }}>{proj.name}</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                  Category: {proj.category}
                </span>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>📄 {getDocCountForProject(proj.id)} Documents</span>
                  <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--primary)' }}>Open ➔</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'templates': {
      let customTemplates: any[] = [];
      try {
        if (typeof window !== 'undefined') {
          const meta = JSON.parse(localStorage.getItem('docforge_docs_meta') || '[]');
          customTemplates = meta.filter((m: any) => m.isTemplate);
        }
      } catch(e) {}
      
      const pmTypes = ['sprint', 'backlog', 'taskbreak', 'estimation', 'risk', 'cr', 'release', 'status'];
      const qaTypes = ['testplan', 'testcases', 'buglog', 'uat'];
      const devopsTypes = ['devops-deploy', 'devops-server', 'devops-backup', 'devops-pipeline', 'devops-env', 'devops-monitor'];
      const supportTypes = ['support-usermanual', 'support-adminmanual', 'support-training', 'support-faq', 'support-troubleshoot', 'support-releasenotes'];
      const specTemplates = customTemplates.filter((t: any) => !pmTypes.includes(t.type) && !qaTypes.includes(t.type) && !devopsTypes.includes(t.type) && !supportTypes.includes(t.type));
      const pmTemplates = customTemplates.filter((t: any) => pmTypes.includes(t.type));
      const qaTemplates = customTemplates.filter((t: any) => qaTypes.includes(t.type));
      const devopsTemplates = customTemplates.filter((t: any) => devopsTypes.includes(t.type));
      const supportTemplates = customTemplates.filter((t: any) => supportTypes.includes(t.type));

      if (activeTemplateModule === 'pm') {
        return (
          <div className="enterprise-workspace animate-fade-in">
            <div className="enterprise-header" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
              <button 
                onClick={() => setActiveTemplateModule('all')}
                className="btn btn-secondary"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  padding: '0.5rem 1rem', 
                  fontWeight: 600,
                  borderRadius: '10px',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(-3px)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                ← Back to Templates
              </button>
              <div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>Development & Project Management Documents</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Configure agile sprints, backlogs, estimation boards, release plans, and status timelines.</p>
              </div>
            </div>

            <div className="templates-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
              {pmTemplates.map((t: any) => (
                <div key={t.id} className="template-card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', transition: 'all 0.2s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="template-badge" style={{ background: 'rgba(16, 185, 129, 0.08)', color: 'var(--primary)', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      {t.type.toUpperCase()} Template
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginTop: '0.85rem', color: 'var(--text-main)' }}>{t.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.5rem 0 1.5rem 0', lineHeight: '1.5', flex: 1 }}>
                    {t.desc || 'Custom template outline.'}
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => router.push(`/?tab=builder&id=${t.id}`)}
                      className="btn btn-secondary" 
                      style={{ flex: 1, padding: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', fontWeight: 600 }}
                    >
                      ✏️ Edit Template
                    </button>
                    <button 
                      onClick={() => useTemplate(t.title, t.id)} 
                      className="btn btn-primary" 
                      style={{ flex: 1, padding: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', fontWeight: 600 }}
                    >
                      <Plus size={16} /> Use
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }

      if (activeTemplateModule === 'qa') {
        return (
          <div className="enterprise-workspace animate-fade-in">
            <div className="enterprise-header" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
              <button 
                onClick={() => setActiveTemplateModule('all')}
                className="btn btn-secondary"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  padding: '0.5rem 1rem', 
                  fontWeight: 600,
                  borderRadius: '10px',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(-3px)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                ← Back to Templates
              </button>
              <div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>Testing & QA Documents</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Manage testing plans, QA strategies, functional test case specifications, bug logs, and UAT checklists.</p>
              </div>
            </div>

            <div className="templates-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
              {qaTemplates.map((t: any) => (
                <div key={t.id} className="template-card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', transition: 'all 0.2s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="template-badge" style={{ background: 'rgba(16, 185, 129, 0.08)', color: 'var(--primary)', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      {t.type.toUpperCase()} Template
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginTop: '0.85rem', color: 'var(--text-main)' }}>{t.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.5rem 0 1.5rem 0', lineHeight: '1.5', flex: 1 }}>
                    {t.desc || 'Custom template outline.'}
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => router.push(`/?tab=builder&id=${t.id}`)}
                      className="btn btn-secondary" 
                      style={{ flex: 1, padding: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', fontWeight: 600 }}
                    >
                      ✏️ Edit Template
                    </button>
                    <button 
                      onClick={() => useTemplate(t.title, t.id)} 
                      className="btn btn-primary" 
                      style={{ flex: 1, padding: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', fontWeight: 600 }}
                    >
                      <Plus size={16} /> Use
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }

      if (activeTemplateModule === 'devops') {
        return (
          <div className="enterprise-workspace animate-fade-in" style={{ background: '#0F172A', color: '#E2E8F0', padding: '1.5rem', borderRadius: '16px', border: '1px solid #1E293B', fontFamily: 'system-ui, sans-serif' }}>
            {/* Header */}
            <div className="enterprise-header" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start', borderBottom: '1px solid #1E293B', paddingBottom: '1.25rem' }}>
              <button 
                onClick={() => setActiveTemplateModule('all')}
                className="btn btn-secondary"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  padding: '0.5rem 1rem', 
                  fontWeight: 600,
                  borderRadius: '10px',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.2s',
                  background: '#1E293B',
                  color: '#F8FAFC',
                  border: '1px solid #334155'
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(-3px)'; e.currentTarget.style.borderColor = '#3B82F6'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = '#334155'; }}
              >
                ← Back to Templates
              </button>
              <div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#F8FAFC' }}>🛠 DevOps Command Center</h1>
                <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginTop: '0.25rem' }}>Manage live environment clusters, active pipelines, telemetry analytics, and operational compliance templates.</p>
              </div>
            </div>

            {/* 3-Column Workspace Layout */}
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem', alignItems: 'flex-start' }}>
              
              {/* Left Column: Resource Cluster & Pipeline Navigation */}
              <div style={{ width: '250px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem', background: '#1E293B', padding: '1.25rem', borderRadius: '12px', border: '1px solid #334155' }}>
                <div>
                  <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Resource Cluster</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div 
                      onClick={() => setSelectedResource('app')}
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.75rem', borderRadius: '8px', cursor: 'pointer', background: selectedResource === 'app' ? '#2563EB' : '#0F172A', border: '1px solid #334155', transition: 'all 0.2s' }}
                    >
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#F8FAFC' }}>💻 App Servers</span>
                      <span style={{ fontSize: '0.75rem', color: '#4ADE80', fontWeight: 'bold' }}>🟢 Active</span>
                    </div>
                    <div 
                      onClick={() => setSelectedResource('db')}
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.75rem', borderRadius: '8px', cursor: 'pointer', background: selectedResource === 'db' ? '#2563EB' : '#0F172A', border: '1px solid #334155', transition: 'all 0.2s' }}
                    >
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#F8FAFC' }}>🗄 Databases</span>
                      <span style={{ fontSize: '0.75rem', color: '#4ADE80', fontWeight: 'bold' }}>🟢 Active</span>
                    </div>
                    <div 
                      onClick={() => setSelectedResource('lb')}
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.75rem', borderRadius: '8px', cursor: 'pointer', background: selectedResource === 'lb' ? '#2563EB' : '#0F172A', border: '1px solid #334155', transition: 'all 0.2s' }}
                    >
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#F8FAFC' }}>⚖ Load Balancers</span>
                      <span style={{ fontSize: '0.75rem', color: '#F59E0B', fontWeight: 'bold' }}>🟡 Warning</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Active Pipelines</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'start', gap: '0.5rem', fontSize: '0.8rem', color: '#CBD5E1' }}>
                      <span style={{ color: '#4ADE80' }}>✔</span> <span>Build / Compile</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'start', gap: '0.5rem', fontSize: '0.8rem', color: '#CBD5E1' }}>
                      <span style={{ color: '#4ADE80' }}>✔</span> <span>Unit Testing (92%)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'start', gap: '0.5rem', fontSize: '0.8rem', color: '#CBD5E1' }}>
                      <span style={{ color: '#4ADE80' }}>✔</span> <span>Docker Registry Sync</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'start', gap: '0.5rem', fontSize: '0.8rem', color: '#CBD5E1' }}>
                      <span style={{ display: 'inline-block', width: '8px', height: '8px', background: '#3B82F6', borderRadius: '50%' }}></span> 
                      <span style={{ color: '#3B82F6', fontWeight: 600 }}>Production Rollout</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Center Column: Live Observability & Templates Grid */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Telemetry Gauge Display (Dynamic) */}
                <div style={{ background: '#1E293B', padding: '1.25rem', borderRadius: '12px', border: '1px solid #334155' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    📊 Observability Telemetry - {selectedResource === 'app' ? 'App Servers' : selectedResource === 'db' ? 'Database Nodes' : 'Load Balancers'}
                  </h3>
                  
                  {selectedResource === 'app' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: '1rem' }}>
                      <div style={{ background: '#0F172A', padding: '1rem', borderRadius: '8px', border: '1px solid #334155' }}>
                        <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>CPU Usage</span>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F8FAFC', margin: '0.25rem 0' }}>
                          {Math.floor(45 + Math.sin(telemetryTicks) * 10)}%
                        </div>
                        <div style={{ height: '4px', background: '#334155', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ width: `${Math.floor(45 + Math.sin(telemetryTicks) * 10)}%`, height: '100%', background: '#3B82F6', transition: 'width 0.5s ease' }}></div>
                        </div>
                      </div>
                      <div style={{ background: '#0F172A', padding: '1rem', borderRadius: '8px', border: '1px solid #334155' }}>
                        <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>RAM Utilization</span>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F8FAFC', margin: '0.25rem 0' }}>
                          {Math.floor(72 + Math.cos(telemetryTicks) * 2)}%
                        </div>
                        <div style={{ height: '4px', background: '#334155', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ width: `${Math.floor(72 + Math.cos(telemetryTicks) * 2)}%`, height: '100%', background: '#10B981', transition: 'width 0.5s ease' }}></div>
                        </div>
                      </div>
                      <div style={{ background: '#0F172A', padding: '1rem', borderRadius: '8px', border: '1px solid #334155' }}>
                        <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Active Cluster Sessions</span>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F8FAFC', margin: '0.25rem 0' }}>
                          {1240 + (telemetryTicks % 10) * 12}
                        </div>
                        <span style={{ fontSize: '0.7rem', color: '#10B981' }}>🟢 SLA Compliant</span>
                      </div>
                    </div>
                  )}

                  {selectedResource === 'db' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: '1rem' }}>
                      <div style={{ background: '#0F172A', padding: '1rem', borderRadius: '8px', border: '1px solid #334155' }}>
                        <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Replica Lag</span>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10B981', margin: '0.25rem 0' }}>0.08 ms</div>
                        <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Synchronous Mirroring</span>
                      </div>
                      <div style={{ background: '#0F172A', padding: '1rem', borderRadius: '8px', border: '1px solid #334155' }}>
                        <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Disk Read/Write IOPS</span>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F8FAFC', margin: '0.25rem 0' }}>
                          {820 + (telemetryTicks % 5) * 45}
                        </div>
                        <span style={{ fontSize: '0.7rem', color: '#10B981' }}>🟢 Safe Range</span>
                      </div>
                      <div style={{ background: '#0F172A', padding: '1rem', borderRadius: '8px', border: '1px solid #334155' }}>
                        <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Pool Connections</span>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F8FAFC', margin: '0.25rem 0' }}>
                          {142 + (telemetryTicks % 3) * 4} / 500
                        </div>
                        <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Usage: 28% max cap</span>
                      </div>
                    </div>
                  )}

                  {selectedResource === 'lb' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: '1rem' }}>
                      <div style={{ background: '#0F172A', padding: '1rem', borderRadius: '8px', border: '1px solid #334155' }}>
                        <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Response Latency</span>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F59E0B', margin: '0.25rem 0' }}>
                          {(1.12 + Math.sin(telemetryTicks) * 0.05).toFixed(2)}s
                        </div>
                        <span style={{ fontSize: '0.7rem', color: '#F59E0B' }}>🟡 SLA Threshold Alert</span>
                      </div>
                      <div style={{ background: '#0F172A', padding: '1rem', borderRadius: '8px', border: '1px solid #334155' }}>
                        <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Requests/sec</span>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F8FAFC', margin: '0.25rem 0' }}>
                          {450 + Math.floor(Math.sin(telemetryTicks) * 60)}
                        </div>
                        <span style={{ fontSize: '0.7rem', color: '#10B981' }}>🟢 Balancing Load</span>
                      </div>
                      <div style={{ background: '#0F172A', padding: '1rem', borderRadius: '8px', border: '1px solid #334155' }}>
                        <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Active Nodes Status</span>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#EF4444', margin: '0.25rem 0' }}>3 / 4</div>
                        <span style={{ fontSize: '0.7rem', color: '#EF4444' }}>🔴 Node PROD-APP-03 is slow</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Live Environment Status Row */}
                <div style={{ background: '#1E293B', padding: '1.25rem', borderRadius: '12px', border: '1px solid #334155' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '0.75rem' }}>🌍 Live Cluster Deployments</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                    <div style={{ background: '#0F172A', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #10B981', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>Development</div>
                        <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>dev.unitracon.com</div>
                      </div>
                      <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', fontWeight: 700 }}>HEALTHY</span>
                    </div>
                    <div style={{ background: '#0F172A', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #10B981', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>Staging</div>
                        <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>stage.unitracon.com</div>
                      </div>
                      <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', fontWeight: 700 }}>HEALTHY</span>
                    </div>
                    <div style={{ background: '#0F172A', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #F59E0B', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>Production</div>
                        <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>app.unitracon.com</div>
                      </div>
                      <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem', borderRadius: '4px', background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', fontWeight: 700 }}>DRIFT ALERT</span>
                    </div>
                  </div>
                </div>

                {/* Templates Grid */}
                <div>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '1rem' }}>📋 DevOps Base Blueprints & Outline Templates</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
                    {devopsTemplates.map((t: any) => (
                      <div key={t.id} className="template-card" style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 15px rgba(0,0,0,0.15)', transition: 'all 0.2s' }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#3B82F6', background: 'rgba(59, 130, 246, 0.15)', padding: '0.2rem 0.4rem', borderRadius: '4px', width: 'fit-content', textTransform: 'uppercase' }}>
                          {t.type.replace('devops-', '')}
                        </span>
                        <h4 style={{ fontSize: '1rem', fontWeight: 800, marginTop: '0.5rem', color: '#F8FAFC' }}>{t.title}</h4>
                        <p style={{ fontSize: '0.775rem', color: '#94A3B8', margin: '0.5rem 0 1.25rem 0', lineHeight: '1.4', flex: 1 }}>
                          {t.desc || 'Operational specifications outline.'}
                        </p>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button 
                            onClick={() => router.push(`/?tab=builder&id=${t.id}`)}
                            className="btn btn-secondary" 
                            style={{ flex: 1, padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', fontSize: '0.75rem', background: '#334155', border: '1px solid #475569', color: '#E2E8F0', fontWeight: 600 }}
                          >
                            ✏️ Edit
                          </button>
                          <button 
                            onClick={() => useTemplate(t.title, t.id)} 
                            className="btn btn-primary" 
                            style={{ flex: 1, padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', fontSize: '0.75rem', background: '#2563EB', borderColor: '#2563EB', color: '#FFFFFF', fontWeight: 600 }}
                          >
                            <Plus size={14} /> Use
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column: Live Stream Logs & AI Recommendations */}
              <div style={{ width: '280px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Live Logs Console */}
                <div style={{ background: '#1E293B', padding: '1.25rem', borderRadius: '12px', border: '1px solid #334155' }}>
                  <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    📟 Observability Log Stream
                  </h3>
                  <div style={{ background: '#020617', padding: '0.75rem', borderRadius: '8px', border: '1px solid #334155', fontFamily: 'Courier New, monospace', fontSize: '0.7rem', color: '#4ADE80', height: '220px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {logs.map((log, idx) => (
                      <div key={idx} style={{ lineBreak: 'anywhere', whiteSpace: 'pre-wrap', color: log.includes('[WARN]') ? '#F59E0B' : log.includes('[SUCCESS]') ? '#4ADE80' : '#3B82F6' }}>
                        {log}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active Alerts */}
                <div style={{ background: '#1E293B', padding: '1.25rem', borderRadius: '12px', border: '1px solid #334155' }}>
                  <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '0.75rem' }}>🚨 Incident Tickets</h3>
                  <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #EF4444', borderRadius: '8px', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', cursor: 'pointer' }} onClick={() => setSelectedResource('lb')}>
                    <span style={{ fontSize: '0.75rem', color: '#EF4444', fontWeight: 800 }}>ALERT ALT-402</span>
                    <span style={{ fontSize: '0.8rem', color: '#F8FAFC', fontWeight: 600 }}>High CPU / Latency Spike</span>
                    <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Load balancer alert: Node PROD-APP-03 is unresponsive. Click to trace.</span>
                  </div>
                </div>

                {/* AI Suggestions */}
                <div style={{ background: '#1E293B', padding: '1.25rem', borderRadius: '12px', border: '1px solid #334155' }}>
                  <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    💡 Operations Copilot AI
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.75rem', color: '#CBD5E1' }}>
                    <div style={{ background: '#0F172A', padding: '0.65rem', borderRadius: '6px', borderLeft: '3px solid #3B82F6' }}>
                      <strong>Auto-Scale Option:</strong> Scale PROD-APP-03 instance cluster size by +1 to mitigate current response latency spikes.
                    </div>
                    <div style={{ background: '#0F172A', padding: '0.65rem', borderRadius: '6px', borderLeft: '3px solid #F59E0B' }}>
                      <strong>Drift Remediation:</strong> Conf drift detected on environment config. Suggest syncing environment parameters from Staging.
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        );
      }

      if (activeTemplateModule === 'support') {
        return (
          <div className="enterprise-workspace animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--background)' }}>
            <div className="enterprise-header" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
              <button 
                onClick={() => setActiveTemplateModule('all')}
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.8rem', fontSize: '0.85rem', fontWeight: 600, background: 'var(--surface)' }}
              >
                ← Back to Templates
              </button>
              <div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#2563EB' }}>Help & Support Center</span>
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                  Knowledge base portal with interactive walkthroughs, tutorials, FAQs, and AI assistance.
                </p>
              </div>
            </div>

            {/* 3-Column Support Dashboard Layout */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden', marginTop: '1rem', gap: '1.5rem' }}>
              
              {/* Left Column: Knowledge Navigation */}
              <div style={{ width: '220px', display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto', paddingRight: '0.5rem', flexShrink: 0 }}>
                <h3 style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 0.5rem', marginBottom: '0.25rem' }}>Knowledge Base</h3>
                {[
                  { id: 'user-guides', label: '📖 User Guides', count: 12 },
                  { id: 'admin-docs', label: '🛡 Admin Docs', count: 8 },
                  { id: 'training', label: '🎓 Training Material', count: 5 },
                  { id: 'faq', label: '❓ FAQ', count: 24 },
                  { id: 'troubleshoot', label: '🔧 Troubleshooting', count: 18 },
                  { id: 'releases', label: '🚀 Release Notes', count: 3 }
                ].map(nav => (
                  <button
                    key={nav.id}
                    onClick={() => setSupportNavSection(nav.id)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.75rem 0.85rem',
                      background: supportNavSection === nav.id ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
                      border: '1px solid',
                      borderColor: supportNavSection === nav.id ? 'rgba(37, 99, 235, 0.2)' : 'transparent',
                      borderRadius: '8px',
                      color: supportNavSection === nav.id ? '#2563EB' : 'var(--text-main)',
                      fontWeight: supportNavSection === nav.id ? 700 : 500,
                      fontSize: '0.85rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {nav.label}
                    <span style={{ fontSize: '0.7rem', background: supportNavSection === nav.id ? '#2563EB' : 'var(--border)', color: supportNavSection === nav.id ? '#fff' : 'var(--text-muted)', padding: '0.1rem 0.4rem', borderRadius: '10px', fontWeight: 800 }}>
                      {nav.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Center Column: Knowledge Workspace & Search */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto', paddingRight: '0.5rem' }}>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    placeholder="Search for articles, guides, or troubleshooting steps..." 
                    value={supportSearchQuery}
                    onChange={(e) => setSupportSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '1rem 1rem 1rem 2.5rem',
                      fontSize: '0.95rem',
                      borderRadius: '12px',
                      border: '1px solid var(--border)',
                      background: 'var(--surface)',
                      color: 'var(--text-main)',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                      outline: 'none'
                    }}
                  />
                  <span style={{ position: 'absolute', left: '1rem', top: '1rem', color: 'var(--text-muted)' }}>🔍</span>
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', padding: '0.25rem 0' }}>Popular:</span>
                  {['Login Issues', 'Password Reset', 'Leave Approval', 'Timesheet Error'].map(tag => (
                    <span key={tag} style={{ background: 'rgba(37, 99, 235, 0.08)', color: '#2563EB', padding: '0.25rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>{tag}</span>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
                  {supportTemplates.map((t: any) => (
                    <div key={t.id} className="template-card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', transition: 'all 0.2s', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <span className="template-badge" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.65rem', textTransform: 'uppercase' }}>
                          {t.type.replace('support-', '').toUpperCase()}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>{t.title}</h3>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 1.25rem 0', lineHeight: '1.5', flex: 1 }}>{t.desc}</p>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => router.push(`/?tab=builder&id=${t.id}`)}
                          className="btn btn-secondary" 
                          style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', fontWeight: 600 }}
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          onClick={() => useTemplate(t.title, t.id)} 
                          className="btn btn-primary" 
                          style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', fontWeight: 700, background: '#2563EB', borderColor: '#2563EB' }}
                        >
                          <Plus size={14} /> Use
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: AI Assistant & Related Articles */}
              <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '1.25rem', flexShrink: 0 }}>
                {/* AI Assistant Card */}
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #2563EB, #60A5FA)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                      <Sparkles size={14} />
                    </div>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Support Copilot</h3>
                  </div>
                  <div style={{ background: 'var(--background)', borderRadius: '8px', padding: '0.85rem', fontSize: '0.8rem', color: 'var(--text-main)', lineHeight: '1.5', border: '1px solid var(--border)', marginBottom: '0.75rem' }}>
                    Hello! I'm your AI support assistant. Describe the issue you're facing, and I'll find the right guide or troubleshooting steps for you.
                  </div>
                  <input type="text" placeholder="Ask AI..." style={{ width: '100%', padding: '0.65rem 0.85rem', fontSize: '0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text-main)', outline: 'none' }} />
                </div>

                {/* Related Articles */}
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                  <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.85rem' }}>Recent Updates</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {[
                      { title: 'v3.2 Release Notes Published', time: '2 hours ago' },
                      { title: 'Updated: Biometric Setup Guide', time: '5 hours ago' },
                      { title: 'New: Payroll Training Module', time: '1 day ago' }
                    ].map((item, i) => (
                      <div key={i} style={{ borderBottom: i < 2 ? '1px solid var(--border)' : 'none', paddingBottom: i < 2 ? '0.75rem' : 0 }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#2563EB', marginBottom: '0.2rem', cursor: 'pointer' }}>{item.title}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.time}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Feedback */}
                <div style={{ background: 'rgba(37, 99, 235, 0.05)', border: '1px dashed rgba(37, 99, 235, 0.3)', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
                  <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>Did you find what you need?</h4>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                    <button style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', padding: '0.3rem 0.8rem', cursor: 'pointer' }}>👍 Yes</button>
                    <button style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', padding: '0.3rem 0.8rem', cursor: 'pointer' }}>👎 No</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }

      return (
        <div className="enterprise-workspace animate-fade-in">
          <div className="enterprise-header">
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>Custom Templates</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Initialize structured guidelines and compliance standards or edit their base blueprints.</p>
            </div>
          </div>

          <div className="templates-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
            {specTemplates.map((t: any) => (
              <div key={t.id} className="template-card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="template-badge" style={{ background: 'rgba(16, 185, 129, 0.08)', color: 'var(--primary)', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    {t.type.toUpperCase()} Template
                  </span>
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginTop: '0.85rem', color: 'var(--text-main)' }}>{t.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.5rem 0 1.5rem 0', lineHeight: '1.5', flex: 1 }}>
                  {t.desc || 'Custom template outline.'}
                </p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => router.push(`/?tab=builder&id=${t.id}`)}
                    className="btn btn-secondary" 
                    style={{ flex: 1, padding: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', fontWeight: 600 }}
                  >
                    ✏️ Edit Template
                  </button>
                  <button 
                    onClick={() => useTemplate(t.title, t.id)} 
                    className="btn btn-primary" 
                    style={{ flex: 1, padding: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', fontWeight: 600 }}
                  >
                    <Plus size={16} /> Use
                  </button>
                </div>
              </div>
            ))}

            {/* Premium Development & PM Documents Module Card */}
            <div 
              className="template-card" 
              style={{ 
                background: 'var(--surface)', 
                border: '2px solid rgba(2, 132, 199, 0.18)', 
                borderRadius: '16px', 
                padding: '1.5rem', 
                display: 'flex', 
                flexDirection: 'column', 
                boxShadow: '0 8px 30px rgba(2, 132, 199, 0.04)', 
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(2, 132, 199, 0.08)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.borderColor = 'rgba(2, 132, 199, 0.18)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(2, 132, 199, 0.04)';
              }}
            >
              {/* Decorative top-right folder tab visual overlay */}
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '45px',
                height: '45px',
                background: 'linear-gradient(135deg, transparent 50%, rgba(2, 132, 199, 0.1) 50%)',
                borderBottomLeftRadius: '16px'
              }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="template-badge" style={{ background: 'rgba(2, 132, 199, 0.08)', color: 'var(--primary)', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                  📂 8 Presets
                </span>
                <span style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--primary)' }}>Module Folder</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1.25rem' }}>
                <div style={{ background: 'rgba(2, 132, 199, 0.06)', padding: '0.5rem', borderRadius: '10px', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Layers size={22} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, lineHeight: 1.2 }}>
                  Development & Project Management Documents
                </h3>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '1rem 0 1.5rem 0', lineHeight: '1.5', flex: 1 }}>
                Manage sprint boards, product feature backlogs, developer tasks, budgets, risks, and feature rollouts.
              </p>

              <button 
                onClick={() => setActiveTemplateModule('pm')} 
                className="btn btn-primary" 
                style={{ width: '100%', padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', fontWeight: 700 }}
              >
                Open Module ➔
              </button>
            </div>

            {/* Premium Testing & QA Documents Module Card */}
            <div 
              className="template-card" 
              style={{ 
                background: 'var(--surface)', 
                border: '2px solid rgba(2, 132, 199, 0.18)', 
                borderRadius: '16px', 
                padding: '1.5rem', 
                display: 'flex', 
                flexDirection: 'column', 
                boxShadow: '0 8px 30px rgba(2, 132, 199, 0.04)', 
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(2, 132, 199, 0.08)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.borderColor = 'rgba(2, 132, 199, 0.18)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(2, 132, 199, 0.04)';
              }}
            >
              {/* Decorative top-right folder tab visual overlay */}
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '45px',
                height: '45px',
                background: 'linear-gradient(135deg, transparent 50%, rgba(2, 132, 199, 0.1) 50%)',
                borderBottomLeftRadius: '16px'
              }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="template-badge" style={{ background: 'rgba(2, 132, 199, 0.08)', color: 'var(--primary)', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                  📂 4 Presets
                </span>
                <span style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--primary)' }}>Module Folder</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1.25rem' }}>
                <div style={{ background: 'rgba(2, 132, 199, 0.06)', padding: '0.5rem', borderRadius: '10px', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckSquare size={22} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, lineHeight: 1.2 }}>
                  Testing & QA Documents
                </h3>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '1rem 0 1.5rem 0', lineHeight: '1.5', flex: 1 }}>
                Manage testing plans, QA strategies, functional test case specifications, bug logs, and UAT checklists.
              </p>

              <button 
                onClick={() => setActiveTemplateModule('qa')} 
                className="btn btn-primary" 
                style={{ width: '100%', padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', fontWeight: 700 }}
              >
                Open Module ➔
              </button>
            </div>

            {/* Premium DevOps & Workspace Layout Module Card */}
            <div 
              className="template-card" 
              style={{ 
                background: 'var(--surface)', 
                border: '2px solid rgba(37, 99, 235, 0.18)', 
                borderRadius: '16px', 
                padding: '1.5rem', 
                display: 'flex', 
                flexDirection: 'column', 
                boxShadow: '0 8px 30px rgba(37, 99, 235, 0.04)', 
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = '#2563EB';
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(37, 99, 235, 0.08)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.18)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(37, 99, 235, 0.04)';
              }}
            >
              {/* Decorative top-right folder tab visual overlay */}
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '45px',
                height: '45px',
                background: 'linear-gradient(135deg, transparent 50%, rgba(37, 99, 235, 0.1) 50%)',
                borderBottomLeftRadius: '16px'
              }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="template-badge" style={{ background: 'rgba(37, 99, 235, 0.08)', color: '#2563EB', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                  📂 6 Presets
                </span>
                <span style={{ fontSize: '0.725rem', fontWeight: 700, color: '#2563EB' }}>Module Folder</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1.25rem' }}>
                <div style={{ background: 'rgba(37, 99, 235, 0.06)', padding: '0.5rem', borderRadius: '10px', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Settings size={22} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, lineHeight: 1.2 }}>
                  DevOps & Workspace Layout
                </h3>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '1rem 0 1.5rem 0', lineHeight: '1.5', flex: 1 }}>
                Configure live server topologies, database replication, build engines, backup DR recovery flows, and ELK aggregations.
              </p>

              <button 
                onClick={() => setActiveTemplateModule('devops')} 
                className="btn btn-primary" 
                style={{ width: '100%', padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', fontWeight: 700, background: '#2563EB', borderColor: '#2563EB' }}
              >
                Open Module ➔
              </button>
            </div>

            {/* Premium User & Support Documents Module Card */}
            <div className="template-card animate-fade-in" style={{ background: 'var(--surface)', border: '2px solid rgba(37, 99, 235, 0.15)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #2563EB, #60A5FA)' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="template-badge" style={{ background: 'rgba(37, 99, 235, 0.08)', color: '#2563EB', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                  📂 6 Presets
                </span>
                <span style={{ fontSize: '0.725rem', fontWeight: 700, color: '#2563EB' }}>Module Folder</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1.25rem' }}>
                <div style={{ background: 'rgba(37, 99, 235, 0.06)', padding: '0.5rem', borderRadius: '10px', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={22} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, lineHeight: 1.2 }}>
                  User & Support Documents
                </h3>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '1rem 0 1.5rem 0', lineHeight: '1.5', flex: 1 }}>
                Knowledge base portal with interactive walkthroughs, troubleshooting guides, training paths, FAQs, and release timelines.
              </p>

              <button 
                onClick={() => setActiveTemplateModule('support')} 
                className="btn btn-primary" 
                style={{ width: '100%', padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', fontWeight: 700, background: '#2563EB', borderColor: '#2563EB' }}
              >
                Open Module ➔
              </button>
            </div>

            <div 
              onClick={() => alert("Corporate template import: Select a compliant DocForge JSON outline preset to upload.")}
              style={{ border: '2px dashed var(--border)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', cursor: 'pointer', background: 'rgba(2, 132, 199, 0.005)' }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(2, 132, 199, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '1rem' }}>
                <Upload size={20} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>Upload Custom JSON</span>
            </div>
          </div>
        </div>
      );
    }

    case 'teams':
      return (
        <div className="enterprise-workspace animate-fade-in">
          <div className="enterprise-header">
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>👥 Collaborate Teams</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Coordinate editing roles and security clearance keys.</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                placeholder="User name..." 
                className="form-input" 
                style={{ width: '180px', padding: '0.5rem' }} 
                value={inviteName}
                onChange={e => setInviteName(e.target.value)}
              />
              <select 
                className="form-input" 
                style={{ width: '120px', padding: '0.5rem' }} 
                value={inviteRole}
                onChange={e => setInviteRole(e.target.value)}
              >
                <option value="Editor">Editor</option>
                <option value="Reviewer">Reviewer</option>
                <option value="Admin">Admin</option>
              </select>
              <button 
                onClick={() => {
                  if (!inviteName.trim()) return;
                  setTeamMembers([...teamMembers, {
                    id: teamMembers.length + 1,
                    name: inviteName,
                    role: inviteRole,
                    status: 'online',
                    avatar: '👨‍💻'
                  }]);
                  setInviteName('');
                }}
                className="btn btn-primary"
              >
                Invite
              </button>
            </div>
          </div>

          <div className="team-grid">
            {teamMembers.map(member => (
              <div key={member.id} className="team-card">
                <div className="team-avatar">{member.avatar}</div>
                <div className="team-info">
                  <span className="team-name">{member.name}</span>
                  <span className="team-role">{member.role}</span>
                </div>
                <span className={`team-status ${member.status}`} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{member.status}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case 'approvals': {
      const stages = ['Draft', 'Review', 'QA', 'Approval', 'Published'];
      
      const getPriorityColor = (priority: string) => {
        switch (priority.toLowerCase()) {
          case 'critical': return { bg: '#fee2e2', text: '#ef4444' };
          case 'high': return { bg: '#ffedd5', text: '#f97316' };
          case 'medium': return { bg: '#e0f2fe', text: '#0284c7' };
          case 'low':
          default: return { bg: '#f0fdf4', text: '#16a34a' };
        }
      };

      const handleAddCard = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCardTitle.trim()) return;
        const newCard = {
          id: 'k_' + Math.random().toString(36).substring(2, 11),
          title: newCardTitle,
          stage: 'Draft',
          priority: newCardPriority,
          owner: newCardOwner,
          lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        };
        setKanbanCards([newCard, ...kanbanCards]);
        setNewCardTitle('');
        setShowAddCardForm(false);
      };

      const handleMoveCard = (cardId: string, direction: 'next' | 'prev') => {
        setKanbanCards(prev => prev.map(card => {
          if (card.id !== cardId) return card;
          const currentIndex = stages.indexOf(card.stage);
          let newIndex = currentIndex;
          if (direction === 'next' && currentIndex < stages.length - 1) {
            newIndex = currentIndex + 1;
          } else if (direction === 'prev' && currentIndex > 0) {
            newIndex = currentIndex - 1;
          }
          return {
            ...card,
            stage: stages[newIndex],
            lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          };
        }));
      };

      const handleDeleteCard = (cardId: string) => {
        if (confirm("Are you sure you want to remove this document from the workflow?")) {
          setKanbanCards(prev => prev.filter(card => card.id !== cardId));
        }
      };

      return (
        <div className="enterprise-workspace animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div className="enterprise-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                📋 Workflow & Approval Board
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>
                Track and move enterprise documents through compliance and sign-off flow states.
              </p>
            </div>
            
            <button 
              onClick={() => {
                setShowAddCardForm(!showAddCardForm);
                setTimeout(() => {
                  const input = document.getElementById('new-card-title');
                  if (input) input.focus();
                }, 100);
              }}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.6rem 1rem' }}
            >
              <Plus size={16} /> New Document
            </button>
          </div>

          {/* Kanban Board Container */}
          <div className="kanban-board-scroll-wrapper" style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1.5rem', flex: 1, minHeight: '520px' }}>
            {stages.map(stage => {
              const stageCards = kanbanCards.filter(card => card.stage === stage);
              return (
                <div 
                  key={stage} 
                  className="kanban-column"
                  style={{ 
                    flex: '1', 
                    minWidth: '280px', 
                    maxWidth: '340px', 
                    background: 'rgba(248, 250, 252, 0.65)', 
                    border: '1px solid var(--border)', 
                    borderRadius: '16px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    padding: '1rem',
                    maxHeight: 'calc(100vh - 220px)',
                    overflowY: 'auto'
                  }}
                >
                  {/* Column Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '2px solid var(--border)', paddingBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ 
                        width: '8px', 
                        height: '8px', 
                        borderRadius: '50%', 
                        background: 
                          stage === 'Draft' ? '#cbd5e1' : 
                          stage === 'Review' ? '#6366f1' : 
                          stage === 'QA' ? '#f59e0b' : 
                          stage === 'Approval' ? '#0284c7' : '#10b981'
                      }} />
                      <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-main)', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                        {stage}
                      </span>
                    </div>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: 700, 
                      background: 'rgba(0,0,0,0.05)', 
                      color: 'var(--text-muted)', 
                      padding: '0.2rem 0.5rem', 
                      borderRadius: '12px' 
                    }}>
                      {stageCards.length}
                    </span>
                  </div>

                  {/* Add Card Form inside Draft column */}
                  {stage === 'Draft' && showAddCardForm && (
                    <form 
                      onSubmit={handleAddCard}
                      className="animate-fade-in"
                      style={{ 
                        background: 'var(--surface)', 
                        border: '1.5px dashed var(--primary)', 
                        borderRadius: '12px', 
                        padding: '0.85rem', 
                        marginBottom: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
                      }}
                    >
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase' }}>
                        Create Draft Card
                      </span>
                      
                      <input 
                        id="new-card-title"
                        type="text" 
                        placeholder="Document title..."
                        value={newCardTitle}
                        onChange={e => setNewCardTitle(e.target.value)}
                        required
                        className="form-input"
                        style={{ padding: '0.45rem', fontSize: '0.825rem' }}
                      />

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                          <label style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)' }}>Priority</label>
                          <select 
                            value={newCardPriority}
                            onChange={e => setNewCardPriority(e.target.value)}
                            className="form-input"
                            style={{ padding: '0.35rem', fontSize: '0.75rem' }}
                          >
                            <option value="Low">🟢 Low</option>
                            <option value="Medium">🔵 Medium</option>
                            <option value="High">🟠 High</option>
                            <option value="Critical">🔴 Critical</option>
                          </select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                          <label style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)' }}>Owner</label>
                          <select 
                            value={newCardOwner}
                            onChange={e => setNewCardOwner(e.target.value)}
                            className="form-input"
                            style={{ padding: '0.35rem', fontSize: '0.75rem' }}
                          >
                            <option value="Siddiq Admin">👨‍💼 Siddiq</option>
                            <option value="Ahmad Al-Mansoor">👨‍💻 Ahmad</option>
                            <option value="Fathima Zahra">👩‍💻 Fathima</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                        <button 
                          type="button" 
                          onClick={() => setShowAddCardForm(false)} 
                          className="btn btn-secondary" 
                          style={{ flex: 1, padding: '0.35rem', fontSize: '0.75rem' }}
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit" 
                          className="btn btn-primary" 
                          style={{ flex: 1, padding: '0.35rem', fontSize: '0.75rem' }}
                        >
                          Create
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Cards List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1 }}>
                    {stageCards.length === 0 ? (
                      <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        border: '1.5px dashed rgba(0,0,0,0.05)', 
                        borderRadius: '12px', 
                        padding: '2rem 1rem', 
                        color: 'var(--text-muted)',
                        fontSize: '0.8rem',
                        textAlign: 'center',
                        flex: 1,
                        background: 'rgba(255,255,255,0.2)'
                      }}>
                        <span>No documents here</span>
                      </div>
                    ) : (
                      stageCards.map(card => {
                        const pri = getPriorityColor(card.priority);
                        return (
                          <div 
                            key={card.id}
                            className="kanban-card"
                            style={{ 
                              background: 'var(--surface)', 
                              border: '1px solid var(--border)', 
                              borderRadius: '12px', 
                              padding: '0.9rem',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.65rem',
                              transition: 'all 0.2s ease',
                              cursor: 'default'
                            }}
                          >
                            {/* Card Header (Priority & Delete) */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ 
                                fontSize: '0.65rem', 
                                fontWeight: 800, 
                                background: pri.bg, 
                                color: pri.text, 
                                padding: '0.15rem 0.4rem', 
                                borderRadius: '4px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.04em'
                              }}>
                                {card.priority}
                              </span>
                              
                              <button 
                                onClick={() => handleDeleteCard(card.id)}
                                style={{ 
                                  background: 'transparent', 
                                  border: 'none', 
                                  color: 'var(--text-muted)', 
                                  cursor: 'pointer',
                                  padding: '0.1rem 0.25rem',
                                  borderRadius: '4px',
                                  transition: 'color 0.2s'
                                }}
                                onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>

                            {/* Card Title */}
                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: '1.4' }}>
                              {card.title}
                            </div>

                            {/* Card Meta (Owner & Date) */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '0.5rem', fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500 }}>
                                👤 {card.owner.split(' ')[0]}
                              </span>
                              <span>
                                {card.lastUpdated}
                              </span>
                            </div>

                            {/* Card Action Controls (Move Columns) */}
                            <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.25rem' }}>
                              {stage !== 'Draft' && (
                                <button 
                                  onClick={() => handleMoveCard(card.id, 'prev')}
                                  className="btn btn-secondary"
                                  style={{ 
                                    flex: 1, 
                                    padding: '0.25rem', 
                                    fontSize: '0.725rem', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    gap: '0.15rem'
                                  }}
                                >
                                  ◀ {stages[stages.indexOf(stage) - 1]}
                                </button>
                              )}
                              {stage !== 'Published' && (
                                <button 
                                  onClick={() => handleMoveCard(card.id, 'next')}
                                  className="btn btn-secondary"
                                  style={{ 
                                    flex: 1, 
                                    padding: '0.25rem', 
                                    fontSize: '0.725rem', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    gap: '0.15rem',
                                    borderColor: 'var(--primary)',
                                    color: 'var(--primary)'
                                  }}
                                >
                                  {stages[stages.indexOf(stage) + 1]} ➔
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    case 'versions':
      return (
        <div className="enterprise-workspace animate-fade-in">
          <div className="enterprise-header">
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>🕘 Platform Version Timeline</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Rollback coordinates and system audit timelines.</p>
            </div>
          </div>

          <div className="version-log-list">
            <div className="version-log-item">
              <div>
                <span className="version-badge">v1.2</span>
                <span style={{ marginLeft: '1rem', fontWeight: 600, fontSize: '0.95rem' }}>AI Copilot Side-Drawer redrafting integration</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Today, 11:23 AM</span>
            </div>

            <div className="version-log-item">
              <div>
                <span className="version-badge">v1.1</span>
                <span style={{ marginLeft: '1rem', fontWeight: 600, fontSize: '0.95rem' }}>Mawarid Secure REST API CORS Proxy route</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Yesterday, 04:12 PM</span>
            </div>

            <div className="version-log-item">
              <div>
                <span className="version-badge">v1.0</span>
                <span style={{ marginLeft: '1rem', fontWeight: 600, fontSize: '0.95rem' }}>Global Notion-style canvas editor database setup</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>2 days ago</span>
            </div>
          </div>
        </div>
      );

    case 'ai':
      return (
        <div className="enterprise-workspace animate-fade-in">
          <div className="enterprise-header">
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>🤖 Dedicated AI Agent Workspace</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Consult the platform AI Agent directly for high-fidelity outline generations.</p>
            </div>
          </div>

          <div className="ai-workspace-container">
            <div className="ai-workspace-left">
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Sliders size={16} /> Parameters Setup
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                    Temperature: {aiTemperature} (Creativity level)
                  </label>
                  <input 
                    type="range" 
                    min="0" max="1" step="0.1" 
                    value={aiTemperature}
                    onChange={e => setAiTemperature(parseFloat(e.target.value))}
                    style={{ cursor: 'pointer' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                    Max Tokens: {aiMaxTokens} (Length scope)
                  </label>
                  <input 
                    type="range" 
                    min="50" max="800" step="50" 
                    value={aiMaxTokens}
                    onChange={e => setAiMaxTokens(parseInt(e.target.value))}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
              </div>

              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>Quick Action Prompts</h3>
                <button 
                  onClick={() => setAiInput("Generate a detailed outline for a Software Requirements Specification (SRS) for an ERP inventory management module.")}
                  className="copilot-suggestion-btn"
                >
                  📝 Generate ERP SRS Outline
                </button>
                <button 
                  onClick={() => setAiInput("Polish and rewrite the following paragraph to make it sound highly professional for an NGO grant proposal: 'We need money to feed kids and run classes. Give us funds please.'")}
                  className="copilot-suggestion-btn"
                >
                  ✨ Refine NGO Proposal Wording
                </button>

                <textarea 
                  value={aiInput}
                  onChange={e => setAiInput(e.target.value)}
                  placeholder="Ask the AI Agent anything..."
                  className="form-textarea"
                  style={{ flex: 1, minHeight: '100px', fontSize: '0.875rem' }}
                />
                
                <button 
                  onClick={handleCallAI}
                  disabled={aiLoading || !aiInput.trim()}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  {aiLoading ? (
                    <>
                      <div className="login-spinner" style={{ width: '16px', height: '16px' }} />
                      <span>Agent Processing...</span>
                    </>
                  ) : (
                    <span>Ask AI Agent</span>
                  )}
                </button>
              </div>
            </div>

            <div className="ai-workspace-right">
              {aiOutput ? (
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      🤖 AI Response Output
                    </span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(aiOutput);
                          alert("Response copied to system clipboard!");
                        }}
                        className="btn btn-secondary"
                        style={{ padding: '0.35rem 0.5rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        <Clipboard size={14} /> Copy
                      </button>
                      <button 
                        onClick={handleSendToCanvas}
                        className="btn btn-primary"
                        style={{ padding: '0.35rem 0.5rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        <Plus size={14} /> Send to Canvas
                      </button>
                    </div>
                  </div>
                  <div style={{ flex: 1, overflowY: 'auto', fontSize: '0.95rem', lineHeight: '1.65', whiteSpace: 'pre-wrap', color: 'var(--text-main)' }}>
                    {aiOutput}
                  </div>
                </div>
              ) : (
                <div className="ai-response-placeholder">
                  <Bot size={48} style={{ color: 'var(--border)', animation: aiLoading ? 'pulse 2s infinite' : 'none' }} />
                  <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                    {aiLoading ? 'Agent is querying the Saudia portal servers...' : 'Ask a question on the left panel to trigger response generation.'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      );

    case 'settings':
      return (
        <div className="enterprise-workspace animate-fade-in">
          <div className="enterprise-header">
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>⚙ Settings & Controls</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Configure API endpoints and appearance states.</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Appearance Mode</h3>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  onClick={() => handleToggleTheme('light')} 
                  className={`btn ${themeMode === 'light' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: 1 }}
                >
                  ☀️ Light Mode
                </button>
                <button 
                  onClick={() => handleToggleTheme('dark')} 
                  className={`btn ${themeMode === 'dark' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: 1 }}
                >
                  🌙 Dark Mode
                </button>
              </div>
            </div>

            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>AI Agent Credentials</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Secure API Endpoint URL</label>
                <input 
                  type="text" 
                  value={apiEndpoint} 
                  onChange={e => setApiEndpoint(e.target.value)}
                  className="form-input" 
                  style={{ fontFamily: 'monospace', fontSize: '0.825rem' }}
                />
              </div>
            </div>

            <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px dashed rgba(239, 68, 68, 0.3)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--danger)' }}>Dangerous Section</h3>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Erase all stored canvas drafts and invitation records.</p>
              </div>
              <button onClick={handleResetDatabase} className="btn btn-secondary" style={{ borderColor: 'var(--danger)', color: 'var(--danger)', alignSelf: 'flex-start' }}>
                <Trash2 size={16} /> Reset Workspace Portal Cache
              </button>
            </div>
          </div>
        </div>
      );

    case 'dashboard':
    default:
      return (
        <div className="enterprise-workspace animate-fade-in">
          {/* Welcome Banner */}
          <div className="enterprise-header" style={{ marginBottom: '2rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                SECURED PORTAL SESSION
              </span>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.25rem' }}>
                Welcome back, {activeUser?.fullName || 'Siddiq Admin'}!
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Manage accounting architectures, corporate outlines, and consult your platform AI Agent.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => handleToggleTheme(themeMode === 'light' ? 'dark' : 'light')} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '38px', height: '38px', borderRadius: '50%', padding: 0 }} title="Toggle Theme">
                {themeMode === 'light' ? '🌙' : '☀️'}
              </button>
              <button onClick={() => useTemplate('New Specification', 'blank')} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Plus size={18} /> Start Canvas
              </button>
            </div>
          </div>

          {/* Premium Widgets Grid */}
          <div className="stats-grid">
            <div className="stat-card" style={{ background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.06) 0%, rgba(2, 132, 199, 0.02) 100%)', border: '1px solid rgba(2, 132, 199, 0.12)' }}>
              <span className="stat-num">{projects.length}</span>
              <span className="stat-label">Active Projects</span>
              <span className="stat-icon">📁</span>
            </div>

            <div className="stat-card" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.06) 0%, rgba(99, 102, 241, 0.02) 100%)', border: '1px solid rgba(99, 102, 241, 0.12)' }}>
              <span className="stat-num">12</span>
              <span className="stat-label">Total Drafts</span>
              <span className="stat-icon">📄</span>
            </div>

            <div className="stat-card" style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.06) 0%, rgba(245, 158, 11, 0.02) 100%)', border: '1px solid rgba(245, 158, 11, 0.12)' }}>
              <span className="stat-num">2</span>
              <span className="stat-label">Pending Signatures</span>
              <span className="stat-icon">✅</span>
            </div>

            <div className="stat-card" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.06) 0%, rgba(16, 185, 129, 0.02) 100%)', border: '1px solid rgba(16, 185, 129, 0.12)' }}>
              <span className="stat-num">4,250</span>
              <span className="stat-label">AI Words Made</span>
              <span className="stat-icon">🤖</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1.5rem' }}>
            {/* Quick Actions Panel */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🚀 Rapid Document Generators
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div 
                  onClick={() => useTemplate('Corporate Specification', 'template-brd')}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--border)', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = 'rgba(2, 132, 199, 0.01)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.5rem' }}>💼</span>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Initialize Corporate BRD Outline</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Launch our strict 12-section business requirement spec layout.</span>
                    </div>
                  </div>
                  <ArrowRight size={18} style={{ color: 'var(--text-muted)' }} />
                </div>

                <div 
                  onClick={() => useTemplate('New Feature Specification', 'template-frd')}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--border)', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = 'rgba(2, 132, 199, 0.01)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.5rem' }}>⚡</span>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Initialize Agile FRD Outline</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Launch our Agile Software Feature Requirement layout with user story mapping.</span>
                    </div>
                  </div>
                  <ArrowRight size={18} style={{ color: 'var(--text-muted)' }} />
                </div>

                <div 
                  onClick={() => useTemplate('Enterprise SRS Document', 'template-srs')}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--border)', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = 'rgba(2, 132, 199, 0.01)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: '#4f46e5', minWidth: '1.5rem' }}>SRS</span>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Initialize Enterprise SRS Template</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Launch the engineering SRS with APIs, architecture, database, DevOps, security, and approvals.</span>
                    </div>
                  </div>
                  <ArrowRight size={18} style={{ color: 'var(--text-muted)' }} />
                </div>

                <div 
                  onClick={() => useTemplate('New System Architecture', 'template-tdd')}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--border)', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = 'rgba(2, 132, 199, 0.01)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: '#ec4899', minWidth: '1.5rem' }}>📐</span>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Initialize TDD Template</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Launch the Technical Design Document for system architecture.</span>
                    </div>
                  </div>
                  <ArrowRight size={18} style={{ color: 'var(--text-muted)' }} />
                </div>
              </div>
            </div>

            {/* Sidebar Active Actions summary */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.25rem', display: 'flex', flex: 1, flexDirection: 'column' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Bot size={16} style={{ color: 'var(--primary)' }} /> AI Copilot Presets
                </h3>
                <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Quickly query the Saudia Mawarid agent for custom outline suggestions.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <button 
                    onClick={() => { router.push('/?tab=ai'); }} 
                    className="btn btn-secondary" 
                    style={{ fontSize: '0.8rem', justifyContent: 'space-between', padding: '0.6rem 0.75rem' }}
                  >
                    <span>🤖 Open AI Chat Portal</span> ➔
                  </button>
                  <button 
                    onClick={() => { router.push('/?tab=teams'); }} 
                    className="btn btn-secondary" 
                    style={{ fontSize: '0.8rem', justifyContent: 'space-between', padding: '0.6rem 0.75rem' }}
                  >
                    <span>👥 Manage Team Invitees</span> ➔
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
  }
}

export default function DashboardPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Authenticate routing coordinate check
    if (!isAuthenticated()) {
      router.replace('/login');
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) {
    return (
      <div 
        style={{ 
          height: '100vh', 
          width: '100%', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          color: 'var(--text-muted)',
          fontFamily: 'system-ui, sans-serif'
        }}
      >
        <div className="login-spinner" style={{ borderColor: 'rgba(2, 132, 199, 0.2)', borderTopColor: 'var(--primary)', width: '36px', height: '36px', borderWidth: '3px', marginBottom: '1.25rem' }} />
        <span style={{ fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.02em' }}>Securing portal session parameters...</span>
      </div>
    );
  }

  return (
    <Suspense fallback={<div style={{ padding: '3rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>Loading interface...</div>}>
      <MainDashboardContent />
    </Suspense>
  );
}





