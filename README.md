# AI Factory

An interactive, force-directed glossary — dynamically moving nodes; click one to
focus it and slide open its detail panel. Built to run as a **fully static site on
GitHub Pages** (no server, no database). All content is currently placeholder lorem
ipsum — swap in your own in `src/data.js`.

- **Moving nodes** — a [`d3-force`](https://github.com/d3/d3-force) physics simulation runs in the browser.
- **Click → focus + panel** — the clicked node glides to center, neighbors stay lit while the rest dim, and the detail panel slides in.
- **Drag** nodes, **scroll** to zoom, **drag the canvas** to pan.
- **Shareable URLs** — each entry has its own hash route, e.g. `…/ai-factory/#/lorem`.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173/ai-factory/
```

## Build

```bash
npm run build    # outputs static files to dist/
npm run preview  # serve the production build locally
```

## Deploy to GitHub Pages

1. Push this repo to GitHub (commit `package-lock.json` too — the CI uses `npm ci`).
2. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Push to `main`. The workflow in `.github/workflows/deploy.yml` builds and publishes.
4. Site goes live at `https://<your-user>.github.io/ai-factory/`.

### The two GitHub Pages gotchas (already handled here)

- **`base` path** — `vite.config.js` sets `base: '/ai-factory/'` so assets resolve under
  the repo subpath. **If you rename the repo, change this to match.** For a user/org page
  (`<user>.github.io`) or a custom domain, set it to `'/'`.
- **Routing** — uses hash routes (`#/id`) so refreshes and shared links never 404 (Pages
  has no server to rewrite paths).

## Edit the content

Everything is driven by **`src/data.js`**. Add or change a node:

```js
{
  id: 'my-node',
  label: 'My node',
  description: 'Placeholder text.',
  notes: ['An optional quote or aside.'],   // optional
  connectsTo: ['lorem', 'dolor'],           // edges are derived from this
}
```

Links between nodes are generated automatically from `connectsTo`, and node size scales
with how connected a node is.
