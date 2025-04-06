import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  data,
  json,
  redirect,
} from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  SearchResult,
  SearchResultPlaceHolder,
} from "../components/searchComponents";
import { addSong, doSongExist, getRemainingSongs } from "~/.server/db/songs";
import { getYoutubeTitle } from "~/.server/services/youtube";
import { getUserSession } from "~/.server/services/session";

function youtubeParser(url: string) {
  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length == 11 ? match[7] : false;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getUserSession(request);
  if (!user) {
    throw redirect("/login");
  }

  const userInfo = {
    remainingSongs: await getRemainingSongs(user.id),
  };

  const searchParam = new URL(request.url).searchParams.get("search");

  if (searchParam) {
    const youtubeId = youtubeParser(searchParam);

    if (!youtubeId) {
      return { error: "Invalid URL" };
    }

    const youtubeVideo = await getYoutubeTitle(youtubeId);
    const songsExists = await doSongExist(youtubeId);

    if (!youtubeVideo) {
      return { userInfo, youtubeVideo: null };
    }

    return { userInfo, youtubeVideo: { ...youtubeVideo, exists: songsExists } };
  } else {
    return { userInfo };
  }
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await getUserSession(request);

  if (!user) {
    return json({ error: "Not authorized" });
  }

  const formData = await request.formData();
  if (formData.get("intent") === "add") {
    const title = String(formData.get("title"));
    const comment = String(formData.get("comment"));
    const youtubeId = String(formData.get("youtube_id"));
    const userId = user.id;

    if (comment.length > 100) {
      return json({ error: "Comment too long, you really tried this?" });
    }

    if (!title || !youtubeId || !userId) {
      return json({ error: "Invalid form" });
    }
    try {
      addSong({ userId, comment, title, youtubeId });
    } catch (e) {
      console.log("[Search Form] Error:", e);
      return json({ error: "Error trying to add" });
    }
  }
  return data(null);
};

export default function Search() {
  /**
   * @todo better UI feedback (loading, confirmation added)
   * May need to change to have only POST instead of GET here
   */
  const data = useLoaderData<typeof loader>();
  const navigation = useNavigation();

  const isLoaderLoading = navigation.state === "loading";

  const isError = "error" in data;

  if (!isError && data.userInfo.remainingSongs === 0) {
    return (
      <p className="text-green-500 text-xl text-center py-12">
        Thank you for submitting your songs
      </p>
    );
  }

  return (
    <main className="max-w-[1000px] w-full flex flex-grow flex-col items-start justify-between p-24 gap-8">
      <div className="flex flex-col gap-4 flex-grow justify-end w-full">
        {!isError && (
          <p>
            You have{" "}
            <span className="bold">{data.userInfo.remainingSongs}</span> songs
            left to add
          </p>
        )}
        <Form className="flex gap-2" method="GET">
          <Input
            className="flex-grow"
            placeholder="Paste the YouTube link. For example: https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            id="search"
            name="search"
            required
          />
          <Button variant="secondary" type="submit" className="min-w-32">
            Search
          </Button>
        </Form>
        {isError && <p className="text-red-600">Invalid URL</p>}
      </div>
      {isLoaderLoading && <SearchResultPlaceHolder />}
      {!isError &&
        !isLoaderLoading &&
        "youtubeVideo" in data &&
        data.youtubeVideo === null && <p>Video not found</p>}
      {!isError &&
        "youtubeVideo" in data &&
        data.youtubeVideo &&
        !isLoaderLoading && <SearchResult youtubeVideo={data.youtubeVideo} />}
    </main>
  );
}
