

import React from 'react'; // Make sure React is imported for React.use()

import Link from 'next/link';



// Dummy data for an episode to display on the watch page

interface WatchEpisodeData {

  id: number;

  animeTitle: string; // The title of the anime

  episodeNumber: number;

  episodeTitle: string;

  videoUrl: string; // A placeholder for the video source

}



// Mock function to get episode details

const getEpisodeDetails = (id: number): WatchEpisodeData | undefined => {

  if (id === 1) {

    return {

      id: 1,

      animeTitle: 'Attack on Titan Season 4 Part 3',

      episodeNumber: 1,

      episodeTitle: 'The Other Side of the Sea',

      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',

    };

  }

  if (id === 2) {

    return {

        id: 2,

        animeTitle: 'Attack on Titan Season 4 Part 3',

        episodeNumber: 2,

        episodeTitle: 'Midnight Train',

        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',

    };

  }

  return undefined;

};



interface WatchPageProps {

  params: {

    id: string; // The dynamic segment from the URL

  };

}



const WatchPage: React.FC<WatchPageProps> = ({ params }) => {

  // ⭐ IMPORTANT CHANGE: Unwrap params using React.use()

  // We explicitly wrap params in Promise.resolve() to ensure React.use()

  // always receives a Promise to unwrap, preventing the "uncached promise" error

  // that can occur if params is sometimes already resolved directly.

  const episodeId = parseInt(params.id, 10);



  const episode = getEpisodeDetails(episodeId);



  if (!episode) {

    // In a real app, you might use Next.js's notFound() for a 404 page

    // import { notFound } from 'next/navigation';

    // notFound();

    return (

      <div className="min-h-screen flex flex-col items-center justify-center text-[#FBE9E7] bg-[#3E2723]">

        <p className="text-xl">Episode not found.</p>

      </div>

    );

  }



  return (

    <div className="flex flex-col min-h-screen bg-[#212121]">

      

      <main className="flex-grow container mx-auto py-8 px-4 text-[#FBE9E7]">

        {/* Breadcrumbs */}

        <div className="mb-6 text-sm text-gray-400">

          <Link href="/" className="hover:underline">Home</Link> &gt;

          <Link href="/anime/1" className="hover:underline">{episode.animeTitle}</Link> &gt;

          <span> Episode {episode.episodeNumber}</span>

        </div>



        <h1 className="text-3xl font-bold text-[#FBE9E7] mb-4">

          {episode.animeTitle} - Episode {episode.episodeNumber}: {episode.episodeTitle}

        </h1>



        {/* Video Player Placeholder */}

        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden mb-8">

          <video

            controls

            autoPlay

            className="w-full h-full object-contain"

            src={episode.videoUrl}

            poster="/placeholders/video-poster.jpg"

          >

            Your browser does not support the video tag.

          </video>

        </div>



        {/* Basic description or next episode controls can go here */}

        <div className="bg-[#3E2723] p-6 rounded-lg shadow-md">

          <h3 className="text-xl font-semibold text-[#FBE9E7] mb-4">About This Episode</h3>

          <p className="text-gray-200">

            You are currently watching Episode {episode.episodeNumber} of {episode.animeTitle}.

            Enjoy the show!

          </p>

        </div>

      </main>

      

    </div>

  );

};



export default WatchPage;