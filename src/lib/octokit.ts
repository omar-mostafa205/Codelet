/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Octokit } from "@octokit/rest";

interface FileActivity {
    path: string;
    name: string;
    changeCount: number;
    repo: string;
    content: string;
    lastModified: Date;
    contributors: string[];
    recentCommits: string[];
    scoreImportance: number;
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getImportantFiles(
    owner: string,
    repo: string,
    accessToken: string,
    repoFiles: any[],
    options: {
        maxCommits?: number;
        topFilesCount?: number;
        monthsBack?: number;
    } = {}
): Promise<FileActivity[]> {
    const { maxCommits = 200, topFilesCount = 20, monthsBack = 3 } = options;
    const octokit = new Octokit({ auth: accessToken || process.env.GITHUB_ACCESS_TOKEN });
    const { data: commits } = await octokit.rest.repos.listCommits({
        owner,
        repo,
        per_page: Math.min(maxCommits, 100),
    });
    const FileActivityMap = new Map<string, {
        changeCount: number;
        lastModified: Date;
        contributors: Set<string>;
        recentCommits: string[];
    }>();

    for (const commit of commits) {
        try {
            const { data: commitDetail } = await octokit.rest.repos.getCommit({
                owner,
                repo,
                ref: commit.sha,
            });

            commitDetail.files?.forEach(file => {
                const existing = FileActivityMap.get(file.filename) || {
                    changeCount: 0,
                    lastModified: new Date(0),
                    contributors: new Set<string>(),
                    recentCommits: [],
                };
                existing.changeCount += 1;
                existing.lastModified = new Date(Math.max(existing.lastModified.getTime(), new Date(commitDetail.commit.committer?.date || 0).getTime()));
                existing.contributors.add(commitDetail.commit.committer?.login || '');
                existing.recentCommits.push(commitDetail.commit.message);
                FileActivityMap.set(file.filename, existing);
            });
            await sleep(50);
        }
        catch (error) {
            console.error(`Failed to fetch commit details for commit ${commit.sha}: ${error}`);
            continue;
        }
    }

    const importantFiles: FileActivity[] = [];
    for (const [path, activity] of FileActivityMap) {
        const repoFile =
            repoFiles.find(f =>
                f.path === path ||
                f.path.endsWith(path) ||
                path.endsWith(f.path)
            );
        if (repoFile) {
            const scoreImportance = calculateImportance(activity, path, repoFile);
            importantFiles.push({
                path,
                name: repoFile.name,
                changeCount: activity.changeCount,
                repo,
                content: repoFile.content,
                lastModified: activity.lastModified,
                contributors: Array.from(activity.contributors),
                recentCommits: activity.recentCommits,
                scoreImportance,
            });
        }
    }
    return importantFiles.sort((a, b) => b.scoreImportance - a.scoreImportance).slice(0, topFilesCount);
}

function calculateImportance(
    activity: any,
    filePath: string,
    repoFile: any
): number {
    let score = 0;

    score += activity.changeCount * 10;

    if (isConfigFile(filePath)) score += 20;
    if (isEntryPoint(filePath)) score += 30;
    if (isCoreFile(filePath)) score += 25;
    score += activity.contributors.size * 5;
    score += Math.min(repoFile.content.split('\n').length / 10, 20);
    return score;
}
function isConfigFile(filePath: string): boolean {
    const configFiles = ['package.json', 'tsconfig.json', 'webpack.config', 'next.config', '.env'];
    return configFiles.some(config => filePath.includes(config));
}
function isEntryPoint(filePath: string): boolean {
    const entryPoints = ['index.', 'main.', 'app.', 'server.', 'index.html'];
    return entryPoints.some(entry => filePath.toLowerCase().includes(entry));
}
function isCoreFile(filePath: string): boolean {
    const coreNames = ['api', 'service', 'controller', 'model', 'util', 'helper', 'core', 'base'];
    return coreNames.some(core => filePath.toLowerCase().includes(core));
}
