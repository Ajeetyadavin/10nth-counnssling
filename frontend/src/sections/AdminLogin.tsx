import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME?.trim() || '';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD?.trim() || '';
const IS_ADMIN_CONFIGURED = Boolean(ADMIN_USERNAME && ADMIN_PASSWORD);

const AdminLogin = ({ onLogin, onBack }: { onLogin: () => void, onBack: () => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!IS_ADMIN_CONFIGURED) {
      setError('Admin credentials are not configured. Set VITE_ADMIN_USERNAME and VITE_ADMIN_PASSWORD.');
      return;
    }

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      onLogin();
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="h-full flex items-center justify-center bg-white">
      <div className="w-full max-w-[320px] px-4 space-y-10">
        <div className="flex flex-col gap-6">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs">Back</span>
          </button>
          
          <h1 className="text-2xl font-semibold text-slate-900">Login</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {!IS_ADMIN_CONFIGURED && (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
              Admin login is disabled until VITE_ADMIN_USERNAME and VITE_ADMIN_PASSWORD are set.
            </p>
          )}

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
            disabled={!IS_ADMIN_CONFIGURED}
            className="w-full bg-black text-white text-sm font-medium py-3 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
