import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import stylesheet from "~/tailwind.css?url";
import { authenticator } from "./.server/services/auth";
import { Navbar } from "~/components/navbar";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request);

  return {
    isLoggedIn: user !== null,
    canSeeDashboard: user !== null && user.permission === "admin",
  };
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, canSeeDashboard } = useLoaderData<typeof loader>();
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="flex flex-col items-center gap-10">
        <Navbar isLoggedIn={isLoggedIn} canSeeDashboard={canSeeDashboard} />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
