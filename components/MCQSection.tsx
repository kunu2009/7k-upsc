
import React, { useState, useEffect } from 'react';
import { MCQS } from '../constants';
import { MCQData } from '../types';

const STORAGE_KEY = 'mcqProgress';

const getInitialState = () => {
  try {
    const savedProgress = localStorage.getItem(STORAGE_KEY);
    if (savedProgress) {
      const { currentQuestionIndex, score } = JSON.parse(savedProgress);
      // Basic validation to prevent errors from malformed data
      if (typeof currentQuestionIndex === 'number' && typeof score === 'number' && currentQuestionIndex < MCQS.length) {
        return { currentQuestionIndex, score };
      }
    }
  } catch (error) {
    console.error("Failed to parse MCQ progress from localStorage", error);
  }
  return { currentQuestionIndex: 0, score: 0 };
};


const MCQSection: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(getInitialState().currentQuestionIndex);
  const [score, setScore] = useState(getInitialState().score);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    try {
      const progress = JSON.stringify({ currentQuestionIndex, score });
      localStorage.setItem(STORAGE_KEY, progress);
    } catch (error) {
      console.error("Failed to save MCQ progress to localStorage", error);
    }
  }, [currentQuestionIndex, score]);


  const currentQuestion: MCQData = MCQS[currentQuestionIndex];

  const handleOptionSelect = (index: number) => {
    if (showAnswer) return;
    setSelectedOption(index);
  };
  
  const handleReset = () => {
    setShowAnswer(false);
    setSelectedOption(null);
    setCurrentQuestionIndex(0);
    setScore(0);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    setShowAnswer(true);
    if (selectedOption === currentQuestion.correctAnswerIndex) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    setShowAnswer(false);
    setSelectedOption(null);
    if (currentQuestionIndex < MCQS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz finished, reset
      handleReset();
    }
  };

  const getOptionClass = (index: number) => {
    if (!showAnswer) {
      return selectedOption === index ? 'bg-sky-500' : 'bg-slate-700 hover:bg-slate-600';
    }
    if (index === currentQuestion.correctAnswerIndex) {
      return 'bg-green-600';
    }
    if (index === selectedOption) {
      return 'bg-red-600';
    }
    return 'bg-slate-700';
  };
  
  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
        <div className="flex justify-between items-center mb-4 text-slate-400">
          <span>Question {currentQuestionIndex + 1}/{MCQS.length}</span>
           <div className="flex items-center space-x-4">
             <span className="font-semibold text-sky-400">Score: {score}</span>
             <button
               onClick={handleReset}
               className="text-xs font-semibold uppercase bg-red-600/20 text-red-400 hover:bg-red-600/40 px-2 py-1 rounded transition-colors"
             >
               Reset
             </button>
           </div>
        </div>
        <p className="text-lg font-semibold mb-6 text-white">{currentQuestion.question}</p>
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
        {showAnswer && (
          <div className="mt-6 p-4 bg-slate-900 rounded-lg">
            <h3 className="font-bold text-lg text-emerald-400">Explanation</h3>
            <p className="mt-2 text-slate-300">{currentQuestion.explanation}</p>
          </div>
        )}
        <div className="mt-8">
          {showAnswer ? (
            <button
              onClick={handleNextQuestion}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              {currentQuestionIndex < MCQS.length - 1 ? 'Next Question' : 'Restart Quiz'}
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

export default MCQSection;
