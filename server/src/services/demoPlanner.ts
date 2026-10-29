import { Event, EventPlan, BudgetAllocation, ExpenseCategory } from '../types/index.js';

export function generateContextualDemoPlan(event: Event): EventPlan {
  const { eventType, name, location, guestCount, totalBudget, currency, preferences } = event;
  const { themeStyle, venueType, foodPreference, planningPriority, culturalPreferences } = preferences;

  // 1. Budget breakdown based on eventType & planningPriority
  const allocations: BudgetAllocation[] = getCategoryAllocations(eventType, planningPriority, totalBudget);

  // 2. Timeline milestones tailored to event date and guest count
  const preparationTimeline = getPreparationTimeline(eventType, guestCount);

  // 3. Event-day agenda tailored to event type
  const eventAgenda = getEventAgenda(eventType);

  // 4. Catering suggestions tailored to foodPreference and guestCount
  const cateringSuggestions = getCateringSuggestions(eventType, foodPreference, guestCount);

  // 5. Vendor recommendations with realistic estimated ranges & questions to ask
  const vendorSuggestions = getVendorSuggestions(eventType, totalBudget, currency);

  // 6. Theme and decor styling
  const theme = getThemeDetails(eventType, themeStyle, venueType);

  // 7. Guest checklist
  const guestChecklist = [
    {
      task: `Finalize master invitee list for ~${guestCount} guests`,
      phase: 'Invitations' as const,
      tip: 'Collect RSVPs digitally to get an exact headcount before final caterer confirmation.',
    },
    {
      task: 'Send save-the-dates or digital invitations with venue map & directions',
      phase: 'Invitations' as const,
      tip: 'Include parking details and dietary preference questionnaires.',
    },
    {
      task: 'Set up welcome reception desk & seating chart',
      phase: 'Before Event' as const,
      tip: 'Ensure signage is legible from entry gates.',
    },
    {
      task: 'Designate a guest coordinator or family point of contact',
      phase: 'Event Day' as const,
      tip: 'Share coordinator contact details with vendors and key guests.',
    },
    {
      task: 'Send heartfelt thank-you notes & digital photo gallery link',
      phase: 'Post Event' as const,
      tip: 'Share within 7-10 days while the memories are fresh.',
    },
  ];

  // 8. Risks and backup plans
  const risks = [
    {
      risk: venueType === 'outdoor' ? 'Sudden rain or adverse weather conditions' : 'Venue technical glitch or power fluctuation',
      mitigationPlan: venueType === 'outdoor' 
        ? 'Contract waterproof marquee tents and have an indoor fallback hall ready on standby.'
        : 'Verify venue sound system backup, backup generator (DG set), and emergency exits.',
      severity: 'High' as const,
    },
    {
      risk: 'Unexpected guest surge beyond RSVP count',
      mitigationPlan: 'Coordinate with catering for a +10% buffer plate capacity on event day.',
      severity: 'Medium' as const,
    },
    {
      risk: 'Audio-visual or presentation delay during key moments',
      mitigationPlan: 'Schedule an AV dry run 2 hours prior to guest arrival with all microphones tested.',
      severity: 'Low' as const,
    },
  ];

  // 9. Cost saving tips
  const costSavingTips = [
    `Opt for seasonal and locally sourced flowers for ${themeStyle} decorations to reduce logistics charges by 20-30%.`,
    'Consolidate photography and videography under one production vendor to negotiate bundled package discounts.',
    `Send beautifully crafted animated digital invitations instead of printed cards to save up to 90% on invite costs.`,
    'Lock in caterer numbers based on strict 10-day prior RSVPs to avoid paying for unconsumed plates.',
    'Negotiate complimentary venue inclusions such as stage lighting, basic audio setup, and bride/groom dressing suites.',
  ];

  const overview = `Comprehensive AI blueprint designed for "${name}", a ${eventType} for ${guestCount} guests in ${location}. Structured for a ${planningPriority}-focused experience with an estimated total budget of ${currency} ${totalBudget.toLocaleString()}. Every phase is calibrated for seamless guest hospitality, captivating ambiance, and dependable vendor coordination.`;

  return {
    eventId: event.id,
    overview,
    theme,
    budgetAllocations: allocations,
    preparationTimeline,
    eventAgenda,
    cateringSuggestions,
    vendorSuggestions,
    guestChecklist,
    risks,
    costSavingTips,
    generationMode: 'DEMO_MODE',
    generatedAt: new Date().toISOString(),
  };
}

function getCategoryAllocations(
  eventType: string,
  priority: string,
  totalBudget: number
): BudgetAllocation[] {
  // Base weights for categories
  let weights: Record<ExpenseCategory, number>;

  switch (eventType) {
    case 'Wedding':
      weights = {
        Venue: 0.28,
        Catering: 0.30,
        Decoration: 0.14,
        Photography: 0.10,
        Entertainment: 0.06,
        Invitations: 0.02,
        Transport: 0.03,
        Gifts: 0.04,
        Miscellaneous: 0.03,
      };
      break;
    case 'Birthday':
      weights = {
        Venue: 0.22,
        Catering: 0.35,
        Decoration: 0.15,
        Photography: 0.07,
        Entertainment: 0.12,
        Invitations: 0.02,
        Transport: 0.01,
        Gifts: 0.04,
        Miscellaneous: 0.02,
      };
      break;
    case 'College Event':
      weights = {
        Venue: 0.25,
        Catering: 0.20,
        Decoration: 0.10,
        Photography: 0.06,
        Entertainment: 0.24,
        Invitations: 0.03,
        Transport: 0.02,
        Gifts: 0.05,
        Miscellaneous: 0.05,
      };
      break;
    case 'Community Event':
    case 'Festival':
      weights = {
        Venue: 0.25,
        Catering: 0.28,
        Decoration: 0.15,
        Photography: 0.06,
        Entertainment: 0.14,
        Invitations: 0.03,
        Transport: 0.03,
        Gifts: 0.02,
        Miscellaneous: 0.04,
      };
      break;
    default:
      weights = {
        Venue: 0.25,
        Catering: 0.30,
        Decoration: 0.15,
        Photography: 0.08,
        Entertainment: 0.08,
        Invitations: 0.03,
        Transport: 0.03,
        Gifts: 0.04,
        Miscellaneous: 0.04,
      };
  }

  // Adjust for priority
  if (priority === 'elegance') {
    weights.Decoration += 0.04;
    weights.Photography += 0.02;
    weights.Catering -= 0.03;
    weights.Miscellaneous -= 0.03;
  } else if (priority === 'budget') {
    weights.Miscellaneous += 0.03;
    weights.Decoration -= 0.03;
  }

  const categoryTips: Record<ExpenseCategory, string> = {
    Venue: 'Includes rental, security deposit, cleanup fees, and parking spaces.',
    Catering: 'Covers appetizers, buffet mains, desserts, live stations, and beverage bar.',
    Decoration: 'Backdrop, entrance arch, table centerpieces, ambient lighting, and floral setup.',
    Photography: 'Full event coverage, drone videography, edited album, and short highlight reel.',
    Entertainment: 'DJ, sound system, acoustic artists, emcee, or curated games.',
    Invitations: 'Digital interactive stationery, welcome badges, and on-site signage.',
    Transport: 'Guest shuttle, bridal/VIP logistics, and vendor loading transport.',
    Gifts: 'Personalized guest return favors, sweets, or keepsake hampers.',
    Miscellaneous: 'Contingency emergency reserve, tips, licenses, and unforeseen expenses.',
  };

  const categories = Object.keys(weights) as ExpenseCategory[];
  return categories.map((cat) => {
    const percentage = Math.round(weights[cat] * 100);
    const estimatedAmount = Math.round(totalBudget * weights[cat]);
    return {
      category: cat,
      percentage,
      estimatedAmount,
      tips: categoryTips[cat] || 'Planned allocation',
    };
  });
}

function getPreparationTimeline(eventType: string, guestCount: number) {
  return [
    {
      timeframe: '6-8 Weeks Before',
      milestone: 'Core Foundation & Booking',
      tasks: [
        'Lock venue date and sign rental contract with deposit payment',
        'Finalize caterer tasting and agree on preliminary menu items',
        'Book photographer and videographer team',
        'Draft total event budget and set up expense tracking',
      ],
    },
    {
      timeframe: '4 Weeks Before',
      milestone: 'Design, Aesthetics & Invitations',
      tasks: [
        'Send out official invitations with RSVP deadline',
        'Finalize decor concepts, stage backdrop, and color palette with decorator',
        'Order personalized gifts, return favors, and promotional assets',
        'Confirm sound, stage lighting, and audio technician availability',
      ],
    },
    {
      timeframe: '2 Weeks Before',
      milestone: 'Guest Logistics & Vendor Alignments',
      tasks: [
        'Compile confirmed RSVP numbers and update caterer plate count',
        'Create day-of run of show schedule and distribute to key organizers',
        'Confirm transport logistics and parking reservations',
        'Prepare backup plan checklist (weather, power, emergency medical kit)',
      ],
    },
    {
      timeframe: '3 Days Before',
      milestone: 'Final Polish & Rehearsal',
      tasks: [
        'Perform venue walkthrough with decorator and AV coordinator',
        'Review final seating arrangements and welcome entrance setup',
        'Withdraw petty cash for vendor tips and last-minute contingencies',
        'Charge all camera batteries, audio transmitters, and wireless mics',
      ],
    },
  ];
}

function getEventAgenda(eventType: string) {
  switch (eventType) {
    case 'Wedding':
      return [
        { time: '03:00 PM', activity: 'Bridal & Groom prep, detail photography shots', notes: 'Wardrobe, jewelry, and family portraits' },
        { time: '04:30 PM', activity: 'Guest arrival & welcome refreshments', notes: 'Acoustic background music and guest book signing' },
        { time: '05:30 PM', activity: 'Ceremony / Main rituals begins', notes: 'Processional, vows, rings exchange, or garland ritual' },
        { time: '06:45 PM', activity: 'Sunset photoshoot and family stage congratulations', notes: 'Designated coordinator directs photo batches' },
        { time: '07:30 PM', activity: 'Grand reception entry & first dance / toast', notes: 'Sparkler celebration or celebratory toast' },
        { time: '08:15 PM', activity: 'Dinner buffet & live entertainment starts', notes: 'Chef-manned live counter stations open' },
        { time: '10:00 PM', activity: 'Cake cutting, dessert bar & open dance floor', notes: 'DJ set with high-energy party tracks' },
        { time: '11:30 PM', activity: 'Grand farewell & wrap-up', notes: 'Handing out favors and return shuttle departures' },
      ];
    case 'Birthday':
      return [
        { time: '05:00 PM', activity: 'Venue setup, balloon arch styling & playlist test', notes: 'Ensure air conditioning and gift table ready' },
        { time: '06:00 PM', activity: 'Guest arrival, photo booth & welcome drinks', notes: 'Finger foods, mocktails, and interactive games' },
        { time: '07:00 PM', activity: 'Entertainer performance / group trivia & games', notes: 'Emcee leads fun activities for all age groups' },
        { time: '08:00 PM', activity: 'Birthday cake cutting ceremony & toast', notes: 'Gather everyone around the main cake table' },
        { time: '08:30 PM', activity: 'Dinner banquet & dessert treats', notes: 'Buffet lines open with diverse vegetarian/specialty items' },
        { time: '09:45 PM', activity: 'Music, open dance floor & photo takeaways', notes: 'Distribute party return favors and polaroid prints' },
      ];
    default:
      return [
        { time: '04:00 PM', activity: 'Logistics check-in and stage soundcheck', notes: 'Team briefing and walkie-talkie sync' },
        { time: '05:30 PM', activity: 'Registration & welcome reception', notes: 'Badge handout, networking, and soft drinks' },
        { time: '06:30 PM', activity: 'Opening ceremony and keynote address', notes: 'Welcome speech by host or organizers' },
        { time: '07:30 PM', activity: 'Cultural performances / featured entertainment', notes: 'Stage lighting and audio cues active' },
        { time: '08:45 PM', activity: 'Dinner banquet & networking mixer', notes: 'Dinner spread served with multiple cuisine stations' },
        { time: '10:15 PM', activity: 'Vote of thanks, awards / certificates & close', notes: 'Photo opportunity with attendees' },
      ];
  }
}

function getCateringSuggestions(eventType: string, foodPref: string, guestCount: number) {
  return {
    style: guestCount > 150 ? 'Multi-Station Grand Buffet with Live Counters' : 'Curated Plated Buffet with Butler Appetizers',
    menuHighlights: [
      `Signature Welcome Mocktails: Citrus Mint Sparkler & Spiced Berry Cooler`,
      `Artisanal Appetizers: 3 Crispy Warm Starters & 3 Fresh Savory Bites tailored to ${foodPref}`,
      `Main Course Banquet: Balanced selection of rich curries/entrees, fragrant rice/pasta, artisanal breads, and crisp salad bowls`,
      `Grand Dessert Ensemble: Warm specialty dessert paired with gourmet ice creams and miniature pastries`,
    ],
    beverageIdeas: [
      'Infused fresh fruit water stations (Cucumber-Mint, Strawberry-Basil)',
      'Live espresso and artisanal tea counter for post-dinner refreshment',
      'Chilled seasonal fruit punches and mocktails',
    ],
    dietaryNotes: `Carefully separated preparation and dedicated labeling for ${foodPref} preferences, gluten-free, and nut-allergy considerations.`,
  };
}

function getVendorSuggestions(eventType: string, totalBudget: number, currency: string) {
  return [
    {
      category: 'Venue & Banquet',
      recommendedType: 'Heritage Lawn / Contemporary Banquet Hall',
      questionsToAsk: [
        'What is the curfew timing for music and air conditioning?',
        'Are outside caterers or decorators permitted without surcharge?',
        'Is full DG power backup included in the rental price?',
      ],
      estimatedCostRange: `${currency} ${Math.round(totalBudget * 0.25).toLocaleString()} - ${currency} ${Math.round(totalBudget * 0.32).toLocaleString()}`,
    },
    {
      category: 'Catering & Beverages',
      recommendedType: 'Full-Service Hospitality Caterer',
      questionsToAsk: [
        'How many service staff and live chefs will be assigned for our guest count?',
        'Do you provide chinaware, cutlery, and linen as part of per-plate pricing?',
        'What is your cancellation and date-rescheduling policy?',
      ],
      estimatedCostRange: `${currency} ${Math.round(totalBudget * 0.28).toLocaleString()} - ${currency} ${Math.round(totalBudget * 0.35).toLocaleString()}`,
    },
    {
      category: 'Decoration & Stage Styling',
      recommendedType: 'Boutique Event Stylist & Floral Designer',
      questionsToAsk: [
        'Can you provide a 3D sketch or mood board before execution?',
        'Do you use fresh seasonal flowers or faux/silk floral accents?',
        'What is the teardown schedule post-event?',
      ],
      estimatedCostRange: `${currency} ${Math.round(totalBudget * 0.12).toLocaleString()} - ${currency} ${Math.round(totalBudget * 0.18).toLocaleString()}`,
    },
    {
      category: 'Photography & Cinematography',
      recommendedType: 'Candid & Traditional Storytelling Team',
      questionsToAsk: [
        'How many team members will cover the event (traditional vs candid)?',
        'What is the turnaround time for teaser videos and full photo albums?',
        'Do you shoot in 4K resolution and include drone coverage?',
      ],
      estimatedCostRange: `${currency} ${Math.round(totalBudget * 0.08).toLocaleString()} - ${currency} ${Math.round(totalBudget * 0.12).toLocaleString()}`,
    },
    {
      category: 'Sound, DJ & Entertainment',
      recommendedType: 'Professional Event DJ & AV Systems Provider',
      questionsToAsk: [
        'Does the package include line-array sound and intelligent moving beam lights?',
        'Can we provide a custom playlist or "do not play" list?',
        'Do you bring wireless handheld microphones for speeches?',
      ],
      estimatedCostRange: `${currency} ${Math.round(totalBudget * 0.05).toLocaleString()} - ${currency} ${Math.round(totalBudget * 0.09).toLocaleString()}`,
    },
  ];
}

function getThemeDetails(eventType: string, themeStyle: string, venueType: string) {
  let colorPalette = ['#6366F1', '#F43F5E', '#FEF3C7', '#0F172A'];
  if (themeStyle.toLowerCase().includes('royal') || themeStyle.toLowerCase().includes('vintage')) {
    colorPalette = ['#7C2D12', '#D97706', '#FEF3C7', '#1E1B4B'];
  } else if (themeStyle.toLowerCase().includes('minimal') || themeStyle.toLowerCase().includes('modern')) {
    colorPalette = ['#0F172A', '#64748B', '#E2E8F0', '#6366F1'];
  } else if (themeStyle.toLowerCase().includes('boho') || themeStyle.toLowerCase().includes('nature')) {
    colorPalette = ['#065F46', '#D97706', '#FEF3C7', '#78350F'];
  }

  return {
    title: `${themeStyle} Elegance`,
    description: `A sophisticated aesthetic pairing ${themeStyle.toLowerCase()} elements with ${venueType} ambiance, balancing atmospheric illumination, organic floral textures, and bespoke focal points.`,
    colorPalette,
    decorIdeas: [
      `Illuminated entrance archway featuring warm fairy lights and lush foliage`,
      `Statement stage backdrop with geometric architectural panels and soft spotlights`,
      `Low-profile floral centerpieces on guest tables to foster effortless conversation`,
      `Interactive memory wall or illuminated photo-op nook with branded neon signage`,
      `Custom ambient pathway lighting utilizing lanterns and warm uplights`,
    ],
  };
}
