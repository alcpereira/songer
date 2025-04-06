import {
  redirect,
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useActionData,
  useLoaderData,
  useNavigation,
  useRouteError,
} from "@remix-run/react";
import { getSongsToVote, voteForSong } from "~/.server/db/songs";
import { getUserSession } from "~/.server/services/session";
import Alert from "~/components/alert";
import { Button } from "~/components/ui/button";
import { YouTubePlayer } from "~/components/youtubePlayer";

export const meta: MetaFunction = () => {
  return [
    { title: "Songer" },
    { name: "description", content: "Let's choose a song" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUserSession(request);
  if (!user) {
    throw redirect("/login");
  }

  const songs = await getSongsToVote(user.id);

  if (songs.length === 0) {
    return { message: "No more songs to choose" };
  }

  const choosenSong = songs[Math.floor(Math.random() * songs.length)];

  return { data: { remainingSongsToVote: songs.length, choosenSong } };
}

export async function action({ request }: ActionFunctionArgs) {
  const user = await getUserSession(request);
  if (!user) {
    throw redirect("/login");
  }
  const formData = await request.formData();
  const voteValue = Number(formData.get("vote_value"));
  const songId = Number(formData.get("song_id"));

  return await voteForSong({ songId, value: voteValue, userId: user.id });
}

export default function Index() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const isLoading = navigation.state === "submitting";

  const renderActionMessage = () => {
    if (!actionData) return null;

    if ("error" in actionData) {
      return (
        <Alert
          message={actionData.error}
          variant="error"
          key={Math.random() * 1000} // Forcing React to re-render the compoent
        />
      );
    } else {
      return (
        <Alert
          message="Thank you for your vote"
          variant="success"
          key={`${actionData.data.songId}-${actionData.data.userId}`}
        />
      );
    }
  };

  if ("message" in loaderData) {
    return (
      <div className="flex flex-col gap-4 items-center">
        {renderActionMessage()}
        <p>No more songs to vote</p>
        <p>Thank you ❤️</p>
      </div>
    );
  }

  const { choosenSong, remainingSongsToVote } = loaderData.data;

  const renderButtons = () => {
    const values = [
      { value: -2, text: "🤮 -2" },
      { value: -1, text: "🤢 -1" },
      { value: 0, text: "😐 0" },
      { value: 1, text: "😁 1" },
      { value: 2, text: "😍 2" },
    ];
    return values.map((value) => {
      return (
        <Form method="POST" key={value.value}>
          <input type="hidden" name="vote_value" value={value.value} />
          <input type="hidden" name="song_id" value={choosenSong.songId} />
          <Button
            type="submit"
            className="min-w-20"
            variant={"outline"}
            disabled={isLoading}
          >
            {value.text}
          </Button>
        </Form>
      );
    });
  };

  return (
    <div className="w-full max-w-[1000px] flex items-center justify-center flex-col gap-10">
      {renderActionMessage()}
      <p>Remaining songs to vote: {remainingSongsToVote}</p>
      <YouTubePlayer id={choosenSong.youtubeId} />
      {choosenSong.songComment && (
        <p className="flex gap-2 self-start px-20">
          <span className="text-gray-500">Comment:</span>
          <span className="italic font-bold">{choosenSong.songComment}</span>
        </p>
      )}
      <div className="flex gap-10">{renderButtons()}</div>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
