import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Database, ShieldCheck, ChevronDown, User, LogOut, Plus, Sparkles } from 'lucide-react';

export const Navbar = ({ onOpenCreateProject }) => {
  const { user, activeProject, setActiveProject, logout } = useAuth();
  const [projectDropdown, setProjectDropdown] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  const sampleProjects = [
    { id: 1, name: "Asosiy Sotuvlar Bazasi", type: "SQLite (Sample)" },
    { id: 2, name: "Talabalar o'zlashtirish DB", type: "PostgreSQL" },
    { id: 3, name: "Moliya & Revenue Analytics", type: "MySQL" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-mist px-6 py-3">
      <div className="flex items-center justify-between">
        
        {/* Brand & Project Selector */}
        <div className="flex items-center space-x-6">
          <a href="#" className="flex items-center space-x-3 group">
            <img 
              src="/logo.png" 
              alt="Analytix AI" 
              className="h-9 w-auto object-contain rounded-lg transition-transform duration-200 group-hover:scale-105" 
            />
            <span className="font-display font-semibold text-xl tracking-tight text-navy-700">
              Analytix<span className="text-teal font-bold text-xs align-super ml-1">AI</span>
            </span>
          </a>

          <div className="h-5 w-px bg-mist hidden sm:block"></div>

          {/* Project Switcher */}
          <div className="relative">
            <button
              onClick={() => setProjectDropdown(!projectDropdown)}
              className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 border border-mist text-xs font-semibold px-3 py-1.5 rounded-xl text-navy-700 transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-teal" />
              <span>{activeProject.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {projectDropdown && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-mist rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Loyihalaringiz
                </div>
                {sampleProjects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setActiveProject(p);
                      setProjectDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-100 transition-colors ${
                      activeProject.id === p.id ? 'text-teal font-semibold bg-teal/10' : 'text-slate-700'
                    }`}
                  >
                    <span>{p.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{p.type}</span>
                  </button>
                ))}
                <div className="border-t border-mist mt-1 pt-1">
                  <button
                    onClick={() => {
                      setProjectDropdown(false);
                      onOpenCreateProject();
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-teal hover:bg-slate-100 flex items-center space-x-2 font-medium"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Yangi loyiha qo'shish</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Section: Security Badge & Profile */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-1.5 bg-teal/10 border border-teal/30 px-3 py-1 rounded-full text-[11px] text-teal font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-teal" />
            <span>SQL Guard Active (Read-Only)</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setUserDropdown(!userDropdown)}
              className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 border border-mist rounded-full p-1 pr-3 text-xs text-navy-700 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-teal flex items-center justify-center font-bold text-white text-xs">
                {user ? user.full_name?.charAt(0) || 'U' : 'A'}
              </div>
              <span className="font-semibold hidden sm:inline">{user ? user.full_name || user.email : 'Demo Admin'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {userDropdown && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-mist rounded-2xl shadow-2xl py-2 z-50">
                <div className="px-4 py-2 border-b border-mist">
                  <p className="text-xs font-semibold text-navy-700">{user?.full_name || 'Demo User'}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.email || 'admin@analytix.ai'}</p>
                  <span className="inline-block mt-1 text-[10px] bg-teal/15 text-teal px-2 py-0.5 rounded font-mono font-semibold">
                    {user?.company_name || 'Enterprise Tenant'}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-xs text-rose-500 hover:bg-rose-50 flex items-center space-x-2 font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Tizimdan chiqish</span>
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};
