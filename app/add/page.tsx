import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Suspense } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { SearchResult, SearchBar, SearchResultPlaceHolder } from '@/components/search';

export default async function AddPage({ searchParams }: { searchParams: { search?: string } }) {
    const session = await getServerSession();

    if (!session) {
        redirect('/api/auth/signin');
    }

    const searchQuery = searchParams.search || undefined;

    return (
        <main
            className="max-w-[1000px] w-full flex flex-grow flex-col items-center justify-between p-24"
            key={uuidv4()}
        >
            <SearchBar search={searchQuery || ''} />
            <Suspense fallback={<SearchResultPlaceHolder />}>
                <SearchResult query={searchQuery} />
            </Suspense>
        </main>
    );
}
