import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const DEFAULT_API_BASE = import.meta.env.DEV ? '' : 'http://localhost:5001';
const API_BASE = import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE;
const APP_SOURCE: 'dubey' = 'dubey';

const AdminLogin = ({ onLogin, onBack }: { onLogin: (token: string, scope: 'all' | 'dubey') => void, onBack: () => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/admin/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, source: APP_SOURCE })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.token) {
        throw new Error(data?.error || 'Invalid username or password');
      }

      const scope = data?.scope === 'dubey' ? 'dubey' : 'all';
      if (scope !== 'dubey') {
        throw new Error('Dubey panel ke liye Dubey admin credentials use karein.');
      }

      onLogin(String(data.token), scope);
    } catch (err: any) {
      setError(err?.message || 'Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-amber-50">
      <div className="w-full max-w-[360px] px-5 py-8 rounded-2xl border border-sky-100 bg-white shadow-xl shadow-sky-100/60 space-y-8">
        <div className="flex flex-col gap-6">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs">Back</span>
          </button>
          
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-sky-600 uppercase">Dubey Tutorials</p>
            <h1 className="text-2xl font-semibold text-slate-900 mt-1">Admin Login</h1>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <input 
              type="text" 
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-slate-400"
            />
            <input 
              type="password" 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-slate-400"
            />
          </div>

          {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-sky-700 text-white text-sm font-medium py-3 rounded-lg hover:bg-sky-800 transition-colors disabled:opacity-70"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
