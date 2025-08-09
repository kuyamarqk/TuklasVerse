import React from 'react';
import ReactPlayer from 'react-player';

interface AnimePlayerProps {
  videoUrl: string | null;
}

const AnimePlayer: React.FC<AnimePlayerProps> = ({ videoUrl }) => {
  if (!videoUrl) {
    return (
      <div className="bg-black flex items-center justify-center aspect-video rounded-lg">
        <p className="text-white text-lg">Loading video...</p>
      </div>
    );
  }

  return (
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
      <ReactPlayer
        url={videoUrl}
        width="100%"
        height="100%"
        controls
        playing={true}
        className="absolute top-0 left-0"
      />
    </div>
  );
};

export default AnimePlayer;
