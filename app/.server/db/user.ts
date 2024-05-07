import { eq } from "drizzle-orm";
import { db } from "./db";
import { SelectUser, users } from "./schema";

export async function getUser(username: SelectUser["name"]) {
  return db.select().from(users).where(eq(users.username, username));
}
