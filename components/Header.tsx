'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Dropdown from './Dropdown';
import { Menu, X } from 'lucide-react'; // optional icon library

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCategoryClick = (categoryName: string) => {
    console.log(`Navigating to category: ${categoryName}`);
    setMobileMenuOpen(false); // close mobile menu on selection
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  return (
    <header className="bg-[#3E2723] w-full px-4 py-3">
      {/* Top bar */}
      <div className="max-w-7xl mx-auto flex justify-between items-center relative">
        {/* Logo - centered on mobile */}
        <div className="flex-1 flex justify-center md:justify-start">
          <Link href="/home">
            <span className="text-2xl font-bold text-white cursor-pointer">TuklasVerse</span>
          </Link>
        </div>

        {/* Hamburger toggle (mobile only) */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="text-white focus:outline-none">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-white ml-auto">
          <Link href="/home" className="hover:text-[#2196F3]">Home</Link>
          <Link href="/blog" className="hover:text-[#2196F3]">Blog</Link>
          <Link href="/about-me" className="hover:text-[#2196F3]">About Me</Link>

          <Dropdown buttonText="Categories">
            <Link href="/anime" onClick={() => handleCategoryClick('Anime')} role="menuitem"
              className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100">Anime</Link>
            <Link href="/movie" onClick={() => handleCategoryClick('Movies')} role="menuitem"
              className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100">Movies</Link>
            <Link href="/tv-series" onClick={() => handleCategoryClick('TV - Series')} role="menuitem"
              className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100">TV - Series</Link>
            <Link href="/manga" onClick={() => handleCategoryClick('Manga')} role="menuitem"
              className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100">Manga</Link>
          </Dropdown>

          <Link href="/dashboard/profile">
            <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-sm font-medium text-white cursor-pointer">
              User
            </div>
          </Link>
        </nav>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 space-y-4 text-white px-2">
          <Link href="/home" onClick={() => setMobileMenuOpen(false)} className="block hover:text-[#2196F3]">Home</Link>
          <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="block hover:text-[#2196F3]">Blog</Link>
          <Link href="/about-me" onClick={() => setMobileMenuOpen(false)} className="block hover:text-[#2196F3]">About Me</Link>

          <div className="mt-2">
            <p className="text-sm text-gray-300 mb-1">Categories</p>
            <Link href="/anime" onClick={() => handleCategoryClick('Anime')} className="block text-sm text-gray-200 hover:text-[#2196F3]">Anime</Link>
            <Link href="/movie" onClick={() => handleCategoryClick('Movies')} className="block text-sm text-gray-200 hover:text-[#2196F3]">Movies</Link>
            <Link href="/tv-series" onClick={() => handleCategoryClick('TV - Series')} className="block text-sm text-gray-200 hover:text-[#2196F3]">TV - Series</Link>
            <Link href="/manga" onClick={() => handleCategoryClick('Manga')} className="block text-sm text-gray-200 hover:text-[#2196F3]">Manga</Link>
          </div>

          <Link href="/dashboard/profile" className="block mt-4">
            <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-sm font-medium text-white">
              User
            </div>
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
