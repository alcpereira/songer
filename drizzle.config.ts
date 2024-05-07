import type { Config } from "drizzle-kit";
import { env } from "~/services/env.server";

let url: string;
let authToken: string | undefined;

if (env.NODE_ENV === "production") {
  url = env.TURSO_DATABASE_URL;
  authToken = env.TURSO_AUTH_TOKEN;
  console.log("[DB] Running DB in production mode");
} else {
  url = "file:./app/db/local.db";
  console.log("[DB] Running DB in local mode");
}

export default {
  schema: "./app/db/schema.server.ts",
  out: "./app/db/migrations",
  driver: "turso",
  dbCredentials: {
    url,
    authToken,
  },
} satisfies Config;
