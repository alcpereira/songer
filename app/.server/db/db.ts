import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { env } from "~/.server/services/env";

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

const client = createClient({
  url,
  authToken,
});

export const db = drizzle(client);
