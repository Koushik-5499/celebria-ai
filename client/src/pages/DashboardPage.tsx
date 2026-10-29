import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  PlusCircle,
  Users,
  MapPin,
  DollarSign,
  TrendingUp,
  Search,
  Filter,
  Trash2,
  Edit3,
  ArrowRight,
  Sparkles,
  Download,
  Upload,
  AlertCircle,
  PartyPopper,
  Clock,
  RotateCcw,
} from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { formatCurrency, formatDate, getDaysRemaining } from '../utils/formatters';
import { EventType, Event } from '../types/index';
import { Modal } from '../components/common/Modal';

export const DashboardPage: React.FC = () => {
  const {
    events,
    expenses,
    deleteEvent,
    updateEvent,
    resetToSampleData,
    exportDataJSON,
    importDataJSON,
    clearAllData,
  } = useEvents();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [deleteModalEvent, setDeleteModalEvent] = useState<Event | null>(null);
  const [editModalEvent, setEditModalEvent] = useState<Event | null>(null);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);

  // Computed metrics
  const totalEvents = events.length;

  const upcomingEventsCount = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return events.filter((e) => e.date >= today).length;
  }, [events]);

  const totalPlannedBudget = useMemo(() => {
    return events.reduce((sum, e) => sum + (e.totalBudget || 0), 0);
  }, [events]);

  const totalRecordedExpenses = useMemo(() => {
    return expenses.reduce((sum, exp) => sum + (exp.actualAmount || 0), 0);
  }, [expenses]);

  // Filtered events
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const matchesSearch =
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'All' || e.eventType === selectedType;
      return matchesSearch && matchesType;
    });
  }, [events, searchQuery, selectedType]);

  // Event types for filter
  const eventTypes: (EventType | 'All')[] = [
    'All',
    'Wedding',
    'Birthday',
    'Anniversary',
    'College Event',
    'Community Event',
    'Festival',
    'Other',
  ];

  const handleDeleteConfirm = async () => {
    if (deleteModalEvent) {
      await deleteEvent(deleteModalEvent.id);
      setDeleteModalEvent(null);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editModalEvent) {
      await updateEvent(editModalEvent);
      setEditModalEvent(null);
    }
  };

  const handleExport = () => {
    const jsonStr = exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `celebria-ai-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setImportError(null);
    if (!importJsonText.trim()) {
      setImportError('Please paste valid JSON content.');
      return;
    }
    const success = importDataJSON(importJsonText);
    if (success) {
      setImportModalOpen(false);
      setImportJsonText('');
      alert('Event data successfully imported!');
    } else {
      setImportError('Invalid Celebria data format. Please verify the JSON structure.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header / Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
              Planner Dashboard
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
            Celebration Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Monitor budgets, active timelines, and vendor arrangements across all your events.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            title="Download JSON backup"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button
            onClick={() => setImportModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            title="Import JSON backup"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Import</span>
          </button>

          <Link
            to="/wizard"
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/20 transition-all transform active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Plan New Event</span>
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-subtle flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Total Events</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{totalEvents}</h3>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-subtle flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Upcoming Celebrations</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{upcomingEventsCount}</h3>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-subtle flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-medium text-slate-500 truncate">Total Planned Budget</p>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5 truncate">
              {formatCurrency(totalPlannedBudget)}
            </h3>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-subtle flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-medium text-slate-500 truncate">Recorded Expenses</p>
            <h3 className="text-xl sm:text-2xl font-bold text-emerald-700 mt-0.5 truncate">
              {formatCurrency(totalRecordedExpenses)}
            </h3>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by event name or city..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50/50"
          />
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
          <div className="flex gap-1.5">
            {eventTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedType === type
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Event Cards Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt) => {
            const eventExpenses = expenses.filter((e) => e.eventId === evt.id);
            const spent = eventExpenses.reduce((sum, e) => sum + (e.actualAmount || 0), 0);
            const pctSpent = evt.totalBudget > 0 ? Math.min(Math.round((spent / evt.totalBudget) * 100), 100) : 0;
            const daysInfo = getDaysRemaining(evt.date);

            return (
              <div
                key={evt.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-subtle hover:shadow-premium transition-all overflow-hidden flex flex-col justify-between group"
              >
                {/* Top Section */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {evt.eventType}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
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

                  <div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors font-serif line-clamp-1">
                      {evt.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {evt.preferences.themeStyle || 'Celebration'}
                    </p>
                  </div>

                  {/* Metadata Chips */}
                  <div className="space-y-2 pt-2 text-xs text-slate-600 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{formatDate(evt.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{evt.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{evt.guestCount} Expected Guests</span>
                    </div>
                  </div>

                  {/* Budget Health Bar */}
                  <div className="pt-2">
                    <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                      <span>Spent: {formatCurrency(spent, evt.currency)}</span>
                      <span>Budget: {formatCurrency(evt.totalBudget, evt.currency)}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          spent > evt.totalBudget ? 'bg-rose-500' : 'bg-indigo-600'
                        }`}
                        style={{ width: `${pctSpent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card Footer / Actions */}
                <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditModalEvent(evt)}
                      className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
                      title="Edit event details"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteModalEvent(evt)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <Link
                    to={`/event/${evt.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-indigo-600 hover:bg-indigo-50 text-xs font-bold transition-all shadow-sm"
                  >
                    <span>Manage Event</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-2xl mx-auto space-y-6 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <PartyPopper className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-slate-900 font-serif">
              {searchQuery || selectedType !== 'All'
                ? 'No matching celebrations found'
                : 'No celebrations created yet'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              {searchQuery || selectedType !== 'All'
                ? 'Try adjusting your search criteria or resetting the category filter.'
                : 'Start organizing your wedding, birthday, or college fest with Celebria AI, or load realistic sample celebrations to explore the dashboard.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/wizard"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-colors"
            >
              Plan First Event
            </Link>
            <button
              onClick={resetToSampleData}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span>Load Sample Wedding</span>
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteModalEvent)}
        onClose={() => setDeleteModalEvent(null)}
        title="Confirm Event Deletion"
        subtitle="This action cannot be undone"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs leading-relaxed">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Are you sure you want to delete this event?</p>
              <p className="mt-1">
                &quot;{deleteModalEvent?.name}&quot; and all of its associated AI plans, budget records, timeline tasks, and vendor information will be permanently removed.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setDeleteModalEvent(null)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm"
            >
              Delete Event
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Event Details Modal */}
      <Modal
        isOpen={Boolean(editModalEvent)}
        onClose={() => setEditModalEvent(null)}
        title="Edit Celebration Details"
        subtitle="Update core event metadata"
      >
        {editModalEvent && (
          <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Event Name</label>
              <input
                type="text"
                required
                value={editModalEvent.name}
                onChange={(e) => setEditModalEvent({ ...editModalEvent, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Event Date</label>
                <input
                  type="date"
                  required
                  value={editModalEvent.date}
                  onChange={(e) => setEditModalEvent({ ...editModalEvent, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Guest Count</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={editModalEvent.guestCount}
                  onChange={(e) =>
                    setEditModalEvent({ ...editModalEvent, guestCount: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Location</label>
              <input
                type="text"
                required
                value={editModalEvent.location}
                onChange={(e) => setEditModalEvent({ ...editModalEvent, location: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Total Budget ({editModalEvent.currency})
              </label>
              <input
                type="number"
                min="1000"
                required
                value={editModalEvent.totalBudget}
                onChange={(e) =>
                  setEditModalEvent({ ...editModalEvent, totalBudget: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditModalEvent(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Import JSON Modal */}
      <Modal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        title="Import Data Backup"
        subtitle="Paste JSON backup from a previous Celebria AI session"
      >
        <form onSubmit={handleImportSubmit} className="space-y-4 text-xs">
          {importError && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 font-medium">
              {importError}
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">JSON Backup Content</label>
            <textarea
              rows={8}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder="Paste exported Celebria JSON here..."
              className="w-full p-3 font-mono text-[11px] rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setImportModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
            >
              Confirm Import
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
