"use client";

import React, { useState } from 'react';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { Settings, Users, Puzzle, Bot, Search, Plus, Save, Trash2, Edit3, X, Check } from 'lucide-react';

export default function WorkspaceSettings() {
  const { workspaces, activeWorkspaceId, updateWorkspace } = useWorkspaceStore();
  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId);
  const [activeTab, setActiveTab] = useState<'general' | 'modules' | 'members' | 'ai'>('general');
  const [localName, setLocalName] = useState(activeWorkspace?.name || '');
  const [localDesc, setLocalDesc] = useState(activeWorkspace?.description || '');

  if (!activeWorkspace) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No workspace selected.</div>;
  }

  const handleSaveGeneral = () => {
    updateWorkspace(activeWorkspace.id, { name: localName, description: localDesc });
    // show toast or feedback
  };

  const toggleModule = (moduleId: string) => {
    const current = activeWorkspace.enabledModules;
    const updated = current.includes(moduleId) 
      ? current.filter(m => m !== moduleId) 
      : [...current, moduleId];
    updateWorkspace(activeWorkspace.id, { enabledModules: updated });
  };

  const allAvailableModules = [
    { id: 'm-req', label: 'Requirements', desc: 'Manage BRDs, PRDs, and user stories.' },
    { id: 'm-scope', label: 'Scope Management', desc: 'Define inclusions, exclusions, and deliverables.' },
    { id: 'm-stake', label: 'Stakeholders', desc: 'Track key personnel and RACI.' },
    { id: 'm-work', label: 'Workflows', desc: 'Process diagrams and states.' },
    { id: 'm-risk', label: 'Risks', desc: 'Risk matrix and mitigation plans.' },
    { id: 'm-appr', label: 'Approvals', desc: 'Sign-off gates and review cycles.' },
    { id: 'm-testcases', label: 'Test Cases', desc: 'Test execution and mapping.' },
    { id: 'm-bugs', label: 'Bug Tracking', desc: 'Defect logging and resolution.' },
    { id: 'm-deploy', label: 'Deployments', desc: 'Release management and scheduling.' }
  ];

  return (
    <div className="workspace-settings animate-fade-in" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Settings size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Workspace Settings</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>Configure settings, modules, and access control for <strong>{activeWorkspace.name}</strong>.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem' }}>
        {/* Settings Navigation */}
        <div style={{ width: '240px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button 
            onClick={() => setActiveTab('general')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px',
              background: activeTab === 'general' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'general' ? 'white' : 'var(--text-main)',
              border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: activeTab === 'general' ? 700 : 500,
              transition: 'all 0.2s'
            }}
          >
            <Settings size={16} /> General
          </button>
          <button 
            onClick={() => setActiveTab('modules')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px',
              background: activeTab === 'modules' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'modules' ? 'white' : 'var(--text-main)',
              border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: activeTab === 'modules' ? 700 : 500,
              transition: 'all 0.2s'
            }}
          >
            <Puzzle size={16} /> Features & Modules
          </button>
          <button 
            onClick={() => setActiveTab('members')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px',
              background: activeTab === 'members' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'members' ? 'white' : 'var(--text-main)',
              border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: activeTab === 'members' ? 700 : 500,
              transition: 'all 0.2s'
            }}
          >
            <Users size={16} /> Members
          </button>
          <button 
            onClick={() => setActiveTab('ai')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px',
              background: activeTab === 'ai' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'ai' ? 'white' : 'var(--text-main)',
              border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: activeTab === 'ai' ? 700 : 500,
              transition: 'all 0.2s'
            }}
          >
            <Bot size={16} /> AI Configuration
          </button>
        </div>

        {/* Settings Content */}
        <div style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '2rem', minHeight: '500px' }}>
          
          {activeTab === 'general' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>General Settings</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>Workspace Name</label>
                <input 
                  type="text" 
                  value={localName} 
                  onChange={e => setLocalName(e.target.value)}
                  style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text-main)', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>Description</label>
                <textarea 
                  value={localDesc} 
                  onChange={e => setLocalDesc(e.target.value)}
                  rows={3}
                  style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text-main)', outline: 'none', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>Workspace Icon (Emoji)</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                    {activeWorkspace.theme.icon}
                  </div>
                  <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>Change Icon</button>
                </div>
              </div>

              <div style={{ marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={handleSaveGeneral} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}>
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'modules' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Features & Modules</h2>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Customize what shows up in the sidebar.</span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {allAvailableModules.map(mod => {
                  const isEnabled = activeWorkspace.enabledModules.includes(mod.id);
                  return (
                    <div 
                      key={mod.id} 
                      onClick={() => toggleModule(mod.id)}
                      style={{ 
                        border: `1px solid ${isEnabled ? 'var(--primary)' : 'var(--border)'}`, 
                        borderRadius: '12px', padding: '1.25rem', cursor: 'pointer',
                        background: isEnabled ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
                        display: 'flex', alignItems: 'flex-start', gap: '1rem', transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ 
                        width: '20px', height: '20px', borderRadius: '6px', border: `2px solid ${isEnabled ? 'var(--primary)' : '#94a3b8'}`,
                        background: isEnabled ? 'var(--primary)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '0.1rem'
                      }}>
                        {isEnabled && <Check size={12} color="white" strokeWidth={3} />}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: isEnabled ? 'var(--primary)' : 'var(--text-main)', marginBottom: '0.2rem' }}>{mod.label}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>{mod.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'members' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Workspace Members</h2>
                <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
                  <Plus size={16} /> Invite Member
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--background)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <Search size={16} color="var(--text-muted)" />
                <input type="text" placeholder="Search members by name or email..." style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--text-main)' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
                {activeWorkspace.members.map((m, i) => (
                  <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', borderBottom: i < activeWorkspace.members.length - 1 ? '1px solid var(--border)' : 'none', background: 'var(--surface)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 'bold' }}>
                        {m.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{m.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.name.split(' ')[0].toLowerCase()}@unitracon.com</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <select 
                        defaultValue={m.role}
                        style={{ padding: '0.4rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text-main)', outline: 'none', fontSize: '0.8rem' }}
                      >
                        <option value="Admin">Admin</option>
                        <option value="Editor">Editor</option>
                        <option value="Viewer">Viewer</option>
                      </select>
                      <button style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.4rem', borderRadius: '6px' }}>
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>AI Configuration</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Customize the behavior and context of the AI Agent within this workspace.</p>
              
              <div style={{ background: 'rgba(168, 85, 247, 0.05)', border: '1px solid rgba(168, 85, 247, 0.2)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>Custom Instructions (System Prompt)</label>
                  <textarea 
                    defaultValue="You are an expert Business Analyst. Focus strictly on measurable requirements, explicit risk definitions, and rigorous acceptance criteria. Avoid marketing fluff."
                    rows={4}
                    style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(168, 85, 247, 0.3)', background: 'var(--background)', color: 'var(--text-main)', outline: 'none', resize: 'vertical' }}
                  />
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>These instructions guide the agent when generating content in this workspace.</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--background)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>Auto-Summarize Approvals</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Agent will automatically generate daily summaries of pending PRs.</div>
                  </div>
                  <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--background)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>Strict Compliance Mode</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Agent will refuse to generate content outside of defined module constraints.</div>
                  </div>
                  <input type="checkbox" defaultChecked={false} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                </div>
              </div>
              
              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: '#a855f7' }}>
                  <Bot size={16} /> Save AI Settings
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
