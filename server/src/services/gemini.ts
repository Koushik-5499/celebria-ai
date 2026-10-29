import { GoogleGenerativeAI } from '@google/generative-ai';
import { Event, EventPlan } from '../types/index.js';
import { generateContextualDemoPlan } from './demoPlanner.js';

export interface PlanGenerationResult {
  plan: EventPlan;
  generationMode: 'LIVE_AI' | 'DEMO_MODE';
  message?: string;
}

export async function generateEventPlanWithAI(
  event: Event,
  customInstructions?: string
): Promise<PlanGenerationResult> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

  if (!apiKey || apiKey.trim() === '' || apiKey.includes('YOUR_API_KEY')) {
    console.info('[Celebria Server] No Gemini API key detected in environment. Generating intelligent contextual demo plan.');
    const demoPlan = generateContextualDemoPlan(event);
    return {
      plan: demoPlan,
      generationMode: 'DEMO_MODE',
      message: 'Demo Mode: Showing realistic sample plan tailored to your inputs. To enable live Gemini AI generation, set GEMINI_API_KEY in your server environment.',
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey.trim());
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const prompt = `
You are the master celebration strategist and event production director for "Celebria AI".
Your task is to generate a comprehensive, highly realistic, custom event plan tailored precisely to the event details below.

CRITICAL INSTRUCTIONS:
1. All recommendations and estimated costs must directly align with the total budget of ${event.currency} ${event.totalBudget} and ${event.guestCount} guests.
2. Budget allocations MUST strictly total 100% across the 9 categories: "Venue", "Catering", "Decoration", "Photography", "Entertainment", "Invitations", "Transport", "Gifts", "Miscellaneous".
3. Return ONLY a valid JSON object matching the exact schema specified below.
4. Do not include markdown code block syntax (like \`\`\`json) if the response format is JSON. Return the raw JSON object.
5. All prices and vendor recommendations are estimates.

EVENT DETAILS:
- Name: "${event.name}"
- Type: "${event.eventType}"
- Date: "${event.date}"
- Location: "${event.location}"
- Expected Guests: ${event.guestCount}
- Total Budget: ${event.currency} ${event.totalBudget}
- Preferred Theme/Style: "${event.preferences.themeStyle}"
- Venue Setting: "${event.preferences.venueType}"
- Food Preference: "${event.preferences.foodPreference}"
- Planning Priority: "${event.preferences.planningPriority}"
${event.preferences.culturalPreferences ? `- Cultural / Regional Traditions: "${event.preferences.culturalPreferences}"` : ''}
${event.preferences.additionalRequirements ? `- Special Requirements: "${event.preferences.additionalRequirements}"` : ''}
${customInstructions ? `- Organizer Custom Instructions: "${customInstructions}"` : ''}

REQUIRED JSON SCHEMA:
{
  "overview": string,
  "theme": {
    "title": string,
    "description": string,
    "colorPalette": string[], // 4-5 hex color codes e.g. ["#6366F1", "#F43F5E", ...]
    "decorIdeas": string[] // 4-6 specific decor ideas
  },
  "budgetAllocations": [
    {
      "category": string, // one of: "Venue", "Catering", "Decoration", "Photography", "Entertainment", "Invitations", "Transport", "Gifts", "Miscellaneous"
      "percentage": number, // integer summing up to 100
      "estimatedAmount": number,
      "tips": string
    }
  ],
  "preparationTimeline": [
    {
      "timeframe": string, // e.g., "6 Weeks Before", "3 Weeks Before", "1 Week Before", "1 Day Before"
      "milestone": string,
      "tasks": string[] // 3-5 concrete action items
    }
  ],
  "eventAgenda": [
    {
      "time": string, // e.g., "05:00 PM"
      "activity": string,
      "notes": string
    }
  ],
  "cateringSuggestions": {
    "style": string,
    "menuHighlights": string[],
    "beverageIdeas": string[],
    "dietaryNotes": string
  },
  "vendorSuggestions": [
    {
      "category": string,
      "recommendedType": string,
      "questionsToAsk": string[],
      "estimatedCostRange": string
    }
  ],
  "guestChecklist": [
    {
      "task": string,
      "phase": "Before Event" | "Invitations" | "Event Day" | "Post Event",
      "tip": string
    }
  ],
  "risks": [
    {
      "risk": string,
      "mitigationPlan": string,
      "severity": "Low" | "Medium" | "High"
    }
  ],
  "costSavingTips": string[] // 4-5 concrete money-saving strategies
}
`;

    // Timeout safety: 20 seconds
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('AI generation timed out after 20 seconds')), 20000)
    );

    const generatePromise = model.generateContent(prompt);
    const result = await Promise.race([generatePromise, timeoutPromise]);
    const responseText = result.response.text();

    const parsed = JSON.parse(responseText);

    // Validate minimum required fields
    if (!parsed.overview || !parsed.theme || !Array.isArray(parsed.budgetAllocations)) {
      throw new Error('AI response did not match required plan schema structure');
    }

    const fullPlan: EventPlan = {
      eventId: event.id,
      overview: parsed.overview,
      theme: {
        title: parsed.theme.title || `${event.preferences.themeStyle} Celebration`,
        description: parsed.theme.description || '',
        colorPalette: Array.isArray(parsed.theme.colorPalette) ? parsed.theme.colorPalette : ['#6366F1', '#F43F5E', '#FEF3C7', '#0F172A'],
        decorIdeas: Array.isArray(parsed.theme.decorIdeas) ? parsed.theme.decorIdeas : [],
      },
      budgetAllocations: parsed.budgetAllocations,
      preparationTimeline: Array.isArray(parsed.preparationTimeline) ? parsed.preparationTimeline : [],
      eventAgenda: Array.isArray(parsed.eventAgenda) ? parsed.eventAgenda : [],
      cateringSuggestions: parsed.cateringSuggestions || {
        style: 'Buffet',
        menuHighlights: [],
        beverageIdeas: [],
        dietaryNotes: '',
      },
      vendorSuggestions: Array.isArray(parsed.vendorSuggestions) ? parsed.vendorSuggestions : [],
      guestChecklist: Array.isArray(parsed.guestChecklist) ? parsed.guestChecklist : [],
      risks: Array.isArray(parsed.risks) ? parsed.risks : [],
      costSavingTips: Array.isArray(parsed.costSavingTips) ? parsed.costSavingTips : [],
      generationMode: 'LIVE_AI',
      generatedAt: new Date().toISOString(),
    };

    return {
      plan: fullPlan,
      generationMode: 'LIVE_AI',
      message: `Generated live using Gemini AI (${modelName}).`,
    };
  } catch (error: any) {
    console.error('[Celebria Server] Gemini AI generation error:', error?.message || error);
    // Graceful fallback to demo plan without crashing or blocking the user
    const fallbackPlan = generateContextualDemoPlan(event);
    return {
      plan: fallbackPlan,
      generationMode: 'DEMO_MODE',
      message: `Live AI generation encountered an issue (${error?.message || 'Provider unavailable'}). Seamlessly switched to Celebria contextual demo plan.`,
    };
  }
}
