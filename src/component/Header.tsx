'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#212121] shadow-md py-2' : 'bg-[#212121] py-4'
      } border-b border-[#3E2723]`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 hover:text-[#FFAB91] transition duration-300"
        >
          <Image
            src="/icon.png"
            alt="TuklasVerse Logo"
            width={24}
            height={24}
            className="transition-transform duration-300 hover:scale-110"
          />
          <span className="text-xl font-bold tracking-wide">TuklasVerse</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 text-sm text-[#FBE9E7]">
          <Link href="/movie" className="hover:text-[#FFAB91] transition">Movies</Link>
          <Link href="/tv" className="hover:text-[#FFAB91] transition">TV Shows</Link>
          <Link href="/about" className="hover:text-[#FFAB91] transition">About</Link>
        </nav>

        {/* Search Toggle (Desktop) */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 rounded-md hover:bg-[#1a1a1a] transition"
            aria-label="Toggle search"
          >
            <MagnifyingGlassIcon className="h-5 w-5 text-[#FBE9E7]" />
          </button>

          {showSearch && (
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies..."
              className="px-4 py-2 rounded-md bg-[#1a1a1a] text-[#FBE9E7] border border-[#333] focus:outline-none focus:border-[#FF8A65] w-64 transition-all duration-300"
            />
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-[#FBE9E7] transition-transform duration-300 ease-in-out"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <div className="relative w-6 h-6">
            <Bars3Icon
              className={`absolute inset-0 h-6 w-6 transform transition duration-300 ease-in-out ${
                isOpen ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
              }`}
            />
            <XMarkIcon
              className={`absolute inset-0 h-6 w-6 transform transition duration-300 ease-in-out ${
                isOpen ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-90 rotate-45'
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed top-16 right-0 w-2/3 max-w-xs h-full bg-[#1a1a1a] border-l border-[#3E2723] px-6 py-8 text-sm text-[#FBE9E7] transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <nav className="space-y-6">
          <Link href="/movie" className="block hover:text-[#FFAB91]" onClick={() => setIsOpen(false)}>Movies</Link>
          <Link href="/tv" className="block hover:text-[#FFAB91]" onClick={() => setIsOpen(false)}>TV Shows</Link>
          <Link href="/about" className="block hover:text-[#FFAB91]" onClick={() => setIsOpen(false)}>About</Link>
        </nav>

        {/* Mobile Search (Always Visible) */}
        <div className="mt-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search movies..."
            className="w-full px-4 py-2 rounded-md bg-[#1a1a1a] text-[#FBE9E7] border border-[#333] focus:outline-none focus:border-[#FF8A65]"
          />
        </div>
      </div>
    </header>
  );
}
