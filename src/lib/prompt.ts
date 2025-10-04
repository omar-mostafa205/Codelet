/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// Prompt generator
export function createTutorialPrompt(data: any): string {
  const prompt = `You are a Senior Software Engineer tasked with explaining a codebase to other developers. You will generate a comprehensive tutorial with 1 chapter only that is professional and focused don't explain basic concepts .

TUTORIAL REQUIREMENTS:
- Each chapter should contain clear explanations of concepts
- Include relevant code snippets when needed (optional but recommended)
- Add diagrams when they help explain complex concepts (optional)
- Focus heavily on practical code examples
- Use proper markdown formatting for all code
- PRIMARY FOCUS: Use 'importantFiles' from the ${data} as the main source for examples and explanations

STRICT RESPONSE FORMAT:
You must respond ONLY with a JSON object following this exact structure:

{
  "title": "Tutorial Title Here",
  "description": "Brief description of what this tutorial covers",
  "repository": "${data.repository?.name || "project"}",
  "chapters": [
    {
      "chapterNumber": 1,
      "title": "Chapter Title",
      "content": {
        "subChapters": [
          {
            "subChapterTitle": "Sub Chapter Title",
            "explanation": "Detailed explanation of the concept covered in this section",
            "codeSnippets": [
              {
                "fileRef": "path/to/file.js",
                "sourceCode": "import React from 'react';\\nconst Component = () => {\\n  return <div>Hello World</div>;\\n};\\nexport default Component;"
              }
            ],
            "diagram": "` + '```mermaid\\nflowchart LR\\n    A[User Request] --> B[API Gateway]\\n    B --> C[Authentication]\\n```' + `"
          }
        ]
      }
    }
  ]
}

IMPORTANT RULES:
1. Code snippets are OPTIONAL - only include when they add value
2. Diagrams are OPTIONAL - only include when they clarify complex concepts
3. All code must be properly formatted with syntax highlighting
4. Focus on practical, real-world examples
5. Each chapter should build upon previous knowledge
6. Keep explanations clear and concise
7. Target audience: experienced developers learning a new codebase

FORMATTING EXAMPLES:

For Code Snippets (will be rendered with SyntaxHighlighter):
"sourceCode": "import React from 'react';\\nconst Component = () => {\\n  return <div>Hello World</div>;\\n};"

For Diagrams (will be rendered with Mermaid via ReactMarkdown):
"diagram": "` + '```mermaid\\nflowchart LR\\n    A[Start] --> B[End]\\n```' + `"

Common Mermaid Diagram Types to Use:
- Flowchart: Use for process flows and user journeys
- Sequence: Use for API calls and component interactions  
- Class: Use for object relationships and inheritance
- ER: Use for database relationships
- Git Graph: Use for branching strategies

Generate the tutorial based on the provided codebase data: ${JSON.stringify(data, null, 2)}`;

  return prompt;
}


  // "chapter_2": {
  //   "title": "System Architecture & Technical Design",
  //   "chapter": 2,
  //   "overview": "Comprehensive examination of the system architecture, design patterns, technical decisions, and component interactions.",
  //   "prerequisites": ["Basic understanding of system design", "Familiarity with architectural patterns", "Database fundamentals"],
  //   "learningObjectives": [
  //     "Understand the overall system architecture and design philosophy",
  //     "Identify all major components and their responsibilities",
  //     "Trace request flows and data paths through the system",
  //     "Understand scalability, performance, and fault tolerance patterns",
  //     "Recognize design patterns and architectural decisions"
  //   ],
  //   "architecturalPatterns": [
  //     {
  //       "pattern": "Primary architectural pattern (e.g., Microservices, Monolith, etc.)",
  //       "rationale": "Why this pattern was chosen for this specific project",
  //       "benefits": ["Benefit 1", "Benefit 2", "Benefit 3"],
  //       "tradeoffs": ["Tradeoff 1", "Tradeoff 2"]
  //     }
  //   ],
  //   "systemComponents": [
  //     {
  //       "name": "Component name",
  //       "purpose": "What this component does and why it exists",
  //       "technology": "Tech stack used for this component",
  //       "connections": ["Other components it connects to"],
  //       "responsibilities": ["Primary responsibility 1", "Primary responsibility 2"],
  //       "scalabilityConsiderations": "How this component scales"
  //     }
  //   ],
  //   "dataFlow": [
  //     {
  //       "step": 1,
  //       "actor": "Who initiates this step",
  //       "action": "What action is performed",
  //       "data": "What data is involved",
  //       "destination": "Where the data goes next",
  //       "transformations": "How data is modified in this step"
  //     }
  //   ],
  //   "performanceCharacteristics": [
  //     {
  //       "metric": "Performance metric name",
  //       "currentValue": "Current measured performance",
  //       "targetValue": "Target performance goal",
  //       "importance": "critical/important/nice-to-have",
  //       "measurementMethod": "How this metric is measured"
  //     }
  //   ],
  //   "diagrams": [
  //     {
  //       "type": "mermaid",
  //       "title": "System Architecture Overview",
  //       "description": "Complete architecture diagram showing all major components and their interactions",
  //       "diagram": "Comprehensive mermaid diagram showing system architecture",
  //       "size": "large",
  //       "interactive": true,
  //       "clickableElements": [
  //         {
  //           "elementId": "component_id",
  //           "description": "What happens when this element is clicked",
  //           "action": "Action to perform"
  //         }
  //       ]
  //     }
  //   ],
  //   "designDecisions": [
  //     {
  //       "decision": "Major technical decision made",
  //       "rationale": "Why this decision was made",
  //       "alternatives": ["Alternative option 1", "Alternative option 2"],
  //       "consequences": ["Positive consequence", "Negative consequence"],
  //       "reviewDate": "When this decision should be reviewed"
  //     }
  //   ],
  //   "bestPractices": [
  //     {
  //       "title": "Best practice name",
  //       "description": "Detailed description of the practice",
  //       "applicableScenarios": ["When to apply this practice"],
  //       "benefits": ["Benefit 1", "Benefit 2"],
  //       "implementationEffort": "low/medium/high",
  //       "examples": ["Concrete example of implementation"]
  //     }
  //   ]
  // },
  // "chapter_3": {
  //   "title": "Technology Stack & Development Environment",
  //   "chapter": 3,
  //   "overview": "Complete guide to the technology stack, dependencies, development tools, and environment setup process.",
  //   "learningObjectives": [
  //     "Understand the rationale behind each technology choice",
  //     "Set up a complete development environment from scratch",
  //     "Configure all necessary tools and dependencies",
  //     "Understand version compatibility and upgrade paths",
  //     "Troubleshoot common setup and configuration issues"
  //   ],
  //   "technologyChoices": [
  //     {
  //       "category": "Frontend/Backend/Database/etc.",
  //       "technology": "Specific technology name",
  //       "version": "Version being used",
  //       "purpose": "Why this technology is used",
  //       "alternatives": ["Alternative options considered"],
  //       "migrationPath": "How to upgrade or migrate if needed"
  //     }
  //   ],
  //   "systemRequirements": {
  //     "os": ["Supported operating systems"],
  //     "nodeVersion": "Required Node.js version",
  //     "memory": "RAM requirements",
  //     "storage": "Storage requirements",
  //     "additionalTools": ["Docker", "Database", "etc."]
  //   },
  //   "installationSteps": [
  //     {
  //       "step": 1,
  //       "title": "Step title",
  //       "commands": ["Command 1", "Command 2"],
  //       "description": "Detailed description of what this step accomplishes",
  //       "platform": "all/windows/mac/linux",
  //       "troubleshooting": ["Common issue 1", "Common issue 2"],
  //       "verification": "How to verify this step completed successfully"
  //     }
  //   ],
  //   "configurations": [
  //     {
  //       "filename": "Configuration file name",
  //       "purpose": "What this configuration file controls",
  //       "content": "Example configuration content",
  //       "format": "File format (json/yaml/env/etc.)",
  //       "environment": "development/staging/production/all",
  //       "containsSecrets": false,
  //       "setupInstructions": ["Step 1", "Step 2", "Step 3"],
  //       "commonIssues": ["Issue 1", "Issue 2"]
  //     }
  //   ],
  //   "developmentTools": [
  //     {
  //       "tool": "Tool name",
  //       "purpose": "What this tool is used for",
  //       "installation": "How to install",
  //       "configuration": "Key configuration settings",
  //       "alternatives": ["Alternative tools"]
  //     }
  //   ],
  //   "folderStructure": {
  //     "overview": "High-level explanation of project organization",
  //     "structure": "Detailed folder structure with explanations",
  //     "conventions": ["Naming convention 1", "Organization principle 1"],
  //     "navigation": ["How to find common file types", "Where to add new features"]
  //   }
  // },
  // "chapter_4": {
  //   "title": "Data Architecture & State Management",
  //   "chapter": 4,
  //   "overview": "Comprehensive guide to data models, database design, state management patterns, and data flow throughout the system.",
  //   "learningObjectives": [
  //     "Understand the complete data model and relationships",
  //     "Work effectively with the database schema and ORM",
  //     "Implement proper state management patterns",
  //     "Trace data flow from UI to database and back",
  //     "Optimize data access and caching strategies"
  //   ],
  //   "dataModel": {
  //     "entities": [
  //       {
  //         "name": "Entity name",
  //         "purpose": "What this entity represents",
  //         "attributes": ["key attribute 1", "key attribute 2"],
  //         "relationships": ["Related entity 1", "Related entity 2"],
  //         "constraints": ["Business rule 1", "Data constraint 1"]
  //       }
  //     ],
  //     "relationships": "Description of how entities relate to each other",
  //     "designPrinciples": ["Normalization approach", "Performance considerations"]
  //   },
  //   "stateManagement": {
  //     "patterns": [
  //       {
  //         "pattern": "State management pattern name",
  //         "useCase": "When to use this pattern",
  //         "implementation": "How it's implemented in the project",
  //         "benefits": ["Benefit 1", "Benefit 2"],
  //         "considerations": ["Thing to watch out for 1"]
  //       }
  //     ],
  //     "dataFlow": "How data moves through different layers of the application"
  //   },
  //   "caching": {
  //     "strategy": "Overall caching approach",
  //     "layers": ["Cache layer 1", "Cache layer 2"],
  //     "invalidation": "How cache is kept consistent",
  //     "performance": "Performance impact and metrics"
  //   },
  //   "diagrams": [
  //     {
  //       "type": "mermaid",
  //       "title": "Data Flow Diagram",
  //       "description": "Shows how data moves through the system",
  //       "diagram": "Mermaid diagram showing complete data flow",
  //       "size": "large"
  //     }
  //   ],
  //   "bestPractices": [
  //     {
  //       "title": "Data handling best practice",
  //       "description": "Detailed explanation of the practice",
  //       "examples": ["Code example or scenario"],
  //       "commonMistakes": ["Mistake to avoid 1"]
  //     }
  //   ]
  // },
  // "chapter_5": {
  //   "title": "Authentication, Authorization & Security",
  //   "chapter": 5,
  //   "overview": "Complete security implementation guide covering authentication mechanisms, authorization rules, and security best practices.",
  //   "learningObjectives": [
  //     "Implement secure authentication flows",
  //     "Design and enforce authorization rules",
  //     "Handle security tokens and sessions properly",
  //     "Apply security best practices throughout the application",
  //     "Identify and mitigate common security vulnerabilities"
  //   ],
  //   "authenticationMethods": [
  //     {
  //       "method": "Authentication method name (JWT, OAuth, etc.)",
  //       "implementation": "How it's implemented in the project",
  //       "flow": "Step-by-step authentication flow",
  //       "tokenHandling": "How tokens are created, stored, and validated",
  //       "expiration": "Token lifecycle and refresh strategy"
  //     }
  //   ],
  //   "authorizationRules": [
  //     {
  //       "resource": "Protected resource",
  //       "roles": ["Role 1", "Role 2"],
  //       "permissions": ["Permission 1", "Permission 2"],
  //       "implementation": "How authorization is enforced",
  //       "edgeCases": ["Special case 1", "Exception 1"]
  //     }
  //   ],
  //   "securityMeasures": [
  //     {
  //       "measure": "Security measure name",
  //       "purpose": "What threat this protects against",
  //       "implementation": "How it's implemented",
  //       "configuration": "Key configuration settings",
  //       "testing": "How to verify it works"
  //     }
  //   ],
  //   "commonVulnerabilities": [
  //     {
  //       "vulnerability": "OWASP Top 10 item or common security issue",
  //       "description": "What this vulnerability is",
  //       "prevention": "How the project prevents this",
  //       "detection": "How to detect if this occurs",
  //       "mitigation": "What to do if this is found"
  //     }
  //   ]
  // },
  // "chapter_6": {
  //   "title": "API Design & Backend Implementation",
  //   "chapter": 6,
  //   "overview": "Comprehensive guide to API architecture, endpoint design, business logic implementation, and backend patterns.",
  //   "learningObjectives": [
  //     "Understand API design principles and patterns used",
  //     "Implement clean, maintainable backend code",
  //     "Handle errors, validation, and edge cases properly",
  //     "Write effective business logic and service layers",
  //     "Follow established coding standards and patterns"
  //   ],
  //   "apiDesign": {
  //     "principles": ["REST principles", "Design philosophy", "Consistency rules"],
  //     "patterns": [
  //       {
  //         "pattern": "API pattern name",
  //         "usage": "When this pattern is used",
  //         "implementation": "How it's implemented",
  //         "benefits": ["Benefit 1", "Benefit 2"]
  //       }
  //     ],
  //     "versioning": "API versioning strategy",
  //     "documentation": "How APIs are documented"
  //   },
  //   "endpointStructure": [
  //     {
  //       "endpoint": "/api/resource/{id}",
  //       "method": "GET/POST/PUT/DELETE",
  //       "purpose": "What this endpoint does",
  //       "parameters": ["Parameter 1", "Parameter 2"],
  //       "validation": "Input validation rules",
  //       "response": "Response format and status codes",
  //       "errorHandling": "How errors are handled"
  //     }
  //   ],
  //   "businessLogic": {
  //     "organization": "How business logic is organized",
  //     "patterns": ["Service layer", "Repository pattern", "etc."],
  //     "validation": "Business rule validation approach",
  //     "errorHandling": "How business errors are handled"
  //   },
  //   "codeSnippets": [
  //     {
  //       "filename": "Example controller or service file",
  //       "language": "javascript/typescript/etc.",
  //       "code": "Well-documented code example showing patterns",
  //       "explanation": "Explanation of the code and patterns used"
  //     }
  //   ]
  // },
  // "chapter_7": {
  //   "title": "Frontend Architecture & User Interface",
  //   "chapter": 7,
  //   "overview": "Complete guide to frontend architecture, component design patterns, state management, and user interface implementation.",
  //   "learningObjectives": [
  //     "Understand frontend architecture and component organization",
  //     "Implement reusable, maintainable UI components",
  //     "Handle frontend state management effectively",
  //     "Create responsive and accessible user interfaces",
  //     "Optimize frontend performance and user experience"
  //   ],
  //   "architecturePattern": {
  //     "pattern": "Frontend architecture pattern (Component-based, MVC, etc.)",
  //     "rationale": "Why this pattern was chosen",
  //     "structure": "How the frontend is organized",
  //     "dataFlow": "How data flows through the frontend"
  //   },
  //   "componentDesign": [
  //     {
  //       "componentType": "Component category (Layout, Form, Data, etc.)",
  //       "patterns": ["Pattern 1", "Pattern 2"],
  //       "reusability": "How components are made reusable",
  //       "props": "Common prop patterns",
  //       "state": "State management within components"
  //     }
  //   ],
  //   "stateManagement": {
  //     "approach": "Frontend state management approach",
  //     "tools": ["State management tool 1", "Tool 2"],
  //     "patterns": ["Global state", "Local state", "Server state"],
  //     "dataFlow": "How state changes propagate"
  //   },
  //   "userExperience": {
  //     "designSystem": "Design system or style guide used",
  //     "accessibility": "Accessibility standards and implementation",
  //     "responsiveness": "Responsive design approach",
  //     "performance": "Frontend performance optimizations"
  //   },
  //   "codeSnippets": [
  //     {
  //       "filename": "Example component file",
  //       "language": "jsx/tsx",
  //       "code": "Well-structured component example",
  //       "explanation": "Component patterns and best practices shown"
  //     }
  //   ]
  // },
  // "chapter_8": {
  //   "title": "Testing Strategy & Quality Assurance",
  //   "chapter": 8,
  //   "overview": "Comprehensive testing approach covering unit tests, integration tests, end-to-end testing, and quality assurance processes.",
  //   "learningObjectives": [
  //     "Understand the complete testing strategy and pyramid",
  //     "Write effective unit and integration tests",
  //     "Implement end-to-end testing scenarios",
  //     "Set up continuous testing and quality gates",
  //     "Debug and troubleshoot test failures effectively"
  //   ],
  //   "testingStrategy": {
  //     "philosophy": "Overall testing philosophy and approach",
  //     "pyramid": "Testing pyramid breakdown (unit/integration/e2e ratios)",
  //     "coverage": "Code coverage goals and measurement",
  //     "automation": "Test automation strategy"
  //   },
  //   "testTypes": [
  //     {
  //       "type": "Unit/Integration/E2E/Performance",
  //       "purpose": "What this test type validates",
  //       "tools": ["Testing tool 1", "Tool 2"],
  //       "patterns": ["Common test patterns used"],
  //       "coverage": "What percentage of code/features",
  //       "frequency": "How often these tests run"
  //     }
  //   ],
  //   "qualityGates": [
  //     {
  //       "gate": "Quality gate name",
  //       "criteria": ["Criterion 1", "Criterion 2"],
  //       "tools": ["Tool used to measure"],
  //       "threshold": "Pass/fail threshold",
  //       "action": "What happens if gate fails"
  //     }
  //   ],
  //   "testEnvironments": [
  //     {
  //       "environment": "Environment name",
  //       "purpose": "What this environment is used for",
  //       "data": "Test data strategy",
  //       "setup": "How to set up this environment",
  //       "maintenance": "How this environment is maintained"
  //     }
  //   ],
  //   "commonIssues": [
  //     {
  //       "issue": "Common testing issue",
  //       "cause": "Why this issue occurs",
  //       "solution": "How to resolve it",
  //       "prevention": "How to prevent it"
  //     }
  //   ]
  // },
  // "chapter_9": {
  //   "title": "Deployment, CI/CD & DevOps",
  //   "chapter": 9,
  //   "overview": "Complete guide to deployment processes, CI/CD pipelines, infrastructure management, and DevOps practices.",
  //   "learningObjectives": [
  //     "Understand the deployment architecture and environments",
  //     "Work with CI/CD pipelines and automation",
  //     "Deploy applications safely and efficiently",
  //     "Monitor and maintain production systems",
  //     "Handle incidents and troubleshoot deployment issues"
  //   ],
  //   "deploymentArchitecture": {
  //     "environments": [
  //       {
  //         "name": "Environment name (dev/staging/prod)",
  //         "purpose": "What this environment is used for",
  //         "infrastructure": "Infrastructure setup",
  //         "configuration": "Key configuration differences",
  //         "access": "Who has access and how"
  //       }
  //     ],
  //     "strategy": "Blue-green, rolling, canary, etc.",
  //     "infrastructure": "Infrastructure as code approach"
  //   },
  //   "cicdPipeline": {
  //     "stages": [
  //       {
  //         "stage": "Pipeline stage name",
  //         "purpose": "What this stage accomplishes",
  //         "tools": ["Tool 1", "Tool 2"],
  //         "duration": "Typical execution time",
  //         "failureHandling": "What happens if this stage fails"
  //       }
  //     ],
  //     "triggers": "What triggers pipeline execution",
  //     "approvals": "Manual approval gates",
  //     "notifications": "How team is notified of pipeline status"
  //   },
  //   "monitoring": {
  //     "metrics": ["Key metric 1", "Key metric 2"],
  //     "alerting": "Alert setup and escalation",
  //     "logging": "Log aggregation and analysis",
  //     "dashboards": "Monitoring dashboards available"
  //   },
  //   "troubleshooting": [
  //     {
  //       "scenario": "Common deployment issue",
  //       "symptoms": "How to identify this issue",
  //       "diagnosis": "How to diagnose the root cause",
  //       "resolution": "Steps to resolve",
  //       "prevention": "How to prevent recurrence"
  //     }
  //   ]
  // },
  // "chapter_10": {
  //   "title": "Development Workflow & Team Onboarding",
  //   "chapter": 10,
  //   "overview": "Complete guide to team workflows, development processes, common pitfalls, and structured onboarding for new team members.",
  //   "learningObjectives": [
  //     "Understand team development workflows and processes",
  //     "Avoid common mistakes and pitfalls",
  //     "Follow established coding standards and practices",
  //     "Complete structured onboarding as a new team member",
  //     "Contribute effectively to the team and codebase"
  //   ],
  //   "developmentWorkflow": {
  //     "gitWorkflow": "Git branching strategy and workflow",
  //     "codeReview": "Code review process and standards",
  //     "issueTracking": "How issues and features are tracked",
  //     "communication": "Team communication channels and practices"
  //   },
  //   "codingStandards": [
  //     {
  //       "category": "Code style/Architecture/Documentation/etc.",
  //       "standards": ["Standard 1", "Standard 2"],
  //       "tools": ["Linting tool", "Formatting tool"],
  //       "enforcement": "How standards are enforced",
  //       "exceptions": "When standards can be bent"
  //     }
  //   ],
  //   "commonPitfalls": [
  //     {
  //       "pitfall": "Common mistake or gotcha",
  //       "description": "What this pitfall is",
  //       "consequences": "What happens if you fall into this",
  //       "prevention": "How to avoid this pitfall",
  //       "detection": "How to detect if this has happened",
  //       "resolution": "How to fix it if it occurs"
  //     }
  //   ],
  //   "onboardingPlan": {
  //     "duration": "30 days",
  //     "phases": [
  //       {
  //         "phase": "Phase name (Week 1, Week 2, etc.)",
  //         "duration": "1 week",
  //         "goals": ["Goal 1", "Goal 2"],
  //         "tasks": [
  //           {
  //             "task": "Specific task to complete",
  //             "description": "Detailed description of the task",
  //             "priority": "critical/important/nice-to-have",
  //             "estimatedEffort": "hours/days",
  //             "complexity": "simple/medium/complex",
  //             "prerequisites": ["Prerequisite 1"],
  //             "deliverables": ["What should be produced"],
  //             "mentor": "Who to work with on this task"
  //           }
  //         ],
  //         "checkpoints": ["Checkpoint 1", "Checkpoint 2"],
  //         "resources": ["Resource 1", "Resource 2"]
  //       }
  //     ],
  //     "milestones": [
  //       {
  //         "milestone": "First successful deployment",
  //         "description": "What this milestone represents",
  //         "criteria": "How to know this is achieved",
  //         "celebration": "How achievement is recognized"
  //       }
  //     ]
  //   },
  //   "resources": {
  //     "documentation": ["Doc link 1", "Doc link 2"],
  //     "tools": ["Tool 1", "Tool 2"],
  //     "contacts": ["Key contact 1", "Key contact 2"],
  //     "training": ["Training resource 1", "Training resource 2"]
  //   },
  //   "feedback": {
  //     "schedule": "Regular feedback schedule",
  //     "format": "How feedback is given and received",
  //     "topics": ["Performance", "Technical growth", "Team fit"],
  //     "action": "How feedback leads to improvement"
  //   }
  // }