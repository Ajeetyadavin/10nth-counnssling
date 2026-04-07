import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck, RefreshCw } from 'lucide-react';

interface OtpVerificationProps {
  mobile: string;
  initialHint?: string;
  mode?: 'page' | 'modal';
  onBack: () => void;
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<string | undefined>;
}

const OtpVerification = ({
  mobile,
  initialHint,
  mode = 'page',
  onBack,
  onVerify,
  onResend
}: OtpVerificationProps) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(initialHint || null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const maskedMobile = useMemo(() => {
    if (!mobile || mobile.length < 10) return mobile;
    return `${mobile.slice(0, 2)}******${mobile.slice(-2)}`;
  }, [mobile]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setHint(null);

    if (!/^\d{6}$/.test(otp)) {
      setError('Please enter a valid 6-digit OTP.');
      return;
    }

    try {
      setLoading(true);
      await onVerify(otp);
    } catch (err: any) {
      setError(err?.message || 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    setHint(null);
    setOtp('');

    try {
      setResending(true);
      const nextHint = await onResend();
      if (nextHint) setHint(nextHint);
    } catch (err: any) {
      setError(err?.message || 'Could not resend OTP right now.');
    } finally {
      setResending(false);
    }
  };

  const isModal = mode === 'modal';

  return (
    <div className={isModal ? 'fixed inset-0 z-[120] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4' : 'h-full flex flex-col bg-white'}>
      <div className={isModal ? 'w-full max-w-md rounded-2xl overflow-hidden bg-white shadow-2xl max-h-[92vh] flex flex-col' : 'h-full flex flex-col bg-white'}>
      <div className="gradient-primary p-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-white">Verify Mobile Number</h2>
            <p className="text-white/90 text-sm">OTP sent to {maskedMobile}</p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleVerify}
        className={isModal ? 'flex-1 flex flex-col px-6 py-6 overflow-y-auto no-scrollbar' : 'flex-1 flex flex-col px-6 py-6 max-w-md mx-auto w-full overflow-y-auto no-scrollbar'}
      >
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-slate-500 mb-2 font-medium">
            <span>Step 2 of 2</span>
            <span>OTP verify karke test start karein</span>
          </div>
          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              className="h-full gradient-primary"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Enter 6-digit OTP</label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            className="w-full bg-white border-2 border-slate-200 rounded-2xl py-4 px-4 text-center tracking-[0.4em] text-lg text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none transition-all"
          />
          <p className="text-xs text-slate-500 mt-2">
            OTP validity: 10 minutes.
          </p>
        </div>

        {hint && (
          <p className="text-emerald-700 text-sm mt-3 font-medium">{hint}</p>
        )}

        {error && (
          <p className="text-rose-600 text-sm mt-3 font-medium">{error}</p>
        )}

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={handleResend}
            disabled={resending || loading}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`} />
            {resending ? 'Resending...' : 'Resend OTP'}
          </button>
        </div>

        <div className="mt-auto pt-8 space-y-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <p>Verified users only can start the exam.</p>
          </div>
          <button
            type="submit"
            disabled={loading || resending}
            className="w-full gradient-primary text-white font-bold py-4 px-6 rounded-2xl text-base shadow-button disabled:opacity-60"
          >
            {loading ? 'Verifying...' : 'Verify & Start Test'}
          </button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default OtpVerification;
