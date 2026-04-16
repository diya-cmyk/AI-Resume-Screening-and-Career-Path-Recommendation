# CareerLens — AI Resume Screener & Career Path Platform

A complete multi-page web application for AI-powered resume analysis, skill extraction, role matching, and learning roadmap generation.

## Pages

| Page | File | Description |
|------|------|-------------|
| Home | `index.html` | Landing page with features, how-it-works, CTA |
| Login | `pages/login.html` | Email/password login with validation |
| Register | `pages/register.html` | Sign-up with password strength meter |
| Analyze | `pages/analyze.html` | Resume upload + AI analysis trigger |
| Skills | `pages/skills.html` | Extracted skills with proficiency bars |
| Roles | `pages/roles.html` | Career role matches with fit scores |
| Roadmap | `pages/roadmap.html` | Week-by-week learning roadmap |

## Quick Start

### 1. Get an Anthropic API Key
Sign up at: https://console.anthropic.com

### 2. Open the app
Open `index.html` in a browser, or use a local server:

```bash
# Python
python -m http.server 3000

# Node.js
npx serve .
```

Then visit: http://localhost:3000

### 3. Register & Login
- Click "Sign Up" → create a free account (stored in localStorage)
- Login with your credentials

### 4. Analyze
- Go to **Analyze** page
- Paste resume text or upload a file
- Enter your Anthropic API key (stored locally, never sent to our servers)
- Click **Analyze Resume**

## Tech Stack
- Pure HTML5, CSS3, Vanilla JavaScript (no frameworks)
- Google Fonts: Fraunces (display) + Plus Jakarta Sans (body)
- Anthropic Claude API (`claude-sonnet-4-20250514`)
- localStorage for auth, analysis data, and progress

## Project Structure

```
careerlens/
├── index.html              ← Home / landing page
├── css/
│   ├── shared.css          ← Design tokens, navbar, utilities
│   ├── home.css            ← Landing page styles
│   ├── auth.css            ← Login + Register styles
│   └── pages.css           ← Inner page styles (analyze, skills, roles, roadmap)
├── js/
│   └── shared.js           ← Auth, routing, toast, AnalysisStore utilities
└── pages/
    ├── login.html          ← Login form
    ├── register.html       ← Registration form
    ├── analyze.html        ← Resume upload & API call
    ├── skills.html         ← Skill extraction results
    ├── roles.html          ← Career role matches
    └── roadmap.html        ← Learning roadmap

```

## Features

### Auth System
- Register/login with email + password (localStorage)
- Session persists across page loads
- Auth guard on protected pages (auto-redirect to login)

### Resume Analysis (AI)
- Upload PDF/TXT/DOCX or paste text
- Claude AI returns structured JSON with:
  - Extracted skills (technical, tools, soft) with proficiency %
  - Overall fit score (0–100)
  - 3 matched career roles with fit % and salary range
  - Missing skills per role
  - 6-step learning roadmap with priority levels

### Roadmap
- Interactive progress tracking (mark steps complete)
- Priority-coded steps (high/medium/low)
- Direct links to Coursera courses and LinkedIn jobs

## Notes
- All data is stored in the browser (localStorage)
- No backend required
- The API key is stored locally and used only in the browser
