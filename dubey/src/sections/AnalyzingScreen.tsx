import { motion } from 'framer-motion';
import { Brain, BarChart3, Target, Lightbulb, Sparkles } from 'lucide-react';

interface AnalyzingScreenProps {
  language?: 'hinglish' | 'english';
}

const AnalyzingScreen = ({ language = 'hinglish' }: AnalyzingScreenProps) => {
  const isEn = language === 'english';
  const analyzingSteps = [
    { icon: Brain, text: isEn ? 'Analyzing your personality...' : 'Personality analyze ho raha hai...' },
    { icon: BarChart3, text: isEn ? 'Calculating aptitude score...' : 'Aptitude score calculate ho raha hai...' },
    { icon: Target, text: isEn ? 'Matching best streams...' : 'Best streams match ho rahe hain...' },
    { icon: Lightbulb, text: isEn ? 'Generating recommendations...' : 'Recommendations generate ho rahi hain...' }
  ];

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-white via-blue-50/50 to-indigo-50/50">
      <div className="max-w-md mx-auto text-center w-full">
        {/* Main Animation */}
        <div className="mb-6 relative flex justify-center">
          {/* Outer Ring */}
          <motion.div
            className="w-24 h-24 relative"
            animate={{ rotate: 360 }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute inset-0 rounded-full border-4 border-dashed border-blue-200" />
          </motion.div>

          {/* Inner Brain Icon */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center shadow-button">
              <Brain className="w-7 h-7 text-white" />
            </div>
          </motion.div>

          {/* Sparkles */}
          <motion.div
            className="absolute -top-2 right-1/3"
            animate={{ y: [-3, 3, -3], rotate: [0, 15, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400" />
          </motion.div>
        </div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-bold text-slate-900 mb-1"
        >
          Analyzing Your Profile...
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-slate-500 text-sm mb-6"
        >
          {isEn ? 'AI is analyzing your answers' : 'AI aapke answers analyze kar raha hai'}
        </motion.p>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full gradient-primary"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 3, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Analyzing Steps */}
        <div className="space-y-2">
          {analyzingSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.4 }}
              className="flex items-center gap-3 bg-white rounded-lg p-2.5 shadow-sm"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <step.icon className="w-4 h-4 text-blue-500" />
              </motion.div>
              <span className="text-xs text-slate-600">{step.text}</span>
              <motion.div
                className="ml-auto flex gap-0.5"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <span className="w-1 h-1 rounded-full bg-blue-500" />
                <span className="w-1 h-1 rounded-full bg-blue-500" />
                <span className="w-1 h-1 rounded-full bg-blue-500" />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyzingScreen;
