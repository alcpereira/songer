import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Suspense } from 'react';

import { SearchResult, SearchBar } from '@/components/search';

export default async function AddPage({ searchParams }: { searchParams: { search?: string } }) {
    const session = await getServerSession();

    if (!session) {
        redirect('/api/auth/signin');
    }

    const searchQuery = searchParams.search || '';

    return (
        <main className="flex flex-grow flex-col items-center justify-between p-24">
            <SearchBar />
            <Suspense fallback={<div className="text-2xl">Loading...</div>}>
                <SearchResult query={searchQuery} />
            </Suspense>
        </main>
    );
}
