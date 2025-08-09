// components/VidSrcEmbed.tsx
'use client';

import React from 'react';

interface VidSrcEmbedProps {
  imdbId?: string;
  tmdbId?: string;
   contentType: 'movie' | 'tv';
  season?: number;
  episode?: number;
  dsLang?: string;
  subUrl?: string;
}

const VidSrcEmbed: React.FC<VidSrcEmbedProps> = ({
  imdbId,
  tmdbId,
  season,
  episode,
  dsLang,
  subUrl,
}) => {
  let src = 'https://vidsrc.xyz/embed/';

  if (season && episode && (imdbId || tmdbId)) {
    src += `tv/${imdbId || tmdbId}/${season}-${episode}`;
  } else if (imdbId || tmdbId) {
    src += `movie/${imdbId || tmdbId}`;
  } else {
    return <p className="text-red-500">Invalid ID</p>;
  }

  const params = new URLSearchParams();
  if (dsLang) params.set('ds_lang', dsLang);
  if (subUrl) params.set('sub_url', subUrl);

  return (
    <div className="w-full aspect-video">
      <iframe
        src={`${src}?${params.toString()}`}
        frameBorder="0"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  );
};

export default VidSrcEmbed;
