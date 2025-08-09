// src/components/ContentCard.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ContentCardType } from 'types'; // Import your ContentCardType

interface ContentCardProps {
  card: ContentCardType;
}

const ContentCard: React.FC<ContentCardProps> = ({ card }) => {
  if (!card) {
    return null; // Don't render if card data is missing
  }

  // Determine the correct link based on content type
  let href = '';
  switch (card.type) {
    case 'anime':
    case 'movie':
    case 'tv-series':
      // For watchable content, link to a generic /watch page or a specific detail page
      // Assuming /anime/[id], /movie/[id], /tv-series/[id] as detail pages
      // Or you might have a single /watch/[id]?type=... page
      href = `/${card.type}/${card.id}`; // Example: /anime/123, /movie/456
      break;
    case 'manga':
      href = `/manga/${card.id}`; // Example: /manga/789
      break;
    case 'blog':
      href = `/blog/${card.id}`; // Example: /blog/abc
      break;
    case 'project':
      // For projects, link to an external project URL if available, otherwise a placeholder
      href = card.projectLink || '#'; // Use projectLink if provided, otherwise a dummy link
      break;
    default:
      href = `/${card.type}/${card.id}`; // Fallback for other types
      break;
  }

  // If it's a project and has an external link, use an <a> tag instead of <Link>
  const isExternalLink = card.type === 'project' && card.projectLink;
  const Wrapper = isExternalLink ? 'a' : Link;
  const linkProps = isExternalLink ? { href: href, target: "_blank", rel: "noopener noreferrer" } : { href: href };


  return (
    <Wrapper {...linkProps}>
      <div className="bg-[#3E2723] rounded-lg shadow-lg overflow-hidden h-full flex flex-col transform transition-transform duration-200 hover:scale-105">
        <div className="relative w-full" style={{ paddingBottom: '140%' }}> {/* Aspect ratio for posters */}
          <Image
            src={card.imageUrl || '/placeholders/default-poster.jpg'} // Fallback placeholder
            alt={card.title || 'Content Poster'}
            fill
            className="object-cover object-center"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
          />
          {card.score !== undefined && ( // Display score if available
            <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-[#FFD54F] text-xs font-bold px-2 py-1 rounded-full">
              ⭐ {card.score.toFixed(1)}
            </div>
          )}
        </div>
        <div className="p-3 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold text-[#FBE9E7] mb-1 truncate">{card.title}</h3>
          <p className="text-sm text-gray-400 mb-1 truncate">{card.genre}</p>
          <p className="text-xs text-gray-500">{card.year}</p>

          <div className="mt-2 text-xs text-gray-500">
            {card.type === 'anime' || card.type === 'tv-series' || card.type === 'movie' ? (
              card.episodes !== undefined && <span>{card.episodes} episodes</span>
            ) : card.type === 'manga' ? (
              <>
                {card.chapters !== undefined && <span>{card.chapters} chapters</span>}
                {card.chapters !== undefined && card.volumes !== undefined && <span> &bull; </span>}
                {card.volumes !== undefined && <span>{card.volumes} vols</span>}
              </>
            ) : card.type === 'project' && card.projectLink ? (
                <span className="text-[#2196F3] hover:underline">View Project</span>
            ) : null}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default ContentCard;