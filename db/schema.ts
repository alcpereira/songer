import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const songs = pgTable('songs', {
    id: serial('id').primaryKey(),
    spotifyId: varchar('spotify_id', { length: 256 }),
    spotifyImage: varchar('spotify_image', { length: 256 }),
    accountName: varchar('account_name', { length: 256 }),
    name: varchar('name', { length: 256 }),
    artist: varchar('artist', { length: 256 }),
    acoustic: boolean('acoustic').default(false),
    tuning: boolean('tuning').default(false),
    feminine: boolean('feminine').default(false)
});

export const songsRelations = relations(songs, ({ many }) => ({
    likes: many(likes)
}));

export const likes = pgTable('likes', {
    id: serial('id').primaryKey(),
    songId: integer('song_id'),
    accoutName: varchar('account_name', { length: 256 }),
    liked: boolean('liked'),
    superLiked: boolean('super_liked'),
    disliked: boolean('disliked'),
    superDisliked: boolean('super_disliked')
});

export const likesRelations = relations(likes, ({ one }) => ({
    songId: one(songs, {
        fields: [likes.songId],
        references: [songs.id]
    })
}));
