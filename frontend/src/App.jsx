import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { CreateProjectModal } from './components/CreateProjectModal';
import { AuthModal } from './components/AuthModal';
import { LandingPage } from './pages/LandingPage';
import { QueryPlayground } from './pages/QueryPlayground';
import { ProjectsPage } from './pages/ProjectsPage';
import { TokensPage } from './pages/TokensPage';
import { LogsPage } from './pages/LogsPage';
import { BillingPage } from './pages/BillingPage';

function AppContent() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState(() => (user ? 'dashboard' : 'landing'));
  const [activeTab, setActiveTab] = useState('query');
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authDefaultRegister, setAuthDefaultRegister] = useState(false);

  const openAuth = (isRegister = false) => {
    setAuthDefaultRegister(isRegister);
    setIsAuthModalOpen(true);
  };

  // If user just logged in and viewMode is still landing, switch to dashboard
  if (user && viewMode === 'landing') {
    setViewMode('dashboard');
  }

  return (
    <div className="min-h-screen bg-paper text-navy-700 flex flex-col font-sans">
      
      {/* LANDING PAGE VIEW */}
      {viewMode === 'landing' && !user && (
        <LandingPage
          onOpenAuth={openAuth}
          onGoToDashboard={() => setViewMode('dashboard')}
        />
      )}

      {/* DASHBOARD VIEW */}
      {(viewMode === 'dashboard' || user) && (
        <div className="min-h-screen flex flex-col bg-paper">
          <Navbar 
            onOpenCreateProject={() => setIsProjectModalOpen(true)} 
          />
          
          <div className="flex-1 flex overflow-hidden">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            
            <main className="flex-1 overflow-y-auto bg-paper p-2">
              {activeTab === 'query' && <QueryPlayground />}
              {activeTab === 'projects' && <ProjectsPage onOpenCreateProject={() => setIsProjectModalOpen(true)} />}
              {activeTab === 'tokens' && <TokensPage />}
              {activeTab === 'logs' && <LogsPage />}
              {activeTab === 'billing' && <BillingPage />}
            </main>
          </div>
        </div>
      )}

      {/* MODALS */}
      <CreateProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onProjectCreated={(newProject) => {
          setActiveTab('projects');
        }}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultIsRegister={authDefaultRegister}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
