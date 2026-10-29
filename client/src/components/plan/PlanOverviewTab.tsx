import React, { useState } from 'react';
import {
  Sparkles,
  Palette,
  Utensils,
  ShieldAlert,
  DollarSign,
  Users,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import { Event, EventPlan } from '../../types/index'
import { AiModeBadge } from '../common/Badge'
import { Modal } from '../common/Modal'
import { useEvents } from '../../context/EventContext'

interface PlanOverviewTabProps {
  event: Event;
  plan?: EventPlan;
}

export const PlanOverviewTab: React.FC<PlanOverviewTabProps> = ({ event, plan }) => {
  const { regeneratePlan } = useEvents();
  const [regenerateModalOpen, setRegenerateModalOpen] = useState(false);
  const [instructions, setInstructions] = useState('');
  const [preserveCustom, setPreserveCustom] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);

  if (!plan) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-xl mx-auto space-y-4">
        <Sparkles className="w-10 h-10 text-indigo-500 mx-auto" />
        <h3 className="text-xl font-bold font-serif text-slate-900">No AI Plan Generated Yet</h3>
        <p className="text-xs text-slate-500">
          This celebration does not have an active AI blueprint. Generate one now to unlock budget allocations and agendas.
        </p>
        <button
          onClick={() => setRegenerateModalOpen(true)}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700"
        >
          Generate Blueprint with AI
        </button>
      </div>
    );
  }

  const handleRegenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegenerating(true);
    try {
      await regeneratePlan(event.id, instructions, preserveCustom);
      setRegenerateModalOpen(false);
      setInstructions('');
      alert('Event plan successfully updated!');
    } catch (err) {
      console.error(err);
      alert('Failed to regenerate plan.');
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* AI Mode Banner */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          plan.generationMode === 'LIVE_AI'
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
            : 'bg-amber-50/70 border-amber-200 text-amber-950'
        }`}
      >
        <div className="flex items-start gap-3">
          <Sparkles
            className={`w-5 h-5 mt-0.5 shrink-0 ${
              plan.generationMode === 'LIVE_AI' ? 'text-emerald-600' : 'text-amber-600'
            }`}
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs sm:text-sm">
                {plan.generationMode === 'LIVE_AI'
                  ? 'Plan Generated Live with Google Gemini AI'
                  : 'Demo Mode: Contextual Celebration Blueprint'}
              </span>
              <AiModeBadge mode={plan.generationMode} />
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {plan.generationMode === 'LIVE_AI'
                ? 'Structured reasoning calibrated to your exact headcount, location, and budget constraints.'
                : 'Generated using Celebria contextual demo reasoning. To connect live Gemini AI, supply GEMINI_API_KEY in the server environment.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setRegenerateModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-white rounded-xl border border-slate-200 text-slate-700 hover:text-indigo-600 text-xs font-semibold shadow-sm transition-colors whitespace-nowrap shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Regenerate Plan</span>
        </button>
      </div>

      {/* Overview Narrative Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-subtle space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
          Executive Summary
        </span>
        <h3 className="text-2xl font-bold font-serif text-slate-900">Celebration Overview</h3>
        <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
          {plan.overview}
        </p>
      </div>

      {/* Theme & Decor Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-subtle space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-violet-600">
              Aesthetic Direction
            </span>
            <h3 className="text-xl font-bold font-serif text-slate-900">{plan.theme.title}</h3>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {plan.theme.description}
        </p>

        {/* Color Palette Swatches */}
        {plan.theme.colorPalette && plan.theme.colorPalette.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Curated Color Palette
            </h4>
            <div className="flex flex-wrap items-center gap-3">
              {plan.theme.colorPalette.map((color, idx) => (
                <div key={idx} className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div
                    className="w-7 h-7 rounded-lg shadow-sm border border-black/10"
                    style={{ backgroundColor: color }}
                  />
                  <span className="font-mono text-xs font-semibold text-slate-700 uppercase">
                    {color}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Decor Ideas List */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Decor &amp; Staging Highlights
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {plan.theme.decorIdeas.map((idea, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700"
              >
                <CheckCircle2 className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{idea}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Catering & Hospitality Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-subtle space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
              Hospitality &amp; Dining
            </span>
            <h3 className="text-xl font-bold font-serif text-slate-900">
              {plan.cateringSuggestions.style}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Menu Highlights */}
          <div className="p-5 rounded-2xl bg-rose-50/40 border border-rose-100 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wide text-rose-900">
              Menu Highlights
            </h4>
            <ul className="space-y-2 text-xs text-slate-700">
              {plan.cateringSuggestions.menuHighlights.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Beverage & Dietary Notes */}
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wide text-slate-700">
                Beverage Concepts
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {plan.cateringSuggestions.beverageIdeas.map((bev, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                    <span>{bev}</span>
                  </li>
                ))}
              </ul>
            </div>

            {plan.cateringSuggestions.dietaryNotes && (
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900">
                <span className="font-bold">Dietary Protocol: </span>
                {plan.cateringSuggestions.dietaryNotes}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Guest Management Checklist */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-subtle space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Hospitality Operations
            </span>
            <h3 className="text-xl font-bold font-serif text-slate-900">Guest Experience Checklist</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {plan.guestChecklist.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                  {item.phase}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-900">{item.task}</p>
              {item.tip && <p className="text-[11px] text-slate-500">{item.tip}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Contingencies & Risk Mitigation */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-subtle space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Contingency Planning
            </span>
            <h3 className="text-xl font-bold font-serif text-slate-900">Risks &amp; Backup Plans</h3>
          </div>
        </div>

        <div className="space-y-3">
          {plan.risks.map((risk, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                      risk.severity === 'High'
                        ? 'bg-rose-100 text-rose-800 border-rose-200'
                        : risk.severity === 'Medium'
                        ? 'bg-amber-100 text-amber-800 border-amber-200'
                        : 'bg-slate-200 text-slate-700 border-slate-300'
                    }`}
                  >
                    {risk.severity} Severity
                  </span>
                  <span className="text-xs font-bold text-slate-900">{risk.risk}</span>
                </div>
                <p className="text-xs text-slate-600 pl-1">
                  <span className="font-semibold text-slate-700">Mitigation: </span>
                  {risk.mitigationPlan}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Personalized Cost-Saving Strategies */}
      <div className="bg-gradient-to-br from-indigo-50 to-white rounded-3xl border border-indigo-100 p-6 sm:p-8 shadow-subtle space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Value Engineering
            </span>
            <h3 className="text-xl font-bold font-serif text-slate-900">
              Personalized Cost-Saving Strategies
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {plan.costSavingTips.map((tip, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-white border border-indigo-100 shadow-sm flex items-start gap-2.5 text-xs text-slate-700"
            >
              <DollarSign className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Regenerate Plan Modal */}
      <Modal
        isOpen={regenerateModalOpen}
        onClose={() => setRegenerateModalOpen(false)}
        title="Regenerate Celebration Plan"
        subtitle="Prompt the AI to update the plan or incorporate new directives"
      >
        <form onSubmit={handleRegenerate} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Custom Instructions or Tweaks (Optional)
            </label>
            <textarea
              rows={3}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Focus on eco-friendly decor, cut down photography budget by 10%, add midnight snacks to agenda..."
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-900">Preserve Custom Edits</span>
              <p className="text-[11px] text-slate-500">
                Keep existing expenses and custom tasks you have manually added.
              </p>
            </div>
            <input
              type="checkbox"
              checked={preserveCustom}
              onChange={(e) => setPreserveCustom(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              disabled={isRegenerating}
              onClick={() => setRegenerateModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isRegenerating}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
              <span>{isRegenerating ? 'Regenerating...' : 'Update Plan'}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
