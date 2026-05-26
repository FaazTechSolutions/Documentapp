"use client";

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { useSearchParams, useRouter } from 'next/navigation';
import { Download, FileText, File, Upload, Plus, Trash2, Save, ArrowUp, ArrowDown, Settings, AlignLeft, Sparkles, Sliders, Undo, Redo, GripVertical, MessageSquare, ChevronDown, Check, Share2, Search, ArrowRight, LayoutDashboard, Database, RefreshCw, Layers } from 'lucide-react';
import { exportToMarkdown, exportToText, exportToPdf, exportToDocx } from '@/lib/export';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { WorkspaceRegistry } from '@/lib/workspaceRegistry';
import { saveDocument, getSavedDocument, generateDocumentId } from '@/lib/storage';
import { generateCustomMarkdown } from '@/lib/markdown';
import GithubModal from './GithubModal';
import EnterpriseWorkspaceToolbar from './EnterpriseWorkspaceToolbar';
import { useBuilderStore } from '@/store/useBuilderStore';
import TemplateSaveModal from './TemplateSaveModal';
import { useTemplateStore } from '@/store/useTemplateStore';
import FolderDropdown from './FolderDropdown';
import CreateFolderModal from './CreateFolderModal';
import TemplateConfigEditor from './TemplateSetup/TemplateConfigEditor';
import { extractDocumentMetrics } from '@/lib/documentParser';

export type BlockType = 
  | 'header' 
  | 'text' 
  | 'textarea' 
  | 'file' 
  | 'bulleted-list' 
  | 'numbered-list' 
  | 'todo-list' 
  | 'quote' 
  | 'callout' 
  | 'code'
  | 'metric-cards'
  | 'kanban-board'
  | 'detailed-card'
  | 'progress-bars'
  | 'toggle-header'
  | 'page'
  | 'toggle-list'
  | 'equation'
  | 'synced-block'
  | 'table'
  | 'date-time';

export interface CustomBlock {
  id: string;
  type: BlockType;
  label: string;
  value: string;
  fontSize?: string;
  color?: string;
  backgroundColor?: string;
  align?: string;
  fileName?: string;
  fileSize?: string;
  fileType?: string;
  fileDataUrl?: string;
  headingLevel?: string;
  toggleCollapsed?: boolean;
}

export default function CustomDocumentEditor({ forceView }: { forceView?: 'dashboard' | 'canvas' }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loadedId = searchParams.get('id');

  const { activeView, setActiveView } = useBuilderStore();
  const { workspaces, activeWorkspaceId } = useWorkspaceStore();
  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId);

  // localViewMode lets the left nav panel switch to dashboard view without changing
  // the global activeView (which would cause BuilderWorkspace to navigate away)
  const [localViewMode, setLocalViewMode] = useState<'dashboard' | 'canvas' | null>(null);
  const viewMode = forceView || localViewMode || (activeView === 'dashboard' ? 'dashboard' : 'canvas');

  useEffect(() => {
    setLocalViewMode(null);
  }, [activeView]);

  const [documentId, setDocumentId] = useState<string>(loadedId || generateDocumentId());
  const [documentTitle, setDocumentTitle] = useState('My Custom Document');
  const [blocks, setBlocks] = useState<CustomBlock[]>([]);
  const [markdown, setMarkdown] = useState('');
  const [blockToFocus, setBlockToFocus] = useState<string | null>(null);
  
  const [isTemplate, setIsTemplate] = useState(false);
  const [isTemplateBuilder, setIsTemplateBuilder] = useState(searchParams.get('isBuilder') === 'true');
  const [isTemplateSaveModalOpen, setIsTemplateSaveModalOpen] = useState(false);
  const { saveTemplate, drafts, saveDraft, templates } = useTemplateStore();
  const [isManualEdit, setIsManualEdit] = useState(false);
  const [hasEditedManually, setHasEditedManually] = useState(false);
  const [isGithubModalOpen, setIsGithubModalOpen] = useState(false);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [activeInsertBlockId, setActiveInsertBlockId] = useState<string | null>(null);
  const [activeActionsBlockId, setActiveActionsBlockId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [configEditorOpen, setConfigEditorOpen] = useState<'sidebarItems' | 'kpiWidgets' | 'workflowSteps' | null>(null);

  // AI Copilot Side-Drawer States
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(true);
  const [showPropertiesPanel, setShowPropertiesPanel] = useState(true);
  const [copilotInput, setCopilotInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{ sender: 'user' | 'ai'; text: string; id: string }[]>([
    { sender: 'ai', text: 'Hello! I am your DocForge AI writing assistant. Ask me to draft paragraphs, refine highlighted sections, or generate outlines.', id: 'welcome' }
  ]);
  const [aiLoading, setAiLoading] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  const [docType, setDocType] = useState('custom');
  const [activeBrdTab, setActiveBrdTab] = useState('executive');
  const [activeFrdTab, setActiveFrdTab] = useState('overview');
  const [activeSrsTab, setActiveSrsTab] = useState('overview');
  const [activeTddTab, setActiveTddTab] = useState('overview');
  const [activeSprintTab, setActiveSprintTab] = useState('sprint-overview');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedProjs = JSON.parse(localStorage.getItem('docforge_projects') || '[]');
      setProjects(savedProjs);
    }
  }, []);

  const handleCallCopilotAI = async (inputText?: string) => {
    const queryText = inputText || copilotInput;
    if (!queryText.trim()) return;

    // Add user message to history
    const userMessageId = Math.random().toString(36).substring(2, 9);
    setChatHistory(prev => [...prev, { sender: 'user', text: queryText, id: userMessageId }]);
    if (!inputText) setCopilotInput('');
    setAiLoading(true);

    const allowedDocs = activeWorkspace ? WorkspaceRegistry[activeWorkspace.type]?.allowedDocuments?.join(', ') : 'any';
    const systemContext = activeWorkspace 
      ? `[WORKSPACE CONTEXT: You are operating in the "${activeWorkspace.name}" workspace. Workspace Type: ${activeWorkspace.type}. You MUST generate content appropriate for this workspace. ALLOWED DOCUMENT TYPES: ${allowedDocs}. DO NOT generate BRD or Business Analysis content unless explicitly in the business_analysis workspace. Focus your responses and generation specifically on this domain. ${activeWorkspace.description}]\n\n`
      : '';

    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: systemContext + queryText,
          options: {
            temperature: 0.8,
            maxOutputTokens: 400
          }
        }),
      });

      const resJson = await response.json();
      const responseText = resJson.success 
        ? (resJson.data?.data?.output || resJson.data?.data?.text || "No response received.")
        : `Error calling agent: ${resJson.message || 'Unknown server error.'}`;

      setChatHistory(prev => [...prev, { sender: 'ai', text: responseText, id: Math.random().toString(36).substring(2, 9) }]);
    } catch (err: any) {
      setChatHistory(prev => [...prev, { sender: 'ai', text: `Failed to connect to agent: ${err.message}`, id: Math.random().toString(36).substring(2, 9) }]);
    } finally {
      setAiLoading(false);
    }
  };

  // Generate dynamic metrics based on canvas content
  const documentMetrics = extractDocumentMetrics(blocks);

  const insertTextAsBlock = (text: string) => {
    pushStateToHistory(blocks, documentTitle);
    const newBlock: CustomBlock = {
      id: Math.random().toString(36).substring(2, 9),
      type: 'textarea',
      label: '',
      value: text
    };
    setBlocks([...blocks, newBlock]);
    alert("AI draft inserted at the bottom of the canvas!");
  };

  const replaceActiveBlockWithText = (text: string) => {
    if (activeActionsBlockId) {
      pushStateToHistory(blocks, documentTitle);
      setBlocks(blocks.map(b => b.id === activeActionsBlockId ? { ...b, value: text } : b));
      setActiveActionsBlockId(null);
      alert("Selected block content replaced with AI draft!");
    } else if (blocks.length > 0) {
      pushStateToHistory(blocks, documentTitle);
      const lastBlock = blocks[blocks.length - 1];
      setBlocks(blocks.map(b => b.id === lastBlock.id ? { ...b, value: text } : b));
      alert("Last block content replaced with AI draft!");
    } else {
      insertTextAsBlock(text);
    }
  };

  // Subpage Workspace Navigation States
  const [currentPageId, setCurrentPageId] = useState<string | null>(null);
  const [rootBlocks, setRootBlocks] = useState<CustomBlock[] | null>(null);
  const [navigationStack, setNavigationStack] = useState<{ id: string; title: string }[]>([]);

  // Undo/Redo History States
  interface HistoryState {
    blocks: CustomBlock[];
    title: string;
  }
  const [past, setPast] = useState<HistoryState[]>([]);
  const [future, setFuture] = useState<HistoryState[]>([]);

  const pushStateToHistory = (currentBlocks: CustomBlock[], currentTitle: string) => {
    setPast(prev => [...prev.slice(-49), { blocks: currentBlocks, title: currentTitle }]);
    setFuture([]);
  };

  const undo = () => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    
    setFuture(prev => [{ blocks, title: documentTitle }, ...prev]);
    setPast(newPast);
    
    setBlocks(previous.blocks);
    setDocumentTitle(previous.title);
  };

  const redo = () => {
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);
    
    setPast(prev => [...prev, { blocks, title: documentTitle }]);
    setFuture(newFuture);
    
    setBlocks(next.blocks);
    setDocumentTitle(next.title);
  };

  // Keyboard listeners for Ctrl+Z and Ctrl+Y
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' || e.key === 'Z') {
          e.preventDefault();
          undo();
        } else if (e.key === 'y' || e.key === 'Y') {
          e.preventDefault();
          redo();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [past, future, blocks, documentTitle]);

  useEffect(() => {
    if (loadedId) {
      setDocumentId(loadedId);

      const isBuilderParam = searchParams.get('isBuilder') === 'true';

      if (isBuilderParam) {
        // We are editing a Template from Template Setup
        const template = templates.find((t: any) => t.id === loadedId);
        if (template) {
          setIsTemplate(true);
          setIsTemplateBuilder(true);
          setDocumentTitle(template.name);
          setDocType(template.id);
          setActiveView('canvas'); // Template builder strictly edits canvas structure
          
          if (template.blocks && template.blocks.length > 0) {
            setBlocks(template.blocks as CustomBlock[]);
          }
          setIsLoaded(true);
          return; // Skip standard document loading
        }
      }

      // Try to load pre-assigned project and docType from dashboard metadata list
      try {
        const metaList = JSON.parse(localStorage.getItem('docforge_docs_meta') || '[]');
        const meta = metaList.find((m: any) => m.id === loadedId);
        if (meta) {
          if (meta.projectId) {
            setSelectedProjectId(String(meta.projectId));
          }
          if (meta.type) {
            setDocType(meta.type);

          }
          if (meta.isTemplate) {
            setIsTemplate(true);
          }
          if (meta.isTemplateBuilder) {
            setIsTemplateBuilder(true);
          }
        }
      } catch (e) {}

      const savedDoc = getSavedDocument(loadedId);
      let initialBlocksData: any[] = [];
      let docTitle = 'My Custom Document';

      if (savedDoc) {
        docTitle = savedDoc.title;
        initialBlocksData = savedDoc.data || [];
        if (savedDoc.projectId) {
          setSelectedProjectId(String(savedDoc.projectId));
        }
        if (savedDoc.templateId) {
          setDocType(savedDoc.templateId);
        }
      } else {
        // Fallback for new documents created from templates
        const storedRoot = localStorage.getItem(`doc_root_${loadedId}`);
        if (storedRoot) {
          try {
            initialBlocksData = JSON.parse(storedRoot);
          } catch (e) {
            console.error('Failed to parse doc_root', e);
          }
        }
        
        // Find title from docforge_docs_meta
        try {
          const metaList = JSON.parse(localStorage.getItem('docforge_docs_meta') || '[]');
          const meta = metaList.find((m: any) => m.id === loadedId);
          if (meta) {
            docTitle = meta.title;
          }
        } catch (e) {
          console.error('Failed to parse metaList', e);
        }
      }

      if (initialBlocksData.length > 0) {
        setDocumentTitle(docTitle);
        // Dynamically strip out any legacy boilerplate default placeholders from saved data
        const cleanedBlocks = initialBlocksData.map((block: any) => {
          let val = block.value || '';
          if (
            val === 'Click here to write paragraph content...' ||
            val === 'New Heading' ||
            val === 'Type text here...' ||
            val === 'Item 1\nItem 2' ||
            val === 'First Item\nSecond Item' ||
            val === 'Task 1\nTask 2' ||
            val === 'Inspiring quote...' ||
            val === 'This is a callout box' ||
            val === '// Code goes here' ||
            val === 'Collapsible content goes here...' ||
            val === '/subpage-slug' ||
            val === 'Collapsible toggle list content...' ||
            val === 'f(x) = \int_{-\infty}^{\infty} e^{-x^2} dx' ||
            val === 'This text block content is synced in real-time across pages.'
          ) {
            val = '';
          }
          let lbl = block.label || '';
          if (
            lbl === 'Paragraph Title' ||
            lbl === 'Paragraph Label' ||
            lbl === 'Field Label' ||
            lbl === 'Bulleted List Title' ||
            lbl === 'Numbered List Title' ||
            lbl === 'To-do List Title' ||
            lbl === 'Toggle Heading text' ||
            lbl === 'Toggle List text' ||
            lbl === 'Author' ||
            lbl === '💡 Info' ||
            lbl === 'javascript' ||
            lbl === 'Block Equation' ||
            lbl === '📁 New Subpage' ||
            lbl === '🔄 Synced Block'
          ) {
            lbl = '';
          }
          return {
            ...block,
            value: val,
            label: lbl
          };
        });
        setBlocks(cleanedBlocks);
      }
      setIsLoaded(true);
    }
  }, [loadedId]);

  useEffect(() => {
    if (blocks.length === 0 && (!loadedId || isLoaded)) {
      const initialBlock: CustomBlock = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'textarea',
        label: '',
        value: '',
        headingLevel: '2'
      };
      setBlocks([initialBlock]);
    }
  }, [blocks, loadedId, isLoaded]);

  const generateMarkdown = () => generateCustomMarkdown(documentTitle, blocks);

  useEffect(() => {
    if (!isManualEdit && !hasEditedManually) {
      setMarkdown(generateMarkdown());
    }
  }, [blocks, documentTitle, isManualEdit, hasEditedManually]);

  const createBlockObject = (type: BlockType, headingLevel?: string): CustomBlock => {
    const id = Math.random().toString(36).substr(2, 9);
    let initialValue = '';
    if (type === 'table') {
      initialValue = JSON.stringify([["Header 1", "Header 2"], ["Data 1", "Data 2"]]);
    }
    
    return { 
      id, 
      type, 
      label: '', 
      value: initialValue, 
      headingLevel: headingLevel || '2', 
      toggleCollapsed: (type === 'toggle-header' || type === 'toggle-list') ? true : undefined 
    };
  };

  const addBlock = (type: BlockType, headingLevel?: string) => {
    pushStateToHistory(blocks, documentTitle);
    const newBlock = createBlockObject(type, headingLevel);
    setBlocks([...blocks, newBlock]);
  };

  const insertBlockAfter = (blockId: string, type: BlockType, headingLevel?: string) => {
    const targetIndex = blocks.findIndex(b => b.id === blockId);
    if (targetIndex === -1) return;
    
    pushStateToHistory(blocks, documentTitle);
    const newBlock = createBlockObject(type, headingLevel);
    const newBlocks = [...blocks];
    newBlocks.splice(targetIndex + 1, 0, newBlock);
    setBlocks(newBlocks);
    setActiveInsertBlockId(null);
  };

  const removeBlock = (id: string) => {
    pushStateToHistory(blocks, documentTitle);
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const updateBlock = (id: string, field: keyof CustomBlock, val: any) => {
    pushStateToHistory(blocks, documentTitle);
    setBlocks(blocks.map(b => b.id === id ? { ...b, [field]: val } : b));
  };

  useEffect(() => {
    if (blockToFocus) {
      const el = document.getElementById(`block-editable-${blockToFocus}`);
      if (el) {
        el.focus();
        
        // Move selection/caret to the very end of the contentEditable element
        try {
          const range = document.createRange();
          const sel = window.getSelection();
          range.selectNodeContents(el);
          range.collapse(false); // false collapses range to end
          sel?.removeAllRanges();
          sel?.addRange(range);
        } catch (err) {
          console.warn("Failed to set caret focus range:", err);
        }
      }
      setBlockToFocus(null);
    }
  }, [blockToFocus, blocks]);

  const handleBlockKeyDown = (
    e: React.KeyboardEvent<any>, 
    block: CustomBlock, 
    index: number
  ) => {
    // 1. Enter key pressed (without shift) -> Insert paragraph block below
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      pushStateToHistory(blocks, documentTitle);
      
      const selection = window.getSelection();
      const caretOffset = selection ? selection.anchorOffset : 0;
      const fullText = e.currentTarget.innerText || '';
      
      const textBefore = fullText.slice(0, caretOffset);
      const textAfter = fullText.slice(caretOffset);
      
      // Update the current block's content
      const updatedBlocks = blocks.map(b => b.id === block.id ? { ...b, value: textBefore } : b);
      
      // Keep the same list block type if within a list to preserve fluid bullet/numbered list creation!
      const newType = (block.type === 'bulleted-list' || block.type === 'numbered-list' || block.type === 'todo-list') 
        ? block.type 
        : 'textarea';
        
      const newBlock = createBlockObject(newType);
      
      // Initialize prefix if list item
      if (newType === 'bulleted-list') newBlock.value = '• ' + textAfter.replace(/^•\s*/, '');
      else if (newType === 'numbered-list') newBlock.value = `${index + 2}. ` + textAfter.replace(/^\d+\.\s*/, '');
      else if (newType === 'todo-list') newBlock.value = '☐ ' + textAfter.replace(/^☐\s*/, '');
      else newBlock.value = textAfter;
      
      const finalBlocks = [...updatedBlocks];
      finalBlocks.splice(index + 1, 0, newBlock);
      
      setBlocks(finalBlocks);
      setBlockToFocus(newBlock.id);
    }
    
    // 2. Backspace pressed at the beginning -> Merge blocks or clear list format
    else if (e.key === 'Backspace') {
      const selection = window.getSelection();
      const caretOffset = selection ? selection.anchorOffset : 0;
      const text = e.currentTarget.innerText || '';
      let isAtStart = caretOffset === 0;
      
      const listPrefixRegex = /^(•\s*|\d+\.\s*|☐\s*)/;
      const match = text.match(listPrefixRegex);
      if (match && caretOffset <= match[0].length) {
        isAtStart = true;
      }
      
      if (isAtStart) {
        e.preventDefault();
        
        // If bullet list item, backspace clears list format first, turning it into standard paragraph!
        if (match && (block.type === 'bulleted-list' || block.type === 'numbered-list' || block.type === 'todo-list')) {
          pushStateToHistory(blocks, documentTitle);
          const cleanedText = text.replace(listPrefixRegex, '');
          setBlocks(blocks.map(b => b.id === block.id ? { ...b, type: 'textarea' as BlockType, value: cleanedText } : b));
          setBlockToFocus(block.id);
          return;
        }
        
        // Otherwise, merge with the block directly above it
        if (index > 0) {
          pushStateToHistory(blocks, documentTitle);
          const prevBlock = blocks[index - 1];
          
          const updatedBlocks = blocks.map(b => {
            if (b.id === prevBlock.id) {
              return { ...b, value: (b.value || '') + text };
            }
            return b;
          });
          
          const finalBlocks = updatedBlocks.filter(b => b.id !== block.id);
          setBlocks(finalBlocks);
          setBlockToFocus(prevBlock.id);
        }
      }
    }
  };

  const moveBlockUp = (index: number) => {
    if (index === 0) return;
    pushStateToHistory(blocks, documentTitle);
    const newBlocks = [...blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[index - 1];
    newBlocks[index - 1] = temp;
    setBlocks(newBlocks);
  };

  const moveBlockDown = (index: number) => {
    if (index === blocks.length - 1) return;
    pushStateToHistory(blocks, documentTitle);
    const newBlocks = [...blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[index + 1];
    newBlocks[index + 1] = temp;
    setBlocks(newBlocks);
  };

  const handleSave = () => {
    setSaveStatus('Saving...');
    
    // Determine word count and AI generation status for metadata
    const contentString = blocks.map(b => b.value || '').join(' ');
    const wordCount = contentString.trim().split(/\s+/).length;
    const isAiGenerated = contentString.includes('AI') || chatHistory.length > 1;

    saveDocument({
      id: documentId,
      title: documentTitle || 'Untitled Custom Document',
      templateId: docType,
      updatedAt: new Date().toISOString(),
      data: blocks,
      projectId: selectedProjectId || undefined,
      status: 'Draft',
      wordCount,
      isAiGenerated
    });
    
    // Bidirectionally update dashboard metadata
    try {
      const metaList = JSON.parse(localStorage.getItem('docforge_docs_meta') || '[]');
      const existingMetaIndex = metaList.findIndex((m: any) => m.id === documentId);
      
      const newMeta = {
        id: documentId,
        title: documentTitle || 'Untitled Custom Document',
        projectId: selectedProjectId || undefined,
        type: docType,
        isTemplate: isTemplate,
        isTemplateBuilder: isTemplateBuilder
      };

      if (existingMetaIndex >= 0) {
        metaList[existingMetaIndex] = { ...metaList[existingMetaIndex], ...newMeta };
      } else {
        metaList.push(newMeta);
      }
      localStorage.setItem('docforge_docs_meta', JSON.stringify(metaList));
    } catch (e) {}

    if (isTemplateBuilder) {
      saveTemplate(documentId, blocks, false, "Auto-saved in template editor");
    }

    setSaveStatus('Saved');
    setTimeout(() => {
      setSaveStatus('');
    }, 2000);
    
    if (!loadedId) {
      router.replace(`/?tab=builder&id=${documentId}`);
    }
  };

  // Autosave Hook
  useEffect(() => {
    if (!isLoaded || blocks.length === 0) return;
    
    setSaveStatus('Saving...');
    const debounceTimer = setTimeout(() => {
      handleSave();
    }, 2000);

    return () => clearTimeout(debounceTimer);
  }, [blocks, documentTitle, docType, isLoaded]);

  const renderBlockOptionsPopover = (block: CustomBlock, index: number) => {
    const colorChoices = [
      { name: 'Default', val: '' },
      { name: 'Sky Blue', val: '#0284c7' },
      { name: 'Deep Red', val: '#ef4444' },
      { name: 'Mint Green', val: '#10b981' },
      { name: 'Amber Yellow', val: '#f59e0b' },
      { name: 'Slate Gray', val: '#64748b' }
    ];

    const bgChoices = [
      { name: 'Default', val: '' },
      { name: 'Sky Light', val: 'rgba(2, 132, 199, 0.08)' },
      { name: 'Red Light', val: 'rgba(239, 68, 68, 0.08)' },
      { name: 'Green Light', val: 'rgba(16, 185, 129, 0.08)' },
      { name: 'Amber Light', val: 'rgba(245, 158, 11, 0.08)' },
      { name: 'Slate Light', val: 'rgba(100, 116, 139, 0.08)' }
    ];

    return (
      <div className="notion-dropdown" style={{ width: '270px', maxHeight: '480px', overflowY: 'auto' }}>
        <div className="notion-dropdown-header">Actions</div>
        <div className="notion-dropdown-row" style={{ padding: '0.25rem 1rem 0.5rem 1rem' }}>
          <div style={{ display: 'flex', width: '100%', gap: '0.4rem' }}>
            <button 
              type="button"
              className="notion-dropdown-btn-option" 
              disabled={index === 0}
              onClick={() => { moveBlockUp(index); setActiveActionsBlockId(null); }}
              style={{ 
                flex: 1, 
                padding: '0.35rem', 
                fontSize: '0.75rem', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '0.25rem',
                border: '1px solid var(--border)',
                background: 'var(--background)',
                borderRadius: '6px',
                cursor: index === 0 ? 'not-allowed' : 'pointer',
                opacity: index === 0 ? 0.4 : 1,
                color: 'var(--primary)',
                fontWeight: 600
              }}
              title="Move Up"
            >
              <span>⬆️</span> <span>Up</span>
            </button>
            
            <button 
              type="button"
              className="notion-dropdown-btn-option" 
              disabled={index === blocks.length - 1}
              onClick={() => { moveBlockDown(index); setActiveActionsBlockId(null); }}
              style={{ 
                flex: 1, 
                padding: '0.35rem', 
                fontSize: '0.75rem', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '0.25rem',
                border: '1px solid var(--border)',
                background: 'var(--background)',
                borderRadius: '6px',
                cursor: index === blocks.length - 1 ? 'not-allowed' : 'pointer',
                opacity: index === blocks.length - 1 ? 0.4 : 1,
                color: 'var(--primary)',
                fontWeight: 600
              }}
              title="Move Down"
            >
              <span>⬇️</span> <span>Down</span>
            </button>
            
            <button 
              type="button"
              className="notion-dropdown-btn-option" 
              onClick={() => { removeBlock(block.id); setActiveActionsBlockId(null); }}
              style={{ 
                flex: 1.2, 
                padding: '0.35rem', 
                fontSize: '0.75rem', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '0.25rem',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                background: 'rgba(239, 68, 68, 0.05)',
                color: '#ef4444',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600
              }}
              title="Delete Block"
            >
              <span>🗑️</span> <span>Delete</span>
            </button>
          </div>
        </div>

        {/* Dynamic Formatting Styles */}
        <div className="notion-dropdown-header" style={{ marginTop: '0.5rem', borderTop: '1px solid var(--border)', paddingTop: '0.5rem' }}>Text Size</div>
        <div className="notion-dropdown-row">
          <div className="notion-dropdown-btn-group">
            {([
              { label: 'Def', val: '' },
              { label: 'Sm', val: '12px' },
              { label: 'Md', val: '16px' },
              { label: 'Lg', val: '24px' },
              { label: 'XL', val: '32px' }
            ]).map(sz => (
              <button
                key={sz.label}
                className={`notion-dropdown-btn-option ${block.fontSize === sz.val || (!block.fontSize && sz.val === '') ? 'active' : ''}`}
                onClick={() => updateBlock(block.id, 'fontSize', sz.val)}
              >
                {sz.label}
              </button>
            ))}
          </div>
        </div>

        <div className="notion-dropdown-header" style={{ marginTop: '0.25rem' }}>Alignment</div>
        <div className="notion-dropdown-row">
          <div className="notion-dropdown-btn-group">
            {([
              { label: 'Def', val: '' },
              { label: 'Left', val: 'left' },
              { label: 'Center', val: 'center' },
              { label: 'Right', val: 'right' }
            ]).map(al => (
              <button
                key={al.label}
                className={`notion-dropdown-btn-option ${block.align === al.val || (!block.align && al.val === '') ? 'active' : ''}`}
                onClick={() => updateBlock(block.id, 'align', al.val)}
              >
                {al.label}
              </button>
            ))}
          </div>
        </div>

        <div className="notion-dropdown-header" style={{ marginTop: '0.25rem' }}>Text Color</div>
        <div className="color-palette-grid">
          {colorChoices.map(c => (
            <div
              key={c.name}
              className={`color-palette-dot ${block.color === c.val || (!block.color && c.val === '') ? 'active' : ''}`}
              style={{ backgroundColor: c.val || 'var(--text-main)', border: c.val ? 'none' : '1px solid var(--border)' }}
              title={c.name}
              onClick={() => updateBlock(block.id, 'color', c.val)}
            />
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 1rem 0.5rem 1rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Custom:</span>
          <input 
            type="color" 
            value={block.color || '#000000'} 
            onChange={(e) => updateBlock(block.id, 'color', e.target.value)}
            style={{ width: '28px', height: '24px', border: '1px solid var(--border)', borderRadius: '4px', cursor: 'pointer', padding: 0, background: 'transparent' }}
            title="Choose custom text color"
          />
          {block.color && (
            <button 
              onClick={() => updateBlock(block.id, 'color', '')} 
              style={{ fontSize: '0.75rem', color: '#ef4444', border: 'none', background: 'transparent', cursor: 'pointer', padding: 0 }}
            >
              Reset
            </button>
          )}
        </div>

        <div className="notion-dropdown-header" style={{ marginTop: '0.25rem' }}>Background Color</div>
        <div className="color-palette-grid">
          {bgChoices.map(bg => (
            <div
              key={bg.name}
              className={`color-palette-dot ${block.backgroundColor === bg.val || (!block.backgroundColor && bg.val === '') ? 'active' : ''}`}
              style={{ backgroundColor: bg.val || 'var(--surface)', border: bg.val ? 'none' : '1px solid var(--border)' }}
              title={bg.name}
              onClick={() => updateBlock(block.id, 'backgroundColor', bg.val)}
            />
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 1rem 0.5rem 1rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Custom:</span>
          <input 
            type="color" 
            value={block.backgroundColor || 'var(--surface)'} 
            onChange={(e) => updateBlock(block.id, 'backgroundColor', e.target.value)}
            style={{ width: '28px', height: '24px', border: '1px solid var(--border)', borderRadius: '4px', cursor: 'pointer', padding: 0, background: 'transparent' }}
            title="Choose custom background color"
          />
          {block.backgroundColor && (
            <button 
              onClick={() => updateBlock(block.id, 'backgroundColor', '')} 
              style={{ fontSize: '0.75rem', color: '#ef4444', border: 'none', background: 'transparent', cursor: 'pointer', padding: 0 }}
            >
              Reset
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderInteractivePreview = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
        {/* Popover Close Overlay */}
        {(activeInsertBlockId || activeActionsBlockId) && (
          <div 
            onClick={() => { setActiveInsertBlockId(null); setActiveActionsBlockId(null); }} 
            style={{ position: 'fixed', inset: 0, zIndex: 15, cursor: 'default' }} 
          />
        )}

        {/* Editable Inline Document/Subpage Title */}
        {currentPageId ? (
          <h1
            contentEditable
            suppressContentEditableWarning
            onBlur={e => {
              const newTitle = e.currentTarget.textContent || 'Untitled Subpage';
              
              // 1. Update active stack representation
              setNavigationStack(navigationStack.map(n => n.id === currentPageId ? { ...n, title: newTitle } : n));
              localStorage.setItem(`doc_subpage_title_${currentPageId}`, newTitle);
              
              // 2. Bidirectionally update parent block reference so it looks perfect!
              if (rootBlocks) {
                const updatedRoot = rootBlocks.map(b => b.id === currentPageId ? { ...b, value: newTitle } : b);
                setRootBlocks(updatedRoot);
                localStorage.setItem(`doc_root_${documentId}`, JSON.stringify(updatedRoot));
              }
            }}
            style={{ 
              fontSize: '2.5rem', 
              fontWeight: 800, 
              marginBottom: '2rem', 
              borderBottom: '2px solid var(--border)', 
              paddingBottom: '0.75rem',
              outline: 'none',
              color: 'var(--text-main)'
            }}
          >
            {navigationStack[navigationStack.length - 1]?.title || 'Untitled Subpage'}
          </h1>
        ) : (
          <h1
            contentEditable
            suppressContentEditableWarning
            onBlur={e => setDocumentTitle(e.currentTarget.textContent || 'Untitled Custom Document')}
            style={{ 
              fontSize: '2.5rem', 
              fontWeight: 800, 
              marginBottom: '2rem', 
              borderBottom: '2px solid var(--border)', 
              paddingBottom: '0.75rem',
              outline: 'none',
              color: 'var(--text-main)'
            }}
          >
            {documentTitle || 'Untitled Custom Document'}
          </h1>
        )}
        
        {blocks.map((block, index) => {
          const styles: React.CSSProperties = {
            fontSize: block.fontSize || undefined,
            color: block.color || undefined,
            textAlign: (block.align as any) || undefined
          };

          let blockEl: React.ReactNode = null;

          if (block.type === 'header') {
            const level = block.headingLevel || '2';
            const commonProps = {
              id: `block-editable-${block.id}`,
              contentEditable: true,
              suppressContentEditableWarning: true,
              onBlur: (e: any) => updateBlock(block.id, 'value', e.currentTarget.textContent || ''),
              onKeyDown: (e: any) => handleBlockKeyDown(e, block, index),
              style: {
                ...styles,
                outline: 'none',
                cursor: 'text',
                borderBottom: '1px dashed transparent',
                paddingBottom: '0.25rem',
                margin: 0
              },
              onFocus: (e: any) => { e.currentTarget.style.borderBottomColor = 'var(--primary)'; },
              onBlurCapture: (e: any) => { e.currentTarget.style.borderBottomColor = 'transparent'; }
            };

            blockEl = (
              <div style={{ position: 'relative' }}>
                {level === '1' && <h1 {...commonProps}>{block.value || 'New Heading'}</h1>}
                {level === '2' && <h2 {...commonProps}>{block.value || 'New Heading'}</h2>}
                {level === '3' && <h3 {...commonProps}>{block.value || 'New Heading'}</h3>}
                {level === '4' && <h4 {...commonProps}>{block.value || 'New Heading'}</h4>}
              </div>
            );
          }

          else if (block.type === 'text') {
            blockEl = (
              <div
                id={`block-editable-${block.id}`}
                contentEditable
                suppressContentEditableWarning
                onBlur={e => updateBlock(block.id, 'value', e.currentTarget.innerText || '')}
                onKeyDown={e => handleBlockKeyDown(e, block, index)}
                style={{ 
                  ...styles,
                  outline: 'none', 
                  cursor: 'text', 
                  whiteSpace: 'pre-wrap',
                  minHeight: '1.5rem',
                  lineHeight: '1.6'
                }}
              >
                {block.value || ''}
              </div>
            );
          }

          else if (block.type === 'textarea') {
            blockEl = (
              <div
                id={`block-editable-${block.id}`}
                contentEditable
                suppressContentEditableWarning
                onBlur={e => updateBlock(block.id, 'value', e.currentTarget.innerText || '')}
                onKeyDown={e => handleBlockKeyDown(e, block, index)}
                style={{ 
                  ...styles,
                  outline: 'none', 
                  cursor: 'text', 
                  whiteSpace: 'pre-wrap',
                  minHeight: '1.5rem',
                  lineHeight: '1.6'
                }}
              >
                {block.value || ''}
              </div>
            );
          }

          else if (block.type === 'bulleted-list') {
            blockEl = (
              <div style={{ ...styles, paddingLeft: '1.25rem' }}>
                <div
                  id={`block-editable-${block.id}`}
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={e => updateBlock(block.id, 'value', e.currentTarget.innerText || '')}
                  onKeyDown={e => handleBlockKeyDown(e, block, index)}
                  style={{ 
                    outline: 'none', 
                    cursor: 'text', 
                    whiteSpace: 'pre-wrap',
                    lineHeight: '1.6'
                  }}
                >
                  {block.value || '• '}
                </div>
              </div>
            );
          }

          else if (block.type === 'numbered-list') {
            blockEl = (
              <div style={{ ...styles, paddingLeft: '1.25rem' }}>
                <div
                  id={`block-editable-${block.id}`}
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={e => updateBlock(block.id, 'value', e.currentTarget.innerText || '')}
                  onKeyDown={e => handleBlockKeyDown(e, block, index)}
                  style={{ 
                    outline: 'none', 
                    cursor: 'text', 
                    whiteSpace: 'pre-wrap',
                    lineHeight: '1.6'
                  }}
                >
                  {block.value || `${index + 1}. `}
                </div>
              </div>
            );
          }

          else if (block.type === 'todo-list') {
            blockEl = (
              <div style={{ ...styles, paddingLeft: '1.25rem' }}>
                <div
                  id={`block-editable-${block.id}`}
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={e => updateBlock(block.id, 'value', e.currentTarget.innerText || '')}
                  onKeyDown={e => handleBlockKeyDown(e, block, index)}
                  style={{ 
                    outline: 'none', 
                    cursor: 'text', 
                    whiteSpace: 'pre-wrap',
                    lineHeight: '1.6'
                  }}
                >
                  {block.value || '☐ '}
                </div>
              </div>
            );
          }

          else if (block.type === 'quote') {
            blockEl = (
              <blockquote style={{ 
                ...styles, 
                borderLeft: '4px solid var(--border)', 
                paddingLeft: '1rem', 
                margin: '1rem 0', 
                fontStyle: 'italic' 
              }}>
                <div
                  id={`block-editable-${block.id}`}
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={e => updateBlock(block.id, 'value', e.currentTarget.innerText || '')}
                  onKeyDown={e => handleBlockKeyDown(e, block, index)}
                  style={{ outline: 'none', cursor: 'text', minHeight: '1.5rem' }}
                >
                  {block.value || ''}
                </div>
              </blockquote>
            );
          }

          else if (block.type === 'callout') {
            blockEl = (
              <div style={{ 
                ...styles,
                padding: '1rem', 
                border: '1px solid var(--border)', 
                borderLeft: '4px solid var(--primary)', 
                borderRadius: '6px', 
                background: 'rgba(2, 132, 199, 0.03)', 
                margin: '1rem 0'
              }}>
                <div
                  id={`block-editable-${block.id}`}
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={e => updateBlock(block.id, 'value', e.currentTarget.innerText || '')}
                  onKeyDown={e => handleBlockKeyDown(e, block, index)}
                  style={{ outline: 'none', cursor: 'text', minHeight: '1.5rem' }}
                >
                  {block.value || ''}
                </div>
              </div>
            );
          }

          else if (block.type === 'code') {
            blockEl = (
              <div style={{ ...styles, margin: '1rem 0' }}>
                <pre style={{ 
                  background: 'rgba(0,0,0,0.03)', 
                  padding: '1rem', 
                  borderRadius: '6px', 
                  border: '1px solid var(--border)',
                  fontFamily: 'monospace',
                  overflowX: 'auto'
                }}>
                  <code
                    id={`block-editable-${block.id}`}
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={e => updateBlock(block.id, 'value', e.currentTarget.innerText || '')}
                    onKeyDown={e => handleBlockKeyDown(e, block, index)}
                    style={{ outline: 'none', cursor: 'text', display: 'block', width: '100%', minHeight: '1.5rem' }}
                  >
                    {block.value || ''}
                  </code>
                </pre>
              </div>
            );
          }

          else if (block.type === 'table') {
            let grid: string[][] = [["Header 1", "Header 2"], ["Data 1", "Data 2"]];
            try {
              if (block.value) {
                grid = JSON.parse(block.value);
              }
            } catch (err) {
              console.warn("Failed to parse table value:", err);
            }
            const maxCols = Math.max(1, ...grid.map(row => row.length));
            grid = grid.map(row => [...row, ...Array(Math.max(0, maxCols - row.length)).fill("")]);

            const updateTableCell = (rIdx: number, cIdx: number, val: string) => {
              const newGrid = grid.map((row, r) => 
                row.map((cell, c) => (r === rIdx && c === cIdx) ? val : cell)
              );
              updateBlock(block.id, 'value', JSON.stringify(newGrid));
            };

            const addRow = () => {
              const colsCount = grid[0]?.length || 2;
              const newRow = Array(colsCount).fill("");
              const newGrid = [...grid, newRow];
              updateBlock(block.id, 'value', JSON.stringify(newGrid));
            };

            const addColumn = () => {
              const newGrid = grid.map(row => [...row, ""]);
              updateBlock(block.id, 'value', JSON.stringify(newGrid));
            };

            const deleteRow = (rIdx: number) => {
              if (grid.length <= 1) return;
              const newGrid = grid.filter((_, r) => r !== rIdx);
              updateBlock(block.id, 'value', JSON.stringify(newGrid));
            };

            const deleteColumn = (cIdx: number) => {
              if (grid[0]?.length <= 1) return;
              const newGrid = grid.map(row => row.filter((_, c) => c !== cIdx));
              updateBlock(block.id, 'value', JSON.stringify(newGrid));
            };

            const tableControlStyle: React.CSSProperties = {
              minWidth: '26px',
              height: '26px',
              padding: 0,
              borderRadius: '6px',
              fontSize: '1rem',
              fontWeight: 800,
              lineHeight: 1
            };

            blockEl = (
              <div style={{ ...styles, margin: '1rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'none', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', fontSize: '0.75rem' }}>
                  <button 
                    onClick={addRow} 
                    className="btn btn-secondary" 
                    style={{ padding: '2px 8px', fontSize: '0.75rem', height: '24px', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    ➕ Row
                  </button>
                  <button 
                    onClick={addColumn} 
                    className="btn btn-secondary" 
                    style={{ padding: '2px 8px', fontSize: '0.75rem', height: '24px', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    ➕ Column
                  </button>
                  <button 
                    onClick={() => deleteRow(grid.length - 1)} 
                    disabled={grid.length <= 1}
                    className="btn btn-secondary" 
                    style={{ padding: '2px 8px', fontSize: '0.75rem', height: '24px', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', opacity: grid.length <= 1 ? 0.5 : 1 }}
                  >
                    ❌ Row
                  </button>
                  <button 
                    onClick={() => deleteColumn((grid[0]?.length || 1) - 1)} 
                    disabled={(grid[0]?.length || 1) <= 1}
                    className="btn btn-secondary" 
                    style={{ padding: '2px 8px', fontSize: '0.75rem', height: '24px', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', opacity: (grid[0]?.length || 1) <= 1 ? 0.5 : 1 }}
                  >
                    ❌ Column
                  </button>
                </div>

                <div style={{ display: 'none', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', fontSize: '0.75rem' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.35rem', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--surface)' }}>
                    <span style={{ fontWeight: 700, color: 'var(--text-muted)', minWidth: '42px' }}>Row</span>
                    <button
                      onClick={() => deleteRow(grid.length - 1)}
                      disabled={grid.length <= 1}
                      className="btn btn-secondary"
                      title="Remove last row"
                      aria-label="Remove last row"
                      style={{ ...tableControlStyle, opacity: grid.length <= 1 ? 0.45 : 1, cursor: grid.length <= 1 ? 'not-allowed' : 'pointer' }}
                    >
                      -
                    </button>
                    <button
                      onClick={addRow}
                      className="btn btn-secondary"
                      title="Add row"
                      aria-label="Add row"
                      style={tableControlStyle}
                    >
                      +
                    </button>
                  </div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.35rem', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--surface)' }}>
                    <span style={{ fontWeight: 700, color: 'var(--text-muted)', minWidth: '58px' }}>Column</span>
                    <button
                      onClick={() => deleteColumn((grid[0]?.length || 1) - 1)}
                      disabled={(grid[0]?.length || 1) <= 1}
                      className="btn btn-secondary"
                      title="Remove last column"
                      aria-label="Remove last column"
                      style={{ ...tableControlStyle, opacity: (grid[0]?.length || 1) <= 1 ? 0.45 : 1, cursor: (grid[0]?.length || 1) <= 1 ? 'not-allowed' : 'pointer' }}
                    >
                      -
                    </button>
                    <button
                      onClick={addColumn}
                      className="btn btn-secondary"
                      title="Add column"
                      aria-label="Add column"
                      style={tableControlStyle}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.35rem' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: '6px' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                    <thead>
                      <tr>
                        {grid[0]?.map((cell, cIdx) => (
                          <th 
                            key={`th-${cIdx}`} 
                            style={{ 
                              border: '1px solid var(--border)', 
                              padding: '0.5rem 0.75rem', 
                              background: 'rgba(0,0,0,0.02)', 
                              fontWeight: 600, 
                              textAlign: 'left',
                              minWidth: '80px' 
                            }}
                          >
                            <div
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) => updateTableCell(0, cIdx, e.currentTarget.innerText || '')}
                              style={{ outline: 'none', cursor: 'text' }}
                            >
                              {cell}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {grid.slice(1).map((row, rOffset) => {
                        const rIdx = rOffset + 1;
                        return (
                          <tr key={`tr-${rIdx}`}>
                            {row.map((cell, cIdx) => (
                              <td 
                                key={`td-${rIdx}-${cIdx}`} 
                                style={{ 
                                  border: '1px solid var(--border)', 
                                  padding: '0.5rem 0.75rem', 
                                  minWidth: '80px' 
                                }}
                              >
                                <div
                                  contentEditable
                                  suppressContentEditableWarning
                                  onBlur={(e) => updateTableCell(rIdx, cIdx, e.currentTarget.innerText || '')}
                                  style={{ outline: 'none', cursor: 'text' }}
                                >
                                  {cell}
                                </div>
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                      </table>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.3rem', marginTop: '0.35rem' }}>
                      <button
                        onClick={() => deleteRow(grid.length - 1)}
                        disabled={grid.length <= 1}
                        className="btn btn-secondary"
                        title="Remove last row"
                        aria-label="Remove last row"
                        style={{ ...tableControlStyle, opacity: grid.length <= 1 ? 0.45 : 1, cursor: grid.length <= 1 ? 'not-allowed' : 'pointer' }}
                      >
                        -
                      </button>
                      <button
                        onClick={addRow}
                        className="btn btn-secondary"
                        title="Add row"
                        aria-label="Add row"
                        style={tableControlStyle}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', paddingTop: '0.1rem' }}>
                    <button
                      onClick={() => deleteColumn((grid[0]?.length || 1) - 1)}
                      disabled={(grid[0]?.length || 1) <= 1}
                      className="btn btn-secondary"
                      title="Remove last column"
                      aria-label="Remove last column"
                      style={{ ...tableControlStyle, opacity: (grid[0]?.length || 1) <= 1 ? 0.45 : 1, cursor: (grid[0]?.length || 1) <= 1 ? 'not-allowed' : 'pointer' }}
                    >
                      -
                    </button>
                    <button
                      onClick={addColumn}
                      className="btn btn-secondary"
                      title="Add column"
                      aria-label="Add column"
                      style={tableControlStyle}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            );
          }

          else if (block.type === 'date-time') {
            const formattedDate = block.value ? new Date(block.value).toLocaleString() : 'Click calendar to set date...';
            blockEl = (
              <div style={{ ...styles, margin: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <div style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  padding: '0.4rem 0.8rem', 
                  border: '1px solid var(--border)', 
                  borderRadius: '20px', 
                  background: 'var(--background)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                  fontSize: '0.875rem',
                  color: 'var(--text-main)',
                  fontWeight: 500
                }}>
                  <span>📅</span>
                  <span>{formattedDate}</span>
                </div>
                <input 
                  type="datetime-local" 
                  value={block.value || ''} 
                  onChange={(e) => updateBlock(block.id, 'value', e.target.value)}
                  style={{ 
                    border: '1px solid var(--border)', 
                    borderRadius: '6px', 
                    padding: '0.25rem 0.5rem', 
                    fontSize: '0.875rem', 
                    color: 'var(--text-main)',
                    background: 'var(--background)',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                  title="Choose exact date & time"
                />
              </div>
            );
          }

          else if (block.type === 'toggle-header') {
            const level = block.headingLevel || '2';
            const isCollapsed = block.toggleCollapsed !== false;
            const commonProps = {
              contentEditable: true,
              suppressContentEditableWarning: true,
              onBlur: (e: any) => updateBlock(block.id, 'value', e.currentTarget.textContent || ''),
              style: {
                ...styles,
                outline: 'none',
                cursor: 'text',
                borderBottom: '1px dashed transparent',
                paddingBottom: '0.1rem',
                margin: 0,
                display: 'inline-block',
                flex: 1
              },
              onFocus: (e: any) => { e.currentTarget.style.borderBottomColor = 'var(--primary)'; },
              onBlurCapture: (e: any) => { e.currentTarget.style.borderBottomColor = 'transparent'; }
            };

            const toggleState = () => {
              setBlocks(blocks.map(b => b.id === block.id ? { ...b, toggleCollapsed: !isCollapsed } : b));
            };

            blockEl = (
              <div style={{ ...styles, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    onClick={toggleState}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text-muted)',
                      padding: '0.25rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'transform 0.2s ease',
                      transform: isCollapsed ? 'rotate(0deg)' : 'rotate(90deg)',
                      fontSize: '0.75rem'
                    }}
                  >
                    ▶
                  </button>
                  {level === '1' && <h1 {...commonProps}>{block.value || ''}</h1>}
                  {level === '2' && <h2 {...commonProps}>{block.value || ''}</h2>}
                  {level === '3' && <h3 {...commonProps}>{block.value || ''}</h3>}
                  {level === '4' && <h4 {...commonProps}>{block.value || ''}</h4>}
                </div>
                
                {!isCollapsed && (
                  <div style={{ paddingLeft: '1.75rem', marginTop: '0.25rem' }}>
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={e => updateBlock(block.id, 'label', e.currentTarget.innerText || '')}
                      style={{
                        outline: 'none',
                        cursor: 'text',
                        borderLeft: '2px solid var(--border)',
                        paddingLeft: '0.75rem',
                        whiteSpace: 'pre-wrap',
                        minHeight: '1.5rem',
                        color: 'var(--text-muted)'
                      }}
                    >
                      {block.label || ''}
                    </div>
                  </div>
                )}
              </div>
            );
          }

          else if (block.type === 'file') {
            blockEl = (
              <div style={{ ...styles, margin: '1rem 0' }}>
                {block.fileDataUrl ? (
                  block.fileType?.startsWith('image/') ? (
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <img src={block.fileDataUrl} alt={block.fileName} style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '6px', border: '1px solid var(--border)' }} />
                      <button 
                        onClick={() => setBlocks(blocks.map(b => b.id === block.id ? { ...b, fileName: undefined, fileDataUrl: undefined, fileSize: undefined, fileType: undefined } : b))}
                        style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'rgba(239, 68, 68, 0.9)', color: 'white', border: 'none', borderRadius: '4px', padding: '0.25rem 0.5rem', cursor: 'pointer', fontSize: '0.75rem' }}
                      >
                        Replace Image
                      </button>
                    </div>
                  ) : (
                    <div style={{ padding: '1rem', border: '1px dashed var(--border)', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(0,0,0,0.02)' }}>
                      <span style={{ fontSize: '1.5rem' }}>📎</span>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <a href={block.fileDataUrl} download={block.fileName} style={{ fontWeight: 600, textDecoration: 'underline', color: 'var(--primary)' }}>{block.fileName}</a>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Size: {block.fileSize} - <span style={{ color: 'red', cursor: 'pointer' }} onClick={() => setBlocks(blocks.map(b => b.id === block.id ? { ...b, fileName: undefined, fileDataUrl: undefined, fileSize: undefined, fileType: undefined } : b))}>Remove</span></span>
                      </div>
                    </div>
                  )
                ) : (
                  <div style={{
                    border: '2px dashed var(--border)',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    textAlign: 'center',
                    background: 'rgba(0,0,0,0.02)',
                    cursor: 'pointer',
                    position: 'relative',
                    minHeight: '100px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <input 
                      type="file" 
                      accept="image/*,.avif,.pdf,.doc,.docx,.xls,.xlsx"
                      style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        opacity: 0,
                        cursor: 'pointer',
                        width: '100%',
                        height: '100%'
                      }}
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        
                        if (file.size > 2.5 * 1024 * 1024) {
                          alert("File is too large! Please choose a file smaller than 2.5MB.");
                          return;
                        }
                        
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const sizeInKb = (file.size / 1024).toFixed(1);
                          const sizeStr = file.size > 1024 * 1024 
                            ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
                            : `${sizeInKb} KB`;
                            
                          setBlocks(blocks.map(b => b.id === block.id ? {
                            ...b,
                            fileName: file.name,
                            fileType: file.type || 'application/octet-stream',
                            fileSize: sizeStr,
                            fileDataUrl: reader.result as string,
                            value: file.name
                          } : b));
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                      <span style={{ fontSize: '1.5rem' }}>📤</span>
                      <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Upload Attachment</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Images, PDF, Word, Excel (Max 2.5MB)</span>
                    </div>
                  </div>
                )}
              </div>
            );
          }

          else if (block.type === 'page') {
            blockEl = (
              <div 
                style={{ 
                  ...styles, 
                  padding: '0.75rem 1rem', 
                  border: '1px solid var(--border)', 
                  borderRadius: '8px', 
                  background: 'rgba(2, 132, 199, 0.02)',
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(2, 132, 199, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.02)';
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  // Save parent root blocks first
                  localStorage.setItem(`doc_root_${documentId}`, JSON.stringify(blocks));
                  setRootBlocks(blocks);
                  
                  // Load subpage blocks
                  const subpageId = block.id;
                  const subpageTitle = block.value || 'Untitled Subpage';
                  
                  const stored = localStorage.getItem(`doc_subpage_${subpageId}`);
                  let loadedBlocks: CustomBlock[] = [];
                  if (stored) {
                    try { loadedBlocks = JSON.parse(stored); } catch (err) {}
                  }
                  if (loadedBlocks.length === 0) {
                    loadedBlocks = [{
                      id: Math.random().toString(36).substr(2, 9),
                      type: 'textarea',
                      label: '',
                      value: '',
                      headingLevel: '2'
                    }];
                  }
                  
                  setBlocks(loadedBlocks);
                  setCurrentPageId(subpageId);
                  setNavigationStack([{ id: subpageId, title: subpageTitle }]);
                }}
              >
                <span style={{ fontSize: '1.25rem' }}>📄</span>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <span 
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={e => updateBlock(block.id, 'value', e.currentTarget.textContent || '')}
                    onClick={e => e.stopPropagation()} // Rename without triggering navigation!
                    style={{ fontWeight: 600, outline: 'none', borderBottom: '1px dashed transparent', color: 'var(--text-main)' }}
                    onFocus={e => { e.currentTarget.style.borderBottomColor = 'var(--primary)'; }}
                    onBlurCapture={e => { e.currentTarget.style.borderBottomColor = 'transparent'; }}
                  >
                    {block.value || 'Subpage Title'}
                  </span>
                </div>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>↗</span>
              </div>
            );
          }

          else if (block.type === 'toggle-list') {
            const isCollapsed = block.toggleCollapsed !== false;
            const toggleState = () => {
              setBlocks(blocks.map(b => b.id === block.id ? { ...b, toggleCollapsed: !isCollapsed } : b));
            };

            blockEl = (
              <div style={{ ...styles, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    onClick={toggleState}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text-muted)',
                      padding: '0.25rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'transform 0.2s ease',
                      transform: isCollapsed ? 'rotate(0deg)' : 'rotate(90deg)',
                      fontSize: '0.75rem'
                    }}
                  >
                    ▶
                  </button>
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={e => updateBlock(block.id, 'label', e.currentTarget.textContent || '')}
                    style={{
                      outline: 'none',
                      cursor: 'text',
                      borderBottom: '1px dashed transparent',
                      paddingBottom: '0.1rem',
                      margin: 0,
                      fontSize: '1rem',
                      fontWeight: 400,
                      flex: 1
                    }}
                    onFocus={e => { e.currentTarget.style.borderBottomColor = 'var(--primary)'; }}
                    onBlurCapture={e => { e.currentTarget.style.borderBottomColor = 'transparent'; }}
                  >
                    {block.label || ''}
                  </span>
                </div>
                
                {!isCollapsed && (
                  <div style={{ paddingLeft: '1.75rem', marginTop: '0.25rem' }}>
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={e => updateBlock(block.id, 'value', e.currentTarget.innerText || '')}
                      style={{
                        outline: 'none',
                        cursor: 'text',
                        borderLeft: '2px solid var(--border)',
                        paddingLeft: '0.75rem',
                        whiteSpace: 'pre-wrap',
                        minHeight: '1.5rem',
                        color: 'var(--text-muted)',
                        fontSize: '0.95rem'
                      }}
                    >
                      {block.value || ''}
                    </div>
                  </div>
                )}
              </div>
            );
          }

          else if (block.type === 'equation') {
            blockEl = (
              <div style={{ 
                ...styles, 
                margin: '1rem 0', 
                background: 'rgba(0,0,0,0.01)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '1.5rem 1rem',
                textAlign: 'center',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.01)'
              }}>
                <div style={{ 
                  fontSize: '1.25rem', 
                  fontFamily: 'Georgia, Cambria, "Times New Roman", Times, serif', 
                  fontStyle: 'italic',
                  marginBottom: '0.75rem',
                  padding: '0.5rem',
                  color: 'var(--text-main)',
                  userSelect: 'none'
                }}>
                  {block.value || 'f(x) = \\int e^x dx'}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <input 
                    type="text" 
                    value={block.value} 
                    onChange={e => updateBlock(block.id, 'value', e.target.value)}
                    placeholder="Type equation LaTeX code..."
                    style={{
                      background: 'rgba(0,0,0,0.02)',
                      border: '1px solid var(--border)',
                      borderRadius: '4px',
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.8rem',
                      fontFamily: 'monospace',
                      width: '80%',
                      textAlign: 'center',
                      outline: 'none'
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = 'var(--primary)'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                  />
                </div>
              </div>
            );
          }

          else if (block.type === 'synced-block') {
            blockEl = (
              <div style={{ 
                ...styles, 
                border: '1px dashed rgba(239, 68, 68, 0.4)', 
                borderRadius: '8px', 
                padding: '1rem 1.25rem', 
                position: 'relative',
                background: 'rgba(239, 68, 68, 0.01)',
                margin: '1.25rem 0'
              }}>
                <div style={{ 
                  position: 'absolute', 
                  top: '-0.6rem', 
                  right: '1rem', 
                  fontSize: '0.65rem', 
                  background: '#fee2e2', 
                  color: '#ef4444', 
                  padding: '0.1rem 0.4rem', 
                  borderRadius: '4px',
                  fontWeight: 600,
                  border: '1px solid #fca5a5',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  <span>🔄</span> Synced Block
                </div>
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={e => updateBlock(block.id, 'value', e.currentTarget.innerText || '')}
                  style={{ 
                    outline: 'none', 
                    cursor: 'text', 
                    whiteSpace: 'pre-wrap', 
                    minHeight: '2rem',
                    color: 'var(--text-main)'
                  }}
                >
                  {block.value || 'Type synced block content here...'}
                </div>
              </div>
            );
          }

          // ========= PROJECT MANAGEMENT UI BLOCKS =========

          else if (block.type === 'metric-cards') {
            let metrics = [
              { title: 'Total Items', value: '0', color: '#0284c7', desc: 'Count' },
              { title: 'In Progress', value: '0', color: '#f59e0b', desc: 'Active' },
              { title: 'Completed', value: '0', color: '#10b981', desc: 'Done' },
              { title: 'Blocked', value: '0', color: '#ef4444', desc: 'Needs attention' }
            ];
            try { if (block.value) metrics = JSON.parse(block.value); } catch(e) {}

            const updateMetric = (idx: number, field: string, val: string) => {
              const updated = [...metrics];
              (updated[idx] as any)[field] = val;
              updateBlock(block.id, 'value', JSON.stringify(updated));
            };
            const addMetric = () => {
              const updated = [...metrics, { title: 'New Metric', value: '0', color: '#6366f1', desc: 'Description' }];
              updateBlock(block.id, 'value', JSON.stringify(updated));
            };
            const removeMetric = (idx: number) => {
              const updated = metrics.filter((_: any, i: number) => i !== idx);
              updateBlock(block.id, 'value', JSON.stringify(updated));
            };

            blockEl = (
              <div style={{ ...styles, margin: '1rem 0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(180px, 1fr))`, gap: '1rem' }}>
                  {metrics.map((m: any, i: number) => (
                    <div key={i} style={{
                      padding: '1.25rem',
                      borderRadius: '12px',
                      border: '1px solid var(--border)',
                      background: 'var(--surface)',
                      borderTop: `4px solid ${m.color}`,
                      position: 'relative',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                    }}>
                      <button onClick={() => removeMetric(i)} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.75rem', opacity: 0.5 }} title="Remove">✕</button>
                      <input value={m.title} onChange={e => updateMetric(i, 'title', e.target.value)} style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', background: 'none', border: 'none', outline: 'none', width: '100%', letterSpacing: '0.03em' }} />
                      <input value={m.value} onChange={e => updateMetric(i, 'value', e.target.value)} style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', background: 'none', border: 'none', outline: 'none', width: '100%', margin: '0.15rem 0' }} />
                      <input value={m.desc} onChange={e => updateMetric(i, 'desc', e.target.value)} style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'none', border: 'none', outline: 'none', width: '100%' }} />
                    </div>
                  ))}
                  <div onClick={addMetric} style={{
                    padding: '1.25rem',
                    borderRadius: '12px',
                    border: '2px dashed var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    minHeight: '90px',
                    transition: 'all 0.2s'
                  }}>
                    + Add Metric
                  </div>
                </div>
              </div>
            );
          }

          else if (block.type === 'kanban-board') {
            let columns = [
              { title: 'Backlog', color: '#94a3b8', items: [{ id: 'k1', text: 'Sample task', priority: 'Medium', assignee: 'Unassigned' }] },
              { title: 'To Do', color: '#0284c7', items: [] as any[] },
              { title: 'In Progress', color: '#f59e0b', items: [] as any[] },
              { title: 'Testing', color: '#8b5cf6', items: [] as any[] },
              { title: 'Done', color: '#10b981', items: [] as any[] }
            ];
            try { if (block.value) columns = JSON.parse(block.value); } catch(e) {}

            const updateColumns = (newCols: any[]) => {
              updateBlock(block.id, 'value', JSON.stringify(newCols));
            };
            const addCard = (colIdx: number) => {
              const updated = [...columns];
              updated[colIdx].items.push({ id: Math.random().toString(36).substr(2, 6), text: 'New Task', priority: 'Medium', assignee: 'Unassigned' });
              updateColumns(updated);
            };
            const removeCard = (colIdx: number, cardIdx: number) => {
              const updated = [...columns];
              updated[colIdx].items.splice(cardIdx, 1);
              updateColumns(updated);
            };
            const updateCard = (colIdx: number, cardIdx: number, field: string, val: string) => {
              const updated = JSON.parse(JSON.stringify(columns));
              updated[colIdx].items[cardIdx][field] = val;
              updateColumns(updated);
            };
            const moveCard = (fromCol: number, cardIdx: number, toCol: number) => {
              const updated = JSON.parse(JSON.stringify(columns));
              const [card] = updated[fromCol].items.splice(cardIdx, 1);
              updated[toCol].items.push(card);
              updateColumns(updated);
            };

            const priorityColors: Record<string, string> = { Critical: '#ef4444', High: '#f97316', Medium: '#0284c7', Low: '#10b981' };

            blockEl = (
              <div style={{ ...styles, margin: '1rem 0', overflowX: 'auto' }}>
                <div style={{ display: 'flex', gap: '0.75rem', minWidth: `${columns.length * 240}px` }}>
                  {columns.map((col: any, ci: number) => (
                    <div key={ci} style={{ flex: 1, minWidth: '220px', background: 'var(--background)', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: col.color }} />
                          <input value={col.title} onChange={e => { const u = [...columns]; u[ci].title = e.target.value; updateColumns(u); }} style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)', background: 'none', border: 'none', outline: 'none', width: '100px' }} />
                        </div>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', background: 'var(--surface)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>{col.items.length}</span>
                      </div>
                      <div style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, minHeight: '80px' }}>
                        {col.items.map((card: any, ki: number) => (
                          <div key={ki} style={{ padding: '0.75rem', background: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.8rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                              <input value={card.text} onChange={e => updateCard(ci, ki, 'text', e.target.value)} style={{ fontWeight: 600, color: 'var(--text-main)', background: 'none', border: 'none', outline: 'none', width: '100%', fontSize: '0.8rem' }} />
                              <button onClick={() => removeCard(ci, ki)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.7rem', flexShrink: 0 }}>✕</button>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem' }}>
                              <select value={card.priority} onChange={e => updateCard(ci, ki, 'priority', e.target.value)} style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.1rem 0.3rem', borderRadius: '4px', border: '1px solid var(--border)', background: `${priorityColors[card.priority] || '#0284c7'}15`, color: priorityColors[card.priority] || '#0284c7', cursor: 'pointer', outline: 'none' }}>
                                <option value="Critical">Critical</option>
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                              </select>
                              <input value={card.assignee} onChange={e => updateCard(ci, ki, 'assignee', e.target.value)} placeholder="Assignee" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', background: 'none', border: 'none', outline: 'none', flex: 1 }} />
                            </div>
                            <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.25rem' }}>
                              {ci > 0 && <button onClick={() => moveCard(ci, ki, ci - 1)} style={{ fontSize: '0.6rem', padding: '0.15rem 0.35rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--background)', cursor: 'pointer', color: 'var(--text-muted)' }}>← Move</button>}
                              {ci < columns.length - 1 && <button onClick={() => moveCard(ci, ki, ci + 1)} style={{ fontSize: '0.6rem', padding: '0.15rem 0.35rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--background)', cursor: 'pointer', color: 'var(--text-muted)' }}>Move →</button>}
                            </div>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => addCard(ci)} style={{ margin: '0 0.5rem 0.5rem', padding: '0.4rem', borderRadius: '6px', border: '1px dashed var(--border)', background: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>+ Add Card</button>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          else if (block.type === 'detailed-card') {
            let cardData = {
              id: 'TASK-001',
              title: 'New Task',
              fields: [
                { label: 'Assigned To', value: 'Unassigned' },
                { label: 'Priority', value: 'Medium' },
                { label: 'Status', value: 'Pending' },
                { label: 'Estimated Hours', value: '8' },
                { label: 'Dependencies', value: 'None' }
              ]
            };
            try { if (block.value) cardData = JSON.parse(block.value); } catch(e) {}

            const updateCardData = (newData: any) => {
              updateBlock(block.id, 'value', JSON.stringify(newData));
            };
            const addField = () => {
              const updated = { ...cardData, fields: [...cardData.fields, { label: 'New Field', value: '' }] };
              updateCardData(updated);
            };
            const removeField = (idx: number) => {
              const updated = { ...cardData, fields: cardData.fields.filter((_: any, i: number) => i !== idx) };
              updateCardData(updated);
            };
            const updateField = (idx: number, key: string, val: string) => {
              const updated = JSON.parse(JSON.stringify(cardData));
              updated.fields[idx][key] = val;
              updateCardData(updated);
            };

            const statusColors: Record<string, string> = { 'Pending': '#f59e0b', 'In Progress': '#0284c7', 'Testing': '#8b5cf6', 'Done': '#10b981', 'Blocked': '#ef4444', 'Monitoring': '#f97316', 'Ready for Deployment': '#10b981', 'Backlog': '#94a3b8' };
            const statusColor = statusColors[cardData.fields.find((f: any) => f.label === 'Status')?.value || ''] || '#0284c7';

            blockEl = (
              <div style={{ ...styles, margin: '1rem 0', maxWidth: '480px' }}>
                <div style={{ borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--surface)', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                  <div style={{ padding: '0.85rem 1.15rem', borderBottom: '1px solid var(--border)', background: 'var(--background)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TASK ID:</span>
                      <input value={cardData.id} onChange={e => updateCardData({ ...cardData, id: e.target.value })} style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.85rem', background: 'none', border: 'none', outline: 'none', width: '120px' }} />
                    </div>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: statusColor, boxShadow: `0 0 6px ${statusColor}` }} />
                  </div>
                  <div style={{ padding: '1.15rem' }}>
                    <input value={cardData.title} onChange={e => updateCardData({ ...cardData, title: e.target.value })} style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', background: 'none', border: 'none', outline: 'none', width: '100%', marginBottom: '0.85rem', borderBottom: '1px dashed transparent' }} onFocus={e => { e.currentTarget.style.borderBottomColor = 'var(--primary)'; }} onBlur={e => { e.currentTarget.style.borderBottomColor = 'transparent'; }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {cardData.fields.map((f: any, fi: number) => (
                        <div key={fi} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <input value={f.label} onChange={e => updateField(fi, 'label', e.target.value)} style={{ width: '120px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', background: 'none', border: 'none', outline: 'none', flexShrink: 0 }} />
                          <input value={f.value} onChange={e => updateField(fi, 'value', e.target.value)} style={{ flex: 1, fontSize: '0.85rem', color: 'var(--text-main)', background: 'none', border: 'none', outline: 'none', borderBottom: '1px solid var(--border)', paddingBottom: '0.2rem' }} />
                          <button onClick={() => removeField(fi)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.65rem', opacity: 0.5 }}>✕</button>
                        </div>
                      ))}
                    </div>
                    <button onClick={addField} style={{ marginTop: '0.75rem', padding: '0.35rem 0.75rem', borderRadius: '6px', border: '1px dashed var(--border)', background: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>+ Add Field</button>
                  </div>
                </div>
              </div>
            );
          }

          else if (block.type === 'progress-bars') {
            let rows = [
              { label: 'Frontend', value: 80, color: '#0284c7' },
              { label: 'Backend', value: 65, color: '#6366f1' },
              { label: 'QA', value: 40, color: '#f59e0b' },
              { label: 'DevOps', value: 30, color: '#10b981' }
            ];
            try { if (block.value) rows = JSON.parse(block.value); } catch(e) {}

            const updateRows = (newRows: any[]) => {
              updateBlock(block.id, 'value', JSON.stringify(newRows));
            };
            const addRow = () => {
              updateRows([...rows, { label: 'New Item', value: 50, color: '#8b5cf6' }]);
            };
            const removeRow = (idx: number) => {
              updateRows(rows.filter((_: any, i: number) => i !== idx));
            };
            const updateRow = (idx: number, field: string, val: any) => {
              const updated = [...rows];
              (updated[idx] as any)[field] = val;
              updateRows(updated);
            };

            blockEl = (
              <div style={{ ...styles, margin: '1rem 0' }}>
                <div style={{ borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--surface)', padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {rows.map((r: any, ri: number) => {
                      const pct = Math.max(0, Math.min(100, Number(r.value) || 0));
                      const statusEmoji = pct >= 80 ? '🟢' : pct >= 50 ? '🟡' : '🔴';
                      return (
                        <div key={ri} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <input value={r.label} onChange={e => updateRow(ri, 'label', e.target.value)} style={{ width: '100px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', background: 'none', border: 'none', outline: 'none', flexShrink: 0 }} />
                          <div style={{ flex: 1, height: '24px', background: 'var(--background)', borderRadius: '6px', overflow: 'hidden', position: 'relative', border: '1px solid var(--border)' }}>
                            <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${r.color}, ${r.color}cc)`, borderRadius: '6px', transition: 'width 0.5s ease', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '0.5rem' }}>
                              {pct > 15 && <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#fff' }}>{pct}%</span>}
                            </div>
                          </div>
                          <input type="number" value={r.value} onChange={e => updateRow(ri, 'value', Number(e.target.value))} style={{ width: '50px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '4px', outline: 'none', textAlign: 'center', padding: '0.15rem' }} min="0" max="100" />
                          <span style={{ fontSize: '0.85rem' }}>{statusEmoji}</span>
                          <button onClick={() => removeRow(ri)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.7rem', opacity: 0.5 }}>✕</button>
                        </div>
                      );
                    })}
                  </div>
                  <button onClick={addRow} style={{ marginTop: '0.75rem', padding: '0.35rem 0.75rem', borderRadius: '6px', border: '1px dashed var(--border)', background: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>+ Add Row</button>
                </div>
              </div>
            );
          }

          if (!blockEl) return null;

          const isInsertOpen = activeInsertBlockId === block.id;
          const isActionsOpen = activeActionsBlockId === block.id;

          return (
            <div 
              key={block.id} 
              className="preview-block-wrapper"
              style={{ 
                backgroundColor: block.backgroundColor || undefined,
                paddingTop: block.backgroundColor ? '0.5rem' : undefined,
                paddingBottom: block.backgroundColor ? '0.5rem' : undefined,
                borderRadius: block.backgroundColor ? '8px' : undefined
              }}
            >
              {/* Floating action bar to the left */}
              <div className="block-actions-bar">
                <button 
                  className="action-btn-trigger" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveActionsBlockId(null);
                    setActiveInsertBlockId(isInsertOpen ? null : block.id);
                  }}
                  title="Insert block below"
                >
                  +
                </button>
                
                <button 
                  className="action-btn-trigger" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveInsertBlockId(null);
                    setActiveActionsBlockId(isActionsOpen ? null : block.id);
                  }}
                  title="Actions / Formatting"
                >
                  ⋮⋮
                </button>

                {/* Inline Block Insertion Dropdown */}
                {isInsertOpen && (
                  <div className="notion-dropdown">
                    <div className="notion-dropdown-header">Insert Block Below</div>
                    <button className="notion-dropdown-item" onClick={() => insertBlockAfter(block.id, 'textarea')}><span style={{fontSize:'1rem'}}>📝</span> Paragraph</button>
                    <button className="notion-dropdown-item" onClick={() => insertBlockAfter(block.id, 'header', '1')}><span style={{fontSize:'1rem'}}>h1</span> Heading 1</button>
                    <button className="notion-dropdown-item" onClick={() => insertBlockAfter(block.id, 'header', '2')}><span style={{fontSize:'1rem'}}>h2</span> Heading 2</button>
                    <button className="notion-dropdown-item" onClick={() => insertBlockAfter(block.id, 'header', '3')}><span style={{fontSize:'1rem'}}>h3</span> Heading 3</button>
                    <button className="notion-dropdown-item" onClick={() => insertBlockAfter(block.id, 'header', '4')}><span style={{fontSize:'1rem'}}>h4</span> Heading 4</button>
                    <button className="notion-dropdown-item" onClick={() => insertBlockAfter(block.id, 'page')}><span style={{fontSize:'1rem'}}>📄</span> Page</button>
                    <button className="notion-dropdown-item" onClick={() => insertBlockAfter(block.id, 'toggle-header', '1')}><span style={{fontSize:'1rem'}}>▶h1</span> Toggle Heading 1</button>
                    <button className="notion-dropdown-item" onClick={() => insertBlockAfter(block.id, 'toggle-header', '2')}><span style={{fontSize:'1rem'}}>▶h2</span> Toggle Heading 2</button>
                    <button className="notion-dropdown-item" onClick={() => insertBlockAfter(block.id, 'toggle-header', '3')}><span style={{fontSize:'1rem'}}>▶h3</span> Toggle Heading 3</button>
                    <button className="notion-dropdown-item" onClick={() => insertBlockAfter(block.id, 'toggle-header', '4')}><span style={{fontSize:'1rem'}}>▶h4</span> Toggle Heading 4</button>
                    <button className="notion-dropdown-item" onClick={() => insertBlockAfter(block.id, 'bulleted-list')}><span style={{fontSize:'1rem'}}>•</span> Bulleted List</button>
                    <button className="notion-dropdown-item" onClick={() => insertBlockAfter(block.id, 'numbered-list')}><span style={{fontSize:'1rem'}}>1.</span> Numbered List</button>
                    <button className="notion-dropdown-item" onClick={() => insertBlockAfter(block.id, 'todo-list')}><span style={{fontSize:'1rem'}}>☑</span> To-do List</button>
                    <button className="notion-dropdown-item" onClick={() => insertBlockAfter(block.id, 'toggle-list')}><span style={{fontSize:'1rem'}}>▶</span> Toggle List</button>
                    <button className="notion-dropdown-item" onClick={() => insertBlockAfter(block.id, 'quote')}><span style={{fontSize:'1rem'}}>“</span> Quote</button>
                    <button className="notion-dropdown-item" onClick={() => insertBlockAfter(block.id, 'callout')}><span style={{fontSize:'1rem'}}>💡</span> Callout Box</button>
                    <button className="notion-dropdown-item" onClick={() => insertBlockAfter(block.id, 'code')}><span style={{fontSize:'1rem'}}>💻</span> Code Block</button>
                    <button className="notion-dropdown-item" onClick={() => insertBlockAfter(block.id, 'equation')}><span style={{fontSize:'1rem'}}>∑</span> Block Equation</button>
                    <button className="notion-dropdown-item" onClick={() => insertBlockAfter(block.id, 'synced-block')}><span style={{fontSize:'1rem'}}>🔄</span> Synced Block</button>
                    <button className="notion-dropdown-item" onClick={() => insertBlockAfter(block.id, 'file')}><span style={{fontSize:'1rem'}}>📎</span> File Attachment</button>
                    <button className="notion-dropdown-item" onClick={() => insertBlockAfter(block.id, 'table')}><span style={{fontSize:'1rem'}}>🧮</span> Table Grid</button>
                    <button className="notion-dropdown-item" onClick={() => insertBlockAfter(block.id, 'date-time')}><span style={{fontSize:'1rem'}}>📅</span> Date & Time</button>
                    <div className="notion-dropdown-header" style={{ marginTop: '0.5rem', borderTop: '1px solid var(--border)', paddingTop: '0.5rem' }}>Project Management UIs</div>
                    <button className="notion-dropdown-item" onClick={() => insertBlockAfter(block.id, 'metric-cards')}><span style={{fontSize:'1rem'}}>📊</span> Metric Dashboard</button>
                    <button className="notion-dropdown-item" onClick={() => insertBlockAfter(block.id, 'kanban-board')}><span style={{fontSize:'1rem'}}>📋</span> Kanban Board</button>
                    <button className="notion-dropdown-item" onClick={() => insertBlockAfter(block.id, 'detailed-card')}><span style={{fontSize:'1rem'}}>🏷️</span> Detailed Task Card</button>
                    <button className="notion-dropdown-item" onClick={() => insertBlockAfter(block.id, 'progress-bars')}><span style={{fontSize:'1rem'}}>📈</span> Progress / Effort Bars</button>
                  </div>
                )}

                {isActionsOpen && renderBlockOptionsPopover(block, index)}
              </div>
              
              {blockEl}
            </div>
          );
        })}
      </div>
    );
  };





  // ═══════════════════════════════════════════════════════════
  // ENTERPRISE SRS DASHBOARD - MASTER LAYOUT
  // ═══════════════════════════════════════════════════════════
  const renderSrsDashboard = () => {
    const sidebarItems = [
      { id: 'overview', icon: '📊', label: 'Technical Overview' },
      { id: 'architecture', icon: '🏗️', label: 'System Architecture' },
      { id: 'apis', icon: '🔗', label: 'APIs' },
      { id: 'database', icon: '🗄️', label: 'Database Schemas' },
      { id: 'microservices', icon: '⚙️', label: 'Microservices' },
      { id: 'security', icon: '🔒', label: 'Security' },
      { id: 'infrastructure', icon: '🖥️', label: 'Infrastructure' },
      { id: 'performance', icon: '⚡', label: 'Performance' },
      { id: 'monitoring', icon: '📡', label: 'Monitoring' },
      { id: 'cicd', icon: '🚀', label: 'CI/CD' },
      { id: 'errors', icon: '🐛', label: 'Error Handling' },
      { id: 'approvals', icon: '✍️', label: 'Approvals' },
      { id: 'versions', icon: '🔁', label: 'Version History' },
      { id: 'attachments', icon: '📎', label: 'Attachments' },
      { id: 'analytics', icon: '📈', label: 'Analytics' },
    ];

    const ds = {
      card: { padding: '1.25rem', background: 'var(--surface)', borderRadius: '14px', border: '1px solid var(--border)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' } as React.CSSProperties,
      title: { fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' } as React.CSSProperties,
      badge: (color: string) => ({ fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: '4px', background: `${color}15`, color, textTransform: 'uppercase' as const, letterSpacing: '0.03em' }),
    };

    const renderCenterContent = () => {
      switch (activeSrsTab) {
        case 'overview':
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>{documentTitle || 'SRS Dashboard'}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>Technical Visibility Dashboard • Engineering Operations Platform</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.85rem' }}>
                {[
                  { label: 'Technical Requirements', val: documentMetrics.totalRequirements > 0 ? documentMetrics.totalRequirements.toString() : '12', color: '#2563EB', icon: '🔗' },
                  { label: 'Completion %', val: `${documentMetrics.completionPercentage}%`, color: '#16A34A', icon: '⚙️' },
                  { label: 'Canvas Blocks', val: documentMetrics.totalBlocks.toString(), color: '#9333EA', icon: '🗄️' },
                  { label: 'Stakeholders', val: documentMetrics.stakeholderCount.toString(), color: '#F59E0B', icon: '🔌' },
                  { label: 'Security Risks', val: documentMetrics.riskCount.toString(), color: '#DC2626', icon: '🔒' },
                ].map((kpi, i) => (
                  <div key={i} style={{ ...ds.card, position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: kpi.color }} />
                    <div style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>{kpi.icon}</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 900, color: kpi.color, lineHeight: 1 }}>{kpi.val}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '0.3rem' }}>{kpi.label}</div>
                  </div>
                ))}
              </div>
              <div style={ds.card}>
                <h3 style={ds.title}>📈 Technical Health Analytics</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                  {[
                    { label: 'API Readiness', pct: 92, color: '#2563EB' },
                    { label: 'Database Mapping', pct: 78, color: '#16A34A' },
                    { label: 'Security Compliance', pct: 72, color: '#F59E0B' },
                    { label: 'Infrastructure Stability', pct: 84, color: '#9333EA' },
                    { label: 'Monitoring Coverage', pct: 66, color: '#0891B2' },
                    { label: 'Deployment Readiness', pct: 81, color: '#DC2626' },
                  ].map((h, i) => (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.2rem' }}>
                        <span>{h.label}</span><span style={{ color: h.color }}>{h.pct}%</span>
                      </div>
                      <div style={{ height: '8px', background: 'var(--background)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${h.pct}%`, height: '100%', background: h.color, borderRadius: '4px', transition: 'width 0.8s ease' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                {[
                  { name: 'Authentication Service SRS', apis: 18, status: 'Stable', pct: 91, color: '#16A34A', date: 'Today' },
                  { name: 'Payroll Engine SRS', apis: 6, status: 'In Review', pct: 74, color: '#F59E0B', date: '1h ago' },
                  { name: 'Notification Service SRS', apis: 12, status: 'Stable', pct: 88, color: '#16A34A', date: 'Yesterday' },
                  { name: 'Analytics Engine SRS', apis: 22, status: 'Draft', pct: 52, color: '#2563EB', date: '18 May' },
                ].map((t, i) => (
                  <div key={i} style={{ ...ds.card, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: 0 }}>{t.name}</h4>
                      <span style={ds.badge(t.color)}>{t.status}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      <span>APIs: <strong style={{ color: 'var(--text-main)' }}>{t.apis}</strong></span>
                      <span>Updated: <strong style={{ color: 'var(--text-main)' }}>{t.date}</strong></span>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '0.2rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Progress</span><span style={{ fontWeight: 700, color: t.color }}>{t.pct}%</span>
                      </div>
                      <div style={{ height: '6px', background: 'var(--background)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${t.pct}%`, height: '100%', background: t.color, borderRadius: '3px' }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );

        case 'architecture':
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>🏗️ System Architecture</h2>
              <div style={ds.card}>
                <h3 style={ds.title}>High-Level Architecture Flow</h3>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', padding: '1rem 0' }}>
                  {['Frontend (React + Next.js)', 'API Gateway (Nginx)', 'Authentication Service', 'Business Services Layer', 'Database Cluster (PostgreSQL)', 'Monitoring Engine (ELK)'].map((step, i) => (
                    <React.Fragment key={step}>
                      <div style={{ padding: '0.6rem 1.5rem', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700, background: i === 0 ? '#0891B2' : i === 5 ? '#9333EA' : 'var(--background)', color: i === 0 || i === 5 ? '#fff' : 'var(--text-main)', border: i === 0 || i === 5 ? 'none' : '1px solid var(--border)', minWidth: '250px', textAlign: 'center' }}>{step}</div>
                      {i < 5 && <span style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>↓</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          );

        case 'apis':
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>🔗 API Management Dashboard</h2>
              <div style={ds.card}>
                <h3 style={ds.title}>API Matrix</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)' }}>
                      {['Endpoint', 'Method', 'Service', 'Auth', 'Status', 'Latency'].map(h => (
                        <th key={h} style={{ padding: '0.6rem', textAlign: 'left', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['/auth/login', 'POST', 'Auth', 'Public', '✅ Live', '120ms'],
                      ['/auth/refresh', 'POST', 'Auth', 'JWT', '✅ Live', '85ms'],
                      ['/attendance/checkin', 'POST', 'Attendance', 'JWT', '🟡 Testing', '210ms'],
                      ['/payroll/process', 'POST', 'Payroll', 'JWT+Role', '🟢 Ready', '340ms'],
                      ['/payroll/payslip/:id', 'GET', 'Payroll', 'JWT', '🟡 Testing', '180ms'],
                      ['/leave/apply', 'POST', 'Leave', 'JWT', '✅ Live', '95ms'],
                      ['/analytics/report', 'GET', 'Analytics', 'JWT+Role', '🔵 Dev', '450ms'],
                      ['/employee/:id', 'GET', 'Employee', 'JWT', '✅ Live', '65ms'],
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                        {row.map((cell, c) => (
                          <td key={c} style={{ padding: '0.55rem 0.6rem', fontWeight: c === 0 ? 600 : 400, fontFamily: c === 0 ? 'monospace' : 'inherit', fontSize: c === 0 ? '0.78rem' : '0.82rem', color: c === 1 ? '#0891B2' : c === 5 ? '#F59E0B' : 'var(--text-main)' }}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={ds.card}>
                <h3 style={ds.title}>API Flow Visualization</h3>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', padding: '0.5rem 0' }}>
                  {['Frontend Client', 'API Gateway', 'Auth Service', 'Business Logic Layer', 'Database'].map((s, i) => (
                    <React.Fragment key={s}>
                      <div style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, background: 'var(--background)', border: '1px solid var(--border)', minWidth: '200px', textAlign: 'center' }}>{s}</div>
                      {i < 4 && <span style={{ color: '#0891B2', fontSize: '1rem' }}>↓</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          );

        case 'database':
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>🗄️ Database Schema Dashboard</h2>
              <div style={ds.card}>
                <h3 style={ds.title}>Schema Visibility Matrix</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)' }}>
                      {['Table', 'Primary Key', 'Relationship', 'Linked To', 'Records', 'Indexed'].map(h => (
                        <th key={h} style={{ padding: '0.6rem', textAlign: 'left', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['employees', 'emp_id', 'One-to-Many', 'payroll, attendance', '~350', '✅'],
                      ['attendance_logs', 'log_id', 'Many-to-One', 'employees, shifts', '~12K', '✅'],
                      ['payroll_records', 'pay_id', 'Many-to-One', 'employees, tax_rules', '~4.2K', '✅'],
                      ['leave_requests', 'leave_id', 'Many-to-One', 'employees', '~2.8K', '✅'],
                      ['tax_rules', 'tax_id', 'One-to-Many', 'payroll_records', '~25', '⬜'],
                      ['audit_logs', 'audit_id', 'Many-to-One', 'employees', '~48K', '✅'],
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                        {row.map((cell, c) => (
                          <td key={c} style={{ padding: '0.55rem 0.6rem', fontWeight: c === 0 ? 700 : 400, fontFamily: c === 0 || c === 1 ? 'monospace' : 'inherit' }}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );

        case 'microservices':
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>⚙️ Microservices Registry</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                {[
                  { name: 'Auth Service', port: '3001', status: '🟢 Healthy', deps: 'Redis, PostgreSQL', replicas: 3 },
                  { name: 'Payroll Engine', port: '3002', status: '🟢 Healthy', deps: 'PostgreSQL, Tax API', replicas: 2 },
                  { name: 'Attendance Service', port: '3003', status: '🟡 Degraded', deps: 'PostgreSQL, GPS API', replicas: 2 },
                  { name: 'Notification Service', port: '3004', status: '🟢 Healthy', deps: 'Redis, SendGrid', replicas: 1 },
                  { name: 'Analytics Engine', port: '3005', status: '🔵 Starting', deps: 'ClickHouse, S3', replicas: 1 },
                  { name: 'File Service', port: '3006', status: '🟢 Healthy', deps: 'S3, PostgreSQL', replicas: 1 },
                ].map((svc, i) => (
                  <div key={i} style={ds.card}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0 }}>{svc.name}</h4>
                      <span style={{ fontSize: '0.72rem' }}>{svc.status}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.3rem', fontSize: '0.75rem' }}>
                      <div><span style={{ color: 'var(--text-muted)' }}>Port:</span> <strong style={{ fontFamily: 'monospace' }}>{svc.port}</strong></div>
                      <div><span style={{ color: 'var(--text-muted)' }}>Replicas:</span> <strong>{svc.replicas}</strong></div>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>Deps: <span style={{ color: 'var(--text-main)' }}>{svc.deps}</span></div>
                  </div>
                ))}
              </div>
            </div>
          );

        case 'security':
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>🔒 Security Dashboard</h2>
              <div style={ds.card}>
                <h3 style={ds.title}>Security Layers</h3>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', padding: '0.75rem 0' }}>
                  {['Authentication (JWT + OAuth2)', 'Authorization (RBAC)', 'Encryption (AES-256 / TLS 1.3)', 'API Protection (Rate Limiting)', 'Audit Logging (Immutable)'].map((s, i) => (
                    <React.Fragment key={s}>
                      <div style={{ padding: '0.55rem 1.3rem', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, background: i === 0 ? '#16A34A' : 'var(--background)', color: i === 0 ? '#fff' : 'var(--text-main)', border: i === 0 ? 'none' : '1px solid var(--border)', minWidth: '260px', textAlign: 'center' }}>{s}</div>
                      {i < 4 && <span style={{ color: '#16A34A', fontSize: '1rem' }}>↓</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                {[
                  { module: 'JWT Authentication', items: ['Token Validation', 'Refresh Tokens', 'Session Expiry', 'RBAC'], risk: 'Low', color: '#16A34A' },
                  { module: 'Data Encryption', items: ['At-rest AES-256', 'In-transit TLS 1.3', 'Key rotation', 'PII masking'], risk: 'Low', color: '#16A34A' },
                  { module: 'API Security', items: ['Rate limiting', 'CORS config', 'Input validation', 'SQL injection prevention'], risk: 'Medium', color: '#F59E0B' },
                  { module: 'Compliance', items: ['GDPR readiness', 'Audit trails', 'Data retention', 'Right to delete'], risk: 'Medium', color: '#F59E0B' },
                ].map((s, i) => (
                  <div key={i} style={{ ...ds.card, borderLeft: `4px solid ${s.color}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <h4 style={{ fontSize: '0.88rem', fontWeight: 700, margin: 0 }}>{s.module}</h4>
                      <span style={ds.badge(s.color)}>Risk: {s.risk}</span>
                    </div>
                    {s.items.map((item, j) => (
                      <div key={j} style={{ fontSize: '0.75rem', color: '#16A34A', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.15rem' }}>✔ {item}</div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          );

        case 'infrastructure':
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>🖥️ Infrastructure Dashboard</h2>
              <div style={ds.card}>
                <h3 style={ds.title}>Infrastructure Topology</h3>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', padding: '0.75rem 0' }}>
                  {['Load Balancer (Nginx)', 'Application Servers (3x)', 'Microservices Cluster (K8s)', 'Database Cluster (PostgreSQL HA)', 'Backup Storage (S3)'].map((s, i) => (
                    <React.Fragment key={s}>
                      <div style={{ padding: '0.55rem 1.3rem', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, background: 'var(--background)', border: '1px solid var(--border)', minWidth: '260px', textAlign: 'center' }}>{s}</div>
                      {i < 4 && <span style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>↓</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div style={ds.card}>
                <h3 style={ds.title}>Environment Matrix</h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {[
                    { env: 'Development', url: 'dev.app.com', status: '🟢 Active', color: '#16A34A' },
                    { env: 'Staging', url: 'stage.app.com', status: '🟡 Deploying', color: '#F59E0B' },
                    { env: 'Production', url: 'app.com', status: '🟢 Healthy', color: '#16A34A' },
                  ].map((e, i) => (
                    <div key={i} style={{ ...ds.card, flex: 1, textAlign: 'center' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{e.env}</div>
                      <div style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{e.url}</div>
                      <div style={{ fontSize: '0.78rem', color: e.color, fontWeight: 600, marginTop: '0.3rem' }}>{e.status}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );

        case 'performance':
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>⚡ Performance Analytics</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {[
                  { label: 'API Response Time', val: '1.2s', color: '#2563EB' },
                  { label: 'Database Query', val: '94ms', color: '#16A34A' },
                  { label: 'Concurrent Users', val: '10,000', color: '#9333EA' },
                ].map((m, i) => (
                  <div key={i} style={{ ...ds.card, textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: m.color }}>{m.val}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{m.label}</div>
                  </div>
                ))}
              </div>
              <div style={ds.card}>
                <h3 style={ds.title}>Resource Utilization</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {[
                    { label: 'API Response Time', val: '1.2 sec', pct: 80, color: '#2563EB' },
                    { label: 'CPU Usage', val: '62%', pct: 62, color: '#F59E0B' },
                    { label: 'Memory Usage', val: '71%', pct: 71, color: '#9333EA' },
                    { label: 'Database Query Speed', val: '94ms', pct: 94, color: '#16A34A' },
                    { label: 'Disk I/O', val: '45%', pct: 45, color: '#0891B2' },
                  ].map((p, i) => (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.2rem' }}>
                        <span>{p.label}</span><span style={{ color: p.color }}>{p.val}</span>
                      </div>
                      <div style={{ height: '8px', background: 'var(--background)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${p.pct}%`, height: '100%', background: p.color, borderRadius: '4px' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );

        case 'monitoring':
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>📡 Monitoring & Logging</h2>
              <div style={ds.card}>
                <h3 style={ds.title}>Monitoring Flow</h3>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', padding: '0.5rem 0' }}>
                  {['Application Logs', 'ELK Stack', 'Monitoring Engine', 'Alert System', 'Incident Response'].map((s, i) => (
                    <React.Fragment key={s}>
                      <div style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600, background: 'var(--background)', border: '1px solid var(--border)', minWidth: '200px', textAlign: 'center' }}>{s}</div>
                      {i < 4 && <span style={{ color: '#DC2626', fontSize: '1rem' }}>↓</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div style={{ ...ds.card, borderLeft: '4px solid #DC2626' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0, color: '#DC2626' }}>🚨 Active Alert: High CPU Usage</h4>
                  <span style={ds.badge('#DC2626')}>Monitoring</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.3rem', fontSize: '0.78rem' }}>
                  <div><span style={{ color: 'var(--text-muted)' }}>Server:</span> <strong>PROD-APP-03</strong></div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Threshold:</span> <strong>90%</strong></div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Current:</span> <strong style={{ color: '#DC2626' }}>96%</strong></div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Action:</span> <strong>Auto-scaling triggered</strong></div>
                </div>
              </div>
            </div>
          );

        case 'cicd':
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>🚀 CI/CD Dashboard</h2>
              <div style={ds.card}>
                <h3 style={ds.title}>Deployment Pipeline</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', padding: '0.5rem 0' }}>
                  {['Git Push', 'CI Pipeline', 'Automated Tests', 'Docker Build', 'K8s Deploy'].map((s, i) => (
                    <React.Fragment key={s}>
                      <div style={{ padding: '0.5rem 0.85rem', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, background: i < 3 ? 'rgba(22,163,74,0.1)' : 'rgba(37,99,235,0.08)', color: i < 3 ? '#16A34A' : '#2563EB', border: `1px solid ${i < 3 ? '#16A34A' : '#2563EB'}40` }}>{s}</div>
                      {i < 4 && <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>→</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {[
                  { label: 'Build Success Rate', val: '98.2%', color: '#16A34A' },
                  { label: 'Avg Build Time', val: '4.2 min', color: '#2563EB' },
                  { label: 'Last Deployment', val: '2h ago', color: '#9333EA' },
                ].map((m, i) => (
                  <div key={i} style={{ ...ds.card, textAlign: 'center' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 900, color: m.color }}>{m.val}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          );

        case 'errors':
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>🐛 Error Handling Dashboard</h2>
              <div style={ds.card}>
                <h3 style={ds.title}>Technical Risk Matrix</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)' }}>
                      {['Error Type', 'Impact', 'Resolution', 'Status'].map(h => (
                        <th key={h} style={{ padding: '0.6rem', textAlign: 'left', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['API Timeout', 'Medium', 'Retry logic with exponential backoff', '✅ Resolved'],
                      ['Database Failure', 'Critical', 'Automatic failover to replica', '✅ Resolved'],
                      ['Token Expiry', 'Low', 'Silent refresh token flow', '✅ Resolved'],
                      ['Rate Limit Exceeded', 'Medium', 'Queue-based throttling', '🟡 Partial'],
                      ['File Upload Failure', 'Low', 'Chunked upload with resume', '⏳ Pending'],
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                        {row.map((cell, c) => (
                          <td key={c} style={{ padding: '0.55rem 0.6rem', fontWeight: c === 0 ? 600 : 400, color: c === 1 ? (cell === 'Critical' ? '#DC2626' : cell === 'Medium' ? '#F59E0B' : '#16A34A') : 'var(--text-main)' }}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );

        case 'approvals':
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>✍️ Approval Workflow</h2>
              <div style={ds.card}>
                <h3 style={ds.title}>Technical Sign-Off Chain</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', padding: '0.5rem 0' }}>
                  {['Solution Architect', 'Tech Lead', 'Security Team', 'DevOps Approval', 'Client Approval'].map((s, i) => (
                    <React.Fragment key={s}>
                      <div style={{ padding: '0.5rem 0.85rem', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, background: i < 2 ? 'rgba(22,163,74,0.1)' : 'rgba(37,99,235,0.08)', color: i < 2 ? '#16A34A' : '#2563EB', border: `1px solid ${i < 2 ? '#16A34A' : '#2563EB'}40` }}>{s}</div>
                      {i < 4 && <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>→</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          );

        case 'versions':
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>🔁 Version History</h2>
              <div style={ds.card}>
                {[
                  { ver: 'v3.1', date: '21 May 2026', author: 'DevOps Team', changes: 'API schema v2, monitoring alerts, K8s deployment config', current: true },
                  { ver: 'v3.0', date: '19 May 2026', author: 'Backend Lead', changes: 'Microservices refactor, database migration scripts', current: false },
                  { ver: 'v2.0', date: '15 May 2026', author: 'Solution Architect', changes: 'Initial SRS with core architecture and security specs', current: false },
                ].map((v, i) => (
                  <div key={i} style={{ padding: '0.85rem', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 800, color: v.current ? '#0891B2' : 'var(--text-main)', fontSize: '0.9rem' }}>{v.ver}</span>
                      {v.current && <span style={ds.badge('#0891B2')}>Current</span>}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{v.author} • {v.date}</div>
                    <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>{v.changes}</div>
                  </div>
                ))}
              </div>
            </div>
          );

        case 'attachments':
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>📎 Attachments</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {[
                  { name: 'Architecture Diagram.png', type: '🏗️', size: '3.8 MB' },
                  { name: 'API Swagger.yaml', type: '📄', size: '420 KB' },
                  { name: 'ER Diagram.pdf', type: '🗄️', size: '2.1 MB' },
                  { name: 'Load Test Results.xlsx', type: '⚡', size: '1.2 MB' },
                  { name: 'Security Audit.pdf', type: '🔒', size: '5.4 MB' },
                  { name: 'Deploy Runbook.md', type: '🚀', size: '180 KB' },
                ].map((f, i) => (
                  <div key={i} style={{ ...ds.card, display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                    <div style={{ fontSize: '1.5rem' }}>{f.type}</div>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>{f.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{f.size}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );

        case 'analytics':
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>📈 Executive Technical Analytics</h2>
              <div style={ds.card}>
                <h3 style={ds.title}>KPI Visualization</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {[
                    { label: 'Infrastructure Stability Index', pct: 84 },
                    { label: 'API Readiness Score', pct: 92 },
                    { label: 'Security Compliance Trend', pct: 72 },
                    { label: 'Deployment Success Rate', pct: 98 },
                    { label: 'System Reliability Score', pct: 89 },
                  ].map((k, i) => (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.2rem' }}>
                        <span>{k.label}</span><span style={{ color: k.pct > 70 ? '#16A34A' : k.pct > 40 ? '#F59E0B' : '#DC2626' }}>{k.pct}%</span>
                      </div>
                      <div style={{ height: '6px', background: 'var(--background)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${k.pct}%`, height: '100%', background: k.pct > 70 ? '#16A34A' : k.pct > 40 ? '#F59E0B' : '#DC2626', borderRadius: '3px' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );

        default:
          return <div style={{ padding: '2rem', color: 'var(--text-muted)', textAlign: 'center' }}>Select a section from the sidebar.</div>;
      }
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '842px', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', color: 'var(--text-main)', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1.25rem', background: 'var(--background)', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#0891B2', textTransform: 'uppercase', letterSpacing: '0.06em' }}>ENTERPRISE SYSTEM — SRS MANAGEMENT SYSTEM</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.1rem' }}>{documentTitle || 'Enterprise SRS'}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', width: '220px', outline: 'none' }} placeholder="🔍 Search APIs, services, schemas..." />
            {['Dashboard', 'Architecture', 'APIs', 'Monitoring'].map(tab => (
              <button key={tab} style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem', fontWeight: 600, borderRadius: '6px', border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}>{tab}</button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.75rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Product: <strong style={{ color: 'var(--text-main)' }}>Core System Platform</strong></span>
            <span style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 700, background: 'rgba(22,163,74,0.1)', color: '#16A34A' }}>🟢 Production Ready</span>
          </div>
        </div>
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <div style={{ width: '210px', borderRight: '1px solid var(--border)', background: 'var(--background)', display: 'flex', flexDirection: 'column', flexShrink: 0, overflowY: 'auto' }}>
            <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
              {sidebarItems.map(item => (
                <button key={item.id} onClick={() => setActiveSrsTab(item.id)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.65rem', textAlign: 'left', fontSize: '0.78rem', fontWeight: activeSrsTab === item.id ? 700 : 500, color: activeSrsTab === item.id ? '#0891B2' : 'var(--text-main)', background: activeSrsTab === item.id ? 'rgba(8,145,178,0.08)' : 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.15s', borderLeft: activeSrsTab === item.id ? '3px solid #0891B2' : '3px solid transparent' }}>
                  <span style={{ fontSize: '0.9rem' }}>{item.icon}</span> {item.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            {renderCenterContent()}
          </div>
          <div style={{ width: '230px', borderLeft: '1px solid var(--border)', background: 'var(--background)', display: 'flex', flexDirection: 'column', flexShrink: 0, padding: '1rem', gap: '1rem', overflowY: 'auto' }}>
            <div>
              <h4 style={{ fontSize: '0.7rem', fontWeight: 800, color: '#0891B2', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>✨ AI Engineering Insights</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {[
                  { msg: 'API validation missing on 3 endpoints', color: '#F59E0B' },
                  { msg: 'Database indexing needed: attendance_logs', color: '#DC2626' },
                  { msg: 'Deployment risk: staging config drift', color: '#DC2626' },
                  { msg: 'Security compliance score below 80%', color: '#F59E0B' },
                ].map((insight, i) => (
                  <div key={i} style={{ padding: '0.5rem', borderRadius: '6px', background: `${insight.color}08`, borderLeft: `3px solid ${insight.color}`, fontSize: '0.72rem', lineHeight: 1.35, color: 'var(--text-main)' }}>{insight.msg}</div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {['Generate TDD', 'Generate Test Cases', 'Generate APIs', 'AI Summary'].map(btn => (
                <button key={btn} style={{ width: '100%', padding: '0.45rem', fontSize: '0.72rem', fontWeight: 700, borderRadius: '6px', border: '1px solid #0891B230', background: 'rgba(8,145,178,0.06)', color: '#0891B2', cursor: 'pointer', textAlign: 'center' }}>{btn}</button>
              ))}
            </div>
            <div>
              <h4 style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>🕐 Recent Activity</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  { msg: 'API schema updated', time: '10m ago', color: '#0891B2' },
                  { msg: 'Deploy pipeline modified', time: '1h ago', color: '#F59E0B' },
                  { msg: 'Database migration added', time: '3h ago', color: '#16A34A' },
                  { msg: 'Monitoring alert triggered', time: '5h ago', color: '#DC2626' },
                  { msg: 'Security audit completed', time: 'Yesterday', color: '#9333EA' },
                ].map((act, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: act.color, flexShrink: 0, marginTop: '0.4rem' }} />
                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 600, lineHeight: 1.3 }}>{act.msg}</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{act.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };


    // ═══════════════════════════════════════════════════════════
  // ENTERPRISE TDD DASHBOARD - MASTER LAYOUT (PREMIUM SAAS)
  // ═══════════════════════════════════════════════════════════
    // ═══════════════════════════════════════════════════════════
  // SPRINT DASHBOARD - MASTER LAYOUT (PREMIUM SAAS)
  // ═══════════════════════════════════════════════════════════
  const renderSprintDashboard = () => {
    // Shared Design Tokens
    const ds = {
      card: {
        padding: '1.5rem',
        background: 'rgba(30, 41, 59, 0.65)',
        backdropFilter: 'blur(16px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        transition: 'all 0.3s ease',
      },
      cardHover: {
        transform: 'translateY(-2px)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
        borderColor: 'rgba(255, 255, 255, 0.15)',
      },
      gradientText: {
        background: 'linear-gradient(90deg, #38bdf8, #818cf8)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      },
      badge: (color: string) => ({
        padding: '0.2rem 0.6rem',
        borderRadius: '999px',
        fontSize: '0.65rem',
        fontWeight: 800,
        textTransform: 'uppercase' as any,
        letterSpacing: '0.05em',
        background: `${color}15`,
        color: color,
        border: `1px solid ${color}30`,
      })
    };

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minHeight: '100vh',
        background: '#0F172A',
        color: '#f8fafc',
        fontFamily: "'Inter', sans-serif",
      }}>
        {/* 1. TOP AGILE NAVIGATION */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1.25rem', background: 'var(--background)', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#0891B2', textTransform: 'uppercase', letterSpacing: '0.06em' }}>ENTERPRISE SYSTEM - SPRINT PLANNING SYSTEM</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.1rem' }}>{documentTitle || 'Sprint Planning'}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <input style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', width: '250px', outline: 'none' }} placeholder="🔍 Search stories, tasks, epics, bugs..." />
            {['Dashboard', 'Sprint Board', 'Backlog', 'Analytics', 'QA', 'Releases'].map(tab => (
              <button key={tab} style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem', fontWeight: 600, borderRadius: '6px', border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}>{tab}</button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-main)' }}>Sprint: Sprint 14</span>
              <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Duration: 14 Days</span>
            </div>
            <div style={{ ...ds.badge('#10b981'), display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.3rem 0.8rem', fontSize: '0.7rem' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
              Sprint Active
            </div>
            <button style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '0.4rem 1rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)' }}>
              Complete Sprint
            </button>
          </div>
        </div>

        {/* MAIN WORKSPACE GRID */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          
          {/* 2. LEFT SIDEBAR NAVIGATION */}
          <div style={{ width: '240px', background: 'var(--background)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            {[
              { group: 'Planning', items: ['Sprint Overview', 'Sprint Backlog', 'Team Capacity'] },
              { group: 'Execution', items: ['User Stories', 'Epics', 'Tasks', 'Bugs', 'Dependencies', 'Risks'] },
              { group: 'Tracking', items: ['Sprint Velocity', 'Burndown Chart', 'QA Status', 'Releases'] },
              { group: 'Review', items: ['Retrospectives', 'Reports', 'Analytics'] }
            ].map((grp, gi) => (
              <div key={gi} style={{ marginBottom: '1rem' }}>
                <div style={{ padding: '1rem 1rem 0.5rem', fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{grp.group}</div>
                {grp.items.map(item => (
                  <div 
                    key={item} 
                    onClick={() => setActiveSprintTab(item.toLowerCase().replace(/\s+/g, '-'))}
                    style={{ 
                      padding: '0.5rem 1rem', 
                      fontSize: '0.8rem', 
                      fontWeight: activeSprintTab === item.toLowerCase().replace(/\s+/g, '-') ? 700 : 500, 
                      color: activeSprintTab === item.toLowerCase().replace(/\s+/g, '-') ? 'var(--primary)' : 'var(--text-main)', 
                      background: activeSprintTab === item.toLowerCase().replace(/\s+/g, '-') ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
                      borderLeft: `3px solid ${activeSprintTab === item.toLowerCase().replace(/\s+/g, '-') ? 'var(--primary)' : 'transparent'}`,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.2s'
                    }}
                  >
                    <span style={{ fontSize: '0.85rem' }}>📌</span> {item}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* CENTER WORKSPACE */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', background: 'radial-gradient(circle at top right, rgba(30, 41, 59, 0.5), transparent 50%), #0F172A' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* HEADER */}
              <div>
                <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, ...ds.gradientText, letterSpacing: '-0.02em' }}>Sprint Execution Workspace</h1>
                <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '0.5rem' }}>Real-time agile command center for tracking sprint health, velocity, and delivery confidence.</p>
              </div>

              {/* 3. HERO KPI SECTION */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
                {[
                  { title: 'Total Tasks', value: documentMetrics.totalRequirements > 0 ? documentMetrics.totalRequirements.toString() : '248', icon: '📋', color: '#3b82f6', trend: '' },
                  { title: 'Completed', value: documentMetrics.approvedRequirements > 0 ? documentMetrics.approvedRequirements.toString() : '182', icon: '✅', color: '#10b981', trend: `${documentMetrics.completionPercentage}%` },
                  { title: 'In Progress', value: documentMetrics.totalRequirements > 0 ? (documentMetrics.totalRequirements - documentMetrics.approvedRequirements).toString() : '42', icon: '⏳', color: '#f59e0b', trend: '' },
                  { title: 'Blocked', value: documentMetrics.highRiskCount > 0 ? documentMetrics.highRiskCount.toString() : '8', icon: '🚫', color: '#ef4444', trend: '' },
                  { title: 'Canvas Blocks', value: documentMetrics.totalBlocks.toString(), icon: '🚀', color: '#8b5cf6', trend: '' }
                ].map((kpi, i) => (
                  <div key={i} style={{ ...ds.card, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: `2px solid ${kpi.color}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>{kpi.title}</span>
                      <span style={{ fontSize: '1.2rem', opacity: 0.8 }}>{kpi.icon}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc' }}>{kpi.value}</span>
                      <span style={{ fontSize: '0.7rem', color: kpi.color, fontWeight: 700 }}>{kpi.trend}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* 5. SPRINT HEALTH ANALYTICS */}
              <div style={{ ...ds.card, padding: '1.75rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  📈 Sprint Health Analytics
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[
                    { label: 'Sprint Completion', pct: 78, color: '#3b82f6' },
                    { label: 'Story Point Completion', pct: 72, color: '#8b5cf6' },
                    { label: 'QA Readiness', pct: 64, color: '#f59e0b' },
                    { label: 'Bug Resolution', pct: 70, color: '#10b981' },
                    { label: 'Deployment Readiness', pct: 82, color: '#0ea5e9' }
                  ].map((bar, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      <span style={{ width: '160px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>{bar.label}</span>
                      <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${bar.pct}%`, background: bar.color, borderRadius: '4px', boxShadow: `0 0 10px ${bar.color}60` }} />
                      </div>
                      <span style={{ width: '40px', fontSize: '0.8rem', fontWeight: 800, color: '#f8fafc', textAlign: 'right' }}>{bar.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ROW: SPRINT BOARD & DEPENDENCIES */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                
                {/* 4. SPRINT BOARD DASHBOARD (PREVIEW) */}
                <div style={{ ...ds.card, padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>📊 Agile Workflow Board</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}>View Full Board →</span>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', flex: 1 }}>
                    {[
                      { title: 'TODO', count: 12, color: '#94a3b8' },
                      { title: 'IN PROGRESS', count: 4, color: '#3b82f6', 
                        card: { id: 'SPR-ATT-102', task: 'Attendance API Integration', epic: 'Employee Attendance', priority: 'Critical', sp: 8, assignee: 'Backend Team', deps: 'Auth Service' }
                      },
                      { title: 'QA REVIEW', count: 3, color: '#f59e0b' },
                      { title: 'DONE', count: 18, color: '#10b981' }
                    ].map(col => (
                      <div key={col.title} style={{ background: 'rgba(15, 23, 42, 0.4)', borderRadius: '12px', padding: '0.75rem', border: '1px solid rgba(255,255,255,0.03)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.5rem', borderBottom: `2px solid ${col.color}40` }}>
                          <span style={{ fontSize: '0.65rem', fontWeight: 800, color: col.color, textTransform: 'uppercase' }}>{col.title}</span>
                          <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>{col.count}</span>
                        </div>
                        
                        {col.card && (
                          <div style={{ background: 'rgba(30, 41, 59, 0.8)', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', cursor: 'pointer' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)' }}>{col.card.id}</span>
                              <span style={{ ...ds.badge('#ef4444'), fontSize: '0.55rem', padding: '0.15rem 0.4rem' }}>{col.card.priority}</span>
                            </div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.5rem', lineHeight: 1.4 }}>{col.card.task}</div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Epic: {col.card.epic}</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.65rem', color: '#94a3b8', background: 'rgba(0,0,0,0.2)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>{col.card.assignee}</span>
                              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#3b82f6', background: '#3b82f620', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>{col.card.sp}</span>
                            </div>
                          </div>
                        )}
                        {!col.card && (
                          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '8px', opacity: 0.5 }}>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Drop tasks here</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 10. DEPENDENCY MANAGEMENT PANEL */}
                <div style={{ ...ds.card, padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    🔗 Dependency Risks
                  </h3>
                  
                  {/* Graph visualization abstraction */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '1rem', border: '1px solid rgba(255,255,255,0.03)' }}>
                    <div style={{ padding: '0.4rem 0.8rem', background: '#3b82f620', border: '1px solid #3b82f640', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, color: '#3b82f6' }}>Attendance Module</div>
                    <div style={{ color: 'var(--text-muted)' }}>↓</div>
                    <div style={{ padding: '0.4rem 0.8rem', background: '#ef444420', border: '1px solid #ef444440', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, color: '#ef4444' }}>Auth Service (Risk)</div>
                    <div style={{ color: 'var(--text-muted)' }}>↓</div>
                    <div style={{ padding: '0.4rem 0.8rem', background: '#10b98120', border: '1px solid #10b98140', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, color: '#10b981' }}>Payroll Engine</div>
                  </div>

                  <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1rem', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ef4444' }}>RISK: Auth API Delay</span>
                      <span style={{ ...ds.badge('#ef4444'), fontSize: '0.55rem' }}>HIGH IMPACT</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>Affected Tasks: 12</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mitigation: Parallel mock API development</div>
                  </div>
                </div>
              </div>

              {/* ROW: TEAM CAPACITY & EPIC PROGRESS */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                
                {/* 6. TEAM CAPACITY DASHBOARD */}
                <div style={{ ...ds.card, padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>👥 Team Capacity</h3>
                  
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem' }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'left', padding: '0.5rem', fontSize: '0.7rem', color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Team Member</th>
                        <th style={{ textAlign: 'left', padding: '0.5rem', fontSize: '0.7rem', color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Capacity</th>
                        <th style={{ textAlign: 'left', padding: '0.5rem', fontSize: '0.7rem', color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Assigned</th>
                        <th style={{ textAlign: 'left', padding: '0.5rem', fontSize: '0.7rem', color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Remaining</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'Developer A', cap: '40 hrs', ass: '32 hrs', rem: '8 hrs', status: 'optimal' },
                        { name: 'Developer B', cap: '40 hrs', ass: '38 hrs', rem: '2 hrs', status: 'warning' },
                        { name: 'QA Engineer', cap: '35 hrs', ass: '22 hrs', rem: '13 hrs', status: 'optimal' }
                      ].map((row, i) => (
                        <tr key={i}>
                          <td style={{ padding: '0.75rem 0.5rem', fontSize: '0.8rem', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.02)' }}>{row.name}</td>
                          <td style={{ padding: '0.75rem 0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>{row.cap}</td>
                          <td style={{ padding: '0.75rem 0.5rem', fontSize: '0.8rem', color: 'var(--text-main)', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>{row.ass}</td>
                          <td style={{ padding: '0.75rem 0.5rem', fontSize: '0.8rem', color: row.status === 'warning' ? '#f59e0b' : '#10b981', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.02)' }}>{row.rem}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Workload Visualization</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {[
                      { team: 'Frontend Team', pct: 65, color: '#3b82f6' },
                      { team: 'Backend Team', pct: 95, color: '#ef4444' }, // Overloaded
                      { team: 'QA Team', pct: 45, color: '#10b981' }
                    ].map(w => (
                      <div key={w.team} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ width: '90px', fontSize: '0.75rem', color: 'var(--text-main)' }}>{w.team}</span>
                        <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                          <div style={{ width: `${w.pct}%`, height: '100%', background: w.color, borderRadius: '3px' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 8. EPIC MANAGEMENT DASHBOARD */}
                <div style={{ ...ds.card, padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>🎯 Epic Progress</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {[
                      { title: 'Employee Attendance Epic', stories: 18, pct: 82, bugs: 4, qa: 'Active', color: '#8b5cf6' },
                      { title: 'Core Payroll Engine', stories: 24, pct: 45, bugs: 12, qa: 'Pending', color: '#f59e0b' }
                    ].map((epic, i) => (
                      <div key={i} style={{ padding: '1.25rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>{epic.title}</span>
                          <span style={{ ...ds.badge(epic.color) }}>{epic.pct}% Done</span>
                        </div>
                        
                        <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', marginBottom: '1rem' }}>
                          <div style={{ width: `${epic.pct}%`, height: '100%', background: epic.color, borderRadius: '3px', boxShadow: `0 0 8px ${epic.color}80` }} />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          <span>Stories: <strong style={{ color: 'var(--text-main)' }}>{epic.stories}</strong></span>
                          <span>Bugs: <strong style={{ color: '#ef4444' }}>{epic.bugs}</strong></span>
                          <span>QA Status: <strong style={{ color: epic.qa === 'Active' ? '#10b981' : '#f59e0b' }}>{epic.qa}</strong></span>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem' }}>
                          <button style={{ flex: 1, padding: '0.4rem', fontSize: '0.7rem', fontWeight: 600, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'var(--text-main)', cursor: 'pointer' }}>Open Epic</button>
                          <button style={{ flex: 1, padding: '0.4rem', fontSize: '0.7rem', fontWeight: 600, background: `${epic.color}20`, border: `1px solid ${epic.color}40`, borderRadius: '6px', color: epic.color, cursor: 'pointer' }}>View Stories</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 11 & 12. BUGS & QA READINESS */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
                <div style={{ ...ds.card, padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>🐞 Bug Metrics</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {[
                      { label: 'Critical Bugs', count: 3, color: '#ef4444' },
                      { label: 'High Priority', count: 6, color: '#f97316' },
                      { label: 'Medium Priority', count: 7, color: '#f59e0b' },
                      { label: 'Low Priority', count: 4, color: '#3b82f6' }
                    ].map(bug => (
                      <div key={bug.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: bug.color }} />
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{bug.label}</span>
                        </div>
                        <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)' }}>{bug.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ ...ds.card, padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>✅ Release Readiness</h3>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    {[
                      { step: 'Development', status: 'done' },
                      { step: 'Code Review', status: 'done' },
                      { step: 'QA Testing', status: 'active' },
                      { step: 'UAT', status: 'pending' },
                      { step: 'Release', status: 'pending' }
                    ].map((step, i, arr) => (
                      <React.Fragment key={step.step}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ 
                            width: '32px', height: '32px', borderRadius: '50%', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: step.status === 'done' ? '#10b98120' : step.status === 'active' ? '#3b82f620' : 'rgba(255,255,255,0.05)',
                            border: `2px solid ${step.status === 'done' ? '#10b981' : step.status === 'active' ? '#3b82f6' : 'rgba(255,255,255,0.1)'}`,
                            color: step.status === 'done' ? '#10b981' : step.status === 'active' ? '#3b82f6' : 'var(--text-muted)'
                          }}>
                            {step.status === 'done' ? '✓' : i + 1}
                          </div>
                          <span style={{ fontSize: '0.7rem', fontWeight: step.status === 'active' ? 700 : 600, color: step.status === 'active' ? '#f8fafc' : 'var(--text-muted)' }}>{step.step}</span>
                        </div>
                        {i < arr.length - 1 && (
                          <div style={{ flex: 1, height: '2px', background: step.status === 'done' ? '#10b981' : 'rgba(255,255,255,0.1)', margin: '0 0.5rem', position: 'relative', top: '-10px' }} />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* 14. RIGHT AI AGILE PANEL */}
          <div style={{ width: '320px', background: 'var(--surface)', borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.25rem' }}>✨</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '0.02em', textTransform: 'uppercase' }}>AI Agile Insights</span>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Automated Insights */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { text: 'Backend team capacity low (95% usage)', type: 'warning', icon: '⚠️' },
                  { text: '4 stories blocked by Auth API', type: 'error', icon: '⛔' },
                  { text: 'QA delay risk identified in Payroll', type: 'warning', icon: '⚠️' },
                  { text: 'Sprint velocity on track', type: 'success', icon: '✅' }
                ].map((insight, i) => (
                  <div key={i} style={{ 
                    padding: '0.75rem', 
                    background: `rgba(${insight.type === 'error' ? '239, 68, 68' : insight.type === 'warning' ? '245, 158, 11' : '16, 185, 129'}, 0.1)`, 
                    borderLeft: `3px solid ${insight.type === 'error' ? '#ef4444' : insight.type === 'warning' ? '#f59e0b' : '#10b981'}`,
                    borderRadius: '0 6px 6px 0',
                    fontSize: '0.75rem',
                    color: 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem'
                  }}>
                    <span>{insight.icon}</span>
                    <span>{insight.text}</span>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div>
                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>AI Copilot Actions</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
                  {['Generate Tasks from Epic', 'Generate Test Cases', 'Generate Sprint Summary', 'AI Retrospective Draft'].map(action => (
                    <button key={action} style={{ padding: '0.6rem 0.75rem', fontSize: '0.75rem', fontWeight: 600, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: 'var(--text-main)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'var(--primary)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}>
                      ✦ {action}
                    </button>
                  ))}
                </div>
              </div>

              {/* 15. RECENT ACTIVITY */}
              <div>
                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Recent Sprint Activity</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '11px', top: '10px', bottom: '10px', width: '2px', background: 'rgba(255,255,255,0.05)', zIndex: 0 }} />
                  {[
                    { title: 'Story approved by QA', time: '10m ago', icon: '✓', color: '#10b981' },
                    { title: 'Sprint scope updated', time: '1h ago', icon: '📋', color: '#3b82f6' },
                    { title: 'Bug fixed in Payroll', time: '3h ago', icon: '🐛', color: '#10b981' },
                    { title: 'API integration completed', time: '5h ago', icon: '⚡', color: '#f59e0b' }
                  ].map((act, i) => (
                    <div key={i} style={{ display: 'flex', gap: '1rem', position: 'relative', zIndex: 1 }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--surface)', border: `2px solid ${act.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: act.color, flexShrink: 0 }}>
                        {act.icon}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-main)' }}>{act.title}</span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{act.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  };


  const renderTddDashboard = () => {
    const sidebarGroups = [
      {
        title: 'OVERVIEW',
        items: [
          { id: 'overview', icon: '⚡', label: 'Technical Overview' },
          { id: 'architecture', icon: '🏗️', label: 'Architecture Design' },
          { id: 'components', icon: '📦', label: 'Components' },
        ]
      },
      {
        title: 'DESIGN & SERVICES',
        items: [
          { id: 'services', icon: '🧩', label: 'Services' },
          { id: 'apis', icon: '🔗', label: 'APIs' },
          { id: 'database', icon: '🗄️', label: 'Database Design' },
          { id: 'flows', icon: '🔄', label: 'Sequence Flows' },
          { id: 'security', icon: '🛡️', label: 'Security Design' },
        ]
      },
      {
        title: 'OPERATIONS',
        items: [
          { id: 'scalability', icon: '📈', label: 'Scalability' },
          { id: 'infrastructure', icon: '🖥️', label: 'Infrastructure' },
          { id: 'deployment', icon: '🚀', label: 'Deployment' },
          { id: 'monitoring', icon: '📡', label: 'Monitoring' },
          { id: 'error', icon: '🐛', label: 'Error Handling' },
        ]
      },
      {
        title: 'MANAGEMENT',
        items: [
          { id: 'dependencies', icon: '🔗', label: 'Dependencies' },
          { id: 'cicd', icon: '⚙️', label: 'CI/CD' },
          { id: 'analytics', icon: '📊', label: 'Analytics' },
        ]
      }
    ];

    const ds = {
      card: {
        padding: '1.5rem',
        background: 'rgba(30, 41, 59, 0.65)',
        backdropFilter: 'blur(16px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        position: 'relative' as const,
        overflow: 'hidden' as const
      },
      cardHover: {
        transform: 'translateY(-2px)',
        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.6), 0 0 20px rgba(37, 99, 235, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
      },
      title: {
        fontSize: '0.95rem',
        fontWeight: 700,
        color: '#f8fafc',
        marginBottom: '1rem',
        letterSpacing: '0.02em',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      },
      gradientText: {
        background: 'linear-gradient(135deg, #60a5fa, #c084fc)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      },
      badge: (color: string) => ({ fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: '4px', background: `${color}15`, color, textTransform: 'uppercase' as const, letterSpacing: '0.03em' })
    };

    const renderSparkline = (color: string, points: string) => (
      <svg viewBox="0 0 100 30" style={{ width: '80px', height: '24px', overflow: 'visible' }}>
        <path d={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d={`${points} L100,30 L0,30 Z`} fill={`url(#gradient-${color.replace('#','')})`} opacity="0.2" />
        <defs>
          <linearGradient id={`gradient-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    );

    const renderCenterContent = () => {
      switch (activeTddTab) {
        case 'overview':
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }} className="animate-fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <div style={{ padding: '0.25rem 0.75rem', background: 'rgba(37, 99, 235, 0.15)', border: '1px solid rgba(37, 99, 235, 0.3)', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Production
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>
                      <div className="pulse-dot" style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981' }} />
                      Engineering Active
                    </div>
                  </div>
                  <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: '#f8fafc', letterSpacing: '-0.02em' }}>ENTERPRISE SYSTEM</h2>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.35rem' }}>Client: ABC Industries • Product: Core System Platform</p>
                </div>
              </div>

              {/* HERO KPI CARDS */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
                {[
                  { label: 'System Components', val: '84', color: '#60a5fa', icon: '📦', trend: '+12% ↗', sparkline: 'M0,20 L20,15 L40,18 L60,10 L80,12 L100,5' },
                  { label: 'APIs Designed', val: '132', color: '#c084fc', icon: '🔗', trend: '+4% ↗', sparkline: 'M0,15 L20,15 L40,10 L60,12 L80,5 L100,2' },
                  { label: 'Active Services', val: '16', color: '#34d399', icon: '⚙️', trend: 'Stable ➔', sparkline: 'M0,10 L20,12 L40,10 L60,11 L80,10 L100,10' },
                  { label: 'Sequence Flows', val: '42', color: '#fbbf24', icon: '🔄', trend: '+2% ↗', sparkline: 'M0,25 L20,20 L40,15 L60,18 L80,10 L100,8' },
                  { label: 'Technical Risks', val: '5', color: '#f87171', icon: '⚠️', trend: '-2% ↘', sparkline: 'M0,5 L20,10 L40,8 L60,15 L80,18 L100,25' },
                ].map((kpi, i) => (
                  <div key={i} className="dashboard-hover-card" style={ds.card} onMouseEnter={(e) => Object.assign(e.currentTarget.style, ds.cardHover)} onMouseLeave={(e) => Object.assign(e.currentTarget.style, { transform: 'translateY(0)', boxShadow: ds.card.boxShadow })}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${kpi.color}00, ${kpi.color}, ${kpi.color}00)` }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ fontSize: '1.25rem', background: 'rgba(255,255,255,0.05)', padding: '0.4rem', borderRadius: '8px' }}>{kpi.icon}</div>
                      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: kpi.color, background: `${kpi.color}15`, padding: '0.2rem 0.5rem', borderRadius: '12px' }}>{kpi.trend}</div>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1.2, marginTop: '0.75rem' }}>{kpi.val}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, marginTop: '0.1rem', marginBottom: '0.75rem' }}>{kpi.label}</div>
                    <div>{renderSparkline(kpi.color, kpi.sparkline)}</div>
                  </div>
                ))}
              </div>

              {/* ARCHITECTURE NODE GRAPH & HEALTH */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}>
                <div style={ds.card} className="dashboard-hover-card">
                  <h3 style={ds.title}>
                    <span style={{ color: '#60a5fa' }}>🏗️</span> System Architecture Topology
                  </h3>
                  <div style={{ width: '100%', height: '280px', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden', padding: '1rem' }}>
                    {/* Mock React Flow Nodes */}
                    <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', padding: '0.5rem 1rem', background: 'rgba(30, 41, 59, 0.9)', border: '1px solid rgba(96, 165, 250, 0.5)', borderRadius: '8px', zIndex: 2, display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                      <span style={{ fontSize: '1.2rem' }}>🌐</span> <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Frontend (React)</span>
                    </div>
                    
                    <div style={{ position: 'absolute', top: '35%', left: '50%', transform: 'translateX(-50%)', padding: '0.5rem 1rem', background: 'rgba(30, 41, 59, 0.9)', border: '1px solid rgba(192, 132, 252, 0.5)', borderRadius: '8px', zIndex: 2, display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                      <span style={{ fontSize: '1.2rem' }}>🚪</span> <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>API Gateway</span>
                    </div>

                    <div style={{ position: 'absolute', top: '65%', left: '25%', transform: 'translateX(-50%)', padding: '0.5rem 1rem', background: 'rgba(30, 41, 59, 0.9)', border: '1px solid rgba(52, 211, 153, 0.5)', borderRadius: '8px', zIndex: 2, display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                      <span style={{ fontSize: '1.2rem' }}>🔐</span> <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Auth Service</span>
                      <div className="pulse-dot" style={{ width: '6px', height: '6px', background: '#34d399', borderRadius: '50%' }} />
                    </div>

                    <div style={{ position: 'absolute', top: '65%', left: '75%', transform: 'translateX(-50%)', padding: '0.5rem 1rem', background: 'rgba(30, 41, 59, 0.9)', border: '1px solid rgba(52, 211, 153, 0.5)', borderRadius: '8px', zIndex: 2, display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                      <span style={{ fontSize: '1.2rem' }}>💼</span> <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Business Logic</span>
                      <div className="pulse-dot" style={{ width: '6px', height: '6px', background: '#fbbf24', borderRadius: '50%' }} />
                    </div>

                    <div style={{ position: 'absolute', top: '90%', left: '50%', transform: 'translateX(-50%)', padding: '0.5rem 1rem', background: 'rgba(30, 41, 59, 0.9)', border: '1px solid rgba(248, 113, 113, 0.5)', borderRadius: '8px', zIndex: 2, display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                      <span style={{ fontSize: '1.2rem' }}>🗄️</span> <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>PostgreSQL Cluster</span>
                    </div>

                    {/* SVG Connections */}
                    <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}>
                      <path d="M 50% 18% L 50% 35%" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeDasharray="4 4" />
                      <path d="M 50% 45% L 25% 65%" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" />
                      <path d="M 50% 45% L 75% 65%" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" />
                      <path d="M 25% 75% L 50% 90%" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" />
                      <path d="M 75% 75% L 50% 90%" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" />
                    </svg>
                  </div>
                </div>

                <div style={ds.card} className="dashboard-hover-card">
                  <h3 style={ds.title}>
                    <span style={{ color: '#c084fc' }}>📊</span> Technical Health
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '140px', position: 'relative' }}>
                    <svg viewBox="0 0 36 36" style={{ width: '120px', height: '120px' }}>
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#60a5fa" strokeWidth="3" strokeDasharray="91, 100" strokeLinecap="round" className="animate-dash" />
                    </svg>
                    <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1 }}>91</span>
                      <span style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Health Score</span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1rem' }}>
                    {[
                      { label: 'API Stability Index', pct: 98, color: '#34d399' },
                      { label: 'Dependency Risk', pct: 12, color: '#fbbf24' },
                      { label: 'Deployment Readiness', pct: 85, color: '#60a5fa' },
                    ].map((h, i) => (
                      <div key={i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.3rem', color: '#cbd5e1' }}>
                          <span>{h.label}</span><span style={{ color: h.color }}>{h.pct}%</span>
                        </div>
                        <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${h.pct}%`, height: '100%', background: h.color, borderRadius: '3px', boxShadow: `0 0 8px ${h.color}` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* DATA TABLES */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div style={ds.card} className="dashboard-hover-card">
                  <h3 style={ds.title}>
                    <span style={{ color: '#34d399' }}>⚙️</span> Component Matrix
                  </h3>
                  <table style={{ width: '100%', fontSize: '0.8rem', textAlign: 'left', borderCollapse: 'collapse', color: '#cbd5e1' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <th style={{ padding: '0.75rem 0', color: '#94a3b8', fontWeight: 600 }}>Component</th>
                        <th style={{ padding: '0.75rem 0', color: '#94a3b8', fontWeight: 600 }}>Type</th>
                        <th style={{ padding: '0.75rem 0', color: '#94a3b8', fontWeight: 600 }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}><td style={{ padding: '0.75rem 0', fontWeight: 500 }}>Auth Engine</td><td>Core Service</td><td><span style={{ ...ds.badge('#34d399') }}>Stable</span></td></tr>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}><td style={{ padding: '0.75rem 0', fontWeight: 500 }}>Payroll Processor</td><td>Business Logic</td><td><span style={{ ...ds.badge('#fbbf24') }}>Review</span></td></tr>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}><td style={{ padding: '0.75rem 0', fontWeight: 500 }}>Notification Queue</td><td>Async Service</td><td><span style={{ ...ds.badge('#60a5fa') }}>Ready</span></td></tr>
                      <tr><td style={{ padding: '0.75rem 0', fontWeight: 500 }}>Analytics Engine</td><td>Reporting</td><td><span style={{ ...ds.badge('#c084fc') }}>Draft</span></td></tr>
                    </tbody>
                  </table>
                </div>

                <div style={ds.card} className="dashboard-hover-card">
                  <h3 style={ds.title}>
                    <span style={{ color: '#f87171' }}>🗄️</span> Database Schema Mapping
                  </h3>
                  <table style={{ width: '100%', fontSize: '0.8rem', textAlign: 'left', borderCollapse: 'collapse', color: '#cbd5e1' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <th style={{ padding: '0.75rem 0', color: '#94a3b8', fontWeight: 600 }}>Table Name</th>
                        <th style={{ padding: '0.75rem 0', color: '#94a3b8', fontWeight: 600 }}>Purpose</th>
                        <th style={{ padding: '0.75rem 0', color: '#94a3b8', fontWeight: 600 }}>Size</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}><td style={{ padding: '0.75rem 0', fontFamily: 'monospace' }}>employees</td><td>Employee master</td><td>4.2 GB</td></tr>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}><td style={{ padding: '0.75rem 0', fontFamily: 'monospace' }}>attendance_logs</td><td>Attendance tracking</td><td>18.5 GB</td></tr>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}><td style={{ padding: '0.75rem 0', fontFamily: 'monospace' }}>payroll_records</td><td>Salary processing</td><td>2.1 GB</td></tr>
                      <tr><td style={{ padding: '0.75rem 0', fontFamily: 'monospace' }}>audit_trails</td><td>Security logging</td><td>42.8 GB</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        default:
          return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px', color: '#94a3b8' }}>
              <div style={{ fontSize: '3rem', opacity: 0.5, marginBottom: '1rem' }}>🚧</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#f8fafc' }}>Module In Progress</h3>
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>The {activeTddTab} dashboard is currently being engineered.</p>
            </div>
          );
      }
    };

    return (
      <div style={{ display: 'flex', width: '100%', height: '100%', background: '#0f172a', color: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>
        {/* INJECT KEYFRAMES FOR PULSE */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes pulse-ring {
            0% { transform: scale(0.8); opacity: 0.8; }
            100% { transform: scale(2.4); opacity: 0; }
          }
          .pulse-dot {
            position: relative;
          }
          .pulse-dot::before {
            content: '';
            position: absolute;
            left: 0; top: 0;
            width: 100%; height: 100%;
            background-color: inherit;
            border-radius: 50%;
            z-index: -1;
            animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
          }
        `}} />

        {/* LEFT NAV */}
        <div style={{ width: '260px', borderRight: '1px solid rgba(255,255,255,0.05)', background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(20px)', padding: '1.5rem', overflowY: 'auto' }}>
          {sidebarGroups.map((group, idx) => (
            <div key={idx} style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem', position: 'sticky', top: 0, background: '#0f172a', padding: '0.25rem 0', zIndex: 10 }}>
                {group.title}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {group.items.map(item => (
                  <button key={item.id} onClick={() => setActiveTddTab(item.id)} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0.75rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: activeTddTab === item.id ? 600 : 500, color: activeTddTab === item.id ? '#f8fafc' : '#94a3b8', background: activeTddTab === item.id ? 'linear-gradient(90deg, rgba(37,99,235,0.15) 0%, transparent 100%)' : 'transparent', border: 'none', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s', borderLeft: activeTddTab === item.id ? '3px solid #60a5fa' : '3px solid transparent' }}>
                    <span style={{ fontSize: '1rem', opacity: activeTddTab === item.id ? 1 : 0.6 }}>{item.icon}</span> {item.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CENTER CONTENT */}
        <div style={{ flex: 1, padding: '2rem 2.5rem', overflowY: 'auto', background: 'radial-gradient(circle at top right, rgba(30, 64, 175, 0.05) 0%, transparent 50%)' }}>
          {renderCenterContent()}
        </div>

        {/* RIGHT PANEL - AI & Monitoring */}
        <div style={{ width: '320px', borderLeft: '1px solid rgba(255,255,255,0.05)', background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(20px)', padding: '1.5rem', overflowY: 'auto' }}>
          <div style={ds.card} className="dashboard-hover-card">
            <h3 style={{ ...ds.title, fontSize: '0.85rem' }}>
              <span style={{ color: '#c084fc' }}>🧠</span> AI CO-PILOT INSIGHTS
            </h3>
            
            {/* Critical Insight */}
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', padding: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <div className="pulse-dot" style={{ width: '6px', height: '6px', background: '#ef4444', borderRadius: '50%' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ef4444', textTransform: 'uppercase' }}>Critical Risk</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#fca5a5', margin: 0 }}>Unencrypted JWT transmission detected in Auth Flow.</p>
              <button style={{ background: 'rgba(239,68,68,0.2)', border: 'none', color: '#fecaca', fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '4px', marginTop: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>Fix Automatically</button>
            </div>

            {/* Warning Insight */}
            <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '8px', padding: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <div style={{ width: '6px', height: '6px', background: '#f59e0b', borderRadius: '50%' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase' }}>Optimization</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#fcd34d', margin: 0 }}>Database schema missing indexes on employee_id.</p>
              <button style={{ background: 'rgba(245,158,11,0.2)', border: 'none', color: '#fde68a', fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '4px', marginTop: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>Generate Migration</button>
            </div>

            <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '1rem 0' }} />
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {['Generate SRS Document', 'Generate Swagger APIs', 'Generate Test Cases'].map(btn => (
                <button key={btn} style={{ width: '100%', padding: '0.6rem', fontSize: '0.75rem', fontWeight: 600, color: '#c084fc', background: 'rgba(192,132,252,0.1)', border: '1px solid rgba(192,132,252,0.2)', borderRadius: '6px', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(192,132,252,0.2)'} onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(192,132,252,0.1)'}>
                  ✨ {btn}
                </button>
              ))}
            </div>
          </div>

          <div style={{ ...ds.card, marginTop: '1.25rem' }} className="dashboard-hover-card">
            <h3 style={{ ...ds.title, fontSize: '0.85rem' }}>
              <span style={{ color: '#34d399' }}>📡</span> ACTIVE OPERATIONS
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '0.75rem' }}>
              {[
                { msg: 'PROD Deployment #442', status: 'In Progress', color: '#60a5fa' },
                { msg: 'Nightly Backup Sync', status: 'Completed', color: '#34d399' },
                { msg: 'Auth Service Latency', status: 'Warning', color: '#fbbf24' },
                { msg: 'Payment Gateway', status: 'Degraded', color: '#f87171' },
              ].map((act, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: act.color, flexShrink: 0 }} className={act.status === 'In Progress' ? 'pulse-dot' : ''} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#e2e8f0' }}>{act.msg}</div>
                    <div style={{ fontSize: '0.65rem', color: act.color, fontWeight: 700, textTransform: 'uppercase' }}>{act.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };


  // ═══════════════════════════════════════════════════════════
  // ENTERPRISE FRD DASHBOARD - MASTER LAYOUT
  // ═══════════════════════════════════════════════════════════
  const renderFrdDashboard = () => {
    const sidebarItems = [
      { id: 'overview', icon: '📊', label: 'FRD Overview' },
      { id: 'modules', icon: '📦', label: 'Requirement Modules' },
      { id: 'functional', icon: '⚙️', label: 'Functional Requirements' },
      { id: 'userstories', icon: '👤', label: 'User Stories' },
      { id: 'businessrules', icon: '📜', label: 'Business Rules' },
      { id: 'workflows', icon: '🔄', label: 'Workflow Mapping' },
      { id: 'apis', icon: '🔗', label: 'API Specifications' },
      { id: 'database', icon: '🗄️', label: 'Database Mapping' },
      { id: 'validation', icon: '✅', label: 'Validation Rules' },
      { id: 'reports', icon: '📈', label: 'Reports' },
      { id: 'approvals', icon: '✍️', label: 'Approvals' },
      { id: 'versions', icon: '🔁', label: 'Version History' },
      { id: 'attachments', icon: '📎', label: 'Attachments' },
      { id: 'analytics', icon: '📉', label: 'Analytics' },
    ];



    const ds = {
      card: { padding: '1.25rem', background: 'var(--surface)', borderRadius: '14px', border: '1px solid var(--border)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' } as React.CSSProperties,
      title: { fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' } as React.CSSProperties,
      badge: (color: string) => ({ fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: '4px', background: `${color}15`, color, textTransform: 'uppercase' as const, letterSpacing: '0.03em' }),
    };

    const renderCenterContent = () => {
      switch (activeFrdTab) {
        // ── FRD OVERVIEW ──
        case 'overview':
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>{documentTitle || 'FRD Dashboard'}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>Functional Requirement Intelligence • Real-time Feature Visibility</p>
              </div>
              {/* KPI Hero Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.85rem' }}>
                {[
                  { label: 'Total Features', val: '582', color: '#2563EB', icon: '📋' },
                  { label: 'Approved', val: '412', color: '#16A34A', icon: '✅' },
                  { label: 'Pending Review', val: '96', color: '#F59E0B', icon: '⏳' },
                  { label: 'Under Development', val: '74', color: '#9333EA', icon: '🔧' },
                  { label: 'Issues / Gaps', val: '12', color: '#DC2626', icon: '⚠️' },
                ].map((kpi, i) => (
                  <div key={i} style={{ ...ds.card, position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: kpi.color }} />
                    <div style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>{kpi.icon}</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 900, color: kpi.color, lineHeight: 1 }}>{kpi.val}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '0.3rem' }}>{kpi.label}</div>
                  </div>
                ))}
              </div>
              {/* FRD Health Analytics */}
              <div style={ds.card}>
                <h3 style={ds.title}>📈 FRD Health Analytics</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                  {[
                    { label: 'Requirement Coverage', pct: 89, color: '#2563EB' },
                    { label: 'Business Rule Coverage', pct: 76, color: '#16A34A' },
                    { label: 'Workflow Completeness', pct: 68, color: '#F59E0B' },
                    { label: 'Data Mapping Coverage', pct: 72, color: '#9333EA' },
                    { label: 'API Specification', pct: 64, color: '#0891B2' },
                    { label: 'Overall FRD Readiness', pct: 78, color: '#DC2626' },
                  ].map((h, i) => (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.2rem' }}>
                        <span>{h.label}</span>
                        <span style={{ color: h.color }}>{h.pct}%</span>
                      </div>
                      <div style={{ height: '8px', background: 'var(--background)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${h.pct}%`, height: '100%', background: h.color, borderRadius: '4px', transition: 'width 0.8s ease' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Priority Matrix */}
              <div style={ds.card}>
                <h3 style={ds.title}>🎯 Priority Matrix</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[
                    { label: 'Critical', count: 18, pct: 85, color: '#DC2626' },
                    { label: 'High', count: 42, pct: 70, color: '#F59E0B' },
                    { label: 'Medium', count: 28, pct: 50, color: '#2563EB' },
                    { label: 'Low', count: 12, pct: 30, color: '#94A3B8' },
                  ].map((p, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, width: '60px', color: p.color }}>{p.label}</span>
                      <div style={{ flex: 1, height: '10px', background: 'var(--background)', borderRadius: '5px', overflow: 'hidden' }}>
                        <div style={{ width: `${p.pct}%`, height: '100%', background: p.color, borderRadius: '5px' }} />
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', width: '30px' }}>{p.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );

        // ── REQUIREMENT MODULES ──
        case 'modules':
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>📦 FRD Template Grid</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                {[
                  { name: 'Attendance Management FRD', features: 72, apis: 14, status: 'Approved', pct: 92, color: '#16A34A', date: 'Today' },
                  { name: 'Payroll Processing FRD', features: 94, apis: 21, status: 'In Review', pct: 71, color: '#F59E0B', date: '2h ago' },
                  { name: 'Leave Management FRD', features: 48, apis: 9, status: 'Draft', pct: 45, color: '#2563EB', date: 'Yesterday' },
                  { name: 'Employee Self-Service FRD', features: 36, apis: 8, status: 'Approved', pct: 88, color: '#16A34A', date: '18 May' },
                ].map((t, i) => (
                  <div key={i} style={{ ...ds.card, display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>{t.name}</h4>
                      <span style={ds.badge(t.color)}>{t.status}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      <span>Features: <strong style={{ color: 'var(--text-main)' }}>{t.features}</strong></span>
                      <span>APIs: <strong style={{ color: 'var(--text-main)' }}>{t.apis}</strong></span>
                      <span>Updated: <strong style={{ color: 'var(--text-main)' }}>{t.date}</strong></span>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '0.2rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Progress</span>
                        <span style={{ fontWeight: 700, color: t.color }}>{t.pct}%</span>
                      </div>
                      <div style={{ height: '6px', background: 'var(--background)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${t.pct}%`, height: '100%', background: t.color, borderRadius: '3px' }} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {['Open', 'Review', 'Export'].map(a => (
                        <button key={a} style={{ flex: 1, padding: '0.35rem', fontSize: '0.7rem', fontWeight: 600, borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text-main)', cursor: 'pointer' }}>{a}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );

        // ── FUNCTIONAL REQUIREMENTS ──
        case 'functional':
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>⚙️ Feature Status Board</h2>
              {/* Kanban Headers */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.6rem' }}>
                {[
                  { label: 'Backlog', color: '#94A3B8', count: 8 },
                  { label: 'Analysis', color: '#9333EA', count: 5 },
                  { label: 'Review', color: '#F59E0B', count: 6 },
                  { label: 'Development', color: '#2563EB', count: 12 },
                  { label: 'QA', color: '#0891B2', count: 4 },
                  { label: 'Release', color: '#16A34A', count: 3 },
                ].map((col, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.5rem', background: `${col.color}10`, borderRadius: '8px', border: `1px solid ${col.color}25` }}>
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: col.color }} />
                    <span style={{ fontSize: '0.7rem', fontWeight: 700 }}>{col.label}</span>
                    <span style={{ marginLeft: 'auto', fontSize: '0.6rem', fontWeight: 800, color: col.color }}>{col.count}</span>
                  </div>
                ))}
              </div>
              {/* Requirement Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                {[
                  { id: 'FRD-PAY-102', name: 'Automated Payroll Calculation', module: 'Payroll', priority: 'Critical', coverage: '84%', deps: 'Attendance Service, Tax Engine API', team: 'Backend Engineering', status: 'Pending' },
                  { id: 'FRD-ATT-201', name: 'GPS Attendance Check-in', module: 'Attendance', priority: 'Critical', coverage: '92%', deps: 'Location Service, Network API', team: 'Mobile Team', status: 'Approved' },
                  { id: 'FRD-LVE-301', name: 'Multi-Level Leave Workflow', module: 'Leave', priority: 'High', coverage: '76%', deps: 'Notification Service', team: 'Full-Stack Team', status: 'In Review' },
                  { id: 'FRD-RPT-401', name: 'Custom Report Builder', module: 'Reports', priority: 'Medium', coverage: '58%', deps: 'Data Warehouse', team: 'Analytics Team', status: 'Draft' },
                ].map((req, i) => (
                  <div key={i} style={{ ...ds.card, borderLeft: `4px solid ${req.priority === 'Critical' ? '#DC2626' : req.priority === 'High' ? '#F59E0B' : '#2563EB'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#9333EA' }}>{req.id}</span>
                      <span style={ds.badge(req.status === 'Approved' ? '#16A34A' : req.status === 'Pending' ? '#F59E0B' : '#2563EB')}>{req.status}</span>
                    </div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>{req.name}</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.3rem', fontSize: '0.75rem' }}>
                      {[['Module', req.module], ['Priority', req.priority], ['Rule Coverage', req.coverage], ['Team', req.team]].map(([k, v], j) => (
                        <div key={j}><span style={{ color: 'var(--text-muted)' }}>{k}:</span> <strong>{v}</strong></div>
                      ))}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>Deps: <span style={{ color: 'var(--text-main)' }}>{req.deps}</span></div>
                  </div>
                ))}
              </div>
            </div>
          );

        // ── USER STORIES ──
        case 'userstories':
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>👤 User Story Dashboard</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                {[
                  { id: 'US-ATT-201', role: 'Employee', want: 'mark attendance using GPS', benefit: 'remote attendance is tracked', ac: ['GPS validation', 'Duplicate prevention', 'Offline sync'], priority: 'High' },
                  { id: 'US-PAY-301', role: 'HR Manager', want: 'process monthly payroll in one click', benefit: 'payroll processing is 90% faster', ac: ['Auto-calculation', 'Tax deduction', 'Pay slip generation'], priority: 'Critical' },
                  { id: 'US-LVE-101', role: 'Employee', want: 'apply for leave from mobile', benefit: 'leave requests are instant', ac: ['Calendar view', 'Manager notification', 'Balance check'], priority: 'High' },
                  { id: 'US-RPT-401', role: 'Manager', want: 'view team attendance reports', benefit: 'team productivity is visible', ac: ['Date range filter', 'Export PDF', 'Department filter'], priority: 'Medium' },
                ].map((s, i) => (
                  <div key={i} style={{ ...ds.card, borderLeft: `4px solid ${s.priority === 'Critical' ? '#DC2626' : s.priority === 'High' ? '#F59E0B' : '#2563EB'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#9333EA' }}>{s.id}</span>
                      <span style={ds.badge(s.priority === 'Critical' ? '#DC2626' : s.priority === 'High' ? '#F59E0B' : '#2563EB')}>{s.priority}</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', lineHeight: 1.5, marginBottom: '0.6rem', color: 'var(--text-main)' }}>
                      As a <strong>{s.role}</strong>, I want to <strong>{s.want}</strong>, so that <strong>{s.benefit}</strong>.
                    </div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Acceptance Criteria:</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                      {s.ac.map((a, j) => (
                        <div key={j} style={{ fontSize: '0.75rem', color: '#16A34A', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>✔ {a}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );

        // ── BUSINESS RULES ──
        case 'businessrules':
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>📜 Business Rule Dashboard</h2>
              <div style={{ ...ds.card, background: 'var(--background)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Business Rules Coverage</h3>
                  <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#16A34A' }}>76%</span>
                </div>
                <div style={{ height: '10px', background: 'var(--surface)', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{ width: '76%', height: '100%', background: 'linear-gradient(90deg, #16A34A, #2563EB)', borderRadius: '5px' }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                {[
                  { rule: 'Tax Deduction Validation', module: 'Payroll', status: 'Mapped', desc: 'Auto-apply tax brackets based on salary grade and local regulations' },
                  { rule: 'Attendance Policy Mapping', module: 'Attendance', status: 'Mapped', desc: 'Grace period of 15 mins, half-day deduction after 2 late marks' },
                  { rule: 'Leave Eligibility Rules', module: 'Leave', status: 'Partial', desc: 'Earned leave accrual: 1.5 days/month, carry forward max 30 days' },
                  { rule: 'Payroll Approval Workflow', module: 'Payroll', status: 'Mapped', desc: 'HR → Finance Manager → CFO approval chain for monthly processing' },
                  { rule: 'Overtime Calculation', module: 'Payroll', status: 'Unmapped', desc: '1.5x rate after 8 hours, 2x rate on holidays' },
                  { rule: 'Employee Onboarding Checklist', module: 'HR', status: 'Partial', desc: 'Document verification → ID creation → Asset allocation → Training' },
                ].map((r, i) => (
                  <div key={i} style={{ ...ds.card }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>{r.module}</span>
                      <span style={ds.badge(r.status === 'Mapped' ? '#16A34A' : r.status === 'Partial' ? '#F59E0B' : '#DC2626')}>{r.status}</span>
                    </div>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 700, margin: '0 0 0.3rem 0' }}>{r.rule}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4, margin: 0 }}>{r.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          );

        // ── WORKFLOWS ──
        case 'workflows':
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>🔄 Functional Workflow Visualization</h2>
              <div style={ds.card}>
                <h3 style={ds.title}>Core Process Flow</h3>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', padding: '1rem 0' }}>
                  {['Employee Login', 'Attendance Validation', 'Payroll Calculation', 'Approval Workflow', 'Report Generation'].map((step, i) => (
                    <React.Fragment key={step}>
                      <div style={{ padding: '0.6rem 1.5rem', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700, background: i === 0 ? '#2563EB' : 'var(--background)', color: i === 0 ? '#fff' : 'var(--text-main)', border: i === 0 ? 'none' : '1px solid var(--border)', minWidth: '220px', textAlign: 'center' }}>{step}</div>
                      {i < 4 && <span style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>↓</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div style={ds.card}>
                <h3 style={ds.title}>API Dependency Flow</h3>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', padding: '0.5rem 0' }}>
                  {['Frontend App', 'API Gateway', 'Authentication Service', 'Payroll Service', 'Database Layer'].map((step, i) => (
                    <React.Fragment key={step}>
                      <div style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, background: 'var(--background)', border: '1px solid var(--border)', minWidth: '200px', textAlign: 'center' }}>{step}</div>
                      {i < 4 && <span style={{ color: '#9333EA', fontSize: '1rem' }}>↓</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          );

        // ── API SPECIFICATIONS ──
        case 'apis':
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>🔗 API Specification Dashboard</h2>
              <div style={ds.card}>
                <h3 style={ds.title}>API Matrix</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)' }}>
                      {['Endpoint', 'Method', 'Module', 'Auth', 'Status'].map(h => (
                        <th key={h} style={{ padding: '0.6rem', textAlign: 'left', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['/api/auth/login', 'POST', 'Auth', 'Public', '✅ Live'],
                      ['/api/attendance/checkin', 'POST', 'Attendance', 'JWT', '🟡 Testing'],
                      ['/api/payroll/process', 'POST', 'Payroll', 'JWT + Role', '🟢 Ready'],
                      ['/api/leave/apply', 'POST', 'Leave', 'JWT', '✅ Live'],
                      ['/api/reports/generate', 'GET', 'Reports', 'JWT + Role', '⏳ Pending'],
                      ['/api/employee/:id', 'GET', 'Employee', 'JWT', '✅ Live'],
                      ['/api/payslip/download', 'GET', 'Payroll', 'JWT', '🟡 Testing'],
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                        {row.map((cell, c) => (
                          <td key={c} style={{ padding: '0.55rem 0.6rem', fontWeight: c === 0 ? 600 : 400, fontFamily: c === 0 ? 'monospace' : 'inherit', fontSize: c === 0 ? '0.78rem' : '0.82rem', color: c === 1 ? '#9333EA' : 'var(--text-main)' }}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );

        // ── DATABASE MAPPING ──
        case 'database':
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>🗄️ Database Mapping Dashboard</h2>
              <div style={ds.card}>
                <h3 style={ds.title}>Entity Relationship View</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)' }}>
                      {['Table', 'Primary Key', 'Relationship', 'Linked To', 'Records'].map(h => (
                        <th key={h} style={{ padding: '0.6rem', textAlign: 'left', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['employees', 'emp_id', 'One-to-Many', 'payroll_records', '~350'],
                      ['attendance_logs', 'log_id', 'Many-to-One', 'employees, shifts', '~12K'],
                      ['payroll_records', 'pay_id', 'Many-to-One', 'employees, tax_rules', '~4.2K'],
                      ['leave_requests', 'leave_id', 'Many-to-One', 'employees', '~2.8K'],
                      ['tax_rules', 'tax_id', 'One-to-Many', 'payroll_records', '~25'],
                      ['shifts', 'shift_id', 'One-to-Many', 'attendance_logs', '~15'],
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                        {row.map((cell, c) => (
                          <td key={c} style={{ padding: '0.55rem 0.6rem', fontWeight: c === 0 ? 700 : 400, fontFamily: c === 0 || c === 1 ? 'monospace' : 'inherit', fontSize: '0.8rem' }}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );

        // ── VALIDATION RULES ──
        case 'validation':
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>✅ Validation Rule Dashboard</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                {[
                  { field: 'Employee ID', rules: ['Required', 'Unique', 'Auto-generated'], error: 'Employee ID already exists', type: 'String' },
                  { field: 'Email', rules: ['Required', 'Valid format', 'Unique'], error: 'Invalid email format', type: 'Email' },
                  { field: 'Password', rules: ['Min 8 chars', 'Uppercase', 'Number', 'Special char'], error: 'Password does not meet criteria', type: 'Password' },
                  { field: 'Phone Number', rules: ['Required', '10 digits', 'Numeric only'], error: 'Invalid phone number', type: 'Number' },
                  { field: 'Salary Amount', rules: ['Required', 'Positive value', 'Max 10M'], error: 'Invalid salary amount', type: 'Decimal' },
                  { field: 'Leave Date', rules: ['Required', 'Future date', 'Not weekend'], error: 'Invalid leave date selected', type: 'Date' },
                ].map((v, i) => (
                  <div key={i} style={ds.card}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0 }}>{v.field}</h4>
                      <span style={ds.badge('#9333EA')}>{v.type}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', marginBottom: '0.5rem' }}>
                      {v.rules.map((r, j) => (
                        <div key={j} style={{ fontSize: '0.75rem', color: '#16A34A', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>✔ {r}</div>
                      ))}
                    </div>
                    <div style={{ padding: '0.4rem 0.6rem', background: 'rgba(220,38,38,0.06)', borderRadius: '6px', borderLeft: '3px solid #DC2626', fontSize: '0.72rem', color: '#DC2626' }}>⚠ {v.error}</div>
                  </div>
                ))}
              </div>
            </div>
          );

        // ── REPORTS ──
        case 'reports':
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>📈 Report Requirements</h2>
              <div style={ds.card}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)' }}>
                      {['Report', 'Module', 'Frequency', 'Format', 'Access'].map(h => (
                        <th key={h} style={{ padding: '0.6rem', textAlign: 'left', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Attendance Summary', 'Attendance', 'Daily', 'PDF/Excel', 'Admin, HR'],
                      ['Payroll Statement', 'Payroll', 'Monthly', 'PDF', 'Admin, Finance'],
                      ['Leave Balance', 'Leave', 'On-Demand', 'PDF/Excel', 'All'],
                      ['Tax Deduction Report', 'Payroll', 'Quarterly', 'PDF', 'Finance'],
                      ['Employee Directory', 'HR', 'On-Demand', 'Excel', 'Admin, HR'],
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                        {row.map((cell, c) => (
                          <td key={c} style={{ padding: '0.55rem 0.6rem', fontWeight: c === 0 ? 600 : 400 }}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );

        // ── APPROVALS ──
        case 'approvals':
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>✍️ Approval Workflow Dashboard</h2>
              <div style={ds.card}>
                <h3 style={ds.title}>Sign-Off Tracker</h3>
                <div style={{ position: 'relative', paddingLeft: '2rem' }}>
                  <div style={{ position: 'absolute', left: '11px', top: 0, bottom: 0, width: '2px', background: 'var(--border)' }} />
                  {[
                    { role: 'Business Analyst', name: 'Ahmed Khan', date: '18 May 2026', status: 'Approved', color: '#16A34A' },
                    { role: 'Technical Lead', name: 'Sara Ali', date: '19 May 2026', status: 'Approved', color: '#16A34A' },
                    { role: 'QA Architect', name: 'Mohammed Rizwan', date: '—', status: 'In Review', color: '#F59E0B' },
                    { role: 'Client Representative', name: 'Pending', date: '—', status: 'Pending', color: '#94A3B8' },
                  ].map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem', position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '-1.75rem', width: '14px', height: '14px', borderRadius: '50%', background: s.color, zIndex: 1, border: '2px solid var(--surface)' }} />
                      <div style={{ flex: 1, padding: '0.75rem', background: 'var(--background)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{s.role}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.name} • {s.date}</div>
                          </div>
                          <span style={ds.badge(s.color)}>{s.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );

        // ── VERSION HISTORY ──
        case 'versions':
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>🔁 Version History</h2>
              <div style={ds.card}>
                {[
                  { ver: 'v2.1', date: '21 May 2026', author: 'Ahmed Khan', changes: 'Added API specifications for payroll module, validation rules updated', current: true },
                  { ver: 'v2.0', date: '19 May 2026', author: 'Sara Ali', changes: 'User stories added, workflow mapping for attendance module', current: false },
                  { ver: 'v1.0', date: '15 May 2026', author: 'Mohammed Ali', changes: 'Initial FRD creation with core functional requirements', current: false },
                ].map((v, i) => (
                  <div key={i} style={{ padding: '0.85rem', borderBottom: i < 2 ? '1px solid var(--border)' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 800, color: v.current ? '#9333EA' : 'var(--text-main)', fontSize: '0.9rem' }}>{v.ver}</span>
                        {v.current && <span style={ds.badge('#9333EA')}>Current</span>}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{v.author} • {v.date}</div>
                      <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>{v.changes}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );

        // ── ATTACHMENTS ──
        case 'attachments':
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>📎 Attachments & References</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {[
                  { name: 'UI Wireframes.figma', type: '🎨', size: '4.8 MB' },
                  { name: 'API Swagger Docs.yaml', type: '📄', size: '320 KB' },
                  { name: 'ER Diagram.png', type: '🗄️', size: '2.1 MB' },
                  { name: 'Test Scenarios.xlsx', type: '🧪', size: '890 KB' },
                  { name: 'Demo Recording.mp4', type: '🎬', size: '62 MB' },
                  { name: 'Business Rules.docx', type: '📜', size: '1.5 MB' },
                ].map((f, i) => (
                  <div key={i} style={{ ...ds.card, display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                    <div style={{ fontSize: '1.5rem' }}>{f.type}</div>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>{f.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{f.size}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );

        // ── ANALYTICS ──
        case 'analytics':
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>📉 Executive Analytics</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {[
                  { label: 'Feature Stability', val: '91%', color: '#16A34A' },
                  { label: 'API Readiness', val: '64%', color: '#F59E0B' },
                  { label: 'Delivery Confidence', val: '82%', color: '#2563EB' },
                ].map((s, i) => (
                  <div key={i} style={{ ...ds.card, textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: s.color }}>{s.val}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '0.25rem' }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div style={ds.card}>
                <h3 style={ds.title}>KPI Visualization</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {[
                    { label: 'Feature Stability Index', pct: 91 },
                    { label: 'Workflow Completion Trend', pct: 68 },
                    { label: 'Business Rule Coverage', pct: 76 },
                    { label: 'API Readiness Score', pct: 64 },
                    { label: 'Delivery Confidence', pct: 82 },
                  ].map((k, i) => (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.2rem' }}>
                        <span>{k.label}</span><span style={{ color: k.pct > 70 ? '#16A34A' : k.pct > 40 ? '#F59E0B' : '#DC2626' }}>{k.pct}%</span>
                      </div>
                      <div style={{ height: '6px', background: 'var(--background)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${k.pct}%`, height: '100%', background: k.pct > 70 ? '#16A34A' : k.pct > 40 ? '#F59E0B' : '#DC2626', borderRadius: '3px' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );

        default:
          return <div style={{ padding: '2rem', color: 'var(--text-muted)', textAlign: 'center' }}>Select a section from the sidebar.</div>;
      }
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '842px', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', color: 'var(--text-main)', fontFamily: 'Inter, system-ui, sans-serif' }}>
        {/* ══════ TOP ENTERPRISE NAVIGATION ══════ */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1.25rem', background: 'var(--background)', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#9333EA', textTransform: 'uppercase', letterSpacing: '0.06em' }}>UNITRACON FRD MANAGEMENT SYSTEM</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.1rem' }}>{documentTitle || 'Enterprise FRD'}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', width: '220px', outline: 'none' }} placeholder="🔍 Search features, APIs, workflows..." />
            {['Dashboard', 'Projects', 'APIs', 'Analytics'].map(tab => (
              <button key={tab} style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem', fontWeight: 600, borderRadius: '6px', border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}>{tab}</button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.75rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Product: <strong style={{ color: 'var(--text-main)' }}>Core System Platform</strong></span>
            <span style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 700, background: 'rgba(22,163,74,0.1)', color: '#16A34A' }}>🟢 Active Sprint</span>
          </div>
        </div>

        {/* ══════ 3-COLUMN BODY ══════ */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* ── LEFT SIDEBAR ── */}
          <div style={{ width: '210px', borderRight: '1px solid var(--border)', background: 'var(--background)', display: 'flex', flexDirection: 'column', flexShrink: 0, overflowY: 'auto' }}>
            <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
              {sidebarItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveFrdTab(item.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.65rem', textAlign: 'left',
                    fontSize: '0.78rem', fontWeight: activeFrdTab === item.id ? 700 : 500,
                    color: activeFrdTab === item.id ? '#9333EA' : 'var(--text-main)',
                    background: activeFrdTab === item.id ? 'rgba(147,51,234,0.08)' : 'transparent',
                    border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.15s',
                    borderLeft: activeFrdTab === item.id ? '3px solid #9333EA' : '3px solid transparent',
                  }}
                >
                  <span style={{ fontSize: '0.9rem' }}>{item.icon}</span> {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── CENTER WORKSPACE ── */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            {renderCenterContent()}
          </div>

          {/* ── RIGHT AI & ACTIVITY PANEL ── */}
          <div style={{ width: '230px', borderLeft: '1px solid var(--border)', background: 'var(--background)', display: 'flex', flexDirection: 'column', flexShrink: 0, padding: '1rem', gap: '1rem', overflowY: 'auto' }}>
            {/* AI Insights */}
            <div>
              <h4 style={{ fontSize: '0.7rem', fontWeight: 800, color: '#9333EA', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>✨ AI Insights</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {[
                  { msg: 'Missing API validations in 4 endpoints', color: '#F59E0B' },
                  { msg: 'Duplicate workflows found (ATT, LVE)', color: '#DC2626' },
                  { msg: 'Payroll service dependency unresolved', color: '#DC2626' },
                  { msg: 'Unmapped database entities: 3 tables', color: '#F59E0B' },
                ].map((insight, i) => (
                  <div key={i} style={{ padding: '0.5rem', borderRadius: '6px', background: `${insight.color}08`, borderLeft: `3px solid ${insight.color}`, fontSize: '0.72rem', lineHeight: 1.35, color: 'var(--text-main)' }}>{insight.msg}</div>
                ))}
              </div>
            </div>
            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {['Generate SRS', 'Generate Test Cases', 'Generate APIs', 'AI Summary'].map(btn => (
                <button key={btn} style={{ width: '100%', padding: '0.45rem', fontSize: '0.72rem', fontWeight: 700, borderRadius: '6px', border: '1px solid #9333EA30', background: 'rgba(147,51,234,0.06)', color: '#9333EA', cursor: 'pointer', textAlign: 'center' }}>{btn}</button>
              ))}
            </div>
            {/* Recent Activity */}
            <div>
              <h4 style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>🕐 Recent Activity</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  { msg: 'FRD updated by Ahmed', time: '5m ago', color: '#9333EA' },
                  { msg: 'Payroll API modified', time: '1h ago', color: '#F59E0B' },
                  { msg: 'Validation rules added', time: '3h ago', color: '#16A34A' },
                  { msg: 'Workflow approved', time: 'Yesterday', color: '#2563EB' },
                  { msg: 'User story US-ATT-201 created', time: 'Yesterday', color: '#9333EA' },
                ].map((act, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: act.color, flexShrink: 0, marginTop: '0.4rem' }} />
                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 600, lineHeight: 1.3 }}>{act.msg}</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{act.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };


  // ═══════════════════════════════════════════════════════════
  // ENTERPRISE BRD DASHBOARD - MASTER LAYOUT
  // ═══════════════════════════════════════════════════════════
  const renderBrdDashboard = () => {
    const tmplConfig = isTemplateBuilder ? templates.find(t => t.id === loadedId)?.dashboardConfig : undefined;
    const sidebarItems = tmplConfig?.sidebarItems || [
      { id: 'executive', icon: '📊', label: 'Executive Summary' },
      { id: 'templates', icon: '📋', label: 'BRD Templates' },
      { id: 'requirements', icon: '📄', label: 'Requirement Modules' },
      { id: 'scope', icon: '🎯', label: 'Scope Management' },
      { id: 'stakeholders', icon: '👥', label: 'Stakeholders' },
      { id: 'workflows', icon: '🔄', label: 'Workflows' },
      { id: 'approvals', icon: '✍️', label: 'Approvals' },
      { id: 'risks', icon: '⚠️', label: 'Risks' },
      { id: 'integrations', icon: '🔗', label: 'Integrations' },
      { id: 'analytics', icon: '📈', label: 'Analytics' },
      { id: 'timeline', icon: '📅', label: 'Timeline' },
      { id: 'versions', icon: '🔁', label: 'Version History' },
      { id: 'attachments', icon: '📎', label: 'Attachments' },
    ];

    const ds = {
      card: { padding: '1.25rem', background: 'var(--surface)', borderRadius: '14px', border: '1px solid var(--border)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' } as React.CSSProperties,
      title: { fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' } as React.CSSProperties,
      badge: (color: string) => ({ fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: '4px', background: `${color}15`, color, textTransform: 'uppercase' as const, letterSpacing: '0.03em' }),
    };

    const renderCenterContent = () => {
      switch (activeBrdTab) {
        // ── EXECUTIVE SUMMARY ──
        case 'executive':
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>{documentTitle || 'BRD Dashboard'}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>Executive Business Visibility • Real-time Requirement Intelligence</p>
              </div>
              {/* KPI Hero Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', position: 'relative' }}>
                {isTemplateBuilder && (
                  <button onClick={() => setConfigEditorOpen('kpiWidgets')} style={{ position: 'absolute', top: '-25px', right: 0, background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '0.7rem', padding: '0.2rem 0.5rem', cursor: 'pointer', zIndex: 10 }}>
                    ✏️ Edit KPIs
                  </button>
                )}
                {(tmplConfig?.kpiWidgets || [
                  { title: 'Total Requirements', value: documentMetrics.totalRequirements > 0 ? documentMetrics.totalRequirements.toString() : '486', color: '#2563EB', icon: '📋' },
                  { title: 'Approved', value: documentMetrics.approvedRequirements > 0 ? documentMetrics.approvedRequirements.toString() : '342', color: '#16A34A', icon: '✅' },
                  { title: 'Pending Reviews', value: documentMetrics.totalRequirements > 0 ? (documentMetrics.totalRequirements - documentMetrics.approvedRequirements).toString() : '28', color: '#F59E0B', icon: '⏳' },
                  { title: 'Business Risks', value: documentMetrics.riskCount > 0 ? documentMetrics.riskCount.toString() : '6', color: '#DC2626', icon: '⚠️' },
                ]).slice(0, 4).map((kpi, i) => (
                  <div key={i} style={{ ...ds.card, position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: kpi.color }} />
                    <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{kpi.icon || '📊'}</div>
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: kpi.color, lineHeight: 1 }}>{kpi.value}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '0.35rem' }}>{kpi.title}</div>
                  </div>
                ))}
              </div>
              {/* Project Health */}
              <div style={ds.card}>
                <h3 style={ds.title}>📈 Project Health Analytics</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    { label: 'Requirement Completion', pct: 88, color: '#2563EB' },
                    { label: 'Stakeholder Approval', pct: 72, color: '#16A34A' },
                    { label: 'Workflow Mapping', pct: 64, color: '#F59E0B' },
                    { label: 'Risk Mitigation', pct: 80, color: '#7C3AED' },
                    { label: 'Delivery Confidence', pct: 75, color: '#0891B2' },
                  ].map((h, i) => (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                        <span>{h.label}</span>
                        <span style={{ color: h.color }}>{h.pct}%</span>
                      </div>
                      <div style={{ height: '8px', background: 'var(--background)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${h.pct}%`, height: '100%', background: h.color, borderRadius: '4px', transition: 'width 0.8s ease' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Business Objectives */}
              <div style={ds.card}>
                <h3 style={ds.title}>🎯 Business Objectives</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {['Reduce manual work by 65%', 'Improve payroll accuracy', 'Increase team productivity 3x', 'Centralize all operations', 'Enable mobile accessibility', 'Real-time analytics'].map((obj, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.75rem', background: 'var(--background)', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 500 }}>
                      <span style={{ color: '#16A34A' }}>✔</span> {obj}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );

        // ── BRD TEMPLATES ──
        case 'templates':
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>📋 BRD Template Grid</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                {[
                  { name: 'HRMS BRD Template', modules: 12, status: 'Approved', pct: 82, color: '#16A34A', date: '20 May' },
                  { name: 'Payroll System BRD', modules: 18, status: 'In Review', pct: 61, color: '#F59E0B', date: 'Today' },
                  { name: 'CRM Integration BRD', modules: 9, status: 'Draft', pct: 35, color: '#2563EB', date: '18 May' },
                  { name: 'Inventory Management', modules: 14, status: 'Approved', pct: 95, color: '#16A34A', date: '15 May' },
                ].map((t, i) => (
                  <div key={i} style={{ ...ds.card, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>{t.name}</h4>
                      <span style={ds.badge(t.color)}>{t.status}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      <span>Modules: <strong style={{ color: 'var(--text-main)' }}>{t.modules}</strong></span>
                      <span>Updated: <strong style={{ color: 'var(--text-main)' }}>{t.date}</strong></span>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '0.2rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Progress</span>
                        <span style={{ fontWeight: 700, color: t.color }}>{t.pct}%</span>
                      </div>
                      <div style={{ height: '6px', background: 'var(--background)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${t.pct}%`, height: '100%', background: t.color, borderRadius: '3px' }} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {['Open', 'Duplicate', 'Export'].map(a => (
                        <button key={a} style={{ flex: 1, padding: '0.35rem', fontSize: '0.7rem', fontWeight: 600, borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text-main)', cursor: 'pointer' }}>{a}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );

        // ── REQUIREMENTS ──
        case 'requirements':
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>📄 Requirement Status Board</h2>
              {/* Kanban Headers */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem' }}>
                {[
                  { label: 'Draft', color: '#94A3B8', count: 4 },
                  { label: 'Review', color: '#F59E0B', count: 3 },
                  { label: 'Approved', color: '#16A34A', count: 8 },
                  { label: 'Development', color: '#2563EB', count: 5 },
                  { label: 'QA', color: '#7C3AED', count: 2 },
                ].map((col, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0.6rem', background: `${col.color}12`, borderRadius: '8px', border: `1px solid ${col.color}30` }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: col.color }} />
                      <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{col.label}</span>
                      <span style={{ marginLeft: 'auto', fontSize: '0.65rem', fontWeight: 800, color: col.color }}>{col.count}</span>
                    </div>
                  </div>
                ))}
              </div>
              {/* Requirement Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                {[
                  { id: 'BRD-EMP-101', name: 'Employee Attendance Tracking', dept: 'HR', priority: 'Critical', impact: 'High', owner: 'Business Analyst', status: 'Pending' },
                  { id: 'BRD-PAY-201', name: 'Automated Payroll Calculation', dept: 'Finance', priority: 'Critical', impact: 'High', owner: 'BA Lead', status: 'Approved' },
                  { id: 'BRD-LVE-301', name: 'Multi-Level Leave Workflow', dept: 'HR', priority: 'High', impact: 'Medium', owner: 'PM', status: 'In Review' },
                  { id: 'BRD-RPT-401', name: 'Custom Report Builder', dept: 'All', priority: 'Medium', impact: 'Medium', owner: 'Analyst', status: 'Draft' },
                ].map((req, i) => (
                  <div key={i} style={{ ...ds.card, borderLeft: `4px solid ${req.priority === 'Critical' ? '#DC2626' : req.priority === 'High' ? '#F59E0B' : '#2563EB'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#2563EB' }}>{req.id}</span>
                      <span style={ds.badge(req.status === 'Approved' ? '#16A34A' : req.status === 'Pending' ? '#F59E0B' : '#2563EB')}>{req.status}</span>
                    </div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>{req.name}</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem', fontSize: '0.75rem' }}>
                      {[['Department', req.dept], ['Priority', req.priority], ['Impact', req.impact], ['Owner', req.owner]].map(([k, v], j) => (
                        <div key={j}><span style={{ color: 'var(--text-muted)' }}>{k}:</span> <strong>{v}</strong></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );

        // ── SCOPE ──
        case 'scope':
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>🎯 Scope Management Dashboard</h2>
              <div style={ds.card}>
                <h3 style={ds.title}>Scope Matrix</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)' }}>
                      {['Module', 'In Scope', 'Priority', 'Status', 'Owner'].map(h => (
                        <th key={h} style={{ padding: '0.6rem', textAlign: 'left', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Attendance', '✅', 'Critical', 'Active', 'HR Team'],
                      ['Payroll', '✅', 'Critical', 'Active', 'Finance'],
                      ['Leave Management', '✅', 'High', 'Active', 'HR Team'],
                      ['HR Analytics', '✅', 'High', 'Planning', 'CTO'],
                      ['Self-Service', '✅', 'Medium', 'Deferred', 'PM'],
                      ['Recruitment', '❌', 'Low', 'Out of Scope', '—'],
                      ['Training', '❌', 'Low', 'Out of Scope', '—'],
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                        {row.map((cell, c) => (
                          <td key={c} style={{ padding: '0.6rem', fontWeight: c === 0 ? 600 : 400, color: c === 2 ? (cell === 'Critical' ? '#DC2626' : cell === 'High' ? '#F59E0B' : '#2563EB') : 'var(--text-main)' }}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );

        // ── STAKEHOLDERS ──
        case 'stakeholders':
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>👥 Stakeholder Approval Dashboard</h2>
              <div style={ds.card}>
                <h3 style={ds.title}>Approval Matrix</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[
                    { name: 'CEO', role: 'Sponsor', status: '✅ Approved', color: '#16A34A' },
                    { name: 'HR Director', role: 'Business Owner', status: '⏳ Pending', color: '#F59E0B' },
                    { name: 'Finance Manager', role: 'Reviewer', status: '✅ Approved', color: '#16A34A' },
                    { name: 'CTO', role: 'Technical Lead', status: '✅ Approved', color: '#16A34A' },
                    { name: 'Project Manager', role: 'Coordinator', status: '⏳ In Review', color: '#F59E0B' },
                    { name: 'Legal/Compliance', role: 'Compliance', status: '⏳ Pending', color: '#F59E0B' },
                  ].map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.75rem', background: 'var(--background)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: `${s.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 800, color: s.color }}>{s.name[0]}</div>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{s.name}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{s.role}</div>
                        </div>
                      </div>
                      <span style={ds.badge(s.color)}>{s.status}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Approval Flow */}
              <div style={ds.card}>
                <h3 style={ds.title}>Approval Flow</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {['Business Analyst', 'Project Manager', 'Technical Lead', 'Client Approval'].map((step, i) => (
                    <React.Fragment key={step}>
                      <div style={{ padding: '0.5rem 0.85rem', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, background: i < 2 ? 'rgba(22,163,74,0.1)' : 'rgba(37,99,235,0.08)', color: i < 2 ? '#16A34A' : '#2563EB', border: `1px solid ${i < 2 ? '#16A34A' : '#2563EB'}40` }}>{step}</div>
                      {i < 3 && <span style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>→</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          );

        // ── WORKFLOWS ──
        case 'workflows':
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>🔄 Business Workflow Visualization</h2>
              <div style={ds.card}>
                <h3 style={ds.title}>Core Business Process Flow</h3>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', padding: '1rem 0' }}>
                  {['Employee Login', 'Dashboard Access', 'Attendance Entry', 'Leave Request', 'Manager Approval', 'Payroll Processing', 'Analytics Reports'].map((step, i) => (
                    <React.Fragment key={step}>
                      <div style={{ padding: '0.6rem 1.5rem', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700, background: i === 0 ? '#2563EB' : 'var(--background)', color: i === 0 ? '#fff' : 'var(--text-main)', border: i === 0 ? 'none' : '1px solid var(--border)', minWidth: '200px', textAlign: 'center' }}>{step}</div>
                      {i < 6 && <span style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>↓</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          );

        // ── APPROVALS ──
        case 'approvals':
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>✍️ Approval Workflow Dashboard</h2>
              <div style={ds.card}>
                <h3 style={ds.title}>Sign-Off Tracker</h3>
                <div style={{ position: 'relative', paddingLeft: '2rem' }}>
                  <div style={{ position: 'absolute', left: '11px', top: 0, bottom: 0, width: '2px', background: 'var(--border)' }} />
                  {[
                    { role: 'Business Analyst', name: 'Ahmed Khan', date: '18 May 2026', status: 'Approved', color: '#16A34A' },
                    { role: 'Project Manager', name: 'Sarah Ahmed', date: '19 May 2026', status: 'Approved', color: '#16A34A' },
                    { role: 'Technical Lead', name: 'Mohammed Ali', date: '—', status: 'In Review', color: '#F59E0B' },
                    { role: 'Client Rep', name: 'Pending', date: '—', status: 'Pending', color: '#94A3B8' },
                  ].map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem', position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '-1.75rem', width: '14px', height: '14px', borderRadius: '50%', background: s.color, zIndex: 1, border: '2px solid var(--surface)' }} />
                      <div style={{ flex: 1, padding: '0.75rem', background: 'var(--background)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{s.role}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.name} • {s.date}</div>
                          </div>
                          <span style={ds.badge(s.color)}>{s.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );

        // ── RISKS ──
        case 'risks':
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>⚠️ Risk Intelligence Panel</h2>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {[{ label: '🔴 High Risk', count: 1 }, { label: '🟡 Medium Risk', count: 2 }, { label: '🟢 Low Risk', count: 1 }].map((r, i) => (
                  <div key={i} style={{ ...ds.card, flex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: '1rem' }}>{r.label}</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)', marginTop: '0.25rem' }}>{r.count}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[
                  { risk: 'Frequent scope changes', impact: 'High', severity: '🔴', mitigation: 'Weekly client validation meetings', status: 'Monitoring' },
                  { risk: 'Vendor API undocumented', impact: 'Medium', severity: '🟡', mitigation: 'Build adapter layer + request docs', status: 'Active' },
                  { risk: 'Remote bandwidth issues', impact: 'Medium', severity: '🟡', mitigation: 'Offline-first sync strategy', status: 'Watch' },
                  { risk: 'Tax law changes', impact: 'Low', severity: '🟢', mitigation: 'Configurable tax engine', status: 'Low' },
                ].map((r, i) => (
                  <div key={i} style={{ ...ds.card, borderLeft: `4px solid ${r.severity === '🔴' ? '#DC2626' : r.severity === '🟡' ? '#F59E0B' : '#16A34A'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '1rem' }}>{r.severity}</span>
                      <span style={ds.badge(r.status === 'Monitoring' ? '#DC2626' : '#F59E0B')}>{r.status}</span>
                    </div>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>{r.risk}</h4>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Impact: <strong style={{ color: 'var(--text-main)' }}>{r.impact}</strong></div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Mitigation: <strong style={{ color: 'var(--text-main)' }}>{r.mitigation}</strong></div>
                  </div>
                ))}
              </div>
            </div>
          );

        // ── INTEGRATIONS ──
        case 'integrations':
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>🔗 Integration Status</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {[
                  { name: 'SMS Gateway (Twilio)', type: 'API', status: '✅ Connected', color: '#16A34A' },
                  { name: 'Payment (Stripe)', type: 'API', status: '✅ Connected', color: '#16A34A' },
                  { name: 'Biometric (ZKTeco)', type: 'SDK', status: '⏳ Pending', color: '#F59E0B' },
                  { name: 'Email (SendGrid)', type: 'API', status: '✅ Connected', color: '#16A34A' },
                  { name: 'ERP (SAP)', type: 'API', status: '🔄 In Progress', color: '#2563EB' },
                  { name: 'OCR Engine', type: 'SDK', status: '⏳ Pending', color: '#F59E0B' },
                ].map((int, i) => (
                  <div key={i} style={ds.card}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 700, margin: 0 }}>{int.name}</h4>
                      <span style={ds.badge(int.color)}>{int.type}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: int.color, fontWeight: 600 }}>{int.status}</div>
                  </div>
                ))}
              </div>
            </div>
          );

        // ── ANALYTICS ──
        case 'analytics':
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>📈 Executive Analytics</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {[
                  { label: 'Scope Stability Index', val: '94%', color: '#16A34A' },
                  { label: 'Approval Turnaround', val: '2.4 days', color: '#2563EB' },
                  { label: 'Business Readiness', val: '78%', color: '#F59E0B' },
                ].map((s, i) => (
                  <div key={i} style={{ ...ds.card, textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: s.color }}>{s.val}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '0.25rem' }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div style={ds.card}>
                <h3 style={ds.title}>KPI Visualization</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {[
                    { label: 'Scope Stability Index', pct: 94 },
                    { label: 'Requirement Change Frequency', pct: 22 },
                    { label: 'Approval Turnaround Time', pct: 76 },
                    { label: 'Business Readiness Score', pct: 78 },
                    { label: 'Delivery Confidence Index', pct: 85 },
                  ].map((k, i) => (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.2rem' }}>
                        <span>{k.label}</span><span style={{ color: k.pct > 70 ? '#16A34A' : k.pct > 40 ? '#F59E0B' : '#DC2626' }}>{k.pct}%</span>
                      </div>
                      <div style={{ height: '6px', background: 'var(--background)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${k.pct}%`, height: '100%', background: k.pct > 70 ? '#16A34A' : k.pct > 40 ? '#F59E0B' : '#DC2626', borderRadius: '3px' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );

        // ── TIMELINE ──
        case 'timeline':
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>📅 Timeline & Delivery Dashboard</h2>
              <div style={ds.card}>
                <h3 style={ds.title}>Milestone Tracker</h3>
                <div style={{ position: 'relative', paddingLeft: '2.5rem' }}>
                  <div style={{ position: 'absolute', left: '14px', top: 0, bottom: 0, width: '2px', background: 'var(--border)' }} />
                  {[
                    { w: 'Week 1', d: 'Requirement Gathering', detail: 'BRD document, stakeholder sign-off', s: 'done' },
                    { w: 'Week 2', d: 'UI Design', detail: 'Wireframes, UI mockups, design approval', s: 'current' },
                    { w: 'Week 3', d: 'Backend Development', detail: 'API development, database schema', s: 'pending' },
                    { w: 'Week 4', d: 'Testing', detail: 'Unit tests, integration tests, QA report', s: 'pending' },
                    { w: 'Week 5', d: 'UAT', detail: 'User acceptance testing, feedback', s: 'pending' },
                    { w: 'Week 6', d: 'Deployment', detail: 'Production deployment, monitoring setup', s: 'pending' },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '-2.25rem', width: '16px', height: '16px', borderRadius: '50%', background: item.s === 'done' ? '#16A34A' : item.s === 'current' ? '#2563EB' : 'var(--background)', border: `2px solid ${item.s === 'pending' ? 'var(--border)' : 'transparent'}`, zIndex: 1 }} />
                      <div style={{ flex: 1, padding: '0.75rem', background: item.s === 'current' ? 'rgba(37,99,235,0.05)' : 'var(--background)', borderRadius: '8px', border: `1px solid ${item.s === 'current' ? '#2563EB40' : 'var(--border)'}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: item.s === 'current' ? '#2563EB' : 'var(--text-muted)' }}>{item.w}</span>
                            <div style={{ fontSize: '0.88rem', fontWeight: 700, marginTop: '0.1rem' }}>{item.d}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{item.detail}</div>
                          </div>
                          {item.s === 'done' && <span style={ds.badge('#16A34A')}>✔ Complete</span>}
                          {item.s === 'current' && <span style={ds.badge('#2563EB')}>● In Progress</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );

        // ── VERSION HISTORY ──
        case 'versions':
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>🔁 Version History</h2>
              <div style={ds.card}>
                {[
                  { ver: 'v1.2', date: '20 May 2026', author: 'Ahmed Khan', changes: 'Added payroll module requirements, updated scope matrix', current: true },
                  { ver: 'v1.1', date: '18 May 2026', author: 'Sarah Ahmed', changes: 'Stakeholder approval updates, risk assessment added', current: false },
                  { ver: 'v1.0', date: '15 May 2026', author: 'Mohammed Ali', changes: 'Initial BRD creation with core modules', current: false },
                ].map((v, i) => (
                  <div key={i} style={{ padding: '0.85rem', borderBottom: i < 2 ? '1px solid var(--border)' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 800, color: v.current ? '#2563EB' : 'var(--text-main)', fontSize: '0.9rem' }}>{v.ver}</span>
                        {v.current && <span style={ds.badge('#2563EB')}>Current</span>}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{v.author} • {v.date}</div>
                      <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>{v.changes}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );

        // ── ATTACHMENTS ──
        case 'attachments':
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>📎 Attachments & References</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {[
                  { name: 'UI Wireframes.pdf', type: '📐', size: '2.4 MB' },
                  { name: 'API Documentation.docx', type: '📄', size: '1.1 MB' },
                  { name: 'Data Model.xlsx', type: '📊', size: '890 KB' },
                  { name: 'Architecture Diagram.png', type: '🏗️', size: '3.2 MB' },
                  { name: 'Demo Recording.mp4', type: '🎬', size: '48 MB' },
                  { name: 'Test Scenarios.xlsx', type: '🧪', size: '420 KB' },
                ].map((f, i) => (
                  <div key={i} style={{ ...ds.card, display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                    <div style={{ fontSize: '1.5rem' }}>{f.type}</div>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>{f.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{f.size}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );

        default:
          return <div style={{ padding: '2rem', color: 'var(--text-muted)', textAlign: 'center' }}>Select a section from the sidebar.</div>;
      }
    };

    return (
      <div className="paper-canvas animate-fade-in" style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '820px', minHeight: '842px', background: 'var(--surface)', padding: '2.5rem 2rem', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)', color: 'var(--text-main)', fontFamily: 'Inter, system-ui, sans-serif', overflow: 'auto' }}>
        {renderCenterContent()}
      </div>
    );
  };

  // -------------------------------------------------------------------------------- //
  // STRICT WORKSPACE VALIDATION
  // -------------------------------------------------------------------------------- //
  const activeWorkspaceType = activeWorkspace?.type || 'custom';
  const allowedDocTypes = WorkspaceRegistry[activeWorkspaceType]?.allowedDocuments || [];
  
  // List of all global template types that can be opened anywhere without blocking
  const globalTemplateTypes = [
    'sprint', 'backlog', 'taskbreak', 'estimation', 'risk', 'cr', 'release', 'status',
    'testplan', 'testcases', 'buglog', 'uat', 'tdd',
    'devops-deploy', 'devops-server', 'devops-backup', 'devops-pipeline', 'devops-env', 'devops-monitor',
    'support-usermanual', 'support-adminmanual', 'support-training', 'support-faq', 'support-troubleshoot', 'support-releasenotes'
  ];

  const isDocTypeAllowed = allowedDocTypes.includes(docType) || docType === 'custom' || isTemplateBuilder || globalTemplateTypes.includes(docType);

  if (!isDocTypeAllowed && isLoaded) {
    return (
      <div style={{ padding: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--background)' }}>
        <div style={{ background: 'var(--surface)', padding: '3rem', borderRadius: '16px', border: '1px solid var(--border)', textAlign: 'center', maxWidth: '600px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1rem' }}>Workspace Mismatch</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
            The document type <strong>"{docType}"</strong> is not permitted within the <strong>{activeWorkspace?.name}</strong> workspace. 
            This workspace only allows: {allowedDocTypes.join(', ')}.
          </p>
          <button 
            onClick={() => router.push('/?tab=dashboard')}
            style={{ padding: '0.75rem 1.5rem', background: 'var(--primary)', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600 }}
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%', overflow: 'hidden' }} className="animate-fade-in">
      {isTemplateBuilder && (
        <div style={{ background: 'var(--primary)', color: 'white', padding: '0.75rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
            <Settings size={18} />
            <span>TEMPLATE EDITING MODE: {documentTitle}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => {
              const tmpl = templates.find(t => t.id === loadedId);
              if (tmpl) saveTemplate(tmpl.id, blocks, false, "Live Template Edit");
              setSaveStatus("Saved to Registry!");
              setTimeout(() => setSaveStatus(""), 2000);
            }} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>
              {saveStatus || 'Save Changes Globally'}
            </button>
            <button onClick={() => router.push('/?tab=template-setup')} style={{ background: 'rgba(0,0,0,0.2)', border: 'none', color: 'white', padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>
              Close Editor
            </button>
          </div>
        </div>
      )}
      {/* Top Action Header (Toolbar) */}
      <div className="header-actions" style={{ flexShrink: 0, height: '60px', position: 'relative', display: isTemplateBuilder ? 'none' : 'block' }}>
        <EnterpriseWorkspaceToolbar
          showAiPanel={showAiPanel}
          setShowAiPanel={setShowAiPanel}
          showPropertiesPanel={showPropertiesPanel}
          setShowPropertiesPanel={setShowPropertiesPanel}
          isManualEdit={isManualEdit}
          setIsManualEdit={setIsManualEdit}
          docType={docType}
          documentTitle={documentTitle}
          isTemplateBuilder={isTemplateBuilder}
          currentPageId={currentPageId}
          navigationStack={navigationStack}
          onNavigateBack={() => {
            if (currentPageId) {
              localStorage.setItem(`doc_subpage_${currentPageId}`, JSON.stringify(blocks));
              if (rootBlocks) {
                setBlocks(rootBlocks);
                setRootBlocks(null);
              } else {
                const storedRoot = localStorage.getItem(`doc_root_${documentId}`);
                if (storedRoot) setBlocks(JSON.parse(storedRoot));
              }
              setCurrentPageId(null);
              setNavigationStack([]);
            }
          }}
          saveStatus={saveStatus}
          onSave={handleSave}
        />
      </div>

        {/* 3-Column Workspace Panel Row */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', background: 'var(--background)' }}>
        
        {/* ==============================================
           LEFT COLUMN: DASHBOARD NAVIGATION
           ============================================== */}
        {showAiPanel && (
          <div className="editor-ai-panel animate-fade-in" style={{ width: '210px', borderRight: '1px solid var(--border)', background: 'var(--background)', display: 'flex', flexDirection: 'column', flexShrink: 0, overflowY: 'auto' }}>
            <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.15rem', position: 'relative' }}>
              {(docType === 'brd' ? [
                { id: 'executive', icon: '📊', label: 'Executive Summary' },
                { id: 'templates', icon: '📋', label: 'BRD Templates' },
                { id: 'requirements', icon: '📄', label: 'Requirement Modules' },
                { id: 'scope', icon: '🎯', label: 'Scope Management' },
                { id: 'stakeholders', icon: '👥', label: 'Stakeholders' },
                { id: 'workflows', icon: '🔄', label: 'Workflows' },
                { id: 'approvals', icon: '✍️', label: 'Approvals' },
                { id: 'risks', icon: '⚠️', label: 'Risks' },
                { id: 'integrations', icon: '🔗', label: 'Integrations' },
                { id: 'analytics', icon: '📈', label: 'Analytics' },
                { id: 'timeline', icon: '📅', label: 'Timeline' },
                { id: 'versions', icon: '🔁', label: 'Version History' },
                { id: 'attachments', icon: '📎', label: 'Attachments' }
              ] : docType === 'frd' ? [
                { id: 'functional', icon: '⚙️', label: 'Functional Overview' },
                { id: 'user-stories', icon: '👤', label: 'User Stories' },
                { id: 'system-actors', icon: '🎭', label: 'System Actors' },
                { id: 'data-model', icon: '💾', label: 'Data Model' },
                { id: 'api-specs', icon: '🔌', label: 'API Specifications' },
                { id: 'ui-wireframes', icon: '🖼️', label: 'UI Wireframes' },
                { id: 'business-rules', icon: '📋', label: 'Business Rules' },
                { id: 'error-handling', icon: '🛑', label: 'Error Handling' }
              ] : docType === 'srs' ? [
                { id: 'architecture', icon: '🏗️', label: 'System Architecture' },
                { id: 'non-functional', icon: '⚡', label: 'Non-Functional' },
                { id: 'security', icon: '🔒', label: 'Security Specs' },
                { id: 'database', icon: '🗄️', label: 'Database Design' },
                { id: 'deployment', icon: '🚀', label: 'Deployment Plan' }
              ] : [
                { id: 'overview', icon: '📊', label: 'Overview' },
                { id: 'details', icon: '📄', label: 'Details' }
              ]).map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveBrdTab(item.id);
                    setActiveFrdTab(item.id);
                    setActiveSrsTab(item.id);
                    setActiveTddTab(item.id);
                    setLocalViewMode('dashboard');
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.65rem', textAlign: 'left',
                    fontSize: '0.78rem', fontWeight: activeBrdTab === item.id ? 700 : 500,
                    color: activeBrdTab === item.id ? '#2563EB' : 'var(--text-main)',
                    background: activeBrdTab === item.id ? 'rgba(37,99,235,0.08)' : 'transparent',
                    border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.15s',
                    borderLeft: activeBrdTab === item.id ? '3px solid #2563EB' : '3px solid transparent',
                  }}
                >
                  <span style={{ fontSize: '0.9rem' }}>{item.icon}</span> {item.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ==============================================
           MIDDLE COLUMN: DOCUMENT EDITOR A4 CANVAS
           ============================================== */}
        <div className="editor-canvas-workspace" style={{ flex: 1, overflowY: 'auto', padding: viewMode === 'dashboard' ? '0' : '2rem 1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', background: 'var(--background)' }}>
          {viewMode === 'dashboard' && allowedDocTypes.includes(docType) && ['brd', 'frd', 'srs', 'tdd', 'sprint'].includes(docType) ? (
            (docType === 'sprint') ? renderSprintDashboard() : 
            (docType === 'tdd') ? renderTddDashboard() : 
            (docType === 'srs') ? renderSrsDashboard() : 
            (docType === 'frd') ? renderFrdDashboard() : 
            renderBrdDashboard()
          ) : (
            <div className="paper-canvas" id="doc-preview-content" style={{ margin: 0, width: '100%', maxWidth: '820px', minHeight: '842px', boxShadow: 'var(--shadow-lg)' }}>
              {isManualEdit ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Sparkles size={14} /> Editing Raw Markdown Code
                  </div>
                  <textarea 
                    value={markdown}
                    onChange={(e) => {
                      setMarkdown(e.target.value);
                      setHasEditedManually(true);
                    }}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      minHeight: '600px',
                      background: 'var(--background)', 
                      color: 'var(--text-main)', 
                      border: '1px solid var(--border)', 
                      borderRadius: '8px', 
                      padding: '1.5rem', 
                      fontFamily: 'monospace', 
                      fontSize: '0.95rem',
                      lineHeight: '1.6',
                      resize: 'vertical',
                      outline: 'none'
                    }}
                  />
                </div>
              ) : (
                renderInteractivePreview()
              )}
            </div>
          )}
        </div>

        {/* ==============================================
           RIGHT COLUMN: PROPERTIES PANEL
           ============================================== */}
        {showPropertiesPanel && (
          <div className="editor-properties-panel animate-fade-in" style={{ width: '290px', borderLeft: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', flexDirection: 'column', padding: '1.25rem', overflowY: 'auto', gap: '1.5rem', flexShrink: 0 }}>
            
            {/* Document Properties section */}
            <div>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
                📄 Document Status
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.825rem', color: 'var(--text-main)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Security Check:</span>
                  <span style={{ fontWeight: 700, color: '#10b981' }}>✓ Session Secured</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Document ID:</span>
                  <span style={{ fontFamily: 'monospace' }}>{documentId}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Canvas Blocks:</span>
                  <span style={{ fontWeight: 600 }}>{blocks.length} Items</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Approx. Words:</span>
                  <span style={{ fontWeight: 600 }}>
                    {blocks.map(b => b.value).join(' ').split(/\s+/).filter(Boolean).length} Words
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.65rem', borderTop: '1px solid var(--border)', paddingTop: '0.65rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Folder/Project:</span>
                  <FolderDropdown 
                    selectedProjectId={selectedProjectId || ''}
                    onSelectProject={(newProjId) => {
                      setSelectedProjectId(newProjId);
                      try {
                        const metaList = JSON.parse(localStorage.getItem('docforge_docs_meta') || '[]');
                        const updatedMeta = metaList.map((m: any) => {
                          if (m.id === documentId) {
                            return { ...m, projectId: newProjId || undefined };
                          }
                          return m;
                        });
                        localStorage.setItem('docforge_docs_meta', JSON.stringify(updatedMeta));
                      } catch (err) {}
                    }}
                    onCreateNewClick={() => setIsCreateFolderOpen(true)}
                  />
                </div>
              </div>
            </div>

            {/* Active Formatting controls */}
            <div>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
                🎨 Active Block Style
              </h3>
              {activeActionsBlockId ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.825rem' }}>
                  <span style={{ color: 'var(--primary)', fontWeight: 600 }}>✓ Block selected: {activeActionsBlockId}</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Select text alignments:</span>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <button 
                        onClick={() => {
                          pushStateToHistory(blocks, documentTitle);
                          setBlocks(blocks.map(b => b.id === activeActionsBlockId ? { ...b, align: 'left' } : b));
                        }}
                        className="btn btn-secondary" 
                        style={{ flex: 1, padding: '0.25rem', fontSize: '0.75rem' }}
                      >
                        Left
                      </button>
                      <button 
                        onClick={() => {
                          pushStateToHistory(blocks, documentTitle);
                          setBlocks(blocks.map(b => b.id === activeActionsBlockId ? { ...b, align: 'center' } : b));
                        }}
                        className="btn btn-secondary" 
                        style={{ flex: 1, padding: '0.25rem', fontSize: '0.75rem' }}
                      >
                        Center
                      </button>
                      <button 
                        onClick={() => {
                          pushStateToHistory(blocks, documentTitle);
                          setBlocks(blocks.map(b => b.id === activeActionsBlockId ? { ...b, align: 'right' } : b));
                        }}
                        className="btn btn-secondary" 
                        style={{ flex: 1, padding: '0.25rem', fontSize: '0.75rem' }}
                      >
                        Right
                      </button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Change block backgrounds:</span>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <div onClick={() => {
                        pushStateToHistory(blocks, documentTitle);
                        setBlocks(blocks.map(b => b.id === activeActionsBlockId ? { ...b, backgroundColor: 'var(--surface)' } : b));
                      }} style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'var(--surface)', border: '1px solid #cbd5e1', cursor: 'pointer' }} title="White" />
                      <div onClick={() => {
                        pushStateToHistory(blocks, documentTitle);
                        setBlocks(blocks.map(b => b.id === activeActionsBlockId ? { ...b, backgroundColor: '#f0f9ff' } : b));
                      }} style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#f0f9ff', border: '1px solid #bae6fd', cursor: 'pointer' }} title="Light Sky Blue" />
                      <div onClick={() => {
                        pushStateToHistory(blocks, documentTitle);
                        setBlocks(blocks.map(b => b.id === activeActionsBlockId ? { ...b, backgroundColor: '#f0fdf4' } : b));
                      }} style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#f0fdf4', border: '1px solid #bbf7d0', cursor: 'pointer' }} title="Soft Green" />
                      <div onClick={() => {
                        pushStateToHistory(blocks, documentTitle);
                        setBlocks(blocks.map(b => b.id === activeActionsBlockId ? { ...b, backgroundColor: '#fffbeb' } : b));
                      }} style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#fffbeb', border: '1px solid #fef08a', cursor: 'pointer' }} title="Soft Yellow" />
                      <div onClick={() => {
                        pushStateToHistory(blocks, documentTitle);
                        setBlocks(blocks.map(b => b.id === activeActionsBlockId ? { ...b, backgroundColor: '#fef2f2' } : b));
                      }} style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#fef2f2', border: '1px solid #fecaca', cursor: 'pointer' }} title="Soft Red" />
                    </div>
                  </div>
                </div>
              ) : (
                <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  Click a block's drag handle or focus a paragraph textarea to display format controllers.
                </span>
              )}
            </div>

            {/* Quick Export actions section */}
            <div>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
                📥 Export Coordinates
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button 
                  onClick={() => exportToPdf('doc-preview-content', 'custom-doc')} 
                  className="btn btn-primary" 
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', fontSize: '0.825rem' }}
                >
                  <Download size={15} /> Download PDF document
                </button>
                <button 
                  onClick={() => exportToDocx(markdown, 'custom-doc')} 
                  className="btn btn-secondary"
                  style={{ width: '100%', fontSize: '0.825rem' }}
                >
                  Download Word (.docx)
                </button>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => exportToMarkdown(markdown, 'custom-doc')} 
                    className="btn btn-secondary"
                    style={{ flex: 1, padding: '0.4rem', fontSize: '0.775rem' }}
                  >
                    Markdown (MD)
                  </button>
                  <button 
                    onClick={() => exportToText(markdown, 'custom-doc')} 
                    className="btn btn-secondary"
                    style={{ flex: 1, padding: '0.4rem', fontSize: '0.775rem' }}
                  >
                    Plain Text (TXT)
                  </button>
                </div>
                <button 
                  onClick={() => setIsGithubModalOpen(true)} 
                  className="btn btn-secondary" 
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', background: '#0f172a', color: 'white', border: 'none', fontSize: '0.825rem' }}
                >
                  <Upload size={14} /> Commit to GitHub repository
                </button>
              </div>
            </div>

          </div>
        )}

      </div>

      <GithubModal 
        isOpen={isGithubModalOpen} 
        onClose={() => setIsGithubModalOpen(false)} 
        markdownContent={markdown}
        defaultFilename="custom-doc"
      />

      <TemplateSaveModal
        isOpen={isTemplateSaveModalOpen}
        onClose={() => setIsTemplateSaveModalOpen(false)}
        templateId={docType} // We use docType or a template ID param here
        blocks={blocks}
        onSuccess={() => {
          // Toast or redirect handled here
          console.log("Template saved successfully");
        }}
      />
      
      <CreateFolderModal 
        isOpen={isCreateFolderOpen}
        onClose={() => setIsCreateFolderOpen(false)}
        onSuccess={(newProjectId) => {
          setSelectedProjectId(newProjectId);
          try {
            const metaList = JSON.parse(localStorage.getItem('docforge_docs_meta') || '[]');
            const updatedMeta = metaList.map((m: any) => {
              if (m.id === documentId) {
                return { ...m, projectId: newProjectId };
              }
              return m;
            });
            localStorage.setItem('docforge_docs_meta', JSON.stringify(updatedMeta));
          } catch (err) {}
        }}
      />
      {configEditorOpen && (
        <TemplateConfigEditor 
          templateId={docType} 
          configType={configEditorOpen} 
          onClose={() => setConfigEditorOpen(null)} 
        />
      )}
    </div>
  );
}

