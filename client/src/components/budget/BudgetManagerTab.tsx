import React, { useState, useMemo } from 'react';
import {
  PieChart as PieChartIcon,
  PlusCircle,
  AlertTriangle,
  CheckCircle2,
  Edit3,
  Trash2,
  DollarSign,
  TrendingDown,
  TrendingUp,
  CreditCard,
  Filter,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
} from 'recharts';
import { Event, Expense, ExpenseCategory, PaymentStatus, EventPlan } from '../../types/index'
import { formatCurrency } from '../../utils/formatters'
import { PaymentStatusBadge } from '../common/Badge'
import { Modal } from '../common/Modal'
import { useEvents } from '../../context/EventContext'

interface BudgetManagerTabProps {
  event: Event;
  plan?: EventPlan;
}

const CATEGORIES: ExpenseCategory[] = [
  'Venue',
  'Catering',
  'Decoration',
  'Photography',
  'Entertainment',
  'Invitations',
  'Transport',
  'Gifts',
  'Miscellaneous',
];

const COLORS = [
  '#6366F1', // Indigo
  '#F43F5E', // Rose
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#8B5CF6', // Violet
  '#06B6D4', // Cyan
  '#EC4899', // Pink
  '#EAB308', // Yellow
  '#64748B', // Slate
];

export const BudgetManagerTab: React.FC<BudgetManagerTabProps> = ({ event, plan }) => {
  const {
    getEventExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
    toggleExpensePayment,
  } = useEvents();

  const expenses = getEventExpenses(event.id);

  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editExpense, setEditExpense] = useState<Expense | null>(null);
  const [deleteExpenseId, setDeleteExpenseId] = useState<string | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<ExpenseCategory>('Venue');
  const [formPlanned, setFormPlanned] = useState<number>(0);
  const [formActual, setFormActual] = useState<number>(0);
  const [formStatus, setFormStatus] = useState<PaymentStatus>('Pending');
  const [formNotes, setFormNotes] = useState('');

  // Calculations
  const totalBudget = event.totalBudget || 0;

  const totalPlannedExpenses = useMemo(() => {
    return expenses.reduce((sum, e) => sum + (e.plannedAmount || 0), 0);
  }, [expenses]);

  const totalActualExpenses = useMemo(() => {
    return expenses.reduce((sum, e) => sum + (e.actualAmount || 0), 0);
  }, [expenses]);

  const remainingBudget = totalBudget - totalActualExpenses;
  const isOverBudget = remainingBudget < 0;
  const percentSpent = totalBudget > 0 ? Math.round((totalActualExpenses / totalBudget) * 100) : 0;

  // Filtered expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const matchCat = categoryFilter === 'All' || e.category === categoryFilter;
      const matchStatus = statusFilter === 'All' || e.paymentStatus === statusFilter;
      return matchCat && matchStatus;
    });
  }, [expenses, categoryFilter, statusFilter]);

  // Chart data: category spending
  const categoryChartData = useMemo(() => {
    return CATEGORIES.map((cat) => {
      const catExpenses = expenses.filter((e) => e.category === cat);
      const planned = catExpenses.reduce((sum, e) => sum + (e.plannedAmount || 0), 0);
      const actual = catExpenses.reduce((sum, e) => sum + (e.actualAmount || 0), 0);

      // If no expenses yet, check if plan has an allocation
      const planAlloc = plan?.budgetAllocations?.find((b) => b.category === cat);
      const fallbackPlanned = planAlloc ? planAlloc.estimatedAmount : 0;

      return {
        name: cat,
        Planned: planned > 0 ? planned : fallbackPlanned,
        Actual: actual,
      };
    }).filter((d) => d.Planned > 0 || d.Actual > 0);
  }, [expenses, plan]);

  // Donut chart data: share of total budget
  const donutData = useMemo(() => {
    return categoryChartData.map((d) => ({
      name: d.name,
      value: d.Actual > 0 ? d.Actual : d.Planned,
    }));
  }, [categoryChartData]);

  const handleOpenAdd = () => {
    setFormTitle('');
    setFormCategory('Venue');
    setFormPlanned(0);
    setFormActual(0);
    setFormStatus('Pending');
    setFormNotes('');
    setAddModalOpen(true);
  };

  const handleSaveAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    await addExpense({
      eventId: event.id,
      title: formTitle.trim(),
      category: formCategory,
      plannedAmount: Number(formPlanned) || 0,
      actualAmount: Number(formActual) || 0,
      paymentStatus: formStatus,
      notes: formNotes.trim() || undefined,
    });

    setAddModalOpen(false);
  };

  const handleOpenEdit = (exp: Expense) => {
    setEditExpense(exp);
    setFormTitle(exp.title);
    setFormCategory(exp.category);
    setFormPlanned(exp.plannedAmount);
    setFormActual(exp.actualAmount);
    setFormStatus(exp.paymentStatus);
    setFormNotes(exp.notes || '');
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editExpense || !formTitle.trim()) return;

    await updateExpense({
      ...editExpense,
      title: formTitle.trim(),
      category: formCategory,
      plannedAmount: Number(formPlanned) || 0,
      actualAmount: Number(formActual) || 0,
      paymentStatus: formStatus,
      notes: formNotes.trim() || undefined,
    });

    setEditExpense(null);
  };

  const handleDelete = async () => {
    if (deleteExpenseId) {
      await deleteExpense(deleteExpenseId);
      setDeleteExpenseId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Overbudget Warning Banner */}
      {isOverBudget && (
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 flex items-start gap-3.5 shadow-sm">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-sm">Budget Limit Exceeded!</h4>
            <p className="text-xs text-rose-800 leading-relaxed">
              Your recorded actual expenses ({formatCurrency(totalActualExpenses, event.currency)})
              have exceeded the planned total budget of{' '}
              {formatCurrency(totalBudget, event.currency)} by{' '}
              <span className="font-bold underline">
                {formatCurrency(Math.abs(remainingBudget), event.currency)}
              </span>
              . Review individual category items below or reallocate funds.
            </p>
          </div>
        </div>
      )}

      {/* 4 Financial Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Budget */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-subtle flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-medium text-slate-500 truncate">Total Event Budget</p>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5 truncate">
              {formatCurrency(totalBudget, event.currency)}
            </h3>
          </div>
        </div>

        {/* Planned Allocations */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-subtle flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
            <PieChartIcon className="w-6 h-6" />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-medium text-slate-500 truncate">Allocated / Planned</p>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5 truncate">
              {formatCurrency(totalPlannedExpenses, event.currency)}
            </h3>
          </div>
        </div>

        {/* Actual Expenses */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-subtle flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-medium text-slate-500 truncate">Actual Expenses Spent</p>
            <h3 className="text-xl font-bold text-rose-600 mt-0.5 truncate">
              {formatCurrency(totalActualExpenses, event.currency)}
            </h3>
            <span className="text-[11px] text-slate-500 font-semibold">{percentSpent}% of budget</span>
          </div>
        </div>

        {/* Remaining Budget */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-subtle flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              isOverBudget ? 'bg-rose-100 text-rose-700' : 'bg-emerald-50 text-emerald-600'
            }`}
          >
            {isOverBudget ? <TrendingDown className="w-6 h-6" /> : <CreditCard className="w-6 h-6" />}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-medium text-slate-500 truncate">Remaining Balance</p>
            <h3
              className={`text-xl font-bold mt-0.5 truncate ${
                isOverBudget ? 'text-rose-600' : 'text-emerald-700'
              }`}
            >
              {formatCurrency(remainingBudget, event.currency)}
            </h3>
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Category Allocation Donut */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 font-serif">Category Budget Breakdown</h4>
            <span className="text-xs text-slate-400 font-medium">By Category</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [
                    formatCurrency(Number(value), event.currency),
                    'Estimated',
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-600">
            {donutData.slice(0, 6).map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <span>{d.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Planned vs Actual Bar Chart */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 font-serif">Planned vs Actual Spending</h4>
            <span className="text-xs text-slate-400 font-medium">Variance Analysis</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryChartData}
                margin={{ top: 10, right: 10, left: 10, bottom: 25 }}
              >
                <XAxis
                  dataKey="name"
                  angle={-25}
                  textAnchor="end"
                  interval={0}
                  tick={{ fontSize: 10 }}
                />
                <YAxis
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip
                  formatter={(val: any) => formatCurrency(Number(val), event.currency)}
                />
                <Legend wrapperStyle={{ fontSize: 11, bottom: -10 }} />
                <Bar dataKey="Planned" fill="#6366F1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Actual" fill="#F43F5E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Expenses Table Controls */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-subtle space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-serif">Expense Tracker</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Record invoices, track payment status, and manage line items.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-600">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-600">Payment Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Item &amp; Category</th>
                <th className="py-3 px-4">Planned</th>
                <th className="py-3 px-4">Actual Spent</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Notes</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{exp.title}</div>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">
                      {formatCurrency(exp.plannedAmount, event.currency)}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {formatCurrency(exp.actualAmount, event.currency)}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleExpensePayment(exp.id)}
                        title="Click to toggle Paid/Pending"
                        className="cursor-pointer transition-transform hover:scale-105"
                      >
                        <PaymentStatusBadge status={exp.paymentStatus} />
                      </button>
                    </td>
                    <td className="py-3 px-4 text-slate-500 max-w-xs truncate">
                      {exp.notes || '—'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(exp)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteExpenseId(exp.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No expenses match the current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Expense Modal */}
      <Modal
        isOpen={addModalOpen || Boolean(editExpense)}
        onClose={() => {
          setAddModalOpen(false);
          setEditExpense(null);
        }}
        title={editExpense ? 'Edit Expense Item' : 'Add New Expense Item'}
        subtitle="Manage cost allocations and vendor invoices"
      >
        <form onSubmit={editExpense ? handleSaveEdit : handleSaveAdd} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Expense Title *</label>
            <input
              type="text"
              required
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="e.g. Lawn Advance Booking, Floral Centerpieces..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category *</label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value as ExpenseCategory)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white font-medium"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Payment Status</label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as PaymentStatus)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white font-medium"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Planned Amount ({event.currency})
              </label>
              <input
                type="number"
                min="0"
                value={formPlanned}
                onChange={(e) => setFormPlanned(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Actual Spent ({event.currency})
              </label>
              <input
                type="number"
                min="0"
                value={formActual}
                onChange={(e) => setFormActual(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Notes / Invoices</label>
            <input
              type="text"
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              placeholder="e.g. 50% advance cleared via UPI; final invoice pending"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setAddModalOpen(false);
                setEditExpense(null);
              }}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
            >
              {editExpense ? 'Update Expense' : 'Add Expense'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteExpenseId)}
        onClose={() => setDeleteExpenseId(null)}
        title="Delete Expense Item"
        subtitle="Remove this line item from your celebration budget"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600">
            Are you sure you want to remove this expense? All recorded numbers will be recalculated.
          </p>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => setDeleteExpenseId(null)}
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
