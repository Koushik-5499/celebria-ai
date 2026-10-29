import React from 'react';
import { TaskPriority, TaskStatus, PaymentStatus, VendorStatus } from '../../types/index'

export const PriorityBadge: React.FC<{ priority: TaskPriority }> = ({ priority }) => {
  const styles: Record<TaskPriority, string> = {
    High: 'bg-rose-100 text-rose-800 border-rose-200',
    Medium: 'bg-amber-100 text-amber-800 border-amber-200',
    Low: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[priority] || styles.Low}`}
    >
      {priority}
    </span>
  );
};

export const TaskStatusBadge: React.FC<{ status: TaskStatus }> = ({ status }) => {
  const styles: Record<TaskStatus, string> = {
    Completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'In Progress': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    Pending: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles.Pending}`}
    >
      {status}
    </span>
  );
};

export const PaymentStatusBadge: React.FC<{ status: PaymentStatus }> = ({ status }) => {
  const styles: Record<PaymentStatus, string> = {
    Paid: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Pending: 'bg-amber-100 text-amber-800 border-amber-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[status]}`}
    >
      {status}
    </span>
  );
};

export const VendorStatusBadge: React.FC<{ status: VendorStatus }> = ({ status }) => {
  const styles: Record<VendorStatus, string> = {
    Confirmed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Negotiating: 'bg-amber-100 text-amber-800 border-amber-200',
    Contacted: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'To Contact': 'bg-slate-100 text-slate-700 border-slate-200',
    Completed: 'bg-blue-100 text-blue-800 border-blue-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[status] || styles['To Contact']}`}
    >
      {status}
    </span>
  );
};

export const AiModeBadge: React.FC<{ mode: 'LIVE_AI' | 'DEMO_MODE' }> = ({ mode }) => {
  if (mode === 'LIVE_AI') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        Live Gemini AI
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
      <span className="w-2 h-2 rounded-full bg-amber-500" />
      Demo Mode (Sample AI)
    </span>
  );
};
