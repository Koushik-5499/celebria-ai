import { describe, it, expect } from 'vitest';
import { generateContextualDemoPlan } from '../server/src/services/demoPlanner.js';
import { Event } from '../server/src/types/index.js';

describe('Demo Planner AI Service', () => {
  const sampleEvent: Event = {
    id: 'evt_test_1',
    name: 'Ananya 21st Milestone Gala',
    eventType: 'Birthday',
    date: '2026-10-15',
    location: 'Mumbai, India',
    guestCount: 100,
    currency: 'INR',
    totalBudget: 300000,
    preferences: {
      themeStyle: 'Vintage Hollywood Glamour',
      venueType: 'indoor',
      foodPreference: 'Continental & Asian Live Counters',
      planningPriority: 'elegance',
      planningStartDate: '2026-08-01',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it('generates a complete plan with all required sections', () => {
    const plan = generateContextualDemoPlan(sampleEvent);

    expect(plan.eventId).toBe(sampleEvent.id);
    expect(plan.generationMode).toBe('DEMO_MODE');
    expect(plan.overview).toContain('Ananya 21st Milestone Gala');
    expect(plan.theme.title).toContain('Vintage Hollywood Glamour');
    expect(plan.theme.colorPalette.length).toBeGreaterThanOrEqual(4);
    expect(plan.theme.decorIdeas.length).toBeGreaterThan(0);
    expect(plan.budgetAllocations.length).toBe(9);
    expect(plan.preparationTimeline.length).toBeGreaterThan(0);
    expect(plan.eventAgenda.length).toBeGreaterThan(0);
    expect(plan.cateringSuggestions.menuHighlights.length).toBeGreaterThan(0);
    expect(plan.vendorSuggestions.length).toBeGreaterThan(0);
    expect(plan.guestChecklist.length).toBeGreaterThan(0);
    expect(plan.risks.length).toBeGreaterThan(0);
    expect(plan.costSavingTips.length).toBeGreaterThan(0);
  });

  it('allocates budget across all 9 categories summing up to 100%', () => {
    const plan = generateContextualDemoPlan(sampleEvent);
    const totalPercentage = plan.budgetAllocations.reduce((sum, b) => sum + b.percentage, 0);

    // Should equal 100% (or 99-101% due to rounding)
    expect(totalPercentage).toBeGreaterThanOrEqual(98);
    expect(totalPercentage).toBeLessThanOrEqual(102);

    // Sum of estimated amounts should closely match totalBudget
    const totalEstimated = plan.budgetAllocations.reduce((sum, b) => sum + b.estimatedAmount, 0);
    const diffRatio = Math.abs(totalEstimated - sampleEvent.totalBudget) / sampleEvent.totalBudget;
    expect(diffRatio).toBeLessThan(0.05); // Within 5% tolerance of rounding
  });
});
