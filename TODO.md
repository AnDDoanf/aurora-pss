# Pixel Starships Guide and Library — Step-by-Step Implementation Roadmap (`TODO.md`)

> **Specification Source**: [`docs/SPEC.md`](file:///c:/code/pss/docs/SPEC.md)  
> **API Reference**: [`docs/open_source_apis.md`](file:///c:/code/pss/docs/open_source_apis.md)  
> **Target Repository**: `C:\code\pss`  
> **Status**: Ready for Implementation  
> **Last Updated**: 2026-07-28  

---

## Table of Contents
1. [Overview & Architecture Baseline](#1-overview--architecture-baseline)
2. [Target Directory Structure](#2-target-directory-structure)
3. [Phase 0 — Foundation, Architecture & Data Ingestion Pipeline](#phase-0--foundation-architecture--data-ingestion-pipeline)
4. [Phase 1 — Core Library, Global Search & Entity Catalogs](#phase-1--core-library-global-search--entity-catalogs)
5. [Phase 2 — Extended Game Systems, Relationships & Comparison Workspace](#phase-2--extended-game-systems-relationships--comparison-workspace)
6. [Phase 3 — Guide Modernization & Third-Party Tool Integration](#phase-3--guide-modernization--third-party-tool-integration)
7. [Phase 4 — Production Hardening, Quality Assurance & Deployment](#phase-4--production-hardening-quality-assurance--deployment)
8. [Definition of Done & Verification Tracker](#definition-of-done--verification-tracker)

---

## 1. Overview & Architecture Baseline

This step-by-step implementation plan transforms the existing React/Vite application from a static guide and tab-based utility app into a fast, bilingual (English/Vietnamese), searchable reference library and guide for Pixel Starships.

### Key Architectural Pillars
- **Decoupled Server-Side Data Ingestion**: Node.js ingestion pipeline (`scripts/ingestion/`) fetching, validating, and normalizing 43 public XML endpoints into versioned snapshots (`data/snapshots/`) and an optimized SQLite / JSON database.
- **Deterministic Asset Derivative Pipeline**: Direct mapping from `SpriteId` -> `ImageFileId` -> `File.Id` with crop boundaries (`X, Y, Width, Height`) generating WebP/AVIF thumbnails. Source PNG archive stays out of the client Vite build artifact.
- **URL-Based Localized Routing**: React Router v6 routing with `:lang` namespace (`/en`, `/vi`), persisted search/filters, and deep links.
- **Dual-Layer Search Engine**: High-performance in-memory search index (MiniSearch/Fuse/FTS5) supporting typo tolerance, accent folding, numeric filtering, and result grouping.
- **Strict Data Hygiene**: Unlabeled raw API values are separated from editorial advice and third-party data services (FleetData, PixyShip, Reality).

---

## 2. Target Directory Structure

```text
c:/code/pss/
├── docs/
│   ├── SPEC.md
│   └── open_source_apis.md
├── scripts/
│   ├── ingestion/
│   │   ├── fetcher.mjs             # Robust HTTP XML fetcher (rate limiting, retries, hashes)
│   │   ├── validator.mjs           # XML schema shape validator & diff generator
│   │   ├── normalizer.mjs          # Database schema population (SQLite/JSON)
│   │   ├── sprite-processor.mjs    # Sprite cropper & WebP image converter
│   │   └── sync-snapshot.mjs       # CLI runner for snapshot sync & atomic activation
│   ├── audit-guide.mjs
│   └── build-guide-content.mjs
├── server/                         # Optional lightweight local API server for dev
│   └── api.mjs
├── public/
│   ├── guide-images/
│   └── assets/                     # Referenced generated WebP derivatives ONLY
├── src/
│   ├── app/
│   │   ├── router/                 # React Router definition with /:lang routes
│   │   ├── providers/              # React Query, Language, Theme providers
│   │   └── layout/                 # Main shell, responsive Header, Mobile Drawer, Footer
│   ├── features/
│   │   ├── search/                 # Global Search Modal & indexing engine
│   │   ├── catalog/                # Generic reusable catalog components & virtualized lists
│   │   ├── crew/                   # Crew catalog, detail page, equipment slots, stat scaling
│   │   ├── rooms/                  # Room catalog, root-room level chains, grid masks
│   │   ├── ships/                  # Ship catalog, interior/exterior, accessible grid mask
│   │   ├── items/                  # Item catalog, crafting, market data adapter boundary
│   │   ├── crafts/                 # Craft / drone catalog & room link
│   │   ├── missiles/               # Missile catalog & launcher link
│   │   ├── research/               # Research tree graph & prerequisite viewer
│   │   ├── missions/               # Mission catalog, rewards & spoiler control
│   │   ├── galaxy/                 # Star systems, links, infrastructure map
│   │   ├── compare/                # Multi-entity comparison workspace
│   │   ├── guide/                  # Markdown guide viewer, TOC, entity cross-links
│   │   └── tools/                  # Preserved targeting, advisor, tournament, market, prestige
│   ├── components/
│   │   ├── ui/                     # Cards, Badges, Tables, Stat Bars, Modal, Drawers
│   │   └── data/                   # Data freshness badge, source disclosure, error boundaries
│   ├── services/
│   │   ├── api/                    # Catalog client services (React Query hooks)
│   │   └── thirdParty/             # FleetData, PixyShip, Reality adapters with fallback
│   ├── content/                    # Split markdown guide files (EN & VI)
│   ├── i18n/                       # UI text translation dictionaries (en.json, vi.json)
│   ├── App.jsx
│   └── main.jsx
├── TODO.md
└── package.json
```

---

## Phase 0 — Foundation, Architecture & Data Ingestion Pipeline

Goal: Establish project dependencies, routing skeleton, data ingestion engine, SQLite schema, and deterministic sprite cropping pipeline.

### Task 0.1: Project Dependencies & Workspace Configuration
- [x] **0.1.1** Update `package.json` with required dependencies:
  - Frontend: `react-router-dom`, `@tanstack/react-query`, `zod`, `@tanstack/react-virtual`, `minisearch` (or `fuse.js`), `clsx`, `tailwind-merge` (or CSS modules).
  - Dev / Scripts: `sharp` (for sprite cropping/WebP generation), `better-sqlite3` (or `sqlite3` / `sql.js`), `fast-xml-parser`.
- [x] **0.1.2** Verify Vite configuration (`vite.config.js`) for code splitting, asset exclusions, and path aliases (`@/` pointing to `src/`).

### Task 0.2: Data Ingestion & Snapshot Engine
- [x] **0.2.1** Create `scripts/ingestion/fetcher.mjs`:
  - Implement sequential/low-concurrency fetching for all 43 static XML endpoints listed in `docs/open_source_apis.md`.
  - Add exponential backoff retries, configurable timeouts (10s), ETag/MD5 response hashing, and custom `User-Agent`.
  - Save raw XML responses into `data/raw/<snapshot_timestamp>/`.
- [x] **0.2.2** Create `scripts/ingestion/validator.mjs`:
  - Enforce strict schema checks: detect missing required primary keys, non-unique IDs, broken key relationships, or error response envelopes.
  - Implement additive attribute warning logging and threshold checks (e.g. record count drops by >5% triggers abort).
- [x] **0.2.3** Create `scripts/ingestion/normalizer.mjs`:
  - Set up SQLite schema or snapshot JSON files:
    - Infrastructure tables: `sync_runs`, `source_snapshots`, `files`, `sprites`, `localized_text`, `entity_links`, `aliases`.
    - Domain tables: `character_designs`, `character_parts`, `room_designs`, `ship_designs`, `item_designs`, `craft_designs`, `missile_designs`, `research_designs`, `mission_designs`, `star_systems`, `skin_designs`, etc.
  - Parse XML using `fast-xml-parser`, store normalized typed columns alongside `raw_json` payload.
- [x] **0.2.4** Create `scripts/ingestion/sync-snapshot.mjs`:
  - Build atomic activation workflow: test entire pipeline -> build database/JSON artifacts -> swap symlink/active pointer -> store prior snapshot for rollback capability.

### Task 0.3: Asset Pipeline & Derivative Generation
- [x] **0.3.1** Create `scripts/ingestion/sprite-processor.mjs`:
  - Implement exact sprite lookup resolution: `Design Sprite Attribute` -> `ListSprites2.SpriteId` -> `ImageFileId` -> `ListFiles4.File.Id` -> Crop (`X`, `Y`, `Width`, `Height`).
  - Read local PNG source from `AssetFiles/Prod` (or download missing files if remote URL available).
  - Crop sprites using `sharp`, resize into optimized WebP thumbnails (avatar, card preview, full detail), and output to `public/assets/sprites/`.
  - Apply pixel-art nearest-neighbor scaling rules.
  - Deduplicate identical crops by MD5 output hash.
- [x] **0.3.2** Configure Vite copy rules to ensure unreferenced raw source images (`424 MB`) are NEVER included in `dist/`.

### Task 0.4: Application Shell & Localized Router
- [x] **0.4.1** Initialize `src/i18n/` with dictionary files:
  - `src/i18n/en.json` and `src/i18n/vi.json` for all common UI labels (nav, filters, detail headers, search placeholders, fallback notices).
  - Create language hook `useTranslation()` supporting default fallback to `vi` or `en`.
- [x] **0.4.2** Setup React Router (`src/app/router/index.jsx`):
  - Root route `/:lang` with child routes for `/guide`, `/library/*`, `/compare/*`, `/tools/*`, `/about/data`.
  - Automatic redirect from invalid language prefixes to `/vi` or stored local storage preference.
- [x] **0.4.3** Build App Shell layout (`src/app/layout/`):
  - Responsive header with Global Search trigger button (`Ctrl+K`), Navigation Links, Language Switcher (EN/VI), and Theme Switcher (Dark/Light).
  - Mobile bottom navigation bar / slide-out drawer (360px viewport tested).
  - Global footer with data freshness timestamp and raw disclosure link.

---

## Phase 1 — Core Library, Global Search & Entity Catalogs

Goal: Build global search engine, reusable UI components, catalog lists, detail views, and multi-entity comparison workspace for primary entities (Crew, Rooms, Ships, Items).

### Task 1.1: Global Search System (`src/features/search`)
- [x] **1.1.1** Build search index generator (`scripts/build-search-index.mjs`):
  - Index guide titles, headings, content text, entity names (EN/VI), short names, official IDs, categories, rarity, sprite keys, numeric attributes (ship level, room size).
  - Strip diacritics / fold accents for Vietnamese search matching.
- [x] **1.1.2** Build `SearchModal.jsx` component:
  - Command palette style overlay (`Ctrl+K` shortcut).
  - Live filtering (<200ms latency), keyboard arrow navigation, query persistence in URL search param (`?q=`).
  - Categorized result sections (Crew, Rooms, Ships, Items, Guides, Tools) with highlighted search terms.

### Task 1.2: Reusable UI Component System (`src/components/ui/`)
- [x] **1.2.1** Build `EntityCard.jsx` (supports grid view with sprite image, rarity border, title, subtext, key stats).
- [x] **1.2.2** Build `DataTable.jsx` (dense tabular view with column sorting, sticky headers, virtualized rows using `@tanstack/react-virtual`).
- [x] **1.2.3** Build `FilterDrawer.jsx` (slide-out filter panel for mobile, persistent inline bar for desktop).
- [x] **1.2.4** Build `StatBar.jsx` & `StatComparisonRow.jsx` (visual stat bar with base vs final values and delta indicators).
- [x] **1.2.5** Build `RarityBadge.jsx`, `CategoryBadge.jsx`, `SpriteFrame.jsx` (nearest-neighbor image container with fallback skeleton).
- [x] **1.2.6** Build `DataFreshnessBadge.jsx` and `SourceDisclosureModal.jsx` (displays snapshot date, raw API XML link, and methodology).

### Task 1.3: Crew Catalog & Detail Module (`src/features/crew/`)
- [x] **1.3.1** Catalog Page (`/:lang/library/crew`):
  - Virtualized grid/table views.
  - Filters: Rarity, Race, Ability Type, Collection, Level, Equipment Mask.
  - Sorting: HP, Attack, Repair, Pilot, Weapon, Science, Engine, Research, Movement Speed.
  - URL filter serialization (`?rarity=Hero&sort=hp&order=desc`).
- [x] **1.3.2** Detail Page (`/:lang/library/crew/:id`):
  - Cropped profile avatar (`ProfileSpriteId`) + character part assembly preview.
  - Interactive level slider (Level 1 to 40) recalculating real-time stats (Base -> Max).
  - Ability stats, equipment slot masks (Head, Body, Leg, Weapon, Accessory).
  - Linked Prestige recipes (prestige synthesis inputs/outputs) & Recruitment options.
  - Linked Guide topics and "Add to Compare" tray action.

### Task 1.4: Room Catalog & Level Chain Module (`src/features/rooms/`)
- [x] **1.4.1** Catalog Page (`/:lang/library/rooms`):
  - Grouping room designs by `RootRoomDesignId`.
  - Filters: Room Type (Weapon, Energy, Support, Armor, etc.), Category, Dimensions (Rows x Cols), Min Ship Level, Power Generation/Consumption.
- [x] **1.4.2** Detail Page (`/:lang/library/rooms/:id`):
  - Full Level Chain table (Level 1 to Max Level).
  - Highlight stat changes between consecutive room levels.
  - Visual grid mask (e.g. 2x3 grid box with power/weapon icons).
  - Supported AI Actions & Conditions lists linked to the room.
  - Linked Missiles / Crafts manufactured by this room.

### Task 1.5: Ship Catalog Module (`src/features/ships/`)
- [x] **1.5.1** Catalog Page (`/:lang/library/ships`):
  - Filters: Ship Type, Race, Level, Grid Area.
- [x] **1.5.2** Detail Page (`/:lang/library/ships/:id`):
  - Accessible ship mask grid visualizer (distinguishable grid cells for walkable space, hull boundary, power grid).
  - Exterior art, interior layout background, mini-ship logo.
  - Upgrade cost, construction time, HP, storage, lives, equipment capacity.
  - Unlock prerequisites (Research required, Ship Level required).

### Task 1.6: Item Catalog Module (`src/features/items/`)
- [x] **1.6.1** Catalog Page (`/:lang/library/items`):
  - Filters: Item Type, Subtype, Rarity, Rank, Enhancement/Module type.
- [x] **1.6.2** Detail Page (`/:lang/library/items/:id`):
  - Stat modifiers (Reload speed, HP bonus, Stat boosts).
  - Manufacturing recipe & ingredient costs.
  - Explicit Third-Party Market Data section (clearly labeled as external/estimated data via adapter).

### Task 1.7: Multi-Entity Comparison Workspace (`src/features/compare/`)
- [x] **1.7.1** Build `CompareWorkspace.jsx` (`/:lang/compare/:type`):
  - Support side-by-side comparison for up to 4 Crew, 4 Root Rooms, 3 Ships, or 4 Items/Crafts/Missiles.
  - Diff view toggle ("Highlight Differences", "Hide Identical Rows").
  - URL query state persistence (`/en/compare/crew?ids=1,42,105`).
  - Compare tray floating bar across all catalog pages.

---

## Phase 2 — Extended Game Systems, Relationships & Comparison Workspace

Goal: Build catalogs and detail views for Crafts, Missiles, Research, Missions, Collections, Skins, Galaxy, and establish comprehensive entity cross-linking.

### Task 2.1: Crafts & Missiles Catalogs (`src/features/crafts/`, `src/features/missiles/`)
- [x] **2.1.1** Craft catalog (`/:lang/library/crafts`) & detail page (Flight speed, HP, Shield damage, Hull damage, Reload time, parent room cross-link).
- [x] **2.1.2** Missile catalog (`/:lang/library/missiles`) & detail page (System damage, Shield damage, Character damage, Volley count, parent room cross-link).

### Task 2.2: Research Tree Module (`src/features/research/`)
- [x] **2.2.1** Research catalog (`/:lang/library/research`) with filter by research type/category.
- [x] **2.2.2** Interactive Prerequisite Tree visualizer (SVG/Canvas hierarchy node graph showing unlock dependencies).
- [x] **2.2.3** Unlocked Entities section on detail page (shows which rooms, crew, or items require this research).

### Task 2.3: Mission & Story Library (`src/features/missions/`)
- [x] **2.3.1** Mission catalog (`/:lang/library/missions`) grouped by chapter/sector.
- [x] **2.3.2** Detail view showing enemy fleet composition, rewards, requirements, and dialogue text.
- [x] **2.3.3** Add Spoiler Protection toggle (hides narrative text unless explicitly revealed by user).

### Task 2.4: Galaxy & Star Systems Library (`src/features/galaxy/`)
- [x] **2.4.1** Star System list (`/:lang/library/galaxy`) and detail page (Planets, System Links, Infrastructure bonuses, Marker generators).
- [x] **2.4.2** Interactive lightweight SVG system connectivity graph map.

### Task 2.5: Collections & Cosmetic Skins (`src/features/collections/`, `src/features/skins/`)
- [x] **2.5.1** Crew Collections catalog (`/:lang/library/collections`) showing crew roster matching requirements and total collection stat bonuses.
- [x] **2.5.2** Skins & Cosmetics catalog (`/:lang/library/skins`) showing skin previews and target room/ship/crew associations.

### Task 2.6: Comprehensive Relationship Engine & Ingestion Audit
- [x] **2.6.1** Create relational mapping hooks (`useRelatedEntities(entityType, entityId)`).
- [x] **2.6.2** Add automated script `scripts/audit-relationships.mjs` to detect dangling keys, orphan sprites, or circular research dependencies.

---

## Phase 3 — Guide Modernization & Third-Party Tool Integration

Goal: Upgrade guide system to document-based URL routing, integrate legacy tools (targeting, advisor, tournaments, prestige, market), and isolate external API adapters.

### Task 3.1: Guide Document Routing & Frontmatter Parser (`src/features/guide/`)
- [x] **3.1.1** Modernize Markdown guide loader (`src/features/guide/guideLoader.mjs`):
  - Parse YAML frontmatter (`title`, `order`, `group`, `tags`, `related`, `updatedAt`, `sources`).
  - Map routes to `/:lang/guide/:group/:slug`.
- [x] **3.1.2** Build `GuideLayout.jsx` & `GuideDocument.jsx`:
  - Left navigation sidebar with expandable topic groups.
  - Auto-generated Table of Contents (TOC) with scroll-spy heading tracking.
  - Embedded contextual entity cards (e.g. hovering over or viewing related Crew/Room links).
  - Previous / Next document footer navigation.

### Task 3.2: Legacy Tool Integration (`src/features/tools/`)
- [x] **3.2.1** Migrate existing tools into routed views under `/:lang/tools/`:
  - `/tools/targeting` -> `StarTargeting.jsx`
  - `/tools/advisor` -> `SmartAdvisor.jsx`
  - `/tools/tournaments` -> `Tournaments.jsx`
  - `/tools/market` -> `MarketAnalytics.jsx`
  - `/tools/prestige` -> Prestige calculator
- [x] **3.2.2** Isolate Third-Party Services (`src/services/thirdParty/`):
  - Build adapters for FleetData, PixyShip, and Reality APIs.
  - Add strict isolation wrappers: timeout (5s), fallback behavior on failure, cache headers, and UI notice ("Data sourced from Third-Party Service [Name], Last fetched [Timestamp]").
  - Guarantee core library functionality remains 100% operational even when all third-party services fail.

### Task 3.3: Content & Asset Audit Suite (`scripts/audit-guide.mjs`)
- [x] **3.3.1** Expand audit script to verify:
  - All internal guide links resolve to valid routes.
  - All image src references exist in `public/assets/` or `public/guide-images/`.
  - All YAML frontmatter fields validate against Zod schema.
  - English and Vietnamese versions of guide documents have matching slugs.

---

## Phase 4 — Production Hardening, Quality Assurance & Deployment

Goal: Implement SEO, performance optimization, WCAG 2.2 AA accessibility, automated testing suite (Vitest + Playwright), and CI/CD snapshot deployment automation.

### Task 4.1: SEO, Metadata & Sitemap Generation
- [x] **4.1.1** Add meta header manager (`react-helmet-async` or custom head manager):
  - Dynamic localized `<title>`, `<meta name="description">`, `<link rel="canonical">`, `<link rel="alternate" hreflang="en/vi">`.
  - Open Graph (`og:title`, `og:image`, `og:description`) cards for entity & guide routes.
- [x] **4.1.2** Build automated sitemap generator script (`scripts/generate-sitemap.mjs`):
  - Output `public/sitemap.xml` containing all static pages, guide routes, and public entity catalog IDs.

### Task 4.2: WCAG 2.2 AA Accessibility & Responsive Polish
- [x] **4.2.1** Keyboard Navigation Audit:
  - Full keyboard focusability (`tabIndex`), visible focus rings (`outline-ring`), escape key listener for modals/drawers, `aria-expanded` and `aria-controls` attributes.
- [x] **4.2.2** Screen Reader & Color Contrast Audit:
  - Ensure all buttons have accessible labels, tables use `<caption>` and `<th> scope="col"`, color is paired with icons/text for rarity/status.
- [x] **4.2.3** Mobile Viewport Audit:
  - Verify zero horizontal scrolling on 360px viewport width (e.g. mobile Chrome/Safari).

### Task 4.3: Performance & Bundle Optimization
- [x] **4.3.1** Route-level Code Splitting:
  - Lazy load features via `React.lazy()` and `Suspense`.
- [x] **4.3.2** Web Vitals Targets Verification:
  - LCP < 2.5s on cached catalog data.
  - CLS < 0.1 (explicit image container dimensions).
  - INP < 200ms (virtualized catalogs for list views).
  - Ensure production initial JS bundle size is under 200 KB gzipped.

### Task 4.4: Automated Test Suite (Vitest & Playwright)
- [x] **4.4.1** Setup Vitest (`vitest.config.js`):
  - Unit tests for XML parsing, normalizer schemas, stat scaling functions, localization fallbacks, URL serializer.
- [x] **4.4.2** Setup Playwright E2E (`playwright.config.js`):
  - Test core user journeys:
    1. Language toggle (EN -> VI) preserves route and updates content.
    2. Global search (`Ctrl+K` -> search "Pirate" -> navigate to detail).
    3. Filter catalog -> sort -> view detail -> open compare.
    4. Load application with third-party network requests blocked.

### Task 4.5: CI/CD Deployment Automation
- [x] **4.5.1** Setup GitHub Actions workflow (`.github/workflows/deploy.yml`):
  - Run ingestion audit & data snapshot fetcher.
  - Execute Vitest unit tests & audit scripts (`npm run audit-guide`).
  - Build Vite production bundle (`npm run build`).
  - Deploy static assets & JSON/SQLite snapshots to CDN / static hosting (Netlify/Vercel/GitHub Pages).
- [x] **4.5.2** Schedule daily snapshot update workflow (`.github/workflows/daily-sync.yml`).

---

## Definition of Done & Verification Tracker

An implementation task is considered complete when all criteria below are verified:

| Feature Area | Verification Check | Status |
| --- | --- | --- |
| **Ingestion Pipeline** | All static XML endpoints fetch successfully, validate schema, store snapshots, and support safe rollback. | ✅ Complete |
| **Asset Pipeline** | Sprites crop deterministically using `ListSprites2` & `ListFiles4`. Raw 424MB archive is excluded from production Vite build. | ✅ Complete |
| **Routing & i18n** | Navigation uses URL routes (`/:lang/...`). Language switching between English and Vietnamese works seamlessly. | ✅ Complete |
| **Global Search** | `Ctrl+K` modal responds in <200ms, typo-tolerant, accent-insensitive, and results link to entity/guide pages. | ✅ Complete |
| **Core Catalogs** | Crew, Rooms, Ships, and Items catalogs feature search, virtualized tables, filtering, sorting, and stable detail routes. | ✅ Complete |
| **Room Chains** | Rooms group by `RootRoomDesignId`, displaying full level chains and highlighting level-over-level stat deltas. | ✅ Complete |
| **Comparison** | Side-by-side comparison supports up to 4 items/crew/rooms/ships with URL parameter state. | ✅ Complete |
| **Guide Integration** | Markdown guide topics load under stable document routes with TOC, entity links, and zero broken internal assets. | ✅ Complete |
| **Third-Party Isolation**| External tools/adapters degrade gracefully without breaking the core library when offline/failing. | ✅ Complete |
| **Quality & Performance**| Production build compiles cleanly, unit & E2E tests pass, WCAG 2.2 AA compliant, zero 360px mobile layout overflow. | ✅ Complete |
