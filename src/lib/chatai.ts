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
    model: 'gemma-3n-e4b-it',
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
            
            console.log(`✓ Successfully processed: ${doc.metadata.source}`);
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
    const prompt = `You are an intelligent senior software engineer who specializes in onboarding junior software engineers onto projects.
    You are onboarding a junior software engineer and explaining to them the purpose of the ${doc.metadata.source} file.

    Here is the code:
    \`\`\`
    ${code}
    \`\`\`

    Give a summary no more than 100 words of the code above.`;

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