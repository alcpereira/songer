import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { authenticator } from "~/.server/services/auth";
import { fetchSpotifySong } from "~/.server/services/spotify.server";
import { SearchResult, SearchResultPlaceHolder } from "./components";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const searchParam = new URL(request.url).searchParams.get("search");

  if (searchParam) {
    return { user, songs: await fetchSpotifySong(searchParam) };
  } else {
    return { user, songs: null };
  }
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  if (formData.get("intent") === "search") {
    const searchString = String(formData.get("search"));
    if (!searchString) {
      throw Error("wtf bro");
    }
    return await fetchSpotifySong(searchString);
  }
};

export default function Search() {
  // const data = useActionData<typeof action>();
  const data = useLoaderData<typeof loader>();
  const navigation = useNavigation();

  const isLoaderLoading = navigation.state === "loading";

  return (
    <main className="max-w-[1000px] w-full flex flex-grow flex-col items-center justify-between p-24">
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
      {data.songs && !isLoaderLoading && <SearchResult data={data.songs} />}
    </main>
  );
}
