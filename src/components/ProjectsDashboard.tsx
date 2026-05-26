import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProjectStore } from '@/store/useProjectStore';
import { useSectorStore } from '@/store/useSectorStore';
import { 
  Plus, 
  Search, 
  Grid, 
  List, 
  Folder, 
  Star, 
  Archive, 
  Edit3, 
  Trash2,
  MoreVertical,
  Clock,
  Filter,
  FileText
} from 'lucide-react';
import ProjectActionMenu from './ProjectActionMenu';

export default function ProjectsDashboard() {
  const router = useRouter();
  const { projects, addProject, updateProject, deleteProject } = useProjectStore();
  
  const [newProjectName, setNewProjectName] = useState('');
  const [folderError, setFolderError] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterActive, setFilterActive] = useState<'all' | 'favorites' | 'archived'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'name'>('recent');

  const getDocCountForProject = (projId: number | string) => {
    try {
      const savedDocs = JSON.parse(localStorage.getItem('docforge_saved_documents') || '[]');
      const metaList = JSON.parse(localStorage.getItem('docforge_docs_meta') || '[]');
      
      const matchedIds = new Set<string>();
      savedDocs.forEach((d: any) => {
        if (String(d.projectId) === String(projId)) matchedIds.add(d.id);
      });
      metaList.forEach((m: any) => {
        if (String(m.projectId) === String(projId)) matchedIds.add(m.id);
      });
      
      return matchedIds.size;
    } catch (e) {
      return 0;
    }
  };

  const handleCreateProject = () => {
    if (!newProjectName.trim()) {
      setFolderError('Project name is required.');
      return;
    }
    setFolderError('');
    addProject({
      id: Math.random().toString(36).substring(2, 9),
      name: newProjectName.trim(),
      status: 'active',
      color: '#6366f1',
      category: 'General',
      icon: '📁',
      createdAt: new Date().toISOString()
    });
    setNewProjectName('');
  };

  const handleToggleFavorite = (e: React.MouseEvent, id: string | number, currentStatus?: boolean) => {
    e.stopPropagation();
    updateProject(id, { isFavorite: !currentStatus });
  };

  const handleToggleArchive = (e: React.MouseEvent, id: string | number, currentStatus?: boolean) => {
    e.stopPropagation();
    updateProject(id, { isArchived: !currentStatus });
  };

  const handleDelete = (e: React.MouseEvent, id: string | number, name: string) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete project "${name}"?`)) {
      deleteProject(id);
    }
  };

  // Filtering
  const { activeSector, activeRoleId } = useSectorStore();
  const isSuperAdmin = activeRoleId === 'super_admin' || activeRoleId === 'admin' || activeRoleId === 'gov_admin';

  let filteredProjects = projects.filter(p => {
    // Workspace Sector Isolation: non-admins only see projects in their active workspace sector
    const projectSector = p.workspaceId || 'operations';
    if (!isSuperAdmin && projectSector !== activeSector) return false;
    
    if (filterActive === 'favorites') return p.isFavorite;
    if (filterActive === 'archived') return p.isArchived;
    return !p.isArchived; // default view hides archived
  });

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filteredProjects = filteredProjects.filter(p => p.name.toLowerCase().includes(q));
  }

  // Sorting
  filteredProjects.sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    }
  });

  return (
    <div className="enterprise-workspace animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '2rem' }}>
      <div className="enterprise-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Folder size={24} color="var(--primary)" /> Projects Hub
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Centralized workspace for managing project scopes and documentation.</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', position: 'relative' }}>
            <input 
              type="text" 
              placeholder="New project name..." 
              className={`form-input ${folderError ? 'error' : ''}`} 
              style={{ 
                width: '220px', 
                padding: '0.5rem', 
                borderColor: folderError ? '#ef4444' : 'var(--border)',
                boxShadow: folderError ? '0 0 0 2px rgba(239, 68, 68, 0.15)' : 'none',
                transition: 'all 0.2s',
                borderRadius: '8px'
              }} 
              value={newProjectName}
              onChange={e => {
                setNewProjectName(e.target.value);
                if (e.target.value.trim()) setFolderError('');
              }}
              onKeyDown={e => e.key === 'Enter' && handleCreateProject()}
            />
            {folderError && (
              <span style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 600, position: 'absolute', top: '100%', left: '2px', marginTop: '0.15rem' }}>
                ⚠️ {folderError}
              </span>
            )}
          </div>
          <button 
            onClick={handleCreateProject}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', height: '38px', borderRadius: '8px' }}
          >
            <Plus size={16} /> Create Project
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', background: 'var(--surface)', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.25rem' }}>
            <button 
              onClick={() => setFilterActive('all')} 
              style={{ padding: '0.35rem 0.75rem', background: filterActive === 'all' ? 'var(--surface)' : 'transparent', color: filterActive === 'all' ? 'var(--text-main)' : 'var(--text-muted)', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              All Active
            </button>
            <button 
              onClick={() => setFilterActive('favorites')} 
              style={{ padding: '0.35rem 0.75rem', background: filterActive === 'favorites' ? 'var(--surface)' : 'transparent', color: filterActive === 'favorites' ? 'var(--text-main)' : 'var(--text-muted)', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              <Star size={14} color={filterActive === 'favorites' ? '#f59e0b' : 'currentColor'} /> Favorites
            </button>
            <button 
              onClick={() => setFilterActive('archived')} 
              style={{ padding: '0.35rem 0.75rem', background: filterActive === 'archived' ? 'var(--surface)' : 'transparent', color: filterActive === 'archived' ? 'var(--text-main)' : 'var(--text-muted)', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              <Archive size={14} /> Archived
            </button>
          </div>

          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search projects..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ padding: '0.4rem 0.4rem 0.4rem 2rem', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--background)', fontSize: '0.85rem', width: '250px' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select 
            value={sortBy} 
            onChange={e => setSortBy(e.target.value as any)}
            style={{ padding: '0.4rem', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--background)', fontSize: '0.85rem', color: 'var(--text-main)', outline: 'none' }}
          >
            <option value="recent">Recently Created</option>
            <option value="name">Alphabetical</option>
          </select>

          <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
            <button 
              onClick={() => setViewMode('grid')}
              style={{ padding: '0.4rem', background: viewMode === 'grid' ? 'var(--primary)' : 'var(--surface)', color: viewMode === 'grid' ? 'white' : 'var(--text-muted)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Grid size={16} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              style={{ padding: '0.4rem', background: viewMode === 'list' ? 'var(--primary)' : 'var(--surface)', color: viewMode === 'list' ? 'white' : 'var(--text-muted)', border: 'none', borderLeft: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <List size={16} />
            </button>
          </div>
        </div>

      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filteredProjects.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', gap: '1rem', opacity: 0.7 }}>
            <Folder size={48} strokeWidth={1} />
            <p>No projects found matching your criteria.</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {filteredProjects.map(proj => (
              <div 
                key={proj.id} 
                onClick={() => router.push(`/?tab=templates&projectId=${proj.id}`)}
                style={{ 
                  background: 'var(--surface)', 
                  border: '1px solid var(--border)', 
                  borderRadius: '12px', 
                  padding: '1.25rem', 
                  cursor: 'pointer', 
                  transition: 'all 0.2s',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${proj.color || '#6366f1'}15`, color: proj.color || '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                      {proj.icon || '📁'}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-main)', lineHeight: 1.2 }}>{proj.name}</h3>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                        {proj.category || 'General'}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button 
                      onClick={(e) => handleToggleFavorite(e, proj.id, proj.isFavorite)}
                      style={{ background: 'transparent', border: 'none', color: proj.isFavorite ? '#f59e0b' : 'var(--text-muted)', padding: '0.2rem', cursor: 'pointer', borderRadius: '4px' }}
                      title={proj.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                    >
                      <Star size={16} fill={proj.isFavorite ? "currentColor" : "none"} />
                    </button>
                    <ProjectActionMenu project={proj} docCount={getDocCountForProject(proj.id)} />
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  {/* Additional info can go here */}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
                    <FileText size={14} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>{getDocCountForProject(proj.id)} Documents</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
                    <Clock size={14} />
                    <span style={{ fontSize: '0.8rem' }}>{proj.createdAt ? new Date(proj.createdAt).toLocaleDateString() : 'Updated Today'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--background)' }}>
                  <th style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Project Name</th>
                  <th style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Category</th>
                  <th style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Documents</th>
                  <th style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Created</th>
                  <th style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map(proj => (
                  <tr 
                    key={proj.id} 
                    onClick={() => router.push(`/?tab=templates&projectId=${proj.id}`)}
                    style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer', transition: 'background 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.02)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${proj.color || '#6366f1'}15`, color: proj.color || '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
                          {proj.icon || '📁'}
                        </div>
                        <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{proj.name}</span>
                        {proj.isFavorite && <Star size={12} fill="#f59e0b" color="#f59e0b" />}
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text-muted)' }}>
                        {proj.category || 'General'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      {getDocCountForProject(proj.id)}
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      {proj.createdAt ? new Date(proj.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button 
                          onClick={(e) => handleToggleFavorite(e, proj.id, proj.isFavorite)}
                          style={{ background: 'transparent', border: 'none', color: proj.isFavorite ? '#f59e0b' : 'var(--text-muted)', padding: '0.3rem', cursor: 'pointer', borderRadius: '4px' }}
                          title="Toggle Favorite"
                        >
                          <Star size={16} fill={proj.isFavorite ? "currentColor" : "none"} />
                        </button>
                        <ProjectActionMenu project={proj} docCount={getDocCountForProject(proj.id)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
