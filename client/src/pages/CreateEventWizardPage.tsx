import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Users,
  MapPin,
  DollarSign,
  Palette,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Heart,
  Crown,
  GraduationCap,
  Music,
  PartyPopper,
  Compass,
} from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { Event, EventType, VenueType, PlanningPriority } from '../types/index';
import { generateId, formatCurrency } from '../utils/formatters';

export const CreateEventWizardPage: React.FC = () => {
  const navigate = useNavigate();
  const { generateAndApplyPlan } = useEvents();

  const [step, setStep] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStage, setGenerationStage] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form State
  const [name, setName] = useState('');
  const [eventType, setEventType] = useState<EventType>('Wedding');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [guestCount, setGuestCount] = useState<number>(150);

  // Preferences
  const [totalBudget, setTotalBudget] = useState<number>(500000);
  const [currency, setCurrency] = useState('INR');
  const [themeStyle, setThemeStyle] = useState('Modern Romantic & Floral');
  const [venueType, setVenueType] = useState<VenueType>('indoor');
  const [foodPreference, setFoodPreference] = useState('Multi-Cuisine Buffet (Veg & Non-Veg)');
  const [culturalPreferences, setCulturalPreferences] = useState('');
  const [additionalRequirements, setAdditionalRequirements] = useState('');

  // Planning Priorities
  const [planningPriority, setPlanningPriority] = useState<PlanningPriority>('balanced');
  const [planningStartDate, setPlanningStartDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('');

  // Step 1 validation
  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Please provide an event name.';
    if (!date) {
      errs.date = 'Event date is required.';
    } else {
      const selected = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        errs.date = 'Event date cannot be in the past.';
      }
    }
    if (!location.trim()) errs.location = 'Event city or venue location is required.';
    if (!guestCount || guestCount < 1) errs.guestCount = 'Guest count must be at least 1.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 2 validation
  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (!totalBudget || totalBudget < 1000) {
      errs.totalBudget = 'Total budget must be at least 1,000.';
    }
    if (!themeStyle.trim()) errs.themeStyle = 'Please describe a theme or aesthetic style.';
    if (!foodPreference.trim()) errs.foodPreference = 'Food preference is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 3 validation
  const validateStep3 = () => {
    setErrors({});
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
    else if (step === 3 && validateStep3()) setStep(4);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    setGenerationStage('Calibrating celebration blueprint with AI engine...');

    try {
      const newEvent: Event = {
        id: generateId('evt'),
        name: name.trim(),
        eventType,
        date,
        location: location.trim(),
        guestCount: Number(guestCount),
        currency,
        totalBudget: Number(totalBudget),
        preferences: {
          themeStyle: themeStyle.trim(),
          venueType,
          foodPreference: foodPreference.trim(),
          culturalPreferences: culturalPreferences.trim() || undefined,
          additionalRequirements: additionalRequirements.trim() || undefined,
          planningPriority,
          planningStartDate,
          notes: notes.trim() || undefined,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setTimeout(() => setGenerationStage('Allocating category budgets & timelines...'), 800);
      setTimeout(() => setGenerationStage('Curating vendor recommendations & agendas...'), 1600);

      const plan = await generateAndApplyPlan(newEvent, notes);

      setIsGenerating(false);
      navigate(`/event/${newEvent.id}`);
    } catch (err: any) {
      console.error('Plan generation failed:', err);
      setIsGenerating(false);
      alert('Failed to generate event plan. Please check your inputs and try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Wizard Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-3 border border-indigo-100">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Event Creation Wizard</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif">
          Plan Your Next Celebration
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-lg mx-auto">
          Complete the steps below. Celebria AI will build a tailored budget, milestone timeline, and day-of itinerary.
        </p>

        {/* Step Progress Bar */}
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 -z-0" />
            <div
              className="absolute top-1/2 left-0 h-1 bg-indigo-600 -translate-y-1/2 -z-0 transition-all duration-300"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />

            {[
              { num: 1, label: 'Details' },
              { num: 2, label: 'Preferences' },
              { num: 3, label: 'Priorities' },
              { num: 4, label: 'Review & Plan' },
            ].map((s) => (
              <div key={s.num} className="relative z-10 flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => {
                    if (s.num < step) setStep(s.num);
                  }}
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
                    step === s.num
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-100'
                      : step > s.num
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-slate-400 border border-slate-300'
                  }`}
                >
                  {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
                </button>
                <span
                  className={`text-[11px] font-semibold mt-2 hidden sm:block ${
                    step === s.num ? 'text-indigo-600' : 'text-slate-500'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Wizard Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden p-6 sm:p-10">
        {/* STEP 1: EVENT DETAILS */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900 font-serif">Step 1: Event Details</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Tell us the basic logistics of your gathering.
              </p>
            </div>

            {/* Event Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Event Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Diya & Kabir's Wedding or Ananya's 18th Birthday Bash"
                className={`w-full px-4 py-3 text-sm rounded-xl border ${
                  errors.name ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                } focus:ring-2 focus:ring-indigo-500 focus:outline-none`}
              />
              {errors.name && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.name}</p>}
            </div>

            {/* Event Type Grid */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                Celebration Type *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { type: 'Wedding', icon: Crown },
                  { type: 'Birthday', icon: PartyPopper },
                  { type: 'Anniversary', icon: Heart },
                  { type: 'College Event', icon: GraduationCap },
                  { type: 'Community Event', icon: Users },
                  { type: 'Festival', icon: Sparkles },
                  { type: 'Other', icon: Compass },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = eventType === item.type;
                  return (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => setEventType(item.type as EventType)}
                      className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-bold shadow-sm'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <span className="text-xs">{item.type}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date and Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Event Date *
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={`w-full px-4 py-3 text-sm rounded-xl border ${
                    errors.date ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                  } focus:ring-2 focus:ring-indigo-500 focus:outline-none`}
                />
                {errors.date && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.date}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Location / City *
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Udaipur, Mumbai, Goa, Bangalore..."
                  className={`w-full px-4 py-3 text-sm rounded-xl border ${
                    errors.location ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                  } focus:ring-2 focus:ring-indigo-500 focus:outline-none`}
                />
                {errors.location && (
                  <p className="text-xs text-rose-500 mt-1 font-medium">{errors.location}</p>
                )}
              </div>
            </div>

            {/* Guest Count */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Expected Guest Count *
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={guestCount}
                  onChange={(e) => setGuestCount(parseInt(e.target.value) || 0)}
                  className={`w-36 px-4 py-3 text-sm rounded-xl border ${
                    errors.guestCount ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                  } focus:ring-2 focus:ring-indigo-500 focus:outline-none`}
                />
                <span className="text-xs text-slate-500">
                  Approximate headcount for catering &amp; venue capacity.
                </span>
              </div>
              {errors.guestCount && (
                <p className="text-xs text-rose-500 mt-1 font-medium">{errors.guestCount}</p>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: PREFERENCES & BUDGET */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900 font-serif">
                Step 2: Budget &amp; Aesthetic Preferences
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Define the financial scope and visual ambiance.
              </p>
            </div>

            {/* Budget & Currency */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Total Budget *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                    {currency}
                  </span>
                  <input
                    type="number"
                    min="1000"
                    step="5000"
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(parseFloat(e.target.value) || 0)}
                    className={`w-full pl-16 pr-4 py-3 text-sm rounded-xl border ${
                      errors.totalBudget ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                    } focus:ring-2 focus:ring-indigo-500 focus:outline-none font-semibold`}
                  />
                </div>
                {errors.totalBudget && (
                  <p className="text-xs text-rose-500 mt-1 font-medium">{errors.totalBudget}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white font-medium"
                >
                  <option value="INR">INR (₹ - Indian Rupee)</option>
                  <option value="USD">USD ($ - US Dollar)</option>
                  <option value="EUR">EUR (€ - Euro)</option>
                  <option value="GBP">GBP (£ - British Pound)</option>
                  <option value="AED">AED (Emirati Dirham)</option>
                  <option value="CAD">CAD (C$ - Canadian Dollar)</option>
                </select>
              </div>
            </div>

            {/* Theme & Style */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Preferred Theme / Style *
              </label>
              <input
                type="text"
                value={themeStyle}
                onChange={(e) => setThemeStyle(e.target.value)}
                placeholder="e.g. Royal Heritage, Neon Cyberpunk, Minimalist Garden Boho..."
                className={`w-full px-4 py-3 text-sm rounded-xl border ${
                  errors.themeStyle ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                } focus:ring-2 focus:ring-indigo-500 focus:outline-none`}
              />
              {errors.themeStyle && (
                <p className="text-xs text-rose-500 mt-1 font-medium">{errors.themeStyle}</p>
              )}
            </div>

            {/* Venue Setting */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Venue Setting *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'indoor', label: 'Indoor Hall / Ballroom' },
                  { id: 'outdoor', label: 'Outdoor Lawn / Open Sky' },
                  { id: 'hybrid', label: 'Hybrid (Indoor & Outdoor)' },
                ].map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setVenueType(v.id as VenueType)}
                    className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                      venueType === v.id
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Food & Catering Preferences */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Food &amp; Catering Preferences *
              </label>
              <input
                type="text"
                value={foodPreference}
                onChange={(e) => setFoodPreference(e.target.value)}
                placeholder="e.g. Pure Veg, Jain Friendly, North & South Indian, Italian Live Counters..."
                className={`w-full px-4 py-3 text-sm rounded-xl border ${
                  errors.foodPreference ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                } focus:ring-2 focus:ring-indigo-500 focus:outline-none`}
              />
            </div>

            {/* Cultural / Regional Preferences */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Cultural / Regional Traditions (Optional)
              </label>
              <input
                type="text"
                value={culturalPreferences}
                onChange={(e) => setCulturalPreferences(e.target.value)}
                placeholder="e.g. South Indian Telugu rituals, Punjabi Baarat, Catholic vows, Eco-friendly campus fest..."
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* STEP 3: PLANNING PRIORITIES */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900 font-serif">
                Step 3: Planning Priorities &amp; Instructions
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Direct how the AI should optimize budgets and vendor recommendations.
              </p>
            </div>

            {/* Priority Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                Core Planning Priority *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'balanced',
                    title: 'Balanced Experience',
                    desc: 'Harmonious distribution across catering, decor, and entertainment.',
                  },
                  {
                    id: 'elegance',
                    title: 'Elegance & Aesthetics',
                    desc: 'Higher allocation to breathtaking florals, stage decor, and photography.',
                  },
                  {
                    id: 'budget',
                    title: 'Budget Optimization',
                    desc: 'Cost-saving tips, DIY elements, and high-value essential allocations.',
                  },
                  {
                    id: 'convenience',
                    title: 'Convenience & Hospitality',
                    desc: 'Focus on guest transit, turnkey vendor packages, and minimal hassle.',
                  },
                  {
                    id: 'sustainability',
                    title: 'Eco & Sustainable',
                    desc: 'Zero-waste dining, digital invitations, and biodegradable floral decor.',
                  },
                ].map((item) => {
                  const isSelected = planningPriority === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPlanningPriority(item.id as PlanningPriority)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 shadow-sm ring-1 ring-indigo-600'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="font-bold text-sm mb-1">{item.title}</div>
                      <div className="text-xs text-slate-500 leading-relaxed">{item.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Planning Start Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Planning Start Date
              </label>
              <input
                type="date"
                value={planningStartDate}
                onChange={(e) => setPlanningStartDate(e.target.value)}
                className="w-full sm:w-64 px-4 py-3 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <p className="text-xs text-slate-500 mt-1">
                Used by the AI to calibrate milestone lead times.
              </p>
            </div>

            {/* Custom Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Special Requests or Custom Instructions (Optional)
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Ensure we have cold-fire pyrotechnics for entry; need separate changing rooms for performers..."
                className="w-full p-4 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW & GENERATION */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900 font-serif">
                Step 4: Review Celebration Summary
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Verify your celebration parameters before generating your AI event plan.
              </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: Logistics */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Logistics
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-indigo-600 font-semibold hover:underline"
                  >
                    Edit
                  </button>
                </div>
                <div>
                  <div className="text-lg font-bold text-slate-900 font-serif">{name}</div>
                  <div className="text-xs text-slate-500">{eventType}</div>
                </div>
                <div className="text-xs space-y-1 text-slate-600">
                  <div>
                    <span className="font-semibold">Date:</span> {date}
                  </div>
                  <div>
                    <span className="font-semibold">Location:</span> {location}
                  </div>
                  <div>
                    <span className="font-semibold">Headcount:</span> {guestCount} Guests
                  </div>
                </div>
              </div>

              {/* Card 2: Budget & Aesthetic */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Budget &amp; Aesthetic
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-xs text-indigo-600 font-semibold hover:underline"
                  >
                    Edit
                  </button>
                </div>
                <div>
                  <div className="text-lg font-bold text-indigo-700">
                    {formatCurrency(totalBudget, currency)}
                  </div>
                  <div className="text-xs text-slate-500 capitalize">{venueType} setting</div>
                </div>
                <div className="text-xs space-y-1 text-slate-600">
                  <div>
                    <span className="font-semibold">Theme:</span> {themeStyle}
                  </div>
                  <div>
                    <span className="font-semibold">Food:</span> {foodPreference}
                  </div>
                  {culturalPreferences && (
                    <div>
                      <span className="font-semibold">Culture:</span> {culturalPreferences}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Card 3: Priorities */}
            <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between text-xs text-indigo-900">
              <div>
                <span className="font-bold">Planning Priority: </span>
                <span className="capitalize">{planningPriority} focus</span>
                {notes && <p className="text-indigo-800/80 mt-1 italic">&quot;{notes}&quot;</p>}
              </div>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="text-indigo-600 font-semibold hover:underline shrink-0 ml-4"
              >
                Edit
              </button>
            </div>

            {/* Loading Indicator */}
            {isGenerating && (
              <div className="p-6 rounded-2xl bg-slate-900 text-white text-center space-y-3 animate-fade-in shadow-xl">
                <div className="w-10 h-10 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto" />
                <h4 className="text-base font-bold font-serif">{generationStage}</h4>
                <p className="text-xs text-slate-400">
                  Celebria AI is calculating category balances, timelines, and vendor interview checklists...
                </p>
              </div>
            )}
          </div>
        )}

        {/* Wizard Controls Footer */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              disabled={isGenerating}
              onClick={handleBack}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs sm:text-sm hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-600/20 transition-all"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isGenerating}
              onClick={handleGeneratePlan}
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-rose-600 hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-indigo-600/25 transition-all transform active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? 'Generating Blueprint...' : 'Generate My Event Plan'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
