import { describe, it, expect } from 'vitest';
import { EventSchema, GeneratePlanRequestSchema } from '../server/src/schemas/validation.js';

describe('Server & Event Schema Validation', () => {
  const validEvent = {
    id: 'evt_123',
    name: 'Diya & Kabir Grand Wedding',
    eventType: 'Wedding',
    date: '2026-11-20',
    location: 'Goa, India',
    guestCount: 200,
    currency: 'INR',
    totalBudget: 1500000,
    preferences: {
      themeStyle: 'Sunset Beach Floral',
      venueType: 'outdoor',
      foodPreference: 'Coastal Seafood & Vegetarian Buffet',
      planningPriority: 'elegance',
      planningStartDate: '2026-05-01',
      notes: 'Need seaside canopy',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it('validates a complete, well-formed event successfully', () => {
    const parsed = EventSchema.parse(validEvent);
    expect(parsed.name).toBe('Diya & Kabir Grand Wedding');
    expect(parsed.guestCount).toBe(200);
  });

  it('rejects an event with missing name or too short name', () => {
    const invalid = { ...validEvent, name: 'A' };
    expect(() => EventSchema.parse(invalid)).toThrow();
  });

  it('rejects an event with negative or zero budget', () => {
    const invalid = { ...validEvent, totalBudget: 0 };
    expect(() => EventSchema.parse(invalid)).toThrow();
  });

  it('rejects an event with invalid eventType', () => {
    const invalid = { ...validEvent, eventType: 'NonExistentType' };
    expect(() => EventSchema.parse(invalid)).toThrow();
  });

  it('validates a GeneratePlanRequest object with optional custom instructions', () => {
    const request = {
      event: validEvent,
      customInstructions: 'Please prioritize eco-friendly decor and reusable cutleries.',
    };
    const parsed = GeneratePlanRequestSchema.parse(request);
    expect(parsed.customInstructions).toContain('eco-friendly');
  });
});
