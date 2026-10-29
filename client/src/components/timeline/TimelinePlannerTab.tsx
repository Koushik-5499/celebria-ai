import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  Edit3,
  Trash2,
  ArrowUpDown,
  Filter,
  CheckSquare,
  Square,
  Sparkles,
} from 'lucide-react';
import { Event, EventPlan, Task, TaskPriority, TaskStatus } from '../../types/index'
import { formatDate } from '../../utils/formatters'
import { PriorityBadge, TaskStatusBadge } from '../common/Badge'
import { Modal } from '../common/Modal'
import { useEvents } from '../../context/EventContext'

interface TimelinePlannerTabProps {
  event: Event;
  plan?: EventPlan;
}

export const TimelinePlannerTab: React.FC<TimelinePlannerTabProps> = ({ event, plan }) => {
  const {
    getEventTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    regeneratePlan,
  } = useEvents();

  const tasks = getEventTasks(event.id);

  // Filter & Sort states
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority'>('dueDate');

  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formDueDate, setFormDueDate] = useState(event.date);
  const [formPriority, setFormPriority] = useState<TaskPriority>('Medium');
  const [formStatus, setFormStatus] = useState<TaskStatus>('Pending');
  const [formCategory, setFormCategory] = useState('General');

  // Today for overdue checks
  const todayStr = new Date().toISOString().split('T')[0];

  // Filtered & sorted tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((t) => {
        const matchStatus = statusFilter === 'All' || t.status === statusFilter;
        const matchPriority = priorityFilter === 'All' || t.priority === priorityFilter;
        return matchStatus && matchPriority;
      })
      .sort((a, b) => {
        if (sortBy === 'dueDate') {
          return a.dueDate.localeCompare(b.dueDate);
        } else {
          const priorityWeights = { High: 3, Medium: 2, Low: 1 };
          return (priorityWeights[b.priority] || 0) - (priorityWeights[a.priority] || 0);
        }
      });
  }, [tasks, statusFilter, priorityFilter, sortBy]);

  // Overdue count
  const overdueCount = useMemo(() => {
    return tasks.filter((t) => t.status !== 'Completed' && t.dueDate < todayStr).length;
  }, [tasks, todayStr]);

  const handleOpenAdd = () => {
    setFormTitle('');
    setFormDueDate(event.date);
    setFormPriority('Medium');
    setFormStatus('Pending');
    setFormCategory('General');
    setAddModalOpen(true);
  };

  const handleSaveAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    await addTask({
      eventId: event.id,
      title: formTitle.trim(),
      dueDate: formDueDate,
      priority: formPriority,
      status: formStatus,
      category: formCategory.trim() || 'General',
    });

    setAddModalOpen(false);
  };

  const handleOpenEdit = (t: Task) => {
    setEditTask(t);
    setFormTitle(t.title);
    setFormDueDate(t.dueDate);
    setFormPriority(t.priority);
    setFormStatus(t.status);
    setFormCategory(t.category);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTask || !formTitle.trim()) return;

    await updateTask({
      ...editTask,
      title: formTitle.trim(),
      dueDate: formDueDate,
      priority: formPriority,
      status: formStatus,
      category: formCategory.trim() || 'General',
    });

    setEditTask(null);
  };

  const handleDelete = async () => {
    if (deleteTaskId) {
      await deleteTask(deleteTaskId);
      setDeleteTaskId(null);
    }
  };

  return (
    <div className="space-y-10">
      {/* SECTION 1: EVENT-DAY RUN OF SHOW AGENDA */}
      {plan?.eventAgenda && plan.eventAgenda.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-subtle space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Event Day Schedule
                </span>
                <h3 className="text-xl font-bold font-serif text-slate-900">
                  Run-of-Show Minute-by-Minute Agenda
                </h3>
              </div>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Synchronized for hosts, coordinators, and caterers
            </span>
          </div>

          <div className="relative pl-6 sm:pl-8 border-l-2 border-indigo-100 space-y-6">
            {plan.eventAgenda.map((item, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-indigo-600 border-4 border-white shadow-sm" />
                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-1 hover:bg-slate-50 transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                      {item.time}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{item.activity}</span>
                  </div>
                  {item.notes && <p className="text-xs text-slate-500 mt-1">{item.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: PREPARATION MILESTONES (AI BLUEPRINT) */}
      {plan?.preparationTimeline && plan.preparationTimeline.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-subtle space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-violet-600">
                Strategic Roadmap
              </span>
              <h3 className="text-xl font-bold font-serif text-slate-900">
                Preparation Milestones &amp; Phases
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plan.preparationTimeline.map((phase, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-100/60 px-2.5 py-0.5 rounded-md">
                    {phase.timeframe}
                  </span>
                  <span className="text-xs font-semibold text-slate-600">{phase.milestone}</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-700">
                  {phase.tasks.map((taskItem, tIdx) => (
                    <li key={tIdx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-violet-500 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{taskItem}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: OPERATIONAL TASK MANAGER */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-subtle space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold font-serif text-slate-900">Planning Task List</h3>
              {overdueCount > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                  <AlertCircle className="w-3 h-3" />
                  <span>{overdueCount} Overdue</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Sort, check off, and assign due dates for your preparation activities.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>

        {/* Filter and Sort Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-200/60">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-600">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="All">All</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-600">Priority:</span>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="All">All</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-600">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority (High to Low)</option>
            </select>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-2.5">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((t) => {
              const isOverdue = t.status !== 'Completed' && t.dueDate < todayStr;
              const isDone = t.status === 'Completed';

              return (
                <div
                  key={t.id}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                    isDone
                      ? 'bg-slate-50/60 border-slate-200 opacity-70'
                      : isOverdue
                      ? 'bg-rose-50/50 border-rose-200'
                      : 'bg-white border-slate-200 hover:border-indigo-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleTaskComplete(t.id)}
                      className="text-indigo-600 hover:text-indigo-800 transition-colors shrink-0"
                      title={isDone ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      {isDone ? (
                        <CheckSquare className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400" />
                      )}
                    </button>

                    <div>
                      <p
                        className={`text-xs font-semibold ${
                          isDone ? 'line-through text-slate-400' : 'text-slate-900'
                        }`}
                      >
                        {t.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="w-3 h-3 text-slate-400" />
                          <span className={isOverdue ? 'text-rose-600 font-bold' : ''}>
                            Due: {formatDate(t.dueDate)} {isOverdue && '(Overdue)'}
                          </span>
                        </span>
                        <span>•</span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">
                          {t.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <PriorityBadge priority={t.priority} />
                    <TaskStatusBadge status={t.status} />

                    <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
                      <button
                        onClick={() => handleOpenEdit(t)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit task"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTaskId(t.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">
              No tasks found under the active filters.
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Task Modal */}
      <Modal
        isOpen={addModalOpen || Boolean(editTask)}
        onClose={() => {
          setAddModalOpen(false);
          setEditTask(null);
        }}
        title={editTask ? 'Edit Planning Task' : 'Add Planning Task'}
        subtitle="Schedule and track milestone tasks"
      >
        <form onSubmit={editTask ? handleSaveEdit : handleSaveAdd} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Task Title *</label>
            <input
              type="text"
              required
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="e.g. Schedule final soundcheck with DJ..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Due Date</label>
              <input
                type="date"
                required
                value={formDueDate}
                onChange={(e) => setFormDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Priority</label>
              <select
                value={formPriority}
                onChange={(e) => setFormPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white font-medium"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Status</label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white font-medium"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category / Phase</label>
              <input
                type="text"
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                placeholder="e.g. Catering, Logistics, Decor"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setAddModalOpen(false);
                setEditTask(null);
              }}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
            >
              {editTask ? 'Update Task' : 'Add Task'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Task Modal */}
      <Modal
        isOpen={Boolean(deleteTaskId)}
        onClose={() => setDeleteTaskId(null)}
        title="Delete Task"
        subtitle="Remove this task from the timeline"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600">Are you sure you want to permanently delete this task?</p>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => setDeleteTaskId(null)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
