/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { formatDistanceToNow } from 'date-fns';

const REPO_COLORS = ['#FF6FD8', '#3813C2', '#FF6B35', '#FFB800', '#42B883', '#00ADD8', '#02569B'];

export function getRepoColor(index: number): string {
  return REPO_COLORS[index % REPO_COLORS.length];
}

export function calculateProgress(tutorials: any[]): number {
  if (tutorials.length === 0) return 0;
  
  const totalChapters = tutorials.reduce((sum, t) => sum + (t.chapters?.length || 0), 0);
  if (totalChapters === 0) return 0;
  
  const chaptersWithContent = tutorials.reduce((sum, t) => {
    return sum + (t.chapters?.filter((c: any) => c.subChapters && c.subChapters.length > 0).length || 0);
  }, 0);
  
  return Math.round((chaptersWithContent / totalChapters) * 100);
}

export function estimateDuration(subChapters: any[]): string {
 
  const minutes = subChapters.length * 2;
  return `${minutes} min`;
}

export function getRelativeTime(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}

export function determineTutorialStatus(tutorial: any): 'completed' | 'in-progress' | 'pending' {
  const chapters = tutorial.chapters || [];
  
  if (chapters.length === 0) return 'pending';
  
  const chaptersWithContent = chapters.filter(
    (c: any) => c.subChapters && c.subChapters.length > 0
  );
  
  if (chaptersWithContent.length === 0) return 'pending';
  if (chaptersWithContent.length === chapters.length) return 'completed';
  return 'in-progress';
}

export function countDiagrams(chapters: any[]): number {
  return chapters.reduce((sum, chapter) => {
    return sum + (chapter.subChapters?.filter((sc: any) => sc.diagram).length || 0);
  }, 0);
}

export function transformRepoData(reposData: any[]) {
  return reposData.map((repo, index) => {
    const tutorials = repo.tutorials.map((tutorial: any) => {
      const diagrams = countDiagrams(tutorial.chapters);
      const status = determineTutorialStatus(tutorial);
      
      return {
        id: tutorial.id,
        title: tutorial.title,
        duration: estimateDuration(
          tutorial.chapters.flatMap((c: any) => c.subChapters || [])
        ),
        status,
        diagrams,
        views: 0, 
        description: tutorial.description,
        chatSessions: tutorial.chatSessions || []

      };
    });

    return {
      id: repo.id,
      name: repo.name,
      chapters: repo.tutorials.reduce((sum: number, t: any) => sum + (t.chapters?.length || 0), 0),
      lastUpdated: getRelativeTime(new Date(repo.updatedAt)),
      progress: calculateProgress(repo.tutorials),
      iconColor: getRepoColor(index),
      githubUrl: repo.githubUrl,
      description: `Repository: ${repo.name}`,
      stars: 0, 
      tutorials
    };
  });
}

export function transformChatSessions(reposData: any[]) {
  const allChats: any[] = [];
  
  reposData.forEach(repo => {
    repo.tutorials.forEach((tutorial: any) => {
      tutorial.chatSessions?.forEach((session: any) => {
        if (session.messages && session.messages.length > 0) {
          allChats.push({
            id : session.id,
            question: session.title || session.messages[0].content.substring(0, 50) + '...',
            time: getRelativeTime(new Date(session.createdAt)),
            repo: repo.name,
            color: getRepoColor(reposData.indexOf(repo))
          });
        }
      });
    });
  });
  
  return allChats.slice(0, 4); 
}