// src/components/RelatedContent.tsx

import React from 'react';
import ContentCard from './ContentCard'; // Ensure this path is correct
import { ContentCardType } from 'types'; // Centralized shared type

interface RelatedContentProps {
  title: string;
  content: ContentCardType[];
}

const RelatedContent: React.FC<RelatedContentProps> = ({ title, content }) => {
  if (!content || content.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-[#FBE9E7] mb-4">
        {title}
      </h2>
      <div className="flex space-x-4 overflow-x-auto pb-4 custom-scrollbar">
        {content.map((card) => (
          <div key={card.id} className="flex-none w-48 sm:w-56 md:w-64">
            <ContentCard card={card} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedContent;
