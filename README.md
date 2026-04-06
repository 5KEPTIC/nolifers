<<<<<<< HEAD
# NoLifers

NoLifers is a personal media repository portal where users can track what they consume online, rate it, review it, and get dashboard insights plus cross-media recommendations for books, shows, anime, movies, and albums.

## Stack

- `apps/web`: React + TypeScript portal UI
- `services/api-gateway`: Node.js + Express gateway for auth, routing, and orchestration
- `services/analytics-engine`: Java + Spring Boot service for recommendations and trends
- `infra/postgres`: PostgreSQL schema bootstrap and local infrastructure
- `packages/contracts`: shared domain contracts for future frontend/backend alignment

## Architecture Snapshot

1. The React portal renders the dashboard, library, ratings, and recommendation views.
2. The Node gateway is the main entry point for browser clients and mobile clients later.
3. The Java analytics engine owns recommendation logic, trend scoring, and derived insights.
4. PostgreSQL stores users, media entities, library entries, ratings, and recommendation history.

## Initial Repository Layout

```text
nolifers/
├── apps/
│   └── web/
├── services/
│   ├── api-gateway/
│   └── analytics-engine/
├── packages/
│   └── contracts/
├── infra/
│   └── postgres/
└── docs/
```

## First Product Slice

- User profile and authentication boundary
- Personal library across multiple media types
- Ratings, reviews, and consumption status
- Dashboard summary with stats and recent activity
- Recommendation feed backed by the analytics engine

## Local Startup

Copy `.env.example` to `.env`, then use one of these flows:

- `docker compose up --build` for the full stack
- `npm install` at the repo root, then `npm run dev:web` and `npm run dev:gateway`
- `mvn spring-boot:run` inside `services/analytics-engine`

## Docs

- [Architecture](./docs/architecture.md)
- [Domain Model](./docs/domain-model.md)

=======
# nolifers
>>>>>>> a41a43013ce97e60493f906ae14a258d730dfcf4
