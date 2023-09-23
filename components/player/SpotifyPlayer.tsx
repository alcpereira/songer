type SpotifyID = string;

type SpotifyPlayerProps = {
    url: SpotifyID;
};

export function SpotifyPlayer({ url }: SpotifyPlayerProps) {
    return (
        <iframe
            style={{ borderRadius: '12px' }}
            src={`https://open.spotify.com/embed/track/${url}?utm_source=generator`}
            width="100%"
            height="152"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
        ></iframe>
    );
}
