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


const aiModel = google("gemma-3-12b-it");
export const POST = async (request: Request)  => {
    try {
        const user = await currentUser();
        const { messages, chatId , tutorialId}: { messages: UIMessage[], chatId: string  , tutorialId: string} = await request.json();
        console.log("the Caht ID", chatId);
        const userMessages = messages.filter(message => message.role === "user");
        const latestUserMessage = userMessages.at(-1);
        const first = userMessages[0]
        const messageText = latestUserMessage?.parts
            ?.filter((part) => part.type === "text")
            ?.map((part) => part.text)
            ?.join(" ") || "";
        const savedUserMessage = await db.chatMessage.create({
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
                title: first?.parts?.find((part) => part.type === "text")?.text || "Chat",
              },
              create: {
                id: chatId,
                title: first?.parts?.find((part) => part.type === "text")?.text || "Chat",
                tutorialId: tutorialId, 
                isActive: true, 
              },
            });
          }
    

        const queryVector = await generateEmbedding(messageText);
        const chatSession = await db.chatSession.findUnique({
            where: { id: chatId },
            select: { tutorialId: true }
        });

        if (!chatSession) {
            return NextResponse.json({ error: "Chat session not found" }, { status: 404 });
        }

        const result = await db.$queryRaw`
            SELECT "fileName", "summary", "sourceCode",
            1-("summaryEmbedding" <=> ${queryVector}::vector) AS similarity
            FROM "SourceCodeEmbedding"
            WHERE 1-("summaryEmbedding" <=> ${queryVector}::vector) > 0.5
            AND "tutorialId" = ${chatSession.tutorialId}
            ORDER BY similarity DESC
            LIMIT 10
        ` as {fileName: string; sourceCode: string; summary: string; similarity: number}[];
        
        let content = '';
        for (const doc of result) {
            content += `source: ${doc.fileName}\ncode content: ${doc.sourceCode}\nsummary of file: ${doc.summary}\n\n`;
        }
        const prompt = `You are a world-class senior software engineer and technical mentor with expertise in modern development practices. You specialize in providing comprehensive, educational, and actionable responses that rival the best AI coding assistants 
        If you don't know the answer or it has no relvancy say "I am sorry, I don't have enough  information please provide more context" JUST THAT .

        CORE PRINCIPLES:
        - Be thorough but concise - every word should add value
        - Provide complete, production-ready solutions
        - Always include visual diagrams using Mermaid syntax
        - Structure responses for maximum readability and understanding
        - Focus on teaching principles, not just showing code
        - Consider performance, security, and maintainability in every response
        
        QUESTION:
        ${latestUserMessage?.parts?.filter((part) => part.type === "text").map((part) => part.text).join(" ")}
        
        CONTEXT:
        ${content}
        
        ## Response Structure
        - Always provide complete, working code examples when relevant
        - Include visual diagrams using mermaid syntax when explaining concepts
        - Use step-by-step explanations with clear numbered steps
        - Provide multiple approaches when applicable
        - Include error handling and best practices in all code examples
        
        ## Code Standards
        - Use modern syntax and current best practices
        - Include proper imports and dependencies
        - Add comprehensive comments explaining logic
        - Provide complete, runnable examples (not snippets)
        - Include TypeScript types when applicable
        
        ## Visual Elements - MERMAID SYNTAX REQUIREMENTS
        When creating Mermaid diagrams, STRICTLY follow these rules:
        
        ### For ER Diagrams:
        - Use lowercase data types ONLY: string, boolean, datetime, json, int (NEVER String, Boolean, DateTime, Json)
        - Use simple constraint syntax: "fieldName datatype PK" or "fieldName datatype FK"
        - DO NOT use optional syntax like "String?" - just use "string"
        - DO NOT use complex constraint descriptions like 'PK "UUID"' - just use "PK"
        - DO NOT use complex FK references like 'FK "references User.id"' - just use "FK"
        - Use proper relationship syntax: EntityA ||--o{ EntityB : "relationship_name"
        
        CORRECT ER Diagram Example:
        \`\`\`mermaid
        erDiagram
            User {
                string id PK
                string email
                string name
                datetime createdAt
            }
            Profile {
                string id PK
                string userId FK
                string subscriptionTier
                boolean isActive
                json preferences
            }
            User ||--o{ Profile : "has"
        \`\`\`
        
        ### For Other Diagrams:
        - flowchart: Use for process flows, user journeys
        - sequenceDiagram: Use for API calls, interactions
        - classDiagram: Use for code structure, inheritance
        - gitgraph: Use for branching strategies
        
        ## Response Format
        Always structure responses with:
        1. Quick Answer (1-2 sentences)
        2. Implementation (complete code with comments)
        3. Step-by-step explanation
        4. Mermaid diagram when applicable (following the syntax rules above)
        CRITICAL: When creating ER diagrams, always use lowercase data types and simple syntax as shown in the example above.`;

        const promptMessage: UIMessage = {
            id: crypto.randomUUID(),
            role: 'user',
            parts: [
                {
                    type: 'text',
                    text: prompt
                }
            ]
        };

        const response = await streamText({
            model: aiModel,
            messages: convertToModelMessages([
                ...messages,
                promptMessage
            ]),
            temperature: 0.1,
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
                            fileRef: [],
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