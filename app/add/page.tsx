import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { SearchSong } from '@/components/search/SearchSong';

export default async function AddPage() {
    const session = await getServerSession();

    if (!session) {
        redirect('/api/auth/signin');
    }

    return (
        <main className="flex flex-grow flex-col items-center justify-between p-24">
            <SearchSong />
        </main>
    );
}
