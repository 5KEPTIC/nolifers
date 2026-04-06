import { useEffect, useState, type FormEvent } from "react";
import { StatCard } from "../components/StatCard";

type ContentType = "book" | "movie" | "show" | "anime" | "album" | "game" | "podcast" | "article";
type LibraryStatus = "planned" | "in_progress" | "completed" | "paused" | "dropped" | "rewatching";
type RecommendationMode = "best-match" | "serendipity" | "comfort-zone";

type DashboardSummary = {
  hero: {
    headline: string;
    subheadline: string;
    focusLabel: string;
    focusValue: string;
  };
  stats: Array<{
    label: string;
    value: string;
    delta: string;
  }>;
  recentActivity: Array<{
    title: string;
    contentType: ContentType;
    status: LibraryStatus;
    rating?: number;
  }>;
  recommendationThemes: string[];
};

type LibraryItem = {
  id: string;
  title: string;
  contentType: ContentType;
  creatorName?: string;
  status: LibraryStatus;
  rating?: number;
};

type LibraryResponse = {
  items: LibraryItem[];
  total: number;
};

type RecommendationItem = {
  title: string;
  contentType: ContentType;
  score: number;
  reason: string;
};

type RecommendationResponse = {
  userId: string;
  generatedAt: string;
  source: string;
  items: RecommendationItem[];
};

type ConnectionState = {
  summary: boolean;
  library: boolean;
  recommendations: boolean;
};

type DraftEntry = {
  title: string;
  creatorName: string;
  contentType: ContentType;
  status: LibraryStatus;
  rating: string;
};

type QuickPreset = {
  id: string;
  title: string;
  description: string;
  contentType: ContentType | "all";
  status: LibraryStatus | "all";
  mode: RecommendationMode;
};

type IconName =
  | "refresh"
  | "plus"
  | "minus"
  | "reset"
  | "arrow-right"
  | "target"
  | "spark"
  | "shield"
  | "play"
  | "music"
  | "save"
  | "clear";

const mediaOptions: Array<ContentType | "all"> = [
  "all",
  "book",
  "movie",
  "show",
  "anime",
  "album",
  "game",
  "podcast",
  "article"
];

const statusOptions: Array<LibraryStatus | "all"> = [
  "all",
  "planned",
  "in_progress",
  "completed",
  "paused",
  "dropped",
  "rewatching"
];

const recommendationModes = [
  {
    id: "best-match",
    label: "Best Match",
    description: "Keep the strongest taste overlap at the top."
  },
  {
    id: "serendipity",
    label: "Wildcard",
    description: "Push adjacent picks and slight surprises forward."
  },
  {
    id: "comfort-zone",
    label: "Comfort Zone",
    description: "Lean into the kinds of things you already love."
  }
] as const satisfies ReadonlyArray<{
  id: RecommendationMode;
  label: string;
  description: string;
}>;

const quickPresets: QuickPreset[] = [
  {
    id: "resume-streak",
    title: "Resume streak",
    description: "Show active titles and keep the safest recommendations on top.",
    contentType: "all",
    status: "in_progress",
    mode: "best-match"
  },
  {
    id: "anime-night",
    title: "Anime night",
    description: "Focus the library and discovery queue around animation-heavy sessions.",
    contentType: "anime",
    status: "all",
    mode: "comfort-zone"
  },
  {
    id: "fresh-picks",
    title: "Fresh picks",
    description: "Look at the planned queue while giving wildcard suggestions more room.",
    contentType: "all",
    status: "planned",
    mode: "serendipity"
  },
  {
    id: "music-rabbit-hole",
    title: "Music rabbit hole",
    description: "Pull albums to the front when you want a faster, lower-friction session.",
    contentType: "album",
    status: "all",
    mode: "serendipity"
  }
];

const fallbackSummary: DashboardSummary = {
  hero: {
    headline: "Shape the next version of your media taste map.",
    subheadline:
      "Track what you finish, rescue what you paused, and keep a living queue that turns habits into better recommendations.",
    focusLabel: "Sync status",
    focusValue: "Ready for taste tuning"
  },
  stats: [
    { label: "library items", value: "184", delta: "+12 this month" },
    { label: "rated titles", value: "79", delta: "43% completion coverage" },
    { label: "avg. score", value: "8.4/10", delta: "weighted across all media" }
  ],
  recentActivity: [
    { title: "The Left Hand of Darkness", contentType: "book", status: "completed", rating: 9.0 },
    { title: "Cowboy Bebop", contentType: "anime", status: "rewatching", rating: 9.5 },
    { title: "Discovery", contentType: "album", status: "completed", rating: 8.7 },
    { title: "Citizen Sleeper", contentType: "game", status: "in_progress", rating: 8.9 }
  ],
  recommendationThemes: [
    "Science fiction with political texture and emotional restraint",
    "Psychological animation with strong directorial identity",
    "French house, nu-disco, and electronic records with warmth",
    "Character-driven games that feel reflective rather than noisy"
  ]
};

const fallbackLibrary: LibraryItem[] = [
  {
    id: "lib-1",
    title: "The Left Hand of Darkness",
    contentType: "book",
    creatorName: "Ursula K. Le Guin",
    status: "completed",
    rating: 9.0
  },
  {
    id: "lib-2",
    title: "Cowboy Bebop",
    contentType: "anime",
    creatorName: "Shinichiro Watanabe",
    status: "rewatching",
    rating: 9.5
  },
  {
    id: "lib-3",
    title: "Discovery",
    contentType: "album",
    creatorName: "Daft Punk",
    status: "completed",
    rating: 8.7
  },
  {
    id: "lib-4",
    title: "Citizen Sleeper",
    contentType: "game",
    creatorName: "Jump Over the Age",
    status: "in_progress",
    rating: 8.9
  },
  {
    id: "lib-5",
    title: "Paris, Texas",
    contentType: "movie",
    creatorName: "Wim Wenders",
    status: "planned"
  },
  {
    id: "lib-6",
    title: "99% Invisible",
    contentType: "podcast",
    creatorName: "Roman Mars",
    status: "paused"
  }
];

const fallbackRecommendations: RecommendationResponse = {
  userId: "demo-user",
  generatedAt: "2026-04-02T18:15:00.000Z",
  source: "frontend-fallback",
  items: [
    {
      title: "Children of Time",
      contentType: "book",
      score: 0.91,
      reason: "Strong overlap with cerebral science fiction, worldbuilding, and patient pacing."
    },
    {
      title: "Samurai Champloo",
      contentType: "anime",
      score: 0.88,
      reason: "Matches music-forward direction, stylish editing, and character chemistry."
    },
    {
      title: "Random Access Memories",
      contentType: "album",
      score: 0.86,
      reason: "Keeps the polished electronic palette but opens the door to warmer disco textures."
    },
    {
      title: "Outer Wilds",
      contentType: "game",
      score: 0.84,
      reason: "Reflective exploration with mystery, mood, and a strong sense of personal discovery."
    },
    {
      title: "Perfect Blue",
      contentType: "anime",
      score: 0.83,
      reason: "High confidence match for psychological animation with a confident directorial voice."
    }
  ]
};

const emptyDraftEntry: DraftEntry = {
  title: "",
  creatorName: "",
  contentType: "book",
  status: "planned",
  rating: ""
};

const initialConnectionState: ConnectionState = {
  summary: false,
  library: false,
  recommendations: false
};

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`);
  }

  return (await response.json()) as T;
}

function formatLabel(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatScore(score: number) {
  return `${Math.round(score * 100)}% match`;
}

function rankRecommendation(item: RecommendationItem, mode: RecommendationMode) {
  switch (mode) {
    case "serendipity":
      return item.score + (item.contentType === "album" || item.contentType === "game" ? 0.08 : 0.03);
    case "comfort-zone":
      return item.score + (item.contentType === "book" || item.contentType === "anime" ? 0.06 : 0.02);
    case "best-match":
    default:
      return item.score;
  }
}

function buildRecommendationQueue(
  items: RecommendationItem[],
  mode: RecommendationMode,
  activeContentType: ContentType | "all"
) {
  const filteredItems =
    activeContentType === "all"
      ? items
      : items.filter((item) => item.contentType === activeContentType);

  return [...filteredItems].sort(
    (left, right) => rankRecommendation(right, mode) - rankRecommendation(left, mode)
  );
}

function buildLocalLibraryItem(draftEntry: DraftEntry): LibraryItem {
  return {
    id: `local-${Date.now()}`,
    title: draftEntry.title.trim(),
    creatorName: draftEntry.creatorName.trim() || undefined,
    contentType: draftEntry.contentType,
    status: draftEntry.status,
    rating: draftEntry.rating === "" ? undefined : Number(draftEntry.rating)
  };
}

function getModeIcon(mode: RecommendationMode): IconName {
  switch (mode) {
    case "serendipity":
      return "spark";
    case "comfort-zone":
      return "shield";
    case "best-match":
    default:
      return "target";
  }
}

function getPresetIcon(presetId: QuickPreset["id"]): IconName {
  switch (presetId) {
    case "resume-streak":
      return "play";
    case "anime-night":
      return "spark";
    case "music-rabbit-hole":
      return "music";
    case "fresh-picks":
    default:
      return "target";
  }
}

function PortalIcon({ name }: { name: IconName }) {
  switch (name) {
    case "refresh":
      return (
        <svg className="button-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M16.5 8.5A6.5 6.5 0 1 0 18 13" />
          <path d="M16 3.5v5h-5" />
        </svg>
      );
    case "plus":
      return (
        <svg className="button-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M10 4.25v11.5" />
          <path d="M4.25 10h11.5" />
        </svg>
      );
    case "minus":
      return (
        <svg className="button-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M4.25 10h11.5" />
        </svg>
      );
    case "reset":
      return (
        <svg className="button-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M5 6.5V3.75H2.25" />
          <path d="M5 3.75A7 7 0 1 1 3.2 13.7" />
        </svg>
      );
    case "arrow-right":
      return (
        <svg className="button-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M4 10h10.5" />
          <path d="M10.5 5.75 15 10l-4.5 4.25" />
        </svg>
      );
    case "target":
      return (
        <svg className="button-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="4.25" />
          <path d="M10 2.75v2.25" />
          <path d="M10 15v2.25" />
          <path d="M2.75 10H5" />
          <path d="M15 10h2.25" />
        </svg>
      );
    case "spark":
      return (
        <svg className="button-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="m10 2.75 1.6 4.05L15.75 8.4l-4.15 1.6L10 14.25 8.4 10 4.25 8.4 8.4 6.8 10 2.75Z" />
        </svg>
      );
    case "shield":
      return (
        <svg className="button-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M10 3.25 15.5 5.5v4.2c0 3.1-2.1 5.95-5.5 7.05-3.4-1.1-5.5-3.95-5.5-7.05V5.5L10 3.25Z" />
        </svg>
      );
    case "play":
      return (
        <svg className="button-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="m7 5.25 7 4.75L7 14.75V5.25Z" />
        </svg>
      );
    case "music":
      return (
        <svg className="button-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M12.75 4.25v8.1" />
          <path d="M12.75 4.25 7.5 5.5v8.1" />
          <circle cx="6.75" cy="14" r="1.75" />
          <circle cx="12" cy="12.5" r="1.75" />
        </svg>
      );
    case "save":
      return (
        <svg className="button-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M4.75 3.75h8.75l1.75 1.75v10.75H4.75V3.75Z" />
          <path d="M7 3.75v4h5.25v-4" />
          <path d="M7.5 12.5h5" />
        </svg>
      );
    case "clear":
      return (
        <svg className="button-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="m5.5 5.5 9 9" />
          <path d="m14.5 5.5-9 9" />
        </svg>
      );
  }
}

function IconBadge({ name }: { name: IconName }) {
  return (
    <span className="button-icon-badge" aria-hidden="true">
      <PortalIcon name={name} />
    </span>
  );
}

export function DashboardPage() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";
  const [summary, setSummary] = useState<DashboardSummary>(fallbackSummary);
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>(fallbackLibrary);
  const [recommendations, setRecommendations] = useState<RecommendationResponse>(fallbackRecommendations);
  const [connectionState, setConnectionState] = useState<ConnectionState>(initialConnectionState);
  const [searchValue, setSearchValue] = useState("");
  const [activeContentType, setActiveContentType] = useState<ContentType | "all">("all");
  const [activeStatus, setActiveStatus] = useState<LibraryStatus | "all">("all");
  const [recommendationMode, setRecommendationMode] = useState<RecommendationMode>("best-match");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [draftEntry, setDraftEntry] = useState<DraftEntry>(emptyDraftEntry);

  useEffect(() => {
    const abortController = new AbortController();

    async function hydratePortal() {
      const [summaryResult, libraryResult, recommendationResult] = await Promise.allSettled([
        fetchJson<DashboardSummary>(`${apiBaseUrl}/api/v1/dashboard/summary`, abortController.signal),
        fetchJson<LibraryResponse>(`${apiBaseUrl}/api/v1/library`, abortController.signal),
        fetchJson<RecommendationResponse>(
          `${apiBaseUrl}/api/v1/recommendations/demo-user`,
          abortController.signal
        )
      ]);

      if (abortController.signal.aborted) {
        return;
      }

      const nextConnectionState: ConnectionState = {
        summary: summaryResult.status === "fulfilled",
        library: libraryResult.status === "fulfilled",
        recommendations: recommendationResult.status === "fulfilled"
      };

      setSummary(summaryResult.status === "fulfilled" ? summaryResult.value : fallbackSummary);
      setLibraryItems(libraryResult.status === "fulfilled" ? libraryResult.value.items : fallbackLibrary);
      setRecommendations(
        recommendationResult.status === "fulfilled" ? recommendationResult.value : fallbackRecommendations
      );
      setConnectionState(nextConnectionState);
    }

    void hydratePortal();

    return () => {
      abortController.abort();
    };
  }, [apiBaseUrl]);

  async function handleRefresh() {
    setIsRefreshing(true);

    try {
      const [summaryResult, libraryResult, recommendationResult] = await Promise.allSettled([
        fetchJson<DashboardSummary>(`${apiBaseUrl}/api/v1/dashboard/summary`),
        fetchJson<LibraryResponse>(`${apiBaseUrl}/api/v1/library`),
        fetchJson<RecommendationResponse>(`${apiBaseUrl}/api/v1/recommendations/demo-user`)
      ]);

      const nextConnectionState: ConnectionState = {
        summary: summaryResult.status === "fulfilled",
        library: libraryResult.status === "fulfilled",
        recommendations: recommendationResult.status === "fulfilled"
      };

      setSummary(summaryResult.status === "fulfilled" ? summaryResult.value : fallbackSummary);
      setLibraryItems(libraryResult.status === "fulfilled" ? libraryResult.value.items : fallbackLibrary);
      setRecommendations(
        recommendationResult.status === "fulfilled" ? recommendationResult.value : fallbackRecommendations
      );
      setConnectionState(nextConnectionState);
    } finally {
      setIsRefreshing(false);
    }
  }

  async function handleAddEntry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = draftEntry.title.trim();
    const parsedRating = draftEntry.rating === "" ? undefined : Number(draftEntry.rating);

    if (trimmedTitle.length === 0) {
      setFormMessage("Add a title before saving.");
      return;
    }

    if (
      parsedRating !== undefined &&
      (Number.isNaN(parsedRating) || parsedRating < 0 || parsedRating > 10)
    ) {
      setFormMessage("Rating must stay between 0 and 10.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      title: trimmedTitle,
      creatorName: draftEntry.creatorName.trim() || undefined,
      contentType: draftEntry.contentType,
      status: draftEntry.status,
      rating: parsedRating
    };

    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/library`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Save failed with ${response.status}`);
      }

      const created = (await response.json()) as { item: LibraryItem };
      setLibraryItems((currentItems) => [created.item, ...currentItems]);
      setConnectionState((currentState) => ({
        ...currentState,
        library: true
      }));
      setFormMessage("Saved through the gateway and added to your queue.");
    } catch {
      setLibraryItems((currentItems) => [buildLocalLibraryItem(draftEntry), ...currentItems]);
      setFormMessage("Gateway unavailable, so the item was added locally for this session.");
    } finally {
      setDraftEntry(emptyDraftEntry);
      setIsSubmitting(false);
      setIsAddOpen(true);
    }
  }

  function applyPreset(preset: QuickPreset) {
    setSearchValue("");
    setActiveContentType(preset.contentType);
    setActiveStatus(preset.status);
    setRecommendationMode(preset.mode);
  }

  function clearFilters() {
    setSearchValue("");
    setActiveContentType("all");
    setActiveStatus("all");
    setRecommendationMode("best-match");
  }

  const normalizedSearchValue = searchValue.trim().toLowerCase();
  const filteredLibraryItems = libraryItems.filter((item) => {
    const matchesContentType =
      activeContentType === "all" || item.contentType === activeContentType;
    const matchesStatus = activeStatus === "all" || item.status === activeStatus;
    const matchesSearch =
      normalizedSearchValue.length === 0 ||
      `${item.title} ${item.creatorName ?? ""}`.toLowerCase().includes(normalizedSearchValue);

    return matchesContentType && matchesStatus && matchesSearch;
  });

  const filteredActivity = summary.recentActivity.filter((entry) => {
    const matchesContentType =
      activeContentType === "all" || entry.contentType === activeContentType;
    const matchesStatus = activeStatus === "all" || entry.status === activeStatus;

    return matchesContentType && matchesStatus;
  });

  const visibleRecommendations = buildRecommendationQueue(
    recommendations.items,
    recommendationMode,
    activeContentType
  );

  const availableContentTypes = mediaOptions.filter(
    (option) =>
      option === "all" ||
      libraryItems.some((item) => item.contentType === option) ||
      summary.recentActivity.some((entry) => entry.contentType === option) ||
      recommendations.items.some((item) => item.contentType === option)
  );

  const ratedLibraryItems = libraryItems.filter((item) => item.rating !== undefined);
  const completionRate = libraryItems.length
    ? Math.round(
        (libraryItems.filter((item) => item.status === "completed").length / libraryItems.length) *
          100
      )
    : 0;
  const averageLibraryRating = ratedLibraryItems.length
    ? (
        ratedLibraryItems.reduce((total, item) => total + (item.rating ?? 0), 0) /
        ratedLibraryItems.length
      ).toFixed(1)
    : "n/a";
  const liveServiceCount = Object.values(connectionState).filter(Boolean).length;
  const highlightedItem =
    filteredLibraryItems.find(
      (item) => item.status === "in_progress" || item.status === "paused" || item.status === "planned"
    ) ?? filteredLibraryItems[0];
  const generatedAtLabel = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(recommendations.generatedAt));

  return (
    <main className="shell">
      <header className="topbar panel">
        <div className="brand-lockup">
          <div className="brand-mark">
            <span>nolifers</span>
          </div>
          <div className="brand-copy">
            <h2>NoLifers Portal</h2>
          </div>
        </div>
        <div className="utility-actions topbar-actions">
          <span className={`status-pill ${liveServiceCount === 3 ? "is-live" : "is-seeded"}`}>
            {liveServiceCount}/3 services live
          </span>
          <button
            type="button"
            className="ghost-button"
            onClick={() => void handleRefresh()}
            disabled={isRefreshing}
          >
            <IconBadge name="refresh" />
            {isRefreshing ? "Refreshing..." : "Refresh data"}
          </button>
          <button
            type="button"
            className="primary-button"
            onClick={() => setIsAddOpen((currentValue) => !currentValue)}
          >
            <IconBadge name={isAddOpen ? "minus" : "plus"} />
            {isAddOpen ? "Hide quick add" : "Quick add"}
          </button>
        </div>
      </header>

      <section className="hero-grid">
        <div className="hero-copy">
          <h1>{summary.hero.headline}</h1>
          <p>{summary.hero.subheadline}</p>

          <div className="hero-actions">
            <button
              type="button"
              className="primary-button"
              onClick={() => setIsAddOpen(true)}
            >
              <IconBadge name="plus" />
              Add something new
            </button>
            <button type="button" className="ghost-button" onClick={clearFilters}>
              <IconBadge name="reset" />
              Reset view
            </button>
          </div>

          <div className="signal-grid">
            <article className="signal-card">
              <span className="eyebrow">Current view</span>
              <strong>{filteredLibraryItems.length}</strong>
              <p>titles matching your filters</p>
            </article>
            <article className="signal-card">
              <span className="eyebrow">Library average</span>
              <strong>{averageLibraryRating}</strong>
              <p>across rated items</p>
            </article>
            <article className="signal-card">
              <span className="eyebrow">Completion rate</span>
              <strong>{completionRate}%</strong>
              <p>of saved entries finished</p>
            </article>
          </div>
        </div>

        <div className="hero-stack">
          <article className="panel feature-card">
            <div className="section-header section-header-row">
              <div>
                <span className="eyebrow">{summary.hero.focusLabel}</span>
                <h2>{summary.hero.focusValue}</h2>
              </div>
              <span className={`status-pill ${liveServiceCount === 3 ? "is-live" : "is-seeded"}`}>
                {liveServiceCount === 3 ? "Live" : "Seeded"}
              </span>
            </div>

            <p>
              {liveServiceCount === 3
                ? "The summary feed, library gateway, and recommendation queue are all arriving from active services."
                : "The interface stays useful even when services sleep by blending in local seed data for any missing feed."}
            </p>

            <div className="service-grid">
              <div className={`service-chip ${connectionState.summary ? "is-live" : ""}`}>
                <span>Summary</span>
                <strong>{connectionState.summary ? "Live" : "Local"}</strong>
              </div>
              <div className={`service-chip ${connectionState.library ? "is-live" : ""}`}>
                <span>Library</span>
                <strong>{connectionState.library ? "Live" : "Local"}</strong>
              </div>
              <div className={`service-chip ${connectionState.recommendations ? "is-live" : ""}`}>
                <span>Discovery</span>
                <strong>{connectionState.recommendations ? "Live" : "Local"}</strong>
              </div>
            </div>
          </article>

          <article className="panel feature-card feature-card-alt">
            <span className="eyebrow">Next best move</span>
            <h2>{highlightedItem ? highlightedItem.title : "Build a queue worth returning to"}</h2>
            <p>
              {highlightedItem
                ? `${formatLabel(highlightedItem.status)} ${formatLabel(highlightedItem.contentType)}${highlightedItem.creatorName ? ` by ${highlightedItem.creatorName}` : ""}.`
                : "Use the quick add form to drop a title into your queue and start shaping future recommendations."}
            </p>

            {highlightedItem ? (
              <div className="inline-pill-row">
                <span className="media-pill">{formatLabel(highlightedItem.contentType)}</span>
                <span className="status-pill is-soft">{formatLabel(highlightedItem.status)}</span>
                <span className="status-pill is-soft">
                  {highlightedItem.rating !== undefined ? `${highlightedItem.rating.toFixed(1)}/10` : "Unrated"}
                </span>
              </div>
            ) : null}
          </article>
        </div>
      </section>

      <section className="stats-grid">
        {summary.stats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} delta={stat.delta} />
        ))}
      </section>

      <section className="filters-panel panel">
        <div className="filters-top">
          <label className="search-field">
            <span className="eyebrow">Search library</span>
            <input
              type="search"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search by title or creator"
            />
          </label>

          <div className="filters-summary">
            <span className="eyebrow">Discovery mode</span>
            <strong>{recommendationModes.find((mode) => mode.id === recommendationMode)?.label}</strong>
            <p>{recommendationModes.find((mode) => mode.id === recommendationMode)?.description}</p>
          </div>
        </div>

        <div className="filter-group">
          <span className="filter-label">Media</span>
          <div className="chip-row">
            {availableContentTypes.map((option) => (
              <button
                key={option}
                type="button"
                className={`chip-button ${activeContentType === option ? "is-active" : ""}`}
                onClick={() => setActiveContentType(option)}
              >
                {formatLabel(option)}
                <span>
                  {option === "all"
                    ? libraryItems.length
                    : libraryItems.filter((item) => item.contentType === option).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <span className="filter-label">Status</span>
          <div className="chip-row">
            {statusOptions.map((option) => (
              <button
                key={option}
                type="button"
                className={`chip-button ${activeStatus === option ? "is-active" : ""}`}
                onClick={() => setActiveStatus(option)}
              >
                {formatLabel(option)}
                <span>
                  {option === "all"
                    ? libraryItems.length
                    : libraryItems.filter((item) => item.status === option).length}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="workspace-grid">
        <article className="panel library-panel">
          <div className="section-header section-header-row">
            <div>
              <span className="eyebrow">Library explorer</span>
              <h2>Browse your queue</h2>
            </div>
            <span className="section-meta">{filteredLibraryItems.length} visible items</span>
          </div>

          <div className="library-list">
            {filteredLibraryItems.length > 0 ? (
              filteredLibraryItems.map((item) => (
                <article key={item.id} className="library-item">
                  <div className="library-item-header">
                    <div>
                      <div className="inline-pill-row">
                        <span className="media-pill">{formatLabel(item.contentType)}</span>
                        <span className="status-pill is-soft">{formatLabel(item.status)}</span>
                      </div>
                      <h3>{item.title}</h3>
                    </div>
                    <span className="score-pill">
                      {item.rating !== undefined ? `${item.rating.toFixed(1)}/10` : "Unrated"}
                    </span>
                  </div>

                  <p>{item.creatorName ?? "Creator not set yet"}</p>

                  <div className="item-actions">
                    <button
                      type="button"
                      className="text-button"
                      onClick={() => setActiveContentType(item.contentType)}
                    >
                      <PortalIcon name="arrow-right" />
                      More {formatLabel(item.contentType)}
                    </button>
                    <button
                      type="button"
                      className="text-button"
                      onClick={() => {
                        setSearchValue(item.title);
                        setActiveStatus("all");
                      }}
                    >
                      <PortalIcon name="target" />
                      Focus item
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <div className="empty-state">
                <strong>No items match this combination yet.</strong>
                <p>Reset the filters or add a new entry to open up the queue again.</p>
              </div>
            )}
          </div>
        </article>

        <div className="sidebar-stack">
          <article className="panel recommendations-panel">
            <div className="section-header section-header-row">
              <div>
                <span className="eyebrow">Discovery queue</span>
                <h2>Recommendations for this mood</h2>
              </div>
              <span className="section-meta">{generatedAtLabel}</span>
            </div>

            <div className="mode-row">
              {recommendationModes.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  className={`mode-button ${recommendationMode === mode.id ? "is-active" : ""}`}
                  onClick={() => setRecommendationMode(mode.id)}
                >
                  <div className="mode-button-head">
                    <IconBadge name={getModeIcon(mode.id)} />
                    <strong>{mode.label}</strong>
                  </div>
                  <span>{mode.description}</span>
                </button>
              ))}
            </div>

            <div className="recommendation-list">
              {visibleRecommendations.slice(0, 4).map((item, index) => (
                <article key={`${item.title}-${item.contentType}`} className="recommendation-item">
                  <div className="recommendation-rank">{String(index + 1).padStart(2, "0")}</div>
                  <div>
                    <div className="inline-pill-row">
                      <span className="media-pill">{formatLabel(item.contentType)}</span>
                      <span className="score-pill">{formatScore(item.score)}</span>
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.reason}</p>
                  </div>
                </article>
              ))}
            </div>

            <p className="panel-footnote">
              Source: {recommendations.source} for user {recommendations.userId}.
            </p>
          </article>

          <article className="panel quick-add-panel">
            <div className="section-header section-header-row">
              <div>
                <span className="eyebrow">Quick add</span>
                <h2>Capture the next title fast</h2>
              </div>
              <button
                type="button"
                className="ghost-button ghost-button-small"
                onClick={() => setIsAddOpen((currentValue) => !currentValue)}
              >
                <IconBadge name={isAddOpen ? "minus" : "plus"} />
                {isAddOpen ? "Collapse" : "Open"}
              </button>
            </div>

            <p className="panel-lead">
              Books, albums, anime, podcasts, and games can all land in the same queue without leaving the page.
            </p>

            {formMessage ? <p className="feedback-note">{formMessage}</p> : null}

            {isAddOpen ? (
              <form className="quick-add-form" onSubmit={handleAddEntry}>
                <label className="form-field">
                  <span>Title</span>
                  <input
                    type="text"
                    value={draftEntry.title}
                    onChange={(event) =>
                      setDraftEntry((currentValue) => ({
                        ...currentValue,
                        title: event.target.value
                      }))
                    }
                    placeholder="Add a title to the queue"
                  />
                </label>

                <label className="form-field">
                  <span>Creator</span>
                  <input
                    type="text"
                    value={draftEntry.creatorName}
                    onChange={(event) =>
                      setDraftEntry((currentValue) => ({
                        ...currentValue,
                        creatorName: event.target.value
                      }))
                    }
                    placeholder="Author, director, artist, studio"
                  />
                </label>

                <div className="form-grid">
                  <label className="form-field">
                    <span>Media type</span>
                    <select
                      value={draftEntry.contentType}
                      onChange={(event) =>
                        setDraftEntry((currentValue) => ({
                          ...currentValue,
                          contentType: event.target.value as ContentType
                        }))
                      }
                    >
                      {mediaOptions
                        .filter((option): option is ContentType => option !== "all")
                        .map((option) => (
                          <option key={option} value={option}>
                            {formatLabel(option)}
                          </option>
                        ))}
                    </select>
                  </label>

                  <label className="form-field">
                    <span>Status</span>
                    <select
                      value={draftEntry.status}
                      onChange={(event) =>
                        setDraftEntry((currentValue) => ({
                          ...currentValue,
                          status: event.target.value as LibraryStatus
                        }))
                      }
                    >
                      {statusOptions
                        .filter((option): option is LibraryStatus => option !== "all")
                        .map((option) => (
                          <option key={option} value={option}>
                            {formatLabel(option)}
                          </option>
                        ))}
                    </select>
                  </label>
                </div>

                <label className="form-field">
                  <span>Rating</span>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={draftEntry.rating}
                    onChange={(event) =>
                      setDraftEntry((currentValue) => ({
                        ...currentValue,
                        rating: event.target.value
                      }))
                    }
                    placeholder="Optional"
                  />
                </label>

                <div className="form-actions">
                  <button type="submit" className="primary-button" disabled={isSubmitting}>
                    <IconBadge name="save" />
                    {isSubmitting ? "Saving..." : "Save to library"}
                  </button>
                  <button
                    type="button"
                    className="ghost-button"
                    onClick={() => {
                      setDraftEntry(emptyDraftEntry);
                      setFormMessage("");
                    }}
                  >
                    <IconBadge name="clear" />
                    Clear
                  </button>
                </div>
              </form>
            ) : (
              <button
                type="button"
                className="primary-button"
                onClick={() => setIsAddOpen(true)}
              >
                <IconBadge name="plus" />
                Open quick add
              </button>
            )}
          </article>
        </div>
      </section>

      <section className="insight-grid">
        <article className="panel activity-panel">
          <div className="section-header">
            <span className="eyebrow">Recent activity</span>
            <h2>What the library remembers</h2>
          </div>

          <div className="activity-list">
            {filteredActivity.length > 0 ? (
              filteredActivity.map((entry) => (
                <div key={`${entry.title}-${entry.contentType}`} className="activity-item">
                  <div>
                    <strong>{entry.title}</strong>
                    <p>
                      {formatLabel(entry.contentType)} / {formatLabel(entry.status)}
                    </p>
                  </div>
                  <span>{entry.rating !== undefined ? `${entry.rating.toFixed(1)}/10` : "Unrated"}</span>
                </div>
              ))
            ) : (
              <div className="empty-state compact">
                <strong>No recent activity for this filter yet.</strong>
                <p>Switch media types or statuses to widen the window.</p>
              </div>
            )}
          </div>
        </article>

        <article className="panel themes-panel">
          <div className="section-header">
            <span className="eyebrow">Taste themes</span>
            <h2>Signals shaping discovery</h2>
          </div>

          <div className="theme-list">
            {summary.recommendationThemes.map((theme) => (
              <article key={theme} className="theme-card">
                <span className="eyebrow">Theme</span>
                <p>{theme}</p>
              </article>
            ))}
          </div>
        </article>

        <article className="panel preset-panel">
          <div className="section-header">
            <span className="eyebrow">Smart options</span>
            <h2>Jump into a mode</h2>
          </div>

          <div className="preset-list">
            {quickPresets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className="preset-card"
                onClick={() => applyPreset(preset)}
              >
                <div className="preset-head">
                  <IconBadge name={getPresetIcon(preset.id)} />
                  <strong>{preset.title}</strong>
                </div>
                <p>{preset.description}</p>
              </button>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
