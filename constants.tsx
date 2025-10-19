
import React from 'react';
import { Subject, ReelCardData, MCQData, FlashcardData, InterviewQuestionData } from './types';

export const REEL_CARDS: ReelCardData[] = [
    { id: 1, subject: Subject.History, title: 'Ancient India', content: 'The Harappan civilization, one of the world\'s oldest urban cultures, flourished in the Indus River basin from about 2500 BCE to 1900 BCE.', gradient: 'from-amber-500 to-orange-600' },
    { id: 2, subject: Subject.Polity, title: 'Fundamental Rights', content: 'Part III of the Indian Constitution (Articles 12-35) contains the Fundamental Rights, which are essential for the all-round development of individuals.', gradient: 'from-sky-500 to-indigo-600' },
    { id: 3, subject: Subject.Geography, title: 'Monsoon Winds', content: 'The Indian monsoon is a seasonal reversal of winds. The southwest monsoon brings heavy rainfall from June to September, crucial for the country\'s agriculture.', gradient: 'from-teal-500 to-cyan-600' },
    { id: 4, subject: Subject.Economy, title: 'Planning Commission', content: 'The Planning Commission was replaced by NITI Aayog (National Institution for Transforming India) on January 1, 2015, to foster cooperative federalism.', gradient: 'from-rose-500 to-pink-600' },
    { id: 5, subject: Subject.CurrentAffairs, title: 'G20 Summit', content: 'India hosted the G20 summit for the first time in 2023, with the theme "Vasudhaiva Kutumbakam" or "One Earth · One Family · One Future".', gradient: 'from-violet-500 to-fuchsia-600' },
    { id: 6, subject: Subject.Strategy, title: 'Answer Writing', content: 'Consistent practice in answer writing is key. Focus on structure: introduction, body with multiple dimensions, and a forward-looking conclusion.', gradient: 'from-lime-500 to-green-600' },
];

export const MCQS: MCQData[] = [
    { id: 1, subject: Subject.Polity, question: 'Which article of the Indian Constitution deals with the Right to Equality?', options: ['Article 14', 'Article 19', 'Article 21', 'Article 32'], correctAnswerIndex: 0, explanation: 'Article 14 guarantees equality before the law and equal protection of the laws to all persons within the territory of India.' },
    { id: 2, subject: Subject.History, question: 'The Battle of Plassey was fought in:', options: ['1757', '1764', '1857', '1947'], correctAnswerIndex: 0, explanation: 'The Battle of Plassey was a decisive victory of the British East India Company over the Nawab of Bengal and his French allies on 23 June 1757.' },
    { id: 3, subject: Subject.Geography, question: 'Which is the highest peak in India?', options: ['Mount Everest', 'K2', 'Kangchenjunga', 'Nanda Devi'], correctAnswerIndex: 2, explanation: 'Kangchenjunga, located in Sikkim, is the highest peak in India and the third highest in the world. K2 is in POK.' },
    { id: 4, subject: Subject.Economy, question: 'What does "Fiscal Deficit" mean?', options: ['Total revenue minus total expenditure', 'Government\'s total expenditure minus its total revenue, excluding borrowing', 'Revenue deficit plus capital expenditure', 'Government\'s market borrowings'], correctAnswerIndex: 1, explanation: 'Fiscal Deficit is the difference between the total expenditure of the government and its total revenue, which indicates the total borrowing needs of the government.' },
    { id: 5, subject: Subject.CurrentAffairs, question: 'Who is the current Chief Justice of India (as of late 2023)?', options: ['N. V. Ramana', 'U. U. Lalit', 'D. Y. Chandrachud', 'S. A. Bobde'], correctAnswerIndex: 2, explanation: 'Justice Dhananjaya Y. Chandrachud is the 50th and current Chief Justice of India.' },
];

export const FLASHCARDS: FlashcardData[] = [
    { id: 1, subject: Subject.Polity, question: 'What is a "Writ of Mandamus"?', answer: 'It is a judicial writ issued as a command to an inferior court or ordering a person to perform a public or statutory duty.' },
    { id: 2, subject: Subject.History, question: 'Who was the founder of the Mauryan Empire?', answer: 'Chandragupta Maurya, who founded the empire in 322 BCE.' },
    { id: 3, subject: Subject.Economy, question: 'Define "Repo Rate".', answer: 'The rate at which the Reserve Bank of India (RBI) lends money to commercial banks in the event of any shortfall of funds.' },
    { id: 4, subject: Subject.Geography, question: 'Name the major soil type found in the Deccan Plateau.', answer: 'Black Soil (or Regur soil), which is ideal for cotton cultivation.' },
    { id: 5, subject: Subject.GeneralKnowledge, question: 'What is the full form of ISRO?', answer: 'Indian Space Research Organisation.' },
];


export const INTERVIEW_QUESTIONS: InterviewQuestionData[] = [
    { id: 1, category: 'Personal', question: 'Why do you want to join the Civil Services?', answer: 'Focus on the platform it provides for public service, the diversity of challenges, and the opportunity to contribute to nation-building. Link your personal skills and experiences to the demands of the service.' },
    { id: 2, category: 'Situational', question: 'You are a District Magistrate. There is a communal riot in your district. What are your immediate steps?', answer: '1. Impose Section 144. 2. Deploy police forces to sensitive areas. 3. Call for a peace meeting with community leaders. 4. Ensure safety of women and children. 5. Coordinate with higher authorities and manage media communication to prevent rumors.' },
    { id: 3, category: 'Technical', question: 'What are your views on the farm laws that were repealed?', answer: 'Provide a balanced view. Acknowledge the government\'s intent (e.g., market reforms, increasing farmer income) but also discuss the concerns of the farmers (e.g., MSP guarantee, corporate control). Conclude by suggesting a path forward involving wider consultations.' },
    { id: 4, category: 'Personal', question: 'Tell me about your strengths and weaknesses.', answer: 'For strengths, choose qualities relevant to an administrator like integrity, leadership, and problem-solving, and provide brief examples. For weaknesses, choose a real but manageable weakness (e.g., "I sometimes get too involved in details") and explain how you are working to improve it.' },
];

// Icons
export const ICONS = {
    reels: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4" /></svg>,
    mcqs: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    flashcards: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2H5a2 2 0 00-2 2v2m14 0h-2" /></svg>,
    interview: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
};
