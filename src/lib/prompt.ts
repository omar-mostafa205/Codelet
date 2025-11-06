/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

export function createTutorialPrompt(data: any): string {
  const repoName = data.repository?.name || "project";
  const fileCount = data.importantFiles?.length || 0;
  const hasAuth = data.importantFiles?.some((f: any) => 
    f.path?.includes('auth') || f.reason?.toLowerCase().includes('auth')
  );
  const hasDatabase = data.importantFiles?.some((f: any) => 
    f.path?.includes('db') || f.path?.includes('prisma') || f.path?.includes('schema')
  );
  
  const recommendedChapters = fileCount < 15 ? '9-10' : fileCount < 30 ? '8-12' : '10-13';

  const prompt = `You are a Senior Software Engineer creating an in-depth codebase tutorial for experienced developers joining the ${repoName} project.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 CODEBASE ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Project: ${repoName}
Important Files Identified: ${fileCount}
Has Authentication: ${hasAuth ? 'Yes' : 'No'}
Has Database Layer: ${hasDatabase ? 'Yes' : 'No'}
Recommended Chapters: ${recommendedChapters}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 YOUR MISSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create a comprehensive tutorial with ${recommendedChapters} chapters that explains the ARCHITECTURE and INTEGRATION PATTERNS of this codebase.

Key Questions to Answer:
✓ How do different layers of the application communicate?
✓ What are the key architectural decisions and trade-offs?
✓ How does data flow through the entire system?
✓ What patterns are used for authentication, data fetching, and error handling?
✓ How are external services integrated?
✓ Which files orchestrate the critical business logic?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 WHAT TO FOCUS ON (Priority Order)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. INTEGRATION POINTS (Highest Priority)
   Focus on how different parts of the system connect and communicate.
   
   Look for patterns like:
   • API route handler (server) ↔ fetch call (client) - Always show BOTH sides!
   • Database query ↔ API endpoint that uses it
   • Auth middleware ↔ protected route ↔ login component
   • Server action ↔ client component that triggers it
   • WebSocket server setup ↔ client connection code
   • External API integration ↔ webhook handler
   • Form submission ↔ validation ↔ API processing
   • Event emitter ↔ event listeners across modules

2. DATA FLOW & STATE MANAGEMENT
   Trace how data moves through the application from start to finish.
   
   Look for patterns like:
   • User clicks button → API call → database update → state refresh → UI update
   • Server-side data fetch → hydration → client state management
   • Redux/Zustand store setup → action creators → components that dispatch
   • Context provider setup → consumer hooks → component usage
   • Props drilling vs context vs global state
   • Data transformations between layers (API → domain model → UI)
   • Cache invalidation and refresh strategies

3. AUTHENTICATION & AUTHORIZATION
   Show the complete security flow and how access control works.
   
   Look for patterns like:
   • Registration flow: form → validation → hashing → database → session
   • Login form → auth API → JWT generation → session storage → redirect
   • Protected route middleware → token validation → user context
   • Password hashing in signup → verification in login
   • Role-based access control implementation
   • Session refresh and token rotation
   • Logout and cleanup process

4. DATABASE ARCHITECTURE
   Explain data models, relationships, and how data is accessed.
   
   Look for patterns like:
   • Schema definitions (Prisma, TypeORM, Mongoose, SQL) → generated types → usage
   • Database migrations → schema changes → affected queries
   • Relationships between models (one-to-many, many-to-many)
   • Transaction handling in complex operations
   • Connection pooling and optimization
   • Query patterns and repository layer
   • Indexes and performance considerations

5. EXTERNAL INTEGRATIONS
   Show how the app integrates with third-party services.
   
   Look for patterns like:
   • Payment processing: client → server → Stripe API → webhook → confirmation
   • Email service: trigger → template → sending → delivery confirmation
   • File upload: client → server → S3/Cloudinary → URL storage → display
   • Third-party OAuth: redirect → callback → token exchange → user creation
   • API rate limiting and retry strategies
   • Webhook handling and verification
   • Background jobs for async operations

6. BUSINESS LOGIC & WORKFLOWS
   Explain core features and multi-step processes.
   
   Look for patterns like:
   • Multi-step checkout process with state transitions
   • Order fulfillment pipeline from creation to completion
   • User onboarding flow with progress tracking
   • Complex validation or calculation logic
   • State machines for process management
   • Scheduled tasks and cron jobs
   • Error recovery and rollback procedures

CHAPTER 1: GETTING STARTED (Required)
├─ Sub-Chapter 1.1: "Repository Overview & Setup"
│  ├─ explanation: What the codebase does, tech stack, how to run locally
│  ├─ codeSnippets: package.json, .env.example, main config files
│  └─ diagram: High-level architecture overview
│
└─ Sub-Chapter 1.2: "Project Structure & Conventions"
   ├─ explanation: Folder organization, naming conventions, key directories
   ├─ codeSnippets: Directory tree structure, example file paths
   └─ diagram: Folder structure visualization

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CHAPTER 2: INTEGRATION POINTS (Highest Priority)
For each integration point, create a sub-chapter:

Sub-Chapter Template:
├─ subChapterTitle: "[Feature Name] - Client to Server Integration"
├─ explanation: 
│  • What triggers this integration (user action, cron job, webhook)
│  • The complete flow from start to finish
│  • Why it's designed this way
│  • Common gotchas or edge cases
│
├─ codeSnippets: SHOW BOTH SIDES
│  [
│    { "fileRef": "client/components/Button.tsx", "sourceCode": "..." },
│    { "fileRef": "server/api/endpoint.ts", "sourceCode": "..." }
│  ]
│
└─ diagram: Sequence diagram showing the flow

Examples of integration sub-chapters:
- "User Login Flow - Frontend to Backend"
- "API Data Fetching - Client Request to Database Response"
- "Real-time Updates - WebSocket Connection"
- "Payment Processing - Stripe Integration"
- "File Upload - Client to Cloud Storage"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CHAPTER 3: DATA FLOW & STATE MANAGEMENT
For each major data flow, create a sub-chapter:

Sub-Chapter Template:
├─ subChapterTitle: "[Data Flow Name]"
├─ explanation:
│  • Where data originates
│  • How it transforms through the system
│  • Where it's stored (memory, DB, cache, local storage)
│  • How components react to changes
│
├─ codeSnippets: Show the complete chain
│  • Initial fetch/mutation
│  • State management setup (Redux, Context, Zustand, etc.)
│  • Component that consumes the data
│
└─ diagram: Data flow diagram

Examples:
- "User Data - From Login to Global State"
- "Shopping Cart - Add Item to Checkout Flow"
- "Real-time Notifications - Server Push to UI Update"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CHAPTER 4: AUTHENTICATION & AUTHORIZATION
Sub-chapters to include:

4.1 "User Registration & Login Flow"
├─ explanation: Complete auth flow, token generation, session management
├─ codeSnippets: 
│  • Signup form component
│  • Auth API endpoints
│  • JWT/session handling
│  • Password hashing
└─ diagram: Authentication sequence diagram

4.2 "Protected Routes & Authorization"
├─ explanation: How routes are protected, role checking, permissions
├─ codeSnippets:
│  • Middleware implementation
│  • Route guards
│  • Permission checking utilities
└─ diagram: Authorization decision flow

4.3 "Session Management & Token Refresh"
├─ explanation: Token lifecycle, refresh strategies, logout
├─ codeSnippets: Token refresh logic, interceptors
└─ diagram: Token refresh flow

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CHAPTER 5: DATABASE ARCHITECTURE(Diagrams are MANDATORY in this chapter)
Sub-chapters to include:

5.1 "Database Schema & Models"
├─ explanation: Tables/collections, relationships, constraints
├─ codeSnippets: 
│  • Schema definitions (Prisma, TypeORM, Mongoose, SQL)
│  • Migration files
└─ diagram: Entity relationship diagram (ERD)

5.2 "Query Patterns & Data Access Layer"
├─ explanation: How data is queried, common patterns, optimizations
├─ codeSnippets:
│  • Repository/service layer code
│  • Complex queries
│  • Transaction examples
└─ diagram: Data access layer architecture

5.3 "Database Operations in API Routes"
├─ explanation: How API endpoints interact with the database
├─ codeSnippets: Complete CRUD examples with error handling
└─ diagram: API → DB flow

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CHAPTER 6: EXTERNAL INTEGRATIONS
For each external service, create a sub-chapter:

Sub-Chapter Template:
├─ subChapterTitle: "[Service Name] Integration"
├─ explanation:
│  • What the integration does
│  • Configuration & API keys setup
│  • Request/response flow
│  • Webhook handling (if applicable)
│  • Error handling & retries
│
├─ codeSnippets:
│  • Client-side trigger code
│  • Server-side API call
│  • Webhook handler (if exists)
│  • Configuration files
│
└─ diagram: Complete integration flow including webhooks

Examples:
- "Stripe Payment Processing"
- "SendGrid Email Service"
- "AWS S3 File Storage"
- "OAuth with Google/GitHub"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CHAPTER 7: BUSINESS LOGIC & WORKFLOWS
For each major workflow, create a sub-chapter:

Sub-Chapter Template:
├─ subChapterTitle: "[Workflow Name] Process"
├─ explanation:
│  • Step-by-step breakdown of the workflow
│  • Business rules and validation
│  • State transitions
│  • Error scenarios and recovery
│
├─ codeSnippets:
│  • Main workflow orchestration code
│  • Validation functions
│  • State machine logic (if applicable)
│
└─ diagram: Workflow state diagram or process flow

Examples:
- "E-commerce Checkout Process"
- "User Onboarding Journey"
- "Order Fulfillment Pipeline"
- "Content Publishing Workflow"


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚫 WHAT TO AVOID
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✗ Basic language syntax or framework tutorials ("What is useState?")
✗ CSS, styling, Tailwind classes, or UI design details
✗ Simple utility functions that don't demonstrate patterns
✗ Line-by-line code walkthroughs
✗ Obvious, self-documenting code explanations
✗ Generic "Hello World" examples - use REAL code from the codebase

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📐 STRUCTURE REQUIREMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Chapters: ${recommendedChapters} chapters total

SubChapters per Chapter:
  • Standard chapters: 3-4 subchapters
  • Complex/Important chapters (auth, data flow, integrations): 5-10 subchapters

Suggested Chapter Flow:
  1. Architecture Overview & Project Structure
  2. Core Integration Patterns (API, Database, State)
  3. Authentication & Authorization System
  4. Data Layer & Database Operations
  5. External Service Integrations
  6. Business Logic & Critical Workflows
  7. Configuration & Deployment (if relevant)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💎 CONTENT QUALITY GUIDELINES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Code Snippets (IS Mandatory for Every Explaination):
  • Show BOTH sides of integrations (e.g., API route + client fetch)
  • Include when illustrating patterns, not just showing code
  • Simplify and focus on the important parts with comments
  • Use actual file paths from importantFiles in fileRef

Diagrams (OPTIONAL):
  • Use for complex flows that words can't easily explain
  • Sequence diagrams for API interactions
  • Flowcharts for user journeys and multi-step processes
  • ER diagrams for database relationships
  • Keep them focused and simple

Explanations:
  • Lead with "WHY" before "WHAT" - explain architectural decisions
  • Show trade-offs: "We chose X over Y because..."
  • Connect to real developer scenarios: "When you need to add a new endpoint..."
  • Assume intermediate knowledge - don't explain basic concepts
  • Be concise but thorough

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ CRITICAL RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. ✓ USE IMPORTANTFILES: The 'importantFiles' array below is your PRIMARY source
2. ✓ VALIDATE: Every chapter must reference at least ONE file from importantFiles
3. ✓ SHOW CONNECTIONS: When explaining a feature, show ALL related files (client + server)
4. ✓ CODE FORMAT: Use \\n for newlines in sourceCode strings (JSON requirement)
5. ✓ DIAGRAM FORMAT: Wrap mermaid in \`\`\`mermaid....\`\`\` markdown blocks
6. ✓ FILE PATHS: Use exact paths from importantFiles in fileRef
7. ✓ JSON ONLY: Output must be VALID JSON with no extra text before or after
8. ✓ MANDATORY: Include at least 1 code snippet per chapter (not per subchapter)
9. ✓ OPTIONAL: Diagrams are encouraged but not required for every subchapter

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📤 REQUIRED JSON OUTPUT FORMAT (DO NOT CHANGE THIS STRUCTURE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{
  "title": "Tutorial Title Here",
  "description": "Brief description of what this tutorial covers",
  "repository": "${repoName}",
  "chapters": [
    {
      "chapterNumber": 1,
      "title": "Chapter Title",
      "content": {
        "subChapters": [
          {
            "subChapterTitle": "Sub Chapter Title",
            "explanation": "Detailed explanation using **markdown** formatting with \`inline code\`, headers, and lists",
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

FORMATTING EXAMPLES:

Code Snippet Format:
"sourceCode": "import React from 'react';\\nconst Component = () => {\\n  return <div>Hello World</div>;\\n};"

Diagram Format:
"diagram": "` + '```mermaid\\nsequenceDiagram\\n    Client->>API: POST /login\\n    API-->>Client: JWT token\\n```' + `"

Common Mermaid Diagram Types:
- flowchart: Process flows and user journeys
- sequenceDiagram: API calls and component interactions  
- classDiagram: Object relationships and inheritance
- erDiagram: Database relationships

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 CODEBASE DATA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${JSON.stringify(data, null, 2)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Begin generating the tutorial now. Output ONLY the JSON object with no additional text.`;

  return prompt;
}