import { env } from "../config/env.js";

const fallbackRecommendations = {
  userId: "demo-user",
  generatedAt: new Date().toISOString(),
  source: "gateway-fallback",
  items: [
    {
      title: "Children of Time",
      contentType: "book",
      score: 0.91,
      reason: "High overlap with cerebral science fiction and speculative worldbuilding."
    },
    {
      title: "Samurai Champloo",
      contentType: "anime",
      score: 0.88,
      reason: "Matches stylish direction, music-forward pacing, and character energy."
    },
    {
      title: "Random Access Memories",
      contentType: "album",
      score: 0.86,
      reason: "Strong adjacency to polished electronic records with disco roots."
    }
  ]
};

export async function fetchRecommendations(userId: string) {
  try {
    const response = await fetch(`${env.ANALYTICS_BASE_URL}/internal/recommendations/${userId}`);

    if (!response.ok) {
      throw new Error(`Analytics request failed with ${response.status}`);
    }

    return response.json();
  } catch {
    return {
      ...fallbackRecommendations,
      userId
    };
  }
}
