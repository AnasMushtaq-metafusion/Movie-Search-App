import { useCallback, useEffect, useRef, useState } from "react";
import type { Movie, OmdbSearchResponse } from "../types/movie";

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const API_URL = "https://www.omdbapi.com/";
const RESULTS_PER_PAGE = 10;

interface UseMovieSearchResult {
  movies: Movie[];
  loading: boolean;
  error: string;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  totalResults: number;
  hasMore: boolean;
  search: (query: string) => void;
  loadMore: () => void;
}

/**
 * Encapsulates OMDB movie search state, fetching, pagination and
 * cancellation so it can be tested and reused independently of any UI.
 */
export function useMovieSearch(initialQuery = ""): UseMovieSearchResult {
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const activeQueryRef = useRef("");
  const abortControllerRef = useRef<AbortController | null>(null);

  const runSearch = useCallback(async (query: string, pageToFetch: number) => {
    abortControllerRef.current?.abort();

    if (!query.trim()) {
      abortControllerRef.current = null;
      activeQueryRef.current = "";
      setMovies([]);
      setError("");
      setTotalResults(0);
      setPage(1);
      return;
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;
    activeQueryRef.current = query;

    setLoading(true);
    setError("");

    if (!API_KEY) {
      setLoading(false);
      setError(
        "Missing OMDB API key. Set VITE_OMDB_API_KEY in your .env file.",
      );
      return;
    }

    try {
      const url = `${API_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&page=${pageToFetch}`;
      const response = await fetch(url, { signal: controller.signal });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data: OmdbSearchResponse = await response.json();

      if (data.Response === "True") {
        setMovies((prev) =>
          pageToFetch === 1 ? data.Search : [...prev, ...data.Search],
        );
        setTotalResults(Number.parseInt(data.totalResults, 10) || 0);
        setPage(pageToFetch);
      } else {
        if (pageToFetch === 1) {
          setMovies([]);
          setTotalResults(0);
        }
        setError(data.Error || "No movies found. Try a different search!");
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        // A newer search superseded this request; ignore silently.
        return;
      }

      console.error("Movie search failed:", err);
      if (pageToFetch === 1) {
        setMovies([]);
        setTotalResults(0);
      }
      setError("Something went wrong. Please try again.");
    } finally {
      if (abortControllerRef.current === controller) {
        setLoading(false);
      }
    }
  }, []);

  const search = useCallback(
    (query: string) => {
      void runSearch(query, 1);
    },
    [runSearch],
  );

  const loadMore = useCallback(() => {
    if (!activeQueryRef.current || loading) return;
    void runSearch(activeQueryRef.current, page + 1);
  }, [runSearch, page, loading]);

  const initialQueryRef = useRef(initialQuery);

  useEffect(() => {
    if (initialQueryRef.current) {
      void runSearch(initialQueryRef.current, 1);
    }
    return () => {
      abortControllerRef.current?.abort();
    };
  }, [runSearch]);

  const hasMore = movies.length < totalResults;

  return {
    movies,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    totalResults,
    hasMore,
    search,
    loadMore,
  };
}

export { RESULTS_PER_PAGE };
