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
  Edit3,
  Activity,
  Clock,
  CheckCircle
} from 'lucide-react';
import QuickDraftEditor from '@/components/QuickDraftEditor';
import CustomDocumentEditor from '@/components/CustomDocumentEditor';
import SavedDocumentsList from '@/components/SavedDocumentsList';
import TemplateSetup from '@/components/TemplateSetup/TemplateSetup';
import ProjectsDashboard from '@/components/ProjectsDashboard';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import * as Initializers from '@/lib/templateInitializers';
import BuilderWorkspace from '@/components/builder/BuilderWorkspace';
import WorkspaceDashboardRouter from '@/components/workspace/WorkspaceDashboardRouter';

function MainDashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = searchParams.get('tab') || 'dashboard';

  // Template Module state
  const [activeTemplateModule, setActiveTemplateModule] = useState<'all' | 'pm' | 'qa' | 'devops' | 'support'>('all');

  // DevOps Command Center States
  const [selectedResource, setSelectedResource] = useState<'app' | 'db' | 'lb'>('app');
  const [telemetryTicks, setTelemetryTicks] = useState(0);
  const [logs, setLogs] = useState<string[]>([
    "[INFO] 2026-05-20 18:09:53 - Connection established from LB-01",
    "[SUCCESS] 2026-05-20 18:09:55 - Healthcheck passed for PROD-APP-01",
    "[INFO] 2026-05-20 18:10:01 - Deployment pipeline triggered by git-push"
  ]);

  useEffect(() => {
    if (activeTemplateModule !== 'devops') return;
    const interval = setInterval(() => {
      setTelemetryTicks(t => t + 1);
      const possibleLogs = [
        `[INFO] ${new Date().toLocaleTimeString()} - Connection established from LB-01`,
        `[SUCCESS] ${new Date().toLocaleTimeString()} - Healthcheck passed for PROD-APP-01`,
        `[WARN] ${new Date().toLocaleTimeString()} - High CPU usage on PROD-APP-03: ${Math.floor(88 + Math.random() * 10)}%`,
        `[INFO] ${new Date().toLocaleTimeString()} - Deployment pipeline triggered by git-push`,
        `[SUCCESS] ${new Date().toLocaleTimeString()} - Docker container built: tag v3.2.${Math.floor(Math.random() * 20)}`,
        `[INFO] ${new Date().toLocaleTimeString()} - Syncing Environment variables across cluster`,
        `[WARN] ${new Date().toLocaleTimeString()} - Conf drift detected on PROD-DB-02`,
        `[SUCCESS] ${new Date().toLocaleTimeString()} - Automated failover dry-run complete`
      ];
      const randomLog = possibleLogs[Math.floor(Math.random() * possibleLogs.length)];
      setLogs(prev => [...prev.slice(-9), randomLog]);
    }, 3000);
    return () => clearInterval(interval);
  }, [activeTemplateModule]);

  // Help & Support Center States
  const [supportNavSection, setSupportNavSection] = useState('user-guides');
  const [supportSearchQuery, setSupportSearchQuery] = useState('');

  useEffect(() => {
    setActiveTemplateModule('all');
  }, [tab]);

  // Global Mock States
  const { projects, deleteProject, syncFromStorage } = useProjectStore();
  const [newProjectName, setNewProjectName] = useState('');
  const [folderError, setfolderError] = useState('');

  // Hydrate projects from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('docforge_projects');
      if (saved) {
        try {
          // setProjects(JSON.parse(saved));
          return;
        } catch (e) {}
      }
      
      }
  }, []);

  
  const getDocCountForProject = (projId: number | string) => {
    try {
      const savedDocs = JSON.parse(localStorage.getItem('docforge_saved_documents') || '[]');
      const metaList = JSON.parse(localStorage.getItem('docforge_docs_meta') || '[]');
      
      // Count unique document IDs associated with this project
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

  
    
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'Siddiq Admin', role: 'Administrator', status: 'online', avatar: '👨‍💼' },
    { id: 2, name: 'Ahmad Al-Mansoor', role: 'Senior Reviewer', status: 'away', avatar: '👨‍💻' },
    { id: 3, name: 'Fathima Zahra', role: 'Document Editor', status: 'online', avatar: '👩‍💻' }
  ]);
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState('Editor');

  const [approvals, setApprovals] = useState([
    { id: 1, title: 'NGO Grant Proposal Sign-off', reviewer: 'Siddiq Admin', status: 'pending', date: 'May 19, 2026' },
    { id: 3, title: 'HR Compensation Policy 2026', reviewer: 'Siddiq Admin', status: 'pending', date: 'May 17, 2026' }
  ]);

  interface KanbanCard {
    id: string;
    title: string;
    stage: string;
    priority: string;
    owner: string;
    lastUpdated: string;
  }

  // Kanban board mock items
  const [kanbanCards, setKanbanCards] = useState<KanbanCard[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('docforge_kanban_cards');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return [
      { id: 'k1', title: 'Software Requirements Specification (SRS) - Enterprise Billing', stage: 'Draft', priority: 'High', owner: 'Fathima Zahra', lastUpdated: 'May 19, 2026' },
      { id: 'k3', title: 'Employee Attendance Management BRD', stage: 'Review', priority: 'Medium', owner: 'Siddiq Admin', lastUpdated: 'May 19, 2026' },
      { id: 'k4', title: 'Charitable Trust Grant Proposal v1.0', stage: 'Approval', priority: 'High', owner: 'Siddiq Admin', lastUpdated: 'May 17, 2026' },
      { id: 'k5', title: 'HR Compensation Policy 2026', stage: 'Published', priority: 'Low', owner: 'Fathima Zahra', lastUpdated: 'May 16, 2026' }
    ];
  });

  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardPriority, setNewCardPriority] = useState('Medium');
  const [newCardOwner, setNewCardOwner] = useState('Siddiq Admin');
  const [showAddCardForm, setShowAddCardForm] = useState(false);

  // Save to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('docforge_kanban_cards', JSON.stringify(kanbanCards));
  }, [kanbanCards]);

  // AI assistant workspace states
  const [aiInput, setAiInput] = useState('');
  const [aiOutput, setAiOutput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiTemperature, setAiTemperature] = useState(0.8);
  const [aiMaxTokens, setAiMaxTokens] = useState(300);

  // Settings states
  const [themeMode, setThemeMode] = useState('light');
  const [apiEndpoint, setApiEndpoint] = useState('https://portaldev.mawarid.com.sa:6080/platform-test-ai/agents/agent_1779168092372/text');

  // Load theme preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('docforge_theme') || 'light';
    setThemeMode(savedTheme);

    // Pre-seed the templates and demo document if not already initialized
    const metaListStr = localStorage.getItem('docforge_docs_meta');
    let metaList: any[] = [];
    if (metaListStr) {
      metaList = JSON.parse(metaListStr);
      // Clean up legacy VAT template from user's storage
      const origLength = metaList.length;
      metaList = metaList.filter((m: any) => m.id !== 'template-vat');
      if (origLength !== metaList.length) {
        localStorage.setItem('docforge_docs_meta', JSON.stringify(metaList));
        localStorage.removeItem('docforge_doc_template-vat');
      }
    }

    const defaultTemplates = [
      { id: 'template-brd', title: 'Business Requirement Document (BRD)', type: 'brd', desc: 'A strict, highly structured 12-section layout including Purpose, Scope Matrix, Stakeholders, Functional & Non-Functional Requirements, Workflows, Assumptions, and approvals.' },
      { id: 'template-frd', title: 'Feature Requirement Document (FRD)', type: 'frd', desc: 'Detailed feature specification with objectives, user stories, acceptance criteria, UI requirements, validation rules, dependencies, and comments & feedback workflow.' },
      { id: 'template-srs', title: 'Enterprise Software Requirement Specification', type: 'srs', desc: 'Full technical SRS layout with engineering header, API explorer table, architecture flows, modules, database schema, security, DevOps, monitoring, performance, versioning, and approval workflow.' },
      { id: 'template-tdd', title: 'Technical Design Document (TDD)', type: 'tdd', desc: 'Complete system architecture plan covering component responsibilities, database schemas, API communication, and security integrations.' },
      { id: 'template-sprint', title: 'Sprint Planning Document', type: 'sprint', desc: 'Kanban sprint board with capacity planning, story points, burndown tracking, and team workload allocation.' },
      { id: 'template-backlog', title: 'Product Backlog', type: 'backlog', desc: 'Feature backlog management workspace with prioritization, effort/impact scoring, department filtering, and release tagging.' },
      { id: 'template-taskbreak', title: 'Task Breakdown Sheet', type: 'taskbreak', desc: 'Developer execution workspace with task cards, workload tracking, git branch linking, and completion progress.' },
      { id: 'template-estimation', title: 'Estimation Document', type: 'estimation', desc: 'Financial and technical planning dashboard with module-wise cost estimation, resource allocation, and effort visualization.' },
      { id: 'template-risk', title: 'Risk Register', type: 'risk', desc: 'Enterprise risk control dashboard with risk scoring, impact/probability heatmap, mitigation plans, and SLA alerts.' },
      { id: 'template-cr', title: 'Change Request Document', type: 'cr', desc: 'Approval workflow platform with impact analysis, cost estimation, scope change tracking, and digital signatures.' },
      { id: 'template-release', title: 'Release Plan', type: 'release', desc: 'DevOps rollout dashboard with deployment pipeline, release readiness scoring, rollback plans, and feature checklists.' },
      { id: 'template-status', title: 'Daily / Weekly Status Report', type: 'status', desc: 'Executive dashboard with team progress tracking, blocker identification, achievement summaries, and trend analytics.' },
      { id: 'template-testplan', title: 'Test Plan & Strategy', type: 'testplan', desc: 'High-level QA planning scope, browser matrices, and environment settings.' },
      { id: 'template-testcases', title: 'Test Case Specification', type: 'testcases', desc: 'Functional test suites table with preconditions, execution steps, expected outcomes, and current status checks.' },
      { id: 'template-buglog', title: 'Bug & Defect Register', type: 'buglog', desc: 'Centralized registry tracking active defects, blocker triage statuses, and code resolution records across sprint modules.' },
      { id: 'template-uat', title: 'User Acceptance Testing / UAT Sign-off', type: 'uat', desc: 'UAT checklists, blocker logs, formal acceptance declarations, and signature approvals.' },
      { id: 'template-devops-deploy', title: 'Deployment Guide', type: 'devops-deploy', desc: 'Production Rollout & Deployment Guide detailing rollout steps, checklists, pipelines, and post-release testing.' },
      { id: 'template-devops-server', title: 'Server Configuration Document', type: 'devops-server', desc: 'Infrastructure Inventory & Server Configurations covering hardware specifications, dependency mappings, and services.' },
      { id: 'template-devops-backup', title: 'Backup & Recovery Plan', type: 'devops-backup', desc: 'Disaster Recovery & Backup Plan defining incremental strategy flows, recovery checklist guides, and failovers.' },
      { id: 'template-devops-pipeline', title: 'CI/CD Pipeline Document', type: 'devops-pipeline', desc: 'CI/CD Pipelines & Build Engine Configuration outlining stages, test coverage targets, triggers, and Docker settings.' },
      { id: 'template-devops-env', title: 'Environment Configuration Sheet', type: 'devops-env', desc: 'Multi-Environment Configuration Sheet detailing Dev, Staging, and Production connection strings, IP tables, and ports.' },
      { id: 'template-devops-monitor', title: 'Monitoring & Logging Guide', type: 'devops-monitor', desc: 'Logging & Observability Operations Guide defining alert triage protocols, ELK aggregation models, and registries.' },
      { id: 'template-support-usermanual', title: 'User Manual', type: 'support-usermanual', desc: 'Interactive product learning portal with feature walkthroughs, guided workflows, and screenshot annotations.' },
      { id: 'template-support-adminmanual', title: 'Admin Manual', type: 'support-adminmanual', desc: 'Operations control dashboard covering user roles, permission mappings, audit logs, and system settings.' },
      { id: 'template-support-training', title: 'Training Material', type: 'support-training', desc: 'Corporate learning platform with course progress, video lessons, quizzes, and certification tracking.' },
      { id: 'template-support-faq', title: 'FAQ Document', type: 'support-faq', desc: 'Search-first knowledge base with categorized Q&A accordions, trending issues, and AI-powered suggestions.' },
      { id: 'template-support-troubleshoot', title: 'Troubleshooting Guide', type: 'support-troubleshoot', desc: 'Diagnostic support center with error resolution cards, root cause workflows, and escalation guides.' },
      { id: 'template-support-releasenotes', title: 'Release Notes', type: 'support-releasenotes', desc: 'Product update timeline dashboard with changelogs, feature highlights, and upgrade instructions.' }
    ];

    let metaChanged = false;
    defaultTemplates.forEach(t => {
      const exists = metaList.some((m: any) => m.id === t.id);
      if (!exists) {
        metaChanged = true;
        metaList.push({
          id: t.id,
          title: t.title,
          desc: t.desc,
          lastSaved: new Date().toLocaleString(),
          type: t.type,
          isTemplate: true
        });

        let blocks: Record<string, unknown>[] = [];
        if (t.type === 'brd') blocks = Initializers.getBrdTemplateBlocks(t.title);
        else if (t.type === 'frd') blocks = Initializers.getFrdTemplateBlocks(t.title);
        else if (t.type === 'srs') blocks = Initializers.getEnterpriseSrsTemplateBlocks(t.title);
        else if (t.type === 'tdd') blocks = Initializers.getTddTemplateBlocks(t.title);
        else if (t.type === 'testplan') blocks = Initializers.getTestPlanTemplateBlocks(t.title);
        else if (t.type === 'testcases') blocks = Initializers.getTestCasesTemplateBlocks(t.title);
        else if (t.type === 'buglog') blocks = Initializers.getBugLogTemplateBlocks(t.title);
        else if (t.type === 'uat') blocks = Initializers.getUatTemplateBlocks(t.title);
        else if (t.type === 'devops-deploy') blocks = Initializers.getDevopsDeployTemplateBlocks(t.title);
        else if (t.type === 'devops-server') blocks = Initializers.getDevopsServerTemplateBlocks(t.title);
        else if (t.type === 'devops-backup') blocks = Initializers.getDevopsBackupTemplateBlocks(t.title);
        else if (t.type === 'devops-pipeline') blocks = Initializers.getDevopsPipelineTemplateBlocks(t.title);
        else if (t.type === 'devops-env') blocks = Initializers.getDevopsEnvTemplateBlocks(t.title);
        else if (t.type === 'devops-monitor') blocks = Initializers.getDevopsMonitorTemplateBlocks(t.title);
        else if (t.type === 'support-usermanual') blocks = Initializers.getSupportUserManualBlocks(t.title);
        else if (t.type === 'support-adminmanual') blocks = Initializers.getSupportAdminManualBlocks(t.title);
        else if (t.type === 'support-training') blocks = Initializers.getSupportTrainingBlocks(t.title);
        else if (t.type === 'support-faq') blocks = Initializers.getSupportFaqBlocks(t.title);
        else if (t.type === 'support-troubleshoot') blocks = Initializers.getSupportTroubleshootBlocks(t.title);
        else if (t.type === 'support-releasenotes') blocks = Initializers.getSupportReleaseNotesBlocks(t.title);
        else if (t.type === 'sprint') blocks = [
          { id: 's1', type: 'header', headingLevel: '1', value: 'Sprint Planning Document' },
          { id: 's2', type: 'textarea', value: 'Sprint Goal: Define and document the sprint objectives, team capacity, and task allocation for the upcoming iteration.' },
          { id: 's3', type: 'header', headingLevel: '2', value: 'Sprint Dashboard' },
          { id: 's4', type: 'metric-cards', value: JSON.stringify([
            { title: 'Sprint Number', value: '12', color: '#0284c7', desc: 'Current iteration' },
            { title: 'Story Points', value: '42', color: '#6366f1', desc: 'Total committed' },
            { title: 'Team Capacity', value: '160 hrs', color: '#10b981', desc: 'Available hours' },
            { title: 'Sprint Duration', value: '2 Weeks', color: '#f59e0b', desc: '10 working days' }
          ]) },
          { id: 's5', type: 'header', headingLevel: '2', value: 'Sprint Board' },
          { id: 's6', type: 'kanban-board', value: JSON.stringify([
            { title: 'Backlog', color: '#94a3b8', items: [{ id: 'sb1', text: 'Design system tokens', priority: 'Low', assignee: 'UI Team' }] },
            { title: 'To Do', color: '#0284c7', items: [{ id: 'sb2', text: 'JWT Authentication', priority: 'High', assignee: 'Backend Team' }] },
            { title: 'In Progress', color: '#f59e0b', items: [{ id: 'sb3', text: 'Dashboard API integration', priority: 'Critical', assignee: 'Dev Team A' }] },
            { title: 'Testing', color: '#8b5cf6', items: [] },
            { title: 'Done', color: '#10b981', items: [] }
          ]) },
          { id: 's7', type: 'header', headingLevel: '2', value: 'Sprint Task Card' },
          { id: 's8', type: 'detailed-card', value: JSON.stringify({ id: 'AUTH-102', title: 'JWT Authentication Module', fields: [
            { label: 'Feature', value: 'JWT Authentication' },
            { label: 'Assigned To', value: 'Backend Team' },
            { label: 'Story Points', value: '8' },
            { label: 'Priority', value: 'High' },
            { label: 'Dependencies', value: 'User Service API' },
            { label: 'Status', value: 'In Progress' }
          ] }) },
          { id: 's9', type: 'header', headingLevel: '2', value: 'Capacity Planning' },
          { id: 's10', type: 'table', value: JSON.stringify([
            ['Team Member', 'Capacity', 'Assigned', 'Remaining'],
            ['Developer A', '40 hrs', '32 hrs', '8 hrs'],
            ['QA Engineer', '35 hrs', '25 hrs', '10 hrs'],
            ['DevOps Lead', '30 hrs', '20 hrs', '10 hrs']
          ]) }
        ];
        else if (t.type === 'backlog') blocks = [
          { id: 'b1', type: 'header', headingLevel: '1', value: 'Product Backlog' },
          { id: 'b2', type: 'textarea', value: 'Central feature backlog for tracking, prioritizing, and managing all product requirements across departments.' },
          { id: 'b3', type: 'header', headingLevel: '2', value: 'Backlog Overview' },
          { id: 'b4', type: 'metric-cards', value: JSON.stringify([
            { title: 'Total Features', value: '124', color: '#0284c7', desc: 'All tracked items' },
            { title: 'Pending', value: '46', color: '#f59e0b', desc: 'Awaiting assignment' },
            { title: 'High Priority', value: '12', color: '#ef4444', desc: 'Needs immediate attention' },
            { title: 'Completed', value: '66', color: '#10b981', desc: 'Shipped to production' }
          ]) },
          { id: 'b5', type: 'header', headingLevel: '2', value: 'Feature Backlog Cards' },
          { id: 'b6', type: 'detailed-card', value: JSON.stringify({ id: 'CRM-201', title: 'Lead Assignment Automation', fields: [
            { label: 'Business Impact', value: 'High' },
            { label: 'Priority', value: 'Critical' },
            { label: 'Estimated Time', value: '18 Hours' },
            { label: 'Requested By', value: 'Sales Department' },
            { label: 'Status', value: 'Backlog' }
          ] }) },
          { id: 'b7', type: 'detailed-card', value: JSON.stringify({ id: 'CRM-202', title: 'Customer Portal Redesign', fields: [
            { label: 'Business Impact', value: 'Medium' },
            { label: 'Priority', value: 'High' },
            { label: 'Estimated Time', value: '40 Hours' },
            { label: 'Requested By', value: 'Product Team' },
            { label: 'Status', value: 'Pending' }
          ] }) }
        ];
        else if (t.type === 'taskbreak') blocks = [
          { id: 'tb1', type: 'header', headingLevel: '1', value: 'Task Breakdown Sheet' },
          { id: 'tb2', type: 'textarea', value: 'Developer execution workspace for granular task tracking, code branch management, and completion monitoring.' },
          { id: 'tb3', type: 'header', headingLevel: '2', value: 'Task Board by Department' },
          { id: 'tb4', type: 'kanban-board', value: JSON.stringify([
            { title: 'Frontend', color: '#0284c7', items: [
              { id: 'tf1', text: 'Build Dashboard UI', priority: 'High', assignee: 'Frontend Dev A' },
              { id: 'tf2', text: 'Attendance Calendar Widget', priority: 'Medium', assignee: 'Frontend Dev B' }
            ] },
            { title: 'Backend', color: '#6366f1', items: [
              { id: 'tf3', text: 'Build Attendance API', priority: 'High', assignee: 'Backend Dev' }
            ] },
            { title: 'QA', color: '#10b981', items: [
              { id: 'tf4', text: 'API Integration Tests', priority: 'Medium', assignee: 'QA Engineer' }
            ] }
          ]) },
          { id: 'tb5', type: 'header', headingLevel: '2', value: 'Developer Task Card' },
          { id: 'tb6', type: 'detailed-card', value: JSON.stringify({ id: 'TASK-331', title: 'Build Attendance API', fields: [
            { label: 'Assigned To', value: 'Backend Developer' },
            { label: 'Estimated Hours', value: '12' },
            { label: 'Dependencies', value: 'Authentication Module' },
            { label: 'Status', value: 'Pending' },
            { label: 'Code Branch', value: 'feature/attendance-api' }
          ] }) },
          { id: 'tb7', type: 'header', headingLevel: '2', value: 'Developer Workload' },
          { id: 'tb8', type: 'progress-bars', value: JSON.stringify([
            { label: 'Developer A', value: 75, color: '#0284c7' },
            { label: 'Developer B', value: 40, color: '#6366f1' },
            { label: 'QA Engineer', value: 55, color: '#10b981' }
          ]) }
        ];
        else if (t.type === 'estimation') blocks = [
          { id: 'e1', type: 'header', headingLevel: '1', value: 'Estimation Document' },
          { id: 'e2', type: 'textarea', value: 'Financial and technical planning dashboard for module-wise cost estimation, resource allocation, and effort visualization.' },
          { id: 'e3', type: 'header', headingLevel: '2', value: 'Estimation Summary' },
          { id: 'e4', type: 'metric-cards', value: JSON.stringify([
            { title: 'Total Cost', value: '₹8,40,000', color: '#f59e0b', desc: 'Estimated budget' },
            { title: 'Estimated Hours', value: '420 hrs', color: '#0284c7', desc: 'Total effort' },
            { title: 'Resources', value: '8', color: '#6366f1', desc: 'Team members allocated' },
            { title: 'Timeline', value: '12 Weeks', color: '#10b981', desc: 'Project duration' }
          ]) },
          { id: 'e5', type: 'header', headingLevel: '2', value: 'Module-wise Estimation' },
          { id: 'e6', type: 'table', value: JSON.stringify([
            ['Module', 'Hours', 'Cost (₹)', 'Resource'],
            ['Authentication', '24', '48,000', 'Backend'],
            ['Dashboard', '40', '80,000', 'Frontend'],
            ['Payroll Engine', '60', '1,20,000', 'Backend'],
            ['Reporting', '32', '64,000', 'Full Stack'],
            ['QA & Testing', '48', '96,000', 'QA Team']
          ]) },
          { id: 'e7', type: 'header', headingLevel: '2', value: 'Effort Distribution' },
          { id: 'e8', type: 'progress-bars', value: JSON.stringify([
            { label: 'Frontend', value: 30, color: '#0284c7' },
            { label: 'Backend', value: 45, color: '#6366f1' },
            { label: 'QA', value: 20, color: '#f59e0b' },
            { label: 'DevOps', value: 10, color: '#10b981' }
          ]) }
        ];
        else if (t.type === 'risk') blocks = [
          { id: 'r1', type: 'header', headingLevel: '1', value: 'Risk Register' },
          { id: 'r2', type: 'textarea', value: 'Enterprise risk control dashboard for identifying, scoring, and mitigating project risks with real-time monitoring.' },
          { id: 'r3', type: 'header', headingLevel: '2', value: 'Risk Dashboard' },
          { id: 'r4', type: 'metric-cards', value: JSON.stringify([
            { title: 'Critical Risks', value: '3', color: '#ef4444', desc: 'Immediate action required' },
            { title: 'Open Risks', value: '12', color: '#f59e0b', desc: 'Under monitoring' },
            { title: 'Mitigated', value: '8', color: '#10b981', desc: 'Successfully resolved' },
            { title: 'Risk Score', value: '7.2', color: '#6366f1', desc: 'Weighted average' }
          ]) },
          { id: 'r5', type: 'header', headingLevel: '2', value: 'Risk Cards' },
          { id: 'r6', type: 'detailed-card', value: JSON.stringify({ id: 'RSK-101', title: 'Payment API Instability', fields: [
            { label: 'Impact', value: 'High' },
            { label: 'Probability', value: 'Medium' },
            { label: 'Mitigation', value: 'Fallback payment gateway' },
            { label: 'Owner', value: 'Technical Lead' },
            { label: 'Status', value: 'Monitoring' }
          ] }) },
          { id: 'r7', type: 'detailed-card', value: JSON.stringify({ id: 'RSK-102', title: 'Data Migration Failure', fields: [
            { label: 'Impact', value: 'Critical' },
            { label: 'Probability', value: 'Low' },
            { label: 'Mitigation', value: 'Incremental migration with rollback' },
            { label: 'Owner', value: 'Database Admin' },
            { label: 'Status', value: 'Monitoring' }
          ] }) },
          { id: 'r8', type: 'header', headingLevel: '2', value: 'Risk Heatmap Legend' },
          { id: 'r9', type: 'callout', value: '🔴 HIGH IMPACT + HIGH PROBABILITY = Critical\n🟡 MEDIUM IMPACT + MEDIUM PROBABILITY = Watch\n🟢 LOW IMPACT + LOW PROBABILITY = Acceptable' }
        ];
        else if (t.type === 'cr') blocks = [
          { id: 'c1', type: 'header', headingLevel: '1', value: 'Change Request Document' },
          { id: 'c2', type: 'textarea', value: 'Formal change request workflow for tracking scope changes, cost impact, timeline adjustments, and approval signatures.' },
          { id: 'c3', type: 'header', headingLevel: '2', value: 'Change Request Workflow' },
          { id: 'c4', type: 'numbered-list', value: 'Step 1: Request Submitted' },
          { id: 'c5', type: 'numbered-list', value: 'Step 2: Impact Analysis' },
          { id: 'c6', type: 'numbered-list', value: 'Step 3: Cost Estimation' },
          { id: 'c7', type: 'numbered-list', value: 'Step 4: Approval' },
          { id: 'c8', type: 'numbered-list', value: 'Step 5: Implementation' },
          { id: 'c9', type: 'header', headingLevel: '2', value: 'Change Request Card' },
          { id: 'c10', type: 'detailed-card', value: JSON.stringify({ id: 'CR-202', title: 'Add Biometric Attendance', fields: [
            { label: 'Requested Change', value: 'Add biometric attendance' },
            { label: 'Reason', value: 'Client requirement update' },
            { label: 'Impact', value: 'Medium' },
            { label: 'Additional Cost', value: '₹45,000' },
            { label: 'Additional Time', value: '5 Days' },
            { label: 'Status', value: 'Pending' }
          ] }) },
          { id: 'c11', type: 'header', headingLevel: '2', value: 'Impact Summary' },
          { id: 'c12', type: 'metric-cards', value: JSON.stringify([
            { title: 'Scope Changes', value: '3', color: '#f59e0b', desc: 'Pending review' },
            { title: 'Cost Impact', value: '₹1,35,000', color: '#ef4444', desc: 'Additional budget' },
            { title: 'Timeline Impact', value: '+12 Days', color: '#0284c7', desc: 'Schedule extension' },
            { title: 'Approved CRs', value: '7', color: '#10b981', desc: 'Implemented' }
          ]) }
        ];
        else if (t.type === 'release') blocks = [
          { id: 'rl1', type: 'header', headingLevel: '1', value: 'Release Plan' },
          { id: 'rl2', type: 'textarea', value: 'DevOps rollout dashboard for tracking deployment pipelines, release readiness, rollback plans, and feature inclusion.' },
          { id: 'rl3', type: 'header', headingLevel: '2', value: 'Release Overview' },
          { id: 'rl4', type: 'metric-cards', value: JSON.stringify([
            { title: 'Current Release', value: 'v2.1', color: '#0284c7', desc: 'Production target' },
            { title: 'Features', value: '8', color: '#6366f1', desc: 'Included in release' },
            { title: 'Readiness Score', value: '92%', color: '#10b981', desc: 'Deployment confidence' },
            { title: 'Deploy Date', value: '20-May-2026', color: '#f59e0b', desc: 'Scheduled' }
          ]) },
          { id: 'rl5', type: 'header', headingLevel: '2', value: 'Release Card' },
          { id: 'rl6', type: 'detailed-card', value: JSON.stringify({ id: 'REL-2.1', title: 'Production Release v2.1', fields: [
            { label: 'Features', value: 'Attendance, Payroll, Leave Mgmt' },
            { label: 'Deploy Date', value: '20-May-2026' },
            { label: 'Rollback Plan', value: 'Available' },
            { label: 'Status', value: 'Ready for Deployment' }
          ] }) },
          { id: 'rl7', type: 'header', headingLevel: '2', value: 'Deployment Pipeline' },
          { id: 'rl8', type: 'progress-bars', value: JSON.stringify([
            { label: 'Development', value: 100, color: '#10b981' },
            { label: 'QA Testing', value: 100, color: '#10b981' },
            { label: 'Staging', value: 85, color: '#0284c7' },
            { label: 'Production', value: 0, color: '#94a3b8' }
          ]) },
          { id: 'rl9', type: 'header', headingLevel: '2', value: 'Feature Checklist' },
          { id: 'rl10', type: 'todo-list', value: 'Attendance Module\nPayroll Calculations\nLeave Management\nDashboard Analytics\nAPI Documentation\nSecurity Audit\nPerformance Testing\nUser Acceptance Testing' }
        ];
        else if (t.type === 'status') blocks = [
          { id: 'st1', type: 'header', headingLevel: '1', value: 'Daily / Weekly Status Report' },
          { id: 'st2', type: 'textarea', value: 'Executive dashboard for tracking overall project progress, team performance, blockers, and daily achievements.' },
          { id: 'st3', type: 'header', headingLevel: '2', value: 'Status Overview' },
          { id: 'st4', type: 'metric-cards', value: JSON.stringify([
            { title: 'Overall Progress', value: '72%', color: '#0284c7', desc: 'Sprint completion' },
            { title: 'Blockers', value: '4', color: '#ef4444', desc: 'Needs resolution' },
            { title: 'Tasks Completed', value: '28', color: '#10b981', desc: 'This week' },
            { title: 'Tasks Remaining', value: '14', color: '#f59e0b', desc: 'In pipeline' }
          ]) },
          { id: 'st5', type: 'header', headingLevel: '2', value: 'Team Progress' },
          { id: 'st6', type: 'progress-bars', value: JSON.stringify([
            { label: 'Frontend', value: 80, color: '#0284c7' },
            { label: 'Backend', value: 65, color: '#6366f1' },
            { label: 'QA', value: 40, color: '#f59e0b' },
            { label: 'DevOps', value: 90, color: '#10b981' }
          ]) },
          { id: 'st7', type: 'header', headingLevel: '2', value: "Today's Achievements" },
          { id: 'st8', type: 'todo-list', value: 'Login API completed\nPayroll calculations optimized\nUI bug fixes deployed\nDatabase migration scripts ready' },
          { id: 'st9', type: 'header', headingLevel: '2', value: 'Blockers' },
          { id: 'st10', type: 'callout', value: '⚠️ Payment gateway integration delayed - awaiting vendor credentials\n⚠️ Client approval pending on dashboard design\n⚠️ SSL certificate renewal required before staging deploy\n⚠️ Third-party API rate limiting issue under investigation' }
        ];

        localStorage.setItem(`doc_root_${t.id}`, JSON.stringify(blocks));
      }
    });

    if (!metaList.find((m: any) => m.id === 'brd-demo-attend')) {
      metaChanged = true;
      metaList.push({
        id: 'brd-demo-attend',
        title: 'Employee Attendance Management BRD',
        lastSaved: new Date().toLocaleString(),
        type: 'custom'
      });
      const demoBlocks = Initializers.getBrdTemplateBlocks('Employee Attendance Management System');
      localStorage.setItem('doc_root_brd-demo-attend', JSON.stringify(demoBlocks));
    }

    if (metaChanged) {
      localStorage.setItem('docforge_docs_meta', JSON.stringify(metaList));
    }
  }, []);

  const handleToggleTheme = (theme: string) => {
    setThemeMode(theme);
    localStorage.setItem('docforge_theme', theme);
    const wrapper = document.querySelector('.login-layout-wrapper');
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
      if (wrapper) wrapper.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
      if (wrapper) wrapper.classList.remove('dark-theme');
    }
  };

  // Helper to initialize custom document from templates
  const useTemplate = (title: string, templateIdOrType: string, isBuilder?: boolean) => {
    const id = Math.random().toString(36).substring(2, 11);
    
    // Always try to fetch the blocks from useTemplateStore first
    let initialBlocks = [];
    try {
      const editableTemplates = JSON.parse(localStorage.getItem('docforge_editable_templates') || '[]');
      const targetTemplate = editableTemplates.find((t: any) => t.id === templateIdOrType);
      if (targetTemplate && targetTemplate.blocks && targetTemplate.blocks.length > 0) {
        initialBlocks = targetTemplate.blocks;
      }
    } catch (e) {}

    if (initialBlocks.length === 0) {
      try {
        const savedBlocks = localStorage.getItem(`doc_root_${templateIdOrType}`);
        if (savedBlocks) {
          initialBlocks = JSON.parse(savedBlocks);
        } else {
          if (templateIdOrType === 'template-srs' || templateIdOrType === 'srs') initialBlocks = Initializers.getEnterpriseSrsTemplateBlocks(title);
          else if (templateIdOrType === 'template-tdd' || templateIdOrType === 'tdd') initialBlocks = Initializers.getTddTemplateBlocks(title);
          else if (templateIdOrType === 'template-brd' || templateIdOrType === 'brd') initialBlocks = Initializers.getBrdTemplateBlocks(title);
          else if (templateIdOrType === 'template-frd' || templateIdOrType === 'frd') initialBlocks = Initializers.getFrdTemplateBlocks(title);
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
      return <BuilderWorkspace />;
      
    case 'template-setup':
      return <TemplateSetup />;

    case 'documents':
    case 'saved':
      return <SavedDocumentsList useTemplate={useTemplate} />;

    case 'projects':
      return <ProjectsDashboard />;

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
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#F8FAFC' }}>⚖️ Load Balancers</span>
                      <span style={{ fontSize: '0.75rem', color: '#F59E0B', fontWeight: 'bold' }}>🟡 Warning</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Active Pipelines</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'start', gap: '0.5rem', fontSize: '0.8rem', color: '#CBD5E1' }}>
                      <span style={{ color: '#4ADE80' }}>✔️</span> <span>Build / Compile</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'start', gap: '0.5rem', fontSize: '0.8rem', color: '#CBD5E1' }}>
                      <span style={{ color: '#4ADE80' }}>✔️</span> <span>Unit Testing (92%)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'start', gap: '0.5rem', fontSize: '0.8rem', color: '#CBD5E1' }}>
                      <span style={{ color: '#4ADE80' }}>✔️</span> <span>Docker Registry Sync</span>
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
                    📈 Observability Log Stream
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
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>🕰 Platform Version Timeline</h1>
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
                  📜 Generate ERP SRS Outline
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
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>⚙️ Settings & Controls</h1>
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

    case 'analytics':
      return (
        <div className="enterprise-workspace animate-fade-in" style={{ padding: '0 2rem' }}>
          <AnalyticsDashboard />
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

          {/* Executive KPI Overview */}
          <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Executive KPI Overview</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Activity size={14} color="#10b981" /> Live Sync Active</span>
          </div>
          <div className="stats-grid">
            <div className="stat-card" style={{ background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.06) 0%, rgba(2, 132, 199, 0.02) 100%)', border: '1px solid rgba(2, 132, 199, 0.12)' }}>
              <span className="stat-num">{projects.length}</span>
              <span className="stat-label">Active Projects</span>
              <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><TrendingUp size={12} /> +2 this week</div>
            </div>

            <div className="stat-card" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.06) 0%, rgba(99, 102, 241, 0.02) 100%)', border: '1px solid rgba(99, 102, 241, 0.12)' }}>
              <span className="stat-num">94%</span>
              <span className="stat-label">Project Health</span>
              <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><TrendingUp size={12} /> Stable</div>
            </div>

            <div className="stat-card" style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.06) 0%, rgba(245, 158, 11, 0.02) 100%)', border: '1px solid rgba(245, 158, 11, 0.12)' }}>
              <span className="stat-num">2</span>
              <span className="stat-label">Pending Approvals</span>
              <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={12} /> Action Required</div>
            </div>

            <div className="stat-card" style={{ background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.06) 0%, rgba(168, 85, 247, 0.02) 100%)', border: '1px solid rgba(168, 85, 247, 0.12)' }}>
              <span className="stat-num">88%</span>
              <span className="stat-label">Requirement Coverage</span>
              <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#a855f7', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><CheckCircle size={12} /> Optimized</div>
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
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: '#ec4899', minWidth: '1.5rem' }}>📘</span>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Initialize TDD Template</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Launch the Technical Design Document for system architecture.</span>
                    </div>
                  </div>
                  <ArrowRight size={18} style={{ color: 'var(--text-muted)' }} />
                </div>
              </div>
            </div>

            {/* Real-time Activity Stream */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.25rem', display: 'flex', flex: 1, flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Activity size={16} color="#3b82f6" /> Live Activity Feed</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.7rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} /> Syncing
                  </span>
                </h3>
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





