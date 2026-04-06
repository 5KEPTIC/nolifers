export type ContentType =
  | "book"
  | "movie"
  | "show"
  | "anime"
  | "album"
  | "game"
  | "podcast"
  | "article";

export type LibraryStatus =
  | "planned"
  | "in_progress"
  | "completed"
  | "paused"
  | "dropped"
  | "rewatching";

export type LibraryEntry = {
  id: string;
  title: string;
  contentType: ContentType;
  creatorName?: string;
  status: LibraryStatus;
  rating?: number;
};

export type DashboardSummary = {
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

export type RecommendationItem = {
  title: string;
  contentType: ContentType;
  score: number;
  reason: string;
};

export type RecommendationResponse = {
  userId: string;
  generatedAt: string;
  source: string;
  items: RecommendationItem[];
};
