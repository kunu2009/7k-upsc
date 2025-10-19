
import React, { useState } from 'react';
import Flashcard from './Flashcard';
import { FLASHCARDS } from '../constants';

const FlashcardSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum distance (in pixels) to be considered a swipe
  const minSwipeDistance = 50;

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % FLASHCARDS.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + FLASHCARDS.length) % FLASHCARDS.length);
  };
  
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null); // Reset touch end on new touch
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
    <div className="max-w-2xl mx-auto p-4 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4 text-center text-sky-400">Flashcards</h2>
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
        <div className="text-center text-slate-300 mb-2 text-sm">
          <p>Card {currentIndex + 1} of {FLASHCARDS.length}</p>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div 
            className="bg-sky-500 h-2 rounded-full transition-all duration-300 ease-out" 
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

export default FlashcardSection;
