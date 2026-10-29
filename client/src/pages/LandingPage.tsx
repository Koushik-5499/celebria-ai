import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  PieChart,
  Calendar,
  Users,
  CheckCircle2,
  DollarSign,
  ShieldCheck,
  Star,
  PartyPopper,
  Music,
  MapPin,
  Utensils,
  ChevronRight,
} from 'lucide-react';
import { SAMPLE_WEDDING_PLAN, SAMPLE_WEDDING_EVENT } from '../utils/sampleData'
import { formatCurrency } from '../utils/formatters'

export const LandingPage: React.FC = () => {
  const [activePreviewTab, setActivePreviewTab] = useState<'wedding' | 'birthday' | 'college'>('wedding');

  const previews = {
    wedding: {
      title: "Aarav & Meera's Royal Palace Wedding",
      type: 'Wedding',
      budget: '₹ 25,00,000',
      guests: '350 Guests',
      location: 'Udaipur, Rajasthan',
      theme: 'Heritage Palace Grandeur with Lotus & Marigold Florals',
      highlight: 'Floating lakeside mandap, 5-course Rajasthani banquet & Sangeet choreography.',
      categories: [
        { name: 'Catering', pct: '30%', amount: '₹ 7,50,000' },
        { name: 'Venue', pct: '28%', amount: '₹ 7,00,000' },
        { name: 'Decoration', pct: '14%', amount: '₹ 3,50,000' },
        { name: 'Photography', pct: '10%', amount: '₹ 2,50,000' },
      ],
    },
    birthday: {
      title: "Rohan's 25th Neon Sky Birthday Bash",
      type: 'Birthday',
      budget: '₹ 1,50,000',
      guests: '80 Guests',
      location: 'Bangalore, Karnataka',
      theme: 'Cyberpunk Neon Glow & Rooftop Acoustic Vibe',
      highlight: 'LED photo nook, signature cocktail mocktails, live barbecue station & DJ setup.',
      categories: [
        { name: 'Catering & Bar', pct: '35%', amount: '₹ 52,500' },
        { name: 'Venue & Rooftop', pct: '22%', amount: '₹ 33,000' },
        { name: 'DJ & Sound', pct: '15%', amount: '₹ 22,500' },
        { name: 'Neon Decor', pct: '15%', amount: '₹ 22,500' },
      ],
    },
    college: {
      title: "Ignite 2026: National Tech & Cultural Conclave",
      type: 'College Event',
      budget: '₹ 8,00,000',
      guests: '1,200 Attendees',
      location: 'IIT Campus Auditorium',
      theme: 'Futuristic Horizon: Innovation Meets Rhythm',
      highlight: 'Pro-night battle of the bands, hackathon awards, multi-cuisine food trucks.',
      categories: [
        { name: 'Stage & Pro-Audio', pct: '28%', amount: '₹ 2,24,000' },
        { name: 'Auditorium Venue', pct: '22%', amount: '₹ 1,76,000' },
        { name: 'Snacks & Catering', pct: '22%', amount: '₹ 1,76,000' },
        { name: 'Prizes & Badges', pct: '12%', amount: '₹ 96,000' },
      ],
    },
  };

  const currentPreview = previews[activePreviewTab];

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Subtle decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-200/40 via-violet-200/30 to-rose-200/40 blur-3xl -z-10 rounded-full pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-indigo-100 shadow-sm text-xs font-semibold text-indigo-700 mb-6">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Hack2Skill PromptWars Challenge 5 Submission</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight font-serif max-w-4xl mx-auto leading-[1.15]">
          Every celebration, <br />
          <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-rose-500 bg-clip-text text-transparent">
            beautifully planned.
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
          From majestic royal weddings to milestone birthdays, college fests, and community festivals.
          Celebria AI crafts personalized blueprints, balanced budgets, minute-by-minute agendas, and vendor checklists.
        </p>

        {/* CTA buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/wizard"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-base shadow-xl shadow-indigo-600/25 hover:shadow-indigo-600/35 transition-all transform active:scale-95"
          >
            <span>Plan My Event</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            to="/dashboard"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-base border border-slate-200 shadow-sm transition-all"
          >
            <span>Explore Dashboard</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </Link>
        </div>

        {/* Micro-trust indicators */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs font-medium text-slate-500">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Structured Gemini GenAI Engine</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Dynamic Expense &amp; Budget Tracker</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Local-First Persistence (No Login Required)</span>
          </div>
        </div>
      </section>

      {/* Interactive Sample Plan Preview Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
          {/* Header & Tabs */}
          <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Interactive Showcase
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mt-1 font-serif">
                Real Plans Crafted by Celebria AI
              </h2>
            </div>

            {/* Switcher */}
            <div className="flex items-center p-1.5 bg-slate-200/70 rounded-2xl text-xs font-semibold">
              <button
                onClick={() => setActivePreviewTab('wedding')}
                className={`px-4 py-2 rounded-xl transition-all ${
                  activePreviewTab === 'wedding'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Royal Wedding
              </button>
              <button
                onClick={() => setActivePreviewTab('birthday')}
                className={`px-4 py-2 rounded-xl transition-all ${
                  activePreviewTab === 'birthday'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Milestone Birthday
              </button>
              <button
                onClick={() => setActivePreviewTab('college')}
                className={`px-4 py-2 rounded-xl transition-all ${
                  activePreviewTab === 'college'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                College Fest
              </button>
            </div>
          </div>

          {/* Preview Content */}
          <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Left: Summary */}
            <div className="lg:col-span-2 space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
                  {currentPreview.type}
                </span>
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {currentPreview.location}
                </span>
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  {currentPreview.guests}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 font-serif">
                {currentPreview.title}
              </h3>

              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 space-y-1">
                <div className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                  AI Theme Concept
                </div>
                <p className="text-sm text-amber-950 font-medium">{currentPreview.theme}</p>
                <p className="text-xs text-amber-800/80">{currentPreview.highlight}</p>
              </div>

              {/* Budget allocations mini grid */}
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  AI Budget Allocation ({currentPreview.budget} Total)
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {currentPreview.categories.map((cat) => (
                    <div
                      key={cat.name}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-center"
                    >
                      <div className="text-xs text-slate-500 font-medium">{cat.name}</div>
                      <div className="text-base font-bold text-slate-900 mt-0.5">{cat.pct}</div>
                      <div className="text-[11px] text-indigo-600 font-semibold">{cat.amount}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Quick Action Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-rose-50 border border-indigo-100/80 space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm text-indigo-600 flex items-center justify-center mx-auto">
                <PartyPopper className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 font-serif">
                Want a custom plan for your event?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enter your guest count, budget, and preferences in our 4-step wizard. Celebria AI produces a full tailored blueprint in seconds.
              </p>
              <Link
                to="/wizard"
                className="block w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md transition-colors"
              >
                Start Event Wizard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Pillars Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            End-to-End Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif mt-2">
            Everything you need for flawless celebration planning
          </h2>
          <p className="text-base text-slate-600 mt-3">
            Celebria AI bridges the gap between creative vision and on-the-ground operational execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Card 1 */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-subtle hover:shadow-premium transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 font-serif">AI Blueprint Engine</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Context-aware GenAI structures complete celebration themes, decor palettes, catering menus, and contingency risk mitigations.
            </p>
            <div className="text-xs font-semibold text-indigo-600 flex items-center gap-1">
              <span>Structured JSON outputs</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-subtle hover:shadow-premium transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <PieChart className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 font-serif">Smart Budgeting</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Category allocation breakdowns, real-time spending tracker, overbudget alerts, and visual Recharts graphs.
            </p>
            <div className="text-xs font-semibold text-rose-600 flex items-center gap-1">
              <span>Planned vs Actual math</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-subtle hover:shadow-premium transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Calendar className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 font-serif">Timelines &amp; Agendas</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Preparation milestones scheduled weeks prior, plus a minute-by-minute day-of agenda to keep emcees, caterers, and family in sync.
            </p>
            <div className="text-xs font-semibold text-amber-600 flex items-center gap-1">
              <span>Overdue task highlighting</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 4 */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-subtle hover:shadow-premium transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 font-serif">Vendor Hub</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Manage quotes, interview questions, and statuses from &apos;To Contact&apos; to &apos;Confirmed&apos;, with clear disclaimers that keep you in control.
            </p>
            <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <span>Negotiation checklists</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Walkthrough */}
      <section className="bg-white py-20 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Workflow Simplicity
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 font-serif mt-2">
              From spark of an idea to unforgettable celebration
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-serif">1. Share Your Celebration Vision</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Specify event type, target date, city, expected guest headcount, budget cap, and dietary or cultural nuances.
              </p>
            </div>

            <div className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-violet-600 text-white font-bold flex items-center justify-center text-sm">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-serif">2. AI Synthesizes Your Blueprint</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The AI engine computes budget proportions, drafts preparation milestones, builds an hour-by-hour event schedule, and creates vendor recommendations.
              </p>
            </div>

            <div className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-rose-600 text-white font-bold flex items-center justify-center text-sm">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-serif">3. Track, Customize &amp; Celebrate</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Record real vendor invoices, tick off completed milestones, adjust budgets on interactive charts, and export a clean print-ready packet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ready Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white p-10 sm:p-14 overflow-hidden shadow-2xl">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-800/80 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PromptWars Challenge 5 Ready</span>
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-serif leading-tight">
              Ready to plan your next memorable celebration?
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              Start now with our multi-step wizard. Explore sample celebrations or craft your own in under two minutes.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/wizard"
                className="px-6 py-3.5 rounded-xl bg-white text-slate-900 font-bold text-sm hover:bg-slate-100 transition-colors shadow-lg"
              >
                Plan My Event Now
              </Link>
              <Link
                to="/dashboard"
                className="px-6 py-3.5 rounded-xl bg-indigo-800/60 hover:bg-indigo-800/90 text-white border border-indigo-700/60 font-semibold text-sm transition-colors"
              >
                Open Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
