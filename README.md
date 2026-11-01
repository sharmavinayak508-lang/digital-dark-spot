# Digital Dark Spot - AI Assisted Information Gap Detection

Find what your sources leave out: missing deadlines, vague wording and facts that disagree.

**Live demo:** `https://<username>.github.io/<repo>/login.html`
**Demo login:** username `demo`, password `dark2026`

## Pages
| Page | What it does |
|---|---|
| `login.html` | Demo sign-in (credentials shown under the form) |
| `home.html` | Landing page and project slides |
| `index.html` | Original analyzer (`app.js`, `engine.js`) |
| `studio.html` | Insight Studio: score, heatmap, conflicts, checklist, report export, PDF/OCR upload, optional AI summary |
| `about.html` | Problem, method, privacy, roadmap, team |
| `tests.html` | In-browser tests for `analysis.js` |

Styling is fully self-contained in `theme.css` (three themes: Midnight, Daylight, Aurora), so `style.css` is no longer needed.

## Run locally
Open `login.html`, or run `python3 -m http.server` and visit `localhost:8000/login.html` (needed for install/offline mode).

## Deploy
Push to `main`, then Settings > Pages > Source: GitHub Actions. The workflow in `.github/workflows` deploys it.

## Notes and limits
- Login is a **demo only**. For real accounts use Firebase Auth or Supabase.
- Analysis is rule-based and runs in the browser. Findings are possible gaps, not verified facts.
- The optional AI box sends text to the endpoint you enter, using a key you type in. Production apps should proxy this through a server.
- PDF and OCR use libraries loaded from a CDN, so they need internet.

## Free AI without exposing your key (Cloudflare Worker)
1. Create a free Cloudflare account, then Workers > Create Worker, and paste `worker/worker.js`.
2. Settings > Variables and Secrets: add a secret `API_KEY` (your Groq, Gemini or OpenRouter key). Optional: `UPSTREAM_URL`, `MODEL`, `ALLOWED_ORIGIN` (your GitHub Pages address).
3. In Studio, choose "My own proxy server", paste the Worker URL, leave the key empty.
