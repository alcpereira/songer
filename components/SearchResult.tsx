// const ojb = {
//     album: {
//         album_type: 'album',
//         artists: [
//             {
//                 external_urls: {
//                     spotify: 'https://open.spotify.com/artist/2d0hyoQ5ynDBnkvAbJKORj'
//                 },
//                 href: 'https://api.spotify.com/v1/artists/2d0hyoQ5ynDBnkvAbJKORj',
//                 id: '2d0hyoQ5ynDBnkvAbJKORj',
//                 name: 'Rage Against The Machine',
//                 type: 'artist',
//                 uri: 'spotify:artist:2d0hyoQ5ynDBnkvAbJKORj'
//             }
//         ],
//         external_urls: {
//             spotify: 'https://open.spotify.com/album/4Io5vWtmV1rFj4yirKb4y4'
//         },
//         href: 'https://api.spotify.com/v1/albums/4Io5vWtmV1rFj4yirKb4y4',
//         id: '4Io5vWtmV1rFj4yirKb4y4',
//         images: [
//             {
//                 height: 640,
//                 url: 'https://i.scdn.co/image/ab67616d0000b2737676c7bf4e667590e496c2a3',
//                 width: 640
//             },
//             {
//                 height: 300,
//                 url: 'https://i.scdn.co/image/ab67616d00001e027676c7bf4e667590e496c2a3',
//                 width: 300
//             },
//             {
//                 height: 64,
//                 url: 'https://i.scdn.co/image/ab67616d000048517676c7bf4e667590e496c2a3',
//                 width: 64
//             }
//         ],
//         name: 'Rage Against The Machine - XX (20th Anniversary Special Edition)',
//         release_date: '1992',
//         release_date_precision: 'year',
//         total_tracks: 25,
//         type: 'album',
//         uri: 'spotify:album:4Io5vWtmV1rFj4yirKb4y4'
//     },
//     artists: [
//         {
//             external_urls: {
//                 spotify: 'https://open.spotify.com/artist/2d0hyoQ5ynDBnkvAbJKORj'
//             },
//             href: 'https://api.spotify.com/v1/artists/2d0hyoQ5ynDBnkvAbJKORj',
//             id: '2d0hyoQ5ynDBnkvAbJKORj',
//             name: 'Rage Against The Machine',
//             type: 'artist',
//             uri: 'spotify:artist:2d0hyoQ5ynDBnkvAbJKORj'
//         }
//     ],
//     disc_number: 1,
//     duration_ms: 243453,
//     explicit: true,
//     external_ids: {
//         isrc: 'USSM11205432'
//     },
//     external_urls: {
//         spotify: 'https://open.spotify.com/track/2rBHnIxbhkMGLpqmsNX91M'
//     },
//     href: 'https://api.spotify.com/v1/tracks/2rBHnIxbhkMGLpqmsNX91M',
//     id: '2rBHnIxbhkMGLpqmsNX91M',
//     is_local: false,
//     name: 'Bombtrack',
//     popularity: 67,
//     preview_url:
//         'https://p.scdn.co/mp3-preview/9507afb830ba002c6c07a8ca69ce9f1572a2bb99?cid=adf5cd3fd4d745e1a8048cc7eb836edb',
//     track_number: 1,
//     type: 'track',
//     uri: 'spotify:track:2rBHnIxbhkMGLpqmsNX91M'
// };

import SearchResultItem from './SearchResultItem';

type SearchResultSchema = {
    album: {
        name: string;
        images: {
            height: number;
            url: string;
            width: number;
        }[];
    };
    artists: {
        name: string;
    }[];
    name: string;
    id: string;
};

type SearchResultProps = {
    data: SearchResultSchema[];
};

export default function SearchResult({ data }: SearchResultProps) {
    if (!data || !data.length) return null;

    return (
        <div className="flex flex-col gap-2">
            {data.map((i) => (
                <SearchResultItem key={i.id} data={i} />
            ))}
        </div>
    );
}
