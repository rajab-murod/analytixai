import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, ShieldCheck, Database, Lock, Mail, User, Building } from 'lucide-react';

export const AuthPage = () => {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    let res;
    if (isRegister) {
      if (!companyName || !email || !password) {
        setError("Barcha maydonlarni to'ldiring");
        setLoading(false);
        return;
      }
      res = await register(companyName, fullName, email, password);
    } else {
      if (!email || !password) {
        setError("Email va parolni kiriting");
        setLoading(false);
        return;
      }
      res = await login(email, password);
    }

    setLoading(false);
    if (!res.success) {
      setError(res.error);
    }
  };

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-navy-700/50 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-navy-800/90 border border-navy-600 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative z-10 space-y-6">
        
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-navy-700/80 border border-navy-600 rounded-2xl mb-2">
            <img src="/logo.png" alt="Analytix AI" className="h-10 w-auto object-contain" />
          </div>
          <h1 className="font-display font-semibold text-2xl text-white">
            Analytix<span className="text-teal font-bold text-sm align-super ml-1">AI</span>
          </h1>
          <p className="text-xs text-slate-400">
            {isRegister ? "Yangi kompaniya akkountini yaratish" : "Multi-tenant Analitika Platformasiga kirish"}
          </p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs p-3 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Kompaniya Nomi *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Masalan: Orient Tech LLC"
                    className="w-full bg-navy-900 border border-navy-600 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal transition-colors"
                  />
                  <Building className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Ismingiz
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alisher Mahmudov"
                    className="w-full bg-navy-900 border border-navy-600 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal transition-colors"
                  />
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Email Manzilingiz *
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@kompaniya.uz"
                className="w-full bg-navy-900 border border-navy-600 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal transition-colors"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Parol *
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-navy-900 border border-navy-600 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal transition-colors"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-teal hover:bg-teal-light text-navy-900 font-semibold text-xs rounded-xl shadow-lg shadow-teal/20 transition-all flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span>Tekshirilmoqda...</span>
            ) : (
              <>
                <span>{isRegister ? "Ro'yxatdan o'tish" : "Tizimga kirish"}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-navy-700/80">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="text-xs text-slate-400 hover:text-teal transition-colors"
          >
            {isRegister ? "Akkountingiz bormi? Tizimga kirish" : "Akkountingiz yo'qmi? Yangi ro'yxatdan o'tish"}
          </button>
        </div>

      </div>
    </div>
  );
};
