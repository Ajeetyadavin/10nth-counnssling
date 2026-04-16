import { motion } from 'framer-motion';
import { Sparkles, Award, ChevronRight, Star, CheckCircle, Zap, Target, BookOpen, TrendingUp } from 'lucide-react';

interface LandingSectionProps {
  onStart: () => void;
  language?: 'hinglish' | 'english';
}

const LandingSection = ({ onStart, language = 'hinglish' }: LandingSectionProps) => {
  const isEn = language === 'english';
  return (
    <div className="h-full flex flex-col md:flex-row overflow-hidden">

      {/* ===== LEFT PANEL — Desktop Only ===== */}
      <div className="hidden md:flex flex-1 flex-col justify-center bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 p-12 xl:p-16 relative overflow-hidden">
        {/* Decorative background circles */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3 pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-white/5 rounded-full pointer-events-none" />

        {/* Brand header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-10 relative z-10"
        >
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center p-2 backdrop-blur-sm">
            <img src="/ednovate-mark.svg" alt="Ednovate" className="w-full h-full object-contain" />
          </div>
          <div>
            <p className="text-white/70 text-sm font-medium">Free Career Assessment</p>
            <p className="text-white font-bold text-xl">CareerCompass</p>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-8 relative z-10"
        >
          <h2 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-4">
            {isEn ? <>After 10th, choose the <br /><span className="text-yellow-300">right path</span></> : <>10th ke baad <br /><span className="text-yellow-300">sahi raah</span> chuno</>}
          </h2>
          <p className="text-blue-100 text-lg leading-relaxed max-w-md">
            {isEn ? 'Science, Commerce or Arts? Find out the best career path for you with AI-powered analysis.' : 'Science, Commerce ya Arts? AI-powered analysis se jaano apke liye best career path konsa hai.'}
          </p>
        </motion.div>

        {/* Benefits list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4 mb-10 relative z-10 max-w-md"
        >
          {[
            { icon: Target, text: isEn ? 'Personalized stream: Science, Commerce or Arts' : 'Personalized stream: Science, Commerce ya Arts' },
            { icon: BookOpen, text: isEn ? 'Detailed career path breakdown for your stream' : 'Detailed career path breakdown for your stream' },
            { icon: TrendingUp, text: isEn ? 'Top colleges & courses aligned with your interests' : 'Top colleges & courses aligned with your interests' },
            { icon: Award, text: isEn ? 'Expert-curated FREE career report in 5 minutes' : 'Expert-curated FREE career report in 5 minutes' },
            { icon: CheckCircle, text: isEn ? 'Creating Plan' : 'Plan Banana' },
            { icon: Zap, text: isEn ? 'Execution' : 'Amal (Execution)' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.07 }}
              className="flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-blue-50 text-sm font-medium">{item.text}</p>
            </motion.div>
          ))}
        </motion.div>


      </div>

      {/* ===== RIGHT PANEL — Mobile full / Desktop card ===== */}
      <div className="flex-1 md:flex-none md:w-[460px] xl:w-[500px] flex flex-col bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 md:shadow-2xl md:shadow-slate-400/30 overflow-hidden">

      {/* Top Urgency Bar */}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex items-center justify-center gap-3 py-4 bg-white/80 border-b border-blue-50 shadow-sm"
      >
        <img src="/ednovate-mark.svg" alt="Ednovate" className="w-9 h-9 object-contain" />
        <p className="text-lg font-extrabold text-blue-700 tracking-wide drop-shadow-sm">Powered by Ednovate</p>
      </motion.div>

      {/* Main Content - Scrollable if needed */}
      <div className="flex-1 flex flex-col px-6 pt-10 pb-6 max-w-md mx-auto w-full overflow-y-auto no-scrollbar">
        <div className="flex-1 flex flex-col justify-start">
          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-6"
          >
            <h1 className="text-3xl font-extrabold text-slate-900 leading-tight">
              {isEn ? <>
                Discover Your <br /><span className="text-blue-600">Perfect Career!</span>
              </> : <>
                Apna Perfect <br /><span className="text-blue-600">Career Discover Karo!</span>
              </>}
            </h1>
            <p className="text-slate-600 text-sm mt-3 px-2">
              {isEn ? 'Find out whether Science, Commerce or Arts is best for you with professional analysis.' : 'Professional analysis se jaano Science, Commerce ya Arts mein aapke liye best kya hai.'}
            </p>
          </motion.div>
        </div>

        {/* Stats Row */}

        {/* Benefits - Compact but larger */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-sm mb-6"
        >
          <div className="grid grid-cols-2 gap-3">
            {[
              'FREE Career Report',
              'Expert Guidance',
              'Stream Analysis',
              'College Pathway',
              'Creating Plan',
              'Execution'
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + index * 0.05 }}
                className="flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span className="text-[12px] font-medium text-slate-700">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-auto space-y-4 pb-4"
        >
          <motion.button
            onClick={onStart}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full gradient-primary text-white font-bold py-4 px-6 rounded-2xl text-base shadow-button flex items-center justify-center gap-2 group"
          >
            <span>Start My FREE Test</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
          

          
          <p className="text-center text-[11px] text-slate-400">
            Takes only 5 minutes
          </p>
        </motion.div>
      </div>
      </div>
    </div>
  );
};

export default LandingSection;
