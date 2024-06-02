import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { authenticator } from "~/.server/services/auth";
import {
  SearchResult,
  SearchResultPlaceHolder,
} from "../components/searchComponents";
import { addSong, doSongExist, getRemainingSongs } from "~/.server/db/songs";
import { getYoutubeTitle } from "~/.server/services/youtube";

function youtubeParser(url: string) {
  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length == 11 ? match[7] : false;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const userInfo = {
    userId: user.id,
    remainingSongs: await getRemainingSongs(user.id),
  };
  const searchParam = new URL(request.url).searchParams.get("search");

  if (searchParam) {
    const youtubeId = youtubeParser(searchParam);

    if (!youtubeId) {
      return { error: "Invalid URL" };
    }

    await new Promise((res) => setTimeout(() => res(true), 1000));
    const youtubeVideo = await getYoutubeTitle(youtubeId);
    const songsExists = await doSongExist(youtubeId);

    if (!youtubeVideo) {
      return { userInfo, youtubeVideo: null };
    }

    return { userInfo, youtubeVideo: { ...youtubeVideo, exists: songsExists } };
  } else {
    return { userInfo, youtubeVideo: null };
  }
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request);

  if (!user) {
    return json({ error: "Not authorized" });
  }

  const formData = await request.formData();
  if (formData.get("intent") === "add") {
    const title = String(formData.get("title"));
    const comment = String(formData.get("comment"));
    const youtubeId = String(formData.get("youtube_id"));
    const userId = Number(formData.get("user_id"));

    if (userId !== user.id) {
      return json({ error: "Not authorized" });
    }

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
  return null;
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
      {!isError && data.youtubeVideo && !isLoaderLoading && (
        <SearchResult
          youtubeVideo={data.youtubeVideo}
          userId={data.userInfo.userId}
        />
      )}
    </main>
  );
}
