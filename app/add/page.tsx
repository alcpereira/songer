import { SearchSong } from '@/components/SearchSong';
export default function Home() {
    return (
        <main className="flex flex-grow flex-col items-center justify-between p-24">
            <SearchSong />
        </main>
    );
}
