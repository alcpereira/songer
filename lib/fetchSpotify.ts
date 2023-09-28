import { SpotifySearchResult } from '@/types/searchResult';
import getSpotifyToken from './getSpotifyToken';

export async function fetchSpotifySong(search: string) {
    if (!search) {
        throw new Error('No search term provided');
    }
    const token = await getSpotifyToken();

    if (!token) {
        throw new Error('No token provided');
    }

    const spotifyRequest = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURI(search)}&type=track&limit=10`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    const data: SpotifySearchResult = await spotifyRequest.json();
    return data;
}
