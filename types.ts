export enum Subject {
  History = "History",
  Polity = "Polity",
  Geography = "Geography",
  Economy = "Economy",
  CurrentAffairs = "Current Affairs",
  GeneralKnowledge = "General Knowledge",
  Interview = "Interview Prep",
  Strategy = "Exam Strategy",
  ScienceTech = "Science & Tech",
  Environment = "Environment & Ecology",
  ArtCulture = "Art & Culture",
  Ethics = "Ethics",
}

export type Page = 'reels' | 'mcqs' | 'flashcards' | 'interview' | 'current_affairs';

export interface ReelCardData {
  id: number;
  subject: Subject;
  title: string;
  content: string;
  gradient: string;
}

export interface MCQData {
  id: number;
  subject: Subject;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface FlashcardData {
  id: number;
  subject: Subject;
  question: string;
  answer: string;
}

export interface InterviewQuestionData {
    id: number;
    question: string;
    answer: string;
    category: 'Personal' | 'Situational' | 'Technical';
}

export interface CurrentAffairsData {
    id: number;
    date: string;
    title: string;
    summary: string;
    category: Subject;
}
