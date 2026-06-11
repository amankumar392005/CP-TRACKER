#  CP Tracker AI

A full-stack Competitive Programming Analytics Platform that combines Codeforces and LeetCode data into a single intelligent dashboard. Track progress, analyze performance, compare users, set goals, and receive AI-powered coaching using real-time competitive programming data.

---

##  Features

###  Authentication
- Google OAuth Authentication
- Email & Password Authentication
- Protected Routes
- Session Persistence
- Secure User Management via Supabase

###  Analytics Dashboard
- Real Codeforces Analytics
- Real LeetCode Analytics
- Rating History Visualization
- Contest Performance Tracking
- Problem Solving Statistics
- Topic-wise Analysis
- Difficulty Breakdown
- Daily & Weekly Activity Tracking

###  AI Coach
- Personalized Performance Analysis
- Weak Topic Detection
- Smart Practice Recommendations
- Contest Preparation Suggestions
- Dynamic Improvement Insights
- Powered by Gemini 1.5 Flash

###  User Comparison
- Codeforces vs Codeforces
- LeetCode vs LeetCode
- Codeforces vs LeetCode
- Side-by-Side Analytics
- Rating & Performance Comparison
- Topic Strength Analysis

###  Goal Management
- Daily Goals
- Weekly Goals
- Monthly Goals
- Progress Tracking
- Goal Persistence using Supabase

###  Productivity Tools
- Notes Management
- Problem Bookmarks
- Full CRUD Operations
- Cloud Synchronization

###  Profile Management
- Handle Verification
- Platform Linking
- Profile Customization
- Settings Management

---

##  Tech Stack

| Layer | Technology |
|---------|------------|
| Frontend | React 18 |
| Language | TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Authentication | Supabase Auth |
| Database | PostgreSQL (Supabase) |
| Backend | Supabase Edge Functions |
| AI | Google Gemini 1.5 Flash |
| Codeforces Data | Codeforces Public API |
| LeetCode Data | LeetCode GraphQL |
| Deployment | Vercel + Supabase |

---

#  Project Structure

```text
cptracker/
│
├── src/
│   ├── assets/                 # Images, icons, static assets
│   ├── components/             # Reusable UI components
│   ├── context/                # React Context Providers
│   ├── data/                   # Static configs and constants
│   ├── lib/                    # Utility functions and helpers
│   ├── pages/                  # Application pages/routes
│   ├── services/               # API and business logic
│   │
│   ├── App.tsx                 # Main App component
│   ├── main.tsx                # React entry point
│   ├── index.css               # Global styles
│   └── vite-env.d.ts
│
├── supabase/
│   │
│   ├── functions/
│   │   ├── ai-coach/           # Gemini AI Coach Edge Function
│   │   ├── cf-proxy/           # Codeforces API Proxy
│   │   └── lc-proxy/           # LeetCode API Proxy
│   │
│   ├── .temp/
│   └── schema.sql              # Database Schema
│
├── .env                        # Environment Variables
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.js
├── tailwind.config.js
│
├── README.md
├── SETUP.md
│
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
│
└── vite.config.ts
```

---

#  Architecture Overview

```text
User
 │
 ▼
React Frontend
 │
 ├── Authentication
 │      ▼
 │   Supabase Auth
 │
 ├── Dashboard
 │      ▼
 │   API Services
 │
 ├── AI Coach
 │      ▼
 │   Supabase Edge Function
 │      ▼
 │   Gemini 1.5 Flash
 │
 ├── Codeforces Data
 │      ▼
 │   CF Proxy Function
 │      ▼
 │   Codeforces API
 │
 └── LeetCode Data
        ▼
     LC Proxy Function
        ▼
     LeetCode GraphQL
```

---

#  Supported Analytics

## Codeforces

- Current Rating
- Maximum Rating
- Rank
- Maximum Rank
- Contest History
- Rating Change Graph
- Problem Tags Analysis
- Solving Streaks
- Contest Performance Metrics

## LeetCode

- Problems Solved
- Easy / Medium / Hard Breakdown
- Contest Rating
- Global Ranking
- Topic Analysis
- Submission Statistics
- Acceptance Rate
- Contest Performance

---

#  AI Coach Workflow

1. Fetch User Statistics
2. Analyze Recent Activity
3. Detect Weak Areas
4. Generate Recommendations
5. Create Personalized Improvement Plan
6. Suggest Relevant Problems
7. Track Progress Over Time

---

#  Environment Variables

Create a `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_url

VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

VITE_GEMINI_API_KEY=your_gemini_api_key
```

---

#  Local Development

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

### Build Project

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

#  Database Setup

Execute:

```sql
supabase/schema.sql
```

inside your Supabase SQL Editor.

This creates:

- User Profiles
- Goals
- Notes
- Bookmarks
- Settings
- Required RLS Policies

---

#  Deployment

### Frontend

Deploy on:

- Vercel
- Netlify

### Backend

Deploy using:

- Supabase Edge Functions

Required Functions:

- ai-coach
- cf-proxy
- lc-proxy

---

#  Security Features

- Row Level Security (RLS)
- JWT Authentication
- Protected API Routes
- Secure Environment Variables
- OAuth Integration
- User Data Isolation

---

#  Future Enhancements

- Contest Calendar
- Virtual Contest Tracking
- Friend Leaderboards
- CP Roadmaps
- Team Comparisons
- Rating Prediction AI
- Advanced Topic Heatmaps
- Mobile Application

---

#  Author

Aman Kumar
CSE Student at IIT PATNA

CP Tracker AI — Analyze. Improve. Dominate.
