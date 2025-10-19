
import React, { useState, useEffect, useMemo } from 'react';
import { MCQS } from '../constants';
import { MCQData } from '../types';

const MCQ_PROGRESS_KEY = 'mcqProgress';
const MCQ_FEEDBACK_KEY = 'mcqFeedback';
const MCQ_BOOKMARKS_KEY = 'mcqBookmarks';

const getInitialProgress = () => {
  try {
    const savedProgress = localStorage.getItem(MCQ_PROGRESS_KEY);
    if (savedProgress) {
      const { score } = JSON.parse(savedProgress);
      // We reset the question index to 0 on each load to avoid confusion with filters.
      if (typeof score === 'number') {
        return { currentQuestionIndex: 0, score };
      }
    }
  } catch (error) {
    console.error("Failed to parse MCQ progress from localStorage", error);
  }
  return { currentQuestionIndex: 0, score: 0 };
};

const getInitialFeedback = (): Record<number, 'liked' | 'disliked' | null> => {
    try {
        const savedFeedback = localStorage.getItem(MCQ_FEEDBACK_KEY);
        return savedFeedback ? JSON.parse(savedFeedback) : {};
    } catch (error) {
        console.error("Failed to parse MCQ feedback from localStorage", error);
        return {};
    }
};

const getInitialBookmarks = (): Record<number, boolean> => {
    try {
        const savedBookmarks = localStorage.getItem(MCQ_BOOKMARKS_KEY);
        return savedBookmarks ? JSON.parse(savedBookmarks) : {};
    } catch (error) {
        console.error("Failed to parse MCQ bookmarks from localStorage", error);
        return {};
    }
};

const MCQSection: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(getInitialProgress().currentQuestionIndex);
  const [score, setScore] = useState(getInitialProgress().score);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [feedback, setFeedback] = useState(getInitialFeedback());
  const [copyStatus, setCopyStatus] = useState('Copy');
  const [bookmarks, setBookmarks] = useState(getInitialBookmarks());
  const [showOnlyBookmarked, setShowOnlyBookmarked] = useState(false);

  const filteredMCQs = useMemo(() => {
    if (showOnlyBookmarked) {
        return MCQS.filter(mcq => bookmarks[mcq.id]);
    }
    return MCQS;
  }, [showOnlyBookmarked, bookmarks]);

  useEffect(() => {
    // Reset index when filter changes to avoid out-of-bounds errors
    setCurrentQuestionIndex(0);
  }, [showOnlyBookmarked]);


  useEffect(() => {
    try {
      // Save score but not index, as index resets on load
      const progress = JSON.stringify({ score });
      localStorage.setItem(MCQ_PROGRESS_KEY, progress);
    } catch (error) {
      console.error("Failed to save MCQ progress to localStorage", error);
    }
  }, [score]);

  useEffect(() => {
    try {
        localStorage.setItem(MCQ_FEEDBACK_KEY, JSON.stringify(feedback));
    } catch (error) {
        console.error("Failed to save MCQ feedback to localStorage", error);
    }
  }, [feedback]);
  
  useEffect(() => {
    try {
        localStorage.setItem(MCQ_BOOKMARKS_KEY, JSON.stringify(bookmarks));
    } catch (error) {
        console.error("Failed to save MCQ bookmarks to localStorage", error);
    }
  }, [bookmarks]);

  const currentQuestion: MCQData | undefined = filteredMCQs[currentQuestionIndex];

  if (!currentQuestion) {
      return (
        <div className="max-w-2xl mx-auto p-4 text-center">
            <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
                <h2 className="text-xl font-bold text-sky-400 mb-4">No Questions Found</h2>
                <p className="text-slate-300 mb-6">You haven't bookmarked any questions yet. Clear the filter to see all questions.</p>
                <button
                    onClick={() => setShowOnlyBookmarked(false)}
                    className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                    Show All Questions
                </button>
            </div>
        </div>
      );
  }

  const handleOptionSelect = (index: number) => {
    if (showAnswer) return;
    setSelectedOption(index);
  };
  
  const handleReset = () => {
    setShowAnswer(false);
    setSelectedOption(null);
    setCurrentQuestionIndex(0);
    setScore(0);
    localStorage.removeItem(MCQ_PROGRESS_KEY);
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
    setCopyStatus('Copy');
    if (currentQuestionIndex < filteredMCQs.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz finished for the current filter
       setCurrentQuestionIndex(0); // Restart this set of questions
    }
  };
  
  const toggleBookmark = () => {
      const questionId = currentQuestion.id;
      setBookmarks(prev => ({
          ...prev,
          [questionId]: !prev[questionId]
      }));
  };

  const handleFeedback = (feedbackType: 'liked' | 'disliked') => {
    const questionId = currentQuestion.id;
    setFeedback(prev => {
        const newFeedback = prev[questionId] === feedbackType ? null : feedbackType;
        return { ...prev, [questionId]: newFeedback };
    });
  };

  const handleCopyExplanation = () => {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(currentQuestion.explanation).then(() => {
            setCopyStatus('Copied!');
            setTimeout(() => setCopyStatus('Copy'), 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            setCopyStatus('Failed');
        });
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
  
  const currentFeedback = feedback[currentQuestion.id];
  const isBookmarked = bookmarks[currentQuestion.id];

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
        <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2 text-slate-400">
                <span>Question {currentQuestionIndex + 1}/{filteredMCQs.length}</span>
            </div>
            <div className="flex items-center space-x-2">
                 <label htmlFor="bookmark-toggle" className="flex items-center cursor-pointer text-sm text-slate-400">
                    <span className="mr-2">Bookmarked</span>
                    <div className="relative">
                        <input id="bookmark-toggle" type="checkbox" className="sr-only" checked={showOnlyBookmarked} onChange={() => setShowOnlyBookmarked(!showOnlyBookmarked)} />
                        <div className="block bg-slate-600 w-10 h-6 rounded-full"></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${showOnlyBookmarked ? 'transform translate-x-full bg-sky-400' : ''}`}></div>
                    </div>
                 </label>
                 <button onClick={handleReset} className="text-xs font-semibold uppercase bg-red-600/20 text-red-400 hover:bg-red-600/40 px-2 py-1 rounded transition-colors">Reset Score</button>
            </div>
        </div>
        
        <div className="flex items-start">
            <p className="flex-grow text-lg font-semibold mb-6 text-white">{currentQuestion.question}</p>
            <button onClick={toggleBookmark} className="ml-4 p-2 rounded-full hover:bg-slate-700 transition-colors" aria-label="Bookmark question">
                {/* FIX: Combined duplicate className attributes into one. */}
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isBookmarked ? 'text-sky-400' : 'text-slate-400'}`} fill={isBookmarked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
            </button>
        </div>

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
            <div className="flex items-center justify-end space-x-2 mt-4">
              <button onClick={() => handleFeedback('liked')} className={`flex items-center p-2 rounded-md transition-colors ${currentFeedback === 'liked' ? 'bg-green-500/20 text-green-400' : 'text-slate-400 hover:bg-slate-700'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333V17a1 1 0 001 1h6.364a1 1 0 00.949-.684l2.121-6.364A1 1 0 0016.121 10H13V4.333a1 1 0 00-1-1l-1.333.667a1 1 0 00-.667 1.11L10.833 10H6z" /></svg>
              </button>
              <button onClick={() => handleFeedback('disliked')} className={`flex items-center p-2 rounded-md transition-colors ${currentFeedback === 'disliked' ? 'bg-red-500/20 text-red-400' : 'text-slate-400 hover:bg-slate-700'}`}>
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667V3a1 1 0 00-1-1h-6.364a1 1 0 00-.949.684L3.565 9A1 1 0 004.879 10H7v5.667a1 1 0 001 1l1.333-.667a1 1 0 00.667-1.11L9.167 10H14z" /></svg>
              </button>
              <button onClick={handleCopyExplanation} className="flex items-center text-sm font-semibold bg-slate-700 text-slate-300 hover:bg-slate-600 px-3 py-2 rounded-md transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" /><path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h6a2 2 0 00-2-2H5z" /></svg>
                {copyStatus}
              </button>
            </div>
          </div>
        )}
        <div className="mt-8">
          {showAnswer ? (
            <button
              onClick={handleNextQuestion}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              {currentQuestionIndex < filteredMCQs.length - 1 ? 'Next Question' : 'Restart Set'}
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