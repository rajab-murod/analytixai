import React, { useState } from 'react';
import { KeyRound, Copy, Plus, Check, ShieldAlert } from 'lucide-react';

export const TokensPage = () => {
  const [tokens, setTokens] = useState([
    { id: 1, name: "CRM Systems Integration Key", token: "aai_live_8f93a1c9e82b7401", rate_limit: 1000, created: "2026-08-14" },
    { id: 2, name: "Mobile App Access Token", token: "aai_live_3b7194f02a1148e2", rate_limit: 500, created: "2026-08-12" }
  ]);
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const generateNewToken = () => {
    const newToken = {
      id: Date.now(),
      name: `Integratsiya API Key ${tokens.length + 1}`,
      token: `aai_live_${Math.random().toString(36).substring(2, 18)}`,
      rate_limit: 1000,
      created: new Date().toISOString().split('T')[0]
    };
    setTokens([newToken, ...tokens]);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-semibold text-2xl text-navy-700">API Tokenlar & Integratsiya</h1>
          <p className="text-xs text-slate-500 mt-1">
            Tashqi CRM, LMS yoki ERP tizimlaringizni REST API (`/api/query`) orqali ulash uchun tokenlar
          </p>
        </div>

        <button
          onClick={generateNewToken}
          className="bg-teal hover:bg-teal-dark text-navy-900 font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow-lg shadow-teal/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi Token Yaratish</span>
        </button>
      </div>

      <div className="space-y-4">
        {tokens.map((t) => (
          <div key={t.id} className="bg-white border border-mist rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <KeyRound className="w-4 h-4 text-teal" />
                <h3 className="font-semibold text-sm text-navy-700">{t.name}</h3>
              </div>
              <p className="text-xs font-mono text-slate-500">
                Rate Limit: <span className="text-teal font-semibold">{t.rate_limit} so'rov/soat</span> · Yaratilgan: {t.created}
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <code className="bg-slate-100 border border-mist rounded-xl px-4 py-2 text-xs font-mono text-navy-700 font-semibold">
                {t.token}
              </code>
              <button
                onClick={() => handleCopy(t.id, t.token)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2.5 rounded-xl text-xs transition-colors"
                title="Nusxa olish"
              >
                {copiedId === t.id ? <Check className="w-4 h-4 text-teal" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
