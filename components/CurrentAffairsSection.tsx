
import React, { useState } from 'react';
import { CURRENT_AFFAIRS_DATA } from '../constants';
import { Subject } from '../types';

interface AccordionItemProps {
    date: string;
    title: string;
    summary: string;
    category: Subject;
    isOpen: boolean;
    onClick: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ date, title, summary, category, isOpen, onClick }) => {
    return (
        <div className="border-b border-slate-700">
            <button
                onClick={onClick}
                className="w-full text-left p-4 flex justify-between items-center hover:bg-slate-700/50 transition-colors duration-200"
                aria-expanded={isOpen}
            >
                <div className="flex flex-col">
                    <span className="text-xs text-amber-400 font-semibold uppercase">{category} • {date}</span>
                    <h3 className="text-md font-semibold mt-1 text-white">{title}</h3>
                </div>
                <svg
                    className={`w-6 h-6 text-slate-400 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-screen' : 'max-h-0'}`}>
                <div className="p-4 bg-slate-900/50">
                    <p className="text-slate-300 whitespace-pre-line leading-relaxed">{summary}</p>
                </div>
            </div>
        </div>
    );
};

const CurrentAffairsSection: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="max-w-3xl mx-auto p-4">
            <h2 className="text-3xl font-bold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">Current Affairs</h2>
            <p className="text-slate-400 mb-8 text-center">Daily insights into national and international events.</p>
            <div className="bg-slate-800 rounded-lg shadow-xl overflow-hidden">
                {CURRENT_AFFAIRS_DATA.map((item, index) => (
                    <AccordionItem
                        key={item.id}
                        date={item.date}
                        title={item.title}
                        summary={item.summary}
                        category={item.category}
                        isOpen={openIndex === index}
                        onClick={() => handleToggle(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default CurrentAffairsSection;
