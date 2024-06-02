import { useState } from "react";

export function YouTubePlayer({ id }: { id: string }) {
  const [loading, setLoading] = useState(true);

  return (
    <div className="relative">
      {loading && (
        <p className="absolute w-[560px] h-[315px] flex items-center justify-center bg-gray-400">
          Loading...
        </p>
      )}
      <iframe
        width="560"
        height="315"
        src={`https://www.youtube.com/embed/${id}?autoplay=1`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        onLoad={() => setLoading(false)}
      ></iframe>
    </div>
  );
}
