import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, ArrowRight, Mail, Lock, Building, User, Sparkles } from 'lucide-react';

export const AuthModal = ({ isOpen, onClose, defaultIsRegister = false }) => {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(defaultIsRegister);
  const [companyName, setCompanyName] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    let res;
    if (isRegister) {
      if (!companyName || !email || !password) {
        setError("Barcha majburiy maydonlarni to'ldiring");
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
    if (res.success) {
      onClose();
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-navy-900/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-navy-800 border border-navy-600 rounded-3xl w-full max-w-md p-7 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center justify-center p-2.5 bg-navy-700/80 border border-navy-600 rounded-2xl">
            <img src="/logo.png" alt="Analytix AI" className="h-9 w-auto object-contain" />
          </div>
          <h2 className="font-display font-semibold text-xl text-white">
            Analytix<span className="text-teal font-bold text-xs align-super ml-1">AI</span>
          </h2>
          <p className="text-xs text-slate-400">
            {isRegister ? "Yangi kompaniya platformasini ro'yxatdan o'tkazish" : "Tizimga kirish va analitikani boshlash"}
          </p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs p-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isRegister && (
            <>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
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
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Ismingiz
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Javohir Karimov"
                    className="w-full bg-navy-900 border border-navy-600 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal transition-colors"
                  />
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Email Manzil *
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
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
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
            className="w-full py-3 bg-teal hover:bg-teal-light text-navy-900 font-semibold text-xs rounded-xl shadow-lg shadow-teal/20 transition-all flex items-center justify-center space-x-2 mt-2"
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

        <div className="text-center pt-3 border-t border-navy-700/80 mt-4">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="text-xs text-slate-400 hover:text-teal transition-colors font-medium"
          >
            {isRegister ? "Akkountingiz bormi? Tizimga kirish" : "Akkountingiz yo'qmi? Yangi ro'yxatdan o'tish"}
          </button>
        </div>

      </div>
    </div>
  );
};
