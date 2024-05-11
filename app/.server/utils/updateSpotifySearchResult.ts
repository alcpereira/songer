import { SearchResult, UpdatedSpotifySearchResult } from "~/types";

export function updateSpotifySearchResult(
  fetchedSongs: SearchResult[],
  existingSongs: {
    spotifyId: string;
  }[]
): UpdatedSpotifySearchResult {
  const songs: UpdatedSpotifySearchResult = fetchedSongs.map((song) => {
    return { ...song, alreadyPicked: false };
  });

  if (existingSongs.length === 0) {
    return songs;
  }

  const existingIds = existingSongs.map((e) => e.spotifyId);

  return songs.map((song) => {
    if (existingIds.includes(song.id)) {
      return { ...song, alreadyPicked: true };
    } else {
      return song;
    }
  });
}
