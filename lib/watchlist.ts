"use client";

import { SupabaseClient } from "@supabase/supabase-js";

export type WatchlistItem = {
  id: string;
  tmdb_id: number;
  user_id: string;
  media_type: "movie" | "tv";
  title: string;
  poster_path: string | null;
  added_at: string;
};

export async function getWatchlist(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("watchlist")
    .select("*")
    .order("added_at", { ascending: false });

  if (error) throw error;
  return data as WatchlistItem[];
}

export async function addToWatchlist(
  supabase: SupabaseClient,
  item: Omit<WatchlistItem, "id" | "added_at">
) {
  const { error } = await supabase.from("watchlist").insert(item);
  if (error) throw error;
}

export async function removeFromWatchlist(
  supabase: SupabaseClient,
  tmdbId: number,
  mediaType: "movie" | "tv"
) {
  const { error } = await supabase
    .from("watchlist")
    .delete()
    .eq("tmdb_id", tmdbId)
    .eq("media_type", mediaType);
  if (error) throw error;
}

export async function isInWatchlist(
  supabase: SupabaseClient,
  tmdbId: number,
  mediaType: "movie" | "tv"
) {
  const { data } = await supabase
    .from("watchlist")
    .select("id")
    .eq("tmdb_id", tmdbId)
    .eq("media_type", mediaType)
    .maybeSingle();

  return !!data;
}

export async function addToHistory(
  supabase: SupabaseClient,
  item: Omit<WatchlistItem, "id" | "added_at">
) {
  const { error } = await supabase.from("watch_history").upsert(
    { ...item, watched_at: new Date().toISOString() },
    { onConflict: "user_id, tmdb_id, media_type" }
  );
  if (error) throw error;
}

export async function getWatchHistory(supabase: SupabaseClient, limit = 10) {
  const { data, error } = await supabase
    .from("watch_history")
    .select("*")
    .order("watched_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as WatchlistItem[];
}