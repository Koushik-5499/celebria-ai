import React from 'react';
import { Printer, Download, Sparkles, CheckCircle2 } from 'lucide-react';
import { Event, EventPlan, Expense, Task, Vendor } from '../../types/index'
import { formatCurrency, formatDate } from '../../utils/formatters'

interface PrintExportViewProps {
  event: Event;
  plan?: EventPlan;
  expenses: Expense[];
  tasks: Task[];
  vendors: Vendor[];
}

export const PrintExportView: React.FC<PrintExportViewProps> = ({
  event,
  plan,
  expenses,
  tasks,
  vendors,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const totalSpent = expenses.reduce((sum, e) => sum + (e.actualAmount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Print Trigger Card (hidden when printing) */}
      <div className="no-print bg-white p-6 rounded-3xl border border-slate-200/80 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold font-serif text-slate-900">
            Print &amp; Export Event Dossier
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Click below to generate a clean, print-formatted PDF or paper dossier for your venue, emcee, and caterers.
          </p>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/20 transition-all shrink-0"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Printable Sheet */}
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-md space-y-8 text-slate-900 card-print">
        {/* Header */}
        <div className="border-b-2 border-slate-900 pb-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Celebria AI • Celebration Blueprint</span>
            </div>
            <h1 className="text-3xl font-extrabold font-serif text-slate-900">{event.name}</h1>
            <p className="text-sm text-slate-600 mt-1">
              {event.eventType} • {event.location} • {formatDate(event.date)}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-slate-500">Total Budget:</span>
            <div className="text-2xl font-black text-indigo-700">
              {formatCurrency(event.totalBudget, event.currency)}
            </div>
            <span className="text-xs text-slate-500">{event.guestCount} Expected Guests</span>
          </div>
        </div>

        {/* Executive Overview */}
        {plan && (
          <div className="space-y-2">
            <h2 className="text-base font-bold uppercase tracking-wider text-slate-900 font-serif border-b border-slate-200 pb-1">
              1. Executive Overview
            </h2>
            <p className="text-xs leading-relaxed text-slate-700">{plan.overview}</p>
          </div>
        )}

        {/* Theme & Decor */}
        {plan && (
          <div className="space-y-3">
            <h2 className="text-base font-bold uppercase tracking-wider text-slate-900 font-serif border-b border-slate-200 pb-1">
              2. Theme, Decor &amp; Styling
            </h2>
            <div className="text-xs text-slate-700">
              <span className="font-bold">Concept: </span>
              {plan.theme.title} — {plan.theme.description}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {plan.theme.decorIdeas.map((idea, idx) => (
                <div key={idx} className="flex items-start gap-1.5">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span>{idea}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Budget Allocation Table */}
        <div className="space-y-3">
          <h2 className="text-base font-bold uppercase tracking-wider text-slate-900 font-serif border-b border-slate-200 pb-1">
            3. Budget Allocation &amp; Expense Status
          </h2>
          <table className="w-full text-xs text-left border border-slate-200">
            <thead className="bg-slate-100 text-slate-700 font-bold">
              <tr>
                <th className="p-2 border border-slate-200">Category</th>
                <th className="p-2 border border-slate-200">Planned Allocation</th>
                <th className="p-2 border border-slate-200">Actual Recorded</th>
                <th className="p-2 border border-slate-200">Notes</th>
              </tr>
            </thead>
            <tbody>
              {plan?.budgetAllocations.map((alloc) => {
                const catExpenses = expenses.filter((e) => e.category === alloc.category);
                const actual = catExpenses.reduce((s, e) => s + (e.actualAmount || 0), 0);
                return (
                  <tr key={alloc.category} className="border-b border-slate-200">
                    <td className="p-2 font-semibold border border-slate-200">{alloc.category}</td>
                    <td className="p-2 border border-slate-200">
                      {formatCurrency(alloc.estimatedAmount, event.currency)} ({alloc.percentage}%)
                    </td>
                    <td className="p-2 border border-slate-200">
                      {formatCurrency(actual, event.currency)}
                    </td>
                    <td className="p-2 text-slate-600 border border-slate-200">{alloc.tips}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-slate-50 font-bold">
              <tr>
                <td className="p-2 border border-slate-200">Total</td>
                <td className="p-2 border border-slate-200">
                  {formatCurrency(event.totalBudget, event.currency)}
                </td>
                <td className="p-2 border border-slate-200">
                  {formatCurrency(totalSpent, event.currency)}
                </td>
                <td className="p-2 border border-slate-200">
                  Remaining: {formatCurrency(event.totalBudget - totalSpent, event.currency)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Event Day Agenda */}
        {plan?.eventAgenda && (
          <div className="space-y-3 page-break">
            <h2 className="text-base font-bold uppercase tracking-wider text-slate-900 font-serif border-b border-slate-200 pb-1">
              4. Event Day Run-of-Show Agenda
            </h2>
            <div className="space-y-2">
              {plan.eventAgenda.map((ag, idx) => (
                <div key={idx} className="flex items-start gap-4 text-xs">
                  <span className="font-mono font-bold w-20 shrink-0 text-indigo-700">{ag.time}</span>
                  <div>
                    <span className="font-bold text-slate-900">{ag.activity}</span>
                    {ag.notes && <p className="text-slate-500 text-[11px]">{ag.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vendors Directory */}
        {vendors.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-base font-bold uppercase tracking-wider text-slate-900 font-serif border-b border-slate-200 pb-1">
              5. Confirmed Vendors &amp; Key Contacts
            </h2>
            <div className="grid grid-cols-2 gap-3 text-xs">
              {vendors.map((v) => (
                <div key={v.id} className="p-3 border border-slate-200 rounded-lg">
                  <div className="font-bold">{v.name} ({v.category})</div>
                  <div className="text-slate-600">Contact: {v.contact}</div>
                  <div className="text-slate-600">
                    Est: {formatCurrency(v.estimatedCost, event.currency)} • Status: {v.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contingency Protocols */}
        {plan?.risks && (
          <div className="space-y-2">
            <h2 className="text-base font-bold uppercase tracking-wider text-slate-900 font-serif border-b border-slate-200 pb-1">
              6. Risk &amp; Contingency Backup Plans
            </h2>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {plan.risks.map((r, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="font-bold">[{r.severity}]: {r.risk} — </span>
                  <span>{r.mitigationPlan}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Print Footer */}
        <div className="pt-6 border-t border-slate-200 text-center text-[10px] text-slate-400">
          Generated via Celebria AI • Every celebration, beautifully planned.
        </div>
      </div>
    </div>
  );
};
