
import React from 'react';
import { ReelCardData } from '../types';

interface ReelCardProps {
  card: ReelCardData;
}

const ReelCard: React.FC<ReelCardProps> = ({ card }) => {
  return (
    <div 
        className={`h-96 flex flex-col justify-between p-6 rounded-2xl shadow-lg text-white bg-gradient-to-br ${card.gradient}`}
    >
        <div>
            <span className="text-sm font-semibold bg-black/20 px-3 py-1 rounded-full">{card.subject}</span>
            <h2 className="text-2xl font-bold mt-4">{card.title}</h2>
        </div>
        <p className="text-lg leading-relaxed">{card.content}</p>
    </div>
  );
};

export default ReelCard;
