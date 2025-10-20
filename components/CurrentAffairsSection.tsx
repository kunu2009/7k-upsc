
import React, { useState, useMemo } from 'react';
import { CURRENT_AFFAIRS_DATA } from '../constants';
import { Subject, CurrentAffairsData } from '../types';

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

const YearColumn: React.FC<{
    year: string;
    items: CurrentAffairsData[];
    openItemId: number | null;
    handleToggle: (id: number) => void;
}> = ({ year, items, openItemId, handleToggle }) => {
    return (
        <div className="flex flex-col">
            <h3 className="text-2xl font-bold text-center text-slate-300 sticky top-16 bg-slate-900/80 backdrop-blur-sm py-3 z-10 rounded-t-lg">{year}</h3>
            <div className="bg-slate-800 rounded-b-lg shadow-xl overflow-hidden">
                {items.length > 0 ? (
                    items.map((item) => (
                        <AccordionItem
                            key={item.id}
                            date={item.date}
                            title={item.title}
                            summary={item.summary}
                            category={item.category}
                            isOpen={openItemId === item.id}
                            onClick={() => handleToggle(item.id)}
                        />
                    ))
                ) : (
                    <p className="p-4 text-slate-400 text-center">No events for this year.</p>
                )}
            </div>
        </div>
    );
};


const CurrentAffairsSection: React.FC = () => {
    const first2024Item = CURRENT_AFFAIRS_DATA.find(item => item.date.includes('2024'));
    const [openItemId, setOpenItemId] = useState<number | null>(first2024Item ? first2024Item.id : (CURRENT_AFFAIRS_DATA[0]?.id ?? null));

    const handleToggle = (id: number) => {
        setOpenItemId(openItemId === id ? null : id);
    };

    const affairsByYear = useMemo(() => {
        return CURRENT_AFFAIRS_DATA.reduce((acc, item) => {
            const year = item.date.slice(-4);
            if (!acc[year]) {
                acc[year] = [];
            }
            acc[year].push(item);
            return acc;
        }, {} as Record<string, CurrentAffairsData[]>);
    }, []);

    const years = ['2025', '2024', '2023']; // Reverse chronological order for relevance

    return (
        <div className="max-w-7xl mx-auto p-4">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">Current Affairs</h2>
                <p className="text-slate-400 mt-2">Key events shaping India's journey.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {years.map(year => (
                    <YearColumn 
                        key={year}
                        year={year}
                        items={affairsByYear[year] || []}
                        openItemId={openItemId}
                        handleToggle={handleToggle}
                    />
                ))}
            </div>
        </div>
    );
};

export default CurrentAffairsSection;
