import { motion } from 'framer-motion';
import { Lock, Phone, Users, Star, TrendingUp, CheckCircle, Sparkles, X, Zap } from 'lucide-react';
import type { UserData } from '../App';
import type { getRecommendedStream } from '../data/multiLanguageQuestions';

interface BlurredReportProps {
  userData: UserData;
  result: ReturnType<typeof getRecommendedStream>;
  onRestart: () => void;
  language?: 'hinglish' | 'english';
}

const BlurredReport = ({ userData, result, onRestart, language = 'hinglish' }: BlurredReportProps) => {
  const isEn = language === 'english';
  const streamDetails = {
    science: {
      title: "Science Stream",
      subtitle: "PCM/PCB/PCMB",
      description: isEn ? 'Your analytical mind is perfect for the science stream!' : 'Aapka analytical mind science stream ke liye perfect hai!',
      careers: ["Engineer", "Doctor", "Scientist", "Data Analyst"],
      color: "#10B981",
      bgGradient: "from-emerald-500/10 to-teal-500/10"
    },
    commerce: {
      title: "Commerce Stream",
      subtitle: "With/Without Maths",
      description: isEn ? 'Your financial acumen will shine in the commerce stream!' : 'Aapka financial acumen commerce mein shine karega!',
      careers: ["CA", "Commerce Workshop", "FYJC/SYJC", "Ednovate Professional Courses"],
      color: "#2563EB",
      bgGradient: "from-blue-500/10 to-indigo-500/10"
    },
    arts: {
      title: "Arts/Humanities",
      subtitle: "With Electives",
      description: isEn ? 'Your creativity will be best utilized in the arts stream!' : 'Aapki creativity arts stream mein best utilize hogi!',
      careers: ["Lawyer", "Journalist", "Designer", "Psychologist"],
      color: "#F43F5E",
      bgGradient: "from-rose-500/10 to-pink-500/10"
    }
  };

  const details = streamDetails[result.stream as keyof typeof streamDetails] || streamDetails.commerce;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className={`bg-gradient-to-r ${details.bgGradient} p-4`}>
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-flex items-center gap-1.5 bg-white rounded-full px-3 py-1 mb-2 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: details.color }} />
            <span className="text-xs font-semibold" style={{ color: details.color }}>
              Report Ready!
            </span>
          </motion.div>
          <h2 className="text-lg font-bold text-slate-900">
            Congratulations {userData.name}!
          </h2>
        </div>
      </div>

      {/* Report Content */}
      <div className="flex-1 flex flex-col px-4 py-3 max-w-md mx-auto w-full overflow-hidden">
        {/* Blurred Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative bg-slate-50 rounded-xl overflow-hidden mb-3 shadow-card"
        >
          {/* Blurred Content */}
          <div className="relative p-4 blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${details.color}20` }}
              >
                <TrendingUp className="w-5 h-5" style={{ color: details.color }} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{details.title}</h3>
                <p className="text-xs text-slate-500">{details.subtitle}</p>
              </div>
            </div>

            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-500">Match Score</span>
                <span className="text-sm font-bold" style={{ color: details.color }}>
                  {result.percentage}%
                </span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${result.percentage}%`, backgroundColor: details.color }}
                />
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-3">{details.description}</p>

            <div className="flex flex-wrap gap-1.5">
              {details.careers.map((career, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 rounded-full text-[10px]"
                  style={{ backgroundColor: `${details.color}15`, color: details.color }}
                >
                  {career}
                </span>
              ))}
            </div>
          </div>

          {/* Lock Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.5 }}
              className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mb-2"
            >
              <Lock className="w-6 h-6 text-rose-500" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xs font-semibold text-slate-700"
            >
              Report Locked!
            </motion.p>
          </div>
        </motion.div>

        {/* Urgency Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="gradient-urgency rounded-lg p-3 mb-3"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Hurry! Limited Offer</h4>
              <p className="text-white/90 text-xs">{isEn ? 'Only 5 slots left!' : 'Sirf 5 slots bache hain!'}</p>
            </div>
          </div>
        </motion.div>

        {/* What's Included */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-50 rounded-lg p-3 mb-3"
        >
          <h4 className="text-xs font-bold text-slate-700 mb-2">Full Report Includes:</h4>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              'Personality Analysis',
              'Stream Recommendation',
              'Top Career Options',
              'College Suggestions',
              'Scholarship Info',
              '1-on-1 Guidance'
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.05 }}
                className="flex items-center gap-1"
              >
                <CheckCircle className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                <span className="text-[10px] text-slate-600">{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Call CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, type: "spring", damping: 20 }}
          className="text-center mt-auto py-4 px-2"
        >
          <p className="text-sm font-bold text-slate-600 mb-4 px-4">
            {isEn ? 'Call us for your full career report and college guidance:' : 'Aapki full career report aur college guidance ke liye call karein:'}
          </p>
          
          <div className="relative inline-block w-full max-w-[280px]">
            {/* Pulsing Outer Glow */}
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -inset-1 bg-emerald-400 rounded-2xl blur-md"
            />
            
            <motion.a
              href="tel:865101484"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative flex items-center justify-center gap-3 w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black py-4 px-6 rounded-2xl text-lg shadow-[0_10px_25px_-5px_rgba(16,185,129,0.4)] border border-emerald-400/20"
            >
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Phone className="w-5 h-5 fill-white" />
              </div>
              <span className="tracking-wide">865101484</span>
            </motion.a>
          </div>

          {/* Removed User PDF Download Buttons */}

          <div className="mt-4 flex flex-col items-center">
            <motion.div
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-black px-4 py-1.5 rounded-full border border-emerald-100 shadow-sm uppercase tracking-widest"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Free Consultation Active
            </motion.div>
          </div>
        </motion.div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-3 flex items-center justify-center gap-2"
        >
          <div className="flex -space-x-1.5">
            {['bg-blue-500', 'bg-indigo-500', 'bg-emerald-500', 'bg-rose-500'].map((color, i) => (
              <div key={i} className={`w-5 h-5 rounded-full ${color} border-2 border-white flex items-center justify-center`}>
                <Users className="w-2.5 h-2.5 text-white" />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-3 h-3 text-amber-400 fill-amber-400" />
            ))}
          </div>
          <span className="text-[10px] text-slate-500">2,500+ calls</span>
        </motion.div>

        {/* Restart */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={onRestart}
          className="mt-2 text-[10px] text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1 mx-auto"
        >
          <X className="w-3 h-3" />
          {isEn ? 'Retake Test' : 'Test Dobaara Dein'}
        </motion.button>
      </div>
    </div>
  );
};

export default BlurredReport;
