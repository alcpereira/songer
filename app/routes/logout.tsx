import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { sessionStorage } from "~/.server/services/session";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );
  return redirect("/login", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}
