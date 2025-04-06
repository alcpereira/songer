import { Form, useActionData } from "@remix-run/react";
import { removeAllSongs } from "~/.server/db/songs";
import { cn } from "~/lib/utils";

export async function action() {
  return await removeAllSongs();
}

export default function Reset() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="flex flex-col items-center justify-center w-full gap-4">
      <Form className="mt-8 space-y-4" method="POST">
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
        >
          Reset database
        </button>
      </Form>
      {actionData && (
        <div
          className={cn(actionData.success ? "text-green-500" : "text-red-500")}
        >
          {actionData.message}
        </div>
      )}
    </div>
  );
}
