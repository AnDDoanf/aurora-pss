# Pixel Starships Guide and Library — Product & Technical Specification

Status: Draft for implementation  
Last updated: 2026-07-28  
Target repository: `C:\code\pss`

## 1. Product definition

Build a fast, bilingual, searchable guide and reference library for Pixel
Starships. The application combines:

- structured game data from the official Pixel Starships XML API;
- locally managed game artwork and sprite metadata;
- editorial English and Vietnamese guide content;
- the repository's existing tournament, targeting, advisor, prestige, and
  market tools.

The product must help a player answer three questions quickly:

1. What is this crew, room, ship, item, or game system?
2. How does it compare with alternatives?
3. How should I use it in a ship, AI setup, or progression plan?

The library is a public reference application. It must not request, store, or
use a player's Pixel Starships password or access token, and it must not invoke
state-changing game endpoints.

## 2. Goals

### 2.1 Primary goals

- Provide a complete browsable catalog of public game designs.
- Join human-readable entities to their correct images using file and sprite
  metadata.
- Support English and Vietnamese throughout navigation, guides, search, and
  editorial descriptions.
- Make comparison and filtering central instead of presenting raw API dumps.
- Keep API-derived facts distinguishable from editorial recommendations.
- Continue to work from the last successful data snapshot if the upstream API
  is unavailable.
- Preserve and integrate the useful tools already present in the application.

### 2.2 Success criteria

- A user can find any indexed entity in no more than three interactions.
- Global search returns useful results in under 200 ms after the index loads.
- A catalog page remains responsive with thousands of records.
- Every displayed API value includes a data freshness timestamp.
- Every image has a deterministic source mapping or a visible fallback.
- All primary pages work on a 360 px-wide mobile viewport.
- English and Vietnamese routes are linkable and retain the selected language.
- The application passes the guide-content audit and production build.

## 3. Non-goals

- Reimplementing the Pixel Starships game client.
- Automating battles, markets, accounts, purchases, fleets, or other gameplay.
- Calling authenticated mutation endpoints.
- Storing game credentials.
- Guaranteeing that undocumented upstream API contracts never change.
- Including or preloading the complete 424 MB local PNG archive in the
  production web application.
- Treating inferred or community-authored strategy as official game data.

## 4. Existing repository baseline

The implementation must reuse working parts of the repository where practical:

- React 18 and Vite 5 application shell.
- `src/components/Guide.jsx` and the split Markdown guide loader.
- English and Vietnamese content under `src/content/guide`.
- Guide generation, asset synchronization, and auditing scripts.
- Existing targeting, advisor, tournament, prestige, and market services.
- Organized images under `public/guide-images/game_assets`.
- `_classification_manifest.csv`, which records the current asset grouping.
- `docs/open_source_apis.md`, which documents the researched API surface.

Current limitations to address:

- Navigation uses component-local tab state rather than URL routes.
- Official catalog data is not normalized into a local database.
- API requests are made from browser services and can be affected by CORS,
  mixed HTTP/HTTPS, availability, and large XML payloads.
- Search only covers the editorial guide.
- The asset directory is too large to copy into every production build.
- Entity pages, comparisons, relationships, and data freshness are absent.

## 5. Users and key journeys

### 5.1 New player

- Search a term or browse a category.
- Learn what a stat, room, crew role, or game mechanic means.
- Follow contextual links from a library entry into the relevant guide topic.
- See progression-friendly recommendations without needing API knowledge.

### 5.2 Experienced player

- Filter and compare crew, rooms, ships, items, missiles, or crafts.
- Inspect level chains and final values.
- Examine AI actions and conditions supported by a room or crew.
- Copy stable links to a particular entity or comparison.

### 5.3 Guide editor

- Update Markdown without editing React components.
- Link a guide page to structured entity IDs.
- Run a content and broken-asset audit before publishing.
- See which data snapshot and source version are currently deployed.

### 5.4 Maintainer

- Refresh official XML data with one command or scheduled job.
- Detect upstream schema changes before replacing the active snapshot.
- Regenerate optimized images and search indexes deterministically.
- Roll back to the previous valid snapshot.

## 6. Information architecture

Replace tab-only navigation with URL-based routing.

### 6.1 Primary routes

| Route | Purpose |
| --- | --- |
| `/:lang` | Localized home page and global search entry point. |
| `/:lang/guide` | Guide landing page and topic groups. |
| `/:lang/guide/:group/:slug` | Stable URL for a single guide document. |
| `/:lang/library` | Library landing page and category overview. |
| `/:lang/library/crew` | Crew catalog. |
| `/:lang/library/crew/:id` | Crew detail. |
| `/:lang/library/rooms` | Room catalog. |
| `/:lang/library/rooms/:id` | Room/root-room detail and level chain. |
| `/:lang/library/ships` | Ship and hull catalog. |
| `/:lang/library/ships/:id` | Ship detail. |
| `/:lang/library/items` | Item catalog. |
| `/:lang/library/items/:id` | Item detail. |
| `/:lang/library/crafts` | Craft and drone catalog. |
| `/:lang/library/crafts/:id` | Craft detail. |
| `/:lang/library/missiles` | Missile and ammunition catalog. |
| `/:lang/library/missiles/:id` | Missile detail. |
| `/:lang/library/research` | Research tree and catalog. |
| `/:lang/library/missions` | Mission catalog. |
| `/:lang/library/collections` | Crew collection catalog. |
| `/:lang/library/skins` | Skin and cosmetic catalog. |
| `/:lang/library/galaxy` | Star systems, links, and infrastructure. |
| `/:lang/compare/:type` | Multi-entity comparison workspace. |
| `/:lang/tools/targeting` | Existing targeting tool. |
| `/:lang/tools/advisor` | Existing advisor. |
| `/:lang/tools/tournaments` | Existing tournament tool. |
| `/:lang/tools/market` | Existing market analytics. |
| `/:lang/tools/prestige` | Existing prestige path finder. |
| `/:lang/about/data` | Sources, freshness, licenses, and methodology. |

`lang` must initially support `en` and `vi`. Unknown language values redirect
to the saved preference or `vi`.

### 6.2 Navigation

Desktop navigation:

- Search
- Guide
- Library
- Compare
- Tools
- Language
- Theme

Mobile navigation uses a compact top bar and a drawer. Category filters must
not occupy permanent horizontal space on small screens.

## 7. Core functional requirements

### 7.1 Home

The home page must contain:

- global search;
- entry cards for Crew, Rooms, Ships, Items, Guide, and Tools;
- recently updated guide topics;
- current data snapshot timestamp;
- optional tournament status summary;
- a clear distinction between official data and editorial content.

### 7.2 Global search

Search must cover:

- guide titles, headings, body text, tags, and aliases;
- entity names, short names, IDs, types, categories, rarity, and sprite keys;
- common abbreviations in both languages;
- selected numeric fields such as ship level or room dimensions.

Requirements:

- accent-insensitive and case-insensitive matching;
- prefix matching and typo tolerance for names;
- result grouping by content type;
- keyboard navigation;
- highlighted matching terms;
- query encoded in the URL;
- no network request for every keystroke;
- result limit and virtualized rendering where necessary.

The initial implementation may use a generated MiniSearch/Fuse-style index.
If the backend database is queried directly, SQLite FTS5 or PostgreSQL full
text search is preferred.

### 7.3 Catalog lists

Every catalog must provide:

- responsive cards and a dense table mode;
- filter chips and advanced filter drawer;
- sorting;
- URL-persisted filters;
- result count;
- reset control;
- skeleton loading;
- empty and error states;
- virtualized lists for large result sets;
- a comparison-selection control.

Common filters include:

- level;
- rarity;
- category/type;
- availability flags;
- race;
- dimensions;
- ability/effect;
- resource or price type;
- collection;
- tags.

### 7.4 Entity detail pages

All detail pages share:

- canonical localized URL;
- name, ID, category/type, and primary image;
- official data freshness timestamp;
- structured stat sections;
- related entities;
- linked guide topics;
- share/copy-link action;
- visible fallback for missing artwork;
- raw-source disclosure link for maintainers;
- previous/next navigation within the current filtered catalog.

### 7.5 Crew library

Crew list fields:

- profile image;
- name and ID;
- rarity and race;
- base and final HP, attack, repair, pilot, weapon, science, engine, and
  research values;
- ability;
- collection;
- movement speed;
- tags.

Crew detail must include:

- profile avatar cropped from `ProfileSpriteId`;
- optional assembled/available character-part sprites;
- base-to-final stat comparison;
- maximum level and progression type;
- ability type, starting value, and final value;
- equipment mask rendered as readable slots;
- collection and collection bonus;
- linked prestige/recruitment information when available;
- related guide topics for roles, training, skills, and combat;
- compare action.

Stats must preserve the API's original precision. Formatting may round for
display, but tooltips or detail rows must expose the stored value.

### 7.6 Room library

Room pages must group designs by `RootRoomDesignId` and show the complete level
chain.

Required fields:

- name, short name, type, category, and level;
- rows, columns, and grid area;
- power generation or consumption;
- capacity, reload, cooldown, and activation delay;
- defense and supported grid types;
- construction time and costs;
- minimum ship level;
- enhancement and targeting types;
- image, logo, construction, destroyed, and variant visuals where available;
- linked missile or craft;
- supported AI actions and conditions.

The detail page must offer a level comparison table and clearly highlight
values changed from the previous level.

### 7.7 Ship library

Required fields:

- hull name, type, race, and level;
- grid dimensions and room mask;
- HP, storage, equipment capacity, attacks, and lives;
- construction/upgrade costs and time;
- exterior, interior, logo, and mini-ship art;
- required/unlock ship and research relationships;
- skin/sticker support.

Render the ship mask as an accessible grid visualization. Empty and usable
cells must be distinguishable without relying only on color.

### 7.8 Item library

Required fields:

- item name, key, type, subtype, rarity, and rank;
- image and logo;
- enhancement/module type and value;
- space, reload modifier, and market/fair-price fields;
- ingredients and manufacturing costs;
- requirements, level, and minimum ship level;
- links to character parts, rooms, crafts, missiles, training, or situations;
- optional market history from a separate, clearly labeled source.

Official catalog facts and third-party/current market observations must never
be merged into one unlabeled value.

### 7.9 Crafts and missiles

Provide independent catalogs and link entries to the rooms that manufacture or
launch them.

Detail pages must expose:

- combat stats;
- damage/effect types;
- rebuild/reload values;
- costs and cargo/space requirements;
- target behavior;
- sprite/image;
- parent room and research requirements.

### 7.10 Research

Provide:

- searchable research catalog;
- prerequisite graph;
- level/cost/time information;
- unlocked entities;
- filtering by research type;
- link from an entity to required research and back.

Cycles or missing prerequisite records must be detected during ingestion and
reported by the audit.

### 7.11 Missions and galaxy

Mission library:

- mission title, ID, type, requirements, enemies, rewards, and progression;
- spoiler-aware display for dialogue and story content;
- links to ships, situations, items, or rewards.

Galaxy library:

- star-system list and detail;
- system links;
- planets;
- infrastructure definitions and bonuses;
- marker-generator definitions.

An interactive map is a later enhancement. The first release may use a
searchable graph/list and a lightweight SVG link diagram.

### 7.12 Guide

Replace accordion-only guide presentation with stable document routes while
retaining category navigation and search.

Guide front matter must support:

```yaml
---
title: "Crew combat mechanics"
order: 30
group: "Crews"
tags: ["crew", "combat", "attack"]
related:
  crew: [1, 42]
  rooms: [12]
updatedAt: "2026-07-28"
sources:
  - "official-api"
---
```

Requirements:

- generated table of contents;
- deep links to headings;
- previous/next topic links;
- related library entities;
- related guide topics;
- responsive Markdown tables and images;
- image captions and alt text;
- last-updated and source information;
- no broken internal links or image references.

### 7.13 Compare

Users may compare:

- up to four crew;
- up to four root room level chains;
- up to three ships;
- up to four items, crafts, or missiles.

Comparison must:

- align equivalent fields;
- highlight best/worst numeric values only when higher/lower has a meaningful
  interpretation;
- allow hiding identical rows;
- encode selected IDs in the URL;
- avoid declaring subjective winners.

## 8. Data sources

The researched official endpoints are documented in
`docs/open_source_apis.md`.

### 8.1 Required official snapshots

Initial ingestion must include:

- character designs and character actions;
- item designs and item actions;
- room designs, action types, condition types, crafts, and missiles;
- room-design sprite mappings;
- ship designs;
- research, training, collection, mission, achievement, reward, season, task,
  situation, division, league, promotion, and news designs;
- star systems, links, planets, markers, and infrastructure;
- skins and skin sets;
- file manifest and sprite manifest.

### 8.2 Third-party sources

Existing FleetData, PixyShip, and Reality services may remain available for
tools, but they must be isolated behind adapters and labeled as third-party.

Each adapter must define:

- owner and base URL;
- fields consumed;
- cache duration;
- timeout;
- retry policy;
- failure behavior;
- freshness label;
- whether data is historical, estimated, or live.

The core library must remain usable when all third-party services fail.

## 9. Data ingestion architecture

### 9.1 Principle

Do not download and parse multi-megabyte XML catalogs in every browser
session. A server-side or build-time ingestion process must fetch, validate,
normalize, and publish versioned snapshots.

### 9.2 Pipeline

```text
Official XML APIs
        |
        v
Fetcher with timeout, rate limit, retry, and ETag/hash
        |
        v
Raw immutable snapshot files
        |
        v
XML schema/shape validation and normalization
        |
        +--> relational/JSON catalog database
        +--> search index
        +--> optimized image derivatives
        +--> integrity report
        |
        v
Atomic activation of the new snapshot
```

### 9.3 Sync behavior

- Run on demand and on a scheduled cadence, initially every 24 hours.
- Fetch endpoints sequentially or with low bounded concurrency.
- Use a descriptive User-Agent.
- Store response hash, endpoint, HTTP status, fetch time, API version
  attribute, and byte length.
- Retain at least the two most recent valid snapshots.
- Validate all required endpoints before activation.
- Do not replace the active snapshot if a required fetch or validation fails.
- Permit optional endpoints to fail without blocking activation, but report
  them.
- Generate a diff summary of added, removed, and changed entities.

### 9.4 Schema-change detection

For each XML entity type, track known attributes and child elements.

The sync must fail in strict mode when:

- a required identifier disappears;
- an identifier becomes non-unique;
- a required relationship cannot be parsed;
- the response is an error envelope instead of the expected service root;
- record count falls below a configurable safety threshold;
- a previously numeric filter field becomes non-numeric.

Unknown additive attributes should be retained in raw JSON and emitted as
warnings rather than causing immediate failure.

## 10. Normalized data model

Use SQLite for a single-instance/static deployment or PostgreSQL for a
multi-instance deployment. Store the raw normalized record as JSON alongside
indexed columns so new upstream attributes are not lost.

### 10.1 Common tables

| Table | Key fields |
| --- | --- |
| `sync_runs` | `id`, `started_at`, `completed_at`, `status`, `source_host`, `app_version` |
| `source_snapshots` | `sync_run_id`, `endpoint`, `api_version`, `fetched_at`, `hash`, `record_count`, `raw_path` |
| `files` | `file_id`, `filename`, `aws_filename`, `size`, `date_updated`, `download_category` |
| `sprites` | `sprite_id`, `image_file_id`, `x`, `y`, `width`, `height`, `sprite_key` |
| `localized_text` | `entity_type`, `entity_id`, `language`, `field`, `value` |
| `entity_links` | `from_type`, `from_id`, `relation`, `to_type`, `to_id` |
| `aliases` | `entity_type`, `entity_id`, `language`, `alias` |

### 10.2 Domain tables

Create typed tables for:

- `character_designs`
- `character_parts`
- `character_design_actions`
- `collection_designs`
- `training_designs`
- `room_designs`
- `room_design_sprites`
- `room_action_types`
- `room_condition_types`
- `craft_designs`
- `missile_designs`
- `ship_designs`
- `item_designs`
- `item_design_actions`
- `research_designs`
- `mission_designs`
- `reward_designs`
- `achievement_designs`
- `season_designs`
- `task_designs`
- `situation_designs`
- `skin_designs`
- `skin_sets`
- `star_systems`
- `star_system_links`
- `planets`
- `infrastructure_designs`
- `marker_generator_designs`

Every typed table must include:

- the official numeric ID;
- indexed columns required by filters and sorting;
- `raw_json`;
- `snapshot_id`;
- `source_updated_at` when available.

### 10.3 Relationship rules

- Preserve official IDs; never derive identity from a localized name.
- Group room levels by `RootRoomDesignId`.
- Resolve crew collections by `CollectionDesignId`.
- Resolve images through sprite records, not filename guessing.
- Preserve missing relationships as `null` plus an audit warning.
- Do not create a relationship only because two names look similar.

## 11. Asset pipeline

### 11.1 Source mapping

Use the deterministic chain:

```text
Design sprite field
  -> FileService/ListSprites2.SpriteId
  -> Sprite.ImageFileId
  -> FileService/ListFiles4.File.Id
  -> local numeric cache file or remote asset filename
```

For sprite sheets, crop using `X`, `Y`, `Width`, and `Height`.

### 11.2 Production asset rules

- Treat `AssetFiles/Prod` as read-only source material.
- Keep full-resolution source assets outside the frontend `public` directory.
  Files in `public` are not automatically downloaded by a browser, but Vite
  copies them into the production artifact, increasing storage, deployment,
  upload, and cache-invalidation costs.
- Do not use filename heuristics when an official sprite/file mapping exists.
- Generate only referenced derivatives for the production application.
- Preserve originals outside the deployed public bundle.
- Create thumbnail sizes appropriate to list and detail views.
- Prefer WebP, with AVIF when the deployment image pipeline supports it.
- Preserve PNG where pixel-art alpha or exact nearest-neighbor rendering makes
  it preferable.
- Use nearest-neighbor scaling for pixel art unless the asset is known to be
  high-resolution artwork.
- Store derivative metadata: source file ID, sprite ID, crop, output hash,
  dimensions, and format.
- Deduplicate identical outputs by content hash.

### 11.3 Image delivery

- Lazy-load images below the fold.
- Set explicit width and height to prevent layout shift.
- Use `srcset` for avatar and card thumbnails.
- Cache content-hashed derivatives for one year.
- Use a short cache duration for mutable, non-hashed manifests.
- Provide category-specific fallback artwork and meaningful alt text.

The entire `game_assets` directory must not be copied blindly into `dist` or
preloaded by the application. A complete 424 MB transfer would consume roughly
424 GB for every 1,000 full downloads, before accounting for repeat requests
or cache misses.

Catalog pages must request only viewport-relevant thumbnails. Full-resolution
art must load only on demand from an entity detail view. If original artwork
must be publicly available, store it in object storage behind a CDN rather than
inside the frontend deployment artifact.

## 12. Internal application API

Expose JSON endpoints from the normalized snapshot. Exact framework is
implementation-defined, but the contract must support:

```text
GET /api/v1/meta
GET /api/v1/search

GET /api/v1/crew
GET /api/v1/crew/:id
GET /api/v1/rooms
GET /api/v1/rooms/:id
GET /api/v1/ships
GET /api/v1/ships/:id
GET /api/v1/items
GET /api/v1/items/:id
GET /api/v1/crafts
GET /api/v1/crafts/:id
GET /api/v1/missiles
GET /api/v1/missiles/:id
GET /api/v1/research
GET /api/v1/missions
GET /api/v1/collections
GET /api/v1/skins
GET /api/v1/galaxy/systems
GET /api/v1/galaxy/systems/:id

GET /api/v1/assets/files/:fileId
GET /api/v1/assets/sprites/:spriteId
```

List endpoint conventions:

- `q` for text search;
- repeated or comma-separated filter parameters;
- `sort` and `direction`;
- cursor pagination for large changing lists, or offset pagination for static
  snapshot catalogs;
- `lang=en|vi`;
- `fields` only if payload size proves problematic.

Response envelope:

```json
{
  "data": [],
  "meta": {
    "snapshotId": "2026-07-28T00:00:00Z",
    "fetchedAt": "2026-07-28T00:00:00Z",
    "total": 0,
    "nextCursor": null
  }
}
```

Error envelope:

```json
{
  "error": {
    "code": "ENTITY_NOT_FOUND",
    "message": "Crew 12345 was not found.",
    "requestId": "..."
  }
}
```

## 13. Frontend architecture

### 13.1 Recommended stack

Retain:

- React;
- Vite;
- React Markdown and Remark GFM;
- Lucide icons.

Add:

- React Router for URL navigation;
- TanStack Query for server-state caching;
- a schema validator such as Zod at the application boundary;
- a head/meta solution for canonical URLs and localized metadata;
- a list virtualizer for large catalogs;
- Vitest, React Testing Library, and Playwright.

Avoid adding a global state library until shared client state exceeds language,
theme, comparison selection, and lightweight preferences.

### 13.2 Feature organization

```text
src/
  app/
    router/
    providers/
    layout/
  features/
    search/
    guide/
    crew/
    rooms/
    ships/
    items/
    crafts/
    missiles/
    research/
    missions/
    galaxy/
    compare/
    tools/
  components/
    data/
    feedback/
    navigation/
  services/
    catalog/
    thirdParty/
  content/
  i18n/
```

Feature folders own their routes, API hooks, filters, tables, cards, and tests.
Shared components must not contain entity-specific business logic.

### 13.3 State

Server state:

- fetched through TanStack Query;
- keyed by snapshot, language, route, filters, and pagination;
- stale while revalidating;
- retains the last successful response during transient failures.

URL state:

- language;
- search query;
- filters;
- sort;
- selected comparison IDs;
- open guide heading where useful.

Local preference state:

- theme;
- density;
- table/card view;
- dismissed notices;
- optional recent entities.

## 14. Localization

- English and Vietnamese are first-class languages.
- Route language controls content and API localization.
- UI strings live in structured locale dictionaries, not components.
- Entity IDs remain stable across languages.
- If a translated field is absent, fall back to English and label the
  fallback for editorial text.
- Search indexes both languages and shared aliases.
- Number formatting uses the selected locale without changing stored values.
- Do not machine-translate official names at request time.

## 15. Design and interaction requirements

### 15.1 Visual direction

- Dark space-themed interface with a fully supported light theme.
- Pixel-art imagery remains crisp.
- Information-dense tables use restrained borders and strong alignment.
- Color communicates category and rarity but is never the only indicator.
- Avoid decorative animation that delays reading or filtering.

### 15.2 Reusable components

- global search dialog;
- entity card;
- responsive data table;
- stat bar and stat comparison row;
- rarity badge;
- category badge;
- sprite/image frame;
- filter drawer;
- relationship list;
- source/freshness badge;
- empty/error/skeleton states;
- compare tray;
- guide callout and source block.

### 15.3 Accessibility

Target WCAG 2.2 AA:

- full keyboard operation;
- visible focus;
- semantic headings and landmarks;
- table headers and captions;
- form labels and error descriptions;
- reduced-motion support;
- minimum contrast compliance;
- non-color indicators;
- descriptive alt text;
- accessible ship-grid representation;
- no hover-only information.

## 16. SEO and sharing

- Every guide and entity has a stable canonical route.
- Generate localized title, description, canonical, and alternate-language
  metadata.
- Generate `sitemap.xml` from guide and entity IDs.
- Provide Open Graph metadata and a representative image.
- Use structured data for articles and breadcrumb lists where applicable.
- Return meaningful HTML for crawlers through pre-rendering or server-side
  rendering if SEO is a deployment priority.

## 17. Performance requirements

Targets on a mid-range mobile device:

- LCP under 2.5 seconds on cached catalog data;
- CLS under 0.1;
- INP under 200 ms;
- route JavaScript chunks under 200 KB gzip where practical;
- no initial download of full catalog XML or the complete asset archive;
- search response under 200 ms after index initialization;
- filter response under 100 ms for client-side lists;
- list rendering limited to visible rows/cards.

Mandatory techniques:

- route-level code splitting;
- virtualized large lists;
- optimized image derivatives;
- explicit image dimensions;
- deferred non-critical analytics and third-party calls;
- compressed JSON responses;
- immutable caching for snapshot data;
- bundle-size reporting in CI.

## 18. Reliability and error handling

- Show the active snapshot even when refresh fails.
- Display data age rather than a generic "live" label.
- Distinguish upstream failure, no results, parse failure, and offline state.
- Time out third-party calls and degrade only the affected widget.
- Log ingestion and server errors with request/snapshot IDs.
- Never render raw upstream error HTML as application content.
- Provide a maintenance banner when the active snapshot exceeds a configured
  age.

## 19. Security and privacy

- Never collect Pixel Starships credentials or access tokens.
- Do not expose mutation routes through the application backend.
- Validate all query parameters and IDs.
- Sanitize or constrain Markdown HTML.
- Set CSP, `X-Content-Type-Options`, referrer policy, and frame restrictions.
- Rate-limit public search and asset-transformation endpoints.
- Restrict image transformation dimensions and formats.
- Do not proxy arbitrary URLs.
- Keep secrets in deployment environment variables, never Vite client
  variables.
- Collect no personal data unless a future feature has a documented need and
  consent flow.

## 20. Testing strategy

### 20.1 Ingestion tests

- XML fixtures for each required service.
- missing/extra attribute behavior;
- duplicate IDs;
- error envelopes;
- relationship resolution;
- snapshot rollback;
- sprite-to-file resolution;
- crop bounds;
- record-count safety thresholds.

### 20.2 Unit and component tests

- filter and sort logic;
- stat formatting;
- localization fallback;
- URL serialization;
- Markdown front matter;
- relationship rendering;
- missing-image fallback;
- comparison row behavior.

### 20.3 End-to-end tests

- switch language and retain route;
- search and open each major entity type;
- filter, sort, reload, and preserve state;
- compare entities via shared URL;
- navigate guide deep links;
- load with third-party APIs unavailable;
- load from stale snapshot;
- mobile navigation;
- keyboard-only primary journeys.

### 20.4 Content and asset audits

CI must fail for:

- broken internal guide links;
- missing active guide images;
- duplicate route slugs;
- duplicate entity IDs;
- unresolved required sprites/files;
- crop rectangles outside source-image bounds;
- invalid front matter;
- missing required English/Vietnamese UI strings.

## 21. Observability

Track:

- sync duration and status by endpoint;
- snapshot age;
- record counts and diffs;
- API latency/error rate;
- search latency and zero-result queries;
- missing-image rate;
- frontend route errors;
- third-party adapter availability.

Do not send entity searches or user identifiers to analytics by default.

## 22. Deployment

The deployment must include:

- frontend application;
- catalog API or pre-generated catalog JSON;
- normalized database or versioned snapshot artifacts;
- optimized referenced images;
- scheduled sync job;
- atomic snapshot activation;
- health endpoint reporting application and snapshot status.

Required environment separation:

- development;
- preview/staging;
- production.

Production must not depend on the developer's local
`AppData\LocalLow\SavySoda` directory.

## 23. Delivery phases

### Phase 0 — Foundation

- Add URL routing and localized app shell.
- Implement API fetcher, raw snapshots, schema checks, and normalized storage.
- Ingest file and sprite mappings.
- Build referenced-asset derivative pipeline.
- Add data freshness page.

Exit criteria:

- all required endpoints produce one valid local snapshot;
- snapshot rollback works;
- a sprite ID resolves to a rendered image;
- current tools remain reachable.

### Phase 1 — Core library

- Global search.
- Crew, Rooms, Ships, and Items catalogs and detail pages.
- Filtering, sorting, stable URLs, and comparisons.
- Guide entity linking.

Exit criteria:

- all four catalogs meet their acceptance criteria;
- English/Vietnamese UI works;
- mobile and accessibility smoke tests pass.

### Phase 2 — Extended systems

- Crafts, missiles, research, collections, training, skins, missions, and
  galaxy.
- Relationship graph completeness.
- Search index expansion.

Exit criteria:

- all ingested entity types are discoverable and linked;
- unresolved relationship audit is within an accepted threshold.

### Phase 3 — Guide and tools integration

- Convert guide accordions to document routes.
- Integrate the existing tools into routed navigation.
- Add contextual links between tools, guide topics, and library entities.
- Isolate and label third-party data.

### Phase 4 — Production hardening

- PWA/offline snapshot support if desired;
- SEO/prerendering;
- performance budgets;
- full E2E suite;
- monitoring;
- deployment automation;
- content/editor documentation.

## 24. Acceptance criteria by feature

### Data

- All 43 verified static endpoints can be fetched through the ingestion layer.
- A failed required endpoint never replaces the active snapshot.
- Every entity response exposes snapshot freshness.
- Character `ProfileSpriteId` resolves through `ListSprites2` and `ListFiles4`
  without filename guessing.

### Library

- Crew, room, ship, and item lists support search, filtering, sorting, and
  stable URLs.
- Detail pages show required fields and relationships.
- Missing optional data does not break page rendering.
- Lists remain responsive at full catalog size.

### Guide

- Every document has a stable route and localized metadata.
- Guide search covers title and body.
- Related entity links resolve.
- No active image or internal link is broken.

### Assets

- Only referenced optimized assets ship to production.
- Full source PNGs remain outside the deployed initial bundle.
- All rendered sprites use validated crop bounds.
- Duplicate source images are deduplicated by output hash where possible.

### Quality

- Production build passes.
- Automated tests cover critical journeys.
- WCAG 2.2 AA issues found by automated checks are resolved.
- Mobile layouts have no horizontal page overflow.
- Security headers and input validation are enabled.

## 25. Open implementation decisions

These decisions should be recorded before Phase 0 implementation:

1. Deployment target and whether it supports a persistent Node service.
2. SQLite plus generated JSON versus PostgreSQL plus live catalog API.
3. Client-rendered app with prerendering versus a framework with SSR.
4. Whether optimized assets are stored in the repository, object storage, or
   generated during deployment.
5. Whether market and fleet tools remain in the same application or become
   optional modules.
6. Snapshot retention duration and acceptable API polling cadence.
7. Editorial ownership and translation review workflow.

Recommended defaults for this repository:

- keep React/Vite for the first two phases;
- add a small Node ingestion/API package;
- use SQLite and immutable snapshot JSON initially;
- generate WebP thumbnails and sprite crops during sync;
- deploy catalog snapshots and hashed assets to static/object storage;
- keep authenticated game operations permanently out of scope.

## 26. Definition of done

The application is complete when:

- every supported official public catalog is represented in the library or
  intentionally documented as excluded;
- users can search, browse, compare, and deep-link all primary entity types;
- official facts, editorial advice, and third-party observations are visibly
  separated;
- English and Vietnamese experiences are usable end to end;
- the active snapshot can be refreshed and rolled back safely;
- production serves only required optimized assets;
- existing guide content and tools are integrated under stable routes;
- accessibility, performance, security, content, and data-integrity checks
  pass in CI.
