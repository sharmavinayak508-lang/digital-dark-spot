DIGITAL DARK SPOT

Find what your sources leave out.

COMPLETE PROJECT DOCUMENTATION

Product overview • Features • Screenshots • Setup • Deployment • Security

DEPLOYMENT LINK
  https://sharmavinayak508-lang.github.io/digital-dark-spot/

Contents

1. Project Overview  

2. Product Screenshots

3. Key Features

4. How It Works

5. Application Modules

6. Technology Stack

7. Project Structure

8. Installation and Local Setup

9. Demo Credentials

10. Deployment with GitHub Pages

11. Optional AI Summary Proxy

12. Privacy and Security

13. Limitations

14. Testing

15. Roadmap

16. Contributing

17. License

1. Project Overview

Digital Dark Spot is an AI-assisted information gap detector designed to help users identify missing details, vague wording, and potentially conflicting claims in source material. Users can provide a question and add text or documents; the application highlights areas that may deserve further review before a decision is made.

The problem it addresses

Missing information — important details may not be stated in the source.

Vague language — phrases such as “up to”, “may”, or “subject to approval” can hide conditions.

Conflicting claims — multiple sources may present inconsistent details.

Unclear obligations — deadlines, eligibility criteria, fees, and post-award requirements may need clarification.

The platform supports careful review and better questions. It does not replace official sources, professional advice, or independent verification.

2. Product Screenshots

The following screenshots were supplied for this documentation and are embedded directly in this Word document.
<img width="1359" height="641" alt="image" src="https://github.com/user-attachments/assets/6ed97f0d-b8a4-4c34-9412-d1a821226981" />
<img width="1345" height="641" alt="image" src="https://github.com/user-attachments/assets/4babe8fe-682b-4891-bdd0-4881c37ae53c" />
<img width="1330" height="633" alt="image" src="https://github.com/user-attachments/assets/d8bf124f-26bd-4ebc-a0a6-299be1c9ed5c" />
<img width="1330" height="633" alt="image" src="https://github.com/user-attachments/assets/83b256b1-cbb3-4dfc-8ab2-4d2743b87fbf" />
3. Key Features

Feature

Description

Information-gap detection

Highlights potentially missing details and incomplete statements.

Conflict finder

Helps surface claims that may disagree across supplied sources.

Gap score

Provides a compact indication of detected gaps for review.

Source-aware findings

Distinguishes sourced content, inferred observations, and uncertain wording.

Insight Studio

Combines analysis insights, heatmap, conflicts, checklist, and report export.

Document input

Supports adding text and selected document formats.

PDF / OCR workflow

Supports PDF and OCR-assisted text extraction through browser-loaded libraries.

Optional AI summary

Connects to a user-configured AI endpoint or proxy for an additional summary.

Bilingual interface

Provides English and Hindi language options.

Visual themes

Includes Midnight, Daylight, and Aurora themes.

4. How It Works

Define your question — describe what you need to verify or understand.

Add source material — upload supported files or paste text from pages and documents.

Review the analysis — inspect possible gaps, vague wording, and claims that may conflict.

Check the evidence — return to the original source and verify important findings.

Decide what to ask next — use the checklist and report to guide follow-up questions.

Important: A detected gap is a prompt for further investigation, not proof that information is false or intentionally hidden.

5. Application Modules

Page / Module

Purpose

login.html

Demo sign-in screen and demo credentials.

home.html

Product landing page and navigation.

index.html

Main Analyzer experience.

studio.html

Insight Studio: scores, heatmap, conflicts, checklist, and report export.

about.html

Project background, methodology, privacy, roadmap, and team details.

tests.html

In-browser tests for analysis logic.

analysis.js

Rule-based analysis logic.

studio.js

Insight Studio interactions and presentation.

auth.js

Demo authentication behavior.

site.js

Shared site behavior and interface utilities.

theme.css

Shared styling and visual themes.

worker/worker.js

Optional Cloudflare Worker proxy for AI requests.

sw.js

Service worker for supported offline/install behavior.

6. Technology Stack

Frontend: HTML5, CSS3, and JavaScript.

Analysis: browser-based, rule-driven JavaScript.

Document processing: PDF and OCR libraries loaded from a CDN.

Optional AI integration: configurable external endpoint or Cloudflare Worker proxy.

Hosting: GitHub Pages.

Deployment automation: GitHub Actions.
7. Project Structure

digital-dark-spot/
├── .github/
│   └── workflows/               # GitHub Actions deployment
├── worker/
│   └── worker.js                # Optional AI proxy
├── docs/
│   └── screenshots/
│       ├── 01-login.png
│       ├── 02-home-english.png
│       ├── 03-home-hindi.png
│       ├── 04-analyzer.png
│       └── 05-project-files.png
├── about.html
├── analysis.js
├── auth.js
├── home.html
├── icon.svg
├── index.html
├── login.html
├── manifest.webmanifest
├── site.js
├── studio.html
├── studio.js
├── sw.js
├── tests.html
├── theme.css
├── LICENSE
└── README.md

This structure reflects the files shown in the supplied project snapshot. Update the structure if the repository changes.

Visual Themes

Midnight — dark, low-glare interface.

Daylight — light interface.

Aurora — dark interface with teal and blue accents.

8. Installation and Local Setup

Requirements

A modern browser (Chrome, Edge, Firefox, or Safari).

Python 3 for running a local development server (recommended).

Internet access for CDN-hosted PDF/OCR libraries and optional remote AI features.

Option 1 — Open directly

Download or clone the repository.

Open login.html in your browser.

Sign in using the demo credentials in the next section.

Option 2 — Run a local server

git clone https://github.com/<username>/<repo>.git
cd <repo>
python3 -m http.server 8000

Open the following address in your browser:

http://localhost:8000/login.html

A local server is recommended, especially for service-worker and install/offline behavior.

9. Demo Credentials

Field

Demo value

Username

demo

Password

dark2026

Security note: These credentials are for demonstration only. The current login is not a production authentication system.

10. Deployment with GitHub Pages

Push the project to the main branch of your GitHub repository.

Open Settings → Pages.

Set the deployment source to GitHub Actions.

Confirm the workflow in .github/workflows/ is configured and enabled.

Wait for the workflow to complete and open your GitHub Pages URL.

Demo login URL:

https://<username>.github.io/<repo>/login.html

Replace <username> and <repo> with your GitHub username and repository name.

11. Optional AI Summary Proxy

The optional AI summary can use a proxy so the provider API key is not exposed in browser-side code.

Cloudflare Worker setup

Create or sign in to a Cloudflare account.

Open Workers & Pages and create a Worker.

Paste the contents of worker/worker.js into the Worker editor and deploy it.

Open Settings → Variables and Secrets.

Add API_KEY as a secret containing your provider API key.

Configure optional variables if required by the Worker: UPSTREAM_URL, MODEL, and ALLOWED_ORIGIN.

Copy the deployed Worker URL.

In Insight Studio, select My own proxy server, paste the Worker URL, and leave the client-side key field empty.

Security recommendations

Never commit API keys or secrets to Git.

Store provider credentials as Worker secrets.

Restrict allowed origins where supported.

Apply rate limits and usage controls before exposing a public endpoint.

Review the provider’s data-retention policy before sending source text.

12. Privacy and Security

Core rule-based analysis runs in the browser.

Optional AI features send text to the endpoint configured by the user.

Review the remote AI provider’s privacy and retention terms before submitting confidential material.

The demo login is not designed to protect real accounts or sensitive data.

PDF and OCR libraries are loaded from a CDN and require internet access.

Data caution: Avoid uploading confidential, personal, financial, legal, or otherwise sensitive documents to a demo deployment unless you have reviewed and accepted the relevant data-handling arrangements.

13. Limitations

Analysis is rule-based and does not independently establish whether a claim is true.

A highlighted gap, conflict, or hedge is a possible issue that requires human review.

Results depend on the quality, completeness, and context of the supplied source material.

Demo authentication is not production-grade.

Optional AI features depend on the configured endpoint, model, and provider availability.

PDF/OCR functionality relies on external libraries loaded from a CDN.

The application is not a substitute for legal, financial, medical, academic, or other professional advice.

14. Testing

Run the local server and open the test page:

http://localhost:8000/tests.html

The page runs the in-browser tests for the analysis logic. Re-run tests after changing analysis.js or related behavior.

15. Roadmap

Stronger source comparison and evidence traceability.

Additional document formats and improved extraction quality.

Configurable analysis rules for different use cases.

Production authentication and user management.

Server-side AI controls, rate limiting, and auditability.

Expanded automated tests and accessibility checks.

16. Contributing

Contributions, bug reports, and practical suggestions are welcome.

Fork the repository.

Create a feature branch.

Make your changes and test them in a browser.

Commit your work with a clear message.

Push your branch and open a Pull Request with a summary and screenshots where relevant.

git checkout -b feature/your-feature
git commit -m "Add: describe your change"

17. License

This project includes a LICENSE file. Review it for the applicable terms before using, modifying, or distributing the project.






