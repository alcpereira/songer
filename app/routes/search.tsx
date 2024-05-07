import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, redirect, useActionData, useNavigation } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { authenticator } from "~/services/auth.server";
import { fetchSpotifySong } from "~/services/spotify.server";
import {
  ImageObject,
  SearchResult as SearchResultType,
  SpotifySearchResult,
} from "~/types/searchResult.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const body = await request.formData();
  const searchString = String(body.get("search"));
  if (!searchString) {
    throw redirect("/login");
  }
  const results = await fetchSpotifySong(searchString);

  return results;
};

function SearchResultPlaceHolder() {
  return (
    <div className="flex flex-col gap-2 w-full">
      {Array.from({ length: 10 }).map((_, i) => (
        <div className="flex gap-2 items-center" key={i}>
          <div className="h-16 w-16 bg-gray-700 rounded-md animate-pulse"></div>
          <div className="w-full first-letter:flex flex flex-grow flex-col gap-1 justify-center ">
            <p className="h-8 w-full bg-gray-800 rounded-md animate-pulse "></p>
            <p className="h-6 w-full bg-gray-800 rounded-md animate-pulse"></p>
          </div>
          <div className="w-16 h-10 bg-gray-700 rounded-md animate-pulse"></div>
        </div>
      ))}
    </div>
  );
}

export function SearchResultItem({ data }: { data: SearchResultType }) {
  const smallImage = data.album.images.find(
    (i) => i.height === 64
  ) as ImageObject;

  const mediumImage = data.album.images.find(
    (i) => i.height === 300
  ) as ImageObject;

  return (
    <div className="flex gap-2 items-center">
      <div className="h-16 w-16">
        <img
          src={smallImage.url}
          alt={data.album.name}
          height={smallImage.height}
          width={smallImage.width}
          className="rounded-md border border-gray-800"
        />
      </div>
      <div className="flex flex-grow flex-col gap-1 justify-center">
        <p className="font-bold line-clamp-1">{data.name}</p>
        <p className="text-gray-300 text-sm">
          {data.artists.map((i) => i.name).join(", ")}
        </p>
      </div>
      <Button>Add</Button>
      {/* <AddButton
              name={data.name}
              artists={data.artists}
              imageURL={mediumImage.url}
              id={data.id}
          /> */}
    </div>
  );
}

function SearchResult({ data }: { data: SpotifySearchResult }) {
  if (!data.tracks || !data.tracks.items) return null;

  return (
    <div className="flex flex-col gap-2 w-full">
      {data.tracks.items.map((i) => (
        <SearchResultItem key={i.id} data={i} />
      ))}
    </div>
  );
}

export default function Search() {
  const data = useActionData<typeof action>();
  const navigation = useNavigation();

  const isSubmitting = navigation.formAction === "/search";

  return (
    <main className="max-w-[1000px] w-full flex flex-grow flex-col items-center justify-between p-24">
      <Form className="flex gap-2 w-full" method="POST">
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
      {isSubmitting && <SearchResultPlaceHolder />}
      {data && !isSubmitting && <SearchResult data={data} />}
    </main>
  );
}
