import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Edit3,
  Trash2,
  Printer,
  ChevronLeft,
  PieChart,
  Clock,
  Briefcase,
  AlertCircle,
} from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { formatCurrency, formatDate, getDaysRemaining } from '../utils/formatters';
import { PlanOverviewTab } from '../components/plan/PlanOverviewTab';
import { BudgetManagerTab } from '../components/budget/BudgetManagerTab';
import { TimelinePlannerTab } from '../components/timeline/TimelinePlannerTab';
import { VendorManagerTab } from '../components/vendors/VendorManagerTab';
import { PrintExportView } from '../components/plan/PrintExportView';
import { Modal } from '../components/common/Modal';
import { Event } from '../types/index';

export const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    getEvent,
    getEventPlan,
    getEventExpenses,
    getEventTasks,
    getEventVendors,
    updateEvent,
    deleteEvent,
  } = useEvents();

  const [activeTab, setActiveTab] = useState<
    'plan' | 'budget' | 'timeline' | 'vendors' | 'export'
  >('plan');

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const event = id ? getEvent(id) : undefined;
  const plan = id ? getEventPlan(id) : undefined;
  const expenses = id ? getEventExpenses(id) : [];
  const tasks = id ? getEventTasks(id) : [];
  const vendors = id ? getEventVendors(id) : [];

  const [editForm, setEditForm] = useState<Partial<Event>>({});

  if (!event) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-2xl font-bold font-serif text-slate-900">Celebration Not Found</h2>
        <p className="text-xs text-slate-500">
          The event you are looking for does not exist or was deleted.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    );
  }

  const daysInfo = getDaysRemaining(event.date);

  const handleOpenEdit = () => {
    setEditForm({
      name: event.name,
      date: event.date,
      location: event.location,
      guestCount: event.guestCount,
      totalBudget: event.totalBudget,
      currency: event.currency,
    });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateEvent({
      ...event,
      ...editForm,
    } as Event);
    setEditModalOpen(false);
  };

  const handleDelete = async () => {
    await deleteEvent(event.id);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between no-print">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenEdit}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Edit Details</span>
          </button>
          <button
            onClick={() => setDeleteModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      </div>

      {/* Main Event Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6 no-print">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                {event.eventType}
              </span>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  daysInfo.isPast
                    ? 'bg-slate-100 text-slate-500 border-slate-200'
                    : daysInfo.days <= 14
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}
              >
                {daysInfo.text}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-serif">
              {event.name}
            </h1>

            {/* Sub-meta */}
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-600 font-medium">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>{formatDate(event.date)}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>{event.location}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-slate-400" />
                <span>{event.guestCount} Guests</span>
              </div>
            </div>
          </div>

          {/* Quick Financial Snapshot */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-6 shrink-0">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Allocated Budget
              </span>
              <div className="text-xl sm:text-2xl font-bold text-indigo-700 mt-0.5">
                {formatCurrency(event.totalBudget, event.currency)}
              </div>
            </div>
            <div className="w-px h-10 bg-slate-200" />
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Recorded Spent
              </span>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                {formatCurrency(
                  expenses.reduce((s, e) => s + (e.actualAmount || 0), 0),
                  event.currency
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-t border-slate-100 pt-4 flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'plan', label: 'AI Plan Blueprint', icon: Sparkles },
            { id: 'budget', label: 'Budget Manager', icon: DollarSign },
            { id: 'timeline', label: 'Timeline & Agenda', icon: Clock },
            { id: 'vendors', label: 'Vendors & Hub', icon: Briefcase },
            { id: 'export', label: 'Print / Export', icon: Printer },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'plan' && <PlanOverviewTab event={event} plan={plan} />}
        {activeTab === 'budget' && <BudgetManagerTab event={event} plan={plan} />}
        {activeTab === 'timeline' && <TimelinePlannerTab event={event} plan={plan} />}
        {activeTab === 'vendors' && <VendorManagerTab event={event} plan={plan} />}
        {activeTab === 'export' && (
          <PrintExportView
            event={event}
            plan={plan}
            expenses={expenses}
            tasks={tasks}
            vendors={vendors}
          />
        )}
      </div>

      {/* Edit Event Details Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Celebration Details"
        subtitle="Update core event metadata"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Event Name *</label>
            <input
              type="text"
              required
              value={editForm.name || ''}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Event Date *</label>
              <input
                type="date"
                required
                value={editForm.date || ''}
                onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Guest Count *</label>
              <input
                type="number"
                min="1"
                required
                value={editForm.guestCount || 0}
                onChange={(e) =>
                  setEditForm({ ...editForm, guestCount: parseInt(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Location *</label>
            <input
              type="text"
              required
              value={editForm.location || ''}
              onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Total Budget ({editForm.currency}) *
            </label>
            <input
              type="number"
              min="1000"
              required
              value={editForm.totalBudget || 0}
              onChange={(e) =>
                setEditForm({ ...editForm, totalBudget: parseFloat(e.target.value) || 0 })
              }
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Event Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Celebration"
        subtitle="This action cannot be undone"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600">
            Are you sure you want to delete <span className="font-bold text-slate-900">&quot;{event.name}&quot;</span>?
            All plans, expenses, milestones, and vendors will be permanently removed.
          </p>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
