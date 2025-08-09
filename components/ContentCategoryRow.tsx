// src/components/ContentCategoryRow.tsx
import React from 'react';
import ContentCard from './ContentCard';
import { ContentCardType } from 'types';

interface ContentCategoryRowProps {
  title: string;
  cards: ContentCardType[];
}

const ContentCategoryRow: React.FC<ContentCategoryRowProps> = ({ title, cards }) => {
  if (!cards || !Array.isArray(cards)) {
    console.warn(`ContentCategoryRow: 'cards' prop is not a valid array for title "${title}". Skipping rendering.`);
    return (
        <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#FBE9E7] mb-4">{title}</h2>
            <p className="text-gray-400">No content available.</p>
        </section>
    );
  }

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold text-[#FBE9E7] mb-4">{title}</h2>
      <div className="flex space-x-6 overflow-x-auto pb-4 custom-scrollbar">
        {cards.map((card) => {
          if (!card) {
            console.warn(`ContentCategoryRow: Encountered an undefined card in row "${title}". Skipping.`);
            return null;
          }
          return (
            <div key={card.id || `${card.title}-${Math.random()}`} className="flex-none w-56">
              <ContentCard card={card} />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ContentCategoryRow;