import { describe, it, expect } from 'vitest';
import { getDaysRemaining } from '../client/src/utils/formatters.js';
import { Task, TaskPriority } from '../client/src/types/index.js';

describe('Timeline & Task Sorting Logic', () => {
  it('correctly calculates remaining days and overdue flags', () => {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + 10);

    const pastDate = new Date(today);
    pastDate.setDate(today.getDate() - 5);

    const futureRes = getDaysRemaining(futureDate.toISOString().split('T')[0]);
    expect(futureRes.days).toBe(10);
    expect(futureRes.isPast).toBe(false);

    const pastRes = getDaysRemaining(pastDate.toISOString().split('T')[0]);
    expect(pastRes.days).toBe(5);
    expect(pastRes.isPast).toBe(true);
  });

  it('sorts tasks by due date ascending', () => {
    const tasks: Task[] = [
      { id: '1', eventId: 'e1', title: 'Task Late', dueDate: '2026-12-25', priority: 'Low', status: 'Pending', category: 'Gen' },
      { id: '2', eventId: 'e1', title: 'Task Early', dueDate: '2026-06-10', priority: 'High', status: 'Pending', category: 'Gen' },
      { id: '3', eventId: 'e1', title: 'Task Mid', dueDate: '2026-09-15', priority: 'Medium', status: 'Pending', category: 'Gen' },
    ];

    const sorted = [...tasks].sort((a, b) => a.dueDate.localeCompare(b.dueDate));

    expect(sorted[0].title).toBe('Task Early');
    expect(sorted[1].title).toBe('Task Mid');
    expect(sorted[2].title).toBe('Task Late');
  });

  it('sorts tasks by priority (High > Medium > Low)', () => {
    const tasks: Task[] = [
      { id: '1', eventId: 'e1', title: 'Low Task', dueDate: '2026-10-01', priority: 'Low', status: 'Pending', category: 'Gen' },
      { id: '2', eventId: 'e1', title: 'High Task', dueDate: '2026-10-01', priority: 'High', status: 'Pending', category: 'Gen' },
      { id: '3', eventId: 'e1', title: 'Medium Task', dueDate: '2026-10-01', priority: 'Medium', status: 'Pending', category: 'Gen' },
    ];

    const priorityWeights: Record<TaskPriority, number> = { High: 3, Medium: 2, Low: 1 };
    const sorted = [...tasks].sort((a, b) => priorityWeights[b.priority] - priorityWeights[a.priority]);

    expect(sorted[0].priority).toBe('High');
    expect(sorted[1].priority).toBe('Medium');
    expect(sorted[2].priority).toBe('Low');
  });

  it('correctly detects overdue pending tasks', () => {
    const today = new Date().toISOString().split('T')[0];
    const tasks: Task[] = [
      { id: '1', eventId: 'e1', title: 'Overdue Pending', dueDate: '2020-01-01', priority: 'High', status: 'Pending', category: 'Gen' },
      { id: '2', eventId: 'e1', title: 'Overdue But Done', dueDate: '2020-01-01', priority: 'Medium', status: 'Completed', category: 'Gen' },
      { id: '3', eventId: 'e1', title: 'Future Pending', dueDate: '2099-01-01', priority: 'Low', status: 'Pending', category: 'Gen' },
    ];

    const overdueCount = tasks.filter((t) => t.status !== 'Completed' && t.dueDate < today).length;
    expect(overdueCount).toBe(1);
  });
});
