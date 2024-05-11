import { eq } from "drizzle-orm";
import { db } from "./db";
import { SelectUser, users, songs, InsertSong } from "./schema";

export async function getRemainingSongs(userId: SelectUser["id"]) {
  const MAX_SONGS = 3;

  const rows = await db
    .select({ songId: songs.id })
    .from(songs)
    .leftJoin(users, eq(songs.userId, users.id))
    .where(eq(users.id, userId));
  return MAX_SONGS - rows.length;
}

export async function getAllSongsIds() {
  return await db.select({ spotifyId: songs.spotifyId }).from(songs);
}

export async function addSong(
  userId: SelectUser["id"],
  spotifyId: InsertSong["spotifyId"],
  artist: InsertSong["artist"],
  songName: InsertSong["name"],
  spotifyImage: InsertSong["spotifyImage"]
) {
  const remainingSongs = await getRemainingSongs(userId);

  if (remainingSongs === 0) {
    throw new Error("No remaining songs");
  }

  try {
    const result = await db
      .insert(songs)
      .values({ spotifyId, artist, name: songName, spotifyImage, userId });
    console.log(result.toJSON());
  } catch (error) {
    console.log("[DB] Error at `addSong`:", error);
  }
}
