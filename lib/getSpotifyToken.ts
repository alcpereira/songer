export default async function getSpotifyToken() {
    const spotifyString = btoa(
        process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
    );

    const headers = new Headers();
    headers.append('Authorization', 'Basic ' + spotifyString);
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            headers: headers,
            method: 'POST',
            body: 'grant_type=client_credentials'
        });
        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error('Error:', error);
    }
}
