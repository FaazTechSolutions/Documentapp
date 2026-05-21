"use client";
import { useState, useEffect } from 'react';
import { pushToGithub } from '@/lib/github';
import { X, Upload, Loader2 } from 'lucide-react';

interface GithubModalProps {
  isOpen: boolean;
  onClose: () => void;
  markdownContent: string;
  defaultFilename: string;
}

export default function GithubModal({ isOpen, onClose, markdownContent, defaultFilename }: GithubModalProps) {
  const [token, setToken] = useState('');
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [branch, setBranch] = useState('main');
  const [path, setPath] = useState(`docs/${defaultFilename}.md`);
  const [message, setMessage] = useState('Add new document via DocForge');
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Load saved credentials
    const saved = localStorage.getItem('github_credentials');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.token) setToken(parsed.token);
        if (parsed.owner) setOwner(parsed.owner);
        if (parsed.repo) setRepo(parsed.repo);
        if (parsed.branch) setBranch(parsed.branch);
      } catch (e) {}
    }
  }, []);

  // Update default path when template changes
  useEffect(() => {
    setPath(`docs/${defaultFilename}.md`);
  }, [defaultFilename]);

  if (!isOpen) return null;

  const handlePush = async () => {
    try {
      setStatus('loading');
      setErrorMessage('');
      
      // Save credentials for next time
      localStorage.setItem('github_credentials', JSON.stringify({ token, owner, repo, branch }));

      await pushToGithub({
        token, owner, repo, branch, path, message, content: markdownContent
      });

      setStatus('success');
      setTimeout(() => {
        onClose();
        setStatus('idle');
      }, 2000);
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'An unknown error occurred');
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} className="animate-fade-in">
      <div className="glass-panel" style={{ width: '450px', maxWidth: '90vw', padding: '1.5rem', position: 'relative', background: 'var(--surface)' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)' }}>
          <X size={20} />
        </button>
        
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 0, marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
          <Upload size={24} /> Push to GitHub
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
             <label className="form-label" style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>Personal Access Token (PAT)</label>
             <input type="password" value={token} onChange={e => setToken(e.target.value)} className="form-input" placeholder="ghp_..." />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
               <label className="form-label" style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>Owner / Org</label>
               <input type="text" value={owner} onChange={e => setOwner(e.target.value)} className="form-input" placeholder="octocat" />
            </div>
            <div style={{ flex: 1 }}>
               <label className="form-label" style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>Repository</label>
               <input type="text" value={repo} onChange={e => setRepo(e.target.value)} className="form-input" placeholder="my-docs" />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
               <label className="form-label" style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>Branch</label>
               <input type="text" value={branch} onChange={e => setBranch(e.target.value)} className="form-input" placeholder="main" />
            </div>
            <div style={{ flex: 2 }}>
               <label className="form-label" style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>File Path</label>
               <input type="text" value={path} onChange={e => setPath(e.target.value)} className="form-input" placeholder="docs/file.md" />
            </div>
          </div>
          <div>
             <label className="form-label" style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>Commit Message</label>
             <input type="text" value={message} onChange={e => setMessage(e.target.value)} className="form-input" />
          </div>

          {status === 'error' && (
            <div style={{ padding: '0.75rem', background: '#fee2e2', color: '#b91c1c', borderRadius: '4px', fontSize: '0.875rem' }}>
              {errorMessage}
            </div>
          )}

          {status === 'success' && (
            <div style={{ padding: '0.75rem', background: '#d1fae5', color: '#047857', borderRadius: '4px', fontSize: '0.875rem' }}>
              Successfully pushed to GitHub!
            </div>
          )}

          <button 
             onClick={handlePush} 
             disabled={status === 'loading' || !token || !owner || !repo || !path}
             className="btn btn-primary" 
             style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}
          >
            {status === 'loading' ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
            {status === 'loading' ? 'Pushing...' : 'Push Document'}
          </button>
        </div>
      </div>
    </div>
  );
}
