import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LandingSection from './sections/LandingSection';
import LeadForm from './sections/LeadForm';
import OtpVerification from './sections/OtpVerification';
import QuizCard from './sections/QuizCard';
import AnalyzingScreen from './sections/AnalyzingScreen';
import BlurredReport from './sections/BlurredReport';
import AdminPanel from './sections/AdminPanel';
import AdminLogin from './sections/AdminLogin';
import { getQuestionByLanguage, getRecommendedStream, type Answer } from './data/multiLanguageQuestions';
import { ArrowRight } from 'lucide-react';

const DEFAULT_API_BASE = import.meta.env.DEV ? '' : 'http://localhost:5001';
const API_BASE = import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE;

export type AppState = 'landing' | 'form' | 'otp' | 'quiz' | 'analyzing' | 'report' | 'admin' | 'admin-login';

export interface UserData {
  name: string;
  mobile: string;
  email: string;
  location: string;
}

const STORAGE_KEY = 'career_counselor_state';
const LANGUAGE_KEY = 'career_counselor_language';

const getErrorMessage = async (res: Response, fallback: string) => {
  try {
    const data = await res.json();
    return data?.error || data?.message || fallback;
  } catch {
    return fallback;
  }
};

// Helper to shuffle array
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const normalizeQuestionPool = (pool: any[]) => {
  if (!Array.isArray(pool)) return [];
  return pool
    .map((q, index) => ({
      id: q?.id ?? index + 1,
      question: q?.question ?? q?.text ?? '',
      options: Array.isArray(q?.options) ? q.options : [],
      fixed: Boolean(q?.fixed)
    }))
    .filter((q) => q.question && q.options.length > 0);
};

const buildQuizPool = (pool: any[], limit: number) => {
  if (!Array.isArray(pool) || pool.length === 0) return [];
  const safeLimit = Math.max(1, Math.min(limit, pool.length));

  const fixedQuestions = shuffleArray(pool.filter((q) => q.fixed));
  const normalQuestions = shuffleArray(pool.filter((q) => !q.fixed));

  let selected: any[] = [];
  if (fixedQuestions.length >= safeLimit) {
    selected = fixedQuestions.slice(0, safeLimit);
  } else {
    selected = [...fixedQuestions, ...normalQuestions.slice(0, safeLimit - fixedQuestions.length)];
  }

  return shuffleArray(selected).map((q) => ({
    ...q,
    options: shuffleArray(Array.isArray(q.options) ? q.options : [])
  }));
};

function App() {
  // Load state from localStorage on initialize
  const loadState = () => {
    // Priority 1: Direct URL access to /admin
    if (window.location.pathname === '/admin') {
      return {
        appState: 'admin-login',
        language: 'hinglish',
        userData: { name: '', mobile: '', email: '', location: '' },
        currentQuestionIndex: 0,
        answers: [],
        result: null,
        timeLeft: 3600,
        studentId: null,
        shuffledQuestions: []
      };
    }

    // Priority 2: Check if language is selected
    const savedLanguage = localStorage.getItem(LANGUAGE_KEY);
    if (!savedLanguage) {
      return {
        appState: 'landing',
        language: 'hinglish',
        userData: { name: '', mobile: '', email: '', location: '' },
        currentQuestionIndex: 0,
        answers: [],
        result: null,
        timeLeft: 3600,
        studentId: null,
        shuffledQuestions: []
      };
    }

    // Priority 3: Saved state from localStorage
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const normalizedSavedQuestions = normalizeQuestionPool(parsed?.shuffledQuestions || []);
        const normalizedParsed = {
          ...parsed,
          language: savedLanguage,
          appState: parsed.appState === 'language-select' ? 'landing' : parsed.appState,
          shuffledQuestions: normalizedSavedQuestions
        };
        // If they are on root '/', but state says admin, force landing
        if (window.location.pathname === '/' && (parsed.appState === 'admin' || parsed.appState === 'admin-login')) {
          return { ...normalizedParsed, appState: 'landing' };
        }
        return normalizedParsed;
      }
    } catch (e) {
      console.error("Failed to load state", e);
    }

    // Default: language selected but no quiz started
    return {
      appState: 'landing',
      language: savedLanguage || 'hinglish',
      userData: { name: '', mobile: '', email: '', location: '' },
      currentQuestionIndex: 0,
      answers: [],
      result: null,
      timeLeft: 3600,
      studentId: null,
      shuffledQuestions: []
    };
  };

  const savedState = loadState();

  const [language, setLanguage] = useState<'hinglish' | 'english'>(savedState?.language || 'hinglish');
  const [appState, setAppState] = useState<AppState>(savedState?.appState === 'otp' ? 'form' : (savedState?.appState || 'landing'));
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
  const languageRef = useRef<'hinglish' | 'english'>(savedState?.language || 'hinglish');
  const [otpHint, setOtpHint] = useState<string>('');
  const [otpToken, setOtpToken] = useState<string | null>(savedState?.otpToken || null);
  const [otpRequired, setOtpRequired] = useState<boolean>(true);
  const [showOtpPopup, setShowOtpPopup] = useState<boolean>(savedState?.appState === 'otp');

  // Fetch Questions from DB on mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const [qRes, settingsRes] = await Promise.all([
          fetch(`${API_BASE}/api/admin/questions?language=${language}`),
          fetch(`${API_BASE}/api/admin/settings`)
        ]);

        if (!qRes.ok) throw new Error('Question API error');
        const data = await qRes.json();
        const settings = settingsRes.ok ? await settingsRes.json() : { questionLimit: 45, otpRequired: true };
        setOtpRequired(settings?.otpRequired !== false);
        const dynamicPool = normalizeQuestionPool(data);
        
        // If DB has questions, use them. Otherwise fallback to static.
        const staticPool = getQuestionByLanguage(language);
        const pool = dynamicPool.length > 0 ? dynamicPool : staticPool;
        const requestedLimit = Number(settings?.questionLimit) || 45;
        const safeLimit = Math.max(1, Math.min(requestedLimit, pool.length));
        setQuestionLimit(safeLimit);
        
        // Always refresh if: (1) language changed, (2) no saved questions, or (3) not in active quiz
        const languageChanged = languageRef.current !== language;
        const savedCount = savedState?.shuffledQuestions?.length;
        const notInActiveQuiz = appState !== 'quiz';
        const shouldRefreshSaved =
          languageChanged ||
          !savedState?.shuffledQuestions ||
          (notInActiveQuiz && savedCount !== safeLimit);

        if (shouldRefreshSaved) {
          setShuffledQuestions(buildQuizPool(pool, safeLimit));
          languageRef.current = language;
        }
      } catch (err) {
        console.error('Failed to fetch dynamic questions, using static fallback', err);
        const staticPool = getQuestionByLanguage(language);
        const fallbackLimit = Math.min(45, staticPool.length);
        setQuestionLimit(fallbackLimit);
        if (!savedState?.shuffledQuestions) {
          setShuffledQuestions(buildQuizPool(staticPool, fallbackLimit));
        }
        languageRef.current = language;
      }
    };
    fetchQuestions();
  }, [language, appState]);

  // Language persistence
  useEffect(() => {
    localStorage.setItem(LANGUAGE_KEY, language);
  }, [language]);

  // Storage persistence logic
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      appState,
      userData,
      studentId,
      otpToken,
      currentQuestionIndex,
      answers,
      result,
      timeLeft,
      shuffledQuestions
    }));
  }, [appState, userData, studentId, otpToken, currentQuestionIndex, answers, result, timeLeft, shuffledQuestions]);

  // Countdown timer logic
  useEffect(() => {
    let timer: number;
    if (appState === 'quiz' && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Auto-submit when time is up
            if (answers.length > 0) {
              const calculatedResult = getRecommendedStream(answers, shuffledQuestions);
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
  }, [appState, timeLeft, answers, shuffledQuestions]);

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

  const sendOtp = async (mobile: string) => {
    const res = await fetch(`${API_BASE}/api/otp/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile })
    });

    if (!res.ok) {
      throw new Error(await getErrorMessage(res, 'Failed to send OTP.'));
    }

    const data = await res.json();
    const devOtpHint = data?.devOtp ? `Dev OTP: ${data.devOtp}` : undefined;
    setOtpHint(devOtpHint || 'OTP sent successfully.');
    return devOtpHint;
  };

  const handleFormSubmit = async (data: typeof userData) => {
    setUserData(data);
    try {
      if (otpRequired) {
        await sendOtp(data.mobile);
        setShowOtpPopup(true);
        return;
      }

      const registerRes = await fetch(`${API_BASE}/api/student/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data })
      });

      if (!registerRes.ok) {
        throw new Error(await getErrorMessage(registerRes, 'Could not start test.'));
      }

      const student = await registerRes.json();
      if (student?.id) {
        setStudentId(student.id);
      }
      setShowOtpPopup(false);
      setAppState('quiz');
    } catch (err) {
      console.error('Start test failed:', err);
      alert(err instanceof Error ? err.message : 'Could not start test right now. Please try again.');
    }
  };

  const handleOtpVerify = async (otp: string) => {
    const verifyRes = await fetch(`${API_BASE}/api/otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile: userData.mobile, otp })
    });

    if (!verifyRes.ok) {
      throw new Error(await getErrorMessage(verifyRes, 'OTP verification failed.'));
    }

    const verifyData = await verifyRes.json();
    if (!verifyData?.verificationToken) {
      throw new Error('OTP verification token missing. Please retry.');
    }

    setOtpToken(verifyData.verificationToken);

    const registerRes = await fetch(`${API_BASE}/api/student/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...userData, otpToken: verifyData.verificationToken })
    });

    if (!registerRes.ok) {
      throw new Error(await getErrorMessage(registerRes, 'Could not start test after OTP verification.'));
    }

    const student = await registerRes.json();
    if (student?.id) {
      setStudentId(student.id);
    }

    setShowOtpPopup(false);
    setAppState('quiz');
  };

  const handleOtpResend = async () => sendOtp(userData.mobile);

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
      const calculatedResult = getRecommendedStream(newAnswers, shuffledQuestions);
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
    setOtpToken(null);
    setOtpHint('');
    setShowOtpPopup(false);
    setUserData({ name: '', mobile: '', email: '', location: '' });
    setTimeLeft(3600);
    
    // Refresh questions from DB on restart
    try {
      const [qRes, settingsRes] = await Promise.all([
        fetch(`${API_BASE}/api/admin/questions?language=${language}`),
        fetch(`${API_BASE}/api/admin/settings`)
      ]);

      const data = qRes.ok ? await qRes.json() : [];
      const settings = settingsRes.ok ? await settingsRes.json() : { questionLimit: 45, otpRequired: true };
      setOtpRequired(settings?.otpRequired !== false);
      const dynamicPool = normalizeQuestionPool(data);
      
      // Fallback to multiLanguageQuestions filtered by language
      const fallbackQuestions = getQuestionByLanguage(language).map((q: any) => ({
        id: q.id,
        question: q.question,
        options: q.options || [],
        fixed: q.fixed || false
      }));
      
      const pool = dynamicPool.length > 0 ? dynamicPool : fallbackQuestions;
      const requestedLimit = Number(settings?.questionLimit) || 45;
      const safeLimit = Math.max(1, Math.min(requestedLimit, pool.length));

      setQuestionLimit(safeLimit);
      setShuffledQuestions(buildQuizPool(pool, safeLimit));
    } catch (e) {
      // Fallback to static multiLanguageQuestions
      const fallbackQuestions = getQuestionByLanguage(language).map((q: any) => ({
        id: q.id,
        question: q.question,
        options: q.options || [],
        fixed: q.fixed || false
      }));
      const fallbackLimit = Math.min(45, fallbackQuestions.length);
      setQuestionLimit(fallbackLimit);
      setShuffledQuestions(buildQuizPool(fallbackQuestions, fallbackLimit));
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
            <LandingSection onStart={handleStartTest} language={language} />
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
            <LeadForm
              onSubmit={handleFormSubmit}
              onBack={() => setAppState('landing')}
              selectedLanguage={language}
              onLanguageChange={setLanguage}
            />
            {showOtpPopup && (
              <OtpVerification
                mode="modal"
                mobile={userData.mobile}
                initialHint={otpHint}
                language={language}
                onBack={() => setShowOtpPopup(false)}
                onVerify={handleOtpVerify}
                onResend={handleOtpResend}
              />
            )}
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
            <AnalyzingScreen language={language} />
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
              language={language}
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
              const isEn = language === 'english';
              const motivations = isEn ? [
                { title: "Amazing!", msg: "You conquered the first 10 questions!", emoji: "🔥" },
                { title: "Brilliant!", msg: "Your focus is incredible!", emoji: "⚡" },
                { title: "Power-up!", msg: "You're very close to the goal!", emoji: "🚀" },
                { title: "On Fire!", msg: "Your choices are spot on!", emoji: "🎊" },
                { title: "Almost There!", msg: "Just a few questions left!", emoji: "✨" }
              ] : [
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
                        {isEn ? `Just ${shuffledQuestions.length - answers.length} questions left!` : `Bas ${shuffledQuestions.length - answers.length} sawal aur!`}
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
