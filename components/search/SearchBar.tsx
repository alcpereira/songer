'use client';

import { useDebounce } from 'use-debounce';
import { Input } from '../ui/input';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export function SearchBar() {
    const params = useSearchParams();
    const router = useRouter();
    const [value, setValue] = useState(params.get('search') || '');
    const [debouncedValue] = useDebounce(value, 500);

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    useEffect(() => {
        if (!debouncedValue) {
            router.push('/add');
        } else {
            router.push(`/add?${new URLSearchParams({ search: debouncedValue }).toString()}`);
        }
    }, [router, debouncedValue]);

    return <Input value={value} onChange={handleOnChange} placeholder="Search" />;
}
