export const WorkspaceRegistry: Record<string, {
  modules: string[];
  allowedDocuments: string[];
  defaultDocType: string;
  defaultModule: string;
}> = {
  business_analysis: {
    modules: ['m-req', 'm-scope', 'm-stake', 'm-appr', 'm-risk', 'm-work'],
    allowedDocuments: ['brd', 'frd', 'srs', 'requirements', 'stakeholder_matrix', 'approval_flow', 'risk_register'],
    defaultDocType: 'brd',
    defaultModule: 'm-req'
  },
  qa: {
    modules: ['m-testcases', 'm-bugs', 'm-suites', 'm-coverage', 'm-validation'],
    allowedDocuments: ['testcase', 'defect_log', 'validation_report', 'coverage_analytics'],
    defaultDocType: 'testcase',
    defaultModule: 'm-testcases'
  },
  devops: {
    modules: ['m-deploy', 'm-cicd', 'm-infra', 'm-monitor', 'm-release'],
    allowedDocuments: ['deployment_doc', 'pipeline_definition', 'infra_spec'],
    defaultDocType: 'deployment_doc',
    defaultModule: 'm-deploy'
  },
  executive: {
    modules: ['m-portfolio', 'm-roi', 'm-okr'],
    allowedDocuments: ['executive', 'portfolio', 'roi'],
    defaultDocType: 'executive',
    defaultModule: 'm-portfolio'
  },
  documentation: {
    modules: ['m-kb', 'm-sop', 'm-policy'],
    allowedDocuments: ['knowledge', 'sop', 'policy'],
    defaultDocType: 'knowledge',
    defaultModule: 'm-kb'
  },
  custom: {
    modules: [],
    allowedDocuments: ['custom'],
    defaultDocType: 'custom',
    defaultModule: ''
  }
};

