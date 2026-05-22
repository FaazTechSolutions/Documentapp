import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useProjectStore, Project } from '@/store/useProjectStore';
import {
  FolderOpen, Edit3, Copy, Archive, Trash2, Star, 
  FileText, UploadCloud, DownloadCloud, Sparkles, 
  BookTemplate, PenTool, BarChart2,
  Settings, Users, Shield, Palette, Tag,
  Activity, Clock, CheckCircle, MessageSquare, Bell, Share2, Calendar
} from 'lucide-react';

interface ProjectActionMenuProps {
  project: Project;
  docCount: number;
}

export default function ProjectActionMenu({ project, docCount }: ProjectActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  const { updateProject, deleteProject, duplicateProject } = useProjectStore();

  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle keyboard shortcuts when menu is open
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isOpen) return;
      
      const key = e.key.toLowerCase();
      if (key === 'r') {
        e.preventDefault();
        handleAction('rename');
      } else if (key === 'd') {
        e.preventDefault();
        handleAction('duplicate');
      } else if (key === 'a') {
        e.preventDefault();
        handleAction('archive');
      } else if (e.key === 'Delete') {
        e.preventDefault();
        setShowDeleteModal(true);
        setIsOpen(false);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, project.id]);

  const handleAction = (action: string) => {
    switch (action) {
      case 'open':
        router.push(`/?tab=documents&projectId=${project.id}`);
        break;
      case 'rename':
        const newName = prompt('Enter new project name:', project.name);
        if (newName && newName.trim()) {
          updateProject(project.id, { name: newName.trim() });
        }
        break;
      case 'duplicate':
        duplicateProject(project.id);
        break;
      case 'archive':
        updateProject(project.id, { isArchived: !project.isArchived });
        break;
      case 'favorite':
        updateProject(project.id, { isFavorite: !project.isFavorite });
        break;
      case 'delete':
        setShowDeleteModal(true);
        break;
      default:
        // Mock action for placeholders
        alert(`Feature "${action}" is coming soon!`);
        break;
    }
    if (action !== 'delete') {
      setIsOpen(false);
    }
  };

  const confirmDelete = () => {
    deleteProject(project.id);
    setShowDeleteModal(false);
  };

  return (
    <div style={{ position: 'relative' }} ref={menuRef}>
      <button 
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
        style={{ 
          background: isOpen ? 'var(--surface)' : 'transparent', 
          border: 'none', 
          color: isOpen ? 'var(--text-main)' : 'var(--text-muted)', 
          padding: '0.3rem', 
          cursor: 'pointer', 
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s'
        }}
      >
        <div style={{ width: '16px', height: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'currentColor' }} />
          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'currentColor' }} />
          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'currentColor' }} />
        </div>
      </button>

      {isOpen && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="animate-fade-in"
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '0.5rem',
            width: '300px',
            background: 'var(--mkt-card)',
            backdropFilter: 'blur(12px)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-lg), 0 0 0 1px rgba(255,255,255,0.05)',
            zIndex: 100,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '400px',
            overflowY: 'auto'
          }}
        >
          {/* Quick Project Preview Header */}
          <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${project.color || '#6366f1'}15`, color: project.color || '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
                {project.icon || '📁'}
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{project.name}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  <span>{project.category || 'General'}</span>
                  <span>•</span>
                  <span>{docCount} docs</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              <Clock size={12} /> Last updated: {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'Today'}
            </div>
          </div>

          <div style={{ padding: '0.5rem' }}>
            {/* Primary Actions */}
            <div style={{ marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '0 0.5rem', marginBottom: '0.25rem', display: 'block' }}>Project Actions</span>
              <MenuItem icon={<FolderOpen size={14} />} label="Open Project" onClick={() => handleAction('open')} />
              <MenuItem icon={<Edit3 size={14} />} label="Rename" shortcut="R" onClick={() => handleAction('rename')} />
              <MenuItem icon={<Copy size={14} />} label="Duplicate" shortcut="D" onClick={() => handleAction('duplicate')} />
              <MenuItem icon={<Star size={14} />} label={project.isFavorite ? "Remove from Favorites" : "Add to Favorites"} onClick={() => handleAction('favorite')} />
            </div>

            <Divider />

            {/* Documents */}
            <div style={{ marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '0 0.5rem', marginBottom: '0.25rem', display: 'block' }}>Documents</span>
              <MenuItem icon={<FileText size={14} />} label="Create Document" onClick={() => router.push('/?tab=documents')} />
              <MenuItem icon={<UploadCloud size={14} />} label="Import Documents" onClick={() => handleAction('Import Documents')} />
              <MenuItem icon={<DownloadCloud size={14} />} label="Export Project" onClick={() => handleAction('Export Project')} />
              <MenuItem icon={<Sparkles size={14} color="#a855f7" />} label="Generate Docs with AI" onClick={() => handleAction('Generate Docs with AI')} />
            </div>

            <Divider />

            {/* Templates */}
            <div style={{ marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '0 0.5rem', marginBottom: '0.25rem', display: 'block' }}>Templates</span>
              <MenuItem icon={<BookTemplate size={14} />} label="Apply Template" onClick={() => router.push('/?tab=templates')} />
              <MenuItem icon={<PenTool size={14} />} label="Customize Templates" onClick={() => router.push('/?tab=templatesetup')} />
              <MenuItem icon={<BarChart2 size={14} />} label="View Template Usage" onClick={() => handleAction('View Template Usage')} />
            </div>

            <Divider />

            {/* Settings */}
            <div style={{ marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '0 0.5rem', marginBottom: '0.25rem', display: 'block' }}>Settings</span>
              <MenuItem icon={<Settings size={14} />} label="Project Settings" onClick={() => handleAction('Project Settings')} />
              <MenuItem icon={<Users size={14} />} label="Manage Team" onClick={() => handleAction('Manage Team')} />
              <MenuItem icon={<Shield size={14} />} label="Permissions" onClick={() => handleAction('Permissions')} />
              <MenuItem icon={<Palette size={14} />} label="Project Theme" onClick={() => handleAction('Project Theme')} />
              <MenuItem icon={<Tag size={14} />} label="Tags & Categories" onClick={() => handleAction('Tags & Categories')} />
            </div>

            <Divider />

            {/* AI & Analytics */}
            <div style={{ marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '0 0.5rem', marginBottom: '0.25rem', display: 'block' }}>AI & Analytics</span>
              <MenuItem icon={<Sparkles size={14} color="#a855f7" />} label="AI Project Analysis" onClick={() => handleAction('AI Project Analysis')} />
              <MenuItem icon={<Activity size={14} />} label="Project Analytics" onClick={() => handleAction('Project Analytics')} />
              <MenuItem icon={<Clock size={14} />} label="Activity Timeline" onClick={() => handleAction('Activity Timeline')} />
              <MenuItem icon={<CheckCircle size={14} />} label="Progress Tracking" onClick={() => handleAction('Progress Tracking')} />
            </div>
            
            <Divider />

            {/* Collaboration */}
            <div style={{ marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '0 0.5rem', marginBottom: '0.25rem', display: 'block' }}>Collaboration</span>
              <MenuItem icon={<MessageSquare size={14} />} label="Comments" onClick={() => handleAction('Comments')} />
              <MenuItem icon={<Share2 size={14} />} label="Share Project" onClick={() => handleAction('Share Project')} />
              <MenuItem icon={<Calendar size={14} />} label="Sprint Planning" onClick={() => handleAction('Sprint Planning')} />
            </div>

            <Divider />

            {/* Danger Zone */}
            <div>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', padding: '0 0.5rem', marginBottom: '0.25rem', display: 'block' }}>Danger Zone</span>
              <MenuItem icon={<Archive size={14} />} label={project.isArchived ? "Unarchive" : "Archive"} shortcut="A" onClick={() => handleAction('archive')} danger />
              <MenuItem icon={<Trash2 size={14} />} label="Delete Project" shortcut="Del" onClick={() => handleAction('delete')} danger />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={(e) => { e.stopPropagation(); setShowDeleteModal(false); }}>
          <div className="animate-fade-in" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', width: '400px', boxShadow: 'var(--shadow-xl)' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Trash2 color="#ef4444" /> Delete Project?
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              You are about to permanently delete <strong>{project.name}</strong> and all related documents. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setShowDeleteModal(false)} style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-main)', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
              <button onClick={confirmDelete} style={{ padding: '0.5rem 1rem', background: '#ef4444', border: 'none', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuItem({ icon, label, shortcut, onClick, danger }: { icon: React.ReactNode, label: string, shortcut?: string, onClick: () => void, danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '0.5rem',
        background: 'transparent',
        border: 'none',
        borderRadius: '6px',
        color: danger ? '#ef4444' : 'var(--text-main)',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'background 0.2s'
      }}
      onMouseEnter={e => e.currentTarget.style.background = danger ? 'rgba(239, 68, 68, 0.1)' : 'var(--hover)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 500 }}>
        {icon}
        {label}
      </div>
      {shortcut && <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'var(--background)', padding: '0.1rem 0.3rem', borderRadius: '4px', border: '1px solid var(--border)' }}>{shortcut}</span>}
    </button>
  );
}

function Divider() {
  return <div style={{ height: '1px', background: 'var(--border)', margin: '0.5rem 0' }} />;
}
