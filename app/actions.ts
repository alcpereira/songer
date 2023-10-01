'use server';

import { SongInsert, songs, likes } from '@/db/schema';
import { db } from '@/lib/drizzle';

export async function addSong(payload: SongInsert) {
    try {
        const addedSong = await db.insert(songs).values(payload).returning();
        console.log('Song added', addedSong);
        return { success: addedSong };
    } catch (err) {
        if (err instanceof Object && 'code' in err && err.code === '23505') {
            return { error: 'Song already exists' };
        } else {
            return { error: 'Unknown error, please check logs' };
        }
    }
}

export async function likeSong(
    songId: number,
    accountName: string,
    payload: 'liked' | 'superLiked' | 'disliked' | 'superDisliked'
) {
    try {
        const addedLike = await db
            .insert(likes)
            .values({
                accoutName: accountName,
                songId: songId,
                disliked: payload === 'disliked',
                superDisliked: payload === 'superDisliked',
                liked: payload === 'liked',
                superLiked: payload === 'superLiked'
            })
            .returning();
        console.log('Like added', addedLike);
        return { success: addedLike };
    } catch (err) {
        console.log(err);
        return { error: 'Unknown error, please check logs' };
    }
}
