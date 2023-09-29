'use client';

import { Input } from '../ui/input';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { useState } from 'react';

export function SearchBar({ search }: { search?: string }) {
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState(search || '');

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        router.push(`/add?search=${searchQuery}`);
    };

    return (
        <form className="flex gap-2 w-full" onSubmit={onSubmit}>
            <Input
                className="flex-grow"
                value={searchQuery}
                placeholder="Search song on Spotify"
                id="search"
                onChange={(e) => setSearchQuery(e.currentTarget.value)}
            />
            <Button variant="secondary">Search</Button>
        </form>
    );
}
