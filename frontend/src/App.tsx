import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LandingSection from './sections/LandingSection';
import LeadForm from './sections/LeadForm';
import QuizCard from './sections/QuizCard';
import AnalyzingScreen from './sections/AnalyzingScreen';
import BlurredReport from './sections/BlurredReport';
import AdminPanel from './sections/AdminPanel';
import AdminLogin from './sections/AdminLogin';
import { questions, getRecommendedStream, type Answer } from './data/questions';
import { ArrowRight } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

export type AppState = 'landing' | 'form' | 'quiz' | 'analyzing' | 'report' | 'admin' | 'admin-login';

export interface UserData {
  name: string;
  mobile: string;
  email: string;
  location: string;
}

const STORAGE_KEY = 'career_counselor_state';

// Helper to shuffle array
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

function App() {
  // Load state from localStorage on initialize
  const loadState = () => {
    // Priority 1: Direct URL access to /admin
    if (window.location.pathname === '/admin') {
      return {
        appState: 'admin-login',
        userData: { name: '', mobile: '', email: '', location: '' },
        currentQuestionIndex: 0,
        answers: [],
        result: null,
        timeLeft: 3600,
        studentId: null,
        shuffledQuestions: shuffleArray(questions)
      };
    }

    // Priority 2: Saved state from localStorage
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // If they are on root '/', but state says admin, force landing
        if (window.location.pathname === '/' && (parsed.appState === 'admin' || parsed.appState === 'admin-login')) {
          return { ...parsed, appState: 'landing' };
        }
        return parsed;
      }
    } catch (e) {
      console.error("Failed to load state", e);
    }
    return null;
  };

  const savedState = loadState();

  const [appState, setAppState] = useState<AppState>(savedState?.appState || 'landing');
  const [userData, setUserData] = useState<UserData>(savedState?.userData || {
    name: '',
    mobile: '',
    email: '',
    location: ''
  });
   const [studentId, setStudentId] = useState<string | null>(savedState?.studentId || null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(savedState?.currentQuestionIndex || 0);
  const [answers, setAnswers] = useState<Answer[]>(savedState?.answers || []);
  const [result, setResult] = useState<ReturnType<typeof getRecommendedStream> | null>(savedState?.result || null);
  const [timeLeft, setTimeLeft] = useState<number>(savedState?.timeLeft || 3600);
  const [showMotivation, setShowMotivation] = useState(false);
  const [, setQuestionLimit] = useState<number>(45);
  const [shuffledQuestions, setShuffledQuestions] = useState<any[]>(
    savedState?.shuffledQuestions || []
  );

  // Fetch Questions from DB on mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const [qRes, settingsRes] = await Promise.all([
          fetch(`${API_BASE}/api/admin/questions`),
          fetch(`${API_BASE}/api/admin/settings`)
        ]);

        if (!qRes.ok) throw new Error('Question API error');
        const data = await qRes.json();
        const settings = settingsRes.ok ? await settingsRes.json() : { questionLimit: 45 };
        
        // If DB has questions, use them. Otherwise fallback to static.
        const pool = data.length > 0 ? data : questions;
        const requestedLimit = Number(settings?.questionLimit) || 45;
        const safeLimit = Math.max(1, Math.min(requestedLimit, pool.length));
        const limitedPool = pool.slice(0, safeLimit);
        setQuestionLimit(safeLimit);
        
        // Refresh saved list if limit changed while user is not in active quiz flow.
        const savedCount = savedState?.shuffledQuestions?.length;
        const shouldRefreshSaved =
          !savedState?.shuffledQuestions ||
          ((savedState?.appState === 'landing' || savedState?.appState === 'form') && savedCount !== safeLimit);

        if (shouldRefreshSaved) {
          setShuffledQuestions(shuffleArray(limitedPool));
        }
      } catch (err) {
        console.error('Failed to fetch dynamic questions, using static fallback');
        const fallbackLimit = Math.min(45, questions.length);
        setQuestionLimit(fallbackLimit);
        if (!savedState?.shuffledQuestions) {
          setShuffledQuestions(shuffleArray(questions.slice(0, fallbackLimit)));
        }
      }
    };
    fetchQuestions();
  }, []);

  // Persistence logic
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      appState,
      userData,
      studentId,
      currentQuestionIndex,
      answers,
      result,
      timeLeft,
      shuffledQuestions
    }));
  }, [appState, userData, studentId, currentQuestionIndex, answers, result, timeLeft, shuffledQuestions]);

  // Countdown timer logic
  useEffect(() => {
    let timer: number;
    if (appState === 'quiz' && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Auto-submit when time is up
            if (answers.length > 0) {
              const calculatedResult = getRecommendedStream(answers);
              setResult(calculatedResult);
              setAppState('analyzing');
            } else {
              setAppState('landing');
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [appState, timeLeft, answers]);

  // Handle analyzing to report transition
  useEffect(() => {
    if (appState === 'analyzing') {
      const timer = setTimeout(() => {
        setAppState('report');
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [appState]);

  const handleStartTest = () => {
    setAppState('form');
  };

  const handleFormSubmit = async (data: typeof userData) => {
    setUserData(data);
    setAppState('quiz');
    
    // Register in backend
    try {
      const res = await fetch(`${API_BASE}/api/student/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const student = await res.json();
      if (student.id) setStudentId(student.id);
    } catch (err) {
      console.error('Backend sync failed, continuing locally...');
    }
  };

  const handleAnswer = (stream: string, weight: number) => {
    if (!shuffledQuestions[currentQuestionIndex]) return;

    const newAnswer: Answer = {
      questionId: shuffledQuestions[currentQuestionIndex].id,
      stream,
      weight
    };
    
    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);
    
    // Trigger motivation every 10 questions (except at the very end)
    if (newAnswers.length > 0 && newAnswers.length % 10 === 0 && newAnswers.length < shuffledQuestions.length) {
      setShowMotivation(true);
      // Auto-hide after 10 seconds, but user can click to skip
      setTimeout(() => setShowMotivation(false), 10000);
    }

    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex((prevIndex: number) => prevIndex + 1);
      // Sync progress to backend
      if (studentId) {
        fetch(`${API_BASE}/api/student/update-progress/${studentId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers: newAnswers })
        });
      }
    } else {
      const calculatedResult = getRecommendedStream(newAnswers);
      setResult(calculatedResult);
      setAppState('analyzing');
      // Final sync
      if (studentId) {
        fetch(`${API_BASE}/api/student/complete/${studentId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers: newAnswers, result: calculatedResult })
        });
      }
    }
  };

  const handleRestart = async () => {
    localStorage.removeItem(STORAGE_KEY);
    setAppState('landing');
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setResult(null);
    setUserData({ name: '', mobile: '', email: '', location: '' });
    setTimeLeft(3600);
    
    // Refresh questions from DB on restart
    try {
      const [qRes, settingsRes] = await Promise.all([
        fetch(`${API_BASE}/api/admin/questions`),
        fetch(`${API_BASE}/api/admin/settings`)
      ]);

      const data = qRes.ok ? await qRes.json() : [];
      const settings = settingsRes.ok ? await settingsRes.json() : { questionLimit: 45 };
      const pool = data.length > 0 ? data : questions;
      const requestedLimit = Number(settings?.questionLimit) || 45;
      const safeLimit = Math.max(1, Math.min(requestedLimit, pool.length));

      setQuestionLimit(safeLimit);
      setShuffledQuestions(shuffleArray(pool.slice(0, safeLimit)));
    } catch (e) {
      const fallbackLimit = Math.min(45, questions.length);
      setQuestionLimit(fallbackLimit);
      setShuffledQuestions(shuffleArray(questions.slice(0, fallbackLimit)));
    }
  };

  return (
    <div className="h-screen-mobile w-full bg-white overflow-hidden">
      <AnimatePresence mode="wait">
        {appState === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <LandingSection onStart={handleStartTest} />
          </motion.div>
        )}

        {appState === 'form' && (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <LeadForm onSubmit={handleFormSubmit} onBack={() => setAppState('landing')} />
          </motion.div>
        )}

        {appState === 'quiz' && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <QuizCard
              key={`question-${currentQuestionIndex}`}
              question={shuffledQuestions[currentQuestionIndex]}
              currentIndex={currentQuestionIndex}
              totalQuestions={shuffledQuestions.length}
              onAnswer={handleAnswer}
              timeLeft={timeLeft}
            />
          </motion.div>
        )}

        {appState === 'analyzing' && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <AnalyzingScreen />
          </motion.div>
        )}

        {appState === 'report' && result && (
          <motion.div
            key="report"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <BlurredReport
              userData={userData}
              result={result}
              onRestart={handleRestart}
            />
          </motion.div>
        )}

        {appState === 'admin' && (
          <motion.div
            key="admin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full"
          >
            <AdminPanel onBack={() => setAppState('landing')} />
          </motion.div>
        )}

        {appState === 'admin-login' && (
          <motion.div
            key="admin-login"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full"
          >
            <AdminLogin 
              onLogin={() => setAppState('admin')} 
              onBack={() => setAppState('landing')} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Motivational Fire Effect Overlay */}
      <AnimatePresence>
        {showMotivation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
            style={{ background: 'radial-gradient(circle, rgba(254,242,242,0.95) 0%, rgba(254,215,170,0.9) 100%)' }}
          >
            {/* Dynamic Motivation Data */}
            {(() => {
              const motivations = [
                { title: "Gajab!", msg: "Pehle 10 sawal fatah kar liye!", emoji: "🔥" },
                { title: "Shandaar!", msg: "Aapka focus kamaal ka hai!", emoji: "⚡" },
                { title: "Power-up!", msg: "Aap goal ke bahut kareeb hain!", emoji: "🚀" },
                { title: "Full Fire!", msg: "Aapki choice ek dam sahi hai!", emoji: "🎊" },
                { title: "Almost There!", msg: "Aakhri kuch sawal bache hain!", emoji: "✨" }
              ];
              const index = Math.floor(answers.length / 10) - 1;
              const { title, msg, emoji } = motivations[index % motivations.length];
              
              return (
                <>
                  {/* Flame Particles Animation */}
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(15)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ y: 500, x: Math.random() * 400 - 200, opacity: 0, scale: 0 }}
                        animate={{ 
                          y: -200, 
                          opacity: [0, 0.8, 0], 
                          scale: [0, Math.random() * 2 + 1, 0.5],
                          rotate: Math.random() * 360
                        }}
                        transition={{ 
                          duration: 2 + Math.random() * 2, 
                          repeat: Infinity,
                          delay: Math.random() * 2
                        }}
                        className="absolute bottom-0 left-1/2 w-16 h-16 rounded-full blur-2xl"
                        style={{ background: i % 2 === 0 ? '#f97316' : '#ef4444' }}
                      />
                    ))}
                  </div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="relative z-10 text-center px-6"
                  >
                    <div className="bg-white/30 backdrop-blur-md p-8 rounded-3xl border border-white/50 shadow-2xl">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="text-6xl mb-4"
                      >
                        {emoji}
                      </motion.div>
                      <h2 className="text-4xl font-extrabold text-orange-600 mb-2 drop-shadow-sm uppercase">
                        {title}
                      </h2>
                      <p className="text-xl text-slate-800 font-bold mb-6">
                        {msg}
                      </p>
                      <div className="bg-orange-600 inline-block px-6 py-2 rounded-full text-white font-black text-2xl shadow-lg mb-8">
                        Bas {shuffledQuestions.length - answers.length} sawal aur!
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowMotivation(false)}
                        className="w-full bg-slate-900 text-white font-bold py-4 px-8 rounded-2xl shadow-xl flex items-center justify-center gap-2 group"
                      >
                        <span>Let's Keep Going!</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </motion.button>
                    </div>
                  </motion.div>
                </>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
