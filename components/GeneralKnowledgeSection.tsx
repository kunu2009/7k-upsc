import React, { useState } from 'react';
import { GENERAL_KNOWLEDGE_DATA } from '../constants';

const AccordionItem: React.FC<{
    question: string;
    answer: string;
    category: string;
    isOpen: boolean;
    onClick: () => void;
}> = ({ question, answer, category, isOpen, onClick }) => {
    return (
        <div className="border-b border-slate-700">
            <button
                onClick={onClick}
                className="w-full text-left p-4 flex justify-between items-center hover:bg-slate-700/50 transition-colors duration-200"
            >
                <div className="flex flex-col">
                    <span className="text-xs text-sky-400 font-semibold uppercase">{category}</span>
                    <h3 className="text-md font-semibold mt-1 text-white">{question}</h3>
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
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                <div className="p-4 bg-slate-900/50">
                    <p className="text-slate-300 whitespace-pre-line">{answer}</p>
                </div>
            </div>
        </div>
    );
};


const GeneralKnowledgeSection: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="max-w-3xl mx-auto p-4">
            <h2 className="text-3xl font-bold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">General Knowledge</h2>
            <p className="text-slate-400 mb-8 text-center">Essential facts and questions across various subjects.</p>
            <div className="bg-slate-800 rounded-lg shadow-xl overflow-hidden">
                {GENERAL_KNOWLEDGE_DATA.map((item, index) => (
                    <AccordionItem
                        key={item.id}
                        question={item.question}
                        answer={item.answer}
                        category={item.category}
                        isOpen={openIndex === index}
                        onClick={() => handleToggle(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default GeneralKnowledgeSection;