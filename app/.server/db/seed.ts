import * as schema from "./schema";
import bcrypt from "bcryptjs";
import { unlink, writeFile, access } from "node:fs/promises";
import { join } from "node:path";
import { migrate } from "drizzle-orm/libsql/migrator";

type Users = Omit<schema.InsertUser, "hash"> & { unhashedPassword: string };
type Songs = Omit<schema.InsertSong, "id">;

const USERS: Users[] = [
  {
    username: "alex",
    unhashedPassword: "alex",
    name: "Alex",
    permission: "admin",
  },
  {
    username: "xela",
    unhashedPassword: "xela",
    name: "Xela",
    permission: "user",
  },
];

const SONGS: Songs[] = [
  {
    userId: 1,
    comment: "Rick rolled",
    title: "Rick Astley - Never Gonna Give You Up",
    youtubeId: "dQw4w9WgXcQ",
  },
  {
    userId: 2,
    comment: "Crazy",
    title: "RATM - Bullet in the head",
    youtubeId: "fI677jYfKz0",
  },
];

async function seed() {
  // Wiping database
  const pathToDb = join(import.meta.dirname, "local.db");
  await access(pathToDb);
  await unlink(pathToDb);
  await writeFile(pathToDb, "");
  console.log("[Seed] 🌱 New DB created");

  // Applying schema
  const { db } = await import("./db");
  await migrate(db, {
    migrationsFolder: join(import.meta.dirname, "migrations"),
  });
  console.log("[Seed] 🌱 Migration done");

  // Adding users
  await Promise.all(
    USERS.map(async ({ name, username, unhashedPassword, permission }) => {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(unhashedPassword, salt);
      await db
        .insert(schema.users)
        .values({ hash, name, username, permission });
      console.log("[Seed] 🌱 Adding user", username);
    })
  );

  // Adding songs
  await Promise.all(
    SONGS.map(async ({ userId, comment, title, youtubeId }) => {
      await db
        .insert(schema.songs)
        .values({ userId, comment, title, youtubeId });
      console.log("[Seed] 🌱 Adding song", title);
    })
  );
}

seed();
