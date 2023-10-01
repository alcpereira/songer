'use server';

import { SongInsert, songs } from '@/db/schema';
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
    console.log(songId, accountName, payload);
}
