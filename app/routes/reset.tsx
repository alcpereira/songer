import { ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { removeAllLikes, removeAllSongs } from "~/.server/db/songs";
import { cn } from "~/lib/utils";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  if (formData.get("intent") === "songs") {
    return await removeAllSongs();
  } else if (formData.get("intent") === "likes") {
    return await removeAllLikes();
  } else {
    return {
      success: false,
      message: "Invalid intent",
    };
  }
}

export default function Reset() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="flex flex-col items-center w-full gap-4">
      <Form className="" method="POST">
        <input type="hidden" name="intent" value={"songs"} />
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
        >
          Reset songs + votes
        </button>
      </Form>
      <Form className="" method="POST">
        <input type="hidden" name="intent" value={"likes"} />
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
        >
          Reset votes
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
