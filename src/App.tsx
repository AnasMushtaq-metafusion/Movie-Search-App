import { useEffect } from "react";
import "./App.css";
import MovieCard from "./components/MovieCard";
import SearchBar from "./components/SearchBar";
import ErrorBoundary from "./components/ErrorBoundary";
import { useMovieSearch } from "./hooks/useMovieSearch";

function App() {
  const {
    movies,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    hasMore,
    search,
    loadMore,
  } = useMovieSearch();

  useEffect(() => {
    search("Spider-Man");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="app">
      <div className="header">
        <h1>
          <span className="emoji">🎬</span> MovieFlix
        </h1>
        <p className="subtitle">Discover your favorite movies</p>
      </div>

      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={search}
      />

      <div className="container">
        {loading && (
          <div className="loading" role="status" aria-live="polite">
            <div className="spinner"></div>
            <p>Searching for movies...</p>
          </div>
        )}

        {error && !loading && (
          <div className="error" role="alert" aria-live="assertive">
            <span className="emoji">😕</span>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && movies.length > 0 && (
          <>
            <div className="movies-grid">
              {movies.map((movie) => (
                <ErrorBoundary key={movie.imdbID}>
                  <MovieCard movie={movie} />
                </ErrorBoundary>
              ))}
            </div>

            {hasMore && (
              <div className="load-more">
                <button
                  type="button"
                  className="load-more-button"
                  onClick={loadMore}
                >
                  Load more
                </button>
              </div>
            )}
          </>
        )}

        {!loading && !error && movies.length === 0 && !searchTerm && (
          <div className="empty-state">
            <span className="emoji">🍿</span>
            <p>Start searching for your favorite movies!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
