/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Document } from "@langchain/core/documents";
import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import { db } from "@/server/db";

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const embeddingModel = genAi.getGenerativeModel({ 
    model: 'text-embedding-004'
});

const codeAnalysisModel = genAi.getGenerativeModel({
    model: 'gemini-2.5-pro',
    generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 500,
    }
});

export async function processRepositoryEmbeddings(
    repoUrl: string, 
    accessToken: string, 
    tutorialId: string 
): Promise<void> {
    console.log(`Processing repository: ${repoUrl}`);
    
    const documents = await loadGitHubData(repoUrl, accessToken);
    
    const processingPromises = documents.map(async (doc, index) => {
        try {            
            const embedding = await generateEmbeddings(doc); 
            const sourceCodeEmbedding = await db.sourceCodeEmbedding.create({
                data: {
                    summary: embedding.summary,
                    fileName: embedding.fileName,
                    sourceCode: embedding.sourceCode,
                    embedding: embedding.embedding,
                    tutorialId: tutorialId
                }
            });
            await db.$executeRaw`
                UPDATE "SourceCodeEmbedding" 
                SET "summaryEmbedding" = ${embedding.embedding}::vector 
                WHERE "id" = ${sourceCodeEmbedding.id};
            `;
            
            console.log(`Successfully processed: ${doc.metadata.source}`);
        } catch (error) {
            console.error(`✗ Failed to process: ${doc.metadata.source}`, error);
            throw error;
        }
    });
    
    const results = await Promise.allSettled(processingPromises);
    
    const successCount = results.filter(r => r.status === 'fulfilled').length;
    const failureCount = results.filter(r => r.status === 'rejected').length;
    
    console.log(`Processing complete: ${successCount} successful, ${failureCount} failed`);
}

export async function loadGitHubData(repoUrl: string, accessToken?: string): Promise<Document[]> {
    const loader = new GithubRepoLoader(repoUrl, {
        branch: "main",
        recursive: true,
        accessToken: accessToken,
        ignoreFiles: [
            'package-lock.json', 
            'yarn.lock', 
            'pnpm-lock.yaml', 
            'package.json', 
            'README.md', 
            '.gitignore'
        ],
        maxConcurrency: 5,
        unknown: "warn"
    });
    
    const docs = await loader.load();
    return docs;
}

export async function summarizeCode(doc: Document): Promise<string> {
    const code = doc.pageContent.slice(0, 1000);
    const fileName = doc.metadata.source;
    
    const prompt = `You are a senior software engineer summarizing code for documentation purposes.

## STRICT RULES:
- ONLY describe what is explicitly present in the code below
- DO NOT assume, infer, or add functionality that isn't shown
- DO NOT reference external files, APIs, or systems unless explicitly imported/used in the code
- If the code is incomplete or unclear, say "This snippet shows..." rather than guessing
- If you cannot determine the purpose from the code alone, state that clearly

## FILE: ${fileName}

## CODE:
\`\`\`
${code}
\`\`\`

## TASK:
Provide a factual summary (max 100 words) covering:
1. What this code ACTUALLY does (based only on what's shown)
2. Key functions/classes/exports defined (if any)
3. Dependencies imported (if any)

DO NOT make up functionality. Only describe what you can see in the code above.`;

    const result = await codeAnalysisModel.generateContent(prompt);
    return result.response.text().trim();
}

export async function generateEmbedding(summary: string): Promise<number[]> {
    const result = await embeddingModel.embedContent(summary);
    const embedding = result.embedding;
    return embedding.values;
}

const generateEmbeddings = async (doc: Document) => {
    const summaryEmbedding = await summarizeCode(doc);
    const embedding = await generateEmbedding(summaryEmbedding);
    return {
        summary: summaryEmbedding,
        embedding: embedding,
        sourceCode: JSON.parse(JSON.stringify(doc.pageContent)),
        fileName: doc.metadata.source
    };
};