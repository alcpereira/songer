import { youtube } from "@googleapis/youtube";

const yt = youtube({ version: "v3", auth: process.env.YOUTUBE_API });

export async function getYoutubeTitle(id: string) {
  const items = (await yt.videos.list({ part: ["snippet"], id: [id] })).data
    .items;
  if (!items || items.length === 0) return null;
  return {
    id: items[0].id,
    title: items[0].snippet?.title,
    thumbnail: items[0].snippet?.thumbnails?.default,
  };
}
