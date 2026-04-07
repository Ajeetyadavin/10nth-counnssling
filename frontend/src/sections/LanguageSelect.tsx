import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

interface LanguageSelectProps {
  onSelect: (language: 'hinglish' | 'english') => void;
}

const LanguageSelect = ({ onSelect }: LanguageSelectProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 space-y-8">
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="bg-slate-900 p-4 rounded-full">
                <Globe className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              Language Selection
            </h1>
            <p className="text-slate-600 text-lg">
              कृपया अपनी पसंदीदा भाषा चुनें
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hinglish Option */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => onSelect('hinglish')}
              className="group relative overflow-hidden rounded-xl border-2 border-slate-200 hover:border-blue-500 p-8 transition-all duration-300 hover:shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative space-y-4">
                <div className="text-5xl">🇮🇳</div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-1">
                    Hinglish
                  </h2>
                  <p className="text-sm text-slate-600">
                    हिंग्लिश में सवाल
                  </p>
                </div>
                <p className="text-xs text-slate-500 pt-2">
                  Easy & Friendly भाषा
                </p>
              </div>
            </motion.button>

            {/* English Option */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => onSelect('english')}
              className="group relative overflow-hidden rounded-xl border-2 border-slate-200 hover:border-emerald-500 p-8 transition-all duration-300 hover:shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative space-y-4">
                <div className="text-5xl">🇬🇧</div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-1">
                    English
                  </h2>
                  <p className="text-sm text-slate-600">
                    Questions in English
                  </p>
                </div>
                <p className="text-xs text-slate-500 pt-2">
                  Professional Language
                </p>
              </div>
            </motion.button>
          </div>

          <p className="text-center text-xs text-slate-500 mt-8">
            आप परीक्षा के बाद भाषा बदल सकते हैं • You can change language after the test
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LanguageSelect;
