# API Reference Documentation


## Overview


**Technology Stack:**
* **Web Framework:** Next.js (App Router)
* **API Framework:** tRPC
* **Database ORM:** Prisma
* **Authentication:** Clerk
* **Validation:** Zod
* **Language:** TypeScript
* **AI/LLM:** Google Generative AI (Gemini), AI SDK

**Summary:**
This API generates educational tutorials from public or private GitHub repositories. It uses an AI model to analyze the codebase, structure it into chapters, and create explanations. The system also provides an AI-powered chat interface that allows users to ask questions about the generated tutorial and underlying codebase, using embeddings for context-aware answers. User and repository data is managed through a PostgreSQL database via Prisma, with user authentication handled by Clerk.

---


## Authentication



### Authentication Method


**Type Detected:** JWT-based via Clerk

**Implementation Location:** `omar-mostafa205-Codelet-35f04ad/src/middleware.ts`

**How Authentication Works:**
The application uses Clerk for authentication. A global middleware intercepts all incoming requests. It distinguishes between public and protected routes using a route matcher. For protected routes, it validates the Clerk-issued JWT.

For tRPC procedures, an additional middleware layer (`enforceClerkUserIsAuthed`) ensures that a valid `userId` is present in the session context before allowing the procedure to execute. This protects all sensitive backend operations.

**Code Reference:**
* **Global Middleware:**
    ```typescript
    // omar-mostafa205-Codelet-35f04ad/src/middleware.ts
    import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

    const isPublicRoute = createRouteMatcher([
      '/sign-in(.*)',
      '/sign-up(.*)',
      '/',
      '/api/public(.*)',
    ]);

    export default clerkMiddleware((auth, req) => {
      if (!isPublicRoute(req)) {
        auth().protect();
      }
    });
    ```
* **tRPC Protection Middleware:**
    ```typescript
    // omar-mostafa205-Codelet-35f04ad/src/server/api/trpc.ts
    const enforceClerkUserIsAuthed = t.middleware(async ({ ctx, next }) => {
      const {userId}  = await auth()
       console.log(userId)

      if (!userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      return next({
        ctx: {
          ...ctx,
          userId : userId

        },
      });
    });

    export const ProtectedProcedure = t.procedure.use(enforceClerkUserIsAuthed);
    ```


### Authentication Flow


User data is synchronized from Clerk to the local application database via a webhook.

**User Sync Webhook:** `POST /api/webhooks/clerk`

This endpoint listens for `user.created` and `user.updated` events from Clerk. When an event is received, it verifies the webhook signature and then creates or updates the user record in the local `User` table. This ensures the application's user data is consistent with Clerk's.

**Code Reference:**
```typescript
// omar-mostafa205-Codelet-35f04ad/src/app/api/webhooks/clerk/route.ts
import { db } from "@/server/db";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextResponse, type NextRequest } from "next/server";

export const POST = async (request: NextRequest ) => {
    try {
        const event = await verifyWebhook(request)
        switch (event.type) {
            case "user.created":
            case "user.updated":
            const data = event.data
            const email = data.email_addresses.find(
                e => e.id === data.primary_email_address_id
              )?.email_address
              const createUpdateUser = await db.user.upsert({
                where: { id: data.id },
                update: {
                    email : email,
                  firstName: data.first_name || "",
                  lastName: data.last_name || "",
                  image: data.image_url,
                },
                create: {
                  id: data.id,
                    email : email || " ",
                  firstName: data.first_name || "",
                  lastName: data.last_name || "",
                  image: data.image_url,
                },
              });
              break

            }
            return NextResponse.json({success : true} , {status : 200 })

        } catch (error) {
            console.error('Webhook error:', error);
            return new Response("Invalid webhook", { status: 400 })
          }
}
```

---


## API Endpoints


This section documents standard REST-like endpoints. For tRPC procedures, see the **tRPC API Procedures** section.


### Chat Endpoints



#### `POST /api/chat/ai`


**Source:** `omar-mostafa205-Codelet-35f04ad/src/app/api/chat/ai/route.ts`

**Description:** Main endpoint for the AI chat functionality. It receives user messages, generates a vector embedding for the latest message, and queries the database for relevant code context. It then streams a response from a Google AI model, providing an answer based on the user's question and the retrieved context. After the stream is complete, it saves the user's message and the AI's response to the database.

**Authentication Required:** Yes (Handled by global Clerk middleware)

**Route Handler:**
```typescript
// omar-mostafa205-Codelet-35f04ad/src/app/api/chat/ai/route.ts
export const POST = async (request: Request)  => {
    try {
        const user = await currentUser();
        const { messages, chatId , tutorialId}: { messages: UIMessage[], chatId: string  , tutorialId: string} = await request.json();
        // ... handler logic
    }
    // ... error handling
}
```

**Request Body Schema:**
The request body is expected to be a JSON object with the following structure.
```typescript
// Type inferred from omar-mostafa205-Codelet-35f04ad/src/app/api/chat/ai/route.ts:18
{
  "messages": UIMessage[], // From 'ai' package
  "chatId": string,
  "tutorialId": string
}
```

**Response Schema:**
The endpoint returns a streaming response compatible with the Vercel AI SDK (`response.toUIMessageStreamResponse()`).

**Error Responses:** | Status Code | Condition | Response |
|-------------|-----------------------------------------|------------------------------------|
| 404 | The specified `chatId` does not exist. | `{ "error": "Chat session not found" }` |
| 500 | Any other internal server error. | `{ "error": "Failed to create chat" }` | **Error Handling Code:**
```typescript
// omar-mostafa205-Codelet-35f04ad/src/app/api/chat/ai/route.ts
if (!chatSession) {
    return NextResponse.json({ error: "Chat session not found" }, { status: 404 });
}

// ...

} catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: "Failed to create chat" }, { status: 500 });
}
```

**Database Operations:**
* **Writes to:** `ChatMessage`, `ChatSession`, `AiAnswer`
* **Reads from:** `ChatSession`, `SourceCodeEmbedding` (via raw SQL query with vector search)

**Side Effects:**
* Calls the Google Generative AI API (`gemma-3-12b-it` model) to stream a response.
* Generates vector embeddings for user messages.


#### `POST /api/chat/new-chat`


**Source:** `omar-mostafa205-Codelet-35f04ad/src/app/api/chat/new-chat/route.ts`

**Description:** Creates a new, empty chat session associated with a specific tutorial.

**Authentication Required:** Yes (Handled by global Clerk middleware)

**Route Handler:**
```typescript
// omar-mostafa205-Codelet-35f04ad/src/app/api/chat/new-chat/route.ts
export const POST = async (request: Request) => {
  try {
    const body = await request.json()
    const tutorialId = body.tutorialId
    // ... handler logic
  }
}
```

**Request Body Schema:**
```json
{
  "tutorialId": "string"
}
```

**Success Response Example:**
A successful request returns the newly created `ChatSession` object with status `201 Created`.
```json
{
  "id": "clx...",
  "title": "New Chat",
  "tutorialId": "clx...",
  "isActive": true,
  "createdAt": "2023-10-27T10:00:00.000Z",
  "updatedAt": "2023-10-27T10:00:00.000Z"
}
```

**Error Responses:** | Status Code | Condition | Response |
|-------------|-----------------------------------|-----------------------------------------|
| 400 | `tutorialId` is missing from the body. | `{ "error": "tutorialId is required" }` |
| 500 | Any other internal server error. | `{ "error": "Failed to create chat" }` | **Database Operations:**
* **Writes to:** `ChatSession`

---


## tRPC API Procedures


All procedures under the `project` router are protected and require an authenticated user. The router is defined in `omar-mostafa205-Codelet-35f04ad/src/server/api/root.ts`.


### `project` Router



#### `mutation: project.createRepo`


**Source:** `omar-mostafa205-Codelet-35f04ad/src/server/api/routers/project.ts:42`

**Description:** This is a critical and complex mutation that orchestrates the entire tutorial generation process. It takes a GitHub repository URL and an access token, generates a tutorial using an AI model, persists the entire nested structure to the database, and then kicks off a background process to create vector embeddings for the repository's code.

**Authentication Required:** Yes

**Implementation:**
```typescript
// omar-mostafa205-Codelet-35f04ad/src/server/api/routers/project.ts
createRepo: ProtectedProcedure.input(
  z.object({
    githubUrl: z
      .string()
      .url("Please provide a valid URL")
      .regex(
        /^https:\/\/github\.com\//,
        "Must be a valid GitHub repository URL"
      ),
    accessToken: z.string().min(1, "Access token is required"),
  })
).mutation(async ({ ctx, input }) => {
  // ... full implementation
})
```

**Request Body Schema:**
```typescript
// From Zod schema in omar-mostafa205-Codelet-35f04ad/src/server/api/routers/project.ts
z.object({
  githubUrl: z
    .string()
    .url("Please provide a valid URL")
    .regex(
      /^https:\/\/github\.com\//,
      "Must be a valid GitHub repository URL"
    ),
  accessToken: z.string().min(1, "Access token is required"),
})
```

**Database Operations:**
* **Writes to:** `Repo`, `Tutorial`, `Chapter`, `SubChapter`, `CodeSnippet`. This is a large, nested transaction.
* **Reads from:** `User`, `Tutorial`, `Repo`

**Side Effects:**
* Calls `generateTutorial()` from `src/lib/ai.ts`, which in turn calls a Google Generative AI model.
* Calls `processRepositoryEmbeddings()` from `src/lib/chatai.ts` to start the background embedding process after the tutorial is created.
* Revalidates Next.js cache tags (`user-${ctx.userId}-repos`, `user-${ctx.userId}-chapters`).

**Error Handling:**
This procedure has extensive error handling for various failure modes:
* `UNAUTHORIZED`: If `ctx.userId` is missing.
* `NOT_FOUND`: If the user record doesn't exist in the local database.
* `PAYMENT_REQUIRED`: If the user has reached their tutorial limit (hardcoded at 3).
* `PARSE_ERROR`: If the AI response is not valid JSON or fails Zod schema validation.
* `CONFLICT`: If a repository with the same URL already exists for the user.
* `INTERNAL_SERVER_ERROR`: For any other uncaught exceptions.


#### `query: project.getRepos`


**Source:** `omar-mostafa205-Codelet-35f04ad/src/server/api/routers/project.ts:211`

**Description:** Fetches all repositories associated with the currently authenticated user, including a list of their tutorials. The result is cached for 5 minutes.

**Authentication Required:** Yes

**Response Schema:**
Returns an array of `Repo` objects with nested `Tutorial` summaries.


#### `query: project.getTutorialById`


**Source:** `omar-mostafa205-Codelet-35f04ad/src/server/api/routers/project.ts:248`

**Description:** Fetches a single tutorial by its ID, including all its chapters, sub-chapters, and active chat sessions.

**Authentication Required:** Yes

**Request Body Schema:**
```typescript
z.object({ tutorialId: z.string() })
```


#### `query: project.getChapters`


**Source:** `omar-mostafa205-Codelet-35f04ad/src/server/api/routers/project.ts:341`

**Description:** Fetches all chapters for a given tutorial ID. The result is cached for 10 minutes.

**Authentication Required:** Yes

**Request Body Schema:**
```typescript
z.object({
  tutorialId: z.string().min(1, "Tutorial ID is required"),
})
```


#### `query: project.getChapter`


**Source:** `omar-mostafa205-Codelet-35f04ad/src/server/api/routers/project.ts:377`

**Description:** Fetches a single chapter by its ID, including its nested sub-chapters and code snippets. The result is cached for 15 minutes.

**Authentication Required:** Yes

**Request Body Schema:**
```typescript
z.object({
  chapterId: z.string().min(1, "Chapter ID is required"),
})
```


#### Other `project` Queries

* `getRepoById`: Fetches a single repo by ID.
* `getChatSessions`: Fetches all chat sessions for a tutorial.
* `getLatestTutorials`: Fetches all tutorials for a given repo ID.
* `getChatMessages`: Fetches all messages for a given chat session ID.


### `post` Router

This router appears to be a placeholder or example and is not directly related to the core application logic.


#### `query: post.hello`

**Source:** `omar-mostafa205-Codelet-35f04ad/src/server/api/routers/post.ts:6`
A simple public query for testing.


#### `mutation: post.create`

**Source:** `omar-mostafa205-Codelet-35f04ad/src/server/api/routers/post.ts:13`
A public mutation to create a `Post` record.


#### `query: post.getLatest`

**Source:** `omar-mostafa205-Codelet-35f04ad/src/server/api/routers/post.ts:23`
A public query to get the most recent `Post`.

---


## Data Models


⚠️ No `schema.prisma` file was found in the provided codebase. The following data models and their fields are inferred from Prisma Client usage within the API routes and tRPC procedures.


### `User`

**Inferred Source:** `omar-mostafa205-Codelet-35f04ad/src/app/api/webhooks/clerk/route.ts`
**Description:** Stores user information synchronized from Clerk.

**Inferred Field Details:**
| Field | Type | Required | Notes |
|-------------|--------|----------|-------------------------------------|
| `id` | String | Yes | Primary Key, corresponds to Clerk ID. |
| `email` | String | Yes | |
| `firstName` | String | No | |
| `lastName` | String | No | |
| `image` | String | No | URL to the user's profile image. | ### `Repo`
**Inferred Source:** `omar-mostafa205-Codelet-35f04ad/src/server/api/routers/project.ts`
**Description:** Represents a GitHub repository that a user has submitted.

**Inferred Field Details:**
| Field | Type | Required | Notes |
|---------------|--------|----------|-----------------------------|
| `id` | String | Yes | Primary Key. |
| `name` | String | Yes | Name of the repository. |
| `githubUrl` | String | Yes | Full URL to the repository. |
| `accessToken` | String | Yes | User-provided GitHub token. |
| `userId` | String | Yes | Foreign key to `User`. |
| `createdAt` | DateTime| Yes | Auto-generated timestamp. | **Inferred Relationships:**
| Field | Relationship | Target Model |
|-------------|---------------|--------------|
| `userId` | Many-to-One | `User` |
| `tutorials` | One-to-Many | `Tutorial` | ### `Tutorial`
**Inferred Source:** `omar-mostafa205-Codelet-35f04ad/src/server/api/routers/project.ts`
**Description:** Represents a single generated tutorial for a repository.

**Inferred Field Details:**
| Field | Type | Required | Notes |
|---------------|--------|----------|-------------------------|
| `id` | String | Yes | Primary Key. |
| `title` | String | Yes | AI-generated title. |
| `description` | String | No | AI-generated description. |
| `repository` | String | Yes | Name of the repository. |
| `repoId` | String | Yes | Foreign key to `Repo`. | **Inferred Relationships:**
| Field | Relationship | Target Model |
|------------|--------------|---------------|
| `repoId` | Many-to-One | `Repo` |
| `chapters` | One-to-Many | `Chapter` | ### `Chapter`, `SubChapter`, `CodeSnippet`
These models are created in a deeply nested structure within the `project.createRepo` mutation. They form the content of a `Tutorial`.
* A `Tutorial` has many `Chapters`.
* A `Chapter` has many `SubChapters`.
* A `SubChapter` has an `explanation` (String), an optional `diagram` (String), and many `CodeSnippets`.
* A `CodeSnippet` has a `fileRef` (String), `sourceCode` (String), and an optional `language` (String).


### `SourceCodeEmbedding`

**Inferred Source:** `omar-mostafa205-Codelet-35f04ad/src/app/api/chat/ai/route.ts`
**Description:** Stores code files, their AI-generated summaries, and vector embeddings for similarity search.

**Inferred Field Details:**
| Field | Type | Required | Notes |
|----------------------|------------|----------|-------------------------------------|
| `id` | String | Yes | Primary Key. |
| `fileName` | String | Yes | Path to the source file. |
| `summary` | String | Yes | AI-generated summary of the code. |
| `sourceCode` | String | Yes | The full content of the code file. |
| `embedding` | Float[] | Yes | Vector embedding of the summary. |
| `summaryEmbedding` | Vector | Yes | Database-specific vector type. |
| `tutorialId` | String | Yes | Foreign key to `Tutorial`. | ---


## Business Logic & Services



### Tutorial Generation (`ai.ts`)


**Location:** `omar-mostafa205-Codelet-35f04ad/src/lib/ai.ts`

**Purpose:** This file contains the core logic for orchestrating AI-powered tutorial generation.


#### `generateTutorial()`


**Signature:**
```typescript
export async function generateTutorial(githubUrl: string, accessToken: string): Promise<any>
```
**Implementation:**
This function first calls `getTutorialDataWithSeparation` to gather all necessary data from the GitHub repository. It then constructs a detailed prompt using `createTutorialPrompt` and sends it to the Google Generative AI model (`gemini-2.5-pro`). It performs significant cleanup and error correction on the returned JSON to ensure it is valid before returning the parsed object.

**Parameters:**
| Parameter | Type | Required | Description |
|---------------|--------|----------|------------------------------------|
| `githubUrl` | string | Yes | The URL of the GitHub repository. |
| `accessToken` | string | Yes | A GitHub token to access the repo. | **Returns:** `Promise<any>` - A promise that resolves to the parsed JSON object representing the generated tutorial.

**Dependencies:**
* `getTutorialDataWithSeparation()`
* `createTutorialPrompt()`
* Google Generative AI SDK


### Code Embedding (`chatai.ts`)


**Location:** `omar-mostafa205-Codelet-35f04ad/src/lib/chatai.ts`

**Purpose:** Handles the creation of vector embeddings for code files to be used in the AI chat.


#### `processRepositoryEmbeddings()`


**Signature:**
```typescript
export async function processRepositoryEmbeddings(repoUrl: string, accessToken: string, tutorialId: string): Promise<void>
```
**Implementation:**
This function is called as a background task. It uses `@langchain/community`'s `GithubRepoLoader` to load all relevant files from a repository. For each file, it generates a concise summary using one AI model (`gemini-2.5-pro`) and then generates a vector embedding of that summary using another (`text-embedding-004`). The file content, summary, and embedding are then stored in the `SourceCodeEmbedding` table in the database.

**Parameters:**
| Parameter | Type | Required | Description |
|---------------|--------|----------|-------------------------------------------|
| `repoUrl` | string | Yes | The URL of the GitHub repository. |
| `accessToken` | string | Yes | A GitHub token to access the repo. |
| `tutorialId` | string | Yes | The ID of the tutorial to associate with. | **Dependencies:**
* LangChain `GithubRepoLoader`
* Google Generative AI SDK
* Prisma Client (`db`)


### GitHub Processing (`github.ts`, `octokit.ts`)


**Location:** `omar-mostafa205-Codelet-35f04ad/src/lib/github.ts`, `omar-mostafa205-Codelet-35f04ad/src/lib/octokit.ts`

**Purpose:** These files contain the logic for interacting with GitHub, downloading repositories, and analyzing file importance.


#### `getImportantFiles()` (`octokit.ts`)

Uses the Octokit library to fetch commit history for a repository. It analyzes the frequency of changes, number of contributors, and recency of commits for each file to calculate an "importance score," returning a ranked list of the most significant files.


#### `processGitHubRepository()` (`github.ts`)

Downloads a repository as a zip archive, extracts it to a temporary directory, and reads the content of all relevant files, filtering out ignored file types and directories.

---


## Middleware



### Clerk Middleware


**Source:** `omar-mostafa205-Codelet-35f04ad/src/middleware.ts`

**Purpose:** Acts as the primary authentication gate for the entire application. It uses a route matcher to differentiate public routes from protected ones and enforces authentication on all non-public routes.

**Implementation:**
```typescript
// omar-mostafa205-Codelet-35f04ad/src/middleware.ts
export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) {
    auth().protect();
  }
});
```

**Applied To:** All routes not matching the `isPublicRoute` pattern.


### tRPC Authentication Middleware


**Source:** `omar-mostafa205-Codelet-35f04ad/src/server/api/trpc.ts`

**Purpose:** A tRPC-specific middleware that ensures a user is authenticated before executing a protected procedure. It extracts the `userId` from the Clerk auth context and adds it to the tRPC context (`ctx`).

**Implementation:**
```typescript
// omar-mostafa205-Codelet-35f04ad/src/server/api/trpc.ts
const enforceClerkUserIsAuthed = t.middleware(async ({ ctx, next }) => {
  const {userId}  = await auth()
  if (!userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      ...ctx,
      userId : userId
    },
  });
});
```

**Applied To:** All procedures defined with `ProtectedProcedure`, which includes the entire `project` router.

---


## Validation


**Validation Library:** Zod

**Validation Schemas:**
The API uses Zod schemas extensively for input validation in tRPC procedures and for parsing the AI model's output.


### `tutorialSchema`


**Source:** `omar-mostafa205-Codelet-35f04ad/src/server/api/routers/project.ts:28`

**Definition:**
```typescript
const tutorialSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  repository: z.string(),
  chapters: z.array(z.object({
    chapterNumber: z.number(),
    title: z.string(),
    content: chapterContentSchema, // Nested schema
  }))
});
```

**Used In:**
* `project.createRepo`: Used to parse and validate the complex JSON object returned by the tutorial generation AI.


### `createRepo` Input Schema


**Source:** `omar-mostafa205-Codelet-35f04ad/src/server/api/routers/project.ts:43`

**Definition:**
```typescript
z.object({
  githubUrl: z
    .string()
    .url("Please provide a valid URL")
    .regex(
      /^https:\/\/github\.com\//,
      "Must be a valid GitHub repository URL"
    ),
  accessToken: z.string().min(1, "Access token is required"),
})
```
**Used In:**
* `project.createRepo`: Validates the input from the client before processing.

---


## Configuration & Environment


**Environment Variables Used:** | Variable | Used In | Purpose |
|-------------------|---------------------------------------------|---------------------------------------|
| `DATABASE_URL` | `omar-mostafa205-Codelet-35f04ad/src/env.js` | Connection string for the PostgreSQL database. |
| `NODE_ENV` | `omar-mostafa205-Codelet-35f04ad/src/env.js` | Sets the application environment (development, production). |
| `GEMINI_API_KEY` | `omar-mostafa205-Codelet-35f04ad/src/lib/ai.ts:7`, `omar-mostafa205-Codelet-35f04ad/src/lib/chatai.ts:7` | API key for Google Generative AI services. |
| `GITHUB_ACCESS_TOKEN` | `omar-mostafa205-Codelet-35f04ad/src/lib/octokit.ts:36` | Fallback GitHub token for server-side operations. |
| `SKIP_ENV_VALIDATION` | `omar-mostafa205-Codelet-35f04ad/src/env.js` | Allows skipping environment variable validation, e.g., in Docker builds. | **Configuration Files Found:**
* `omar-mostafa205-Codelet-35f04ad/src/env.js`: Manages and validates environment variables using `@t3-oss/env-nextjs`.

---


## Dependencies


**Key Dependencies:** | Package | Version | Purpose |
|------------------------------|--------------|----------------------------------|
| `next` | `14.2.4` | Web Framework |
| `@trpc/server` | `11.0.0-rc.446` | API Framework (tRPC Core) |
| `@trpc/react-query` | `11.0.0-rc.446` | tRPC integration with React Query |
| `@prisma/client` | `5.14.0` | Database ORM |
| `@clerk/nextjs` | `5.1.6` | Authentication |
| `zod` | `3.23.3` | Validation |
| `@google/generative-ai` | `0.14.1` | AI Model Interaction |
| `ai` | `3.2.14` | Vercel AI SDK for streaming |
| `@octokit/rest` | `21.0.0` | GitHub API Client |
| `@langchain/community` | `0.2.17` | GitHub data loading for embeddings | ---


## Code Quality Notes


**TypeScript Usage:** Strict. The `tsconfig.json` specifies `"strict": true`.

**Error Handling Coverage:** The `project.createRepo` mutation has robust, specific error handling. Other tRPC procedures and API routes rely on more generic try/catch blocks or default framework error handling.

**Validation Coverage:** All tRPC procedures that accept input use Zod schemas for validation, which is a strong pattern. The REST-like endpoints in `app/api` perform manual validation or rely on type inference.

**Test Files Found:** No test files found in codebase.

---


## Limitations of This Documentation


-   Generated from static code analysis of AST.
-   Runtime behavior may differ from static analysis.
-   The exact Prisma schema is inferred from ORM calls, as `schema.prisma` was not present in the AST. Field constraints, indexes, and some relations may be missing.
-   Environment-specific configurations may not be visible.
-   This documentation only includes what exists in the provided code.

---


## Recommendations for Improvement


-   **Add Input Validation to REST Endpoints:** The `POST /api/chat/ai` and `POST /api/chat/new-chat` endpoints perform manual checks on the request body. Using Zod here would make validation more robust and consistent with the tRPC procedures.
-   **Centralize Error Handling:** Error handling is inconsistent. The `project.createRepo` mutation has detailed error handling, while others have basic error logging. A centralized tRPC error formatter or middleware could standardize error responses.
-   **Rate Limiting:** No rate-limiting implementation was found. For public-facing API endpoints and computationally expensive operations like `project.createRepo`, adding rate limiting is critical for security and stability.
