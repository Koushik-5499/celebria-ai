import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  Event,
  EventPlan,
  Expense,
  Task,
  Vendor,
  StorageDataV1,
} from '../types/index'
import { storageService } from '../services/storage'
import { checkServerHealth, generateEventPlan, HealthResponse } from '../services/api'
import { generateId } from '../utils/formatters'

interface EventContextType {
  events: Event[];
  plans: Record<string, EventPlan>;
  expenses: Expense[];
  tasks: Task[];
  vendors: Vendor[];
  isLoaded: boolean;
  serverHealth: HealthResponse | null;
  refreshServerHealth: () => Promise<void>;
  
  // Event Operations
  addEvent: (event: Event, plan?: EventPlan) => Promise<void>;
  updateEvent: (event: Event) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  getEvent: (eventId: string) => Event | undefined;
  getEventPlan: (eventId: string) => EventPlan | undefined;
  
  // Plan Operations
  savePlan: (plan: EventPlan) => Promise<void>;
  generateAndApplyPlan: (event: Event, instructions?: string) => Promise<EventPlan>;
  regeneratePlan: (eventId: string, instructions?: string, preserveCustomData?: boolean) => Promise<EventPlan>;

  // Expense Operations
  getEventExpenses: (eventId: string) => Expense[];
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => Promise<Expense>;
  updateExpense: (expense: Expense) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  toggleExpensePayment: (id: string) => Promise<void>;

  // Task Operations
  getEventTasks: (eventId: string) => Task[];
  addTask: (task: Omit<Task, 'id'>) => Promise<Task>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskComplete: (id: string) => Promise<void>;

  // Vendor Operations
  getEventVendors: (eventId: string) => Vendor[];
  addVendor: (vendor: Omit<Vendor, 'id'>) => Promise<Vendor>;
  updateVendor: (vendor: Vendor) => Promise<void>;
  deleteVendor: (id: string) => Promise<void>;

  // Global actions
  resetToSampleData: () => Promise<void>;
  clearAllData: () => Promise<void>;
  exportDataJSON: () => string;
  importDataJSON: (jsonStr: string) => boolean;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<StorageDataV1>({
    version: 1,
    events: [],
    plans: {},
    expenses: [],
    tasks: [],
    vendors: [],
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [serverHealth, setServerHealth] = useState<HealthResponse | null>(null);

  // Initialize data on mount
  useEffect(() => {
    let isMounted = true;
    async function init() {
      const stored = await storageService.loadData();
      if (isMounted) {
        setData(stored);
        setIsLoaded(true);
      }
      const health = await checkServerHealth();
      if (isMounted) {
        setServerHealth(health);
      }
    }
    init();
    return () => {
      isMounted = false;
    };
  }, []);

  const refreshServerHealth = async () => {
    const health = await checkServerHealth();
    setServerHealth(health);
  };

  const persist = async (updater: (prev: StorageDataV1) => StorageDataV1) => {
    setData((prev) => {
      const next = updater(prev);
      storageService.saveData(next);
      return next;
    });
  };

  // Event Operations
  const addEvent = async (event: Event, plan?: EventPlan) => {
    await persist((prev) => {
      const nextEvents = [event, ...prev.events.filter((e) => e.id !== event.id)];
      const nextPlans = plan ? { ...prev.plans, [event.id]: plan } : prev.plans;
      return {
        ...prev,
        events: nextEvents,
        plans: nextPlans,
      };
    });

    if (plan) {
      populateInitialArtifactsFromPlan(event, plan);
    }
  };

  const updateEvent = async (event: Event) => {
    await persist((prev) => ({
      ...prev,
      events: prev.events.map((e) => (e.id === event.id ? { ...event, updatedAt: new Date().toISOString() } : e)),
    }));
  };

  const deleteEvent = async (eventId: string) => {
    await persist((prev) => {
      const nextPlans = { ...prev.plans };
      delete nextPlans[eventId];
      return {
        ...prev,
        events: prev.events.filter((e) => e.id !== eventId),
        plans: nextPlans,
        expenses: prev.expenses.filter((exp) => exp.eventId !== eventId),
        tasks: prev.tasks.filter((t) => t.eventId !== eventId),
        vendors: prev.vendors.filter((v) => v.eventId !== eventId),
      };
    });
  };

  const getEvent = (eventId: string) => data.events.find((e) => e.id === eventId);
  const getEventPlan = (eventId: string) => data.plans[eventId];

  // Helper to convert plan allocations & milestones into operational expenses, tasks, and vendors
  const populateInitialArtifactsFromPlan = (event: Event, plan: EventPlan) => {
    const newExpenses: Expense[] = plan.budgetAllocations.map((alloc) => ({
      id: generateId('exp'),
      eventId: event.id,
      title: `${alloc.category} Planned Allocation`,
      category: alloc.category,
      plannedAmount: alloc.estimatedAmount,
      actualAmount: 0,
      paymentStatus: 'Pending',
      notes: alloc.tips,
      createdAt: new Date().toISOString(),
    }));

    const newTasks: Task[] = [];
    plan.preparationTimeline.forEach((phase) => {
      phase.tasks.forEach((taskTitle) => {
        newTasks.push({
          id: generateId('tsk'),
          eventId: event.id,
          title: taskTitle,
          dueDate: event.date,
          priority: 'Medium',
          status: 'Pending',
          category: phase.milestone,
          isCustom: false,
        });
      });
    });

    const newVendors: Vendor[] = plan.vendorSuggestions.map((vs) => ({
      id: generateId('ven'),
      eventId: event.id,
      name: `${vs.recommendedType}`,
      category: vs.category,
      contact: 'Pending inquiry',
      estimatedCost: Math.round(event.totalBudget * 0.15),
      status: 'To Contact',
      notes: `Key questions: ${vs.questionsToAsk.join('; ')}`,
    }));

    persist((prev) => ({
      ...prev,
      expenses: [...prev.expenses.filter((e) => e.eventId !== event.id), ...newExpenses],
      tasks: [...prev.tasks.filter((t) => t.eventId !== event.id), ...newTasks],
      vendors: [...prev.vendors.filter((v) => v.eventId !== event.id), ...newVendors],
    }));
  };

  const savePlan = async (plan: EventPlan) => {
    await persist((prev) => ({
      ...prev,
      plans: {
        ...prev.plans,
        [plan.eventId]: plan,
      },
    }));
  };

  const generateAndApplyPlan = async (event: Event, instructions?: string): Promise<EventPlan> => {
    const result = await generateEventPlan(event, instructions);
    await addEvent(event, result.plan);
    return result.plan;
  };

  const regeneratePlan = async (
    eventId: string,
    instructions?: string,
    preserveCustomData: boolean = true
  ): Promise<EventPlan> => {
    const event = getEvent(eventId);
    if (!event) throw new Error('Event not found');

    const result = await generateEventPlan(event, instructions);
    const newPlan = result.plan;

    await persist((prev) => {
      const nextPlans = { ...prev.plans, [eventId]: newPlan };

      let nextTasks = prev.tasks;
      let nextExpenses = prev.expenses;
      let nextVendors = prev.vendors;

      if (!preserveCustomData) {
        // If user specifically asked to reset all
        nextExpenses = prev.expenses.filter((e) => e.eventId !== eventId);
        nextTasks = prev.tasks.filter((t) => t.eventId !== eventId);
        nextVendors = prev.vendors.filter((v) => v.eventId !== eventId);
      }

      return {
        ...prev,
        plans: nextPlans,
        tasks: nextTasks,
        expenses: nextExpenses,
        vendors: nextVendors,
      };
    });

    if (!preserveCustomData) {
      populateInitialArtifactsFromPlan(event, newPlan);
    }

    return newPlan;
  };

  // Expense Operations
  const getEventExpenses = (eventId: string) => data.expenses.filter((e) => e.eventId === eventId);

  const addExpense = async (expenseData: Omit<Expense, 'id' | 'createdAt'>): Promise<Expense> => {
    const newExpense: Expense = {
      ...expenseData,
      id: generateId('exp'),
      createdAt: new Date().toISOString(),
    };
    await persist((prev) => ({
      ...prev,
      expenses: [newExpense, ...prev.expenses],
    }));
    return newExpense;
  };

  const updateExpense = async (expense: Expense) => {
    await persist((prev) => ({
      ...prev,
      expenses: prev.expenses.map((e) => (e.id === expense.id ? expense : e)),
    }));
  };

  const deleteExpense = async (id: string) => {
    await persist((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((e) => e.id !== id),
    }));
  };

  const toggleExpensePayment = async (id: string) => {
    await persist((prev) => ({
      ...prev,
      expenses: prev.expenses.map((e) =>
        e.id === id ? { ...e, paymentStatus: e.paymentStatus === 'Paid' ? 'Pending' : 'Paid' } : e
      ),
    }));
  };

  // Task Operations
  const getEventTasks = (eventId: string) => data.tasks.filter((t) => t.eventId === eventId);

  const addTask = async (taskData: Omit<Task, 'id'>): Promise<Task> => {
    const newTask: Task = {
      ...taskData,
      id: generateId('tsk'),
      isCustom: true,
    };
    await persist((prev) => ({
      ...prev,
      tasks: [newTask, ...prev.tasks],
    }));
    return newTask;
  };

  const updateTask = async (task: Task) => {
    await persist((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === task.id ? task : t)),
    }));
  };

  const deleteTask = async (id: string) => {
    await persist((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== id),
    }));
  };

  const toggleTaskComplete = async (id: string) => {
    await persist((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === id
          ? { ...t, status: t.status === 'Completed' ? 'Pending' : 'Completed' }
          : t
      ),
    }));
  };

  // Vendor Operations
  const getEventVendors = (eventId: string) => data.vendors.filter((v) => v.eventId === eventId);

  const addVendor = async (vendorData: Omit<Vendor, 'id'>): Promise<Vendor> => {
    const newVendor: Vendor = {
      ...vendorData,
      id: generateId('ven'),
    };
    await persist((prev) => ({
      ...prev,
      vendors: [newVendor, ...prev.vendors],
    }));
    return newVendor;
  };

  const updateVendor = async (vendor: Vendor) => {
    await persist((prev) => ({
      ...prev,
      vendors: prev.vendors.map((v) => (v.id === vendor.id ? vendor : v)),
    }));
  };

  const deleteVendor = async (id: string) => {
    await persist((prev) => ({
      ...prev,
      vendors: prev.vendors.filter((v) => v.id !== id),
    }));
  };

  // Global Actions
  const resetToSampleData = async () => {
    const sample = await storageService.resetToSampleData();
    setData(sample);
  };

  const clearAllData = async () => {
    const empty = await storageService.clearAll();
    setData(empty);
  };

  const exportDataJSON = () => {
    return storageService.exportJSON(data);
  };

  const importDataJSON = (jsonStr: string): boolean => {
    const imported = storageService.importJSON(jsonStr);
    if (imported) {
      setData(imported);
      return true;
    }
    return false;
  };

  const value = useMemo(
    () => ({
      events: data.events,
      plans: data.plans,
      expenses: data.expenses,
      tasks: data.tasks,
      vendors: data.vendors,
      isLoaded,
      serverHealth,
      refreshServerHealth,
      addEvent,
      updateEvent,
      deleteEvent,
      getEvent,
      getEventPlan,
      savePlan,
      generateAndApplyPlan,
      regeneratePlan,
      getEventExpenses,
      addExpense,
      updateExpense,
      deleteExpense,
      toggleExpensePayment,
      getEventTasks,
      addTask,
      updateTask,
      deleteTask,
      toggleTaskComplete,
      getEventVendors,
      addVendor,
      updateVendor,
      deleteVendor,
      resetToSampleData,
      clearAllData,
      exportDataJSON,
      importDataJSON,
    }),
    [data, isLoaded, serverHealth]
  );

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};
