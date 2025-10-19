
import React, { useState } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import ReelFeed from './components/ReelFeed';
import MCQSection from './components/MCQSection';
import FlashcardSection from './components/FlashcardSection';
import InterviewPrepSection from './components/InterviewPrepSection';
import { Page } from './types';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('reels');

  const renderContent = () => {
    switch (activePage) {
      case 'reels':
        return <ReelFeed />;
      case 'mcqs':
        return <MCQSection />;
      case 'flashcards':
        return <FlashcardSection />;
      case 'interview':
        return <InterviewPrepSection />;
      default:
        return <ReelFeed />;
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
