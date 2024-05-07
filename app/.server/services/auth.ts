import { Authenticator, AuthorizationError } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { sessionStorage } from "~/.server/services/session.server";
import { type SelectUser } from "~/.server/db/schema";
import { getUser } from "~/.server/db/user";
import bcrypt from "bcryptjs";

export type User = Omit<SelectUser, "hash">;

export const authenticator = new Authenticator<User>(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const username = String(form.get("username"));
    const password = String(form.get("password"));

    const [userFromDb] = await getUser(username);

    if (!userFromDb) {
      console.log("user not found");
      throw new AuthorizationError("User not found");
    }

    const passwordMatch = await bcrypt.compare(password, userFromDb.hash);

    if (!passwordMatch) {
      throw new AuthorizationError("Invalid password");
    }

    return {
      username: userFromDb.username,
      id: userFromDb.id,
      name: userFromDb.name,
      permission: userFromDb.permission,
    };
  }),
  "user-pass"
);
