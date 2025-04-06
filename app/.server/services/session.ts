import { createCookieSessionStorage } from "@remix-run/node";
import { User } from "./auth";

if (!process.env.SESSION_SECRETS) {
  throw new Error("[ENV] Session secret not set");
}

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: process.env.SESSION_SECRETS.split(","),
    secure: process.env.NODE_ENV === "production",
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;

export async function getUserSession(request: Request): Promise<User | null> {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );
  const user = session.get("user");
  if (!user) {
    return null;
  } else {
    return user as User;
  }
}
