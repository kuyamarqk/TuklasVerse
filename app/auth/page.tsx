"use client";

import { useState, useMemo, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import Image from "next/image";

const BACKGROUND_IMAGES = [
  "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1425&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1470&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1447&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1494&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1574267431647-c82eca203e91?q=80&w=1631&auto=format&fit=crop"  
];

export default function AuthPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // 1. Initialize backdrop state as null to prevent hydration mismatch errors
  const [randomBackdrop, setRandomBackdrop] = useState<string | null>(null);

  // 2. Safely compute the random image selection in an effect block after mounting
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * BACKGROUND_IMAGES.length);
    setRandomBackdrop(BACKGROUND_IMAGES[randomIndex]);
  }, []);

  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
      router.push("/");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex text-zinc-100">
      
      {/* LEFT COLUMN: RANDOM CINEMATIC ARTWORK DISPLAY */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-950 items-end p-12 overflow-hidden group">
        <div className="absolute inset-0 z-0">
          {/* Only render image tag when state has resolved on the client */}
          {randomBackdrop && (
            <Image
              src={randomBackdrop}
              alt="Cinematic Universe Backdrop"
              className="w-full h-full object-cover opacity-40 scale-100 group-hover:scale-105 transition-transform duration-10000 ease-out"
            />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0f] via-transparent to-transparent opacity-90" />
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-[#0a0a0f]" />
        </div>
        
        <div className="relative z-10 max-w-md space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-violet-400 bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20">
            Now Streaming
          </span>
          <h2 className="text-4xl font-black tracking-tight leading-none text-white drop-shadow-md">
            Discover Unlimited Entertainment.
          </h2>
          <p className="text-sm text-zinc-400 drop-shadow">
            Track, watchlist, and sync your favorite high-definition movie streams directly across your personalized media space.
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN: INTERFACE CONTAINER */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-violet-600/10 blur-[100px] pointer-events-none" />

        <div className="w-full max-w-sm relative z-10">
          {/* BRANDING HEADER */}
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/10 shadow-lg shadow-violet-950/30 mb-3">
              <Image
                src="/icon.png"
                alt="TuklasVerse Logo"
                width={48}
                height={48}
                priority
                className="object-cover w-full h-full"
              />
            </div>
            <h1 className="text-3xl font-black tracking-tight bg-linear-to-r from-zinc-100 via-zinc-200 to-zinc-400 bg-clip-text text-transparent mb-1">
              TuklasVerse
            </h1>
            <p className="text-sm text-white/40">Your personal media universe</p>
          </div>

          {/* FORM SHELL */}
          <div className="bg-white/3 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/40">
            <h2 className="text-xl font-bold mb-5 tracking-tight text-white">
              {isSignUp ? "Create your account" : "Welcome back"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 text-sm text-white placeholder:text-white/20 focus:border-violet-500 outline-none focus:ring-1 focus:ring-violet-500/30 transition-all"
                    placeholder="Raymart Maqueda"
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 text-sm text-white placeholder:text-white/20 focus:border-violet-500 outline-none focus:ring-1 focus:ring-violet-500/30 transition-all"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 text-sm text-white placeholder:text-white/20 focus:border-violet-500 outline-none focus:ring-1 focus:ring-violet-500/30 transition-all"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-3.5 py-2.5">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold shadow-lg shadow-violet-600/20 active:scale-[0.99] transition-all mt-2"
              >
                {loading
                  ? isSignUp
                    ? "Creating account..."
                    : "Signing in..."
                  : isSignUp
                  ? "Create free account"
                  : "Sign in to account"}
              </button>
            </form>

            <p className="text-center text-xs text-white/30 mt-5">
              {isSignUp ? "Already have an account?" : "New to the platform?"}{" "}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError("");
                }}
                className="text-violet-400 hover:text-violet-300 font-medium underline underline-offset-4 decoration-violet-500/30 hover:decoration-violet-400 transition-colors"
              >
                {isSignUp ? "Sign in" : "Create one"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}