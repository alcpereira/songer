import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  username: text("username").unique().notNull(),
  permission: text("permission", { enum: ["user", "admin"] })
    .default("user")
    .notNull(),
  hash: text("hash").notNull(),
});

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

export const songs = sqliteTable("songs", {
  id: integer("id").primaryKey(),
  spotifyId: text("spotify_id").unique().notNull(),
  spotifyImage: text("spotify_image").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  name: text("name").notNull(),
  artist: text("artist").notNull(),
});

export type InsertSong = typeof songs.$inferInsert;
export type SelectSong = typeof songs.$inferSelect;

export const likes = sqliteTable("likes", {
  id: integer("id").primaryKey(),
  songId: integer("song_id")
    .notNull()
    .references(() => songs.id),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  value: text("value", {
    enum: ["liked", "disliked", "superliked", "superdisliked"],
  }).notNull(),
});

export type InsertLike = typeof likes.$inferInsert;
export type SelectLike = typeof likes.$inferSelect;
