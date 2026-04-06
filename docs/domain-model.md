# Domain Model

## Primary Entities

### User

- Owns the library, ratings, and dashboard
- Can later support follows, public shelves, and shared lists

### Content Item

- Canonical record for a book, movie, show, anime, album, game, or article
- Stores title, creators, release metadata, provider metadata, and cover art

### Library Entry

- Connects a user to a content item
- Tracks lifecycle states such as `planned`, `in_progress`, `completed`, `dropped`, and `rewatching`

### Rating

- Stores numeric score, text review, tagged emotions, and spoiler flag
- Allows multiple rating scales later if needed

### Recommendation Snapshot

- Stores generated recommendation batches for traceability
- Makes it easier to debug why something was recommended

## Initial Content Types

- `book`
- `movie`
- `show`
- `anime`
- `album`
- `game`
- `podcast`
- `article`

## First Dashboard Modules

- Total library count
- Monthly completion trend
- Top genres across all media
- Recent ratings
- Recommendation themes
- Streaks and activity heatmap

## Data Ownership

- PostgreSQL owns transactional state
- The API gateway owns response shaping for the frontend
- The analytics engine owns ranking and insight generation

## Sample User Journey

1. User adds a movie, manga, and album to the library.
2. User marks one as completed and gives it a rating.
3. Dashboard updates totals and recent activity.
4. Analytics engine returns recommendations based on rating history and genre overlap.

