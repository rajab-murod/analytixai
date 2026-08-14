import React, { useState, useEffect } from 'react';
import { projectsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { EditProjectModal } from '../components/EditProjectModal';
import { Database, Plus, Server, Cpu, CheckCircle, Trash2, Edit2, AlertTriangle, User, Globe } from 'lucide-react';

export const ProjectsPage = ({ onOpenCreateProject }) => {
  const { user } = useAuth();
  const companyId = user?.company_id || 1;

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Edit & Delete State
  const [editingProject, setEditingProject] = useState(null);
  const [deletingProjectId, setDeletingProjectId] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const resp = await projectsAPI.list(companyId);
      setProjects(resp.data || []);
    } catch (e) {
      setError('Loyihalarni yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      await projectsAPI.delete(id, companyId);
      setProjects(projects.filter(p => p.id !== id));
      setDeletingProjectId(null);
    } catch (err) {
      alert(err.response?.data?.detail || "Loyihani o'chirishda xatolik yuz berdi");
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-semibold text-2xl text-navy-700 flex items-center space-x-2">
            <span>Loyihalar & Bazalar Boshqaruvi</span>
            <span className="text-xs bg-teal/15 text-teal font-mono px-2.5 py-0.5 rounded-full border border-teal/30">
              Tenant #{companyId}
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Har bir kompaniya faqat o'ziga tegishli loyihalar va bazalar ustida ishlaydi (Tenant Isolation)
          </p>
        </div>

        <button
          onClick={onOpenCreateProject}
          className="bg-teal hover:bg-teal-dark text-navy-900 font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow-lg shadow-teal/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi Loyiha Qo'shish</span>
        </button>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs p-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-500">
          Loyihalar yuklanmoqda...
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white border border-mist rounded-2xl p-12 text-center space-y-3 shadow-sm">
          <Database className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-semibold text-sm text-navy-700">Hali hech qanday loyiha yaratilmagan</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            "Yangi Loyiha Qo'shish" tugmasini bosib o'zingizning birinchi ma'lumotlar bazangizni ulang.
          </p>
          <button
            onClick={onOpenCreateProject}
            className="bg-teal text-navy-900 font-semibold px-4 py-2 rounded-xl text-xs inline-flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Loyiha yaratish</span>
          </button>
        </div>
      ) : (
        /* Projects Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p) => (
            <div 
              key={p.id} 
              className="bg-white border border-mist hover:border-teal/50 rounded-2xl p-5 space-y-4 transition-all duration-200 shadow-sm hover:shadow-md group relative flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-navy-700 text-teal flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-navy-700">{p.name}</h3>
                      <span className="text-[10px] bg-slate-100 text-slate-500 font-mono px-2 py-0.5 rounded border border-slate-200">
                        Loyiha #{p.id}
                      </span>
                    </div>
                  </div>

                  {/* Edit & Delete Action Buttons */}
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setEditingProject(p)}
                      className="p-1.5 text-slate-400 hover:text-teal hover:bg-teal/10 rounded-lg transition-colors"
                      title="Loyihani tahrirlash"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingProjectId(p.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Loyihani o'chirish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed min-h-[32px]">
                  {p.description || 'Tavsif kiritilmagan'}
                </p>

                <div className="border-t border-mist pt-3 space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center space-x-1.5 text-slate-400">
                      <Server className="w-3.5 h-3.5 text-teal" />
                      <span>Baza turi:</span>
                    </span>
                    <span className="text-navy-700 uppercase font-bold">{p.db_type}</span>
                  </div>
                  {p.db_type !== 'sqlite' && (
                    <>
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center space-x-1.5 text-slate-400">
                          <Globe className="w-3.5 h-3.5 text-teal" />
                          <span>Host / Server:</span>
                        </span>
                        <span className="text-navy-700 truncate max-w-[140px]">{p.db_host || 'localhost'}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center space-x-1.5 text-slate-400">
                          <User className="w-3.5 h-3.5 text-teal" />
                          <span>Baza User:</span>
                        </span>
                        <span className="text-navy-700 font-semibold">{p.db_user || 'read_only_user'}</span>
                      </div>
                    </>
                  )}
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center space-x-1.5 text-slate-400">
                      <Cpu className="w-3.5 h-3.5 text-teal" />
                      <span>LLM Model:</span>
                    </span>
                    <span className="text-teal capitalize font-semibold">{p.llm_provider}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 text-[11px] text-slate-400 border-t border-mist">
                <span className="flex items-center text-emerald-600 space-x-1 font-medium">
                  <CheckCircle className="w-3 h-3" />
                  <span>Read-Only Ulandigan</span>
                </span>
                <span>{p.created_at ? p.created_at.split('T')[0] : 'Aktiv'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingProject && (
        <EditProjectModal
          isOpen={!!editingProject}
          onClose={() => setEditingProject(null)}
          project={editingProject}
          onProjectUpdated={(updated) => {
            setProjects(projects.map(p => p.id === updated.id ? { ...p, ...updated } : p));
            setEditingProject(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingProjectId && (
        <div className="fixed inset-0 z-50 bg-navy-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-mist rounded-2xl w-full max-w-sm p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-rose-500">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-semibold text-base text-navy-700">Loyihani O'chirish</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ushbu loyihani va unga tegishli barcha konfiguratsiyalarni o'chirishga ishonchingiz komilmi? Bu amalni ortga qaytarib bo'lmaydi.
            </p>
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setDeletingProjectId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Bekor qilish
              </button>
              <button
                onClick={() => handleDeleteProject(deletingProjectId)}
                className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs rounded-xl shadow-lg transition-colors"
              >
                O'chirish
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
