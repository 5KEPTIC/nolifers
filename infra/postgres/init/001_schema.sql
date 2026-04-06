create extension if not exists "pgcrypto";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'content_type') then
    create type content_type as enum (
      'book',
      'movie',
      'show',
      'anime',
      'album',
      'game',
      'podcast',
      'article'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'library_status') then
    create type library_status as enum (
      'planned',
      'in_progress',
      'completed',
      'paused',
      'dropped',
      'rewatching'
    );
  end if;
end $$;

create table if not exists app_user (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  username text not null unique,
  display_name text not null,
  password_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists content_item (
  id uuid primary key default gen_random_uuid(),
  content_type content_type not null,
  title text not null,
  creator_name text,
  release_year integer,
  source_provider text,
  source_external_id text,
  cover_image_url text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create unique index if not exists idx_content_provider_external
  on content_item (source_provider, source_external_id)
  where source_provider is not null and source_external_id is not null;

create table if not exists library_entry (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references app_user (id) on delete cascade,
  content_item_id uuid not null references content_item (id) on delete cascade,
  status library_status not null default 'planned',
  started_on date,
  completed_on date,
  progress_value numeric(8, 2),
  progress_unit text,
  is_favorite boolean not null default false,
  notes text,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, content_item_id)
);

create index if not exists idx_library_entry_user_status
  on library_entry (user_id, status);

create table if not exists rating (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references app_user (id) on delete cascade,
  content_item_id uuid not null references content_item (id) on delete cascade,
  score numeric(3, 1) not null check (score >= 0 and score <= 10),
  review text,
  spoiler boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, content_item_id)
);

create table if not exists recommendation_snapshot (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references app_user (id) on delete cascade,
  generated_at timestamptz not null default now(),
  model_version text not null,
  rationale_summary text
);

create table if not exists recommendation_item (
  id uuid primary key default gen_random_uuid(),
  snapshot_id uuid not null references recommendation_snapshot (id) on delete cascade,
  content_item_id uuid not null references content_item (id) on delete cascade,
  rank_position integer not null,
  confidence_score numeric(5, 4) not null,
  reason text,
  unique (snapshot_id, rank_position)
);
