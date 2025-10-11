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
  const embedUrl =
    type === 'tv' && season && episode
      ? `https://vidsrc.to/embed/tv/${id}/${season}/${episode}`
      : `https://vidsrc.to/embed/movie/${id}`;

  return (
    <div className="w-full aspect-video rounded-md overflow-hidden bg-[#1a1a1a]">
      <iframe
        src={embedUrl}
        allowFullScreen
        loading="lazy"
        className="w-full h-full border-none"
      />
    </div>
  );
}
