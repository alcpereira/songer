import { fetchSpotifySong } from '@/lib/fetchSpotify';
import { SearchResultItem } from '@/components/search/SearchResultItem';

type SearchResultProps = {
    query: string | null;
};

export async function SearchResult({ query }: SearchResultProps) {
    if (!query) return null;

    const data = await fetchSpotifySong(query);

    const results = await data.tracks.items;

    return (
        <div className="flex flex-col gap-2 w-full">
            {results.map((i) => (
                <SearchResultItem key={i.id} data={i} />
            ))}
        </div>
    );
}
