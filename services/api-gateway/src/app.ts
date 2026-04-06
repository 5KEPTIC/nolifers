import cors from "cors";
import express from "express";
import { dashboardRouter } from "./routes/dashboard.js";
import { healthRouter } from "./routes/health.js";
import { libraryRouter } from "./routes/library.js";
import { recommendationRouter } from "./routes/recommendations.js";
import { errorHandler } from "./middleware/error-handler.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: true,
      credentials: true
    })
  );
  app.use(express.json());

  app.get("/", (_request, response) => {
    response.json({
      service: "api-gateway",
      status: "ready",
      docs: "/api/v1/dashboard/summary"
    });
  });

  app.use("/health", healthRouter);
  app.use("/api/v1/dashboard", dashboardRouter);
  app.use("/api/v1/library", libraryRouter);
  app.use("/api/v1/recommendations", recommendationRouter);
  app.use(errorHandler);

  return app;
}

