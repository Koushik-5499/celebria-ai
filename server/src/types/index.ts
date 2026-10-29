export type EventType =
  | 'Wedding'
  | 'Birthday'
  | 'Anniversary'
  | 'College Event'
  | 'Community Event'
  | 'Festival'
  | 'Other';

export type PlanningPriority =
  | 'budget'
  | 'elegance'
  | 'convenience'
  | 'sustainability'
  | 'balanced';

export type VenueType = 'indoor' | 'outdoor' | 'hybrid';

export interface EventPreferences {
  themeStyle: string;
  venueType: VenueType;
  foodPreference: string;
  culturalPreferences?: string;
  additionalRequirements?: string;
  planningPriority: PlanningPriority;
  planningStartDate?: string;
  notes?: string;
}

export interface Event {
  id: string;
  name: string;
  eventType: EventType;
  date: string;
  location: string;
  guestCount: number;
  currency: string;
  totalBudget: number;
  preferences: EventPreferences;
  createdAt: string;
  updatedAt: string;
}

export type ExpenseCategory =
  | 'Venue'
  | 'Catering'
  | 'Decoration'
  | 'Photography'
  | 'Entertainment'
  | 'Invitations'
  | 'Transport'
  | 'Gifts'
  | 'Miscellaneous';

export interface BudgetAllocation {
  category: ExpenseCategory;
  percentage: number;
  estimatedAmount: number;
  tips: string;
}

export interface PreparationTimelineItem {
  timeframe: string;
  milestone: string;
  tasks: string[];
}

export interface EventAgendaItem {
  time: string;
  activity: string;
  notes?: string;
}

export interface CateringSuggestions {
  style: string;
  menuHighlights: string[];
  beverageIdeas: string[];
  dietaryNotes: string;
}

export interface VendorSuggestion {
  category: string;
  recommendedType: string;
  questionsToAsk: string[];
  estimatedCostRange: string;
}

export interface GuestChecklistItem {
  task: string;
  phase: 'Before Event' | 'Invitations' | 'Event Day' | 'Post Event';
  tip?: string;
}

export interface RiskItem {
  risk: string;
  mitigationPlan: string;
  severity: 'Low' | 'Medium' | 'High';
}

export interface EventPlan {
  eventId: string;
  overview: string;
  theme: {
    title: string;
    description: string;
    colorPalette: string[];
    decorIdeas: string[];
  };
  budgetAllocations: BudgetAllocation[];
  preparationTimeline: PreparationTimelineItem[];
  eventAgenda: EventAgendaItem[];
  cateringSuggestions: CateringSuggestions;
  vendorSuggestions: VendorSuggestion[];
  guestChecklist: GuestChecklistItem[];
  risks: RiskItem[];
  costSavingTips: string[];
  generationMode: 'LIVE_AI' | 'DEMO_MODE';
  generatedAt: string;
}

export interface GeneratePlanRequest {
  event: Event;
  customInstructions?: string;
}

export interface GeneratePlanResponse {
  plan: EventPlan;
  generationMode: 'LIVE_AI' | 'DEMO_MODE';
  message?: string;
}
