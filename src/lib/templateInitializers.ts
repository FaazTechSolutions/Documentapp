export const getBrdTemplateBlocks = (title: string) => {
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

export const getFrdTemplateBlocks = (title: string) => {
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

export const getEnterpriseSrsTemplateBlocks = (title: string) => {
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

export const getTddTemplateBlocks = (title: string) => {
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

export const getTestPlanTemplateBlocks = (title: string) => {
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

export const getTestCasesTemplateBlocks = (title: string) => {
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

export const getBugLogTemplateBlocks = (title: string) => {
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

export const getUatTemplateBlocks = (title: string) => {
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

export const getDevopsDeployTemplateBlocks = (title: string) => {
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

export const getDevopsServerTemplateBlocks = (title: string) => {
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

export const getDevopsBackupTemplateBlocks = (title: string) => {
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

export const getDevopsPipelineTemplateBlocks = (title: string) => {
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

export const getDevopsEnvTemplateBlocks = (title: string) => {
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

export const getDevopsMonitorTemplateBlocks = (title: string) => {
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

export const getSupportUserManualBlocks = (title: string) => {
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

export const getSupportAdminManualBlocks = (title: string) => {
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

export const getSupportTrainingBlocks = (title: string) => {
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

export const getSupportFaqBlocks = (title: string) => {
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

export const getSupportTroubleshootBlocks = (title: string) => {
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

export const getSupportReleaseNotesBlocks = (title: string) => {
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

