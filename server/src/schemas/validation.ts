import { z } from 'zod';

export const EventPreferencesSchema = z.object({
  themeStyle: z.string().min(1, 'Theme style is required'),
  venueType: z.enum(['indoor', 'outdoor', 'hybrid']),
  foodPreference: z.string().min(1, 'Food preference is required'),
  culturalPreferences: z.string().optional(),
  additionalRequirements: z.string().optional(),
  planningPriority: z.enum(['budget', 'elegance', 'convenience', 'sustainability', 'balanced']),
  planningStartDate: z.string().optional(),
  notes: z.string().optional(),
});

export const EventSchema = z.object({
  id: z.string().min(1, 'Event ID is required'),
  name: z.string().min(2, 'Event name must be at least 2 characters').max(100),
  eventType: z.enum([
    'Wedding',
    'Birthday',
    'Anniversary',
    'College Event',
    'Community Event',
    'Festival',
    'Other',
  ]),
  date: z.string().min(1, 'Event date is required'),
  location: z.string().min(2, 'Location is required'),
  guestCount: z.number().int().positive('Guest count must be at least 1').max(50000),
  currency: z.string().min(1).default('INR'),
  totalBudget: z.number().positive('Total budget must be greater than 0'),
  preferences: EventPreferencesSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const GeneratePlanRequestSchema = z.object({
  event: EventSchema,
  customInstructions: z.string().max(1000).optional(),
});
