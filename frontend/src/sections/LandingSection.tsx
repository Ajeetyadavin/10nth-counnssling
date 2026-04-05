import { motion } from 'framer-motion';
import { Sparkles, Users, Award, ChevronRight, Star, CheckCircle, Zap } from 'lucide-react';

interface LandingSectionProps {
  onStart: () => void;
}

const LandingSection = ({ onStart }: LandingSectionProps) => {
  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30">
      {/* Top Urgency Bar */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-r from-rose-500 to-pink-500 py-2 px-3"
      >
        <div className="flex items-center justify-center gap-2 text-white text-xs font-semibold">
          <Zap className="w-3 h-3 fill-white" />
          <span>Limited Slots!</span>
          <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px]">
            Only 5 Left Today
          </span>
        </div>
      </motion.div>

      {/* Main Content - Scrollable if needed */}
      <div className="flex-1 flex flex-col px-6 py-6 max-w-md mx-auto w-full overflow-y-auto no-scrollbar">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-4"
        >
          <div className="inline-flex items-center gap-2 bg-blue-100 rounded-full px-4 py-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">10th Class Ke Baad Kya?</span>
          </div>
        </motion.div>

        {/* Hero Image - Bigger */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="flex justify-center mb-6"
        >
          <div className="relative">
            <img
              src="/hero-student.png"
              alt="Career"
              className="w-40 h-40 object-contain drop-shadow-xl"
            />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="absolute top-0 -right-2 bg-emerald-500 rounded-full p-1.5"
            >
              <Star className="w-4 h-4 text-white fill-white" />
            </motion.div>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-6"
        >
          <h1 className="text-3xl font-extrabold text-slate-900 leading-tight">
            Apna Perfect <br />
            <span className="text-blue-600">Career Discover Karo!</span>
          </h1>
          <p className="text-slate-600 text-sm mt-3 px-2">
            Professional analysis se jaano Science, Commerce ya Arts mein aapke liye best kya hai.
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="flex justify-center gap-4 mb-6"
        >
          <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 shadow-card border border-slate-50">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-base font-bold text-slate-900">10K+</p>
              <p className="text-[11px] text-slate-500 font-medium">Students</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 shadow-card border border-slate-50">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <Award className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-base font-bold text-slate-900">98%</p>
              <p className="text-[11px] text-slate-500 font-medium">Success</p>
            </div>
          </div>
        </motion.div>

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
              'College Pathway'
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

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-auto space-y-4"
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
            Takes ~5 mins • Trusted by 10,000+ Students
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingSection;
