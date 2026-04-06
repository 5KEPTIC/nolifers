# System Architecture

## Product Goal

Build a unified portal where users can keep a living repository of everything they consume online, enrich it with ratings and notes, and receive recommendations that span multiple content types instead of living in isolated silos.

## Service Boundaries

### `apps/web`

- Renders dashboard, library, recommendation, and rating flows
- Manages client state, optimistic UI, and feature-level routing
- Talks only to the API gateway

### `services/api-gateway`

- Handles authentication, session/JWT validation, and user-aware routing
- Aggregates data from PostgreSQL-backed services and the analytics engine
- Exposes stable public REST endpoints for the portal
- Serves as the future integration point for external providers like Goodreads, MAL, Letterboxd, Spotify, and IMDb-style metadata sources

### `services/analytics-engine`

- Computes recommendation candidates
- Generates dashboard insight cards and trend data
- Scores content affinity across different media types
- Encapsulates experimentation logic so the gateway stays thin

### `infra/postgres`

- Stores source-of-truth transactional data
- Supports analytics feature generation and recommendation snapshots
- Starts with a relational core plus JSONB for provider-specific metadata

## Core Request Flow

1. A user opens the portal and requests dashboard data.
2. The web app calls the Node gateway.
3. The gateway resolves transactional data such as library counts, ratings, and recent activity.
4. The gateway asks the analytics engine for recommendation themes or insight modules.
5. The gateway merges both views into a single frontend-friendly response.
6. The frontend renders dashboard cards, charts, and recommendation shelves.

## Why This Split Works

- Node.js is a strong fit for request orchestration, JWT auth, and frontend-facing APIs.
- Spring Boot is a good home for recommendation heuristics, batch scoring, and future ML-assisted ranking.
- PostgreSQL gives the project a clean starting point for relational data with enough flexibility through `jsonb`.
- This structure keeps product iteration fast while leaving room for deeper analytics later.

## Initial Public API Shape

- `GET /health`
- `GET /api/v1/dashboard/summary`
- `GET /api/v1/library`
- `POST /api/v1/library`
- `GET /api/v1/recommendations/:userId`

## Internal Analytics API Shape

- `GET /internal/health`
- `GET /internal/recommendations/{userId}`

## Extension Points

- Add a dedicated auth service only if auth becomes operationally complex
- Add Redis for caching dashboard summaries and recommendation results
- Add background workers for metadata ingestion and external sync jobs
- Add event streaming when recommendation generation becomes asynchronous

## Suggested Milestones

1. Authentication, library CRUD, and ratings
2. Dashboard aggregation and charts
3. Recommendation tuning and cross-media similarity
4. External account linking and imports
5. Social features such as follows, lists, and public profiles

