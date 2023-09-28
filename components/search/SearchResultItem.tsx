'use client';

import Image from 'next/image';

import { AddButton } from '@/components/search';
import type { ImageObject, SearchResult } from '@/types/searchResult';

type SearchResultItemProps = {
    data: SearchResult;
};

export function SearchResultItem({ data }: SearchResultItemProps) {
    const smallImage = data.album.images.find((i) => i.height === 64) as ImageObject;

    const mediumImage = data.album.images.find((i) => i.height === 300) as ImageObject;

    return (
        <div className="flex gap-2 items-center">
            <div className="h-16 w-16">
                <Image
                    src={smallImage.url}
                    alt={data.album.name}
                    height={smallImage.height}
                    width={smallImage.width}
                    className="rounded-md border border-gray-800"
                    unoptimized
                />
            </div>
            <div className="flex flex-grow flex-col gap-1 justify-center">
                <p className="font-bold line-clamp-1">{data.name}</p>
                <p className="text-gray-300 text-sm">
                    {data.artists.map((i) => i.name).join(', ')}
                </p>
            </div>
            <AddButton
                name={data.name}
                artists={data.artists}
                imageURL={mediumImage.url}
                id={data.id}
            />
        </div>
    );
}
