import React, { useState, useEffect, useMemo } from 'react';
import { FLASHCARDS } from '../constants';

interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswerIndex: number;
}

const generateQuiz = (): QuizQuestion[] => {
    const shuffledFlashcards = [...FLASHCARDS].sort(() => 0.5 - Math.random());
    const allAnswers = FLASHCARDS.map(card => card.answer);

    return shuffledFlashcards.map(card => {
        const correctAnswer = card.answer;
        
        let distractors = allAnswers.filter(answer => answer !== correctAnswer);
        distractors.sort(() => 0.5 - Math.random());
        distractors = distractors.slice(0, 3);

        const options = [correctAnswer, ...distractors].sort(() => 0.5 - Math.random());
        const correctAnswerIndex = options.indexOf(correctAnswer);

        return {
            question: card.question,
            options,
            correctAnswerIndex
        };
    });
};

const FlashcardQuiz: React.FC = () => {
    const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [quizFinished, setQuizFinished] = useState(false);

    useEffect(() => {
        startNewQuiz();
    }, []);

    const startNewQuiz = () => {
        setQuizQuestions(generateQuiz());
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setScore(0);
        setShowAnswer(false);
        setQuizFinished(false);
    };

    const currentQuestion = quizQuestions[currentQuestionIndex];

    const handleOptionSelect = (index: number) => {
        if (showAnswer) return;
        setSelectedOption(index);
    };

    const handleCheckAnswer = () => {
        if (selectedOption === null) return;
        setShowAnswer(true);
        if (selectedOption === currentQuestion.correctAnswerIndex) {
            setScore(prev => prev + 1);
        }
    };
    
    const handleNextQuestion = () => {
        if (currentQuestionIndex < quizQuestions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedOption(null);
            setShowAnswer(false);
        } else {
            setQuizFinished(true);
        }
    };

    const getOptionClass = (index: number) => {
        if (!showAnswer) {
            return selectedOption === index ? 'bg-sky-500' : 'bg-slate-700 hover:bg-slate-600';
        }
        if (index === currentQuestion.correctAnswerIndex) return 'bg-green-600';
        if (index === selectedOption) return 'bg-red-600';
        return 'bg-slate-700';
    };

    if (quizQuestions.length === 0) {
        return <div className="text-center text-slate-400">Loading quiz...</div>;
    }
    
    if (quizFinished) {
        return (
            <div className="max-w-xl mx-auto p-4 text-center">
                <div className="bg-slate-800 p-8 rounded-lg shadow-xl">
                    <h2 className="text-3xl font-bold text-sky-400">Quiz Complete!</h2>
                    <p className="text-4xl font-bold my-4">Final Score: {score} / {quizQuestions.length}</p>
                    <button 
                        onClick={startNewQuiz} 
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-lg transition-colors mt-6 text-lg"
                    >
                        Play Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto p-4">
            <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
                <div className="flex justify-between items-center mb-4 text-slate-400 font-semibold">
                    <span>Question {currentQuestionIndex + 1}/{quizQuestions.length}</span>
                    <span>Score: {score}</span>
                </div>
                
                <p className="text-lg font-semibold mb-6 text-white min-h-[6rem]">{currentQuestion.question}</p>

                <div className="space-y-4">
                    {currentQuestion.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleOptionSelect(index)}
                            disabled={showAnswer}
                            className={`w-full text-left p-4 rounded-lg transition-colors duration-200 ${getOptionClass(index)}`}
                        >
                            {option}
                        </button>
                    ))}
                </div>

                <div className="mt-8">
                    {showAnswer ? (
                        <button
                            onClick={handleNextQuestion}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                        >
                            {currentQuestionIndex < quizQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                        </button>
                    ) : (
                        <button
                            onClick={handleCheckAnswer}
                            disabled={selectedOption === null}
                            className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
                        >
                            Check Answer
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FlashcardQuiz;
