
import React, { useState } from 'react';
import Flashcard from './Flashcard';
import { FLASHCARDS } from '../constants';

const FlashcardSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % FLASHCARDS.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + FLASHCARDS.length) % FLASHCARDS.length);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4 text-center text-sky-400">Flashcards</h2>
       <p className="text-slate-400 mb-6 text-center">Tap the card to flip it.</p>
      
      <div className="w-full max-w-md h-80 perspective-1000">
        <Flashcard card={FLASHCARDS[currentIndex]} />
      </div>

      <div className="mt-8 text-center text-slate-300">
        <p>Card {currentIndex + 1} of {FLASHCARDS.length}</p>
      </div>

      <div className="flex justify-between w-full max-w-md mt-4">
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
