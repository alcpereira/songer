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
  youtubeLink: text("youtube_link").unique().notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  comment: text("comment").notNull(),
  title: text("title").notNull(),
});

export type InsertSong = typeof songs.$inferInsert;
export type SelectSong = typeof songs.$inferSelect;

export const likes = sqliteTable("likes", {
  id: integer("id").primaryKey(),
  songId: integer("song_id")
    .notNull()
    .references(() => songs.id),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  value: integer("value").notNull(),
});

export type InsertLike = typeof likes.$inferInsert;
export type SelectLike = typeof likes.$inferSelect;
