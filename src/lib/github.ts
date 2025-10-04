/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import axios from "axios";
import path from "path";
import fs from "fs/promises";
import AdmZip from "adm-zip";
import os from "os";

interface FileInfo {
  path: string;
  content: string;
}

interface ProcessRepoResult {
  owner: string;
  repoName: string;
  files: FileInfo[];
}

// Enhanced debugging function
export async function debugRepository(repoUrl: string, accessToken: string): Promise<void> {
  const { owner, repoName } = parseGitHubUrl(repoUrl);
  
  console.log(`🔍 Debugging repository: ${owner}/${repoName}`);
  
  try {
    
    const repoCheckUrl = `https://api.github.com/repos/${owner}/${repoName}`;
    const repoResponse = await axios.get(repoCheckUrl, {
      headers: { Authorization: `token ${accessToken}` },
    });
    
    console.log("✅ Repository exists and is accessible");
    console.log(`   - Private: ${repoResponse.data.private}`);
    console.log(`   - Default branch: ${repoResponse.data.default_branch}`);
    
    // Test 2: Check branches
    const branchesUrl = `https://api.github.com/repos/${owner}/${repoName}/branches`;
    const branchesResponse = await axios.get(branchesUrl, {
      headers: { Authorization: `token ${accessToken}` },
    });
    
    console.log("📋 Available branches:");
    branchesResponse.data.forEach((branch: any) => {
      console.log(`   - ${branch.name}`);
    });
    
  } catch (error: any) {
    console.error("❌ Debug failed:");
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Message: ${error.response.data?.message || 'Unknown error'}`);
      
      if (error.response.status === 404) {
        console.error("   🔸 Repository not found or not accessible");
      } else if (error.response.status === 401) {
        console.error("   🔸 Invalid or expired access token");
      } else if (error.response.status === 403) {
        console.error("   🔸 Access forbidden - check token permissions");
      }
    }
    throw error;
  }
}

// Enhanced download function with better error handling
export async function downloadRepository(
  repoUrl: string, 
  accessToken: string, 
  branch?: string
): Promise<{ zipBuffer: Buffer; owner: string; repoName: string; actualBranch: string }> {
  const { owner, repoName } = parseGitHubUrl(repoUrl);
  
  // If no branch specified, get the default branch
  let targetBranch = branch;
  if (!targetBranch) {
    try {
      const repoInfoUrl = `https://api.github.com/repos/${owner}/${repoName}`;
      const repoResponse = await axios.get(repoInfoUrl, {
        headers: { Authorization: `token ${accessToken}` },
      });
      targetBranch = repoResponse.data.default_branch;
      console.log(`📍 Using default branch: ${targetBranch}`);
    } catch (error) {
      console.warn("⚠️  Could not fetch default branch, using 'main'");
      targetBranch = "main";
    }
  }
  
  const zipBallUrl = `https://api.github.com/repos/${owner}/${repoName}/zipball/${targetBranch}`;
  console.log(`📥 Downloading from: ${zipBallUrl}`);
  
  try {
    const res = await axios.get(zipBallUrl, {
      headers: { 
        Authorization: `token ${accessToken}`,
        'User-Agent': 'GitHub-Repository-Processor'
      },
      responseType: "arraybuffer",
      timeout: 60000, // 60 second timeout
    });
    
    return {
      zipBuffer: Buffer.from(res.data),
      owner,
      repoName,
      actualBranch: targetBranch,
    };
  } catch (error: any) {
    console.error(`❌ Download failed for branch '${targetBranch}':`);
    
    if (error.response?.status === 404) {
      // Try alternative branches if the specified branch doesn't exist
      const alternativeBranches = ['main', 'master', 'develop'];
      
      for (const altBranch of alternativeBranches) {
        if (altBranch !== targetBranch) {
          console.log(`🔄 Trying alternative branch: ${altBranch}`);
          try {
            const altUrl = `https://api.github.com/repos/${owner}/${repoName}/zipball/${altBranch}`;
            const res = await axios.get(altUrl, {
              headers: { 
                Authorization: `token ${accessToken}`,
                'User-Agent': 'GitHub-Repository-Processor'
              },
              responseType: "arraybuffer",
              timeout: 60000,
            });
            
            console.log(`✅ Successfully downloaded using branch: ${altBranch}`);
            return {
              zipBuffer: Buffer.from(res.data),
              owner,
              repoName,
              actualBranch: altBranch,
            };
          } catch (altError) {
            console.log(`   ❌ Branch '${altBranch}' also failed`);
          }
        }
      }
    }
    
    throw new Error(`Failed to download repository: ${error.response?.status} ${error.response?.statusText || error.message}`);
  }
}

// Enhanced process function with debugging
export async function processGitHubRepository(
  repoUrl: string,
  accessToken: string,
  branch?: string,
  debug = false
): Promise<ProcessRepoResult> {
  try {
    console.log(` Starting to process repository: ${repoUrl}`);
        if (debug) {
      await debugRepository(repoUrl, accessToken);
    }
    
    console.log(" Downloading repository...");
    const { zipBuffer, owner, repoName, actualBranch } = await downloadRepository(repoUrl, accessToken, branch);
    console.log(` Downloaded ${repoName} from branch '${actualBranch}' (${(zipBuffer.length / 1024 / 1024).toFixed(2)} MB)`);
    
    console.log(" Extracting and processing files...");
    const files = await extractAndProcessRepository(zipBuffer);
    console.log(` Processed ${files.length} files`);
  
    return {
      owner,
      repoName,
      files,
    };
  } catch (error: any) {
    console.error(`❌ Error processing repository ${repoUrl}:`, error.message);
    
    if (error.message.includes('404')) {
      throw new Error(
        `Repository not found or not accessible. Please check:
        1. Repository URL is correct
        2. Repository exists and is public, or your token has access to private repos
        3. Your access token is valid and not expired`
      );
    } else if (error.message.includes('401')) {
      throw new Error('Invalid or expired GitHub access token');
    } else if (error.message.includes('403')) {
      throw new Error('Access forbidden. Your token may not have sufficient permissions');
    }
    
    throw error;
  }
}

// Rest of your existing functions remain the same
export const IGNORED_PATTERNS = [
  'node_modules', 'vendor', '.pnp', '.yarn',
  '.git', '.svn', '.hg',
  'dist', 'build', 'out', '.next', '.nuxt', 'target', 'bin', 'obj',
  '.vscode', '.idea', '*.swp', '*.swo', '.DS_Store', 'Thumbs.db',
  'logs', '*.log', 'tmp', 'temp', '.cache',
  'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml',
  '*.jpg', '*.jpeg', '*.png', '*.gif', '*.svg', '*.ico',
] as const;

export const RELEVANT_EXTENSIONS = new Set([
  '.js', '.jsx', '.ts', '.tsx',
  '.py', '.java', '.c', '.cpp', '.h', '.hpp',
  '.cs', '.php', '.rb', '.go', '.rs', '.kt',
  '.html', '.htm', '.css', '.scss', '.sass',
  '.vue', '.svelte', '.json', '.yaml', '.yml',
  '.sql', '.graphql', '.gql', '.md', '.rst', '.txt',
]);

export function parseGitHubUrl(repoUrl: string) {
  const githubRepoRegex = /^https?:\/\/github\.com\/([^\/]+)\/([^\/]+?)(?:\.git)?(?:\/.*)?$/;
  const match = repoUrl.match(githubRepoRegex);
  
  if (!match || !match[1] || !match[2]) {
    throw new Error("Invalid GitHub Repository URL");
  }
  
  const owner = match[1];
  const repoName = match[2];
  
  return {
    owner,
    repoName,
  };
}

export function shouldIgnoreFile(filePath: string): boolean {
  const normalPath = filePath.toLowerCase().replace(/\\/g, "/");
  return IGNORED_PATTERNS.some(pattern => {
    if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace(/\*/g, '.*'));
      return regex.test(normalPath);
    } else {
      return normalPath.includes(pattern.toLowerCase());
    }
  });
}

export function isRelevantFile(filePath: string): boolean {
  const extension = path.extname(filePath).toLowerCase();
  const basename = path.basename(filePath).toLowerCase();
  
  if (RELEVANT_EXTENSIONS.has(extension)) {
    return true;
  }
  
  const importantFiles = [
    'dockerfile', 'makefile', 'rakefile', 'gemfile',
    'procfile', 'readme', 'license', 'changelog',
  ];
  
  return importantFiles.some(file => basename.includes(file));
}

export async function extractAndProcessRepository(zipBuffer: Buffer): Promise<FileInfo[]> {
  const files: FileInfo[] = [];
  
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'repo-'));
  
  try {
    const zip = new AdmZip(zipBuffer);
    zip.extractAllTo(tempDir, true);
    
    async function walkDirectory(dir: string): Promise<void> {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.relative(tempDir, fullPath);
        
        if (shouldIgnoreFile(relativePath)) {
          continue;
        }
        
        if (entry.isDirectory()) {
          await walkDirectory(fullPath);
        } else if (entry.isFile() && isRelevantFile(relativePath)) {
          try {
            const stats = await fs.stat(fullPath);
            
            if (stats.size > 1024 * 1024) {
              console.warn(`⚠️  Skipping large file ${relativePath} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
              continue;
            }
            
            const content = await fs.readFile(fullPath, 'utf-8');
            
            files.push({
              path: relativePath,
              content,
            });
          } catch (error) {
            console.warn(`⚠️  Skipping file ${relativePath}: ${error}`);
          }
        }
      }
    }
    
    await walkDirectory(tempDir);
  } finally {
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch (error) {
      console.warn(` Failed to cleanup temp directory: ${error}`);
    }
  }
  
  return files;
}