/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { processGitHubRepository } from "./github";
import { getImportantFiles } from "./octokit";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createTutorialPrompt } from "./prompt";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateTutorial(githubUrl: string, accessToken: string): Promise<any> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" }); 
  
  try {
    const tutorialData = await getTutorialDataWithSeparation(githubUrl, accessToken);
    const llmPrompt = createTutorialPrompt(tutorialData);

    const result = await model.generateContent(llmPrompt);
    const response = result.response;
    let responseText = response.text();
    let cleanedResponse = responseText
      .replace(/```json\s*/g, '')
      .replace(/```\s*$/g, '')
      .replace(/```/g, '')
      .trim();

    console.log("Raw AI Response Length:", cleanedResponse.length);
    console.log("First 200 chars:", cleanedResponse.substring(0, 200));
    console.log("Last 200 chars:", cleanedResponse.substring(cleanedResponse.length - 200));

    try {
      return JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.log("Initial JSON parse failed, attempting repairs...");
      
      let repairedJson = cleanedResponse
        .replace(/,(\s*[}\]])/g, '$1')           
        .replace(/[\u201C\u201D]/g, '"')        
        .replace(/[\u2018\u2019]/g, "'")         
        .replace(/\n(?=\s*")/g, '')              
        .replace(/\n(?=\s*[}\]])/g, '')         
        .replace(/([^\\])\\n/g, '$1\\\\n')       
        .replace(/([^\\])\\t/g, '$1\\\\t')       
        .replace(/\s+/g, ' ')                  
        .trim();

      try {
        console.log("Attempting to parse repaired JSON...");
        return JSON.parse(repairedJson);
      } catch (secondError) {
        // Find the actual error location
        const errorMessage = secondError instanceof Error ? secondError.message : String(secondError);
        const errorMatch = errorMessage.match(/position (\d+)/);
        const errorPos = errorMatch ? parseInt(errorMatch[1]) : 0;
        
        console.log("=== JSON PARSE ERROR DETAILS ===");
        console.log("Error:", errorMessage);
        console.log("Error position:", errorPos);
        console.log("Context around error:");
        console.log(repairedJson.substring(Math.max(0, errorPos - 100), errorPos + 100));
        console.log("================================");
        
        const jsonStart = repairedJson.indexOf('{');
        const jsonEnd = repairedJson.lastIndexOf('}');
        
        if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
          const extractedJson = repairedJson.substring(jsonStart, jsonEnd + 1);
          try {
            console.log("Attempting to parse extracted JSON...");
            return JSON.parse(extractedJson);
          } catch (thirdError) {
            console.log("All JSON parsing attempts failed");
          }
        }
        
        throw new Error(`JSON parsing failed after all repair attempts: ${errorMessage}`);
      }
    }
  } catch (error) {
    console.error("Error generating tutorial:", error);
    throw new Error(`Failed to generate tutorial: ${error}`);
  }
}

export async function getTutorialDataWithSeparation(githubUrl: string, accessToken: string) {
  try {
    const { files, owner, repoName } = await processGitHubRepository(githubUrl, accessToken);
    const importantFiles = await getImportantFiles(owner, repoName, accessToken, files);
    const importantFilePaths = new Set(importantFiles.map(file => file.path));    
    const remainingFiles = files.filter(file => !importantFilePaths.has(file.path));
  
    const tutorialData = {
      repository: {
        name: repoName,
        totalFiles: files.length,
        importantFilesCount: importantFiles.length,
        remainingFilesCount: remainingFiles.length
      },
      importantFiles: importantFiles.map(file => ({
        path: file.path,
        name: file.name,
        changeCount: file.changeCount,
        lastModified: file.lastModified,
        contributors: file.contributors,
        recentCommits: file.recentCommits.slice(0, 3), 
        scoreImportance: file.scoreImportance,
        content: file.content
      })),
      remainingFiles: remainingFiles.map(file => ({
        path: file.path,
        name: file.name,
        content: file.content
      })),
      fileStructureOverview: files.map(file => file.path)
    };

    return tutorialData;
  } catch (error) {
    console.error("Error getting tutorial data with separation:", error);
    throw error;
  }
}