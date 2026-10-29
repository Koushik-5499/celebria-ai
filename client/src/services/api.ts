import { Event, EventPlan } from '../types/index'

export interface HealthResponse {
  status: string;
  service: string;
  tagline: string;
  version: string;
  timestamp: string;
  aiProvider: {
    provider: string;
    configured: boolean;
    model: string;
    mode: 'LIVE_AI' | 'DEMO_MODE';
  };
}

export interface GeneratePlanResult {
  success: boolean;
  plan: EventPlan;
  generationMode: 'LIVE_AI' | 'DEMO_MODE';
  message?: string;
}

export async function checkServerHealth(): Promise<HealthResponse | null> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.warn('[Celebria Client] Server health check failed, backend might be offline or sleeping:', error);
    return null;
  }
}

export async function generateEventPlan(
  event: Event,
  customInstructions?: string
): Promise<GeneratePlanResult> {
  try {
    const response = await fetch('/api/ai/generate-plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event,
        customInstructions,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || errorData?.error || `HTTP error ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      plan: data.plan,
      generationMode: data.generationMode || 'DEMO_MODE',
      message: data.message,
    };
  } catch (error: any) {
    console.warn('[Celebria Client] API request failed, generating client-side fallback plan:', error?.message);
    // Client-side fallback if server is unreachable
    const fallbackPlan = createClientFallbackPlan(event);
    return {
      success: true,
      plan: fallbackPlan,
      generationMode: 'DEMO_MODE',
      message: 'Demo Mode: Backend service was unreachable or is spinning up. Generated rich local sample blueprint.',
    };
  }
}

function createClientFallbackPlan(event: Event): EventPlan {
  const { totalBudget, currency, eventType, name, location, guestCount, preferences } = event;
  const { themeStyle, venueType, foodPreference, planningPriority } = preferences;

  return {
    eventId: event.id,
    overview: `AI Celebration Blueprint for "${name}" (${eventType}) in ${location} hosting ~${guestCount} guests. Calibrated for a ${planningPriority} priority with an allocated budget of ${currency} ${totalBudget.toLocaleString()}.`,
    theme: {
      title: `${themeStyle} Celebration`,
      description: `Harmonious curation combining ${themeStyle} styling with ${venueType} spatial flow.`,
      colorPalette: ['#6366F1', '#F43F5E', '#FEF3C7', '#0F172A'],
      decorIdeas: [
        'Grand illuminated entryway archway with ambient spotlights',
        'Stage backdrop framing the focal presentation area',
        'Elegant table settings with subtle botanical centerpieces',
        'Interactive guest memory & photo corner with custom signage',
      ],
    },
    budgetAllocations: [
      { category: 'Venue', percentage: 28, estimatedAmount: Math.round(totalBudget * 0.28), tips: 'Space rental, staging, and power setup.' },
      { category: 'Catering', percentage: 30, estimatedAmount: Math.round(totalBudget * 0.30), tips: 'Appetizers, main banquet, desserts, and beverage service.' },
      { category: 'Decoration', percentage: 14, estimatedAmount: Math.round(totalBudget * 0.14), tips: 'Theme styling, floral arrangements, and stage backdrop.' },
      { category: 'Photography', percentage: 10, estimatedAmount: Math.round(totalBudget * 0.10), tips: 'Candid photo/video coverage and highlight reel.' },
      { category: 'Entertainment', percentage: 6, estimatedAmount: Math.round(totalBudget * 0.06), tips: 'Sound equipment, DJ / music artist, and emcee.' },
      { category: 'Invitations', percentage: 2, estimatedAmount: Math.round(totalBudget * 0.02), tips: 'Stationery and digital RSVP management.' },
      { category: 'Transport', percentage: 3, estimatedAmount: Math.round(totalBudget * 0.03), tips: 'Guest logistics and equipment transit.' },
      { category: 'Gifts', percentage: 4, estimatedAmount: Math.round(totalBudget * 0.04), tips: 'Guest return favors and speaker keepsakes.' },
      { category: 'Miscellaneous', percentage: 3, estimatedAmount: Math.round(totalBudget * 0.03), tips: 'Contingency emergency reserve and licenses.' },
    ],
    preparationTimeline: [
      {
        timeframe: '6 Weeks Before',
        milestone: 'Core Foundation',
        tasks: ['Sign venue lease agreement', 'Finalize headliner caterer & menu tasting', 'Book primary photo/video crew'],
      },
      {
        timeframe: '3 Weeks Before',
        milestone: 'Design & Invitations',
        tasks: ['Send invitations and monitor RSVP portal', 'Confirm stage decor and lighting concept', 'Procure guest favors'],
      },
      {
        timeframe: '1 Week Before',
        milestone: 'Final Alignments',
        tasks: ['Lock final plate count with catering', 'Conduct AV dry run with sound engineers', 'Brief volunteer coordinators'],
      },
    ],
    eventAgenda: [
      { time: '05:00 PM', activity: 'Guest arrival & welcome refreshment', notes: 'Registration and background acoustic music' },
      { time: '06:00 PM', activity: 'Main ceremony / Opening celebrations', notes: 'Welcome address, keynote, or ritual' },
      { time: '07:30 PM', activity: 'Entertainment & celebration highlights', notes: 'Performances, toast, or cake cutting' },
      { time: '08:30 PM', activity: 'Banquet dinner spread', notes: 'Buffet lines and live stations open' },
      { time: '10:30 PM', activity: 'Farewell & guest favors distribution', notes: 'Thank-you notes and close' },
    ],
    cateringSuggestions: {
      style: 'Gourmet Multi-Station Banquet',
      menuHighlights: [
        'Signature Artisanal Welcome Coolers',
        `3 Warm Appetizers & 3 Fresh Savory Bites (${foodPreference})`,
        'Deluxe Main Course Spread with Chef-Manned Live Counters',
        'Dessert Extravaganza with Hot Specialties & Artisanal Ice Creams',
      ],
      beverageIdeas: ['Infused herbal waters', 'Seasonal fruit mocktails', 'Specialty coffee & tea bar'],
      dietaryNotes: `Carefully accommodated for ${foodPreference} preferences.`,
    },
    vendorSuggestions: [
      {
        category: 'Venue',
        recommendedType: 'Full-Amenity Banquet & Lawn Facility',
        questionsToAsk: ['Is power generator backup included?', 'What are the music curfew times?'],
        estimatedCostRange: `${currency} ${Math.round(totalBudget * 0.25).toLocaleString()} - ${currency} ${Math.round(totalBudget * 0.32).toLocaleString()}`,
      },
      {
        category: 'Catering',
        recommendedType: 'Full-Service Hospitality Caterer',
        questionsToAsk: ['How many waitstaff per table?', 'What is your plate buffer capacity?'],
        estimatedCostRange: `${currency} ${Math.round(totalBudget * 0.28).toLocaleString()} - ${currency} ${Math.round(totalBudget * 0.35).toLocaleString()}`,
      },
    ],
    guestChecklist: [
      { task: `Finalize master invitee list for ~${guestCount} attendees`, phase: 'Invitations', tip: 'Track digital confirmations.' },
      { task: 'Prepare on-site welcome badge desk & seating chart', phase: 'Before Event', tip: 'Organize alphabetically.' },
      { task: 'Distribute return favors and thank you cards', phase: 'Post Event', tip: 'Send thank you notes within 1 week.' },
    ],
    risks: [
      {
        risk: 'Sudden weather change or unseasonal rain',
        mitigationPlan: 'Maintain covered pavilion or indoor reserve area on standby.',
        severity: 'Medium',
      },
      {
        risk: 'Audio-visual malfunction during program',
        mitigationPlan: 'Carry duplicate microphones, HDMI cords, and battery backups.',
        severity: 'Low',
      },
    ],
    costSavingTips: [
      'Use digital invitations to eliminate paper printing and shipping expenses.',
      'Select in-season floral decor to reduce procurement costs.',
      'Confirm RSVPs 10 days before to prevent paying for unused food plates.',
    ],
    generationMode: 'DEMO_MODE',
    generatedAt: new Date().toISOString(),
  };
}
