'use client';

import { useEffect, useRef, useState, useTransition, useMemo } from 'react';
import { SpotifyIframeApi, EmbedController } from '@/types/spotifyPlayer';
import { likeSong } from '@/app/actions';
import { useSession } from 'next-auth/react';

declare global {
    interface Window {
        onSpotifyIframeApiReady: (arg0: SpotifyIframeApi) => void;
    }
}

type SpotifyPlayerProps = {
    songs: { id: number; uri: string }[];
};

export function SpotifyPlayer({ songs }: SpotifyPlayerProps) {
    const session = useSession();
    const [, startTransition] = useTransition();

    const ref = useRef<EmbedController | null>(null);

    const [currentSong, setCurrentSong] = useState<number>(0);
    const [isFinished, setIsFinished] = useState<boolean>(false);

    const options = useMemo(() => {
        return { uri: `spotify:track:${songs[0].uri}` };
    }, [songs]);

    const loadNextSong = () => {
        if (currentSong === songs.length - 1) {
            setIsFinished(true);
            return;
        }

        setCurrentSong((prev) => prev + 1);
        ref.current?.loadUri(`spotify:track:${songs[currentSong + 1].uri}`);
        ref.current?.play();
    };

    useEffect(() => {
        window.onSpotifyIframeApiReady = (IFrameAPI) => {
            const element = document.getElementById('embed-iframe');

            const callback = (EmbedController: EmbedController) => {
                ref.current = EmbedController;
            };
            IFrameAPI.createController(element as HTMLElement, options, callback);
        };
    }, [options]);

    useEffect(() => {
        if (isFinished) {
            ref.current?.destroy();
        }
    }, [isFinished]);

    return (
        <>
            <div key={'embed-iframe'} id={'embed-iframe'}></div>
            {isFinished && <div>No more songs</div>}
            {!isFinished && (
                <>
                    <div className="flex gap-4 w-full py-4 justify-center items-center">
                        <button
                            className="h-11 rounded-md w-1/5 bg-green-600"
                            onClick={() =>
                                startTransition(async () => {
                                    await likeSong(
                                        songs[currentSong].id,
                                        session.data?.user?.name as string,
                                        'superLiked'
                                    );
                                    loadNextSong();
                                })
                            }
                        >
                            Super Like
                        </button>
                        <button
                            className="h-11 rounded-md w-1/5 bg-green-500"
                            onClick={() =>
                                startTransition(async () => {
                                    await likeSong(
                                        songs[currentSong].id,
                                        session.data?.user?.name as string,
                                        'liked'
                                    );
                                    loadNextSong();
                                })
                            }
                        >
                            Like
                        </button>
                        <button
                            className="h-11 rounded-md w-1/5 bg-red-500"
                            onClick={() =>
                                startTransition(async () => {
                                    await likeSong(
                                        songs[currentSong].id,
                                        session.data?.user?.name as string,
                                        'disliked'
                                    );
                                    loadNextSong();
                                })
                            }
                        >
                            Dislike
                        </button>
                        <button
                            className="h-11 rounded-md w-1/5 bg-red-700"
                            onClick={() =>
                                startTransition(async () => {
                                    await likeSong(
                                        songs[currentSong].id,
                                        session.data?.user?.name as string,
                                        'superDisliked'
                                    );
                                    loadNextSong();
                                })
                            }
                        >
                            Super Dislike
                        </button>
                    </div>
                </>
            )}
        </>
    );
}
