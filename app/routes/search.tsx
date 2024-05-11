import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { authenticator } from "~/.server/services/auth";
import { fetchSpotifySong } from "~/.server/services/spotify";
import { SearchResult, SearchResultPlaceHolder } from "../components/search";
import { addSong, getRemainingSongs } from "~/.server/db/songs";

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
    return { userInfo, songs: await fetchSpotifySong(searchParam) };
  } else {
    return { userInfo, songs: null };
  }
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request);

  if (!user) {
    return json({ error: "Not authorized" });
  }

  const formData = await request.formData();
  if (formData.get("intent") === "add") {
    const name = String(formData.get("name"));
    const artist = String(formData.get("artist"));
    const imageUrl = String(formData.get("imageUrl"));
    const spotifyId = String(formData.get("spotifyId"));
    const userId = Number(formData.get("user_id"));

    if (userId !== user.id) {
      return json({ error: "Not authorized" });
    }

    if (!name || !artist || !imageUrl || !spotifyId || !userId) {
      console.log(name, artist, imageUrl, spotifyId, userId);
      return json({ error: "Invalid form" });
    }
    try {
      addSong(userId, spotifyId, artist, name, imageUrl);
    } catch (_) {
      return json({ error: "Error trying to add" });
    }
  }
  return null;
};

export default function Search() {
  // const data = useActionData<typeof action>();
  const data = useLoaderData<typeof loader>();
  const navigation = useNavigation();

  const isLoaderLoading = navigation.state === "loading";

  if (data.userInfo.remainingSongs === 0) {
    return (
      <p className="text-red-600 text-xl text-center">No more songs for you</p>
    );
  }

  return (
    <main className="max-w-[1000px] w-full flex flex-grow flex-col items-center justify-between p-24 gap-8">
      <Form className="flex gap-2 w-full" method="GET">
        <Input
          className="flex-grow"
          placeholder="Search song on Spotify"
          id="search"
          name="search"
          required
        />
        <Button variant="secondary" type="submit">
          Search
        </Button>
      </Form>
      {isLoaderLoading && <SearchResultPlaceHolder />}
      {data.songs && !isLoaderLoading && (
        <SearchResult
          spotifySearchResult={data.songs}
          userInfo={data.userInfo}
        />
      )}
    </main>
  );
}
