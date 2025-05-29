# ATS Challenge App

A modern ATS (Applicant Tracking System) that helps recruiters efficiently process and evaluate candidate resumes using AI.

## Features

- AI-powered resume parsing and analysis
- Candidate ranking and filtering
- Experience-based sorting
- Modern, responsive UI
- Real-time processing

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- TailwindCSS
- OpenAI API
- Google AI API (Gemini)

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/Athirstyowl/ATS-Challenge-App.git
cd ATS-Challenge-App
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Then edit `.env.local` and add your API keys.

4. Run the development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing

Run the test suite:
```bash
pnpm test
```

## Deployment

The application is deployed on Vercel and can be accessed at: [Add your deployment URL here]

## Project Structure

```
ats-challenge/
├── app/              # Next.js app directory
├── components/       # React components
├── lib/             # Utility functions and API clients
├── public/          # Static assets
└── tests/           # Test files
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

# ATS Challenge — “Watch the ATS Think”

*A mini coding exercise that shows off front‑end polish, back‑end logic, and a transparent agent loop.*

## 1 · Scenario

You ship a tiny **Next.js** site that:

1. **Pre‑loads a CSV** — `candidates.csv` (≈ 50 dummy rows)

   ```csv
   id,full_name,title,location,years_experience,skills,availability_weeks,willing_to_relocate,etc.
   ```

2. Displays a **chat box** for recruiters to type natural‑language queries such as:

   > Backend engineers in Germany, most experience first.

3. Runs an explicit **MCP loop** (Think → Act → Act → Speak) to

   * **filter** the dataset
   * **rank** the subset
   * **stream every step** to the UI with smooth animations

The assistant is nick‑named **ATS‑Lite**.

## 2 · Required Tools (pure JavaScript)

| Tool                        | Signature                                         | Purpose                            |
| --------------------------- | ------------------------------------------------- | ---------------------------------- |
| `filterCandidates(plan)`    | `{ include?, exclude? } → Candidate[]`            | Boolean / regex / ≥ filtering      |
| `rankCandidates(ids, plan)` | `{ primary, tie_breakers? } → Candidate[]`        | Scores & sorts the filtered subset |
| `aggregateStats(ids)`[^1]   | `ids[] → { count, avg_experience, top_skills[] }` | Quick stats for richer replies     |

All tools are *synchronous* – no DB or external I/O.

[^1]: Optional, but helpful for richer assistant summaries.

## 3 · MCP Workflow

1. **THINK** – The LLM receives the user message **plus** the CSV header row and replies *only* with JSON:

   ```json
   {
     "filter": { /* FilterPlan */ },
     "rank":   { /* RankingPlan */ }
   }
   ```

2. **ACT 1** – Front‑end calls `filterCandidates(filterPlan)`

3. **ACT 2** – Front‑end calls `rankCandidates(ids, rankingPlan)`

4. **SPEAK** – Front‑end calls the LLM again, passing the **top 5 rows** to generate a recruiter‑friendly summary

Each phase emits an event that surfaces live in the UI.

## 4 · UI & Animation Requirements

| Area                 | Must‑have                                                                                                                           | Library ideas                     |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| **Chat panel**       | Stream assistant tokens as they arrive                                                                                              | Tailwind, `react-virtual`         |
| **Timeline sidebar** | Collapsible panel that reveals, one line at a time: 1️⃣ filter plan JSON → 2️⃣ match count → 3️⃣ ranking plan JSON → 4️⃣ ranked IDs | `framer-motion` (stagger / slide) |
| **Result table**     | Always shows the **current ranked subset**; when rows change or reorder, they **animate** into place                                | `framer-motion` layout / FLIP     |
| Loading cues         | Progress bar or shimmer while the agent works                                                                                       | `nprogress` or custom             |
| Row details          | Click a row → side panel with full candidate JSON                                                                                   | —                                 |

## 5 · Example Flow

```text
You: Backend engineers in Germany, most experience first.

Timeline ▶
1️⃣ filter plan ready
2️⃣ 7 rows matched
3️⃣ ranking plan ready
4️⃣ ranked IDs [14, 5, 22, …]   ← lines fade‑in one by one

Result table slides into new order.

ATS‑Lite: I found 7 matches (avg 6.1 yrs). Here are the top three…
```

## 6 · Deliverables

* **Git repo** with clean commits & a clear `README.md` (`pnpm install && pnpm dev`)
* **`.env.example`** for the OpenAI key
* **One Jest test**
  *Input:* *React dev, Cyprus, sort by experience desc*
  *Expectation:* candidate **#12** appears above **#5**
* **Links** — provide both (a) the GitHub repository URL and (b) a live deployment link (e.g., Vercel, Netlify)

## 7 · Evaluation Criteria

* **Agent transparency** – each MCP phase surfaced in order
* **Prompt robustness** – LLM reliably emits valid JSON; graceful retry on errors
* **Animation & UX** – timeline staggers, rows re‑flow without jank; keyboard shortcut (⌘ + Enter) to send
* **Code quality** – modular data helpers, tidy state (Context/Zustand), minimal globals
* **Docs & tests** – quick start, clear tool contracts, meaningful test coverage

---

### Keep It Small 📎

No auth, no uploads, no database — just a CSV in memory, two synchronous tools, two LLM calls, and a polished UI that lets reviewers **watch the ATS think** in real time.
