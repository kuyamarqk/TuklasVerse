// component/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Bookmark, Home, LogOut, LogIn, Menu, X, Flame, LayoutGrid } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  );

  useEffect(() => {
    const getUserSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getUserSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setMenuOpen(false);
    router.push("/auth");
    router.refresh();
  };

  const links = [
    { href: "/", icon: Home, label: "Home" },
    
    { href: "/watchlist", icon: Bookmark, label: "My List" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group" onClick={() => setMenuOpen(false)}>
          <div className="relative w-7 h-7 rounded-lg overflow-hidden border border-white/10 group-hover:border-violet-500/50 transition-colors shadow-md shadow-violet-950/20">
            <Image
              src="/icon.png"
              alt="TuklasVerse Logo"
              width={28}
              height={28}
              priority
              className="object-cover w-full h-full scale-105 group-hover:scale-110 transition-transform duration-300"
            />
          </div>

          <span className="text-xl font-bold tracking-tight bg-linear-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent group-hover:from-white group-hover:to-violet-400 transition-all duration-300">
            TuklasVerse
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href.split("#")[0];
            const linkClass = isActive
              ? "bg-white/10 text-white"
              : "text-white/50 hover:text-white hover:bg-white/5";

            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${linkClass}`}
              >
                <Icon size={15} />
                <span>{label}</span>
              </Link>
            );
          })}

          <Link
            href="/search"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              pathname === "/search"
                ? "bg-white/10 text-white"
                : "text-white/50 hover:text-white hover:bg-white/5"
            }`}
          >
            <Search size={15} />
            <span>Search</span>
          </Link>

          <div className="h-4 w-px bg-white/10 mx-2" />

          {loading ? (
            <div className="w-20 h-8 bg-white/5 animate-pulse rounded-lg" />
          ) : user ? (
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-white/50 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200 cursor-pointer"
            >
              <LogOut size={15} />
              <span>Sign out</span>
            </button>
          ) : (
            <Link
              href="/auth"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-all duration-200 cursor-pointer shadow-lg shadow-violet-600/20"
            >
              <LogIn size={15} />
              <span>Sign In</span>
            </Link>
          )}
        </div>

        {/* Mobile controls: Search stays visible, hamburger holds the rest */}
        <div className="md:hidden flex items-center gap-1">
          <Link
            href="/search"
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-center w-9 h-9 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Search"
          >
            <Search size={19} />
          </Link>

          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex items-center justify-center w-9 h-9 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-white/5 ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-3 flex flex-col gap-1 bg-[#0a0a0f]/95 backdrop-blur-md">
          {links.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href.split("#")[0];
            const linkClass = isActive
              ? "bg-white/10 text-white"
              : "text-white/60 hover:text-white hover:bg-white/5";

            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${linkClass}`}
              >
                <Icon size={17} />
                <span>{label}</span>
              </Link>
            );
          })}

          <div className="h-px w-full bg-white/10 my-1" />

          {loading ? (
            <div className="w-full h-10 bg-white/5 animate-pulse rounded-lg" />
          ) : user ? (
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200 cursor-pointer"
            >
              <LogOut size={17} />
              <span>Sign out</span>
            </button>
          ) : (
            <Link
              href="/auth"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-all duration-200 cursor-pointer shadow-lg shadow-violet-600/20"
            >
              <LogIn size={17} />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}