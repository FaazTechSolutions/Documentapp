import React, { useState, useEffect } from 'react';
import { Users, Search, Plus, Mail, Trash2, Edit2, Check, X } from 'lucide-react';

interface Stakeholder {
  id: string;
  name: string;
  role: string;
  dept: string;
  power: 'High' | 'Medium' | 'Low';
  interest: 'High' | 'Medium' | 'Low';
}

const DEFAULT_STAKEHOLDERS: Stakeholder[] = [
  { id: '1', name: 'Sarah Jenkins', role: 'Product Sponsor', dept: 'Executive', power: 'High', interest: 'High' },
  { id: '2', name: 'Mike Thompson', role: 'Lead Architect', dept: 'Engineering', power: 'Medium', interest: 'High' },
  { id: '3', name: 'Amanda Clarke', role: 'Compliance Officer', dept: 'Legal', power: 'High', interest: 'Low' },
  { id: '4', name: 'David Lee', role: 'End User Rep', dept: 'Operations', power: 'Low', interest: 'High' },
];

export default function StakeholderGrid() {
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Stakeholder, 'id'>>({
    name: '',
    role: '',
    dept: '',
    power: 'Medium',
    interest: 'Medium',
  });

  // Load from local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('docforge_stakeholders');
      if (stored) {
        try {
          setStakeholders(JSON.parse(stored));
        } catch (e) {
          setStakeholders(DEFAULT_STAKEHOLDERS);
        }
      } else {
        setStakeholders(DEFAULT_STAKEHOLDERS);
        localStorage.setItem('docforge_stakeholders', JSON.stringify(DEFAULT_STAKEHOLDERS));
      }
    }
  }, []);

  // Save to local storage helper
  const saveStakeholders = (newStakeholders: Stakeholder[]) => {
    setStakeholders(newStakeholders);
    if (typeof window !== 'undefined') {
      localStorage.setItem('docforge_stakeholders', JSON.stringify(newStakeholders));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddStakeholder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.role.trim()) return;

    const newStakeholder: Stakeholder = {
      ...formData,
      id: Date.now().toString(),
    };

    const updated = [...stakeholders, newStakeholder];
    saveStakeholders(updated);
    
    // Reset Form
    setFormData({
      name: '',
      role: '',
      dept: '',
      power: 'Medium',
      interest: 'Medium',
    });
    setShowAddForm(false);
  };

  const handleStartEdit = (s: Stakeholder) => {
    setEditingId(s.id);
    setFormData({
      name: s.name,
      role: s.role,
      dept: s.dept,
      power: s.power,
      interest: s.interest,
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !formData.name.trim() || !formData.role.trim()) return;

    const updated = stakeholders.map(s => {
      if (s.id === editingId) {
        return {
          ...s,
          ...formData
        };
      }
      return s;
    });

    saveStakeholders(updated);
    setEditingId(null);
    // Reset Form
    setFormData({
      name: '',
      role: '',
      dept: '',
      power: 'Medium',
      interest: 'Medium',
    });
  };

  const handleDeleteStakeholder = (id: string) => {
    if (confirm('Are you sure you want to remove this stakeholder?')) {
      const updated = stakeholders.filter(s => s.id !== id);
      saveStakeholders(updated);
    }
  };

  // Filtered Stakeholders
  const filteredStakeholders = stakeholders.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.dept.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Dynamic Grid Counts
  // Manage Closely: High/Medium Power & High Interest
  const manageCloselyCount = stakeholders.filter(s => (s.power === 'High' || s.power === 'Medium') && s.interest === 'High').length;
  // Keep Satisfied: High Power & Low/Medium Interest
  const keepSatisfiedCount = stakeholders.filter(s => s.power === 'High' && (s.interest === 'Low' || s.interest === 'Medium')).length;
  // Keep Informed: Low/Medium Power & High/Medium Interest (not in Manage Closely)
  const keepInformedCount = stakeholders.filter(s => s.power === 'Low' && s.interest === 'High').length;
  // Monitor: Low Power & Low/Medium Interest
  const monitorCount = stakeholders.filter(s => s.power === 'Low' && s.interest === 'Low').length;

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden', height: 'calc(100vh - 120px)', background: 'var(--background)' }} className="animate-fade-in">
      {/* ── CENTER WORKSPACE ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={20} color="#8b5cf6" /> Stakeholder Registry
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>Identify key workspace partners, manage roles, and track communication plans.</p>
          </div>
          {!showAddForm && !editingId && (
            <button 
              onClick={() => setShowAddForm(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#8b5cf6', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'background-color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#7c3aed'}
              onMouseLeave={e => e.currentTarget.style.background = '#8b5cf6'}
            >
              <Plus size={14} /> Add Stakeholder
            </button>
          )}
        </div>

        {/* Search Bar */}
        {!showAddForm && !editingId && (
          <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
            <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
              <Search size={16} />
            </span>
            <input 
              type="text" 
              placeholder="Search stakeholders..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '0.5rem 1rem 0.5rem 2.25rem', fontSize: '0.85rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text-main)', outline: 'none' }}
            />
          </div>
        )}

        {/* Inline Form for Adding or Editing */}
        {(showAddForm || editingId) && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '1.25rem', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>
              {editingId ? '✏️ Edit Stakeholder' : '👤 Add New Stakeholder'}
            </h3>
            <form onSubmit={editingId ? handleSaveEdit : handleAddStakeholder} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Sarah Jenkins"
                  style={{ width: '100%', padding: '0.45rem 0.75rem', fontSize: '0.85rem', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text-main)' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Role</label>
                <input 
                  type="text" 
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Product Sponsor"
                  style={{ width: '100%', padding: '0.45rem 0.75rem', fontSize: '0.85rem', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text-main)' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Department</label>
                <input 
                  type="text" 
                  name="dept"
                  value={formData.dept}
                  onChange={handleInputChange}
                  placeholder="e.g. Executive"
                  style={{ width: '100%', padding: '0.45rem 0.75rem', fontSize: '0.85rem', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text-main)' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Power Level</label>
                <select 
                  name="power"
                  value={formData.power}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.45rem 0.75rem', fontSize: '0.85rem', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text-main)' }}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Interest Level</label>
                <select 
                  name="interest"
                  value={formData.interest}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.45rem 0.75rem', fontSize: '0.85rem', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text-main)' }}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  type="submit"
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', background: '#10b981', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  <Check size={14} /> Save
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingId(null);
                  }}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', background: 'rgba(255,255,255,0.08)', color: 'var(--text-main)', border: '1px solid var(--border)', padding: '0.5rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  <X size={14} /> Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Stakeholder Table */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--border)' }}>
              <tr>
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Name</th>
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Role</th>
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Department</th>
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Power</th>
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Interest</th>
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStakeholders.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>No stakeholders found.</td>
                </tr>
              ) : (
                filteredStakeholders.map(s => (
                  <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 'bold' }}>{s.name.charAt(0)}</div>
                        {s.name}
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: 'var(--text-main)' }}>{s.role}</td>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.dept || '—'}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: s.power === 'High' ? '#ef4444' : s.power === 'Medium' ? '#f59e0b' : '#10b981', background: s.power === 'High' ? 'rgba(239, 68, 68, 0.1)' : s.power === 'Medium' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>{s.power}</span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: s.interest === 'High' ? '#ef4444' : s.interest === 'Medium' ? '#f59e0b' : '#10b981', background: s.interest === 'High' ? 'rgba(239, 68, 68, 0.1)' : s.interest === 'Medium' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>{s.interest}</span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button 
                          onClick={() => handleStartEdit(s)}
                          style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem', display: 'flex', alignItems: 'center' }}
                          title="Edit Stakeholder"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => handleDeleteStakeholder(s.id)}
                          style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem', display: 'flex', alignItems: 'center' }}
                          title="Delete Stakeholder"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── RIGHT PANEL (POWER/INTEREST GRID) ── */}
      <div style={{ width: '280px', borderLeft: '1px solid var(--border)', background: 'var(--background)', display: 'flex', flexDirection: 'column', flexShrink: 0, padding: '1.5rem', gap: '1.5rem', overflowY: 'auto' }}>
        <div>
          <h4 style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Power / Interest Grid</h4>
          
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '1rem', borderRadius: '8px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '4px', height: '180px' }}>
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: '#ef4444', textAlign: 'center', padding: '0.5rem', borderRadius: '4px' }}>
                Keep Satisfied ({keepSatisfiedCount})
              </div>
              <div style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: '#8b5cf6', textAlign: 'center', padding: '0.5rem', borderRadius: '4px' }}>
                Manage Closely ({manageCloselyCount})
              </div>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: '#10b981', textAlign: 'center', padding: '0.5rem', borderRadius: '4px' }}>
                Monitor ({monitorCount})
              </div>
              <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: '#f59e0b', textAlign: 'center', padding: '0.5rem', borderRadius: '4px' }}>
                Keep Informed ({keepInformedCount})
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Communication Plan</h4>
          <button style={{ width: '100%', padding: '0.5rem', fontSize: '0.75rem', fontWeight: 600, background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
            <Mail size={14} /> Send Project Update
          </button>
        </div>
      </div>
    </div>
  );
}
