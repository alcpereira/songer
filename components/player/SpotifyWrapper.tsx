'use client';

import { useState } from 'react';
import Script from 'next/script';

export function SpotifyWrapper({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className="w-full">
            <Script
                src="https://open.spotify.com/embed-podcast/iframe-api/v1"
                onReady={() => {
                    setIsLoading(false);
                }}
            />
            {isLoading && <div className="">Loading Spotify Player...</div>}
            {!isLoading && <>{children}</>}
        </div>
    );
}
