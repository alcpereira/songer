import { env } from "~/.server/services/env";
import { defineConfig } from "drizzle-kit";

let url: string;
let authToken: string | undefined;

if (env.NODE_ENV === "production") {
  url = env.TURSO_DATABASE_URL;
  authToken = env.TURSO_AUTH_TOKEN;
  console.log("[DB] Running DB in production mode");
} else {
  url = "file:./app/.server/db/local.db";
  console.log("[DB] Running DB in local mode");
}

export default defineConfig({
  schema: "./app/.server/db/schema.ts",
  dialect: "sqlite",
  driver: "turso",
  dbCredentials: {
    url,
    authToken,
  },
});
