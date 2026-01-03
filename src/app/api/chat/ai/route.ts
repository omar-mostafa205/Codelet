/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { generateEmbedding } from '@/lib/chatai';
import { db } from '@/server/db';
import { convertToModelMessages, streamText, type UIMessage } from 'ai';
import { google } from '@ai-sdk/google';
import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';

const aiModel = google("gemini-2.0-flash");

const LANGUAGE_MAP: Record<string, string> = {
  'ts': 'TypeScript',
  'tsx': 'TypeScript (React)',
  'js': 'JavaScript',
  'jsx': 'JavaScript (React)',
  'py': 'Python',
  'java': 'Java',
  'go': 'Go',
  'rs': 'Rust',
  'cpp': 'C++',
  'c': 'C',
  'cs': 'C#',
  'rb': 'Ruby',
  'php': 'PHP',
  'swift': 'Swift',
  'kt': 'Kotlin',
  'vue': 'Vue',
  'svelte': 'Svelte',
  'html': 'HTML',
  'css': 'CSS',
  'scss': 'SCSS',
  'json': 'JSON',
  'yaml': 'YAML',
  'yml': 'YAML',
  'md': 'Markdown',
  'sql': 'SQL',
  'prisma': 'Prisma',
};

async function getProjectOverview(tutorialId: string) {
  const allFiles = await db.sourceCodeEmbedding.findMany({
    where: { tutorialId },
    select: { fileName: true, summary: true },
  });

  if (allFiles.length === 0) {
    return { overview: "No code files found for this project.", fileCount: 0, languages: [] };
  }

  const extensionCounts: Record<string, number> = {};
  allFiles.forEach(file => {
    const ext = file.fileName.split('.').pop()?.toLowerCase();
    if (ext) {
      extensionCounts[ext] = (extensionCounts[ext] || 0) + 1;
    }
  });

  const languages = [...new Set(
    Object.keys(extensionCounts)
      .map(ext => LANGUAGE_MAP[ext])
      .filter(Boolean)
  )];

  const overview = `
## Project Overview
- **Total files indexed:** ${allFiles.length}
- **Languages detected:** ${languages.length > 0 ? languages.join(', ') : 'Unknown'}
- **File types:** ${Object.entries(extensionCounts).map(([ext, count]) => `.${ext} (${count})`).join(', ')}

## File Structure (sample):
${allFiles.slice(0, 15).map(f => `- ${f.fileName}`).join('\n')}
${allFiles.length > 15 ? `\n... and ${allFiles.length - 15} more files` : ''}

## File Summaries:
${allFiles.slice(0, 10).map(f => `- **${f.fileName}**: ${f.summary?.slice(0, 100) || 'No summary'}...`).join('\n')}
`;

  return { overview, fileCount: allFiles.length, languages };
}

export const POST = async (request: Request) => {
  try {
    const user = await currentUser();
    const { messages, chatId, tutorialId }: { messages: UIMessage[], chatId: string, tutorialId: string } = await request.json();
    
    console.log("Chat ID:", chatId);
    
    const userMessages = messages.filter(message => message.role === "user");
    const latestUserMessage = userMessages.at(-1);
    const first = userMessages[0];
    
    const messageText = latestUserMessage?.parts
      ?.filter((part) => part.type === "text")
      ?.map((part) => part.text)
      ?.join(" ") || "";

    // Save user message
    await db.chatMessage.create({
      data: {
        role: 'USER',
        content: messageText,
        chatId: chatId
      }
    });

    if (userMessages.length === 1) {
      await db.chatSession.upsert({
        where: { id: chatId },
        update: {
          title: first?.parts?.find((part) => part.type === "text")?.text?.slice(0, 50) || "Chat",
        },
        create: {
          id: chatId,
          title: first?.parts?.find((part) => part.type === "text")?.text?.slice(0, 50) || "Chat",
          tutorialId: tutorialId,
          isActive: true,
        },
      });
    }

    const chatSession = await db.chatSession.findUnique({
      where: { id: chatId },
      select: { tutorialId: true }
    });

    if (!chatSession) {
      return NextResponse.json({ error: "Chat session not found" }, { status: 404 });
    }

    const { overview: projectOverview, fileCount, languages } = await getProjectOverview(chatSession.tutorialId);

    const queryVector = await generateEmbedding(messageText);
    
    const relevantCode = await db.$queryRaw`
      SELECT "fileName", "summary", "sourceCode",
      1-("summaryEmbedding" <=> ${queryVector}::vector) AS similarity
      FROM "SourceCodeEmbedding"
      WHERE "tutorialId" = ${chatSession.tutorialId}
      ORDER BY 1-("summaryEmbedding" <=> ${queryVector}::vector) DESC
      LIMIT 10
    ` as { fileName: string; sourceCode: string; summary: string; similarity: number }[];

    console.log(`Found ${relevantCode.length} relevant files`);
    console.log("Top matches:", relevantCode.slice(0, 3).map(r => `${r.fileName}: ${r.similarity.toFixed(3)}`));

    // Build code context
    let codeContext = '';
    if (relevantCode.length > 0) {
      for (const doc of relevantCode) {
        codeContext += `
### File: ${doc.fileName}
**Relevance Score:** ${(doc.similarity * 100).toFixed(1)}%
**Summary:** ${doc.summary}
**Source Code:**
\`\`\`
${doc.sourceCode.slice(0, 2000)}
\`\`\`

`;
      }
    } else {
      codeContext = "No specific code snippets were found matching your query.";
    }

    const prompt = `You are a helpful AI assistant that answers questions about a specific codebase. You have been given access to the project's source code and documentation.

## CRITICAL RULES:
1. ONLY answer based on the code and project information provided below
2. If the provided context contains the answer, give a clear, helpful response
3. If the context does NOT contain enough information, say: "Based on the code I have access to, I cannot find specific information about [topic]. However, from the project overview, I can see [relevant info]."
4. NEVER make up code, files, or functionality that isn't shown in the context
5. For general questions like "what language is used", refer to the Project Overview section
6. Reference specific files when answering (e.g., "In src/index.ts, we can see...")

${projectOverview}

## Relevant Code Snippets:
${codeContext}

## User Question:
${messageText}

## How to Answer:
1. First check if the Project Overview answers the question (for general questions)
2. Then check the Relevant Code Snippets for specific implementation details
3. Provide a clear, structured answer with:
   - Direct answer to the question
   - Code examples from the context (if relevant)
   - File references
   - Mermaid diagrams (if helpful for explanation)

## Mermaid Diagram Rules (if you include diagrams):
- ER diagrams: Use lowercase types (string, int, boolean, datetime)
- Use simple syntax: "fieldName datatype PK" not complex constraints
- flowchart/sequenceDiagram for processes and interactions

Answer the user's question now:`;

    const promptMessage: UIMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      parts: [{ type: 'text', text: prompt }]
    };

    const response = await streamText({
      model: aiModel,
      messages: convertToModelMessages([...messages, promptMessage]),
      temperature: 0.3, 
      onFinish: async (result) => {
        try {
          const aiMessage = await db.chatMessage.create({
            data: {
              role: 'ASSISTANT',
              content: result.text,
              chatId: chatId
            }
          });

          await db.aiAnswer.create({
            data: {
              explanation: result.text,
              fileRef: relevantCode.slice(0, 5).map(r => r.fileName),
              chatMessageId: aiMessage.id
            }
          });
        } catch (error) {
          console.error('Failed to save AI message:', error);
        }
      }
    });

    return response.toUIMessageStreamResponse();
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: "Failed to create chat" }, { status: 500 });
  }
};