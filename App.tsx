
import React, { useState } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import ReelFeed from './components/ReelFeed';
import MCQSection from './components/MCQSection';
import StudyToolsSection from './components/StudyToolsSection';
import InterviewPrepSection from './components/InterviewPrepSection';
import CurrentAffairsSection from './components/CurrentAffairsSection';
import { Page } from './types';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('current_affairs');

  const renderContent = () => {
    switch (activePage) {
      case 'reels':
        return <ReelFeed />;
      case 'mcqs':
        return <MCQSection />;
      case 'study_tools':
        return <StudyToolsSection />;
      case 'interview':
        return <InterviewPrepSection />;
      case 'current_affairs':
        return <CurrentAffairsSection />;
      default:
        return <CurrentAffairsSection />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col">
      <Header />
      <main className="flex-grow pb-20 pt-16">
        {renderContent()}
      </main>
      <BottomNav activePage={activePage} setActivePage={setActivePage} />
    </div>
  );
};

export default App;