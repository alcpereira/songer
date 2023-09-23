import Image from 'next/image';

import { Button } from '@/components/ui/button';

type SearchResultItemSchema = {
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

type SearchResultItemProps = {
    data: SearchResultItemSchema;
};

export default function SearchResultItem({ data }: SearchResultItemProps) {
    const smallImage = data.album.images.find(
        (i) => i.height === 64
    ) as SearchResultItemSchema['album']['images'][0];

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
            <div>
                <Button variant={'secondary'}>Add</Button>
            </div>
        </div>
    );
}
