import { describe, it, expect } from 'vitest';
import { getSampleInitialState } from '../client/src/utils/sampleData.js';

describe('Storage & State Persistence Layer', () => {
  it('generates a valid initial sample state with events, plans, expenses, and tasks', () => {
    const state = getSampleInitialState();

    expect(state.version).toBe(1);
    expect(state.events.length).toBeGreaterThan(0);
    expect(Object.keys(state.plans).length).toBeGreaterThan(0);
    expect(state.expenses.length).toBeGreaterThan(0);
    expect(state.tasks.length).toBeGreaterThan(0);
    expect(state.vendors.length).toBeGreaterThan(0);
  });

  it('serializes and deserializes cleanly via JSON roundtrip without loss of data', () => {
    const original = getSampleInitialState();
    const serialized = JSON.stringify(original);
    const parsed = JSON.parse(serialized);

    expect(parsed.version).toBe(1);
    expect(parsed.events[0].id).toBe(original.events[0].id);
    expect(parsed.plans[original.events[0].id].overview).toBe(
      original.plans[original.events[0].id].overview
    );
  });
});
