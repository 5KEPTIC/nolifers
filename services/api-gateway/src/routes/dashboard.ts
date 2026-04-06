import { Router } from "express";

export const dashboardRouter = Router();

dashboardRouter.get("/summary", (_request, response) => {
  response.json({
    hero: {
      headline: "Your media world, finally in one place.",
      subheadline:
        "Track the books, shows, anime, movies, albums, and rabbit holes that shape your taste, then turn that history into useful recommendations.",
      focusLabel: "System health",
      focusValue: "Gateway + analytics connected"
    },
    stats: [
      { label: "library items", value: "184", delta: "+12 this month" },
      { label: "rated titles", value: "79", delta: "43% completion coverage" },
      { label: "avg. score", value: "8.4/10", delta: "weighted across all media" }
    ],
    recentActivity: [
      { title: "The Left Hand of Darkness", contentType: "book", status: "completed", rating: 9.0 },
      { title: "Perfect Blue", contentType: "anime", status: "completed", rating: 9.4 },
      { title: "Discovery", contentType: "album", status: "completed", rating: 8.7 }
    ],
    recommendationThemes: [
      "Science fiction with political texture and emotional restraint",
      "Stylish psychological animation with strong directorial identity",
      "French house, nu-disco, and adjacent electronic records"
    ]
  });
});

