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

export const IGNORED_PATTERNS = new Set([
  'node_modules',
  'vendor',
  '.pnp',
  '.yarn',
  'bower_components',
  '.git',
  '.svn',
  '.hg',
  '.gitignore',
  '.gitattributes',
  'dist',
  'build',
  'out',
  '.next',
  '.nuxt',
  'target',
  'bin',
  'obj',
  'coverage',
  '.nyc_output',
  '*.min.js',
  '*.min.css',
  '.vscode',
  '.idea',
  '*.swp',
  '*.swo',
  '*.sublime-*',
  '.editorconfig',
  '.DS_Store',
  'Thumbs.db',
  'desktop.ini',
  'logs',
  '*.log',
  'tmp',
  'temp',
  '.cache',
  '*.pid',
  '*.seed',
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  'composer.lock',
  'Gemfile.lock',
  'Pipfile.lock',
  'poetry.lock',
  'Cargo.lock',
  '*.jpg',
  '*.jpeg',
  '*.png',
  '*.gif',
  '*.svg',
  '*.ico',
  '*.webp',
  '*.mp4',
  '*.avi',
  '*.mov',
  '*.mp3',
  '*.wav',
  '*.ogg',
  '*.pdf',
  '*.psd',
  '*.ai',
  '*.sketch',
  '*.woff',
  '*.woff2',
  '*.ttf',
  '*.eot',
  '*.otf',
  '*.zip',
  '*.tar',
  '*.gz',
  '*.rar',
  '*.7z',
  'coverage',
  '.coverage',
  'htmlcov',
  '.pytest_cache',
  '__pycache__',
  'docs/_build',
  'site',
  '_site',
  '.env',
  '.env.local',
  '.env.*.local',
  '*.sqlite',
  '*.db',
  '*.sql',
  '*.class',
  '*.dll',
  '*.exe',
  '*.o',
  '*.so',
]);

export const RELEVANT_EXTENSIONS = new Set([
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.py',
  '.java',
  '.c',
  '.cpp',
  '.h',
  '.hpp',
  '.cs',
  '.php',
  '.rb',
  '.go',
  '.rs',
  '.kt',
  '.html',
  '.htm',
  '.css',
  '.scss',
  '.sass',
  '.vue',
  '.svelte',
  '.json',
  '.yaml',
  '.yml',
  '.sql',
  '.graphql',
  '.gql',
  '.md',
  '.rst',
  '.txt',
]);

export async function debugRepository(repoUrl: string, accessToken: string): Promise<void> {
  const { owner, repoName } = parseGitHubUrl(repoUrl);

  try {
    const repoCheckUrl = `https://api.github.com/repos/${owner}/${repoName}`;
    await axios.get(repoCheckUrl, {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });

    const branchesUrl = `https://api.github.com/repos/${owner}/${repoName}/branches`;
    await axios.get(branchesUrl, {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });
  } catch (error: any) {
    throw error;
  }
}

export async function downloadRepository(
  repoUrl: string,
  accessToken: string,
  branch?: string
): Promise<{ zipBuffer: Buffer; owner: string; repoName: string; actualBranch: string }> {
  const { owner, repoName } = parseGitHubUrl(repoUrl);
  let targetBranch = branch;

  if (!targetBranch) {
    try {
      const repoInfoUrl = `https://api.github.com/repos/${owner}/${repoName}`;
      const repoResponse = await axios.get(repoInfoUrl, {
        headers: {
          Authorization: `token ${accessToken}`,
        },
      });
      targetBranch = repoResponse.data.default_branch;
    } catch (error) {
      targetBranch = "main";
    }
  }

  const zipBallUrl = `https://api.github.com/repos/${owner}/${repoName}/zipball/${targetBranch}`;

  try {
    const res = await axios.get(zipBallUrl, {
      headers: {
        Authorization: `token ${accessToken}`,
        'User-Agent': 'GitHub-Repository-Processor'
      },
      responseType: "arraybuffer",
      timeout: 60000,
    });

    return {
      zipBuffer: Buffer.from(res.data),
      owner,
      repoName,
      actualBranch: targetBranch,
    };
  } catch (error: any) {
    if (error.response?.status === 404) {
      const alternativeBranches = ['main', 'master', 'develop'];
      
      for (const altBranch of alternativeBranches) {
        if (altBranch !== targetBranch) {
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

            return {
              zipBuffer: Buffer.from(res.data),
              owner,
              repoName,
              actualBranch: altBranch,
            };
          } catch (altError) {
          }
        }
      }
    }

    throw new Error(`Failed to download repository: ${error.response?.status} ${error.response?.statusText || error.message}`);
  }
}

export async function processGitHubRepository(
  repoUrl: string,
  accessToken: string,
  branch?: string,
  debug = false
): Promise<ProcessRepoResult> {
  try {
    if (debug) {
      await debugRepository(repoUrl, accessToken);
    }

    const { zipBuffer, owner, repoName, actualBranch } = await downloadRepository(repoUrl, accessToken, branch);
    const files = await extractAndProcessRepository(zipBuffer);

    return {
      owner,
      repoName,
      files,
    };
  } catch (error: any) {
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

export function parseGitHubUrl(repoUrl: string) {
  const githubRepoRegex = /^https?:\/\/github\.com\/([^\/]+)\/([^\/]+?)(?:\.git)?(?:\/.*)?$/;
  const match = repoUrl.match(githubRepoRegex);

  if (!match || !match[1] || !match[2]) {
    throw new Error("Invalid GitHub Repository URL");
  }

  const owner = match[1];
  const repoName = match[2];

  return { owner, repoName };
}

export function shouldIgnoreFile(filePath: string): boolean {
  const normalPath = filePath.toLowerCase().replace(/\\/g, "/");

  for (const pattern of IGNORED_PATTERNS) {
    if (typeof pattern === "string" && pattern.includes('*')) {
      const escaped = pattern.replace(/[-\/\\^$+?.()|[\]{}]/g, '\\$&').replace(/\*/g, '.*');
      const regex = new RegExp(`^${escaped}$`, 'i');
      if (regex.test(normalPath)) {
        return true;
      }
    } else if (typeof pattern === "string") {
      if (normalPath.includes(pattern.toLowerCase())) {
        return true;
      }
    }
  }

  return false;
}

export function isRelevantFile(filePath: string): boolean {
  const extension = path.extname(filePath).toLowerCase();
  const basename = path.basename(filePath).toLowerCase();

  if (RELEVANT_EXTENSIONS.has(extension)) {
    return true;
  }

  const importantFiles = [
    'dockerfile',
    'makefile',
    'rakefile',
    'gemfile',
    'procfile',
    'readme',
    'license',
    'changelog',
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
              continue;
            }

            const content = await fs.readFile(fullPath, 'utf-8');
            files.push({
              path: relativePath,
              content,
            });
          } catch (error) {
          }
        }
      }
    }

    await walkDirectory(tempDir);
  } finally {
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch (error) {
    }
  }

  return files;
}