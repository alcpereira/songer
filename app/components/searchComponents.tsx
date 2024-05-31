import { youtube_v3 } from "@googleapis/youtube";
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
import { Input } from "./ui/input";

function SearchResultPlaceHolder() {
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex gap-4 w-full items-center">
        <div className="h-[90px] w-[120px] bg-gray-700 rounded-md animate-pulse"></div>
        <p className="h-8 flex-grow bg-gray-800 rounded-md animate-pulse "></p>
        <div className="w-32 h-10 bg-gray-700 rounded-md animate-pulse"></div>
      </div>
    </div>
  );
}

type AddButtonProps = {
  youtubeId: string;
  thumbnail: youtube_v3.Schema$Thumbnail;
  title: string;
  userId: number;
  disabled: boolean;
};

function AddButton({
  youtubeId,
  userId,
  title,
  disabled,
  thumbnail,
}: AddButtonProps) {
  const navigation = useNavigation();
  const isLoading = navigation.formAction === "/search";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" disabled={disabled} className="min-w-32">
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
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <div className="flex-shrink-0">
                <img
                  src={thumbnail.url!}
                  alt={title}
                  height={thumbnail.height!}
                  width={thumbnail.width!}
                />
              </div>
              <div className="flex flex-col gap-4 justify-center">
                <div className="flex flex-col gap-4 justify-center flex-grow">
                  <span className="text-m font-medium line-clamp-3">
                    {title}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <Form method="post" className="flex flex-col gap-8">
            <Input
              type="text"
              id="comment"
              name="comment"
              placeholder="Add a comment if you want"
              maxLength={100}
            />
            <input type="hidden" name="intent" value={"add"} />
            <input type="hidden" name="title" value={title} />
            <input type="hidden" name="youtube_id" value={youtubeId} />
            <input type="hidden" name="user_id" value={userId} />

            <Button disabled={isLoading} type="submit">
              {isLoading ? "Saving..." : "Save song"}
            </Button>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SearchResult({
  youtubeVideo,
  userId,
}: {
  youtubeVideo: {
    exists: boolean;
    id?: string | null | undefined;
    title?: string | null | undefined;
    thumbnail?: youtube_v3.Schema$Thumbnail | undefined;
  };
  userId: number;
}) {
  if (
    !youtubeVideo ||
    !youtubeVideo.title ||
    !youtubeVideo.thumbnail ||
    !youtubeVideo.id
  )
    return null;

  return (
    <div className="flex gap-4 w-full items-center">
      <div className="">
        <img
          src={youtubeVideo.thumbnail.url!}
          alt={youtubeVideo.title}
          height={youtubeVideo.thumbnail.height!}
          width={youtubeVideo.thumbnail.width!}
          className="rounded-md border border-gray-800"
        />
      </div>
      <div className="flex flex-grow flex-col gap-1 justify-center">
        <p className="font-bold line-clamp-1">{youtubeVideo.title}</p>
      </div>
      <AddButton
        thumbnail={youtubeVideo.thumbnail}
        title={youtubeVideo.title}
        youtubeId={youtubeVideo.id}
        disabled={youtubeVideo.exists}
        userId={userId}
      />
    </div>
  );
}

export { SearchResult, SearchResultPlaceHolder };
