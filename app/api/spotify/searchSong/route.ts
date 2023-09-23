import { NextRequest, NextResponse } from 'next/server';
import getSpotifyToken from './getSpotifyToken';

export async function POST(request: NextRequest) {
    const token = await getSpotifyToken();

    const { search } = await request.json();

    if (!token) return NextResponse.json({ error: 'Error while getting Spotify token' });

    const spotifyRequest = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURI(search)}&type=track&limit=10`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
    const data = await spotifyRequest.json();
    return NextResponse.json(data);
}
