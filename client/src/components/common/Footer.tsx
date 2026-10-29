import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, ShieldCheck, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-rose-400 flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold font-serif text-white tracking-tight">
                Celebria <span className="text-indigo-400 font-sans text-base">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every celebration, beautifully planned. An AI-powered celebration planning platform helping individuals, families, student organizers, and community coordinators organize unforgettable events.
            </p>
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium">
              <Award className="w-4 h-4" />
              <span>Hack2Skill PromptWars — Challenge 5</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Celebration Planner</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/wizard" className="hover:text-indigo-400 transition-colors">
                  Create Event Wizard
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-indigo-400 transition-colors">
                  Planner Dashboard
                </Link>
              </li>
              <li>
                <Link to="/#features" className="hover:text-indigo-400 transition-colors">
                  Smart AI Budgeting
                </Link>
              </li>
              <li>
                <Link to="/#features" className="hover:text-indigo-400 transition-colors">
                  Preparation Timelines
                </Link>
              </li>
              <li>
                <Link to="/#features" className="hover:text-indigo-400 transition-colors">
                  Vendor & Checklist Hub
                </Link>
              </li>
            </ul>
          </div>

          {/* Supported Events */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Supported Celebrations</h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-slate-300">Royal & Contemporary Weddings</li>
              <li className="hover:text-slate-300">Milestone Birthdays & Theme Parties</li>
              <li className="hover:text-slate-300">Silver & Golden Anniversaries</li>
              <li className="hover:text-slate-300">College Fests & Cultural Convocations</li>
              <li className="hover:text-slate-300">Community Festivals & Gatherings</li>
            </ul>
          </div>

          {/* Transparency & Security */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white mb-3">Transparency & Safety</h4>
            <div className="flex items-start gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                All AI recommendations and price ranges are realistic estimates. Vendor quotes must be verified directly with providers.
              </span>
            </div>
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 text-[11px] text-slate-400">
              Local-first architecture ensures your event notes and budget records remain securely stored on your browser.
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Celebria AI. Built with precision for Hack2Skill PromptWars Virtual Challenge 5.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for organizers everywhere.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
