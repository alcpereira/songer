import { defineConfig } from "drizzle-kit";

let url: string;
let authToken: string | undefined;

if (process.env.NODE_ENV === "production") {
  url = process.env.TURSO_DATABASE_URL;
  authToken = process.env.TURSO_AUTH_TOKEN;
  console.log("[DB] Running DB in production mode");
} else {
  url = "file:./app/.server/db/local.db";
  console.log("[DB] Running DB in local mode");
}

export default defineConfig({
  schema: "./app/.server/db/schema.ts",
  dialect: "turso",
  dbCredentials: {
    url,
    authToken,
  },
  out: "./app/.server/db/migrations",
});
