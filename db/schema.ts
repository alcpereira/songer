import { relations, InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { boolean, integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const songs = pgTable('songs', {
    id: serial('id').primaryKey(),
    spotifyId: varchar('spotify_id', { length: 256 }).unique().notNull(),
    spotifyImage: varchar('spotify_image', { length: 256 }).notNull(),
    accountName: varchar('account_name', { length: 256 }).notNull(),
    name: varchar('name', { length: 256 }).notNull(),
    artist: varchar('artist', { length: 256 }).notNull(),
    acoustic: boolean('acoustic').default(false).notNull(),
    tuning: boolean('tuning').default(false).notNull(),
    feminine: boolean('feminine').default(false).notNull()
});

export type SongInsert = InferInsertModel<typeof songs>;
export type Song = InferSelectModel<typeof songs>;

export const songsRelations = relations(songs, ({ many }) => ({
    likes: many(likes)
}));

export const likes = pgTable('likes', {
    id: serial('id').primaryKey(),
    songId: integer('song_id').notNull(),
    accoutName: varchar('account_name', { length: 256 }).notNull(),
    liked: boolean('liked').default(false).notNull(),
    superLiked: boolean('super_liked').default(false).notNull(),
    disliked: boolean('disliked').default(false).notNull(),
    superDisliked: boolean('super_disliked').default(false).notNull()
});

export const likesRelations = relations(likes, ({ one }) => ({
    songId: one(songs, {
        fields: [likes.songId],
        references: [songs.id]
    })
}));
