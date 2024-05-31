import { type SpotifySearchResult } from "~/types";

async function getSpotifyToken() {
  const spotifyString = btoa(
    process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET
  );

  const headers = new Headers();
  headers.append("Authorization", "Basic " + spotifyString);
  headers.append("Content-Type", "application/x-www-form-urlencoded");

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      headers: headers,
      method: "POST",
      body: "grant_type=client_credentials",
    });
    const data = await response.json();
    return data.access_token as unknown as string;
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function fetchSpotifySong(search: string) {
  if (!search) {
    throw new Error("No search term provided");
  }
  const token = await getSpotifyToken();

  if (!token) {
    throw new Error("No token provided");
  }

  const spotifyRequest = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURI(
      search
    )}&type=track&limit=10`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const result =
    (await spotifyRequest.json()) as unknown as SpotifySearchResult;
  return result.tracks.items;
}
