import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Calendar, PlusCircle, Menu, X, Info, RotateCcw } from 'lucide-react';
import { useEvents } from '../../context/EventContext'
import { Modal } from './Modal'

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { serverHealth, resetToSampleData } = useEvents();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [resetting, setResetting] = useState(false);

  const isLiveAi = serverHealth?.aiProvider?.configured ?? false;

  const handleResetSample = async () => {
    if (window.confirm('Load sample celebrations data (Aarav & Meera Royal Palace Wedding)?')) {
      setResetting(true);
      await resetToSampleData();
      setResetting(false);
      alert('Sample celebration data loaded successfully!');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Features', path: '/#features' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-rose-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-2xl font-bold font-serif tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Celebria <span className="text-indigo-600 font-sans text-xl font-extrabold">AI</span>
                </span>
                <p className="text-[11px] font-medium text-slate-500 -mt-1 hidden sm:block">
                  Every celebration, beautifully planned.
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-semibold transition-colors ${
                    location.pathname === link.path
                      ? 'text-indigo-600'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {/* AI Status Pill */}
              <button
                onClick={() => setInfoModalOpen(true)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  isLiveAi
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                    : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                }`}
                title="Click to view AI engine status"
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isLiveAi ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'
                  }`}
                />
                <span>{isLiveAi ? 'Live Gemini AI' : 'Demo Mode (Sample AI)'}</span>
                <Info className="w-3.5 h-3.5 opacity-60" />
              </button>
            </nav>

            {/* Action Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={handleResetSample}
                disabled={resetting}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
                title="Reset or load sample event data"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
                <span>Load Sample</span>
              </button>

              <Link
                to="/wizard"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-sm font-semibold shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/30 transition-all transform active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Plan My Event</span>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg text-base font-semibold ${
                    location.pathname === link.path
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 flex flex-col gap-3">
              <button
                onClick={() => {
                  setInfoModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium border ${
                  isLiveAi
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${isLiveAi ? 'bg-emerald-500' : 'bg-amber-500'}`}
                  />
                  <span>AI Engine: {isLiveAi ? 'Live Gemini AI' : 'Demo Mode Fallback'}</span>
                </span>
                <Info className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  handleResetSample();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-50"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Load Sample Celebrations</span>
              </button>

              <Link
                to="/wizard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm shadow-md shadow-indigo-600/20"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Plan My Event</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* AI Provider Status Modal */}
      <Modal
        isOpen={infoModalOpen}
        onClose={() => setInfoModalOpen(false)}
        title="Celebria AI Provider Status"
        subtitle="Transparent GenAI integration & fallback overview"
      >
        <div className="space-y-4 text-sm text-slate-600">
          <div
            className={`p-4 rounded-xl border ${
              isLiveAi
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                : 'bg-amber-50/70 border-amber-200 text-amber-900'
            }`}
          >
            <div className="flex items-center gap-2 font-bold mb-1">
              <span className={`w-2.5 h-2.5 rounded-full ${isLiveAi ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span>Current Status: {isLiveAi ? 'Live Gemini AI Active' : 'Demo Mode Active'}</span>
            </div>
            <p className="text-xs leading-relaxed">
              {isLiveAi
                ? `The backend server is successfully connected to Google Gemini (${serverHealth?.aiProvider?.model}). Every plan is generated in real-time with live AI reasoning.`
                : 'No Google Gemini API key was detected in the environment. Celebria AI is currently using its intelligent, contextual Demo Engine to generate realistic, full-featured plans without failing or faking live requests.'}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-1">How to enable Live Gemini AI:</h4>
            <p className="text-xs text-slate-500 mb-2">
              Add your Google Gemini API key to your environment variables on your server or in a <code className="text-indigo-600 font-mono">.env</code> file:
            </p>
            <div className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-xs overflow-x-auto">
              GEMINI_API_KEY=your_gemini_api_key_here<br />
              GEMINI_MODEL=gemini-1.5-flash
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3">
            <h4 className="font-semibold text-slate-900 mb-1">Hack2Skill Challenge 5 Compliance:</h4>
            <ul className="text-xs text-slate-500 space-y-1 list-disc pl-4">
              <li>Server-side GenAI integration (never exposes keys on the frontend).</li>
              <li>Clear separation between Demo Mode and Live AI responses.</li>
              <li>Local-first persistence with localStorage &amp; migration resilience.</li>
              <li>Realistic budgets, timelines, checklists, and vendor management.</li>
            </ul>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setInfoModalOpen(false)}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
            >
              Understood
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
