import React from 'react';
import { Page } from '../types';
import { ICONS } from '../constants';

interface BottomNavProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
}

const NavItem: React.FC<{
    page: Page;
    label: string;
    // FIX: Changed JSX.Element to React.ReactElement to resolve namespace issue.
    icon: React.ReactElement;
    isActive: boolean;
    onClick: () => void;
}> = ({ page, label, icon, isActive, onClick }) => {
    const activeClass = isActive ? 'text-sky-400' : 'text-slate-400 hover:text-white';
    return (
        <button 
            onClick={onClick}
            className={`flex flex-col items-center justify-center w-full transition-colors duration-200 ${activeClass}`}
        >
            {icon}
            <span className="text-xs mt-1">{label}</span>
        </button>
    );
};


const BottomNav: React.FC<BottomNavProps> = ({ activePage, setActivePage }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-800/90 backdrop-blur-sm border-t border-slate-700 z-10">
      <div className="max-w-4xl mx-auto flex justify-around items-center h-16 px-2">
        <NavItem 
            page="reels"
            label="Home"
            icon={ICONS.reels}
            isActive={activePage === 'reels'}
            onClick={() => setActivePage('reels')}
        />
        <NavItem 
            page="mcqs"
            label="MCQs"
            icon={ICONS.mcqs}
            isActive={activePage === 'mcqs'}
            onClick={() => setActivePage('mcqs')}
        />
        <NavItem 
            page="flashcards"
            label="Flashcards"
            icon={ICONS.flashcards}
            isActive={activePage === 'flashcards'}
            onClick={() => setActivePage('flashcards')}
        />
        <NavItem 
            page="interview"
            label="Interview"
            icon={ICONS.interview}
            isActive={activePage === 'interview'}
            onClick={() => setActivePage('interview')}
        />
      </div>
    </nav>
  );
};

export default BottomNav;