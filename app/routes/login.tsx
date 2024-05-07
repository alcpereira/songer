import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { authenticator } from "~/.server/services/auth";
import { AuthorizationError } from "remix-auth";

export async function loader({ request }: LoaderFunctionArgs) {
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/success",
  });
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    return await authenticator.authenticate("user-pass", request, {
      successRedirect: "/success",
      throwOnError: true,
    });
  } catch (error) {
    if (error instanceof Response) return error;
    if (error instanceof AuthorizationError) {
      return error.message;
    }
    return null;
  }
}

export default function LoginPage() {
  const errorMessage = useActionData<typeof action>();
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Login</CardTitle>
        <CardDescription>
          Enter your username and password to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form method="POST">
          <div className="space-y-4">
            {errorMessage && (
              <p className="text-red-500 text-sm font-bold">{errorMessage}</p>
            )}
            <div className="space-y-2">
              <Label htmlFor="username">username</Label>
              <Input
                id="username"
                name="username"
                placeholder="super-singer"
                required
                type="text"
                autoComplete="username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                required
                type="password"
                name="password"
                autoComplete="current-password"
              />
            </div>
            <Button className="w-full" type="submit">
              Login
            </Button>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
