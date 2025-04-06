import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getSongResults } from "~/.server/db/songs";
import { getUserSession } from "~/.server/services/session";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUserSession(request);

  if (!user) {
    throw redirect("/login");
  }

  if (user.permission !== "admin") {
    throw redirect("/");
  }

  return await getSongResults();
}

export default function AdminPage() {
  const data = useLoaderData<typeof loader>();

  // TODO: Add admin page
  return <h1>{JSON.stringify(data)}</h1>;
}
