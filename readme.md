# AI Investment Research Agent

> An intelligent agent that researches any company and delivers a data-backed **Invest / Pass** verdict with full reasoning — built for the InsideIIM × Altuni AI Labs internship assignment.

---

## Overview

The AI Investment Research Agent takes a company name as input, autonomously gathers and analyses relevant information across multiple dimensions, and produces a structured investment recommendation. The agent mimics the workflow of an early-stage equity analyst: it researches, scores, and reasons — then commits to a clear decision.

**What it does:**

- Accepts a company name from a clean React UI
- Triggers a multi-step LangChain agent on the Node.js backend that uses web search to pull live data
- Evaluates the company across key investment axes: business model, financials, competitive moat, growth trajectory, risk factors, and market sentiment
- Generates a structured report with a final **INVEST ** or **PASS** verdict and a confidence score
- Streams the analysis back to the UI in real time

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite) |
| Backend | Node.js + Express |
| AI / Agent | LangChain.js with OpenAI (GPT-4o) |
| Search Tool | Tavily Search API (real-time web search) |
| Deployment | Vercel (monorepo via `vercel.json`) |

---

## How to Run

### Prerequisites

- Node.js v18+
- npm v9+
- An OpenAI API key
- A Tavily API key (free tier at [tavily.com](https://tavily.com))

### 1. Clone the repo

```bash
git clone https://github.com/Shrayash-hub/InsideIIMProject.git
cd InsideIIMProject
```

### 2. Set up environment variables

Create a `.env` file inside the `server/` directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
PORT=5000
```

### 3. Install dependencies

```bash
# Root dependencies
npm install

# Server dependencies
cd server && npm install && cd ..

# Client dependencies
cd client && npm install && cd ..
```

### 4. Run locally (development)

Open two terminals:

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

The app will be available at `http://localhost:5173` (Vite default).

### 5. Deploy to Vercel

```bash
npm install -g vercel
vercel
```

> Note: This repository is configured to use `npm@9` on Vercel via the root `package.json` `packageManager` field.
> Vercel will install the client build dependencies on Linux and use the root monorepo lockfile.

The `vercel.json` at the root configures routing so the `/api` path is served by the Node backend and everything else by the React client.

---

## How It Works — Architecture

```
User enters company name
        │
        ▼
   React Client (client/)
        │  POST /api/analyze
        ▼
   Express Server (server/)
        │
        ▼
   LangChain Agent (LangGraph-style ReAct loop)
        │
        ├── Tool: Tavily Web Search
        │     ├── Search 1: "[Company] business model revenue"
        │     ├── Search 2: "[Company] financials funding valuation"
        │     ├── Search 3: "[Company] competitors market position"
        │     ├── Search 4: "[Company] recent news risks"
        │     └── Search 5: "[Company] growth metrics 2024 2025"
        │
        ▼
   LLM Synthesis (GPT-4o)
        │  Structured prompt → JSON output
        ▼
   Investment Report
        ├── Executive Summary
        ├── Business Model Score (0-10)
        ├── Financial Health Score (0-10)
        ├── Competitive Moat Score (0-10)
        ├── Growth Potential Score (0-10)
        ├── Risk Score (0-10, lower = riskier)
        ├── Overall Confidence Score
        └── Verdict: INVEST or PASS
        │
        ▼
   Response streamed back to React UI
```

The agent uses a **ReAct (Reasoning + Acting)** loop: it decides which searches to run based on what it learns, rather than firing a fixed set of queries. This means it can dig deeper into a particular angle (e.g. regulatory risk) if early results flag it as relevant.

---

## Key Decisions & Trade-offs

### What I chose

**LangChain.js + Tavily over a single LLM call**
A single prompt asking GPT-4o about a company would hit the knowledge cutoff and hallucinate recent financials. Using Tavily gives the agent access to live web data, making verdicts grounded in current reality.

**ReAct agent loop over a fixed pipeline**
A hardcoded sequence of 5 searches is simpler but brittle — a startup needs different research than a listed conglomerate. The ReAct pattern lets the agent adapt its research strategy dynamically.

**Structured JSON output with explicit scoring rubric**
Asking the LLM to return a free-form essay is hard to render consistently. Enforcing a JSON schema (via a system prompt contract) lets the frontend display scores, charts, and the verdict cleanly.

**Monorepo with Vercel routing**
Keeping client and server in one repo simplifies deployment. `vercel.json` rewrites `/api/*` to the serverless Node functions in `api/`, while the React build serves everything else.

### What I left out (and why)

**PDF / filing ingestion** — Parsing 10-Ks or DRHP documents would significantly improve financial analysis but adds complexity (PDF parsing, chunking, vector store). Noted as a future improvement.

**User authentication / history** — Out of scope for the assignment; the agent is stateless per session.

**Streaming token-by-token** — The current implementation sends the full response once complete. True streaming (SSE / WebSockets) would feel faster but added implementation time.

**Caching** — Repeated queries on the same company re-run all searches. Redis caching with a TTL would reduce latency and API costs.

---

## Example Runs

### 1. Zepto (Indian quick-commerce startup)

```
Verdict: INVEST   |  Confidence: 72%

Business Model:   8/10  Fast-commerce with dark store model, strong unit economics trend
Financial Health: 6/10  Not yet profitable; revenue growing 140% YoY as of FY24
Competitive Moat: 7/10  10-minute delivery is a defensible habit; faces Blinkit & Swiggy Instamart
Growth Potential: 9/10  Indian grocery TAM is massive; category penetration still <5%
Risk Score:       5/10  Burn rate, VC dependency, thin margins in grocery

Summary: Zepto's hypergrowth and recent profitability push in select cities make it a compelling
bet on India's quick-commerce megatrend, despite execution risk.
```

---

### 2. WeWork

```
Verdict: PASS   |  Confidence: 85%

Business Model:   4/10  Long-lease / short-sublease model structurally fragile
Financial Health: 2/10  Filed for Chapter 11 bankruptcy (Oct 2023); massive debt overhang
Competitive Moat: 3/10  Brand damaged; IWG / Regus offer similar product with sounder finances
Growth Potential: 3/10  Hybrid work tailwind is real but WeWork can't capitalise post-restructuring
Risk Score:       1/10  Existential financial and operational risk

Summary: Despite the flexible-work tailwind, WeWork's structural cost model and bankruptcy
history make it uninvestable at this time.
```

---

### 3. NVIDIA

```
Verdict: INVEST   |  Confidence: 91%

Business Model:   10/10  GPU + CUDA ecosystem lock-in; data centre now largest segment
Financial Health: 10/10  Revenue $60B+ TTM, 55%+ net margins, virtually debt-free
Competitive Moat: 9/10  CUDA developer moat of 15+ years; AMD and Intel years behind
Growth Potential: 9/10  AI infrastructure spend accelerating; sovereign AI wave just beginning
Risk Score:       7/10  Valuation risk, export controls, customer concentration (hyperscalers)

Summary: NVIDIA's combination of monopoly-like AI chip positioning and compounding software
moat makes it one of the strongest investment theses in the current cycle.
```

---

## What I Would Improve With More Time

1. **Streaming responses** — Use Server-Sent Events to push each reasoning step to the UI as the agent works, improving perceived speed.

2. **Financial filing ingestion** — Integrate with SEC EDGAR (for US companies) or BSE/NSE APIs (for Indian companies) to pull actual balance sheet data rather than relying on web snippets.

3. **Comparable company analysis** — Auto-identify 3–5 peers and score the target company relative to them (P/E, EV/EBITDA, growth multiples).

4. **Persistent report history** — Store past analyses in a database so users can compare a company's investment thesis over time.

5. **Source citations in UI** — Show which URLs informed each section of the report, improving trust and auditability.

6. **Confidence calibration** — Fine-tune scoring weights based on company stage (pre-revenue startup vs. listed company vs. PE-backed firm).

7. **Export to PDF** — Let users download the full investment memo as a formatted PDF.

---

## Project Structure

```
InsideIIMProject/
├── client/          # React frontend (Vite)
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   └── ...
│   └── package.json
├── server/          # Express backend + LangChain agent
│   ├── index.js
│   ├── agent/
│   │   └── researchAgent.js
│   └── package.json
├── api/             # Vercel serverless functions
├── vercel.json      # Monorepo routing config
├── package.json
└── README.md
```

---

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `OPENAI_API_KEY` | ✅ | OpenAI API key (GPT-4o) |
| `TAVILY_API_KEY` | ✅ | Tavily search API key |
| `PORT` | ❌ | Server port (default: 5000) |

---

## Author

**Shrayash Awasthi**
AI Product Development Engineer Intern Assignment — InsideIIM × Altuni AI Labs