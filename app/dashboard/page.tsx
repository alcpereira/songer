import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { db } from '@/lib/drizzle';
import { songs, likes } from '@/db/schema';
import { sql, eq } from 'drizzle-orm';
import { DashboardItem } from '@/components/dashboard';

export default async function DashboardPage() {
    const session = await getServerSession();

    if (!session) {
        redirect('/api/auth/signin');
    }

    const songsResult = await db
        .select({
            songName: songs.name,
            artists: songs.artist,
            image: songs.spotifyImage,
            likes: sql<number>`count(${likes.liked}) filter(where ${likes.liked} = true)`,
            dislikes: sql<number>`count(${likes.disliked}) filter(where ${likes.disliked} = true)`,
            superLikes: sql<number>`count(${likes.superLiked}) filter(where ${likes.superLiked} = true)`,
            superDislikes: sql<number>`count(${likes.superDisliked}) filter(where ${likes.superDisliked} = true)`
        })
        .from(songs)
        .leftJoin(likes, eq(likes.songId, songs.id))
        .groupBy(songs.id);

    songsResult.sort((a, b) => {
        const bTotal = Number(b.superLikes) * 2 + Number(b.likes);
        const aTotal = Number(a.superLikes) * 2 + Number(a.likes);
        return bTotal - aTotal;
    });

    return (
        <main className="flex flex-grow max-w-[1000px] w-full flex-col items-start justify-between p-24 gap-4">
            {songsResult.map((song) => (
                <DashboardItem
                    key={`${song.songName}-${song.artists}`}
                    songName={song.songName}
                    artists={song.artists}
                    imageURL={song.image}
                    data={{
                        likes: song.likes,
                        dislikes: song.dislikes,
                        superLikes: song.superLikes,
                        superDislikes: song.superDislikes
                    }}
                />
            ))}
        </main>
    );
}
