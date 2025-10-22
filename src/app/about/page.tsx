// pages/about.tsx (or app/about/page.tsx)
"use client";

import React from 'react';
import Image from 'next/image';
import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa';

const AboutMePage: React.FC = () => {

    const socialLinks = [
    { name: 'Facebook', url: 'https://www.facebook.com/marqk051209', icon: <FaFacebookF size={20} /> },
    { name: 'Instagram', url: 'https://www.instagram.com/kuyamarqk/', icon: <FaInstagram size={20} /> },
    { name: 'TikTok', url: 'https://www.tiktok.com/@kuyamarqk', icon: <FaTiktok size={20} /> },
  ];
  
  return (
    <div className="container mx-auto py-12 px-4 text-[#3E2723]"> {/* Dark Neutral text on Light Neutral body background */}
      
      {/* Title */}
      <h1 className="text-4xl font-bold my-10 text-center text-[#3E2723]">About TuklasVerse & Me</h1>

      {/* Main Content Container: Two-Column Layout on larger screens */}
      <div className="flex flex-col lg:flex-row lg:space-x-12">
        
        {/* Left Column: Profile Card */}
        <aside className="lg:w-1/3 mb-8 lg:mb-0">
          <div className="bg-[#EFEBE9] p-6 rounded-xl shadow-lg border-t-4 border-[#2196F3]"> {/* Slightly lighter background for the card */}
            
            {/* Profile Picture (Using next/image) */}
            <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden mb-4 border-4 border-[#3E2723]">
              <Image
                src="/profile_picture.png" // ⭐ Replace with your actual image path
                alt="Profile Picture of the TuklasVerse Creator"
                fill
                className="object-cover"
                sizes="128px"
              />
            </div>
            
            <h2 className="text-2xl font-semibold text-center mb-2">The Creator</h2>
            <p className="text-center text-sm text-gray-600 mb-4">Content Curator & Enthusiast</p>

            <div className="text-center">
              <a 
                href="mailto:raymart.maqueda@gmail.com" 
                className="inline-block px-4 py-2 bg-[#2196F3] text-[#FBE9E7] rounded-md hover:bg-[#1A7BC2] transition-colors duration-200 text-sm"
              >
                Get in Touch
              </a>
            </div>

            <hr className="my-6 border-gray-300" />
            
            <p className="text-sm italic text-gray-700 text-center">
              "Tuklas" means "discover" in Filipino. My mission is to help you discover your next obsession!
            </p>
          </div>
        </aside>

        {/* Right Column: Narrative Content */}
        <main className="lg:w-2/3 space-y-8">

          {/* Section 1: Introduction - UPDATED HERE */}
          <section className="p-8 bg-[#FBE9E7] rounded-xl shadow-md">
            <h2 className="text-3xl font-semibold mb-4 text-[#3E2723]">Welcome to TuklasVerse!</h2>
            <p className="mb-4 leading-relaxed">
              TuklasVerse was born out of a genuine passion for storytelling, focusing currently on the **cinematic grandeur of Movies and the intricate narratives of TV Series**. This platform is a personal curated space, a digital haven where fellow enthusiasts can dive deep into reviews, discussions, and organized content for the best in global cinema and television.
            </p>
            <p className="leading-relaxed">
              Every recommendation and review is designed to help you decide what to watch next. While we're currently focused on movies and TV, we plan to expand our "Verse" to include **Anime and Manga** in the near future!
            </p>
          </section>

          {/* Section 2: Our Mission (Tuklas = Discover) */}
          <section className="p-8 bg-[#EFEBE9] rounded-xl shadow-md">
            <h2 className="text-3xl font-semibold mb-4 text-[#3E2723]">Our Mission & Vision</h2>
            
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-[#2196F3]">Mission: To Discover</h3>
              <p className="leading-relaxed">
                To simplify the overwhelming world of cinema and television. Our mission is to help you easily **discover** your next favorite Movie or TV Series through intuitive search, detailed categorization, and honest, user-centric reviews.
              </p>
              
              <h3 className="text-xl font-medium text-[#2196F3]">Vision: To Connect</h3>
              <p className="leading-relaxed">
                We envision a global community where fans connect, share their passions, and contribute their own unique perspectives, making TuklasVerse the definitive starting point for all things entertainment.
              </p>
            </div>
          </section>

          {/* Section 3: Call to Action / Blog */}
          <section className="p-8 bg-[#FBE9E7] rounded-xl shadow-md">
            <h2 className="text-3xl font-semibold mb-6 text-[#3E2723]">Connect with Us</h2>
            <p className="mb-6 leading-relaxed">
              Follow us on social media for daily updates, behind-the-scenes content, and more discussions on the latest movies and TV series!
            </p>
            
            <div className="flex justify-start space-x-6">
              {socialLinks.map((link) => (
                // ⭐ EXTERNAL LINKS: Keep as standard <a> tags with target="_blank"
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 flex items-center justify-center bg-[#3E2723] text-[#FBE9E7] text-lg rounded-full hover:bg-[#2196F3] transition-colors duration-200 shadow-md"
                  aria-label={`Follow us on ${link.name}`}
                >
                  {link.icon} 
                </a>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AboutMePage;