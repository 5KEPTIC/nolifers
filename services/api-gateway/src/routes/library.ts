import { Router } from "express";
import { z } from "zod";

const createLibraryEntrySchema = z.object({
  contentType: z.enum(["book", "movie", "show", "anime", "album", "game", "podcast", "article"]),
  title: z.string().min(1),
  creatorName: z.string().optional(),
  status: z.enum(["planned", "in_progress", "completed", "paused", "dropped", "rewatching"]),
  rating: z.number().min(0).max(10).optional()
});

const seededLibrary = [
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
  }
];

export const libraryRouter = Router();

libraryRouter.get("/", (_request, response) => {
  response.json({
    items: seededLibrary,
    total: seededLibrary.length
  });
});

libraryRouter.post("/", (request, response) => {
  const payload = createLibraryEntrySchema.parse(request.body);

  response.status(201).json({
    message: "Library entry accepted by gateway",
    item: {
      id: "pending-persistence",
      ...payload
    }
  });
});

