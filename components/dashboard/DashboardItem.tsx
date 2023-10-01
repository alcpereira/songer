'use client';

import Image from 'next/image';
import { BarChart, Bar } from 'recharts';

type DashboardItemProps = {
    songName: string;
    artists: string;
    imageURL: string;
    data: {
        likes: number;
        dislikes: number;
        superLikes: number;
        superDislikes: number;
    };
};

export function DashboardItem({ songName, artists, imageURL, data }: DashboardItemProps) {
    const { likes, dislikes, superLikes, superDislikes } = data;
    const formattedData = [
        { name: 'Super Likes', value: Number(superLikes), fill: '#16a34a' },
        { name: 'Likes', value: Number(likes), fill: '#22c55e' },
        { name: 'Dislikes', value: Number(dislikes), fill: '#ef4444' },
        { name: 'Super Dislikes', value: Number(superDislikes), fill: '#b91c1c' }
    ];
    return (
        <div className="flex gap-4 items-center justify-start w-full border-b-[1px] border-b-slate-700 py-1">
            <div className="w-20 h-20">
                <Image alt={songName} width={80} height={80} src={imageURL} unoptimized />
            </div>
            <div className="flex flex-col gap-1 flex-grow">
                <span className="text-xl font-bold">{songName}</span>
                <span>{artists}</span>
            </div>
            <BarChart width={150} height={80} data={formattedData} className="border-gray-200">
                <Bar dataKey="value" label={{ fill: '#ccc', fontSize: 10 }} />
            </BarChart>
        </div>
    );
}
