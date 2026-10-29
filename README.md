# Celebria AI 🪄✨
> *Every celebration, beautifully planned.*

**Hack2Skill PromptWars Virtual — Challenge 5: Celebration & Event Planner Submission**

Celebria AI is an intelligent, full-stack celebration planning platform designed for individuals, families, student organizers, and community event coordinators. From royal destination weddings to milestone birthdays, college conclaves, and community cultural festivals, Celebria AI converts your event ideas into concrete, actionable blueprints—complete with automated budget allocations, preparation timelines, run-of-show day-of agendas, and vendor management checklists.

---

## 🌟 Key Features

### 1. 🤖 Intelligent AI Blueprint Generation
- **Structured GenAI Reasoning**: Powered by server-side Google Gemini with JSON schema validation.
- **Custom Aesthetic Curation**: Suggests tailored themes, color palettes (hex codes), and specific decor ideas.
- **Run-of-Show Agenda**: Generates an hour-by-hour event schedule for hosts, coordinators, emcees, and caterers.
- **Catering & Hospitality**: Details buffet/plated dining styles, signature welcome drinks, culinary highlights, and dietary allergen protocols.
- **Contingency Risk Mitigation**: Identifies event-specific risks (e.g. weather shifts, unexpected attendance surges, AV failures) and concrete backup plans.
- **Cost-Saving Strategies**: Recommends practical value-engineering tips (e.g. local seasonal blooms, consolidated cinematography, digital stationery).

### 2. 💰 Smart Budget & Variance Tracker
- **Dynamic Category Allocation**: Automatically balances budgets across 9 core categories: *Venue, Catering, Decoration, Photography, Entertainment, Invitations, Transport, Gifts, and Miscellaneous*.
- **Visual Analytics**: Interactive Recharts donut charts and planned vs. actual variance bar graphs.
- **Real-Time Financial Health**: Live calculations for Total Budget, Planned Allocation, Actual Spent, and Remaining Balance.
- **Overbudget Alerts**: Instant warning banner and color-coded meters if expenses exceed the designated cap.
- **Line-Item Management**: Add, edit, delete, and toggle invoices between **Paid** and **Pending**.

### 3. ⏱️ Timeline & Milestone Planner
- **Preparation Milestones**: Chronological phases (e.g. *6-8 Weeks Before*, *4 Weeks Before*, *2 Weeks Before*, *3 Days Before*).
- **Task Management**: Create custom tasks, assign due dates, categorize by phase, and set priorities (*High, Medium, Low*).
- **Overdue Detection**: Prominently highlights overdue tasks that need immediate attention.
- **Safe Regeneration**: Regenerate AI milestones without silently deleting manually added user tasks.

### 4. 🤝 Vendor Hub & Negotiation Checklist
- **Vendor Directory**: Track vendor contacts, categorized services, estimated quotes, and negotiation notes.
- **Status Workflow**: Manage status transitions: `To Contact` ➔ `Contacted` ➔ `Negotiating` ➔ `Confirmed` ➔ `Completed`.
- **AI Suggested Questions**: Curates specific interview questions and estimated pricing benchmarks for each vendor category.
- **Transparent Disclaimers**: Explicitly states that Celebria AI provides organizational tools and never fakes automated vendor bookings.

### 5. 🖨️ Printable Dossier & PDF Export
- **Print-Optimized Layout**: Tailored `@media print` CSS for high-resolution paper printouts and clean browser "Save as PDF" exports.
- **Comprehensive Packet**: Formats executive summaries, budget tables, vendor directories, agendas, and risk checklists for on-site distribution.

### 6. 🔒 Local-First Persistence & Reliability
- **Zero Barrier to Entry**: Works immediately without forced account signups. Data persists safely in browser `localStorage` with versioning (`v1`).
- **Export & Import**: Export full JSON backups anytime and restore them across devices.
- **Pluggable Architecture**: Structured with an `IStorageService` abstraction for seamless Cloud Firestore integration when credentials are provided.

---

## 🏛️ Technical Architecture

Celebria AI is built as a clean, decoupled full-stack TypeScript workspace:

```
Celebria AI/
├── client/                     # Frontend SPA (React 19, TypeScript, Vite)
│   ├── src/
│   │   ├── components/         # Modular UI components
│   │   │   ├── common/         # Navbar, Footer, Modal, Badge
│   │   │   ├── plan/           # PlanOverviewTab, PrintExportView
│   │   │   ├── budget/         # BudgetManagerTab (Recharts visualizations)
│   │   │   ├── timeline/       # TimelinePlannerTab (Milestones & task manager)
│   │   │   └── vendors/        # VendorManagerTab (Vendor hub & questions)
│   │   ├── pages/              # LandingPage, DashboardPage, CreateEventWizardPage, EventDetailPage, NotFoundPage
│   │   ├── context/            # EventContext (Reactive state management)
│   │   ├── services/           # storageService (Local-first) & apiService (AI bridge)
│   │   ├── utils/              # formatters, sampleData (seed celebration)
│   │   ├── types/              # Domain TypeScript interfaces
│   │   └── styles/             # index.css (Tailwind CSS v4 & print directives)
├── server/                     # Backend API (Node.js, Express, TypeScript)
│   ├── src/
│   │   ├── routes/             # /api/health, /api/ai/generate-plan
│   │   ├── services/           # gemini.ts (GenAI SDK) & demoPlanner.ts (Contextual fallback)
│   │   ├── schemas/            # Zod validation schemas
│   │   ├── types/              # Server-side TypeScript interfaces
│   │   └── index.ts            # Express server (CORS, Helmet, Rate Limiting, Static SPA Serving)
├── tests/                      # Automated Vitest Test Suite (17 tests passing)
│   ├── budget.test.ts          # Budget arithmetic, remaining balance, currency formatting
│   ├── timeline.test.ts        # Task sorting, countdown calculations, overdue detection
│   ├── validation.test.ts      # Zod validation schemas for event and plan inputs
│   ├── demoPlanner.test.ts     # Demo engine 100% allocation balance and schema compliance
│   └── storage.test.ts         # JSON serialization, state generation, migration recovery
├── package.json                # Root package.json with unified workspace scripts
├── .gitignore                  # Excludes node_modules, build artifacts, .env, and logs
├── .env.example                # Sample environment variables
└── README.md                   # Complete documentation & demo video script
```

---

## 🚦 Live AI Mode vs. Demo Mode

Celebria AI guarantees a seamless experience regardless of whether external AI provider credentials are configured:

| Mode | Trigger Condition | Behavior |
| :--- | :--- | :--- |
| **Live Gemini AI** | `GEMINI_API_KEY` present in server environment | Calls Google Gemini (`gemini-1.5-flash`) with structured JSON schema. Generates real-time, bespoke AI reasoning with an active pulsing status badge. |
| **Demo Mode** | No API key configured or external provider downtime | Activates Celebria's intelligent Contextual Demo Planner. Produces highly realistic, customized plans matching the user's specific budget, guest count, and theme. Clearly labeled with transparent notices—never faking live calls. |

---

## 🛠️ Local Development Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher (v24 LTS recommended)
- **npm**: v9.0.0 or higher

### Step 1: Clone or Navigate to Repository
```bash
git clone https://github.com/your-username/celebria-ai.git
cd "Celebria AI"
```

### Step 2: Install Dependencies
```bash
# Installs root, client, and server dependencies in one unified command
npm install
```

### Step 3: Configure Environment Variables
```bash
# Copy example environment configuration
cp .env.example .env
```
Edit `.env` (or `server/.env`) to add your optional Google Gemini API key:
```env
PORT=5000
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
```
*(If you leave `GEMINI_API_KEY` blank, Celebria AI will seamlessly run in its rich Demo Mode).*

### Step 4: Run Development Servers
```bash
# Launches both server (port 5000) and client Vite dev server (port 5173 with API proxy)
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## 🧪 Automated Testing & Quality Assurance

Celebria AI includes 17 automated tests covering crucial business logic:
- **Budget Calculations**: Summation, planned vs actual variance, overbudget flags, and multi-currency formatting (`₹`, `$`, `€`, `£`).
- **Timeline Sorting**: Due date ascending, priority weighting (`High` > `Medium` > `Low`), and overdue task filtering.
- **Server Schema Validation**: Zod input validation, type safety, and rejection of negative budgets.
- **Contextual Demo Engine**: Verifies that generated plans total 100% across the 9 expense categories.
- **Persistence Layer**: JSON serialization and state recovery.

To run the test suite:
```bash
npm run test
```

Sample output:
```text
 ✓ tests/storage.test.ts (2 tests)
 ✓ tests/timeline.test.ts (4 tests)
 ✓ tests/budget.test.ts (4 tests)
 ✓ tests/demoPlanner.test.ts (2 tests)
 ✓ tests/validation.test.ts (5 tests)

 Test Files  5 passed (5)
      Tests  17 passed (17)
```

---

## 🚀 Deployment Instructions

Celebria AI is designed for friction-free free-tier deployment.

### Option A: Single-Service Full-Stack Deployment (Render / Railway / Fly.io)
The Express backend is pre-configured to build and serve the client SPA directly from `client/dist`.

1. **Build the application**:
   ```bash
   npm run build
   ```
2. **Set Build & Start Commands on Render**:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Environment Variables**:
     - `NODE_ENV`: `production`
     - `PORT`: `5000` (or leave default for Render)
     - `GEMINI_API_KEY`: *(Your Google AI Studio API key)*
     - `GEMINI_MODEL`: `gemini-1.5-flash`

### Option B: Decoupled Deployment (Vercel Frontend + Render Backend)

#### Deploying Frontend to Vercel:
1. Link the repository on [Vercel](https://vercel.com/).
2. Set **Root Directory** to `client`.
3. Framework Preset: `Vite`.
4. Add environment variable or rewrite in `vercel.json`:
   ```json
   {
     "rewrites": [
       { "source": "/api/(.*)", "destination": "https://your-backend.onrender.com/api/$1" },
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```

#### Deploying Backend to Render:
1. Create a **Web Service** on [Render](https://render.com/).
2. Set **Root Directory** to `server`.
3. **Build Command**: `npm install && npm run build`
4. **Start Command**: `node dist/index.js`
5. Configure `GEMINI_API_KEY` in Render environment variables.

---

## 📡 REST API Documentation

### 1. Health Check
`GET /api/health`
- **Description**: Returns server status, AI provider connection state, and service metadata.
- **Sample Response**:
```json
{
  "status": "ok",
  "service": "Celebria AI API",
  "tagline": "Every celebration, beautifully planned.",
  "version": "1.0.0",
  "timestamp": "2026-10-29T17:02:36.846Z",
  "aiProvider": {
    "provider": "Google Gemini",
    "configured": true,
    "model": "gemini-1.5-flash",
    "mode": "LIVE_AI"
  }
}
```

### 2. Generate Event Plan
`POST /api/ai/generate-plan`
- **Rate Limit**: 60 requests per 15 minutes per IP.
- **Request Body**:
```json
{
  "event": {
    "id": "evt_sample_123",
    "name": "Aarav & Meera Royal Wedding",
    "eventType": "Wedding",
    "date": "2026-12-18",
    "location": "Udaipur, Rajasthan",
    "guestCount": 350,
    "currency": "INR",
    "totalBudget": 2500000,
    "preferences": {
      "themeStyle": "Royal Palace Heritage",
      "venueType": "hybrid",
      "foodPreference": "Rajasthani Pure Veg & Jain",
      "planningPriority": "elegance"
    },
    "createdAt": "2026-06-01T10:00:00Z",
    "updatedAt": "2026-06-01T10:00:00Z"
  },
  "customInstructions": "Please prioritize outdoor mandap lighting and drone cinematography."
}
```
- **Response**: Returns validated `EventPlan` JSON object containing `theme`, `budgetAllocations`, `preparationTimeline`, `eventAgenda`, `cateringSuggestions`, `vendorSuggestions`, `guestChecklist`, and `risks`.

---

## 📸 Screenshots & Interface Tour

*(To add actual screenshots, place image files in `docs/screenshots/` and update references below):*

1. **Landing Page**: Modern ivory & deep navy aesthetic with interactive celebration showcase.
2. **Dashboard**: Metrics overview, active countdowns, and budget health meters.
3. **Create Event Wizard**: 4-step guided form with real-time field validation.
4. **Budget Manager**: Visual Recharts donut and variance charts with line-item invoice tracker.
5. **Timeline & Agenda**: Minute-by-minute day-of schedule and milestone checklists with overdue flags.
6. **Vendor Hub**: Vendor directory with status tracking and AI interview questions.
7. **Print Dossier**: Clean, printer-friendly PDF layout.

---

## ⚠️ Known Limitations & Future Roadmap

- **Vendor Direct Integration**: Current version provides vendor coordination tools and interview guides. Automated booking/checkout is intentionally omitted to avoid placing unverified financial obligations on organizers.
- **Real-Time Multi-User Collaboration**: State is currently persisted local-first via `localStorage` with JSON import/export. Future versions can connect the pre-architected storage interface to Firebase Firestore for multi-device family sharing.

---

## 🎬 4-Minute Demo Video Walkthrough Script

*Designed specifically for the Hack2Skill PromptWars Challenge 5 submission video (under 4 minutes):*

| Timestamp | Screen | Voiceover / Action Script |
| :--- | :--- | :--- |
| **0:00 – 0:20** | **Landing Page** | *"Welcome to Celebria AI — every celebration, beautifully planned. Created for Hack2Skill PromptWars Challenge 5, Celebria AI is an intelligent celebration planning platform that transforms any event vision into an actionable blueprint with realistic budgets, timelines, and vendor checklists."* |
| **0:20 – 0:55** | **Event Creation Wizard** | *"Let's plan a celebration. We click 'Plan My Event' to launch our 4-step wizard. We enter our event name, select 'Wedding', set the date, location in Udaipur, and 350 guests. In Step 2, we set a budget of 25 Lakhs INR, select a Royal Palace theme, and specify Rajasthani dining. In Step 3, we prioritize Elegance. After reviewing in Step 4, we click 'Generate My Event Plan'."* |
| **0:55 – 1:40** | **AI Event Plan Overview** | *"In seconds, Celebria AI generates a complete celebration blueprint. Notice the clear AI Mode indicator showing live Gemini reasoning. The plan delivers an executive overview, a curated color palette with hex codes, decor highlights, dining concepts, and guest checklists. Even better, it includes contingency plans for weather and delay risks, alongside personalized cost-saving strategies."* |
| **1:40 – 2:20** | **Budget Manager & Charts** | *"Next, let's open the Budget Manager tab. Celebria AI automatically distributed the 25 Lakh budget across all 9 categories. We have interactive Recharts donut and variance bar graphs. Let's record a real expense: Palace Lawn Booking Advance of 6.8 Lakhs. We mark it as Paid. All totals, percentages, and remaining balance recalculate instantly, with automated warnings if spending exceeds limits."* |
| **2:20 – 2:55** | **Timeline & Vendor Hub** | *"Moving to the Timeline tab, we have an hour-by-hour run-of-show agenda for the big day, plus chronological preparation milestones. We can check off tasks or add custom ones. Overdue items are automatically highlighted. In the Vendor Hub, we track quotes from 'To Contact' to 'Confirmed', accompanied by tailored interview questions generated by the AI."* |
| **2:55 – 3:25** | **Export & Local Persistence** | *"When organizers need on-site sheets, the Print / Export tab formats the entire plan into a print-ready dossier with one click. Furthermore, Celebria AI is built local-first: our data persists across reloads, and we can export full JSON backups from the dashboard without needing a login."* |
| **3:25 – 3:50** | **Technical Wrap-Up** | *"Under the hood, Celebria AI uses React 19, TypeScript, Tailwind CSS, Lucide, Recharts, and Express, with server-side Google Gemini GenAI integration and automated Vitest tests. Thank you for exploring Celebria AI — every celebration, beautifully planned."* |

---

## 🏆 Hack2Skill Challenge 5 Verification Checklist

- [x] **Project Objective**: Full celebration planning platform for weddings, birthdays, anniversaries, and college fests.
- [x] **Project Name & Tagline**: *Celebria AI — Every celebration, beautifully planned.*
- [x] **Frontend Stack**: React 19, Vite, TypeScript, Tailwind CSS, Lucide React, Recharts, React Router.
- [x] **Backend Stack**: Node.js, Express, TypeScript, REST API.
- [x] **AI Integration**: Server-side Google Gemini SDK with structured JSON schemas and transparent demo mode fallback.
- [x] **Persistence**: Local-first `localStorage` with versioning (`v1`), export/import, and pluggable storage interface.
- [x] **Budget Manager**: 9 categories, Recharts visual graphs, overbudget warnings, line-item CRUD.
- [x] **Timeline Planner**: Milestones, day-of agenda, overdue alerts, priority sorting.
- [x] **Vendor Manager**: Status tracking, contact information, AI interview questions, non-automated disclaimers.
- [x] **Print & Export**: Print-ready CSS layout for PDF/paper dossiers.
- [x] **Automated Tests**: 17 unit tests passing with Vitest.
- [x] **Submission Size**: Repository size is under 1 MB (excluding node_modules/dist), well below the 10 MB limit.
