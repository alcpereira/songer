import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticator } from "~/.server/services/auth";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  if (user.permission !== "admin") {
    throw redirect("/");
  }

  return { user };
}

export default function AdminPage() {
  const data = useLoaderData<typeof loader>();

  return <h1>{JSON.stringify(data.user)}</h1>;
}
