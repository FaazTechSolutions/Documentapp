"use client";

import { Suspense, useEffect, useState } from 'react';
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

const getBrdTemplateBlocks = (title: string) => {
  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return [
    // ═══════════════════════════════════════════════
    // HEADER & PROJECT SUMMARY
    // ═══════════════════════════════════════════════
    { id: 'brd-h1', type: 'header', headingLevel: '1', value: `Business Requirement Document (BRD)` },
    { id: 'brd-h1b', type: 'header', headingLevel: '2', value: title },
    { id: 'brd-meta', type: 'table', value: JSON.stringify([
      ["Field", "Value"],
      ["Company", "UNITRACON SOFTWARE SOLUTIONS"],
      ["Project Name", title],
      ["Client Name", ""],
      ["Prepared By", ""],
      ["Version", "v1.2"],
      ["Date", today],
      ["Status", "In Review"],
      ["Last Updated", today],
      ["Approval Status", "Pending"]
    ]) },

    // ═══════════════════════════════════════════════
    // 1. EXECUTIVE SUMMARY
    // ═══════════════════════════════════════════════
    { id: 'brd-s1', type: 'header', headingLevel: '2', value: '1. Executive Summary' },
    { id: 'brd-s1a', type: 'textarea', value: 'Provide a high-level overview of the project, its strategic importance, and expected business impact. This section should give executives a quick understanding of the entire BRD.' },
    { id: 'brd-kpi', type: 'metric-cards', value: JSON.stringify([
      { label: 'Total Modules', value: '12', color: '#2563EB' },
      { label: 'Total Users', value: '350', color: '#7C3AED' },
      { label: 'Integrations', value: '5 APIs', color: '#16A34A' },
      { label: 'Estimated Cost', value: '₹8,50,000', color: '#F59E0B' }
    ]) },

    // ═══════════════════════════════════════════════
    // 2. BUSINESS PROBLEM
    // ═══════════════════════════════════════════════
    { id: 'brd-s2', type: 'header', headingLevel: '2', value: '2. Business Problem' },
    { id: 'brd-s2a', type: 'header', headingLevel: '3', value: '2.1 Current Challenges' },
    { id: 'brd-s2b', type: 'callout', value: '❌ Manual attendance tracking leads to data inaccuracies\n❌ Payroll calculation delays due to manual processing\n❌ Leave approval inefficiency causing employee dissatisfaction\n❌ Lack of centralized reporting for management decisions\n❌ No audit trail for compliance requirements' },
    { id: 'brd-s2c', type: 'header', headingLevel: '3', value: '2.2 Business Impact' },
    { id: 'brd-s2d', type: 'textarea', value: 'Describe the financial, operational, and strategic impact of the current challenges on the organization.' },

    // ═══════════════════════════════════════════════
    // 3. OBJECTIVES
    // ═══════════════════════════════════════════════
    { id: 'brd-s3', type: 'header', headingLevel: '2', value: '3. Objectives' },
    { id: 'brd-s3a', type: 'callout', value: '✔ Automate attendance tracking with GPS and biometric integration\n✔ Implement integrated payroll processing with tax calculations\n✔ Deploy role-based approval workflows for all HR processes\n✔ Build real-time analytics dashboard for management visibility\n✔ Enable mobile accessibility for field employees' },
    { id: 'brd-s3b', type: 'header', headingLevel: '3', value: 'Expected Outcome' },
    { id: 'brd-s3c', type: 'textarea', value: '65% operational efficiency increase, 80% reduction in manual errors, 3x faster approval cycles.' },

    // ═══════════════════════════════════════════════
    // 4. SCOPE
    // ═══════════════════════════════════════════════
    { id: 'brd-s4', type: 'header', headingLevel: '2', value: '4. Scope' },
    { id: 'brd-s4a', type: 'header', headingLevel: '3', value: '4.1 Scope Matrix' },
    { id: 'brd-s4b', type: 'table', value: JSON.stringify([
      ["Module", "In Scope", "Out of Scope", "Priority"],
      ["Attendance Tracking", "✅", "—", "Critical"],
      ["Payroll Processing", "✅", "—", "Critical"],
      ["Leave Management", "✅", "—", "High"],
      ["HR Analytics", "✅", "—", "High"],
      ["Employee Self-Service", "✅", "—", "Medium"],
      ["Recruitment", "—", "✅", "Low"],
      ["Training Management", "—", "✅", "Low"]
    ]) },
    { id: 'brd-s4c', type: 'header', headingLevel: '3', value: '4.2 Assumptions' },
    { id: 'brd-s4d', type: 'bulleted-list', value: 'Stable internet connectivity available at all locations' },
    { id: 'brd-s4e', type: 'bulleted-list', value: 'Users have valid company credentials' },
    { id: 'brd-s4f', type: 'bulleted-list', value: 'Client will provide test data within 2 weeks of project start' },
    { id: 'brd-s4g', type: 'bulleted-list', value: 'Third-party APIs are accessible and documented' },

    // ═══════════════════════════════════════════════
    // 5. STAKEHOLDERS
    // ═══════════════════════════════════════════════
    { id: 'brd-s5', type: 'header', headingLevel: '2', value: '5. Stakeholders' },
    { id: 'brd-s5a', type: 'table', value: JSON.stringify([
      ["Stakeholder", "Role", "Responsibility", "Approval Status"],
      ["CEO", "Sponsor", "Budget approval & strategic direction", "✅ Approved"],
      ["HR Director", "Business Owner", "Requirements validation & UAT sign-off", "⏳ Pending"],
      ["Finance Manager", "Reviewer", "Payroll & budget validation", "✅ Approved"],
      ["CTO", "Technical Lead", "Architecture & infrastructure decisions", "✅ Approved"],
      ["Project Manager", "Coordinator", "Timeline, delivery & stakeholder management", "⏳ In Review"],
      ["Legal/Compliance", "Compliance Officer", "Regulatory & data privacy compliance", "⏳ Pending"]
    ]) },

    // ═══════════════════════════════════════════════
    // 6. FUNCTIONAL REQUIREMENTS
    // ═══════════════════════════════════════════════
    { id: 'brd-s6', type: 'header', headingLevel: '2', value: '6. Functional Requirements' },
    { id: 'brd-s6a', type: 'table', value: JSON.stringify([
      ["REQ ID", "Module", "Requirement Description", "Priority", "Department", "Status"],
      ["REQ-001", "Login", "Employee login using email/mobile with OTP verification", "Critical", "HR", "Approved"],
      ["REQ-002", "Attendance", "GPS-based attendance check-in with geofencing", "Critical", "HR", "Approved"],
      ["REQ-003", "Payroll", "Automated salary calculation with tax deduction", "Critical", "Finance", "In Review"],
      ["REQ-004", "Leave", "Multi-level leave approval workflow", "High", "HR", "Approved"],
      ["REQ-005", "Dashboard", "Real-time KPI dashboard for management", "High", "Management", "Pending"],
      ["REQ-006", "Reports", "Custom report builder with export to PDF/Excel", "Medium", "All", "Pending"]
    ]) },

    { id: 'brd-s6b', type: 'header', headingLevel: '3', value: 'Requirement Detail Card — REQ-001' },
    { id: 'brd-s6c', type: 'table', value: JSON.stringify([
      ["Field", "Details"],
      ["REQ ID", "REQ-001"],
      ["Module", "Employee Login"],
      ["Priority", "Critical"],
      ["Department", "HR"],
      ["Description", "Employees should login using email/mobile with OTP verification"],
      ["Acceptance Criteria", "✔ Email validation  ✔ OTP verification  ✔ Password reset  ✔ Session timeout after 30 min"],
      ["Dependencies", "SMS Gateway, Email Service"],
      ["Business Value", "High — Core access control for all modules"]
    ]) },

    // ═══════════════════════════════════════════════
    // 7. NON-FUNCTIONAL REQUIREMENTS
    // ═══════════════════════════════════════════════
    { id: 'brd-s7', type: 'header', headingLevel: '2', value: '7. Non-Functional Requirements' },
    { id: 'brd-s7a', type: 'table', value: JSON.stringify([
      ["Category", "Requirement", "Target"],
      ["Performance", "Page load time", "< 3 seconds"],
      ["Security", "Role-based access control (RBAC)", "All modules"],
      ["Security", "Data encryption at rest and in transit", "AES-256 / TLS 1.3"],
      ["Availability", "System uptime SLA", "99.9%"],
      ["Backup", "Automated database backup", "Daily incremental, weekly full"],
      ["Scalability", "Concurrent user support", "500+ users"],
      ["Compliance", "Data privacy regulations", "Local labor laws"]
    ]) },

    // ═══════════════════════════════════════════════
    // 8. USER ROLES & PERMISSIONS
    // ═══════════════════════════════════════════════
    { id: 'brd-s8', type: 'header', headingLevel: '2', value: '8. User Roles & Permissions' },
    { id: 'brd-s8a', type: 'table', value: JSON.stringify([
      ["Module / Feature", "Admin", "HR Manager", "Employee", "Auditor"],
      ["Employee Creation", "✅", "✅", "❌", "❌"],
      ["Payroll Access", "✅", "❌", "❌", "✅"],
      ["Attendance View", "✅", "✅", "✅", "✅"],
      ["Leave Approval", "✅", "✅", "❌", "❌"],
      ["Reports & Analytics", "✅", "✅", "❌", "✅"],
      ["System Configuration", "✅", "❌", "❌", "❌"],
      ["Audit Logs", "✅", "❌", "❌", "✅"]
    ]) },

    // ═══════════════════════════════════════════════
    // 9. WORKFLOW
    // ═══════════════════════════════════════════════
    { id: 'brd-s9', type: 'header', headingLevel: '2', value: '9. Workflow' },
    { id: 'brd-s9a', type: 'header', headingLevel: '3', value: '9.1 Core Business Process Flow' },
    { id: 'brd-s9b', type: 'numbered-list', value: 'Employee Login → Authentication via OTP/Password' },
    { id: 'brd-s9c', type: 'numbered-list', value: 'Dashboard Access → Role-based landing page' },
    { id: 'brd-s9d', type: 'numbered-list', value: 'Attendance Marking → GPS check-in with geofence validation' },
    { id: 'brd-s9e', type: 'numbered-list', value: 'Leave Request → Employee submits, manager receives notification' },
    { id: 'brd-s9f', type: 'numbered-list', value: 'Manager Approval → Multi-level approval chain' },
    { id: 'brd-s9g', type: 'numbered-list', value: 'Payroll Processing → Auto-calculation based on attendance & leave data' },

    { id: 'brd-s9h', type: 'header', headingLevel: '3', value: '9.2 Approval Workflow' },
    { id: 'brd-s9i', type: 'callout', value: 'Business Analyst → Project Manager → Technical Lead → Client Approval\n\nEach step includes: Timestamp, Comments, Digital Signature, Approval Status' },

    // ═══════════════════════════════════════════════
    // 10. REPORTS
    // ═══════════════════════════════════════════════
    { id: 'brd-s10', type: 'header', headingLevel: '2', value: '10. Reports Required' },
    { id: 'brd-s10a', type: 'table', value: JSON.stringify([
      ["Report Name", "Description", "Frequency", "Access"],
      ["Employee Report", "Complete employee directory with status", "On-Demand", "Admin, HR"],
      ["Attendance Report", "Daily/monthly attendance summary", "Daily", "Admin, HR, Manager"],
      ["Payroll Report", "Salary breakdown with deductions", "Monthly", "Admin, Finance"],
      ["Leave Balance Report", "Employee leave balances and history", "On-Demand", "All"],
      ["Audit Trail Report", "System activity logs", "Weekly", "Admin, Auditor"]
    ]) },

    // ═══════════════════════════════════════════════
    // 11. INTEGRATIONS
    // ═══════════════════════════════════════════════
    { id: 'brd-s11', type: 'header', headingLevel: '2', value: '11. Integrations' },
    { id: 'brd-s11a', type: 'table', value: JSON.stringify([
      ["System", "Purpose", "Type", "Status"],
      ["SMS Gateway (Twilio)", "OTP verification & notifications", "API", "✅ Connected"],
      ["Payment Gateway (Stripe/Payfort)", "Salary disbursement", "API", "✅ Connected"],
      ["Biometric Device (ZKTeco)", "Fingerprint attendance terminals", "SDK", "⏳ Pending"],
      ["Email Service (SendGrid)", "Transactional emails & alerts", "API", "✅ Connected"],
      ["ERP Connector (SAP/Oracle)", "Data synchronization", "API", "🔄 In Progress"]
    ]) },

    // ═══════════════════════════════════════════════
    // 12. RISKS
    // ═══════════════════════════════════════════════
    { id: 'brd-s12', type: 'header', headingLevel: '2', value: '12. Risk Analysis' },
    { id: 'brd-s12a', type: 'table', value: JSON.stringify([
      ["Risk ID", "Risk Description", "Severity", "Probability", "Impact", "Mitigation", "Status"],
      ["RSK-001", "Requirement scope changes", "🔴 High", "High", "Schedule delay", "Weekly client reviews & change control", "Monitoring"],
      ["RSK-002", "Vendor API undocumented", "🟡 Medium", "Medium", "Integration delay", "Request vendor docs, build adapter layer", "Active"],
      ["RSK-003", "Remote branch bandwidth issues", "🟡 Medium", "Medium", "Performance impact", "Offline-first sync strategy", "Watch"],
      ["RSK-004", "Tax law changes during development", "🟢 Low", "Low", "Compliance risk", "Configurable tax engine with rule updates", "Low"]
    ]) },

    // ═══════════════════════════════════════════════
    // 13. TIMELINE
    // ═══════════════════════════════════════════════
    { id: 'brd-s13', type: 'header', headingLevel: '2', value: '13. Project Timeline' },
    { id: 'brd-s13a', type: 'table', value: JSON.stringify([
      ["Week", "Phase", "Deliverables", "Status"],
      ["Week 1", "Requirement Gathering", "BRD document, stakeholder sign-off", "✅ Complete"],
      ["Week 2", "UI Design", "Wireframes, UI mockups, design approval", "🔄 In Progress"],
      ["Week 3", "Backend Development", "API development, database schema", "⬜ Pending"],
      ["Week 4", "Testing", "Unit tests, integration tests, QA report", "⬜ Pending"],
      ["Week 5", "UAT", "User acceptance testing, feedback incorporation", "⬜ Pending"],
      ["Week 6", "Deployment", "Production deployment, monitoring setup", "⬜ Pending"]
    ]) },

    // ═══════════════════════════════════════════════
    // 14. APPROVAL
    // ═══════════════════════════════════════════════
    { id: 'brd-s14', type: 'header', headingLevel: '2', value: '14. Approval Sign-Off' },
    { id: 'brd-s14a', type: 'table', value: JSON.stringify([
      ["Step", "Role", "Name", "Date", "Status", "Signature"],
      ["1", "Business Analyst", "", "", "⏳ Pending", ""],
      ["2", "Project Manager", "", "", "⏳ Pending", ""],
      ["3", "Technical Lead", "", "", "⏳ Pending", ""],
      ["4", "Client Representative", "", "", "⏳ Pending", ""]
    ]) },

    // ═══════════════════════════════════════════════
    // 15. ATTACHMENTS & REFERENCES
    // ═══════════════════════════════════════════════
    { id: 'brd-s15', type: 'header', headingLevel: '2', value: '15. Attachments & References' },
    { id: 'brd-s15a', type: 'callout', value: '📎 Attach supporting documents below:\n\n• UI Screenshots & Wireframes\n• API Documentation\n• Excel Sheets & Data Models\n• Loom Recordings & Demo Videos\n• Architecture Diagrams' },
    { id: 'brd-s15b', type: 'textarea', value: 'Add links or descriptions of attached reference documents here.' }
  ];
};

const getFrdTemplateBlocks = (title: string) => {
  return [
    { id: 'frd-1', type: 'header', headingLevel: '1', value: 'Feature Requirement Document' },
    { id: 'frd-2', type: 'table', value: JSON.stringify([
      ["Feature Name", title],
      ["Module", ""],
      ["Priority", "High / Medium / Low"],
      ["Requested By", ""]
    ]) },
    { id: 'frd-3', type: 'header', headingLevel: '2', value: 'Feature Objective' },
    { id: 'frd-4', type: 'textarea', value: 'Describe feature purpose.' },
    { id: 'frd-5', type: 'header', headingLevel: '2', value: 'Business Need' },
    { id: 'frd-6', type: 'textarea', value: 'Why this feature is required.' },
    { id: 'frd-7', type: 'header', headingLevel: '2', value: 'User Story' },
    { id: 'frd-8', type: 'textarea', value: 'As a [Role],\nI want to [Action],\nSo that [Benefit].' },
    { id: 'frd-9', type: 'header', headingLevel: '2', value: 'Acceptance Criteria' },
    { id: 'frd-10', type: 'table', value: JSON.stringify([
      ["ID", "Criteria"],
      ["AC-001", "User should login successfully"],
      ["AC-002", "Error message should display for invalid password"]
    ]) },
    { id: 'frd-11', type: 'header', headingLevel: '2', value: 'UI Requirements' },
    { id: 'frd-12', type: 'bulleted-list', value: 'Login form' },
    { id: 'frd-13', type: 'bulleted-list', value: 'Forgot password option' },
    { id: 'frd-14', type: 'bulleted-list', value: 'Mobile responsive' },
    { id: 'frd-15', type: 'header', headingLevel: '2', value: 'Validation Rules' },
    { id: 'frd-16', type: 'table', value: JSON.stringify([
      ["Field", "Validation"],
      ["Email", "Valid email format"],
      ["Password", "Minimum 6 characters"]
    ]) },
    { id: 'frd-17', type: 'header', headingLevel: '2', value: 'Dependencies' },
    { id: 'frd-18', type: 'bulleted-list', value: 'SMS service' },
    { id: 'frd-19', type: 'bulleted-list', value: 'Database API' },
    { id: 'frd-20', type: 'header', headingLevel: '2', value: 'Notes' },
    { id: 'frd-21', type: 'textarea', value: 'Additional business notes.' },

    { id: 'frd-22', type: 'header', headingLevel: '2', value: 'Comments & Feedback' },
    { id: 'frd-23', type: 'table', value: JSON.stringify([
      ["#", "Reviewer", "Role", "Comment", "Date", "Status"],
      ["1", "", "Business Analyst", "", "", "⏳ Pending"],
      ["2", "", "Project Manager", "", "", "⏳ Pending"],
      ["3", "", "Technical Lead", "", "", "⏳ Pending"],
      ["4", "", "Client", "", "", "⏳ Pending"]
    ]) },
    { id: 'frd-24', type: 'callout', value: '💬 Review Guidelines:\n\n• All comments must reference specific requirement IDs\n• Use ✅ Approved, ❌ Rejected, or 🔄 Needs Revision as status\n• Include actionable suggestions with each comment\n• Final approval requires sign-off from all reviewers above' },
    { id: 'frd-25', type: 'textarea', value: 'Add your review comments here...' }
  ];
};

const getEnterpriseSrsTemplateBlocks = (title: string) => {
  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return [
    { id: 'srs-001', type: 'header', headingLevel: '1', value: 'FAAZ TECH SOLUTIONS' },
    { id: 'srs-002', type: 'header', headingLevel: '2', value: 'Software Requirement Specification' },
    { id: 'srs-003', type: 'table', value: JSON.stringify([
      ['Field', 'Value'],
      ['Product', title || 'Enterprise SRS Document'],
      ['Environment', 'Production'],
      ['Version', 'v3.1'],
      ['Build Status', 'Stable'],
      ['Prepared Date', today],
      ['Prepared By', ''],
      ['Document Status', 'Draft']
    ]) },
    { id: 'srs-004', type: 'callout', label: 'Engineering Header Actions', value: '[Architecture View]  [API Explorer]  [Export PDF]  [Developer Mode]' },

    { id: 'srs-005', type: 'header', headingLevel: '2', value: '1. Enterprise SRS Workspace Layout' },
    { id: 'srs-006', type: 'code', label: 'layout', value: `Top Engineering Toolbar
|-- Left Sidebar
|   |-- Architecture
|   |-- APIs
|   |-- Database
|   |-- Security
|   |-- Deployment
|   |-- Logs
|-- Main Technical Workspace
    |-- System Specifications
    |-- Technical Modules
    |-- Sequence Flows
    |-- Configurations
    |-- Dev Notes
    |-- Technical References` },

    { id: 'srs-007', type: 'header', headingLevel: '2', value: '2. Technical Overview Dashboard' },
    { id: 'srs-008', type: 'table', value: JSON.stringify([
      ['Metric', 'Value', 'Notes'],
      ['Total APIs', '128', 'REST endpoints across ERP services'],
      ['Database Tables', '47', 'Production schema objects'],
      ['Services', '12 Microservices', 'Domain-oriented service split'],
      ['Deployment Nodes', '5 Servers', 'Load-balanced production estate']
    ]) },

    { id: 'srs-009', type: 'header', headingLevel: '2', value: '3. Architecture Visualization' },
    { id: 'srs-010', type: 'code', label: 'System Architecture Flow', value: `Frontend (React)
  -> API Gateway
  -> Authentication Service
  -> Business Services
  -> PostgreSQL Database
  -> Redis Cache
  -> Notification Engine` },
    { id: 'srs-011', type: 'textarea', value: 'Describe the enterprise architecture boundaries, communication protocols, data ownership, and integration assumptions.' },

    { id: 'srs-012', type: 'header', headingLevel: '2', value: '4. Module-Based Technical Specification' },
    { id: 'srs-013', type: 'table', value: JSON.stringify([
      ['Field', 'Specification'],
      ['Module ID', 'AUTH-001'],
      ['Module', 'Authentication Service'],
      ['Technology', 'Node.js + JWT'],
      ['Responsibilities', 'User login; token generation; session validation; role authorization'],
      ['Dependencies', 'PostgreSQL; Redis; OTP Gateway'],
      ['Security Level', 'High']
    ]) },
    { id: 'srs-014', type: 'table', value: JSON.stringify([
      ['Module ID', 'Module', 'Technology', 'Primary Responsibility', 'Security Level'],
      ['EMP-001', 'Employee Service', 'Node.js', 'Employee master data and profile lifecycle', 'High'],
      ['PAY-001', 'Payroll Service', 'Node.js', 'Payroll calculation, approvals, and payslip generation', 'High'],
      ['ATT-001', 'Attendance Service', 'Node.js', 'Attendance capture, shift mapping, and exceptions', 'Medium'],
      ['NOT-001', 'Notification Service', 'Node.js', 'Email, SMS, and OTP notifications', 'Medium']
    ]) },

    { id: 'srs-015', type: 'header', headingLevel: '2', value: '5. API Documentation' },
    { id: 'srs-016', type: 'table', value: JSON.stringify([
      ['API Endpoint', 'Method', 'Auth', 'Response'],
      ['/api/login', 'POST', 'No', 'JWT Token'],
      ['/api/users', 'GET', 'Yes', 'User List'],
      ['/api/employees', 'GET', 'Yes', 'Employee List'],
      ['/api/payroll/run', 'POST', 'Yes', 'Payroll Batch Result'],
      ['/api/attendance/sync', 'POST', 'Yes', 'Sync Status']
    ]) },

    { id: 'srs-017', type: 'header', headingLevel: '2', value: '6. Database Schema Mapping' },
    { id: 'srs-018', type: 'table', value: JSON.stringify([
      ['Table', 'Relationships'],
      ['employees', 'Linked with payroll'],
      ['payroll', 'Linked with attendance'],
      ['attendance', 'Linked with shifts'],
      ['shifts', 'Linked with attendance and employee schedules'],
      ['roles', 'Linked with users and permissions']
    ]) },

    { id: 'srs-019', type: 'header', headingLevel: '2', value: '7. Sequence Flows' },
    { id: 'srs-020', type: 'code', label: 'User Login Flow', value: `User Login
  -> API Validation
  -> JWT Token Generation
  -> Redis Session Storage
  -> Dashboard Access` },
    { id: 'srs-021', type: 'code', label: 'Payroll Processing Flow', value: `Payroll Trigger
  -> Employee Eligibility Check
  -> Attendance Aggregation
  -> Salary Calculation
  -> Tax and Deduction Engine
  -> Approval Workflow
  -> Payslip Publication` },

    { id: 'srs-022', type: 'header', headingLevel: '2', value: '8. Security Specification' },
    { id: 'srs-023', type: 'table', value: JSON.stringify([
      ['Security Layer', 'Controls'],
      ['Authentication', '[OK] JWT Tokens; [OK] Refresh Tokens; [OK] OTP Verification'],
      ['Authorization', '[OK] RBAC; [OK] Permission Matrix'],
      ['Data Security', '[OK] AES Encryption; [OK] HTTPS Only'],
      ['Audit', '[OK] Login history; [OK] Sensitive action logs']
    ]) },

    { id: 'srs-024', type: 'header', headingLevel: '2', value: '9. Infrastructure and Deployment Architecture' },
    { id: 'srs-025', type: 'code', label: 'Deployment Architecture', value: `Load Balancer
  -> Application Servers
  -> Microservices Cluster
  -> Database Cluster
  -> Backup Storage` },

    { id: 'srs-026', type: 'header', headingLevel: '2', value: '10. Configuration Management' },
    { id: 'srs-027', type: 'table', value: JSON.stringify([
      ['Environment', 'URL', 'Status'],
      ['Development', 'dev.app.com', 'Active'],
      ['Staging', 'stage.app.com', 'Active'],
      ['Production', 'prod.app.com', 'Stable']
    ]) },

    { id: 'srs-028', type: 'header', headingLevel: '2', value: '11. Logging and Monitoring' },
    { id: 'srs-029', type: 'table', value: JSON.stringify([
      ['Service', 'Monitoring Tool'],
      ['API Logs', 'ELK Stack'],
      ['Performance', 'Prometheus'],
      ['Errors', 'Sentry'],
      ['Infrastructure', 'CloudWatch / Grafana']
    ]) },

    { id: 'srs-030', type: 'header', headingLevel: '2', value: '12. Performance Requirements' },
    { id: 'srs-031', type: 'table', value: JSON.stringify([
      ['Metric', 'Requirement'],
      ['Response Time', '< 2 seconds'],
      ['Concurrent Users', '10,000'],
      ['Uptime', '99.9%'],
      ['Batch Payroll Window', '< 30 minutes for monthly run']
    ]) },

    { id: 'srs-032', type: 'header', headingLevel: '2', value: '13. Scalability Model' },
    { id: 'srs-033', type: 'code', label: 'Scalability Path', value: `Single Server
  -> Load Balanced Cluster
  -> Auto Scaling
  -> Distributed Services` },

    { id: 'srs-034', type: 'header', headingLevel: '2', value: '14. CI/CD Pipeline' },
    { id: 'srs-035', type: 'code', label: 'Deployment Pipeline', value: `Git Push
  -> CI Pipeline
  -> Automated Testing
  -> Docker Build
  -> Deployment
  -> Monitoring` },

    { id: 'srs-036', type: 'header', headingLevel: '2', value: '15. Technical Dependencies' },
    { id: 'srs-037', type: 'code', label: 'Payroll Service Dependency Tree', value: `Payroll Service
  |-- Employee Service
  |-- Attendance Service
  |-- Tax Engine
  |-- Notification Service` },

    { id: 'srs-038', type: 'header', headingLevel: '2', value: '16. Error Handling Strategy' },
    { id: 'srs-039', type: 'table', value: JSON.stringify([
      ['Error', 'Action'],
      ['API Timeout', 'Retry'],
      ['DB Failure', 'Failover'],
      ['Invalid Token', 'Force Logout'],
      ['Payroll Calculation Error', 'Queue for manual review']
    ]) },

    { id: 'srs-040', type: 'header', headingLevel: '2', value: '17. Versioning' },
    { id: 'srs-041', type: 'table', value: JSON.stringify([
      ['Version', 'Changes', 'Date'],
      ['v1.0', 'Initial Release', '10-May'],
      ['v1.1', 'Security Update', '15-May'],
      ['v3.1', 'Stable Production Baseline', today]
    ]) },

    { id: 'srs-042', type: 'header', headingLevel: '2', value: '18. DevOps Integration' },
    { id: 'srs-043', type: 'table', value: JSON.stringify([
      ['Tool', 'Purpose'],
      ['Docker', 'Containerization'],
      ['Kubernetes', 'Orchestration'],
      ['GitHub Actions', 'CI/CD'],
      ['AWS', 'Hosting']
    ]) },

    { id: 'srs-044', type: 'header', headingLevel: '2', value: '19. Technical Approval Workflow' },
    { id: 'srs-045', type: 'code', label: 'Approval Flow', value: `Solution Architect
  -> Tech Lead
  -> DevOps Engineer
  -> Security Team
  -> Client Approval` },
    { id: 'srs-046', type: 'table', value: JSON.stringify([
      ['Approver', 'Role', 'Status', 'Signature'],
      ['', 'Solution Architect', 'Pending', ''],
      ['', 'Tech Lead', 'Pending', ''],
      ['', 'DevOps Engineer', 'Pending', ''],
      ['', 'Security Team', 'Pending', ''],
      ['', 'Client Approval', 'Pending', '']
    ]) }
  ];
};

const getTddTemplateBlocks = (title: string) => {
  return [
    // 1. TOP ENGINEERING NAVIGATION
    { id: 'tdd-1', type: 'header', headingLevel: '1', value: 'FAAZ TECH SOLUTIONS — TDD MANAGEMENT SYSTEM' },
    { id: 'tdd-1a', type: 'callout', value: '[🔍 Search services, APIs, components, flows...]\n\nDashboard | Architecture | Components | APIs | Infrastructure | Monitoring\n\nClient: ABC Industries\nProduct: HRMS ERP Platform\n\n🟢 Engineering Active' },

    // 2. LEFT SIDEBAR NAVIGATION
    { id: 'tdd-2', type: 'header', headingLevel: '2', value: '2. Left Sidebar Navigation Overview' },
    { id: 'tdd-2a', type: 'table', value: JSON.stringify([
      ['Category', 'Navigation Items'],
      ['Overview', '📌 Technical Overview, 📌 Architecture Design, 📌 Components, 📌 Services, 📌 APIs'],
      ['Design', '📌 Database Design, 📌 Sequence Flows, 📌 Security Design, 📌 Scalability'],
      ['Operations', '📌 Infrastructure, 📌 Deployment, 📌 Monitoring, 📌 Error Handling'],
      ['Management', '📌 Dependencies, 📌 CI/CD, 📌 Reports, 📌 Version History, 📌 Attachments, 📌 Analytics']
    ]) },

    // 3. HERO KPI SECTION
    { id: 'tdd-3', type: 'header', headingLevel: '2', value: '3. Technical Design Visibility' },
    { id: 'tdd-3a', type: 'metric-cards', value: JSON.stringify([
      { label: 'System Components', value: '84', color: '#2563EB' },
      { label: 'APIs Designed', value: '132', color: '#7C3AED' },
      { label: 'Active Services', value: '16', color: '#16A34A' },
      { label: 'Sequence Flows', value: '42', color: '#F59E0B' },
      { label: 'Technical Risks', value: '5', color: '#DC2626' }
    ]) },

    // 4. TDD TEMPLATE GRID VIEW
    { id: 'tdd-4', type: 'header', headingLevel: '2', value: '4. Modern Technical Design Cards' },
    { id: 'tdd-4a', type: 'callout', value: '┌──────────────────────────────┐\n│ Authentication Engine TDD    │\n│                              │\n│ Components: 12               │\n│ APIs: 18                     │\n│ Status: Approved             │\n│ Progress: █████████ 92%      │\n│                              │\n│ [Open] [Review] [Export]     │\n└──────────────────────────────┘\n\n┌──────────────────────────────┐\n│ Payroll Processing TDD       │\n│                              │\n│ Services: 8                  │\n│ Dependencies: 14             │\n│ Status: In Review            │\n│ Progress: ███████ 74%        │\n│                              │\n│ [Open] [Approve] [Comments]  │\n└──────────────────────────────┘' },

    // 5. SYSTEM ARCHITECTURE DASHBOARD
    { id: 'tdd-5', type: 'header', headingLevel: '2', value: '5. High-Level Engineering Flow' },
    { id: 'tdd-5a', type: 'code', label: 'Architecture Flow', value: 'Frontend (React)\n       ↓\nAPI Gateway\n       ↓\nAuthentication Service\n       ↓\nBusiness Services\n       ↓\nDatabase Cluster\n       ↓\nMonitoring Engine' },

    // 6. COMPONENT HEALTH ANALYTICS
    { id: 'tdd-6', type: 'header', headingLevel: '2', value: '6. Component Health Analytics' },
    { id: 'tdd-6a', type: 'code', label: 'Health Analytics', value: 'Architecture Completion      ██████████ 91%\nAPI Design Coverage          ████████ 78%\nDatabase Mapping             ███████ 72%\nSequence Flow Readiness      ████████ 84%\nInfrastructure Planning      ██████ 68%\nDeployment Readiness         ████████ 82%' },

    // 7. COMPONENT MANAGEMENT DASHBOARD
    { id: 'tdd-7', type: 'header', headingLevel: '2', value: '7. Component Management Dashboard' },
    { id: 'tdd-7a', type: 'table', value: JSON.stringify([
      ['Component', 'Type', 'Status'],
      ['Auth Engine', 'Core Service', '✅'],
      ['Payroll Processor', 'Business Logic', '🟡'],
      ['Notification Queue', 'Async Service', '🟢'],
      ['Analytics Engine', 'Reporting', '🔵']
    ]) },
    { id: 'tdd-7b', type: 'code', label: 'Component Dependency Flow', value: 'Frontend\n    ↓\nGateway Service\n    ↓\nAuthentication\n    ↓\nPayroll Engine\n    ↓\nDatabase Layer' },

    // 8. DATABASE DESIGN DASHBOARD
    { id: 'tdd-8', type: 'header', headingLevel: '2', value: '8. Database Design Dashboard' },
    { id: 'tdd-8a', type: 'table', value: JSON.stringify([
      ['Table', 'Purpose'],
      ['employees', 'Employee master'],
      ['attendance_logs', 'Attendance tracking'],
      ['payroll_records', 'Salary processing']
    ]) },
    { id: 'tdd-8b', type: 'code', label: 'Data Processing Flow', value: 'Request\n   ↓\nValidation Layer\n   ↓\nBusiness Logic\n   ↓\nDatabase\n   ↓\nResponse Engine' },

    // 9. SEQUENCE FLOW DASHBOARD
    { id: 'tdd-9', type: 'header', headingLevel: '2', value: '9. Sequence Flow Dashboard' },
    { id: 'tdd-9a', type: 'code', label: 'Technical Execution Flow', value: 'Employee Login\n      ↓\nJWT Validation\n      ↓\nService Authorization\n      ↓\nPayroll Calculation\n      ↓\nDatabase Update' },
    { id: 'tdd-9b', type: 'callout', value: '------------------------------------------------\nFLOW ID: FLOW-PAY-101\n\nProcess:\nPayroll Generation\n\nServices Involved:\n✔ Attendance Service\n✔ Tax Engine\n✔ Payroll Processor\n✔ Notification Queue\n\nExecution Time:\n2.4 sec\n\nStatus:\nOptimized\n------------------------------------------------' },

    // 10. SECURITY DESIGN DASHBOARD
    { id: 'tdd-10', type: 'header', headingLevel: '2', value: '10. Security Design Dashboard' },
    { id: 'tdd-10a', type: 'code', label: 'Security Layers', value: 'Authentication\n      ↓\nAuthorization\n      ↓\nEncryption\n      ↓\nAPI Security\n      ↓\nAudit Logging' },
    { id: 'tdd-10b', type: 'callout', value: '------------------------------------------------\nSECURITY MODULE:\nJWT Authentication\n\nProtection:\n✔ Token validation\n✔ Refresh tokens\n✔ RBAC\n✔ Session expiry\n\nRisk Level:\nLow\n------------------------------------------------' },

    // 11. INFRASTRUCTURE DESIGN DASHBOARD
    { id: 'tdd-11', type: 'header', headingLevel: '2', value: '11. Infrastructure Design Dashboard' },
    { id: 'tdd-11a', type: 'code', label: 'Infrastructure Topology', value: 'Load Balancer\n      ↓\nApplication Cluster\n      ↓\nMicroservices\n      ↓\nDatabase Cluster\n      ↓\nBackup Storage' },
    { id: 'tdd-11b', type: 'table', value: JSON.stringify([
      ['Environment', 'Status'],
      ['Development', '🟢'],
      ['Staging', '🟡'],
      ['Production', '🟢']
    ]) },

    // 12. PERFORMANCE ENGINEERING DASHBOARD
    { id: 'tdd-12', type: 'header', headingLevel: '2', value: '12. Performance Engineering Dashboard' },
    { id: 'tdd-12a', type: 'code', label: 'Performance Metrics', value: 'API Response Time       ████████ 1.1 sec\nCPU Usage               ██████ 64%\nMemory Usage            ███████ 71%\nDB Query Speed          ████████ 88ms\nConcurrent Users        ████████ 15,000' },

    // 13. MONITORING & LOGGING PANEL
    { id: 'tdd-13', type: 'header', headingLevel: '2', value: '13. Monitoring & Logging Panel' },
    { id: 'tdd-13a', type: 'code', label: 'Monitoring Architecture', value: 'Application Logs\n       ↓\nLog Aggregation\n       ↓\nMonitoring Engine\n       ↓\nAlert System\n       ↓\nIncident Response' },
    { id: 'tdd-13b', type: 'callout', value: '------------------------------------------------\nALERT:\nHigh Memory Usage\n\nServer:\nPROD-APP-02\n\nThreshold:\n85%\n\nCurrent:\n92%\n\nStatus:\nMonitoring\n------------------------------------------------' },

    // 14. CI/CD DASHBOARD
    { id: 'tdd-14', type: 'header', headingLevel: '2', value: '14. CI/CD Dashboard' },
    { id: 'tdd-14a', type: 'code', label: 'Engineering Deployment Pipeline', value: 'Git Push\n    ↓\nCI Pipeline\n    ↓\nAutomated Testing\n    ↓\nDocker Build\n    ↓\nKubernetes Deploy' },

    // 15. ERROR HANDLING DASHBOARD
    { id: 'tdd-15', type: 'header', headingLevel: '2', value: '15. Error Handling Dashboard' },
    { id: 'tdd-15a', type: 'table', value: JSON.stringify([
      ['Error', 'Resolution'],
      ['API Failure', 'Retry Logic'],
      ['DB Failure', 'Failover'],
      ['Token Expiry', 'Refresh Token']
    ]) },

    // 16. APPROVAL WORKFLOW DASHBOARD
    { id: 'tdd-16', type: 'header', headingLevel: '2', value: '16. Approval Workflow Dashboard' },
    { id: 'tdd-16a', type: 'code', label: 'Workflow', value: 'Solution Architect\n      ↓\nTechnical Lead\n      ↓\nSecurity Team\n      ↓\nDevOps Approval\n      ↓\nClient Approval' },

    // 17. RIGHT AI ENGINEERING PANEL
    { id: 'tdd-17', type: 'header', headingLevel: '2', value: '17. Right AI Engineering Panel' },
    { id: 'tdd-17a', type: 'callout', value: '━━━━━━━━━━━━━━━━━━━━━━\n AI ENGINEERING INSIGHTS\n\n ✔ Missing API documentation\n ✔ Sequence flow incomplete\n ✔ Infrastructure risk detected\n ✔ Security policy mismatch\n\n [Generate SRS]\n [Generate APIs]\n [Generate Test Cases]\n [AI Summary]\n━━━━━━━━━━━━━━━━━━━━━━' },

    // 18. RECENT ENGINEERING ACTIVITY
    { id: 'tdd-18', type: 'header', headingLevel: '2', value: '18. Recent Engineering Activity' },
    { id: 'tdd-18a', type: 'callout', value: '━━━━━━━━━━━━━━━━━━━━━━\n RECENT ACTIVITIES\n\n ✔ Component updated\n ✔ API schema modified\n ✔ Deployment flow changed\n ✔ Monitoring alert resolved\n━━━━━━━━━━━━━━━━━━━━━━' },

    // 19. GLOBAL SEARCH EXPERIENCE
    { id: 'tdd-19', type: 'header', headingLevel: '2', value: '19. Global Search Experience' },
    { id: 'tdd-19a', type: 'callout', value: '[ Search services, flows, APIs, infrastructure... ]\n\nSupports:\n- Semantic search\n- API search\n- Error search\n- Voice search' },

    // 20. EXECUTIVE ENGINEERING ANALYTICS
    { id: 'tdd-20', type: 'header', headingLevel: '2', value: '20. Executive Engineering Analytics' },
    { id: 'tdd-20a', type: 'table', value: JSON.stringify([
      ['Metric Type', 'Description'],
      ['Architecture Stability Index', 'Measures structural integrity'],
      ['Service Dependency Score', 'Calculates coupling'],
      ['Deployment Reliability', 'Success rate of CI/CD'],
      ['Infrastructure Health', 'Uptime and resource usage'],
      ['Technical Readiness Score', 'Overall readiness']
    ]) },

    // 21. MODERN ENGINEERING CARD STYLE
    { id: 'tdd-21', type: 'header', headingLevel: '2', value: '21. Modern Engineering Card Style' },
    { id: 'tdd-21a', type: 'callout', value: '┌──────────────────────────────┐\n│ Rounded 2XL corners          │\n│ Dark engineering theme       │\n│ Soft glow borders            │\n│ Status indicators            │\n│ Hover animations             │\n│ Analytics widgets            │\n└──────────────────────────────┘' },

    // 22. BEST ENTERPRISE LAYOUT
    { id: 'tdd-22', type: 'header', headingLevel: '2', value: '22. Best Enterprise Layout' },
    { id: 'tdd-22a', type: 'table', value: JSON.stringify([
      ['Section', 'Contents'],
      ['LEFT', 'Engineering Navigation'],
      ['CENTER', 'Technical Design Workspace'],
      ['RIGHT', 'AI Assistant + Monitoring + Alerts + Logs']
    ]) },

    // 23. RECOMMENDED COLOR SYSTEM
    { id: 'tdd-23', type: 'header', headingLevel: '2', value: '23. Recommended Color System' },
    { id: 'tdd-23a', type: 'table', value: JSON.stringify([
      ['Purpose', 'Color'],
      ['Primary', '#2563EB'],
      ['Success', '#16A34A'],
      ['Warning', '#F59E0B'],
      ['Error', '#DC2626'],
      ['Purple', '#9333EA'],
      ['Dark Background', '#0F172A']
    ]) },

    // 24. RECOMMENDED ENTERPRISE COMPONENTS
    { id: 'tdd-24', type: 'header', headingLevel: '2', value: '24. Recommended Enterprise Components' },
    { id: 'tdd-24a', type: 'table', value: JSON.stringify([
      ['Component', 'Usage'],
      ['Architecture Diagrams', 'Technical visibility'],
      ['KPI Cards', 'Engineering insights'],
      ['Sequence Flows', 'Process tracking'],
      ['Monitoring Widgets', 'Realtime analytics'],
      ['API Tables', 'Service management'],
      ['Drawers', 'AI suggestions']
    ]) },

    // 25. BEST INDUSTRY UI INSPIRATIONS
    { id: 'tdd-25', type: 'header', headingLevel: '2', value: '25. Best Industry UI Inspirations' },
    { id: 'tdd-25a', type: 'table', value: JSON.stringify([
      ['Inspiration', 'Focus'],
      ['GitLab', 'DevOps & CI/CD'],
      ['Linear', 'Issue Tracking & UI'],
      ['Datadog', 'Monitoring & Metrics'],
      ['Grafana', 'Dashboards'],
      ['Swagger', 'API Documentation']
    ]) },

    // 26. FINAL ENTERPRISE TDD EXPERIENCE
    { id: 'tdd-26', type: 'header', headingLevel: '2', value: '26. Final Enterprise TDD Experience' },
    { id: 'tdd-26a', type: 'callout', value: 'Architects:\n→ System architecture visibility\n\nDevelopers:\n→ Component + API execution workspace\n\nDevOps:\n→ Infrastructure + deployment visibility\n\nManagement:\n→ Engineering readiness analytics\n\nThis structure transforms TDD documents into a complete enterprise engineering execution platform instead of static technical documentation.' }
  ];
};

const getTestPlanTemplateBlocks = (title: string) => {
  return [
    { id: 'tp-1', type: 'header', headingLevel: '1', value: `Test Plan & Strategy - ${title}` },
    { id: 'tp-2', type: 'table', value: JSON.stringify([
      ["Field", "Value"],
      ["Project Name", title],
      ["QA Lead", "Ahmad Al-Mansoor"],
      ["Version", "v1.0"],
      ["Last Updated", new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })],
      ["Clearance Status", "Draft"]
    ]) },
    { id: 'tp-3', type: 'header', headingLevel: '2', value: '1. Executive Summary & Strategy' },
    { id: 'tp-4', type: 'textarea', value: 'Outline the QA goals, scope, regression strategy, testing cycles, and exit criteria for this system release.' },
    { id: 'tp-5', type: 'header', headingLevel: '2', value: '2. Target Platforms & Browser Matrix' },
    { id: 'tp-6', type: 'table', value: JSON.stringify([
      ["Platform/Browser", "OS Scope", "Version", "Testing Priority"],
      ["Google Chrome", "Windows / macOS", "Latest Stable", "🟢 Critical"],
      ["Apple Safari", "macOS / iOS", "Latest Stable", "🟡 High"],
      ["Mozilla Firefox", "Windows / macOS / Linux", "Latest Stable", "🔵 Medium"],
      ["Microsoft Edge", "Windows", "Latest Stable", "🔵 Medium"]
    ]) },
    { id: 'tp-7', type: 'header', headingLevel: '2', value: '3. Testing Environments' },
    { id: 'tp-8', type: 'table', value: JSON.stringify([
      ["Environment", "URL Coordinate", "Deployment Channel", "Clearance"],
      ["Staging", "qa-portal.mawarid.com.sa:8080", "CI/CD Pipeline Auto-Deploy", "Active"],
      ["User Acceptance Testing", "uat-portal.mawarid.com.sa:9000", "Manual Verified Rollout", "Pending"]
    ]) },
    { id: 'tp-9', type: 'header', headingLevel: '2', value: '4. QA Test Coverage Progression' },
    { id: 'tp-10', type: 'progress-bars', value: JSON.stringify([
      { label: 'Functional Test Coverage', value: 85, color: '#0284c7' },
      { label: 'Integration API Testing', value: 90, color: '#6366f1' },
      { label: 'Performance & Load Checks', value: 40, color: '#f59e0b' },
      { label: 'Security & Auth Compliance', value: 50, color: '#10b981' }
    ]) },
    { id: 'tp-11', type: 'header', headingLevel: '2', value: '5. Risk Mitigation & Triage Protocols' },
    { id: 'tp-12', type: 'callout', value: '⚠ Critical Protocol: If any blocker regression is identified on Staging, deployments to UAT are automatically halted until triage is completed.' }
  ];
};

const getTestCasesTemplateBlocks = (title: string) => {
  return [
    { id: 'tc-1', type: 'header', headingLevel: '1', value: `Test Case Specification - ${title}` },
    { id: 'tc-2', type: 'textarea', value: 'Functional test case specifications with preconditions, execution steps, expected outcomes, and current status checks.' },
    { id: 'tc-3', type: 'header', headingLevel: '2', value: '1. Test Case Execution Summary' },
    { id: 'tc-4', type: 'metric-cards', value: JSON.stringify([
      { title: 'Total Cases', value: '48', color: '#0284c7', desc: 'Active in suite' },
      { title: 'Passed Cases', value: '32', color: '#10b981', desc: 'Successful validation' },
      { title: 'Failed Cases', value: '4', color: '#ef4444', desc: 'Triage ticket opened' },
      { title: 'Untested / Blocked', value: '12', color: '#f59e0b', desc: 'Pending deployment' }
    ]) },
    { id: 'tc-5', type: 'header', headingLevel: '2', value: '2. Functional Test Cases Suite' },
    { id: 'tc-6', type: 'table', value: JSON.stringify([
      ["Case ID", "Module", "Verification Title", "Precondition", "Expected Result", "Status"],
      ["TC-AUTH-01", "Auth", "Successful Portal Login", "Valid credentials", "User workspace loads with active JWT session", "Passed"],
      ["TC-AUTH-02", "Auth", "Brute Force Protection", "5 invalid login attempts", "Rate limit exception triggers, IP block for 15m", "Passed"],
      ["TC-ATT-01", "Attendance", "Punch-In Coordinates Verification", "Active network & GPS", "Punch successfully syncs with Saudi staging database", "Failed"],
      ["TC-PAY-01", "Payroll", "Run Batch Validation", "Approved monthly attendances", "Calculated payroll outputs match the core ledger sheet", "Untested"]
    ]) },
    { id: 'tc-7', type: 'header', headingLevel: '2', value: '3. QA Execution Guidelines' },
    { id: 'tc-8', type: 'callout', value: '💡 Pro Tip: Clean browser caches, local storages, and clear active JWT server session tokens before running TC-AUTH-02.' }
  ];
};

const getBugLogTemplateBlocks = (title: string) => {
  return [
    { id: 'bl-1', type: 'header', headingLevel: '1', value: `Bug & Defect Register - ${title}` },
    { id: 'bl-2', type: 'textarea', value: 'Centralized registry tracking active defects, blocker triage statuses, and code resolution records across sprint modules.' },
    { id: 'bl-3', type: 'header', headingLevel: '2', value: '1. Defect Metrics Dashboard' },
    { id: 'bl-4', type: 'metric-cards', value: JSON.stringify([
      { title: 'Critical Blockers', value: '3', color: '#ef4444', desc: 'Requires instant patch' },
      { title: 'Active Bugs', value: '18', color: '#f59e0b', desc: 'Assigned to developers' },
      { title: 'In QA Review', value: '6', color: '#6366f1', desc: 'Fix verification' },
      { title: 'Closed & Resolved', value: '42', color: '#10b981', desc: 'Merged into main build' }
    ]) },
    { id: 'bl-5', type: 'header', headingLevel: '2', value: '2. Active Defect Logs' },
    { id: 'bl-6', type: 'table', value: JSON.stringify([
      ["Defect ID", "Defect Description", "Severity", "Assigned Lead", "Status", "Resolution Notes"],
      ["BUG-101", "JWT token expiration triggers unhandled crash", "🔴 Critical", "Backend Team", "Active", "Token verification fails to catch expired error block"],
      ["BUG-102", "Punch-in duplicate transaction on double click", "🟡 High", "Frontend Lead", "Review", "Disable action trigger immediately post click state update"],
      ["BUG-103", "Payroll PDF misalignment under RTL Arabic font", "🟢 Medium", "UI Developer", "Resolved", "Standardize container sizing with fluid flex margins"]
    ]) },
    { id: 'bl-7', type: 'header', headingLevel: '2', value: '3. Defect Classification Criteria' },
    { id: 'bl-8', type: 'callout', value: '🔴 CRITICAL: Complete feature disruption, database transaction failure, or security leakage.\n🟡 HIGH: Main functional flow failing but manual workarounds exist.\n🟢 MEDIUM: UI styling gaps, spelling errors, or cosmetic visual issues.' }
  ];
};

const getUatTemplateBlocks = (title: string) => {
  return [
    { id: 'ut-1', type: 'header', headingLevel: '1', value: `UAT Sign-off - ${title}` },
    { id: 'ut-2', type: 'table', value: JSON.stringify([
      ["Project Owner", "Client Reviewer", "UAT Coordinator", "Target Release", "Clearance Approval"],
      [title, "Saudi Portal Operations", "Ahmad Al-Mansoor", "v2.1-Staging", "Pending Review"]
    ]) },
    { id: 'ut-3', type: 'header', headingLevel: '2', value: '1. User Acceptance Verification Checklists' },
    { id: 'ut-4', type: 'todo-list', value: 'Authenticate end-to-end user workspace registration flow\nValidate biometric integration coordinates in Saudi sandbox servers\nVerify Arabic translation layout matches corporate compliance\nExecute database fallback recovery checks on stage environment' },
    { id: 'ut-5', type: 'header', headingLevel: '2', value: '2. Outstanding UAT Non-Blocker Log' },
    { id: 'ut-6', type: 'table', value: JSON.stringify([
      ["ID", "Outstanding Observation", "Impact / Workaround", "Client Action Decision"],
      ["OB-01", "Latency spike during extensive PDF reports download", "Generate PDFs asynchronously via scheduled background worker queue", "Approved Workaround"]
    ]) },
    { id: 'ut-7', type: 'header', headingLevel: '2', value: '3. Formal Acceptance Declaration' },
    { id: 'ut-8', type: 'textarea', value: 'We, the undersigned, hereby confirm that the system meets the user acceptance criteria under the specified staging parameters. The product is declared ready for production deployment.' },
    { id: 'ut-9', type: 'header', headingLevel: '2', value: '4. Signatories & Approval Credentials' },
    { id: 'ut-10', type: 'table', value: JSON.stringify([
      ["Approver Name", "Title / Role", "Decision Date", "Clearing Initial / Signature"],
      ["", "Saudi Corporate Director", "", ""],
      ["", "Solution Delivery Manager", "", ""]
    ]) }
  ];
};

const getDevopsDeployTemplateBlocks = (title: string) => {
  return [
    { id: 'dep-1', type: 'header', headingLevel: '1', value: `Production Rollout & Deployment Guide - ${title}` },
    { id: 'dep-2', type: 'table', value: JSON.stringify([
      ["Field", "Value"],
      ["Project Name", title || "HRMS ERP"],
      ["Version", "v3.2"],
      ["Deployment Window", "20-May-2026"],
      ["Environment", "Production"],
      ["Status", "Ready"]
    ]) },
    { id: 'dep-3', type: 'callout', value: '[Deployment Pipeline]  [Rollback Plan]  [Server Health]' },
    { id: 'dep-4', type: 'header', headingLevel: '2', value: '1. Deployment Flow UI' },
    { id: 'dep-5', type: 'code', label: 'Deployment Flow Topology', value: `Code Freeze\n      ↓\nBuild Generation\n      ↓\nQA Validation\n      ↓\nStaging Deployment\n      ↓\nProduction Deployment\n      ↓\nPost-Deployment Verification` },
    { id: 'dep-6', type: 'header', headingLevel: '2', value: '2. Deployment Checklist Card' },
    { id: 'dep-7', type: 'detailed-card', value: JSON.stringify({
      id: 'DEP-101',
      title: 'Database Migration',
      fields: [
        { label: 'Task', value: 'Database Migration' },
        { label: 'Server', value: 'Production DB Cluster' },
        { label: 'Validation', value: '✔ Backup completed, ✔ Migration scripts tested, ✔ Rollback prepared' },
        { label: 'Owner', value: 'DevOps Engineer' },
        { label: 'Status', value: 'Ready' }
      ]
    }) },
    { id: 'dep-8', type: 'header', headingLevel: '2', value: '3. Release Rollout Progress' },
    { id: 'dep-9', type: 'progress-bars', value: JSON.stringify([
      { label: 'Code Freeze', value: 100, color: '#16A34A' },
      { label: 'Build Generation', value: 100, color: '#16A34A' },
      { label: 'QA Validation', value: 100, color: '#16A34A' },
      { label: 'Staging Deploy', value: 100, color: '#16A34A' },
      { label: 'Prod Rollout', value: 0, color: '#2563EB' }
    ]) }
  ];
};

const getDevopsServerTemplateBlocks = (title: string) => {
  return [
    { id: 'srv-1', type: 'header', headingLevel: '1', value: `Infrastructure Inventory & Server Configurations - ${title}` },
    { id: 'srv-2', type: 'header', headingLevel: '2', value: '1. Infrastructure Overview' },
    { id: 'srv-3', type: 'metric-cards', value: JSON.stringify([
      { title: 'Application Servers', value: '6', color: '#2563EB', desc: 'Active instances' },
      { title: 'Database Nodes', value: '3', color: '#16A34A', desc: 'Active clusters' },
      { title: 'Load Balancers', value: '2', color: '#F59E0B', desc: 'Active routes' }
    ]) },
    { id: 'srv-4', type: 'header', headingLevel: '2', value: '2. Server Configuration Card' },
    { id: 'srv-5', type: 'detailed-card', value: JSON.stringify({
      id: 'PROD-APP-01',
      title: 'Application Server PROD-APP-01',
      fields: [
        { label: 'Type', value: 'Application Server' },
        { label: 'OS', value: 'Ubuntu 24.04' },
        { label: 'CPU', value: '16 Cores' },
        { label: 'RAM', value: '64 GB' },
        { label: 'Storage', value: '1 TB SSD' },
        { label: 'Services', value: '✔ Nginx, ✔ Node.js, ✔ PM2, ✔ Docker' },
        { label: 'Status', value: 'Active' }
      ]
    }) },
    { id: 'srv-6', type: 'header', headingLevel: '2', value: '3. Infrastructure Topology UI' },
    { id: 'srv-7', type: 'code', label: 'Topology Layout', value: `Load Balancer\n      ↓\nApplication Cluster\n      ↓\nMicroservices\n      ↓\nDatabase Cluster\n      ↓\nBackup Storage` }
  ];
};

const getDevopsBackupTemplateBlocks = (title: string) => {
  return [
    { id: 'bac-1', type: 'header', headingLevel: '1', value: `Disaster Recovery & Backup Plan - ${title}` },
    { id: 'bac-2', type: 'header', headingLevel: '2', value: '1. Recovery Dashboard' },
    { id: 'bac-3', type: 'metric-cards', value: JSON.stringify([
      { title: 'Last Backup', value: '02:00 AM', color: '#16A34A', desc: 'Daily Incremental' },
      { title: 'Recovery Readiness', value: '98%', color: '#2563EB', desc: 'DR drill validated' }
    ]) },
    { id: 'bac-4', type: 'header', headingLevel: '2', value: '2. Backup Strategy UI' },
    { id: 'bac-5', type: 'code', label: 'Backup Strategy Flow', value: `Daily Incremental Backup\n          ↓\nWeekly Full Backup\n          ↓\nCloud Replication\n          ↓\nDisaster Recovery Site` },
    { id: 'bac-6', type: 'header', headingLevel: '2', value: '3. Recovery Plan Card' },
    { id: 'bac-7', type: 'detailed-card', value: JSON.stringify({
      id: 'DR-201',
      title: 'Database Failure recovery plan',
      fields: [
        { label: 'Scenario', value: 'Database Failure' },
        { label: 'Recovery Method', value: 'Automated Failover' },
        { label: 'Estimated Recovery Time', value: '15 Minutes' },
        { label: 'Backup Source', value: 'AWS S3 Snapshot' },
        { label: 'Validation', value: '✔ Tested Successfully' }
      ]
    }) }
  ];
};

const getDevopsPipelineTemplateBlocks = (title: string) => {
  return [
    { id: 'pip-1', type: 'header', headingLevel: '1', value: `CI/CD Pipelines & Build Engine Configuration - ${title}` },
    { id: 'pip-2', type: 'header', headingLevel: '2', value: '1. Pipeline Overview' },
    { id: 'pip-3', type: 'code', label: 'Workflow Engine Flow', value: `Git Push\n    ↓\nCode Review\n    ↓\nCI Build\n    ↓\nAutomated Testing\n    ↓\nDocker Build\n    ↓\nDeployment` },
    { id: 'pip-4', type: 'header', headingLevel: '2', value: '2. Pipeline Dashboard' },
    { id: 'pip-5', type: 'metric-cards', value: JSON.stringify([
      { title: 'Successful Builds', value: '142', color: '#16A34A', desc: 'All pipelines passed' },
      { title: 'Failed Pipelines', value: '3', color: '#DC2626', desc: 'Requires triage' }
    ]) },
    { id: 'pip-6', type: 'header', headingLevel: '2', value: '3. Pipeline Stage Card' },
    { id: 'pip-7', type: 'detailed-card', value: JSON.stringify({
      id: 'TESTING',
      title: 'Pipeline Stage: TESTING',
      fields: [
        { label: 'Trigger', value: 'GitHub Push' },
        { label: 'Tools', value: '✔ GitHub Actions, ✔ Jest, ✔ Cypress' },
        { label: 'Execution Time', value: '8 Minutes' },
        { label: 'Result', value: 'Passed' }
      ]
    }) }
  ];
};

const getDevopsEnvTemplateBlocks = (title: string) => {
  return [
    { id: 'env-1', type: 'header', headingLevel: '1', value: `Multi-Environment Configuration Sheet - ${title}` },
    { id: 'env-2', type: 'header', headingLevel: '2', value: '1. Environment Dashboard' },
    { id: 'env-3', type: 'metric-cards', value: JSON.stringify([
      { title: 'Development', value: 'Active', color: '#2563EB', desc: 'dev.app.com' },
      { title: 'Staging', value: 'Stable', color: '#F59E0B', desc: 'stage.app.com' },
      { title: 'Production', value: 'Healthy', color: '#16A34A', desc: 'app.com' }
    ]) },
    { id: 'env-4', type: 'header', headingLevel: '2', value: '2. Environment Configuration Table' },
    { id: 'env-5', type: 'table', value: JSON.stringify([
      ["Environment", "URL", "Database", "Status"],
      ["Dev", "dev.app.com", "PostgreSQL", "Active"],
      ["Stage", "stage.app.com", "PostgreSQL", "Stable"],
      ["Prod", "app.com", "PostgreSQL Cluster", "Healthy"]
    ]) },
    { id: 'env-6', type: 'header', headingLevel: '2', value: '3. Configuration Flow UI' },
    { id: 'env-7', type: 'code', label: 'Environment Migration', value: `Development\n      ↓\nTesting\n      ↓\nStaging\n      ↓\nProduction` }
  ];
};

const getDevopsMonitorTemplateBlocks = (title: string) => {
  return [
    { id: 'mon-1', type: 'header', headingLevel: '1', value: `Logging & Observability Operations Guide - ${title}` },
    { id: 'mon-2', type: 'header', headingLevel: '2', value: '1. Monitoring Overview Dashboard' },
    { id: 'mon-3', type: 'metric-cards', value: JSON.stringify([
      { title: 'Active Alerts', value: '4', color: '#DC2626', desc: 'Triage pending' },
      { title: 'System Health', value: '99.9%', color: '#16A34A', desc: 'SLA target met' },
      { title: 'API Response Time', value: '1.1 sec', color: '#F59E0B', desc: 'P95 threshold' }
    ]) },
    { id: 'mon-4', type: 'header', headingLevel: '2', value: '2. Monitoring Flow UI' },
    { id: 'mon-5', type: 'code', label: 'Observability Log Flow', value: `Application Logs\n        ↓\nLog Aggregation\n        ↓\nMonitoring Engine\n        ↓\nAlert System\n        ↓\nIncident Response` },
    { id: 'mon-6', type: 'header', headingLevel: '2', value: '3. Alert Card UI' },
    { id: 'mon-7', type: 'detailed-card', value: JSON.stringify({
      id: 'ALT-402',
      title: 'Alert ALT-402: High CPU Usage',
      fields: [
        { label: 'Issue', value: 'High CPU Usage' },
        { label: 'Server', value: 'PROD-APP-03' },
        { label: 'Threshold', value: '90%' },
        { label: 'Current Usage', value: '96%' },
        { label: 'Action', value: 'Auto scaling triggered' },
        { label: 'Status', value: 'Monitoring' }
      ]
    }) },
    { id: 'mon-8', type: 'header', headingLevel: '2', value: '4. Logging Architecture UI' },
    { id: 'mon-9', type: 'code', label: 'ELK Collector Architecture', value: `Application\n     ↓\nLog Collector\n     ↓\nELK Stack\n     ↓\nMonitoring Dashboard\n     ↓\nAlert Notifications` }
  ];
};

const getSupportUserManualBlocks = (title: string) => {
  return [
    { id: 'um-1', type: 'header', headingLevel: '1', value: `User Manual - ${title}` },
    { id: 'um-2', type: 'table', value: JSON.stringify([
      ["Field", "Value"],
      ["Product", title || "HRMS Platform"],
      ["Version", "v3.2"],
      ["Audience", "Employees"],
      ["Last Updated", new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })],
      ["Status", "Published"]
    ]) },
    { id: 'um-3', type: 'header', headingLevel: '2', value: '1. Getting Started' },
    { id: 'um-4', type: 'textarea', value: 'Welcome to the HRMS Platform. This guide will walk you through every feature and workflow to help you get started quickly.' },
    { id: 'um-5', type: 'header', headingLevel: '2', value: '2. Feature Walkthrough' },
    { id: 'um-6', type: 'detailed-card', value: JSON.stringify({
      id: 'FTR-ATT', title: 'Attendance Check-In', fields: [
        { label: 'Feature', value: 'Attendance Check-In' },
        { label: 'Steps', value: '1. Open Dashboard → 2. Navigate to Attendance → 3. Click Check-In → 4. Allow GPS' },
        { label: 'Expected Result', value: 'Attendance marked successfully' },
        { label: 'Tips', value: '✔ Ensure GPS enabled ✔ Stable internet recommended' }
      ]
    }) },
    { id: 'um-7', type: 'header', headingLevel: '2', value: '3. User Navigation Guide' },
    { id: 'um-8', type: 'code', label: 'Guided Workflow', value: `Login\n      ↓\nDashboard\n      ↓\nAttendance\n      ↓\nLeave Request\n      ↓\nLogout` },
    { id: 'um-9', type: 'header', headingLevel: '2', value: '4. Key Features' },
    { id: 'um-10', type: 'todo-list', value: 'Interactive walkthroughs\nEmbedded video tutorials\nScreenshot annotations\nAI help assistant\nSmart search' }
  ];
};

const getSupportAdminManualBlocks = (title: string) => {
  return [
    { id: 'am-1', type: 'header', headingLevel: '1', value: `Admin Manual - ${title}` },
    { id: 'am-2', type: 'header', headingLevel: '2', value: '1. Admin Overview Dashboard' },
    { id: 'am-3', type: 'metric-cards', value: JSON.stringify([
      { title: 'Total Users', value: '2,400', color: '#2563EB', desc: 'Registered accounts' },
      { title: 'Active Modules', value: '14', color: '#16A34A', desc: 'System modules' },
      { title: 'Pending Approvals', value: '7', color: '#F59E0B', desc: 'Awaiting review' }
    ]) },
    { id: 'am-4', type: 'header', headingLevel: '2', value: '2. Admin Operations' },
    { id: 'am-5', type: 'detailed-card', value: JSON.stringify({
      id: 'ADM-ROLE', title: 'User Role Management', fields: [
        { label: 'Function', value: 'User Role Management' },
        { label: 'Permissions', value: '✔ Create Users ✔ Assign Roles ✔ Reset Passwords ✔ Disable Accounts' },
        { label: 'Security Level', value: 'High' },
        { label: 'Dependencies', value: 'Authentication Module' }
      ]
    }) },
    { id: 'am-6', type: 'header', headingLevel: '2', value: '3. Admin Workflow' },
    { id: 'am-7', type: 'code', label: 'Admin Workflow', value: `User Creation\n      ↓\nRole Assignment\n      ↓\nPermission Mapping\n      ↓\nActivation` },
    { id: 'am-8', type: 'header', headingLevel: '2', value: '4. Key Features' },
    { id: 'am-9', type: 'todo-list', value: 'Access control mapping\nAudit log visibility\nSystem settings management\nRole simulation' }
  ];
};

const getSupportTrainingBlocks = (title: string) => {
  return [
    { id: 'tr-1', type: 'header', headingLevel: '1', value: `Training Material - ${title}` },
    { id: 'tr-2', type: 'header', headingLevel: '2', value: '1. Training Dashboard' },
    { id: 'tr-3', type: 'metric-cards', value: JSON.stringify([
      { title: 'Courses Completed', value: '78%', color: '#16A34A', desc: 'Overall progress' },
      { title: 'Pending Modules', value: '4', color: '#F59E0B', desc: 'Awaiting completion' },
      { title: 'Certifications', value: '2', color: '#2563EB', desc: 'Earned badges' }
    ]) },
    { id: 'tr-4', type: 'header', headingLevel: '2', value: '2. Training Module Card' },
    { id: 'tr-5', type: 'detailed-card', value: JSON.stringify({
      id: 'TRN-PAY', title: 'Payroll Operations', fields: [
        { label: 'Module', value: 'Payroll Operations' },
        { label: 'Duration', value: '45 Minutes' },
        { label: 'Includes', value: '✔ Video Lessons ✔ Live Demo ✔ Practice Tasks ✔ Quiz' },
        { label: 'Completion Status', value: 'In Progress' }
      ]
    }) },
    { id: 'tr-6', type: 'header', headingLevel: '2', value: '3. Learning Journey' },
    { id: 'tr-7', type: 'code', label: 'Learning Journey', value: `Introduction\n      ↓\nSystem Navigation\n      ↓\nDaily Operations\n      ↓\nAdvanced Features\n      ↓\nAssessment` },
    { id: 'tr-8', type: 'header', headingLevel: '2', value: '4. Progress Tracking' },
    { id: 'tr-9', type: 'progress-bars', value: JSON.stringify([
      { label: 'System Navigation', value: 100, color: '#16A34A' },
      { label: 'Daily Operations', value: 85, color: '#2563EB' },
      { label: 'Advanced Features', value: 45, color: '#F59E0B' },
      { label: 'Assessment', value: 0, color: '#94A3B8' }
    ]) }
  ];
};

const getSupportFaqBlocks = (title: string) => {
  return [
    { id: 'fq-1', type: 'header', headingLevel: '1', value: `FAQ Document - ${title}` },
    { id: 'fq-2', type: 'textarea', value: 'Frequently Asked Questions knowledge base for quick issue resolution and product guidance.' },
    { id: 'fq-3', type: 'header', headingLevel: '2', value: '1. Popular Topics' },
    { id: 'fq-4', type: 'todo-list', value: 'Login Issues\nPassword Reset\nAttendance Errors\nReport Downloads\nLeave Balance Queries' },
    { id: 'fq-5', type: 'header', headingLevel: '2', value: '2. Authentication FAQ' },
    { id: 'fq-6', type: 'header', headingLevel: '3', value: 'Q: How do I reset my password?' },
    { id: 'fq-7', type: 'numbered-list', value: 'Click Forgot Password on the login page' },
    { id: 'fq-8', type: 'numbered-list', value: 'Enter registered email or mobile number' },
    { id: 'fq-9', type: 'numbered-list', value: 'Verify the OTP sent to your device' },
    { id: 'fq-10', type: 'numbered-list', value: 'Create your new password' },
    { id: 'fq-11', type: 'header', headingLevel: '2', value: '3. FAQ Category Tree' },
    { id: 'fq-12', type: 'code', label: 'FAQ Categories', value: `Authentication\n  ├── Login Issues\n  ├── Password Reset\n  └── OTP Problems\n\nAttendance\n  ├── GPS Issues\n  ├── Late Entry\n  └── Missing Attendance` },
    { id: 'fq-13', type: 'header', headingLevel: '2', value: '4. AI Search Capabilities' },
    { id: 'fq-14', type: 'callout', value: '💡 Our AI-powered search analyzes your question and suggests the most relevant answers across all FAQ categories.' }
  ];
};

const getSupportTroubleshootBlocks = (title: string) => {
  return [
    { id: 'ts-1', type: 'header', headingLevel: '1', value: `Troubleshooting Guide - ${title}` },
    { id: 'ts-2', type: 'header', headingLevel: '2', value: '1. Error Resolution Dashboard' },
    { id: 'ts-3', type: 'metric-cards', value: JSON.stringify([
      { title: 'Open Issues', value: '12', color: '#DC2626', desc: 'Awaiting resolution' },
      { title: 'Resolved Today', value: '28', color: '#16A34A', desc: 'Successfully closed' },
      { title: 'Avg Resolution', value: '24 min', color: '#2563EB', desc: 'Mean time to fix' }
    ]) },
    { id: 'ts-4', type: 'header', headingLevel: '2', value: '2. Troubleshooting Card' },
    { id: 'ts-5', type: 'detailed-card', value: JSON.stringify({
      id: 'ISS-SYNC', title: 'Attendance Not Syncing', fields: [
        { label: 'Issue', value: 'Attendance not syncing' },
        { label: 'Possible Causes', value: '✔ Internet unavailable ✔ GPS disabled ✔ API timeout' },
        { label: 'Resolution Steps', value: '1. Check internet → 2. Restart application → 3. Retry sync' },
        { label: 'Escalation', value: 'Contact admin if issue persists' }
      ]
    }) },
    { id: 'ts-6', type: 'header', headingLevel: '2', value: '3. Diagnostic Workflow' },
    { id: 'ts-7', type: 'code', label: 'Diagnostic Workflow', value: `Issue Detected\n      ↓\nRoot Cause Analysis\n      ↓\nFix Attempt\n      ↓\nValidation\n      ↓\nResolved` },
    { id: 'ts-8', type: 'header', headingLevel: '2', value: '4. Smart Diagnostics' },
    { id: 'ts-9', type: 'callout', value: '🔍 AI-powered issue detection analyzes error patterns and suggests targeted fixes before manual troubleshooting.' }
  ];
};

const getSupportReleaseNotesBlocks = (title: string) => {
  return [
    { id: 'rn-1', type: 'header', headingLevel: '1', value: `Release Notes - ${title}` },
    { id: 'rn-2', type: 'table', value: JSON.stringify([
      ["Field", "Value"],
      ["Product", title || "HRMS Platform"],
      ["Version", "v3.2"],
      ["Release Date", new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })],
      ["Type", "Minor Release"]
    ]) },
    { id: 'rn-3', type: 'header', headingLevel: '2', value: '1. Release Summary' },
    { id: 'rn-4', type: 'metric-cards', value: JSON.stringify([
      { title: 'New Features', value: '12', color: '#2563EB', desc: 'Enhancements added' },
      { title: 'Bug Fixes', value: '28', color: '#16A34A', desc: 'Issues resolved' },
      { title: 'Known Issues', value: '3', color: '#F59E0B', desc: 'Under monitoring' }
    ]) },
    { id: 'rn-5', type: 'header', headingLevel: '2', value: '2. Feature Highlight' },
    { id: 'rn-6', type: 'detailed-card', value: JSON.stringify({
      id: 'FTR-BIO', title: 'Biometric Attendance', fields: [
        { label: 'Feature', value: 'Biometric Attendance' },
        { label: 'Description', value: 'Employees can now mark attendance using fingerprint devices' },
        { label: 'Benefits', value: '✔ Faster attendance ✔ Reduced manual entries ✔ Better accuracy' },
        { label: 'Status', value: 'Released' }
      ]
    }) },
    { id: 'rn-7', type: 'header', headingLevel: '2', value: '3. Version Timeline' },
    { id: 'rn-8', type: 'code', label: 'Version Timeline', value: `v1.0 → Initial Launch\nv2.0 → Payroll Module\nv3.0 → Attendance Automation\nv3.2 → Biometric Integration` },
    { id: 'rn-9', type: 'header', headingLevel: '2', value: '4. Upgrade Notes' },
    { id: 'rn-10', type: 'callout', value: '⚠ Upgrade Instructions: Clear browser cache after update. Database migration runs automatically on first login post-upgrade.' }
  ];
};

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
  const [projects, setProjects] = useState<any[]>([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [folderError, setfolderError] = useState('');

  // Hydrate projects from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('docforge_projects');
      if (saved) {
        try {
          setProjects(JSON.parse(saved));
          return;
        } catch (e) {}
      }
      
      const defaultProjects = [
        { id: 1, name: 'Mawarid ERP Suite Integration', status: 'active', color: '#0284c7', category: 'HR & ERP' },
        { id: 3, name: 'Charitable Trust Grant Proposal', status: 'draft', color: '#f59e0b', category: 'NGO Sector' },
        { id: 4, name: 'Business Requirement Document (BRD)', status: 'active', color: '#10b981', category: 'Development' }
      ];
      setProjects(defaultProjects);
      localStorage.setItem('docforge_projects', JSON.stringify(defaultProjects));
    }
  }, []);

  const saveProjects = (updatedProjects: any[]) => {
    setProjects(updatedProjects);
    localStorage.setItem('docforge_projects', JSON.stringify(updatedProjects));
  };

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

  const handleDeleteProject = (id: number | string, name: string) => {
    if (confirm(`Are you sure you want to delete the Project "${name}"? Documents inside this Project will not be deleted, but their Project association will be removed.`)) {
      const updated = projects.filter(p => String(p.id) !== String(id));
      saveProjects(updated);

      // Remove association from metadata
      try {
        const metaList = JSON.parse(localStorage.getItem('docforge_docs_meta') || '[]');
        const updatedMeta = metaList.map((m: any) => {
          if (String(m.projectId) === String(id)) {
            const { projectId, ...rest } = m;
            return rest;
          }
          return m;
        });
        localStorage.setItem('docforge_docs_meta', JSON.stringify(updatedMeta));
      } catch (e) {}

      // Remove association from saved documents
      try {
        const savedDocs = JSON.parse(localStorage.getItem('docforge_saved_documents') || '[]');
        const updatedDocs = savedDocs.map((d: any) => {
          if (String(d.projectId) === String(id)) {
            const { projectId, ...rest } = d;
            return rest;
          }
          return d;
        });
        localStorage.setItem('docforge_saved_documents', JSON.stringify(updatedDocs));
      } catch (e) {}
    }
  };

  const handleEditProject = (proj: any) => {
    const newName = prompt(`Enter new Project name for "${proj.name}":`, proj.name);
    if (newName && newName.trim() && newName.trim() !== proj.name) {
      const updated = projects.map(p => {
        if (String(p.id) === String(proj.id)) {
          return { ...p, name: newName.trim() };
        }
        return p;
      });
      saveProjects(updated);
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
        if (t.type === 'brd') blocks = getBrdTemplateBlocks(t.title);
        else if (t.type === 'frd') blocks = getFrdTemplateBlocks(t.title);
        else if (t.type === 'srs') blocks = getEnterpriseSrsTemplateBlocks(t.title);
        else if (t.type === 'tdd') blocks = getTddTemplateBlocks(t.title);
        else if (t.type === 'testplan') blocks = getTestPlanTemplateBlocks(t.title);
        else if (t.type === 'testcases') blocks = getTestCasesTemplateBlocks(t.title);
        else if (t.type === 'buglog') blocks = getBugLogTemplateBlocks(t.title);
        else if (t.type === 'uat') blocks = getUatTemplateBlocks(t.title);
        else if (t.type === 'devops-deploy') blocks = getDevopsDeployTemplateBlocks(t.title);
        else if (t.type === 'devops-server') blocks = getDevopsServerTemplateBlocks(t.title);
        else if (t.type === 'devops-backup') blocks = getDevopsBackupTemplateBlocks(t.title);
        else if (t.type === 'devops-pipeline') blocks = getDevopsPipelineTemplateBlocks(t.title);
        else if (t.type === 'devops-env') blocks = getDevopsEnvTemplateBlocks(t.title);
        else if (t.type === 'devops-monitor') blocks = getDevopsMonitorTemplateBlocks(t.title);
        else if (t.type === 'support-usermanual') blocks = getSupportUserManualBlocks(t.title);
        else if (t.type === 'support-adminmanual') blocks = getSupportAdminManualBlocks(t.title);
        else if (t.type === 'support-training') blocks = getSupportTrainingBlocks(t.title);
        else if (t.type === 'support-faq') blocks = getSupportFaqBlocks(t.title);
        else if (t.type === 'support-troubleshoot') blocks = getSupportTroubleshootBlocks(t.title);
        else if (t.type === 'support-releasenotes') blocks = getSupportReleaseNotesBlocks(t.title);
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
          { id: 'st10', type: 'callout', value: '⚠ Payment gateway integration delayed - awaiting vendor credentials\n⚠ Client approval pending on dashboard design\n⚠ SSL certificate renewal required before staging deploy\n⚠ Third-party API rate limiting issue under investigation' }
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
      const demoBlocks = getBrdTemplateBlocks('Employee Attendance Management System');
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
  const useTemplate = (title: string, templateIdOrType: string) => {
    const id = Math.random().toString(36).substring(2, 11);
    
    // Read from template doc root
    let initialBlocks = [];
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

    localStorage.setItem(`doc_root_${id}`, JSON.stringify(initialBlocks));
    // Save metadata
    const metaList = JSON.parse(localStorage.getItem('docforge_docs_meta') || '[]');
    metaList.unshift({
      id,
      title: `${title}`,
      lastSaved: new Date().toLocaleString(),
      type: templateIdOrType === 'blank' ? 'custom' : templateIdOrType.replace('template-', ''),
      projectId: searchParams.get('projectId') || undefined
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





