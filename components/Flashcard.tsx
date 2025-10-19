
import React, { useState } from 'react';
import { FlashcardData } from '../types';

interface FlashcardProps {
  card: FlashcardData;
}

const Flashcard: React.FC<FlashcardProps> = ({ card }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };
  
  // Reset flip state when card changes
  React.useEffect(() => {
    setIsFlipped(false);
  }, [card]);

  return (
    <div
      className="w-full h-full relative preserve-3d transition-transform duration-700 cursor-pointer"
      style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      onClick={handleClick}
    >
      {/* Front of the card */}
      <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl shadow-lg flex flex-col justify-between p-6">
        <div>
          <span className="text-sm font-semibold bg-black/20 px-3 py-1 rounded-full">{card.subject}</span>
          <p className="text-xl font-semibold mt-8 text-white">{card.question}</p>
        </div>
        <div className="text-right text-slate-400 text-sm">Question</div>
      </div>

      {/* Back of the card */}
      <div
        className="absolute w-full h-full backface-hidden bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl shadow-lg flex flex-col justify-between p-6"
        style={{ transform: 'rotateY(180deg)' }}
      >
        <div>
           <span className="text-sm font-semibold bg-black/20 px-3 py-1 rounded-full">{card.subject}</span>
           <p className="text-lg mt-8 text-white">{card.answer}</p>
        </div>
        <div className="text-right text-slate-200 text-sm">Answer</div>
      </div>
    </div>
  );
};

export default Flashcard;
