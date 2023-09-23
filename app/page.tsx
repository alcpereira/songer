import { getServerSession } from 'next-auth';

import { SpotifyPlayer } from '@/components/player/SpotifyPlayer';
export default async function Home() {
    const session = await getServerSession();
    return (
        <main className="flex flex-grow flex-col items-center justify-between p-24">
            <div className="flex flex-col items-center gap-4">
                <h1 className="text-4xl font-bold">
                    Welcome to Songer{session && ', ' + session.user?.name}
                </h1>
                <p className="text-xl">Find good songs</p>
                {session && <SpotifyPlayer url="59WN2psjkt1tyaxjspN8fp" />}
            </div>
        </main>
    );
}
