'use client';

import React, { useState } from 'react';

// Define your available server providers
const SERVERS = [
  {id: 'vidsrc_cc', name: 'Server 1 (Stable)', base: 'https://vidsrc.cc/v2/embed'},
  { id: 'vidsrc_xyz', name: 'Server 2 (Primary)', base: 'https://vidsrc.xyz/embed' },
  { id: 'embed_su', name: 'Server 3 (Fast)', base: 'https://embed.su/embed' },
  { id: 'autoembed', name: 'Server 4 (No Ads)', base: 'https://player.autoembed.cc/embed' },
];

export default function VideoPlayer({
  id,
  type,
  season,
  episode,
}: {
  id: number;
  type: 'movie' | 'tv';
  season?: number;
  episode?: number;
}) {
  const [activeServer, setActiveServer] = useState(SERVERS[0]);

  // Construct URL based on the selected server logic
  const getEmbedUrl = (server: typeof SERVERS[0]) => {
    if (type === 'tv') {
      // Note: Different providers sometimes use different URL structures
      // Most follow the /tv/id/s/e pattern
      return `${server.base}/tv/${id}/${season || 1}/${episode || 1}`;
    }
    return `${server.base}/movie/${id}`;
  };

  return (
    <div className="space-y-4">
      {/* 1. The Player Container */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-2xl border border-[#3E2723]">
        <iframe
          key={activeServer.id} // Re-mounts iframe when server changes
          src={getEmbedUrl(activeServer)}
          className="absolute top-0 left-0 w-full h-full border-none"
          sandbox="allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation"
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
          loading="lazy"
          title="Streaming Player"
        />
      </div>

      {/* 2. Server Selection Buttons */}
      <div className="flex flex-wrap gap-3 items-center">
        <span className="text-sm font-medium text-[#BCAAA4]">Switch Server:</span>
        {SERVERS.map((server) => (
          <button
            key={server.id}
            onClick={() => setActiveServer(server)}
            className={`px-4 py-2 rounded-md text-xs font-semibold transition-all duration-300 border ${
              activeServer.id === server.id
                ? 'bg-[#FF8A65] text-black border-[#FF8A65]'
                : 'bg-[#1a1a1a] text-[#FBE9E7] border-[#333] hover:border-[#FF8A65]'
            }`}
          >
            {server.name}
          </button>
        ))}
      </div>
      
      <p className="text-[10px] text-zinc-500 italic">
  Note: If the player doesn&apos;t load, try switching to a different server.
</p>
    </div>
  );
}