import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  JWT_SECRET: z.string().min(10).default("replace-with-a-long-random-secret"),
  ANALYTICS_BASE_URL: z.string().url().default("http://localhost:8081")
});

export const env = envSchema.parse(process.env);

