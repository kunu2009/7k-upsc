
import React, { useState } from 'react';
import Flashcard from './Flashcard';
import MindMapNode from './MindMapNode';
import { FLASHCARDS, MIND_MAP_DATA } from '../constants';

const FlashcardPlayer: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % FLASHCARDS.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + FLASHCARDS.length) % FLASHCARDS.length);
  };
  
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrev();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div className="flex flex-col items-center">
      <p className="text-slate-400 mb-6 text-center">Tap to flip, swipe to navigate.</p>
      
      <div 
        className="w-full max-w-md h-80 perspective-1000"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div key={currentIndex} className="animate-fade-in w-full h-full">
            <Flashcard card={FLASHCARDS[currentIndex]} />
        </div>
      </div>

      <div className="w-full max-w-md mt-8">
        <div className="text-center text-slate-300 mb-2 font-semibold">
          <p>Card {currentIndex + 1} of {FLASHCARDS.length}</p>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-3 shadow-inner">
          <div 
            className="bg-gradient-to-r from-sky-500 to-cyan-400 h-3 rounded-full transition-all duration-300 ease-out" 
            style={{ width: `${((currentIndex + 1) / FLASHCARDS.length) * 100}%` }}
            aria-valuenow={currentIndex + 1}
            aria-valuemin={1}
            aria-valuemax={FLASHCARDS.length}
            role="progressbar"
            aria-label="Flashcard progress"
          ></div>
        </div>
      </div>

      <div className="flex justify-between w-full max-w-md mt-6">
        <button
          onClick={goToPrev}
          className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Previous
        </button>
        <button
          onClick={goToNext}
          className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

const MindMapViewer: React.FC = () => {
    const mindMap = MIND_MAP_DATA[0];
    return (
        <div className="p-4 sm:p-6 bg-slate-800/50 rounded-lg">
            <h3 className="text-2xl font-bold text-center text-sky-400 mb-2">{mindMap.centralTopic}</h3>
            <p className="text-center text-slate-400 mb-8">Subject: {mindMap.subject}</p>
            <ul className="mindmap-root">
                {mindMap.nodes.map((node, index) => (
                    <MindMapNode key={index} node={node} />
                ))}
            </ul>
        </div>
    );
};

const StudyToolsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'flashcards' | 'mindmaps'>('flashcards');

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex justify-center mb-6 border-b border-slate-700">
        <button 
            onClick={() => setActiveTab('flashcards')}
            className={`px-6 py-3 font-semibold transition-colors duration-200 ${activeTab === 'flashcards' ? 'border-b-2 border-sky-400 text-sky-400' : 'text-slate-400 hover:text-white'}`}
            aria-pressed={activeTab === 'flashcards'}
        >
          Flashcards
        </button>
        <button 
            onClick={() => setActiveTab('mindmaps')}
            className={`px-6 py-3 font-semibold transition-colors duration-200 ${activeTab === 'mindmaps' ? 'border-b-2 border-sky-400 text-sky-400' : 'text-slate-400 hover:text-white'}`}
            aria-pressed={activeTab === 'mindmaps'}
        >
          Mind Maps
        </button>
      </div>
      
      {activeTab === 'flashcards' && <FlashcardPlayer />}
      {activeTab === 'mindmaps' && <MindMapViewer />}
    </div>
  );
};

export default StudyToolsSection;
