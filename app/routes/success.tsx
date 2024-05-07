import { type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  return { user };
}

export default function SuccessPage() {
  const data = useLoaderData<typeof loader>();

  return <h1>{JSON.stringify(data.user)}</h1>;
}
