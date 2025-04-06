import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { type SelectUser } from "~/.server/db/schema";
import { getUser } from "~/.server/db/user";
import bcrypt from "bcryptjs";

export type User = Omit<SelectUser, "hash">;

export const authenticator = new Authenticator<User>();

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const username = String(form.get("username"));
    const password = String(form.get("password"));

    const [userFromDb] = await getUser(username);

    if (!userFromDb) {
      console.log("[Auth] User not found");
      throw new Error("User not found");
    }

    const passwordMatch = await bcrypt.compare(password, userFromDb.hash);

    if (!passwordMatch) {
      console.log("[Auth] Invalid password");
      throw new Error("Invalid password");
    }

    console.log({
      username: userFromDb.username,
      id: userFromDb.id,
      name: userFromDb.name,
      permission: userFromDb.permission,
    });

    return {
      username: userFromDb.username,
      id: userFromDb.id,
      name: userFromDb.name,
      permission: userFromDb.permission,
    };
  }),
  "user-pass"
);
