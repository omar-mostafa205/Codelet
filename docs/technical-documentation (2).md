# Codelet Technical Documentation

Codelet is a full-stack web application designed to automatically generate onboarding tutorials for software projects from their GitHub repositories. It leverages AI to analyze codebases, create structured learning content, and provide an interactive AI chat assistant that is context-aware of the repository's source code.


## Quick Start


This guide provides instructions to set up and run the Codelet project locally.


### Prerequisites


* Node.js (v18.x or later recommended)
* Docker and Docker Compose
* A PostgreSQL database
* API keys for Clerk, GitHub, and Google Gemini.


### Installation & Setup


1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd codelet
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env` file in the root of the project and populate it with the necessary API keys and database URL. Refer to the **Configuration** section for a complete list of required variables.

4.  **Start the Database:**
    The project includes a shell script to start a PostgreSQL database using Docker.
    ```bash
    ./start-database.sh
    ```

5.  **Apply Database Schema:**
    Push the Prisma schema to your database. This will create all the necessary tables and relations.
    ```bash
    npx prisma db push
    ```

6.  **Run the application:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.


## 1. Architecture


Codelet is a full-stack Next.js application built with the T3 Stack, featuring a serverless backend, typesafe API layer with tRPC, and AI integration with Google Gemini.


### System Architecture Diagram

```mermaid
graph TD
    subgraph Browser
        A[Next.js Frontend - React]
    end

    subgraph "External Services"
        C[Clerk Authentication]
        D[GitHub API]
        E[Google Gemini AI]
    end

    subgraph "Backend (Next.js)"
        B[API Layer]
        F[Database - PostgreSQL w/ Prisma]

        subgraph B[API Layer]
            B1[tRPC API - /api/trpc]
            B2[REST APIs - /api/chat, /api/webhooks]
        end

        subgraph tRPC_Routers [tRPC Routers]
            R1[projectRouter]
            R2[...]
        end
    end

    A -->|tRPC Queries/Mutations| B1
    A -->|HTTP Requests| B2
    A -->|Sign In/Up| C

    B1 --> R1
    R1 -->|Prisma Client| F
    R1 -->|Calls via lib| D
    R1 -->|Calls via lib| E

    B2 -->|AI Chat Logic| E
    B2 -->|Vector Search| F

    C -->|Webhooks /api/webhooks/clerk| B2
```


### Core Technologies


* **Framework**: Next.js (App Router)
* **Language**: TypeScript
* **API**: tRPC for end-to-end typesafe APIs.
* **Database**: PostgreSQL with Prisma ORM.
* **Authentication**: Clerk for user management and authentication.
* **AI**: Google Gemini for tutorial generation and chat functionality.
* **Styling**: Tailwind CSS with shadcn/ui components.
* **Schema Validation**: Zod.


### Project Structure

```
.
├── prisma/
│   └── schema.prisma       # Database schema definition
├── public/                 # Static assets
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── (auth)/         # Clerk authentication pages
│   │   ├── (main)/         # Core application pages after login
│   │   ├── api/            # API routes (REST, tRPC, Webhooks)
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Landing page
│   ├── components/
│   │   ├── dashboard/      # Components for the main dashboard
│   │   ├── main/           # Components for the landing page
│   │   ├── tutorial/       # Components for viewing tutorials and AI chat
│   │   └── ui/             # Reusable UI components (shadcn)
│   ├── lib/
│   │   ├── ai.ts           # Core logic for generating tutorials via AI
│   │   ├── chatai.ts       # AI chat embedding and vector search logic
│   │   ├── github.ts       # Utilities for downloading and parsing GitHub repos
│   │   ├── octokit.ts      # GitHub API helpers for commit analysis
│   │   └── prompt.ts       # The master prompt for AI tutorial generation
│   ├── server/
│   │   ├── api/
│   │   │   ├── root.ts     # Root tRPC router
│   │   │   └── routers/    # tRPC router definitions (e.g., project.ts)
│   │   ├── db.ts           # Prisma client instance
│   │   └── ...
│   ├── trpc/               # Client-side tRPC setup
│   │   ├── react.tsx       # tRPC provider for React
│   │   └── server.ts       # tRPC helpers for Server Components
│   ├── env.js              # Environment variable validation (T3 Env)
│   └── middleware.ts       # Clerk authentication middleware
├── next.config.js          # Next.js configuration
└── tailwind.config.ts      # Tailwind CSS configuration
```


## 2. API Reference


The application uses a combination of tRPC for its primary, typesafe API and standard Next.js API Routes for webhooks and streaming chat.


### tRPC API (`/api/trpc`)


All tRPC procedures are protected and require user authentication unless specified otherwise.


#### `project` Router



##### `mutation: createRepo`


Analyzes a GitHub repository, generates a tutorial using AI, and saves it to the database. This is the core function of the application.

* **Input**:
    ```typescript
    {
      githubUrl: string; // Valid GitHub repository URL
      accessToken: string; // GitHub personal access token
    }
    ```
* **Output**:
    ```typescript
    {
      repo: Repo;
      tutorial: Tutorial;
      message: string;
    }
    ```
* **Errors**:
    *   `UNAUTHORIZED`: User is not logged in.
    *   `PAYMENT_REQUIRED`: User has exceeded their plan's tutorial limit.
    *   `CONFLICT`: A repository with this URL already exists for the user.
    *   `PARSE_ERROR`: The AI service returned invalid or malformed JSON.
    *   `INTERNAL_SERVER_ERROR`: A generic error occurred during processing.


##### `query: getRepos`


Fetches all repositories and their associated tutorials for the authenticated user.

* **Input**: `void`
* **Output**:
    ```typescript
    Array<{
      id: string;
      name: string;
      githubUrl: string;
      createdAt: Date;
      tutorials: Array<{ id: string; title: string; createdAt: Date }>;
    }>
    ```


##### `query: getTutorialById`


Retrieves a single tutorial, its chapters, and associated chat sessions.

* **Input**: `{ tutorialId: string }`
* **Output**: A detailed `Tutorial` object including nested `chapters`, `subChapters`, and `chatSessions`.

---


### REST API



#### `POST /api/chat/ai`


Handles the real-time AI chat with a user. It finds relevant code context from the database, constructs a prompt for the AI, and streams the response back to the client.

**Authentication:** Required (implicit via session)

**Request:**

* **Body**:
    ```json
    {
      "messages": [
        {
          "id": "string",
          "role": "user" | "assistant",
          "parts": [{ "type": "text", "text": "string" }]
        }
      ],
      "chatId": "string",
      "tutorialId": "string"
    }
    ```

**Response (Streaming):**
A stream of UI message events consumable by the `@ai-sdk/react` hook.

**Possible Errors:**
* `404`: Chat session not found.
* `500`: Failed to process the chat request.

---


#### `POST /api/chat/new-chat`


Creates a new, empty chat session associated with a tutorial.

**Authentication:** Required (implicit via session)

**Request:**

* **Body**:
    ```json
    {
      "tutorialId": "string"
    }
    ```

**Response (201):**
```json
{
  "id": "clx...",
  "title": "Untitled Chat",
  "tutorialId": "clx...",
  "userId": null,
  "isActive": true,
  "createdAt": "2024-...",
  "updatedAt": "2024-..."
}
```

**Possible Errors:**
* `400`: `tutorialId` is missing.
* `500`: Failed to create the chat session.

---


#### `POST /api/webhooks/clerk`


Webhook endpoint for Clerk to sync user data. It handles `user.created` and `user.updated` events to keep the local `User` table in sync. This is an internal endpoint secured by Clerk's webhook verification.


## 3. Database & Data Models


Codelet uses PostgreSQL as its database, with Prisma as the Object-Relational Mapper (ORM).


### Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    USER ||--o{ REPO : creates
    REPO ||--o{ TUTORIAL : has
    TUTORIAL ||--o{ CHAPTER : contains
    TUTORIAL ||--o{ CHAT_SESSION : has
    TUTORIAL ||--o{ SOURCE_CODE_EMBEDDING : has
    CHAPTER ||--o{ SUB_CHAPTER : contains
    SUB_CHAPTER ||--o{ CODE_SNIPPET : contains
    CHAT_SESSION ||--o{ CHAT_MESSAGE : has
    CHAT_MESSAGE ||--o| AI_ANSWER : has

    USER {
        string id PK
        string email
        string firstName
        string lastName
        string image
    }

    REPO {
        string id PK
        string name
        string githubUrl
        string accessToken
        string userId FK
    }

    TUTORIAL {
        string id PK
        string title
        string description
        string repoId FK
    }

    CHAPTER {
        string id PK
        int chapterNumber
        string title
        string tutorialId FK
    }

    SUB_CHAPTER {
        string id PK
        string subChapterTitle
        string explanation
        string diagram
        string chapterId FK
    }

    CODE_SNIPPET {
        string id PK
        string fileRef
        string sourceCode
        string language
        string subChapterId FK
    }

    SOURCE_CODE_EMBEDDING {
        string id PK
        string fileName
        string summary
        string sourceCode
        vector summaryEmbedding
        string tutorialId FK
    }

    CHAT_SESSION {
        string id PK
        string title
        boolean isActive
        string tutorialId FK
    }

    CHAT_MESSAGE {
        string id PK
        string role
        string content
        string chatId FK
    }
```


### Key Models


* **User**: Stores user information synced from Clerk.
* **Repo**: Represents a GitHub repository added by a user.
* **Tutorial**: The main AI-generated content for a repository.
* **Chapter & SubChapter**: The hierarchical structure of a tutorial.
* **CodeSnippet**: Code blocks with file references associated with a sub-chapter.
* **SourceCodeEmbedding**: Stores summaries and vector embeddings of source code files, used by the AI chat for context retrieval.
* **ChatSession & ChatMessage**: Stores the history of AI chat conversations.


## 4. Core Components & Functions



### Frontend Components



#### `RepoForm`

**Location:** `src/components/RepoForm.tsx`
**Purpose:** A client-side component that provides a form for users to submit a GitHub repository URL and a personal access token. It uses `react-hook-form` for form management and `zod` for validation. On submission, it calls the `createRepo` tRPC mutation.

**Props:** None.

**Usage:**
```tsx
import { RepoForm } from '@/components/RepoForm';

<RepoForm />
```

---


#### `ChapterPageClient`

**Location:** `src/app/(main)/dashboard/tutorial/[tutorialId]/chapter/[chapterId]/ChapterPageClient.tsx`
**Purpose:** Renders the content of a single tutorial chapter. It fetches chapter data using the `getChapter` tRPC query and displays the explanation, code snippets, and Mermaid diagrams using the `ChapterContent` component.

**Props:**
```typescript
interface ChapterPageClientProps {
  chapterId: string;
  userId: string;
}
```

**Usage:**
```tsx
<ChapterPageClient chapterId="some-chapter-id" userId="user-id" />
```

---


#### `ChatClient`

**Location:** `src/components/tutorial/ChatClient.tsx`
**Purpose:** The main interface for the AI chat. It uses the `@ai-sdk/react` `useChat` hook to handle streaming responses from the `/api/chat/ai` endpoint. It also fetches previous chat history using tRPC and allows users to create new chat sessions.

**Props:** None.

---


### Backend Functions



#### `generateTutorial()`

**Location:** `src/lib/ai.ts`
**Purpose:** Orchestrates the entire AI tutorial generation process. It downloads and analyzes a GitHub repository, identifies important files, constructs a detailed prompt, sends it to the Google Gemini API, and parses the JSON response.

**Signature:**
```typescript
async function generateTutorial(
  githubUrl: string,
  accessToken: string
): Promise<any>
```

**Parameters:**
* `githubUrl` (string): The URL of the GitHub repository.
* `accessToken` (string): A GitHub personal access token for API access.

**Returns:** `Promise<any>` - A promise that resolves to the parsed JSON object representing the generated tutorial.

---


#### `processRepositoryEmbeddings()`

**Location:** `src/lib/chatai.ts`
**Purpose:** A background task-like function that processes a repository's source code files. For each file, it generates a summary and a vector embedding using the Gemini API, then stores them in the `SourceCodeEmbedding` table. This data is crucial for the AI chat's context retrieval.

**Signature:**
```typescript
async function processRepositoryEmbeddings(
  repoUrl: string,
  accessToken: string,
  tutorialId: string
): Promise<void>
```


## 5. Configuration & Setup



### Environment Variables


Create a `.env` file in the project root with the following variables:
```env
# Database

# Example for local Docker setup:
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"


# Clerk Authentication (get from clerk.com dashboard)

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up


# Google Gemini AI (get from Google AI Studio)

GEMINI_API_KEY=AIza...


# Node Environment

NODE_ENV=development
```


### Configuration Files


* **`next.config.js`**: Standard Next.js config. Notably, it disables ESLint and TypeScript errors during builds for faster iteration.
* **`tsconfig.json`**: TypeScript configuration, including path aliases like `@/*` for easier imports.
* **`prisma/schema.prisma`**: Defines the database models, relations, and the vector extension for PostgreSQL (`pgvector`).


## 6. Authentication


Authentication is managed by **Clerk**.

* **Middleware**: `src/middleware.ts` uses `clerkMiddleware` to protect all routes by default, except for explicitly public routes like the landing page and sign-in/sign-up pages.
* **User Sync**: The `/api/webhooks/clerk` endpoint listens for events from Clerk. When a user is created or updated in Clerk, this webhook fires to create or update the corresponding record in the local `User` table in the PostgreSQL database.
* **UI Components**: Clerk's pre-built components like `<SignIn />`, `<SignUp />`, and `<UserButton />` are used in the frontend for a seamless authentication experience.
* **Backend Auth**: Protected tRPC procedures use `enforceClerkUserIsAuthed` middleware (`src/server/api/trpc.ts`), which checks for a valid Clerk session (`auth()`) before allowing the procedure to execute.


## 7. Troubleshooting



### Common Errors


* **AI Tutorial Generation Fails**:
    *   **Cause**: Invalid GitHub URL, expired or incorrect GitHub access token, or malformed JSON from the AI.
    *   **Solution**: Verify the GitHub URL and token. Check the server logs for "Zod validation errors" or "JSON parsing error," which indicate a problem with the AI's response format.
* **Max Tutorials Reached**:
    *   **Cause**: The free plan is limited to 3 tutorials per user.
    *   **Error Message**: "You have reached the maximum number of tutorials for this plan."
* **Chat is Not Context-Aware**:
    *   **Cause**: The background embedding process (`processRepositoryEmbeddings`) may have failed or not completed.
    *   **Solution**: Check the server logs for errors during the embedding process. Ensure the `SourceCodeEmbedding` table in the database is populated for the given tutorial.
