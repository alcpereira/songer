import { fetchSpotifySong } from '@/lib/fetchSpotify';
import { SearchResultItem } from '@/components/search/SearchResultItem';

type SearchResultProps = {
    query: string | undefined;
};

export function SearchResultPlaceHolder() {
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

export async function SearchResult({ query }: SearchResultProps) {
    if (!query) return null;
    const data = await fetchSpotifySong(query);

    if (!data || !data.tracks || !data.tracks.items) return null;

    const results = await data.tracks.items;

    return (
        <div className="flex flex-col gap-2 w-full" key={query}>
            {results.map((i) => (
                <SearchResultItem key={i.id} data={i} />
            ))}
        </div>
    );
}
