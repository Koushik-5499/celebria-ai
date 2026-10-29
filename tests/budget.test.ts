import { describe, it, expect } from 'vitest';
import { formatCurrency } from '../client/src/utils/formatters.js';

describe('Budget Calculations & Formatting', () => {
  it('correctly calculates total planned and actual expenses', () => {
    const expenses = [
      { id: '1', plannedAmount: 50000, actualAmount: 48000 },
      { id: '2', plannedAmount: 30000, actualAmount: 35000 },
      { id: '3', plannedAmount: 20000, actualAmount: 20000 },
    ];

    const totalPlanned = expenses.reduce((sum, e) => sum + e.plannedAmount, 0);
    const totalActual = expenses.reduce((sum, e) => sum + e.actualAmount, 0);

    expect(totalPlanned).toBe(100000);
    expect(totalActual).toBe(103000);
  });

  it('computes remaining budget accurately (underbudget)', () => {
    const totalBudget = 500000;
    const totalActual = 420000;
    const remaining = totalBudget - totalActual;
    const isOverBudget = remaining < 0;

    expect(remaining).toBe(80000);
    expect(isOverBudget).toBe(false);
  });

  it('computes remaining budget and flags overbudget condition', () => {
    const totalBudget = 500000;
    const totalActual = 530000;
    const remaining = totalBudget - totalActual;
    const isOverBudget = remaining < 0;

    expect(remaining).toBe(-30000);
    expect(isOverBudget).toBe(true);
  });

  it('formats currencies with appropriate symbols', () => {
    const inrFormatted = formatCurrency(2500000, 'INR');
    expect(inrFormatted).toContain('₹');
    expect(inrFormatted).toContain('25,00,000');

    const usdFormatted = formatCurrency(5000, 'USD');
    expect(usdFormatted).toContain('$');
    expect(usdFormatted).toContain('5,000');

    const eurFormatted = formatCurrency(12000, 'EUR');
    expect(eurFormatted).toContain('€');
  });
});
