import { eq } from "drizzle-orm";
import { db } from "./db.server";
import { SelectUser, users } from "./schema.server";

export async function getUser(username: SelectUser["name"]) {
  return db.select().from(users).where(eq(users.username, username));
}
