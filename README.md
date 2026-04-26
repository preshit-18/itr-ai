# 🇮🇳 ITR Advisor India

An AI-powered Income Tax Return form selector for India. Recommends the correct ITR form (ITR-1 to ITR-7) based on your financial profile with a full tax estimate and step-by-step filing guide.

---

## ✨ Features

- **7-form coverage** — ITR-1 (Sahaj) through ITR-7
- **AI-powered analysis** — Claude, Gemini, or GPT-4o
- **Pre-screening engine** — rule-based logic for fast preliminary answers
- **Tax estimate** — calculates under old and new regime with surcharge & cess
- **Step-by-step filing guide** — personalised based on your profile
- **Document checklist** — everything you need before filing
- **Follow-up chat** — ask questions about your specific situation
- **First-time filer mode** — extra guidance for beginners
- **FY 2024-25 rules** — updated for Budget 2024

---

## 🚀 Quick Start

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd itr-advisor
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add at least **one** AI provider API key:

```env
# Choose at least one:
ANTHROPIC_API_KEY=sk-ant-...         # Claude (recommended)
GEMINI_API_KEY=AIza...               # Google Gemini
OPENAI_API_KEY=sk-...                # OpenAI GPT-4o

DEFAULT_AI_PROVIDER=claude
```

**Getting API keys:**
| Provider | URL |
|----------|-----|
| Claude (Anthropic) | https://console.anthropic.com |
| Gemini (Google) | https://aistudio.google.com/app/apikey |
| GPT-4o (OpenAI) | https://platform.openai.com/api-keys |

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🗂️ Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── analyze/route.ts      # ITR analysis endpoint
│   │   └── chat/route.ts         # Follow-up chat endpoint
│   ├── wizard/page.tsx           # Wizard route
│   ├── globals.css               # Design system & fonts
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
├── components/
│   ├── wizard/
│   │   ├── WizardClient.tsx      # Main wizard with step management
│   │   └── steps/
│   │       ├── StepPersonal.tsx  # Step 1: Personal info
│   │       ├── StepIncome.tsx    # Step 2: Income sources
│   │       ├── StepSpecial.tsx   # Step 3: Special scenarios
│   │       ├── StepDeductions.tsx# Step 4: Deductions & tax paid
│   │       └── StepReview.tsx    # Step 5: Review & trigger AI
│   └── results/
│       ├── ResultsPanel.tsx      # Results dashboard with tabs
│       └── ChatAssistant.tsx     # Streaming chat interface
├── data/
│   └── itr-data.ts               # ITR form data, rules & tax calcs
├── lib/
│   ├── ai-providers.ts           # Claude / Gemini / OpenAI abstraction
│   └── utils.ts                  # Helper utilities
└── types/
    └── index.ts                  # TypeScript type definitions
```

---

## 🔧 Architecture Overview

### User Flow

```
Landing Page → Wizard (5 steps) → AI Analysis → Results Dashboard
                                                     ├── Analysis tab
                                                     ├── Tax Estimate tab
                                                     ├── Filing Guide tab
                                                     └── AI Chat tab
```

### AI Layer

1. **Pre-screening** (`preScreenITRForm`) — deterministic rule engine handles ~70% of clear-cut cases instantly
2. **Prompt builder** (`buildUserPrompt`) — assembles structured user data into a rich prompt
3. **System prompt** (`buildSystemPrompt`) — encodes all ITR eligibility rules and FY 2024-25 tax slabs
4. **Provider routing** — routes to Claude / Gemini / OpenAI with automatic fallback
5. **Response parser** — extracts structured JSON from AI response

### ITR Forms Covered

| Form | Name | For |
|------|------|-----|
| ITR-1 | Sahaj | Salaried resident individuals, income ≤ ₹50L |
| ITR-2 | — | Individuals/HUF with capital gains, foreign assets |
| ITR-3 | — | Business/profession income for individuals/HUF |
| ITR-4 | Sugam | Presumptive taxation (Sec 44AD/44ADA/44AE) |
| ITR-5 | — | Firms, LLPs, AOPs, BOIs |
| ITR-6 | — | Companies |
| ITR-7 | — | Trusts, political parties, institutions |

---

## 🎨 Design System

- **Font**: Playfair Display (headings) + DM Sans (body) + DM Mono (numbers)
- **Primary color**: Saffron `#ff7c0a` — inspired by the Indian flag
- **Palette**: Ink (dark), Paper (background), Jade (success), Crimson (error)
- **No external UI library** — all components are hand-crafted in inline CSS

---

## 🔌 Extending the App

### Add a new AI provider

1. Add your API call function in `src/lib/ai-providers.ts`
2. Add the new provider to the `AIProvider` type in `src/types/index.ts`
3. Add it to the `AI_PROVIDERS` array in `StepReview.tsx`
4. Add it to the gateway switch in `analyzeITR()`

### Update ITR rules

Edit `src/data/itr-data.ts`:
- `ITR_FORMS` — form descriptions and eligibility
- `preScreenITRForm` — deterministic pre-screening rules
- `buildSystemPrompt` in `ai-providers.ts` — AI system instructions

### Add a new wizard step

1. Create the step component in `src/components/wizard/steps/`
2. Add it to `WIZARD_STEPS` in `src/data/itr-data.ts`
3. Add the case to `renderStep()` in `WizardClient.tsx`
4. Add required fields to the `WizardFormData` type

---

## 📦 Deployment

### Vercel (recommended)

```bash
npm i -g vercel
vercel
```

Add environment variables in Vercel dashboard:
- `ANTHROPIC_API_KEY`
- `GEMINI_API_KEY` (optional)
- `OPENAI_API_KEY` (optional)
- `DEFAULT_AI_PROVIDER=claude`

### Self-hosted

```bash
npm run build
npm start
```

---

## ⚠️ Legal Disclaimer

This tool provides **general guidance only** based on publicly available tax laws. It is **not** a substitute for professional advice from a qualified Chartered Accountant. Always verify your ITR form and tax calculation on the official [Income Tax portal](https://www.incometax.gov.in) or consult a CA before filing.

---

## 📄 License

MIT — free to use and modify for personal and commercial projects.
