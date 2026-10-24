# Aegis Security Dashboard — Interactive Demo

A complete **React + TypeScript + Tailwind CSS v4 + Vite** frontend demo inspired by the four provided screen references. No backend, GitHub authentication, or real security scanning is involved.

## Run locally

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Visit the URL displayed by Vite (usually `http://localhost:5173`). To test a production build:

```bash
npm run build
npm run preview
```

## Demo journey

1. Login screen: enter any email and nonempty password, or click **Sign In With GitHub** (mock login only).
2. Setup screen: toggle security agents, edit the repository URL and optional context, and click **Start analysis**.
3. Processing screen: progress updates automatically. Click **Skip to report** to advance immediately; scanning is simulated.
4. Report screen: expand/collapse findings, copy the sample code, download a text summary, or mark findings reviewed.
5. Sidebar: search stored analyses, navigate sample reports, create new runs, or log out.

Login status and analyses are stored in your browser's `localStorage`. The sample data is fictional. **This app never connects to GitHub or scans repositories.**

## File organization

```text
src/
├── components/
│   ├── Header.tsx        # Navigation bar & mock connection badge
│   └── Sidebar.tsx       # History, search, profile, new analysis
├── data/
│   └── mock.ts           # Agent config and sample analyses
├── pages/
│   ├── Login.tsx         # Demo login
│   ├── Setup.tsx         # Repository and agent configuration
│   ├── Processing.tsx    # Simulated agent activity
│   └── Report.tsx        # Sample vulnerabilities and export
├── types/
│   └── index.ts          # Shared TypeScript models
├── App.tsx               # App state, navigation, localStorage
├── main.tsx              # React mount point
└── index.css             # Tailwind import and visual styles
```

## Expanding into a real product

Add a backend for authentication, repository authorization, job orchestration, and verified scanner findings. Do not use the example vulnerabilities as if they came from a real analysis. Integrate GitHub OAuth only with a secure server-side token flow, and treat any repository code as untrusted input.
