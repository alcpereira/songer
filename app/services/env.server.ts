import { z } from "zod";

const envSchema = z.object({
  SESSION_SECRETS: z.string().min(1),
  SPOTIFY_CLIENT_ID: z.string().min(1),
  SPOTIFY_CLIENT_SECRET: z.string().min(1),
  // TURSO_DATABASE_URL: z.string().min(1),
  // TURSO_AUTH_TOKEN: z.string().min(1),
  NODE_ENV: z.union([
    z.literal("development"),
    z.literal("production"),
    z.literal("test"),
  ]),
});

export const env = envSchema.parse(process.env);
