import { Router } from "express";

export const healthRouter = Router();

healthRouter.get("/", (_request, response) => {
  response.json({
    service: "api-gateway",
    status: "ok"
  });
});

