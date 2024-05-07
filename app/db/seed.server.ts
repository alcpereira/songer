import { db } from "./db.server";
import { InsertUser, users } from "./schema.server";
import bcrypt from "bcryptjs";

const usersToInsert: (Omit<InsertUser, "hash"> & {
  unhashedPassword: string;
})[] = [
  {
    username: "alex",
    unhashedPassword: "alex",
    name: "Alex",
    permission: "admin",
  },
];

usersToInsert.forEach(
  async ({ name, username, unhashedPassword, permission }) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(unhashedPassword, salt);
    await db.insert(users).values({ hash, name, username, permission });
  }
);
