import { Form, useNavigation } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  SearchResult as SearchResultType,
  ImageObject,
  UpdatedSpotifySearchResult,
} from "~/types";

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

type AddButtonProps = {
  name: SearchResultType["name"];
  artists: SearchResultType["artists"];
  imageURL: SearchResultType["album"]["images"][number]["url"];
  id: SearchResultType["id"];
  userId: number;
  disabled: boolean;
};

function AddButton({
  name,
  artists,
  imageURL,
  id,
  userId,
  disabled,
}: AddButtonProps) {
  const navigation = useNavigation();

  const isLoading = navigation.formAction === "/search";

  const artistString = artists.map((i) => i.name).join(", ");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" disabled={disabled}>
          {!disabled ? "Add" : "Already picked"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Suggest song</DialogTitle>
          <DialogDescription>
            Are you sure you want to add this song?
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <div className="h-72 w-72 flex-shrink-0">
              <img src={imageURL} alt={name} height={300} width={300} />
            </div>
            <div className="flex flex-col gap-4 justify-center">
              <div className="flex flex-col gap-4 justify-center flex-grow">
                <span className="text-2xl font-bold line-clamp-3">{name}</span>
                <span className="">{artistString}</span>
              </div>
            </div>
          </div>
        </div>
        <Form method="post">
          <input type="hidden" name="intent" value={"add"} />
          <input type="hidden" name="name" value={name} />
          <input type="hidden" name="artist" value={artistString} />
          <input type="hidden" name="imageUrl" value={imageURL} />
          <input type="hidden" name="spotifyId" value={id} />
          <input type="hidden" name="user_id" value={userId} />

          <Button disabled={isLoading} type="submit">
            {isLoading ? "Saving..." : "Save song"}
          </Button>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function SearchResultItem({
  data,
  disabled,
  userId,
}: {
  data: SearchResultType;
  disabled: boolean;
  userId: number;
}) {
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
      <AddButton
        name={data.name}
        artists={data.artists}
        imageURL={mediumImage.url}
        id={data.id}
        disabled={disabled}
        userId={userId}
      />
    </div>
  );
}

function SearchResult({
  spotifySearchResult,
  userInfo,
}: {
  spotifySearchResult: UpdatedSpotifySearchResult;
  userInfo: { userId: number; remainingSongs: number };
}) {
  const displayResultsOrNull = () => {
    if (spotifySearchResult.length === 0) return null;
    return spotifySearchResult.map((i) => (
      <SearchResultItem
        key={i.id}
        data={i}
        disabled={i.alreadyPicked}
        userId={userInfo.userId}
      />
    ));
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {userInfo.remainingSongs > 0 && displayResultsOrNull()}
    </div>
  );
}

export { SearchResult, SearchResultPlaceHolder };
