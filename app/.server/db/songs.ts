import { eq } from "drizzle-orm";
import { db } from "./db";
import { SelectUser, users, songs, InsertSong } from "./schema";
import xss from "xss";

export async function getRemainingSongs(userId: SelectUser["id"]) {
  const MAX_SONGS = 3;

  const rows = await db
    .select({ songId: songs.id })
    .from(songs)
    .leftJoin(users, eq(songs.userId, users.id))
    .where(eq(users.id, userId));
  return MAX_SONGS - rows.length;
}

export async function doSongExist(youtubeId: string) {
  const song = await db
    .select()
    .from(songs)
    .where(eq(songs.youtubeId, youtubeId));

  return song.length > 0;
}

export async function addSong({
  userId,
  youtubeId,
  comment,
  title,
}: {
  userId: SelectUser["id"];
  youtubeId: InsertSong["youtubeId"];
  comment: InsertSong["comment"];
  title: InsertSong["title"];
}) {
  const remainingSongs = await getRemainingSongs(userId);

  if (remainingSongs === 0) {
    throw new Error("No remaining songs");
  }
  const sanitizedComment = xss(comment);

  try {
    const result = await db
      .insert(songs)
      .values({ youtubeId, comment: sanitizedComment, title, userId });
    console.log("[DB] Added", result.rows);
  } catch (error) {
    console.log("[DB] Error at `addSong`:", error);
  }
}
