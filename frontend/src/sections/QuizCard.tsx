import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Clock } from 'lucide-react';
import type { Question } from '../data/questions';

interface QuizCardProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  onAnswer: (stream: string, weight: number) => void;
  timeLeft: number;
}

const QuizCard = ({ question, currentIndex, totalQuestions, onAnswer, timeLeft }: QuizCardProps) => {
  if (!question) return null;
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [funnyStatus, setFunnyStatus] = useState("Analyzing your potential...");
  const [liveCount, setLiveCount] = useState(Math.floor(Math.random() * (3600 - 3400) + 3400));
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveCount(prev => {
        const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
        return prev + change;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const statusMessages = [
    "Decoding your brain cells... 🧠",
    "Consulting the career stars... ✨",
    "Matching your vibes with reality... 🔮",
    "Scanning for hidden talents... 🔍",
    "Wait, you might be a genius! 💡",
    "Calculating your future salary... 💸",
    "Almost a career detective... 🕵️",
    "Connecting dots you didn't know existed... 📍",
    "Optimizing your life path... 🚀",
    "Almost worth a million dollars! 💎"
  ];

  useEffect(() => {
    // Change funny status every few questions
    if (currentIndex % 3 === 0) {
      const randomStatus = statusMessages[Math.floor(Math.random() * statusMessages.length)];
      setFunnyStatus(randomStatus);
    }
  }, [currentIndex]);

  // Reset selected option when question changes
  useEffect(() => {
    setSelectedOption(null);
  }, [question.id]);

  const handleOptionClick = (index: number, stream: string, weight: number) => {
    setSelectedOption(index);
    // Clear any potential browser text selection or highlights
    window.getSelection()?.removeAllRanges();
    
    // Tiny delay to show selection effect and ensure focus is gone
    setTimeout(() => {
      onAnswer(stream, weight);
    }, 200);
  };

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Progress Header */}
      <div className="bg-slate-50 p-4 border-b border-slate-100">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-blue-600 font-bold">{currentIndex + 1}</span>
              <span className="text-slate-400">/</span>
              <span className="text-slate-500 text-sm">{totalQuestions}</span>
            </div>
            <div className={`flex items-center gap-1.5 text-sm font-bold ${timeLeft < 300 ? 'text-rose-500 animate-pulse' : 'text-slate-600'}`}>
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeLeft)}</span>
            </div>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-full gradient-primary"
            />
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 flex flex-col px-4 py-4 max-w-md mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col"
          >
            {/* Question */}
            <div className="mb-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="inline-flex items-center gap-1.5 bg-blue-100 rounded-full px-3 py-1 mb-3"
              >
                <span className="text-blue-700 text-xs font-semibold">Question {currentIndex + 1}</span>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg font-bold text-slate-900 leading-snug"
              >
                {question.question}
              </motion.h2>
            </div>

            {/* Options */}
            <div className={`space-y-2.5 flex-1 ${selectedOption !== null ? 'pointer-events-none' : ''}`}>
              {question.options.map((option, index) => (
                <motion.button
                  key={`${question.id}-${index}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + index * 0.05 }}
                  whileTap={{ scale: 0.98 }}
                  tabIndex={-1}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    (e.currentTarget as HTMLButtonElement).blur();
                    handleOptionClick(index, option.stream, option.weight);
                  }}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                  className={`w-full select-none touch-none outline-none border-2 rounded-xl p-3.5 text-left transition-all duration-200 ${
                    selectedOption === index 
                    ? 'border-blue-500 bg-blue-50/30' 
                    : 'border-slate-100 bg-white'
                  } shadow-sm`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                      selectedOption === index ? 'bg-blue-600' : 'bg-slate-100'
                    }`}>
                      <span className={`text-xs font-bold transition-colors ${
                        selectedOption === index ? 'text-white' : 'text-slate-600'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </span>
                    </div>
                    <span className={`text-sm transition-colors ${
                      selectedOption === index ? 'text-blue-900 font-bold' : 'text-slate-700 font-medium'
                    }`}>
                      {option.text}
                    </span>
                    <ChevronRight className={`w-4 h-4 ml-auto transition-all ${
                      selectedOption === index ? 'text-blue-600 opacity-100 translate-x-1' : 'text-slate-300 opacity-0'
                    }`} />
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Motivation & Marketing - Single line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-8 flex items-center justify-center gap-3 px-2"
            >
              <motion.div 
                key={funnyStatus}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-blue-50/50 text-blue-600 px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap"
              >
                {funnyStatus}
              </motion.div>

              <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                <div className="relative flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping opacity-50"></div>
                </div>
                <span className="text-[11px] font-black text-slate-700 whitespace-nowrap">
                  {liveCount.toLocaleString()} Live 
                </span>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default QuizCard;
