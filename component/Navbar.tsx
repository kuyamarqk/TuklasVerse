"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Bookmark, Home, LogOut, LogIn } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
    router.refresh();
  };

  const links = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/search", icon: Search, label: "Search" },
    { href: "/watchlist", icon: Bookmark, label: "My List" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
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

        <div className="flex items-center gap-1">
          {links.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href;
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
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}

          <div className="h-4 w-px bg-white/10 mx-2 hidden sm:block" />

          {loading ? (
            <div className="w-20 h-8 bg-white/5 animate-pulse rounded-lg hidden sm:block" />
          ) : user ? (
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-white/50 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200 cursor-pointer"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Sign out</span>
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
      </div>
    </nav>
  );
}