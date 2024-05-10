import { eq } from "drizzle-orm";
import { db } from "./db";
import { SelectUser, users, songs } from "./schema";

export async function getRemainingSongs(userId: SelectUser["id"]) {
  const MAX_SONGS = 3;

  const rows = await db
    .select({ songId: songs.id })
    .from(songs)
    .leftJoin(users, eq(songs.userId, users.id))
    .where(eq(users.id, userId));
  return MAX_SONGS - rows.length;
}
