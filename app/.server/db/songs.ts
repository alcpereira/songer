import { TransactionRollbackError, and, count, eq, isNull } from "drizzle-orm";
import { db } from "./db";
import {
  SelectUser,
  users,
  songs,
  InsertSong,
  likes,
  InsertLike,
} from "./schema";
import xss from "xss";

export async function getRemainingSongs(userId: SelectUser["id"]) {
  const MAX_SONGS = Number(process.env.MAX_SONGS);

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
}): Promise<{ error: string } | { data: InsertSong }> {
  const remainingSongs = await getRemainingSongs(userId);

  if (remainingSongs === 0) {
    console.log("[DB] Trying to add a song without remaining credits");
    return { error: "No remaining songs" };
  }
  const sanitizedComment = xss(comment);

  try {
    const [result] = await db
      .insert(songs)
      .values({ youtubeId, comment: sanitizedComment, title, userId })
      .returning();

    // Automatically add a like to the song
    await db.insert(likes).values({ songId: result.id, userId, value: 2 });

    console.log("[DB] Song added", result);
    return { data: result };
  } catch (error) {
    console.log("[DB] Error at `addSong`:", error);
    return { error: "Something went wrong" };
  }
}

export async function getSongsToVote(userId: SelectUser["id"]) {
  const rows = await db
    .select({
      songId: songs.id,
      youtubeId: songs.youtubeId,
      songTitle: songs.title,
      songComment: songs.comment,
    })
    .from(songs)
    .leftJoin(likes, and(eq(songs.id, likes.songId), eq(likes.userId, userId)))
    .leftJoin(users, eq(likes.userId, users.id))
    .where(isNull(likes.userId))
    .all();

  return rows;
}

export async function voteForSong({
  userId,
  songId,
  value,
}: {
  userId: InsertLike["userId"];
  songId: InsertLike["songId"];
  value: InsertLike["value"];
}): Promise<{ error: string } | { data: InsertLike }> {
  const isValidValue = [-2, -1, 0, 1, 2].includes(value);

  if (!userId || !songId || !isValidValue) {
    return { error: "Invalid vote" };
  }

  try {
    return await db.transaction(async (tx) => {
      const [existingVote] = await tx
        .select()
        .from(likes)
        .where(and(eq(likes.userId, userId), eq(likes.songId, songId)));

      if (existingVote) {
        tx.rollback();
      }

      const [data] = await tx
        .insert(likes)
        .values({ userId, songId, value })
        .returning();
      console.log("[DB] Vote added", data);
      return { data };
    });
  } catch (error) {
    if (error instanceof TransactionRollbackError) {
      return { error: "Already voted" };
    } else {
      console.log("[DB] Error at `voteForSong`:", error);
      return { error: "Something went wrong" };
    }
  }
}

type SongResult = {
  id: number;
  title: string;
  votes: {
    "-2": number;
    "-1": number;
    "0": number;
    "1": number;
    "2": number;
  };
};

export async function getSongResults() {
  const results = await db
    .select({
      id: songs.id,
      title: songs.title,
      voteValue: likes.value,
      voteCount: count(likes.value),
    })
    .from(songs)
    .leftJoin(likes, eq(likes.songId, songs.id))
    .groupBy(songs.id, likes.value);

  const output = new Map<number, SongResult>();

  for (const row of results) {
    const { id, title, voteValue, voteCount } = row;

    if (!output.has(id)) {
      output.set(id, {
        id,
        title,
        votes: {
          "-2": 0,
          "-1": 0,
          "0": 0,
          "1": 0,
          "2": 0,
        },
      });
    }

    if (!voteValue) {
      continue;
    }

    const songResult = output.get(id)!;
    const voteKey = String(voteValue);
    songResult.votes[voteKey as keyof SongResult["votes"]] = voteCount;

    output.set(id, songResult);
  }

  return Array.from(output.values()).map((song) => ({
    ...song,
    totalVotes: Object.values(song.votes).reduce((a, b) => a + b, 0),
  }));
}

export async function removeAllSongs() {
  try {
    await db.delete(songs);
    return { success: true, message: "All songs removed" };
  } catch (error) {
    console.log("[DB] Error at `removeAllSongs`:", error);
    return { success: false, message: "Something went wrong" };
  }
}

export async function removeAllLikes() {
  try {
    await db.delete(likes);
    return { success: true, message: "All likes removed" };
  } catch (error) {
    console.log("[DB] Error at `removeAllLikes`:", error);
    return { success: false, message: "Something went wrong" };
  }
}
