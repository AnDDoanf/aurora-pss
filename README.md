# Aurora PSS Analytics

Aurora PSS Analytics is a React application for exploring Pixel Starships data. It includes searchable game-data libraries, comparison and inventory workflows, training analysis, fleet and player intelligence, and an interactive ship builder.

## Quick start

Requirements:

- Node.js 18 or newer
- npm

```bash
npm install
copy .env.example .env
npm run dev
```

The development server runs at `http://localhost:5173` by default and opens a browser window automatically. On macOS or Linux, use `cp .env.example .env` instead of `copy`.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server with local API proxies. |
| `npm run build` | Create an optimized production build in `dist/`. |
| `npm run preview` | Serve the production build locally. |
| `npm test` | Run the Node test suite. |
| `npm run sitemap` | Generate the sitemap. |
| `npm run deploy:pages` | Build the GitHub Pages deployment output. |
| `npm run audit-guide` | Validate generated guide content. |

Additional data and guide maintenance scripts live in `scripts/` and are exposed through `package.json` where they are part of the regular workflow.

## Configuration

Copy `.env.example` to `.env`. The available settings cover:

- local Vite ports;
- the GitHub Pages site URL and base path;
- the public Pixel Starships API origin;
- optional production proxies for FleetData, Reality, and PixyShip.

Do not commit `.env`; it is intentionally ignored. Variables exposed to browser code must use Vite's `VITE_` prefix.

## Project structure

```text
src/
  app/             application layout and route definitions
  components/      shared, cross-feature components
  config/          runtime API configuration
  content/         bundled guide and editorial content
  features/        feature pages and feature-owned code
    <feature>/
      _components/ private components used by that feature
  i18n/            languages, translations, and translation hooks
  services/        API and browser-storage adapters
  utils/           shared framework-independent helpers
data/               normalized static datasets and snapshot metadata
public/             static assets served by Vite
scripts/            ingestion, content, audit, and deployment tools
tests/              Node unit and integration tests
```

Routes are defined in `src/app/router/index.jsx` and are language-prefixed, for example `/en/library/crew` and `/en/tools/ship-builder`. Most feature routes are lazy-loaded.

## Feature conventions

Keep route-level files focused on loading data, owning page state, and composing the screen. Feature-specific visual pieces belong in `src/features/<feature>/_components/`; shared primitives used by multiple features belong in `src/components/`.

Prefer several named components with explicit props over a single large JSX return. Move calculation-only logic into a sibling `.js` module so it can be tested independently. The underscore on `_components` signals that these modules are private to their owning feature and should not be imported by unrelated features.

Before opening a pull request, run:

```bash
npm test
npm run build
```

## Data and APIs

The app reads normalized static data from `public/data/active` and uses the service adapters in `src/services` for live or third-party requests. During development, Vite proxies `/api-pss`, `/api-fleetdata`, `/api-reality`, and `/api-pixyship` to avoid browser CORS restrictions. Production proxy URLs can be supplied through the optional environment variables documented in `.env.example`.

Generated output in `dist/`, local environment files, snapshot workspaces, and browser audit artifacts are ignored by Git.
