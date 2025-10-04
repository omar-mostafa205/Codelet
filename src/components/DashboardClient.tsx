/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client"
import React, { useState, useEffect } from 'react';
import DashboardNav from '@/components/DashboardNav';
import DashboardMainView from '@/components/DashboardMainView';
// import RepositoryDetailView from '@/components/RepositoryDetailView';
import TutorialDetailView from '@/components/TutorialDetailView';
import { transformChatSessions } from '@/lib/dashboard-utils';
import { useParams, useRouter } from 'next/navigation';

interface DashboardClientProps {
  initialData: any[];
}

// Helper function to find repo by tutorial ID
function findRepoByTutorialId(repositories: any[], tutorialId: number) {
  return repositories.find(repo =>
    repo.tutorials?.some((tut: any) => tut.id === tutorialId)
  );
}

export default function DashboardClient({ initialData }: DashboardClientProps) {
  const params = useParams();
  const router = useRouter();
  const repositories = initialData;
  
  // Use useState with lazy initialization to prevent recalculation on every render
  const [activeRepo, setActiveRepo] = useState<string>(() => {
    const tutorialId = params?.tutorialId;
    
    if (tutorialId) {
      const repoWithTutorial = findRepoByTutorialId(repositories, Number(tutorialId));
      if (repoWithTutorial) {
        return repoWithTutorial.name;
      }
    }
    
    // Return first repo only on initial load
    return repositories[0]?.name || '';
  });
  
  const [activeTutorial, setActiveTutorial] = useState<any>(() => {
    const tutorialId = params?.tutorialId;
    
    if (tutorialId) {
      const repoWithTutorial = findRepoByTutorialId(repositories, Number(tutorialId));
      if (repoWithTutorial) {
        return repoWithTutorial.tutorials?.find((tut: any) => tut.id === Number(tutorialId));
      }
    }
    
    return null;
  });
  
  const [currentView, setCurrentView] = useState<'dashboard' | 'repo-detail' | 'tutorial-detail'>(() => {
    return params?.tutorialId ? 'tutorial-detail' : 'dashboard';
  });
  
  const [selectedTutorial, setSelectedTutorial] = useState<any>(() => {
    const tutorialId = params?.tutorialId;
    
    if (tutorialId) {
      const repoWithTutorial = findRepoByTutorialId(repositories, Number(tutorialId));
      if (repoWithTutorial) {
        return repoWithTutorial.tutorials?.find((tut: any) => tut.id === Number(tutorialId));
      }
    }
    
    return null;
  });

  const currentRepo = repositories.find(r => r.name === activeRepo);
  const currentTutorials = currentRepo?.tutorials || [];
  
  useEffect(() => {
    const tutorialId = params?.tutorialId;
    
    if (tutorialId) {
      setCurrentView('tutorial-detail');
      const repoWithTutorial = findRepoByTutorialId(repositories, Number(tutorialId));
      
      if (repoWithTutorial) {
        const tutorial = repoWithTutorial.tutorials?.find(
          (tut: any) => tut.id === Number(tutorialId)
        );
        
        // Only update if different to prevent unnecessary re-renders
        if (repoWithTutorial.name !== activeRepo) {
          setActiveRepo(repoWithTutorial.name);
        }
        
        if (tutorial && tutorial.id !== activeTutorial?.id) {
          setActiveTutorial(tutorial);
          setSelectedTutorial(tutorial);
        }
      }
    } else {
      setCurrentView('dashboard');
      setSelectedTutorial(null);
    }
  }, [params?.tutorialId, repositories, activeRepo, activeTutorial]);
  
  const recentChats = transformChatSessions(initialData);

  const handleRepoClick = (repoName: string) => {
    const selectedRepo = repositories.find(repo => repo.name === repoName);
    const firstTutorial = selectedRepo?.tutorials?.[0];
    
    if (firstTutorial) {
      setActiveRepo(repoName);
      setActiveTutorial(firstTutorial);
      router.push(`/tutorial/${firstTutorial.id}?repoId=${selectedRepo.id}`);
    } else {
      setActiveRepo(repoName);
      router.push(`/dashboard?repoId=${selectedRepo?.id}`);
    }
  };

  const handleTutorialClick = (tutorial: any) => {
    setActiveTutorial(tutorial);
    setSelectedTutorial(tutorial);
    setCurrentView('tutorial-detail');
    router.push(`/tutorial/${tutorial.id}`);
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedTutorial(null);
    router.push('/dashboard');
  };

  const handleBackToRepo = () => {
    setCurrentView('repo-detail');
    setSelectedTutorial(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <DashboardNav
        repositories={repositories}
        activeRepo={activeRepo}
        setActiveRepo={setActiveRepo}
        activeTutorial={activeTutorial}
        setActiveTutorial={setActiveTutorial}
        currentRepo={currentRepo}
        currentTutorials={currentTutorials}
      />

      {currentView === 'tutorial-detail' && selectedTutorial ? (
        <TutorialDetailView
          tutorial={selectedTutorial}
          currentRepo={currentRepo}
          onBack={handleBackToRepo}
          onTutorialClick={handleTutorialClick}
        />
      ) : currentView === 'repo-detail' ? (
        <RepositoryDetailView
          currentRepo={currentRepo}
          onBack={handleBackToDashboard}
          onTutorialClick={handleTutorialClick}
        />
      ) : (
        <DashboardMainView
          repositories={repositories}
          activeRepo={activeRepo}
          currentRepo={currentRepo}
          recentChats={recentChats}
          onRepoClick={handleRepoClick}
          onTutorialClick={handleTutorialClick}
        />
      )}
    </div>
  );
}