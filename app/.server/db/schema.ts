import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

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
  youtubeId: text("youtube_id").unique().notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  comment: text("comment").notNull(),
  title: text("title").notNull(),
});

export type InsertSong = typeof songs.$inferInsert;
export type SelectSong = typeof songs.$inferSelect;

export const likes = sqliteTable(
  "likes",
  {
    songId: integer("song_id")
      .notNull()
      .references(() => songs.id),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    value: integer("value").notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.songId, table.userId] }),
    };
  }
);

export type InsertLike = typeof likes.$inferInsert;
export type SelectLike = typeof likes.$inferSelect;
