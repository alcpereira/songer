import { getServerSession } from 'next-auth';

import { SpotifyPlayer, SpotifyWrapper } from '@/components/player';
import { db } from '@/lib/drizzle';
import { eq, isNull } from 'drizzle-orm';
import { songs, likes } from '@/db/schema';

export default async function Home() {
    const session = await getServerSession();

    if (!session) {
        return (
            <main className="flex flex-grow flex-col items-center justify-between p-24">
                <div className="flex flex-col items-center gap-4">
                    <h1 className="text-4xl font-bold">Welcome to Songer</h1>
                    <p className="text-xl">Please login</p>
                </div>
            </main>
        );
    }

    const songsWithoutLikes = await db
        .select({ id: songs.id, uri: songs.spotifyId })
        .from(songs)
        .leftJoin(likes, eq(likes.songId, songs.id))
        .where(isNull(likes));
    songsWithoutLikes.sort(() => Math.random() - 0.5);

    if (!songsWithoutLikes || songsWithoutLikes.length === 0)
        return (
            <main className="flex flex-grow flex-col items-center justify-between p-24">
                <div className="flex flex-col items-center gap-4">
                    <h1 className="text-4xl font-bold">Welcome to Songer</h1>
                    <p className="text-xl">Job done!</p>
                </div>
            </main>
        );

    return (
        <main className="flex w-full max-w-[1000px] flex-grow flex-col items-center justify-between p-24">
            <div className="flex w-full flex-col items-center gap-4">
                <h1 className="text-4xl font-bold">Welcome to Songer, {session?.user?.name}</h1>
                <p className="text-xl">Find good songs</p>
                <SpotifyWrapper>
                    <SpotifyPlayer songs={songsWithoutLikes} />
                </SpotifyWrapper>
            </div>
        </main>
    );
}
