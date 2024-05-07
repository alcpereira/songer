import { createCookieSessionStorage } from "@remix-run/node";

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
