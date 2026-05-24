import React, { useState } from 'react';
import { Settings, Plus, Trash2, Save, X } from 'lucide-react';
import { useTemplateStore } from '@/store/useTemplateStore';

export default function TemplateConfigEditor({ 
  templateId, 
  configType, 
  onClose 
}: { 
  templateId: string; 
  configType: 'sidebarItems' | 'kpiWidgets' | 'workflowSteps'; 
  onClose: () => void;
}) {
  const { templates, setTemplates } = useTemplateStore();
  const template = templates.find(t => t.id === templateId);
  const [items, setItems] = useState<any[]>(template?.dashboardConfig?.[configType] || []);

  const handleSave = () => {
    if (!template) return;
    
    const updatedTemplates = templates.map(t => {
      if (t.id === templateId) {
        return {
          ...t,
          dashboardConfig: {
            ...t.dashboardConfig,
            [configType]: items
          }
        };
      }
      return t;
    });

    setTemplates(updatedTemplates);
    onClose();
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const addItem = () => {
    let newItem: any = { id: Math.random().toString(36).substr(2, 9) };
    if (configType === 'sidebarItems') {
      newItem = { ...newItem, label: 'New Item', icon: '📝' };
    } else if (configType === 'kpiWidgets') {
      newItem = { ...newItem, title: 'New KPI', value: '0', trend: 'Neutral', color: '#3b82f6', icon: '📊' };
    } else if (configType === 'workflowSteps') {
      newItem = { ...newItem, step: items.length + 1, title: 'New Step', status: 'Pending', assignee: 'Unassigned' };
    }
    setItems([...items, newItem]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'var(--surface)', width: '600px', maxHeight: '80vh', borderRadius: '12px', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-xl)' }}>
        
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Settings size={18} /> Edit {configType}
          </h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {items.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', background: 'var(--background)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
              
              {configType === 'sidebarItems' && (
                <>
                  <input value={item.icon} onChange={e => updateItem(i, 'icon', e.target.value)} style={{ width: '40px', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border)', textAlign: 'center' }} title="Emoji Icon" />
                  <input value={item.label} onChange={e => updateItem(i, 'label', e.target.value)} style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border)' }} placeholder="Label" />
                </>
              )}

              {configType === 'kpiWidgets' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input value={item.icon} onChange={e => updateItem(i, 'icon', e.target.value)} style={{ width: '40px', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border)', textAlign: 'center' }} title="Icon" />
                    <input value={item.title} onChange={e => updateItem(i, 'title', e.target.value)} style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border)' }} placeholder="KPI Title" />
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input value={item.value} onChange={e => updateItem(i, 'value', e.target.value)} style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border)' }} placeholder="Value (e.g. 42)" />
                    <input value={item.trend} onChange={e => updateItem(i, 'trend', e.target.value)} style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border)' }} placeholder="Trend (e.g. +5%)" />
                    <input type="color" value={item.color} onChange={e => updateItem(i, 'color', e.target.value)} style={{ width: '40px', height: '38px', padding: '0', borderRadius: '6px', border: 'none', cursor: 'pointer' }} title="Color" />
                  </div>
                </div>
              )}

              {configType === 'workflowSteps' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input type="number" value={item.step} onChange={e => updateItem(i, 'step', parseInt(e.target.value))} style={{ width: '60px', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border)' }} title="Step Number" />
                    <input value={item.title} onChange={e => updateItem(i, 'title', e.target.value)} style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border)' }} placeholder="Step Title" />
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <select value={item.status} onChange={e => updateItem(i, 'status', e.target.value)} style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border)' }}>
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Review</option>
                      <option>Completed</option>
                      <option>Blocked</option>
                    </select>
                    <input value={item.assignee} onChange={e => updateItem(i, 'assignee', e.target.value)} style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border)' }} placeholder="Assignee" />
                  </div>
                </div>
              )}

              <button onClick={() => removeItem(i)} style={{ padding: '0.5rem', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          <button onClick={addItem} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', border: '1px dashed var(--primary)', color: 'var(--primary)', background: 'transparent', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
            <Plus size={16} /> Add Item
          </button>
        </div>

        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button onClick={onClose} style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid var(--border)', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
          <button onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.5rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
            <Save size={16} /> Save Settings
          </button>
        </div>

      </div>
    </div>
  );
}
