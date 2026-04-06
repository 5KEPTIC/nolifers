import { Router } from "express";
import { fetchRecommendations } from "../services/analytics-client.js";

export const recommendationRouter = Router();

recommendationRouter.get("/:userId", async (request, response, next) => {
  try {
    const recommendations = await fetchRecommendations(request.params.userId);
    response.json(recommendations);
  } catch (error) {
    next(error);
  }
});

