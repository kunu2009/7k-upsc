import React, { useState } from 'react';
import FlashcardPlayer from './FlashcardPlayer';
import FlashcardQuiz from './FlashcardQuiz';
import MindMapNode from './MindMapNode';
import { MIND_MAP_DATA } from '../constants';

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

const FlashcardContainer: React.FC = () => {
    const [activeMode, setActiveMode] = useState<'player' | 'quiz'>('player');

    return (
        <div>
            <div className="flex justify-center gap-2 mb-6 p-1 bg-slate-700/50 rounded-lg max-w-xs mx-auto">
                <button
                    onClick={() => setActiveMode('player')}
                    className={`w-full px-4 py-2 text-sm font-semibold rounded-md transition-colors ${activeMode === 'player' ? 'bg-sky-600 text-white' : 'text-slate-300 hover:bg-slate-600/50'}`}
                    aria-pressed={activeMode === 'player'}
                >
                    Player
                </button>
                <button
                    onClick={() => setActiveMode('quiz')}
                    className={`w-full px-4 py-2 text-sm font-semibold rounded-md transition-colors ${activeMode === 'quiz' ? 'bg-sky-600 text-white' : 'text-slate-300 hover:bg-slate-600/50'}`}
                    aria-pressed={activeMode === 'quiz'}
                >
                    Quiz
                </button>
            </div>
            {activeMode === 'player' ? <FlashcardPlayer /> : <FlashcardQuiz />}
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
      
      {activeTab === 'flashcards' && <FlashcardContainer />}
      {activeTab === 'mindmaps' && <MindMapViewer />}
    </div>
  );
};

export default StudyToolsSection;
