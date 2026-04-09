import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, Mail, MapPin, ArrowRight, ArrowLeft, Shield, Languages } from 'lucide-react';
import type { UserData } from '../App';

interface LeadFormProps {
  onSubmit: (data: UserData) => void;
  onBack: () => void;
  selectedLanguage: 'hinglish' | 'english';
  onLanguageChange: (language: 'hinglish' | 'english') => void;
}

const LeadForm = ({ onSubmit, onBack, selectedLanguage, onLanguageChange }: LeadFormProps) => {
  const isEn = selectedLanguage === 'english';
  const [formData, setFormData] = useState<UserData>({
    name: '',
    mobile: '',
    email: '',
    location: ''
  });
  const [errors, setErrors] = useState<Partial<Record<keyof UserData, string>>>({});
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const mumbaiStations = [
    // Central Line
    "CST", "Masjid", "Sandhurst Road", "Byculla", "Chinchpokli", "Currey Road", "Parel", "Dadar", "Matunga", "Sion", 
    "Kurla", "Vidyavihar", "Ghatkopar", "Vikhroli", "Kanjurmarg", "Bhandup", "Nahur", "Mulund", "Thane", "Kalwa", 
    "Mumbra", "Diva", "Kopar", "Dombivli", "Thakurli", "Kalyan", "Vithalwadi", "Ulhasnagar", "Ambernath", "Badlapur", 
    "Vangani", "Shelu", "Neral", "Bhivpuri Road", "Karjat", "Shahad", "Ambivli", "Titwala", "Khadavli", "Vasind", "Asangaon", 
    "Atgaon", "Khardi", "Kasara",
    // Western Line
    "Churchgate", "Marine Lines", "Charni Road", "Grant Road", "Mumbai Central", "Mahalaxmi", "Lower Parel", "Prabhadevi", 
    "Matunga Road", "Mahim", "Bandra", "Khar Road", "Santacruz", "Vile Parle", "Andheri", "Jogeshwari", "Ram Mandir", 
    "Goregaon", "Malad", "Kandivali", "Borivali", "Dahisar", "Mira Road", "Bhayandar", "Naigaon", "Vasai Road", 
    "Nalla Sopara", "Virar", "Vaitarna", "Saphale", "Kelve Road", "Palghar", "Boisar", "Dahanu Road",
    // Harbour Line
    "Dockyard Road", "Reay Road", "Cotton Green", "Sewri", "Vadala Road", "GTB Nagar", "Chunabhatti", "Tilak Nagar", 
    "Chembur", "Govandi", "Mankhurd", "Vashi", "Sanpada", "Juinagar", "Nerul", "Seawoods", "Belapur", "Kharghar", 
    "Mansarovar", "Khandeshwar", "Panvel",
    // Trans-Harbour Line
    "Airoli", "Rabale", "Ghansoli", "Koparkhairane", "Turbhe",
    // Common areas
    "Andheri West", "Andheri East", "Bandra West", "Bandra East", "Powai", "Juhu", "Colaba"
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UserData, string>> = {};
    if (!formData.name.trim()) newErrors.name = isEn ? 'Name is required' : 'Naam zaroori hai';
    if (!formData.mobile.trim() || !/^\d{10}$/.test(formData.mobile)) newErrors.mobile = isEn ? 'Enter a valid 10-digit number' : 'Sahi 10-digit number dein';
    if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = isEn ? 'Enter a valid email' : 'Sahi email dein';
    if (!formData.location.trim()) newErrors.location = isEn ? 'Location is required' : 'Location zaroori hai';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof UserData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }

    if (field === 'location') {
      if (value.length >= 2) {
        const filtered = mumbaiStations.filter(station => 
          station.toLowerCase().startsWith(value.toLowerCase()) || 
          station.toLowerCase().includes(value.toLowerCase())
        ).slice(0, 5);
        setSuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
      } else {
        setShowSuggestions(false);
      }
    }
  };

  const handleSelectSuggestion = (city: string) => {
    setFormData(prev => ({ ...prev, location: city }));
    setShowSuggestions(false);
  };

  const inputFields = [
    { key: 'name' as const, label: isEn ? 'Full Name' : 'Full Name', placeholder: isEn ? 'Your name' : 'Apna naam', icon: User, type: 'text', autoComplete: 'name', name: 'name' },
    { key: 'mobile' as const, label: isEn ? 'Mobile Number' : 'Mobile Number', placeholder: isEn ? '10 digit number' : '10 digit number', icon: Phone, type: 'tel', maxLength: 10, autoComplete: 'tel', name: 'mobile' },
    { key: 'email' as const, label: isEn ? 'Email' : 'Email', placeholder: isEn ? 'email@example.com' : 'email@example.com', icon: Mail, type: 'email', autoComplete: 'email', name: 'email' },
    { key: 'location' as const, label: isEn ? 'City' : 'City', placeholder: isEn ? 'Enter your city...' : 'Mumbai Station Name...', icon: MapPin, type: 'text', autoComplete: 'address-level2', name: 'city' }
  ];

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="gradient-primary p-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-white">{isEn ? 'Basic Information' : 'Aapki Basic Jaankari'}</h2>
          </div>
        </div>
      </div>

      {/* Form Content - Scrollable if needed */}
      <form 
        onSubmit={handleSubmit}
        className="flex-1 flex flex-col px-6 py-6 max-w-md mx-auto w-full overflow-y-auto no-scrollbar"
      >
        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-slate-500 mb-2 font-medium">
            <span>Step 1 of 2</span>
            <span>{isEn ? 'Tell us about yourself' : 'Aapke baare mein batayein'}</span>
          </div>
          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '50%' }}
              className="h-full gradient-primary"
            />
          </div>
        </div>

        {/* Input Fields Container */}
        <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                {isEn ? 'Test Language' : 'Test Language'} <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onLanguageChange('hinglish')}
                  className={`flex items-center justify-center gap-2 rounded-2xl border-2 px-4 py-3 font-semibold transition-all ${
                    selectedLanguage === 'hinglish'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Languages className="h-4 w-4" />
                  Hinglish
                </button>
                <button
                  type="button"
                  onClick={() => onLanguageChange('english')}
                  className={`flex items-center justify-center gap-2 rounded-2xl border-2 px-4 py-3 font-semibold transition-all ${
                    selectedLanguage === 'english'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Languages className="h-4 w-4" />
                  English
                </button>
              </div>
            </motion.div>

            {inputFields.map((field, index) => (
              <motion.div
                key={field.key}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  {field.label} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <field.icon className="w-5 h-5 text-blue-500" />
                  </div>
                  <input
                    id={field.key}
                    type={field.type}
                    name={field.name}
                    autoComplete={field.autoComplete}
                    value={formData[field.key]}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    onFocus={() => {
                      if (field.key === 'location' && formData.location.length >= 2 && suggestions.length > 0) {
                        setShowSuggestions(true);
                      }
                    }}
                    placeholder={field.placeholder}
                    maxLength={field.maxLength}
                    className={`w-full bg-white border-2 ${
                      errors[field.key] ? 'border-rose-300' : 'border-slate-200'
                    } rounded-2xl py-4 pl-12 pr-4 text-base text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none transition-all shadow-sm`}
                  />
                  
                  {/* City Suggestions Dropdown */}
                  <AnimatePresence>
                    {field.key === 'location' && showSuggestions && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        ref={suggestionsRef}
                        className="absolute z-50 left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden"
                      >
                        {suggestions.map((city, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSelectSuggestion(city)}
                            className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-blue-50 transition-colors border-b border-slate-50 last:border-0"
                          >
                            <MapPin className="w-4 h-4 text-slate-400" />
                            <span className="text-sm font-semibold text-slate-700">{city}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {errors[field.key] && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-rose-500 text-xs mt-1.5 font-medium ml-1"
                  >
                    {errors[field.key]}
                  </motion.p>
                )}
              </motion.div>
            ))}
          </div>

          {/* Privacy Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 text-xs text-slate-500 mt-6"
          >
            <Shield className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <p>{isEn ? 'Your data is 100% encrypted and safe. No spam!' : 'Aapka data 100% encrypted aur safe hai. Koi spam nahi!'}</p>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-auto pt-8"
          >
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full gradient-primary text-white font-bold py-4 px-6 rounded-2xl text-base shadow-button flex items-center justify-center gap-2 group"
            >
              <span>{isEn ? 'Continue to Test' : 'Test Ke Liye Continue Kare'}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </form>
      </div>
    );
  };

export default LeadForm;
