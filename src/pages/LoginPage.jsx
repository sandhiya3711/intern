import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Simulate slight delay for better UX
    await new Promise(r => setTimeout(r, 800));

    if (username === 'testuser' && password === 'Test123') {
      login({ username });
      navigate('/list');
    } else {
      setError('Invalid credentials. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-600/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full"></div>

      <div className="max-w-md w-full glass-card p-10 rounded-[2rem] relative z-10 border border-white/10 animate-fade-in">
        <div className="text-center mb-10">
          <div className="inline-block p-4 rounded-2xl bg-primary-500/10 mb-4 border border-primary-500/20">
            <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.21 3m-2.422 3.338L16.104 21M16.033 21l3.11-3.11m-14.881 2.527l.076-.041a13.883 13.883 0 013.973-1.673M12 21a9.003 9.003 0 008.315-5.685L20.5 14.5"></path>
            </svg>
          </div>
          <h1 className="text-4xl font-black gradient-text tracking-tight mb-2">Exspenso</h1>
          <p className="text-slate-400 font-medium">Employee Management Insights</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Username</label>
              <input
                type="text"
                required
                className="w-full bg-slate-900/50 border border-white/5 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all placeholder:text-slate-600"
                placeholder="testuser"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Password</label>
              <input
                type="password"
                required
                className="w-full bg-slate-900/50 border border-white/5 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all placeholder:text-slate-600"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm py-3 px-4 rounded-xl text-center font-medium animate-fade-in">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              "Sign In to Dashboard"
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <p className="text-xs text-slate-500">
            Secure high-performance infrastructure <br/> for identity and payroll audit.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
