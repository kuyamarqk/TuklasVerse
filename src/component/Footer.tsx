'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-[#FBE9E7] border-t border-[#3E2723] mt-12">
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
        <div className="flex gap-6">
          <Link href="/about" className="hover:text-[#FFAB91] transition">About</Link>
          <Link href="/privacy" className="hover:text-[#FFAB91] transition">Privacy</Link>
          <Link href="/terms" className="hover:text-[#FFAB91] transition">Terms</Link>
        </div>
        <div className="text-xs text-[#BCAAA4]">
          &copy; {new Date().getFullYear()} TuklasVerse. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
