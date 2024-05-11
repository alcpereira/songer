import * as schema from "./schema";
import bcrypt from "bcryptjs";
import { unlink, writeFile, access } from "node:fs/promises";
import { join } from "node:path";
import { migrate } from "drizzle-orm/libsql/migrator";

type Users = Omit<schema.InsertUser, "hash"> & { unhashedPassword: string };

const USERS: Users[] = [
  {
    username: "alex",
    unhashedPassword: "alex",
    name: "Alex",
    permission: "admin",
  },
];

async function seed() {
  // Wiping database
  const pathToDb = join(import.meta.dirname, "local.db");
  await access(pathToDb);
  await unlink(pathToDb);
  await writeFile(pathToDb, "");
  console.log("[DB] 🌱 New DB created");

  // Applying schema
  const { db } = await import("./db");
  await migrate(db, {
    migrationsFolder: join(import.meta.dirname, "migrations"),
  });
  console.log("[DB] 🌱 Migration done");

  // Adding users
  USERS.forEach(async ({ name, username, unhashedPassword, permission }) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(unhashedPassword, salt);
    await db.insert(schema.users).values({ hash, name, username, permission });
    console.log("[DB] 🌱 Adding user", username);
  });
}

seed();
