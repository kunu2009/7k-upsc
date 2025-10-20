import React, { useState, useEffect, useMemo } from 'react';
import { MCQS } from '../constants';
import { MCQData, Difficulty } from '../types';

const MCQ_PROGRESS_KEY = 'mcqProgress';
const MCQ_FEEDBACK_KEY = 'mcqFeedback';
const MCQ_BOOKMARKS_KEY = 'mcqBookmarks';

const EXAM_DURATION = 15 * 60; // 15 minutes
const EXAM_QUESTION_COUNT = 20;

const getInitialProgress = () => {
  try {
    const savedProgress = localStorage.getItem(MCQ_PROGRESS_KEY);
    if (savedProgress) {
      const { score } = JSON.parse(savedProgress);
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

const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const MCQSection: React.FC = () => {
  // Common State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(getInitialProgress().currentQuestionIndex);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Practice Mode State
  const [score, setScore] = useState(getInitialProgress().score);
  const [showAnswer, setShowAnswer] = useState(false);
  const [feedback, setFeedback] = useState(getInitialFeedback());
  const [copyStatus, setCopyStatus] = useState('Copy');
  const [bookmarks, setBookmarks] = useState(getInitialBookmarks());
  const [showOnlyBookmarked, setShowOnlyBookmarked] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | Difficulty>('All');
  
  // Exam Mode State
  const [isExamMode, setIsExamMode] = useState(false);
  const [examQuestions, setExamQuestions] = useState<MCQData[]>([]);
  const [examAnswers, setExamAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [examFinished, setExamFinished] = useState(false);

  // Memoized lists and current question
  const filteredMCQs = useMemo(() => {
    let mcqs = MCQS;
    
    if (selectedDifficulty !== 'All') {
        mcqs = mcqs.filter(mcq => mcq.difficulty === selectedDifficulty);
    }

    if (showOnlyBookmarked) {
        mcqs = mcqs.filter(mcq => bookmarks[mcq.id]);
    }
    
    // Shuffle the filtered list of questions
    return [...mcqs].sort(() => 0.5 - Math.random());
  }, [showOnlyBookmarked, bookmarks, selectedDifficulty]);

  const currentQuestion: MCQData | undefined = isExamMode ? examQuestions[currentQuestionIndex] : filteredMCQs[currentQuestionIndex];

  // Effects for Practice Mode
  useEffect(() => {
    if (isExamMode) return;
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowAnswer(false);
  }, [showOnlyBookmarked, isExamMode, selectedDifficulty]);

  useEffect(() => {
    if (isExamMode) return;
    try {
      const progress = JSON.stringify({ score });
      localStorage.setItem(MCQ_PROGRESS_KEY, progress);
    } catch (error) {
      console.error("Failed to save MCQ progress to localStorage", error);
    }
  }, [score, isExamMode]);

  useEffect(() => {
    if (isExamMode) return;
    try {
        localStorage.setItem(MCQ_FEEDBACK_KEY, JSON.stringify(feedback));
    } catch (error) {
        console.error("Failed to save MCQ feedback to localStorage", error);
    }
  }, [feedback, isExamMode]);
  
  useEffect(() => {
    if (isExamMode) return;
    try {
        localStorage.setItem(MCQ_BOOKMARKS_KEY, JSON.stringify(bookmarks));
    } catch (error) {
        console.error("Failed to save MCQ bookmarks to localStorage", error);
    }
  }, [bookmarks, isExamMode]);
  
  // Effect for Exam Timer
  useEffect(() => {
    if (!isExamMode || examFinished) return;
    if (timeLeft <= 0) {
        setExamFinished(true);
        return;
    }
    const timerId = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [isExamMode, examFinished, timeLeft]);
  
  // Exam Score Calculation
  const examScore = useMemo(() => {
    if (!examFinished) return 0;
    return examQuestions.reduce((score, question, index) => {
        if (examAnswers[index] === question.correctAnswerIndex) {
            return score + 1;
        }
        return score;
    }, 0);
  }, [examFinished, examQuestions, examAnswers]);

  // Exam Mode Controls
  const startExam = () => {
    const shuffled = [...MCQS].sort(() => 0.5 - Math.random());
    setExamQuestions(shuffled.slice(0, EXAM_QUESTION_COUNT));
    setCurrentQuestionIndex(0);
    setExamAnswers({});
    setTimeLeft(EXAM_DURATION);
    setIsExamMode(true);
    setExamFinished(false);
    setSelectedOption(null);
  };
  
  const exitExamMode = () => {
      setIsExamMode(false);
      setExamFinished(false);
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
  };
  
  const handleExamOptionSelect = (optionIndex: number) => {
    setExamAnswers(prev => ({ ...prev, [currentQuestionIndex]: optionIndex }));
    setSelectedOption(optionIndex);
  };

  const handleExamNext = () => {
    if (currentQuestionIndex < examQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(examAnswers[currentQuestionIndex + 1] ?? null);
    } else {
        setExamFinished(true);
    }
  };
  
  const handleExamPrev = () => {
      if (currentQuestionIndex > 0) {
          setCurrentQuestionIndex(currentQuestionIndex - 1);
          setSelectedOption(examAnswers[currentQuestionIndex - 1] ?? null);
      }
  };
  
  const finishExam = () => setExamFinished(true);

  const jumpToQuestion = (index: number) => {
    if (index >= 0 && index < examQuestions.length) {
      setCurrentQuestionIndex(index);
      setSelectedOption(examAnswers[index] ?? null);
    }
  };

  // Practice Mode Controls
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
    if (selectedOption === null || !currentQuestion) return;
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
       setCurrentQuestionIndex(0);
    }
  };
  
  const toggleBookmark = () => {
      if (!currentQuestion) return;
      setBookmarks(prev => ({ ...prev, [currentQuestion.id]: !prev[currentQuestion.id] }));
  };

  const handleFeedback = (feedbackType: 'liked' | 'disliked') => {
    if (!currentQuestion) return;
    setFeedback(prev => {
        const newFeedback = prev[currentQuestion.id] === feedbackType ? null : feedbackType;
        return { ...prev, [currentQuestion.id]: newFeedback };
    });
  };

  const handleCopyExplanation = () => {
    if (navigator.clipboard && currentQuestion) {
        navigator.clipboard.writeText(currentQuestion.explanation).then(() => {
            setCopyStatus('Copied!');
            setTimeout(() => setCopyStatus('Copy'), 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            setCopyStatus('Failed');
        });
    }
  };

  // Dynamic Class Helpers
  const getPracticeOptionClass = (index: number) => {
    if (!showAnswer || !currentQuestion) {
      return selectedOption === index ? 'bg-sky-500' : 'bg-slate-700 hover:bg-slate-600';
    }
    if (index === currentQuestion.correctAnswerIndex) return 'bg-green-600';
    if (index === selectedOption) return 'bg-red-600';
    return 'bg-slate-700';
  };
  
  const getExamOptionClass = (index: number) => {
    return selectedOption === index ? 'bg-sky-500 ring-2 ring-sky-300' : 'bg-slate-700 hover:bg-slate-600';
  };

  const getResultsOptionClass = (q: MCQData, optionIndex: number, userAnswerIndex: number | undefined) => {
      const isCorrect = optionIndex === q.correctAnswerIndex;
      const isUserAnswer = optionIndex === userAnswerIndex;

      if (isCorrect) return 'bg-green-600/80 ring-2 ring-green-400';
      if (isUserAnswer) return 'bg-red-600/80 ring-2 ring-red-400';
      return 'bg-slate-700';
  };
  
  const DifficultySelector = () => (
    <div className="flex flex-wrap justify-center gap-2 mb-6">
      {(['All', 'Easy', 'Medium', 'Hard'] as const).map(level => (
        <button
          key={level}
          onClick={() => setSelectedDifficulty(level)}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            selectedDifficulty === level
              ? 'bg-sky-600 text-white'
              : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
          }`}
        >
          {level}
        </button>
      ))}
    </div>
  );

  // Conditional Rendering
  if (isExamMode) {
    if (examFinished) {
      // Exam Results View
      return (
        <div className="max-w-3xl mx-auto p-4">
            <div className="bg-slate-800 p-6 rounded-lg shadow-xl text-center">
                <h2 className="text-3xl font-bold text-sky-400">Exam Over!</h2>
                <p className="text-4xl font-bold mt-4">Score: {examScore} / {examQuestions.length}</p>
                <p className="text-slate-400 mt-2">Time Taken: {formatTime(EXAM_DURATION - timeLeft)}</p>
                <div className="flex justify-center space-x-4 mt-6">
                    <button onClick={startExam} className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">Retry Exam</button>
                    <button onClick={exitExamMode} className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">Back to Practice</button>
                </div>
            </div>

            <div className="mt-8">
                <h3 className="text-2xl font-bold mb-4 text-center">Review Your Answers</h3>
                <div className="space-y-6">
                    {examQuestions.map((q, idx) => (
                        <div key={q.id} className="bg-slate-800 p-5 rounded-lg shadow-lg">
                            <p className="font-semibold text-lg">Q{idx + 1}: {q.question}</p>
                            <div className="space-y-3 mt-4">
                                {q.options.map((opt, optIdx) => (
                                    <div key={optIdx} className={`p-3 rounded-lg text-left ${getResultsOptionClass(q, optIdx, examAnswers[idx])}`}>
                                        {opt}
                                        {optIdx === q.correctAnswerIndex && <span className="font-bold ml-2">(Correct)</span>}
                                        {optIdx === examAnswers[idx] && optIdx !== q.correctAnswerIndex && <span className="font-bold ml-2">(Your Answer)</span>}
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 p-3 bg-slate-900 rounded-md">
                                <p className="font-semibold text-emerald-400">Explanation:</p>
                                <p className="text-slate-300 mt-1">{q.explanation}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      );
    }
    
    // Active Exam View
    if (!currentQuestion) return null; // Should not happen in exam mode
    return (
        <div className="max-w-2xl mx-auto p-4">
          <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
            <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-4">
                <h2 className="text-xl font-bold text-emerald-400">Exam Mode</h2>
                <div className="text-lg font-mono bg-slate-900 px-3 py-1 rounded-md text-red-400">
                    {formatTime(timeLeft)}
                </div>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-slate-400 mb-2 text-center">Question Progress</p>
              <div className="grid grid-cols-10 gap-1.5">
                {examQuestions.map((_, index) => {
                  const isAnswered = examAnswers[index] !== undefined;
                  const isCurrent = index === currentQuestionIndex;
                  
                  let buttonClass = 'h-6 w-full rounded transition-colors ';
                  if (isCurrent) {
                    buttonClass += 'ring-2 ring-emerald-400 ';
                  }
                  if (isAnswered) {
                    buttonClass += 'bg-sky-600 hover:bg-sky-500';
                  } else {
                    buttonClass += 'bg-slate-700 hover:bg-slate-600';
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => jumpToQuestion(index)}
                      className={buttonClass}
                      aria-label={`Go to question ${index + 1}`}
                    >
                      <span className="sr-only">{index + 1}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div className="bg-slate-900/50 p-5 rounded-lg">
                 <div className="flex justify-between items-center mb-4 text-slate-400">
                    <span>Question {currentQuestionIndex + 1}/{examQuestions.length}</span>
                    <button onClick={finishExam} className="text-sm font-semibold text-red-400 hover:underline">Submit Exam</button>
                 </div>
                 <p className="text-lg font-semibold mb-6 text-white min-h-[5rem]">{currentQuestion.question}</p>
                 <div className="space-y-4">
                    {currentQuestion.options.map((option, index) => (
                        <button key={index} onClick={() => handleExamOptionSelect(index)} className={`w-full text-left p-4 rounded-lg transition-colors duration-200 ${getExamOptionClass(index)}`}>
                        {option}
                        </button>
                    ))}
                 </div>
            </div>

             <div className="flex justify-between mt-8">
                <button onClick={handleExamPrev} disabled={currentQuestionIndex === 0} className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    Previous
                </button>
                <button onClick={handleExamNext} className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                    {currentQuestionIndex === examQuestions.length - 1 ? 'Finish' : 'Next'}
                </button>
             </div>
          </div>
        </div>
    );
  }

  // Practice Mode View
  if (!currentQuestion) {
      return (
        <div className="max-w-2xl mx-auto p-4 text-center">
            <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
                 <DifficultySelector />
                <h2 className="text-xl font-bold text-sky-400 mb-4">No Questions Found</h2>
                <p className="text-slate-300 mb-6">
                    There are no questions for the selected filter. Try changing the difficulty or showing all bookmarked questions.
                </p>
                <button onClick={() => {setShowOnlyBookmarked(false); setSelectedDifficulty('All');}} className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                    Reset Filters
                </button>
            </div>
        </div>
      );
  }

  const currentFeedback = feedback[currentQuestion.id];
  const isBookmarked = bookmarks[currentQuestion.id];

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
        <DifficultySelector />
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
                 <button onClick={startExam} className="text-sm font-semibold bg-emerald-600/80 text-white hover:bg-emerald-600 px-3 py-2 rounded-lg transition-colors">Exam Mode</button>
                 <button onClick={handleReset} className="text-xs font-semibold uppercase bg-red-600/20 text-red-400 hover:bg-red-600/40 px-2 py-1 rounded transition-colors">Reset Score</button>
            </div>
        </div>
        
        <div className="flex items-start">
            <p className="flex-grow text-lg font-semibold mb-6 text-white">{currentQuestion.question}</p>
            <button onClick={toggleBookmark} className="ml-4 p-2 rounded-full hover:bg-slate-700 transition-colors" aria-label="Bookmark question">
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
              className={`w-full text-left p-4 rounded-lg transition-colors duration-200 ${getPracticeOptionClass(index)}`}
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