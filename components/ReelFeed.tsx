
import React from 'react';
import ReelCard from './ReelCard';
import { REEL_CARDS } from '../constants';

const ReelFeed: React.FC = () => {
  return (
    <div className="max-w-md mx-auto px-2 space-y-6">
      {REEL_CARDS.map(card => (
        <ReelCard key={card.id} card={card} />
      ))}
    </div>
  );
};

export default ReelFeed;
